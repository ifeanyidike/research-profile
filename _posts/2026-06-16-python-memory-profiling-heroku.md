---
layout: post
title: "Profiling Python Memory in Production on Heroku (and What We Found)"
date: 2026-06-16 00:00:00-0000
description: We profiled two FastAPI services hitting Heroku memory limits. memray showed a HuggingFace tokenizer loading 152MB per worker — three times over. The fix was switching from uvicorn's spawn to gunicorn's fork with --preload.
tags: python engineering infrastructure
categories: engineering
related_posts: false
---

## TL;DR

- Two FastAPI services kept hitting Heroku's memory quota (R14 errors) and restarting under load.
- We profiled in production using [memray](https://github.com/bloomberg/memray) — hooked into live dynos using signal handlers, no restart needed.
- The flamegraph showed a HuggingFace BLOOM tokenizer eating ~152MB _per worker process_, loaded three times because `uvicorn --workers 3` uses `spawn` (fresh interpreter per worker, no memory sharing).
- Switching to `gunicorn --preload` with uvicorn workers gave us `fork`-based workers with Linux copy-on-write sharing. The tokenizer loaded once. Memory dropped over 70%.
- A background worker that _never uses_ the tokenizer was also loading it — through an import chain. One import change saved another 152MB.

---

## The problem

We had two FastAPI services running on Heroku. Both were growing in memory under load, hitting the quota, and restarting in the middle of requests. We had theories but no data. Is it a leak? A cache that never evicts? Something loading at import time?

Without a profile, you're guessing.

---

## Why memray

A few Python memory profilers exist. `tracemalloc` is in the standard library and tracks allocations over time, but it only sees Python-level allocations. Anything happening inside a C extension or a Rust-backed library is invisible to it. `memory_profiler` gives you line-by-line results but requires decorating functions ahead of time and also misses native code.

[memray](https://github.com/bloomberg/memray) is Bloomberg's open-source profiler. It tracks both Python and native (C/Rust) allocations, so you see the full call stack — numpy, PyTorch, HuggingFace internals, all of it. It gives you flamegraphs, timeline views, and live reports. And it can attach to a running process with a Unix signal, no restart needed.

That last part is what made it viable for us.

---

## Setting up memray on a live dyno

We added signal handlers to start and stop profiling on demand:

```python
import memray
import signal

_tracker = None

def _start_memray(signum, frame):
    global _tracker
    if _tracker is None:
        _tracker = memray.Tracker("/tmp/memray.bin", follow_fork=True)
        _tracker.__enter__()

def _stop_memray(signum, frame):
    global _tracker
    if _tracker:
        _tracker.__exit__(None, None, None)
        _tracker = None

signal.signal(signal.SIGUSR1, _start_memray)
signal.signal(signal.SIGUSR2, _stop_memray)
```

To trigger on a specific dyno:

```bash
# Start profiling
heroku ps:exec --dyno=web.1 -- kill -USR1 $(pgrep -f gunicorn | head -1)

# ... let real traffic flow ...

# Stop profiling
heroku ps:exec --dyno=web.1 -- kill -USR2 $(pgrep -f gunicorn | head -1)
```

`follow_fork=True` tells memray to track child processes created by `os.fork()`. This matters when you're running gunicorn — more on that below.

One detail that bit us: avoid `--aggregate` mode. It buffers the entire profile in memory and only writes when the tracker exits. Under heavy traffic, this can use up memory on its own. The default streaming mode writes to disk continuously.

---

## Getting the file off Heroku

This was harder than the profiling itself.

Our memray output was around 92MB uncompressed. On a normal server you'd `scp` it. On Heroku there's no direct file access — everything goes through `heroku ps:exec`, which pipes through an SSH-over-HTTPS tunnel.

That tunnel has a buffer limit of roughly 1.2MB per session. We tried piping the full file and got what looked like a complete transfer — but the file was silently truncated and corrupted. We only found out when `memray flamegraph` failed to parse it.

The fix: compress on the dyno first, then transfer in chunks using `dd` and `base64`, one piece at a time, with retries.

```bash
#!/bin/bash
set -euo pipefail

APP="your-heroku-app"
DYNO="web.1"
CHUNK_SIZE=750000   # 750KB binary → ~1MB base64, under the limit
MAX_RETRIES=5

# Compress on the dyno (reuse if already done)
heroku ps:exec --app "$APP" --dyno "$DYNO" -- \
    bash -c "if [ ! -f /tmp/memray.bin.gz ]; then \
    gzip -kfc /tmp/memray.bin > /tmp/memray.bin.gz; fi" || true

# Get file size
FILE_SIZE=$(heroku ps:exec --app "$APP" --dyno "$DYNO" -- \
    wc -c < /tmp/memray.bin.gz 2>/dev/null | tr -d ' \n') || true

TOTAL_CHUNKS=$(( (FILE_SIZE + CHUNK_SIZE - 1) / CHUNK_SIZE ))
OUTPUT_FILE="memray_$(date +%s).bin.gz"

for i in $(seq 0 $((TOTAL_CHUNKS - 1))); do
    OFFSET=$((i * CHUNK_SIZE))
    ATTEMPT=0
    SUCCESS=false

    while [ $ATTEMPT -lt $MAX_RETRIES ]; do
        CHUNK=$(heroku ps:exec --app "$APP" --dyno "$DYNO" -- \
            dd if=/tmp/memray.bin.gz bs=1 skip=$OFFSET \
            count=$CHUNK_SIZE 2>/dev/null \
            | base64) || true

        BYTES=$(echo "$CHUNK" | base64 --decode | wc -c)

        if [ "$BYTES" -gt 0 ]; then
            echo "$CHUNK" | base64 --decode >> "$OUTPUT_FILE"
            SUCCESS=true
            break
        fi

        ATTEMPT=$((ATTEMPT + 1))
        sleep 5
    done

    if [ "$SUCCESS" = false ]; then
        echo "Chunk $i failed after $MAX_RETRIES attempts"
        exit 1
    fi
done

gunzip "$OUTPUT_FILE"
```

A few gotchas that cost us time:

**`set -euo pipefail` kills your script silently.** `heroku ps:exec` occasionally returns a non-zero exit code for random connection drops. With strict error mode on, the script terminates mid-transfer with no output. Add `|| true` to every heroku command that feeds into a variable.

**Dyno pinning matters.** Heroku routes `ps:exec` sessions like any other connection. You can end up on a different dyno between chunk transfers. If the gzip ran on `web.1` but a later chunk is fetched from `web.2`, you get 0 bytes. Pin every command with `--dyno web.1`.

**Reuse the compressed file.** Gzipping a 92MB file takes long enough to hit the SSH session timeout. Run it once, check if the `.gz` exists before re-running, and reuse it.

Once all chunks are assembled locally:

```bash
memray flamegraph memray.bin -o profile.html
open profile.html
```

---

## What the flamegraph showed

The result was clear. A HuggingFace BLOOM tokenizer (`bigscience/bloomz-560m`) was at the top of the allocation tree, eating ~152MB per worker. It was loading at module import time — not lazily on first use, but as a side effect of the module being imported.

That 152MB is roughly 96MB for the tokenizer object (the fast tokenizer backed by HuggingFace's Rust `tokenizers` library) and 55MB for the vocabulary JSON. All of this happens before the application handles a single request.

The question: why does each worker have its own copy?

---

## spawn vs fork

The services were running:

```bash
uvicorn main:app --workers 3
```

What most people don't realize is that uvicorn's `--workers` flag uses Python's `multiprocessing.spawn` to create worker processes. Spawn starts a fresh Python interpreter for each worker. It doesn't inherit the parent's memory. It reimports the application from scratch. Every worker loads every module independently.

The math: 3 workers × ~490MB = ~1.47GB, with zero sharing. The tokenizer alone: 152MB × 3 = 456MB.

`os.fork()` works differently on Linux. When you fork, the child initially shares all of the parent's physical memory pages. The kernel uses copy-on-write — pages are only copied when either process writes to them. Read-only data (imported modules, loaded model weights, the tokenizer) is never copied. It stays shared across all workers.

The first question you'd ask is: why not just lazy-load the tokenizer? We actually tried that earlier. Two problems. First, on Heroku you're already close to the memory limit. When the tokenizer loads mid-request, that 152MB spike happens while the worker is already holding memory for the request itself, and it pushes past the quota before the task finishes. Second, loading a 152MB tokenizer takes long enough to blow past Heroku's 30-second request timeout. The first request that triggers the load just dies. Loading at startup is predictable — you pay the cost once, before any user is waiting. Loading mid-request means the first unlucky user gets either an R14 or a timeout.

---

## The fix: gunicorn with --preload

Gunicorn supports both spawn and fork. With `--preload`, it loads the entire application in the master process before forking workers:

```bash
gunicorn main:app \
    -k uvicorn.workers.UvicornWorker \
    --preload \
    --workers 3 \
    -c gunicorn.conf.py
```

`-k uvicorn.workers.UvicornWorker` gives us uvicorn's async request handling. `--preload` gives us fork-based workers with copy-on-write sharing. The tokenizer loads once in the master, and all three workers reference the same physical pages — 152MB total instead of 456MB.

We also added `--max-requests 1000 --max-requests-jitter 100` to recycle workers after 1000 requests (with some randomness to avoid a thundering herd of simultaneous restarts). This keeps memory from slowly creeping up in long-running workers.

---

## The post_fork hook

`--preload` has one requirement: anything that holds a socket, thread, or connection must be reset after forking. Those resources can't be shared between processes. Database connection pools and SDK clients are the common ones.

```python
# gunicorn.conf.py
import logging
import os
from dotenv import load_dotenv

load_dotenv()

def post_fork(server, worker):
    # Reset SQLAlchemy connection pool — sockets can't be shared post-fork
    from myapp.core import engine
    if engine:
        engine.dispose()

    # Reinitialize Sentry per-worker
    import sentry_sdk
    from sentry_sdk.integrations.logging import LoggingIntegration
    sentry_sdk.init(
        dsn=os.getenv("SENTRY_DSN"),
        environment=os.getenv("APP_ENV", "dev"),
        integrations=[
            LoggingIntegration(
                level=logging.INFO,
                event_level=logging.ERROR,
            ),
        ],
        traces_sample_rate=1.0,
    )

def worker_exit(server, worker):
    from myapp.core import engine
    if engine:
        engine.dispose()
```

A note on Sentry's `LoggingIntegration`: the default `level=None` silently turns off the logging hook. Even `event_level=logging.ERROR` won't capture error-level logs. Set `level=logging.INFO` explicitly.

---

## Results

Memory dropped over 70% after the switch. R14 errors stopped. The services run within quota under normal load, and adding more workers is way cheaper than before — you're only paying for memory that actually gets written during request handling, not the shared read-only stuff.

---

## macOS gotcha: SIGSEGV with --preload

If you try this locally on macOS with HuggingFace models, you'll likely get a `SIGSEGV` crash on worker fork.

HuggingFace's fast tokenizers are backed by a Rust library (`tokenizers`) that uses Rayon for parallelism. Rayon spawns a thread pool when first used. When gunicorn forks after `--preload`, those Rayon threads exist in the parent but not the child. On macOS, `fork()` combined with active Rust thread pools produces undefined behavior — usually a segfault.

This is a known macOS limitation. macOS's `fork()` is stricter about thread state than Linux's. The same setup works fine on Linux (including Heroku).

For local development: test with Docker using a Linux base image. You can verify the gunicorn setup works without pushing to staging for every change.

---

## Bonus: watch your import chains

After fixing the web workers, a background worker (we use RQ for async job processing) was still hitting R14 — sitting at ~517MB on a 512MB dyno.

This worker never uses the tokenizer. It processes queued jobs that have nothing to do with the ML model.

The problem was an import chain:

```
worker.py
  → from shared_lib import ServiceA, ServiceB
  → shared_lib/__init__.py imports all services
  → services/__init__.py imports MLService
  → ml_service.py calls load_tokenizer() at module level   ← 152MB
```

The tokenizer was loading at every worker startup, for a process that never needed it.

The fix:

```python
# Before
from shared_lib import ServiceA, ServiceB   # pulls in everything

# After
from shared_lib.services.service_a import ServiceA
from shared_lib.services.service_b import ServiceB
```

One import change. 152MB gone from a process that never needed it.

---

## Bonus 2: DOCX template caching

Another win came from report generation. We had an endpoint that generates DOCX reports using `python-docx` and `docxtpl`. Every request was re-parsing the template file from disk — a 56MB C-level XML parse through `lxml`, every single time.

The obvious fix is to cache the parsed `Document` object and reuse it. But there's a gotcha that took a while to figure out.

You can't just `deepcopy(DocxTemplate)`. It causes infinite recursion. The reason: `DocxTemplate.__getattr__` delegates attribute lookups to `self.docx`, and `deepcopy` triggers `__getattr__` during the copy process, which creates a loop.

The workaround: cache the template, but when you need a fresh copy, `deepcopy` only the inner `tpl.docx` object and inject it into a new `DocxTemplate` shell:

```python
import copy
from docxtpl import DocxTemplate

# Cache the parsed template once at startup
_cached_tpl = DocxTemplate("template.docx")

def get_fresh_template():
    tpl = DocxTemplate.__new__(DocxTemplate)
    tpl.docx = copy.deepcopy(_cached_tpl.docx)
    # Copy over other attributes docxtpl needs
    tpl.jinja_env = _cached_tpl.jinja_env
    tpl.crc_to_new_media = {}
    tpl.crc_to_new_embedded = {}
    tpl.pic_map = {}
    return tpl
```

This skips the 56MB XML re-parse on every request and avoids the `deepcopy` recursion. The template is parsed once and reused.

---

## What we tried and rejected: jemalloc

We also looked at [jemalloc](https://github.com/jemalloc/jemalloc) as a memory allocator replacement. It's commonly recommended for Python services to reduce heap fragmentation, and Heroku even has a buildpack for it.

We didn't end up using it, and the reason is not obvious.

jemalloc uses `MADV_FREE` instead of `MADV_DONTNEED` when releasing memory back to the OS. The difference: `MADV_DONTNEED` immediately unmaps the pages from your process's RSS. `MADV_FREE` just marks them as reusable — the kernel can reclaim them if it needs to, but until then they still count toward your RSS.

On a normal server, this is fine. The memory _is_ available for reuse, and the OS reclaims it under pressure. But on Heroku, R14 errors are triggered by RSS. So jemalloc can actually make your Heroku metrics _worse_ even when real memory usage is lower. Your app uses less memory, but the OS reports more, and Heroku kills you for it.

If you're on Heroku and considering jemalloc, check whether the RSS improvement is real or just hidden behind lazy page reclamation.

---

## What I'd take away from this

1. **memray is worth adding to any Python service that might have memory issues.** The signal-based attach means you can profile without restarting.
2. **Getting files off Heroku dynos requires chunked transfer** with dyno pinning and retry logic. The SSH tunnel isn't built for large files.
3. **`uvicorn --workers N` uses spawn, not fork.** If you have heavy shared state (models, tokenizers, large caches), it multiplies your memory by N.
4. **`gunicorn --preload` with uvicorn workers gives you Linux copy-on-write sharing.** This can save a lot of memory when most of what your workers load is read-only.
5. **Audit your import chains.** A module-level side effect in a shared library can load things you never intended into processes that don't need them.
6. **Cache expensive parses, but watch out for `deepcopy` traps.** Some objects don't survive `deepcopy` cleanly — you might need to copy only the inner data and rebuild the wrapper.
7. **jemalloc on Heroku can backfire.** It reduces real memory usage but keeps RSS high because of `MADV_FREE` vs `MADV_DONTNEED`. Heroku cares about RSS.
