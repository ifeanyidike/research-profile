---
layout: post
title: "Moving Our Voice AI to Pipecat: The Parts Nobody Warns You About"
date: 2026-07-05 00:00:00-0000
description: Notes from migrating a phone-based voice assistant from a managed platform to Pipecat. Asyncio traps, rebuilding call logs with observers, turn-taking tuning, voicemail detection, and why long-lived WebSockets fight every hosting default.
tags: voice-ai engineering infrastructure
categories: engineering
related_posts: false
---

## TL;DR

- We moved our phone-based voice assistant off a managed voice-AI platform and onto [Pipecat](https://github.com/pipecat-ai/pipecat). The pipeline itself came together in days. The real work was everything the platform used to do where you can't see it.
- **Call teardown must be run-once.** End-of-call events arrive in bunches (a provider error is followed milliseconds later by a disconnect). Route every path through one guarded helper or you get a crash a month that nobody can reproduce.
- **Build your call log before you think you need it.** Pipecat's observer API lets you record every frame without touching the pipeline. Dedupe by frame id, fail-open everywhere, and decide up front how much of each LLM request you store — full-context logging grows quadratically.
- **Three asyncio traps found us in review:** fire-and-forget tasks getting garbage-collected, cancelling a timer mid-send, and `wait_for` cancelling the cleanup it wraps.
- **Let the phone company do the phone work.** Twilio's async answering machine detection beat the in-framework option for a bot that speaks first, and closing the WebSocket is enough to hang up — no REST call, no credentials on the voice box.

---

## The shape of a call

The basic setup is simple. Twilio answers the phone and opens a media stream over WebSocket to our FastAPI server. From there, a Pipecat pipeline connects the pieces:

```
transport.input() → STT (Deepgram) → user aggregator → LLM → TTS (ElevenLabs)
                  → audio recorder → transport.output() → assistant aggregator
```

Audio comes in at 8 kHz mulaw (it's a phone call — the audio was never going to be pretty). The STT service turns it into text, the aggregator decides when the caller has finished talking, the LLM writes a reply, TTS speaks it, and audio flows back out. Pipecat is built around typed frames moving through queues, so every one of those arrows is something you can watch, intercept, or inject into. That turns out to matter a lot later.

One thing we got right early: **we set up the call config in Redis before the call connects**. We build the whole pipeline configuration — prompts, voice settings, timeouts — and store it in Redis under the call SID ahead of time. When the WebSocket handshake arrives, the server just reads the config and starts the pipeline. Nobody sits through dead air while a backend puts the configuration together. And if building the config fails, it fails before anyone's phone rings, not after they've picked up and said hello to silence.

---

## The server: one process, many calls

The voice server itself is as plain as we could make it. A stateless FastAPI app under uvicorn. Each call is one WebSocket handler coroutine running its own pipeline on the shared event loop. No per-call processes, no worker pools. The handler reads Twilio's handshake (a `connected` event, then a `start` event carrying the stream SID and custom parameters), pulls out the call SID, fetches the config from Redis, and hands everything to the pipeline. When the coroutine returns, the call is gone.

Two choices about what this server is allowed to touch shaped the design more than anything else.

First, it never talks to the database. Call logs, transcripts, telemetry — everything leaves the box as HTTP POSTs to an internal API, with a shared secret in the header. So database connections don't grow with call volume; the internal API's existing pool handles it all. It also means the machine holding a live audio stream to a real person has no database credentials on it.

Second, it barely holds Twilio credentials either. The serializer is set to `auto_hang_up=False`, because closing the WebSocket is enough for Twilio to end the call on its own. No REST call, no account keys on the voice box. The part of the system most exposed to the internet carries the fewest secrets.

We also got burned by a provider integration early on. We started with the TTS provider's WebSocket streaming API, since a persistent connection should be the fastest option. In practice we hit a race: a stale "final message" left over on the shared connection would get delivered to the _next_ synthesis request, closing it out with zero audio before any text had been sent. The result: the bot's first sentence sometimes just didn't play. We switched to the plain HTTP version of the same service and that whole class of bug went away. The lesson: a persistent streaming connection is state shared between one sentence and the next. Unless you really need the last few milliseconds, per-request HTTP is much easier to reason about.

The call recording rides the same pipeline. A buffer processor captures both sides in stereo — caller on the left channel, bot on the right — and at call end the raw audio gets wrapped in a WAV and uploaded to object storage from a worker thread, so the event loop stays free for live calls. Stereo matters more than it sounds. When you're trying to figure out whether the bot interrupted the caller or the caller just paused, having each voice on its own channel settles it in seconds. A mono mix never does.

---

## Hanging up is harder than it looks

A phone call can end in more ways than you'd expect: the caller hangs up, a provider dies mid-stream, the WebSocket drops, the caller goes quiet and never comes back, the call hits its time limit, or your own process crashes. Every one of those has to end up in the same place — pipeline shut down, resources released, a call record written — without ever leaving a caller listening to nothing.

Pipecat gives you the hooks. `on_pipeline_error` fires when any service reports an `ErrorFrame`, and the transport fires `on_client_disconnected` and `on_session_timeout`. What worked for us:

- Every "end the call" path goes through one helper that can only run once and queues a single `EndFrame`.
- Statuses separate _failed_ (setup broke, the pipeline never ran) from _error_ (the pipeline was running when something broke) from _completed_.
- A `finally` block always writes the final call log and posts the transcript, no matter how the call ended, with timeouts on each so one slow HTTP call can't hold up cleanup forever.

The helper is four lines, and all four matter:

```python
async def _end_call(reason: str) -> None:
    nonlocal _ended
    if _ended:
        return
    _ended = True
    logger.info(f"Ending call: {reason}")
    if worker is not None:
        await worker.queue_frames([EndFrame()])
```

The run-once guard looks like overkill until you notice that end-of-call events arrive in bunches. A provider error is usually followed milliseconds later by a disconnect. An idle timeout can land at the same moment the caller hangs up. Without the guard, each handler queues its own `EndFrame`, and a pipeline getting told to shut down twice while it's already half shut down is exactly how you get a crash once a month that nobody can reproduce.

One more small thing worth stealing: if both an error handler and a catch-all exception handler can write the error message, guard the second write (`if not call_error:`). Otherwise a generic "pipeline terminated" overwrites the specific "STT provider refused connection" that would have actually told you what happened.

---

## Rebuilding call logs with an observer

The thing we missed most from the managed platform was its call log — a full record of every call: what the STT heard, what went to the LLM, what came back, timings, errors. When someone asks why the bot said something weird at 2 pm yesterday, that record is the whole investigation.

Pipecat has a genuinely nice answer here: the observer API. A `BaseObserver` subclass gets a callback for every frame moving through the pipeline, without touching the pipeline itself. We built one that turns the interesting frames — transcriptions (partial and final), LLM requests and responses, TTS output, metrics, errors, who's-speaking boundaries — into ordered event rows, batches them, and sends them to an internal endpoint that bulk-inserts into Postgres. Rebuilding any call is one SQL query ordered by sequence number.

We made two scoping decisions up front. Raw audio frames stay out — at fifty a second they'd swamp the table, and the call recording already has the audio. And since the event payloads contain transcripts and prompts by design, they're treated as sensitive data from day one: stored in the database like any other user content, never printed to stdout or the app logs. Batches flush on size or a short timer, except error events, which flush immediately — if the process is about to die, the evidence should go out first.

Four things we learned building it:

**1. Observers see every frame once per hop, not once per frame.** `on_push_frame` fires for each pair of processors a frame passes between. One streamed LLM token crosses four or five hops, which means four or five callbacks for the same frame. Our first version recorded everything four times over. The fix is to dedupe by `frame.id` and record on first sighting. And since a frame's duplicates all arrive within milliseconds of each other — one trip through the pipeline — you don't need a set that grows forever. Two rotating sets of a few thousand ids cap the memory and never miss a live duplicate.

**2. Streaming responses need to be put back together.** The LLM's reply arrives as dozens of little text frames. An event per token would be noise, so the observer collects the chunks quietly and writes one response event when the end-of-response frame shows up. The embarrassing bug we caught in review: our first draft reset the accumulator on every new request but never actually added the chunks to it. Every response event was an empty string. What caught it was a test checking the payload's actual contents instead of just counting events.

**3. Decide what "log the LLM request" means before you build.** A conversational agent sends the whole conversation, system prompt included, on every request. Log that as-is and turn 30's event contains all 29 earlier turns plus the same multi-kilobyte system prompt for the 30th time. Storage grows quadratically with conversation length, and it's bytes that get you, not rows — the repeated prompt can't be compressed across rows, so the row count looks fine right up until the byte count doesn't. We chose to store everything anyway. Each event stands on its own, rebuilding a call needs no joins, and deduplicating the prompt later is a clean optimization on an append-only table. Either answer can be right. What matters is choosing on purpose and knowing what volume makes you look at it again.

**4. Fail-open is a rule you apply everywhere, not a try/except you add in one place.** Nothing the observer does — a bug in frame handling, a batching mistake, the logging endpoint being down — is allowed to touch a live call. Every entry point catches everything and logs. The sender treats a non-200 as "log it and drop the batch." The receiving endpoint always returns 200 with a success flag in the body, so even an HTTP-level failure can't leak back into the call path. The worst possible outcome is a call with missing telemetry. Never a broken call.

---

## The asyncio traps

Three of the bugs we found in review were pure asyncio, and all three are the kind you want to hear about before they find you.

**Fire-and-forget tasks can be garbage-collected.** `asyncio.create_task()` gives you a task the event loop only holds weakly. Keep no reference and Python is free to collect it while it's still running. So:

```python
task = asyncio.create_task(self._post_batch(batch))
self._post_tasks.add(task)                        # strong ref, or the GC may reap it
task.add_done_callback(self._post_tasks.discard)  # self-cleaning
```

The set earns its keep again at shutdown — `gather(*self._post_tasks)` and nothing captured in the call's last seconds gets dropped.

**Don't cancel anything that might be mid-send.** Our first batching design cancelled the pending flush timer whenever a size-based flush ran. But if that timer had already woken up and was partway through an HTTP POST, cancelling it killed the batch it was carrying. The redesign: the timer only ever swaps the buffer out synchronously, and the actual send runs in a separate tracked task that nothing ever cancels. Cancellation is only for timers that are definitely still asleep.

**`asyncio.wait_for` cancels the thing it wraps. Plan for that.** Our shutdown flush runs inside `wait_for(flush_all(), timeout=8.0)`. When the timeout hits, `flush_all` gets a `CancelledError` at whatever await it's sitting on, and nothing after that line runs — which in our first draft included closing the HTTP client. The fix is as boring as it sounds: `try/finally`, close the client in the `finally`. Python guarantees the `finally` runs during cancellation, and a single cancellation won't interrupt a clean `await client.aclose()` inside it.

---

## Storage details that bite later

A few database decisions from the event log that apply anywhere:

- **Size the primary key for the write rate, not the table you have today.** An events table taking hundreds of rows per call burns through a 32-bit key faster than you'd think. We went `BIGSERIAL` from day one — via SQLAlchemy's `BigInteger().with_variant(Integer, "sqlite")`, because SQLite (which runs our tests) only auto-increments a column declared exactly `INTEGER PRIMARY KEY`. Skip the variant and every test insert fails. With it, Postgres gets 64-bit keys and the tests keep working.
- **Don't add indexes out of habit.** Our first migration had five indexes and two were dead weight — one duplicated the primary key's index, the other was already covered by the first columns of a composite index. On an append-only, write-heavy table, every index is a cost you pay on every insert.
- **Expect rows to arrive before their parent.** Events stream in during the call, but the call's summary row only gets written at the end. So the events table carries an indexed provider call id with no foreign key, plus a nullable link to the call record that's filled in when the call finishes. Ship the receiving endpoint before the sender, and the worst mismatch between versions is a harmless 404 that the fail-open sender shrugs off.
- **Generate migrations from your models when you can.** We hand-wrote the `CREATE TABLE` SQL at first, and the model and the SQL drifted apart twice during review. Creating the table from the ORM model (`metadata.create_all(tables=[...])`) makes that whole category of bug impossible.

---

## Turn-taking: hearing silence isn't the same as hearing someone finish

The classic approach to turn-taking is a silence timer. VAD (we use Silero) notices the caller stopped making noise, waits N seconds, and declares the turn over. The problem is that people pause mid-thought all the time — "my address is…" followed by two seconds of remembering — and a silence timer walks right into the gap.

Pipecat's answer is Smart Turn, a small ONNX model (about 12 ms of inference on a modern CPU) that listens to the audio and decides whether the speaker actually sounds done. The two work together: VAD catches the pause quickly, Smart Turn judges whether it's really the end of the turn, and an "incomplete" verdict extends the wait. That combination let us set the silence threshold much lower than a plain timer could handle — fast when the caller is done, patient when they're not.

The tuning advice we'd give anyone: **translate your old platform's settings instead of making up new numbers.** Managed platforms bake years of tuning into their defaults — the baseline wait, the "hold on, they sound mid-thought" stretch, the interruption threshold. We mapped each one onto its Pipecat equivalent (baseline wait → VAD stop seconds, the stretch → Smart Turn's incomplete-turn wait, interruption threshold → VAD start seconds) instead of guessing. Behavior stays consistent through the migration, and every number in the config has a reason attached to it.

---

## Voicemail: let the phone company do it

For outbound calls you need to know whether a person answered or a voicemail did. Pipecat ships a `VoicemailDetector`, but it works by holding back audio until the called party speaks first — which just doesn't work if your bot is designed to speak first. If your bot opens the conversation, any voicemail detection built on "wait and listen" is out.

Twilio's answering machine detection turned out to be the better tool. With the async version, the call connects immediately, the bot greets like normal, and Twilio figures out who answered in parallel, firing a webhook about four seconds in. Machine? Hang up — the voicemail caught maybe two words of greeting. Human? Nothing happens; the call just carries on, never gated, never delayed.

Two things to understand about AMD before you lean on it:

- **It fires exactly once.** AMD listens to the first few seconds and gives one answer: machine, human, or unknown. There's no ongoing monitoring, and `unknown` is final — not "still checking." If an `unknown` was really a voicemail, your bot talks into it, and your idle timeout is the backstop. Log the answer on every call so you actually know how often `unknown` happens with your callers instead of guessing.
- **The mode choice is a real tradeoff.** The mode that waits for the voicemail beep gives you a definite answer, but it can take up to 30 seconds — during which your bot reads its whole greeting to a recording. The fast mode costs you a clipped word or two on real voicemails, plus the occasional `unknown`. For short outbound calls, fast mode wins easily.

There's also a trap where bot-speaks-first meets logging: a voicemail "answer" still produces a transcript — of your own bot's greeting. If anything downstream treats "a transcript exists for this call" as "we reached this person" (dedup logic, retry suppression), a failed voicemail attempt will look like a successful conversation. Check for actual user turns, not just a transcript.

---

## Running it on Fly.io: long-lived WebSockets fight every default

We deploy the voice server to Fly.io — a slim `python:3.12` container that ships automatically when tests pass on main. Fly's defaults, like most platforms', are tuned for normal request/response web apps. A voice server is the exact opposite: every call is a WebSocket held open for minutes at a time. Nearly every line in our `fly.toml` exists to push back on a default:

```toml
[http_service]
  auto_stop_machines = "off"   # an auto-stopped machine drops live calls
  min_machines_running = 1

  [http_service.concurrency]
    type = "connections"
    hard_limit = 25            # each active call = 1 WebSocket
    soft_limit = 20

  [[http_service.checks]]
    grace_period = "20s"       # the VAD model loads PyTorch on startup

[[vm]]
  memory = "1gb"               # 512MB OOMs loading the VAD model
```

There's a story behind each line:

- **Auto-stop has to be off.** Platforms love scaling to zero. A voice server that scales to zero hangs up on everyone mid-sentence. Turning auto-stop off and keeping at least one machine running isn't an optimization — it's not optional.
- **One call = one connection makes capacity planning easy.** The question becomes "how many simultaneous calls fit on a machine," and Fly's connection limits enforce the answer for you — no custom admission control to write. The soft limit under the hard one lets the load balancer send new calls to quieter machines before anything gets rejected.
- **Your smallest model decides your VM size.** The LLM, STT, and TTS are all remote APIs; the box itself mostly moves audio around. But the one model that runs locally — the VAD — is PyTorch, and PyTorch's load footprint is what pushed us from 512 MB (out of memory) to a full gigabyte, and what forced the 20-second health-check grace period so machines don't get declared dead while the model loads. When someone asks why an audio proxy needs a gig of RAM, the honest answer is "the 2 MB model's 800 MB runtime."
- **Deploys are still the rough edge.** Fly restarts machines on deploy, and a restart takes any live calls with it. Fail-open telemetry means we lose at most a couple seconds of events, and the phone company cleans up the line — but proper draining (stop routing new calls, let the active ones finish) is the hardening step we still need to do.

---

## Closing thoughts

The migration traded a platform's guarantees for a framework's control, and most of the work wasn't the happy path — the pipeline itself came together in days. The real effort went into everything a managed platform does where you can't see it: ending calls cleanly from every direction, capturing enough detail to debug last Tuesday's weird call, tuning turn-taking until it feels human, and knowing who — or what — picked up the phone.

If you're heading down the same road, here's the short version: make call teardown run-once and route every path through it. Build your call log before you think you need it, fail-open, deduped by frame id. Decide up front how much of each LLM request you store, because full-context logging grows quadratically. Treat `asyncio.create_task` references, cancellation points, and `finally` blocks as correctness problems, not style. And let the phone company do the phone work.
