---
layout: post
title: "Making a Voice AI Reliably Follow a Checklist — an Engineering Write-up"
date: 2026-06-04 00:00:00-0000
description: A long-form account of getting a real-time voice agent to walk a caller through a structured, multi-section checklist — and the delivery bug that wasted weeks of prompt-tuning.
tags: voice-ai engineering
categories: engineering
related_posts: false
---

> A long-form account of getting a real-time voice agent (built on a voice platform + a large language model) to reliably walk a caller through a structured, multi-section checklist — asking every question, in order, without skipping, re-asking, or inventing its own.
>
> Everything here is generic infrastructure and prompting technique. All code snippets are illustrative reconstructions of patterns, not production source.

---

## TL;DR

- We wanted a voice agent to drive a caller through a structured checklist (think: a multi-section intake form with categories like scheduling, compliance, and open items — each with follow-up questions).
- The agent kept **ignoring the "next question"** we fed it: re-asking answered questions, inventing its own, skipping others.
- After a long detour through prompt-tuning and several delivery mechanisms, the real problem turned out to be **where the instruction was going**, not how it was phrased: the messages we used to steer the model were being **silently dropped by the platform/model combination**.
- The breakthrough was to stop depending on the voice platform to forward our instruction and instead **insert our own server as the "LLM"** (a custom-LLM proxy). Now _we_ build the prompt and call the model directly — full control.
- That unlocked a long tail of robustness work: a one-question-at-a-time closing flow, fixing double-asked questions (two distinct root causes), a transcript "debounce," prompt caching, and `temperature=0`.

**The meta-lesson:** _most of the work wasn't the feature — it was discovering the platform was misleading me about what the model actually received, then rebuilding enough determinism to trust it._

---

## 1. The setup

The system has three moving parts:

1. **A voice platform** that handles the phone call: speech-to-text (STT), text-to-speech (TTS), turn-taking/endpointing, and orchestration. It calls out to an LLM to decide what the assistant says next. (We used [Vapi](https://vapi.ai); the lessons generalize to any similar platform.)
2. **A conversational LLM** ("the voice model") that generates what the assistant says each turn.
3. **A separate analyzer LLM** that, after each caller utterance, updates a **state object** representing "what's been answered / what's still missing" in the checklist. (We used a fast model for this; again, the pattern is what matters.)

The intended loop, per turn:

```
caller speaks
  → STT + endpointing decide the turn is over
  → analyzer updates checklist state  ("scheduling: answered, compliance: still open")
  → we compute the next question from that state
  → the voice model says it
  → repeat until the checklist is complete → closing flow
```

The hard part is step "the voice model says _the right next question_." That's where everything went wrong.

---

## 2. Phase one — packaging the questions (format experiments)

Before we understood the real (delivery) problem, we assumed the model was _seeing_ our instruction and just struggling to _act_ on it. So we iterated on **format**:

- **Send the whole checklist** as a background message each turn. The model was overwhelmed — a big nested structure is hard to scan for "what's still missing," so it skipped questions.
- **Send it as a structured array** in the system message. Cleaner for us, still hard for the model to reason over turn-by-turn.
- **Send back only the _next_ question(s)**, not the whole list. Big improvement — the model can't skip ahead if it can only see what's next.
- **Consolidate questions into groups of two**, so the assistant asks natural pairs ("Any scheduling conflicts, and how about compliance?") instead of a robotic one-at-a-time march or an overwhelming all-at-once dump.
- A pile of smaller nuances: numbered lists; tracking "coverage confirmed" per list section; phrasing as "Any X?" for the first ask vs. "Any _other_ X?" once at least one was reported; ordering metadata so sections come in a sensible order; scoping questions per-location when a caller had been at multiple places.

This phase produced a genuinely good _format_. It did **not** fix the core symptom, because the format was never the bottleneck.

---

## 3. Phase two — how the instruction reached the model (delivery experiments)

This is where the real story is.

### 3a. The voice platform's "Say" command

Most voice platforms expose a way to make the assistant **speak specific text directly** (Vapi calls it a `say` control message). We tried using it to force the exact next question.

It worked _mechanically_ — the assistant said the words — but it was too rigid:

- No natural acknowledgement ("Got it." / "Understood.") before the question.
- It bypassed the model entirely, so the assistant couldn't **consolidate**, couldn't handle a **follow-up** when the caller volunteered something unexpected, and couldn't recover gracefully from mis-hearings.

A checklist read by a rigid TTS puppet is not a conversation. Abandoned.

### 3b. Mid-conversation system messages — the confusing part

The natural mechanism is to inject an operator instruction as a **system message mid-conversation** ("ask exactly this next") and let the model speak it naturally.

This **seemed to quasi-work.** Sometimes the assistant asked the right next question; sometimes it didn't. That intermittency is _exactly_ what makes a bug expensive — it looks like a prompting problem, so you tune prompts for weeks.

**What was actually happening (the illusion):** the base system prompt (always in context) has its own conversational flow, and the model also carries strong _training priors_ about what a checklist like this "should" contain. When the question we wanted happened to **coincide** with what the base prompt or the model's instincts would ask anyway, it _looked_ like our injected message had landed. When they diverged, it didn't — re-asking answered items, asking things that weren't in our list, etc. The injected message was never the thing reliably steering the conversation.

**The actual root cause:** mid-conversation system messages (system-role entries inside the running `messages` array, as opposed to the single top-level system prompt) are a **model-version-gated feature**. At the time, they were supported on **one specific top-tier model only** — and **the voice platform didn't run that model.** It ran a model that doesn't honor them (and, as we found, silently downgrades if you ask for the gated one). So on the model the platform actually executed, those messages weren't reliably applied.

Reference for the gating: Anthropic's docs note the feature is limited to a specific model — see _Mid-conversation system messages_ in the references below.

> **Takeaway:** before tuning _how_ a model responds to an instruction, prove _that the instruction reaches the model on the exact model version in production._ "Appears in the platform's message log" is **not** the same as "was applied by the model."

### 3c. Sending it as a user message

If a system message won't land, what about a **user-role message**? It _did_ reach the model — but introduced two new failures:

- The platform **merged the injected user message into the caller's actual transcript turn**, corrupting the very data the product exists to capture.
- The model sometimes **read the operator framing out loud** ("Checklist system: ask the following...").

Net negative. Reverted.

### 3d. Switching to the model that supports the feature

We tried explicitly requesting the top-tier model that _does_ support mid-conversation system messages. The platform **silently downgraded** it back to a model that doesn't. That confirmed it was a platform limitation, not just a config mistake — there was no path to that model through the platform.

### 3e. The fix — become the LLM (a custom-LLM proxy)

Every delivery mechanism failed for the same underlying reason: **we didn't control the final prompt the model saw.** So we removed that dependency entirely.

Most voice platforms let you point the assistant at a **custom LLM endpoint** instead of a built-in model provider. The platform then sends _us_ an OpenAI-style chat-completions request each turn; we return the assistant's reply. By becoming that endpoint, **we** assemble the prompt and call the model ourselves.

```
Before:  platform ──► model provider                 (we only hope our side-channel message lands)
After:   platform ──► OUR proxy ──► model provider    (we build the prompt; no forwarding to trust)
```

Now the next question goes into the **system prompt of the call we make** — guaranteed present, highest priority, every turn, on whatever model we choose. No platform forwarding to trust, no model-version gating to fight.

The request the platform sends looks like an OpenAI chat completion:

```jsonc
POST /chat/completions
{
  "model": "…",
  "messages": [
    { "role": "system", "content": "…the base assistant prompt…" },
    { "role": "assistant", "content": "…earlier assistant turn…" },
    { "role": "user", "content": "…caller's latest utterance…" }
  ],
  "stream": true,
  "call": { "id": "…" } // platform-specific call identifier
}
```

Our proxy:

1. Parses it; pulls the call id (the key to that call's checklist state).
2. Reads the current checklist state (computed by the analyzer) and derives the **next question**.
3. Injects that question as a high-priority block into the system prompt.
4. Calls the model and **streams** the answer back in the exact format the platform expects.

**Streaming matters:** voice platforms require Server-Sent Events in OpenAI's chunk format, terminated by `data: [DONE]`. Returning a single JSON blob silently fails. The streaming response shape:

```python
def sse(obj):  # one Server-Sent Event
    return f"data: {json.dumps(obj)}\n\n"

def generate():
    # first chunk announces the assistant role
    yield sse({"choices": [{"index": 0, "delta": {"role": "assistant"}}]})
    with client.messages.stream(
        model=…, system=system_blocks, messages=convo, max_tokens=…
    ) as stream:
        for text in stream.text_stream:
            yield sse({"choices": [{"index": 0, "delta": {"content": text}}]})
    yield sse({"choices": [{"index": 0, "delta": {}, "finish_reason": "stop"}]})
    yield "data: [DONE]\n\n"

return StreamingResponse(generate(), media_type="text/event-stream")
```

Because we now call the model directly, the platform's model limits and message-forwarding quirks **stop mattering**. This is the single decision that made the whole thing work.

---

## 4. The long tail of robustness

Getting delivery right was the unlock; making it _reliable_ was a second project.

### 4a. The "running with no system prompt" bug

We filtered our own previously-injected directives out of the incoming history so they wouldn't pile up. The detection used a substring check (`marker in text`). But the **base prompt itself mentions the marker** (it explains the convention to the model), so the filter matched the base prompt and **dropped it entirely** — the model was running with almost no system prompt, which is why its wrap-up was so erratic.

```python
# BUG: the base prompt mentions the marker, so this nukes the base prompt.
if marker in text: drop(text)

# FIX: only treat it as our injected directive if it STARTS with the marker.
if text.lstrip().startswith(marker): drop(text)
```

A one-word fix (`in` → `startswith`) that had outsized impact. Classic.

### 4b. `temperature = 0` and prompt caching

- **`temperature = 0`** for the voice model: at the default sampling temperature it paraphrased the exact questions and the closing lines. Zero made it follow instructions far more literally. (Note: some newer top-tier models reject a custom temperature — worth guarding per model.)
- **Prompt caching:** the base prompt is a large, stable prefix; the per-turn directive is small and changes every turn. So we send the system prompt as two blocks — the base prompt **cached**, the directive **fresh and appended last** so it's the most-recent, highest-priority instruction:

```python
system = [
    {
        "type": "text",
        "text": base_prompt,
        "cache_control": {"type": "ephemeral"},
    },  # cached across turns
    {
        "type": "text",
        "text": per_turn_directive,
    },  # uncached, changes each turn
]
```

This cut both per-turn cost and time-to-first-token, which matters a lot for perceived voice latency.

### 4c. A one-question-at-a-time "closing flow"

The end-of-call wrap-up (offer a summary → ask for feedback → sign off) kept getting **consolidated** or skipped by the model. We replaced "tell the model the whole closing script" with a small **driver** that emits exactly one closing step per turn, reading position from the conversation. The model can't compress or skip steps it isn't shown.

### 4d. Double-asked questions — two distinct root causes

A question would sometimes be asked twice (caller answers "No," gets asked again, answers "No" again). It looked like one bug; it was two:

1. **A close-logic gap.** When a caller answered a _merged_ question partially ("No scheduling conflicts, but we do have a compliance update..."), the "mark this section answered" logic didn't fire for the denied half, so it stayed open and got re-asked. Fixed in the analyzer's close detection.
2. **Lock contention dropping a turn.** Each call serializes its analyzer updates behind a per-call lock. A fast back-to-back "No" could **lose its analysis turn** to a lock timeout, leaving stale state, so the proxy re-asked. Fixed by reducing contention (next item) plus a defensive read-only "self-heal" in the proxy.

### 4e. The transcript "debounce" (newest-wins)

Voice platforms emit a conversation update for **both the partial and the final transcript** of one utterance. Both kicked off an analyzer run; they fought over the per-call lock, and the _final_ (more accurate) one sometimes lost. We added a "**newest-timestamp-wins**" guard:

```python
# On each update: record the newest user-utterance timestamp
# (a running max in a shared store).
latest = max(stored_latest, this_utterance_ts)
store(latest)

# Inside the analyzer, right after acquiring the per-call lock:
if this_utterance_ts < latest:
    return  # a newer turn arrived; it will process a more
    # complete transcript. Bail fast.
```

The key property that makes this safe: **the final transcript always has the maximum timestamp, so it can never skip itself** — no data loss. Superseded partials bail in ~1 ms (no model call), which _reduces_ contention and cost.

---

## 5. Engineering lessons

- **Verify the channel before tuning the message.** Weeks went into prompt-tuning a message the model wasn't reliably receiving. "It shows up in the platform's log" ≠ "the model applied it." When behavior is intermittent, suspect _delivery_, not _wording_.
- **Intermittent success is the most expensive failure mode.** A clean "never works" gets debugged fast. "Works sometimes" sends you chasing ghosts. Here, the apparent successes were the **base prompt and the model's training priors coinciding** with what we wanted — not our instruction landing.
- **When you don't control the final prompt, take control of it.** Becoming the LLM endpoint removed an entire class of "did the platform forward it / which model did it actually run" problems.
- **Prefer structural logic over keyword lists.** Several fixes started as a hardcoded word list and were rewritten as **positional/structural** rules (e.g., distinguishing "no incidents" — a denial of the section — from "no issues _with_ the incident" — which means an incident _did_ happen — by _where_ the topic word sits relative to the negation, not by a curated list of denial words). Word lists silently miss synonyms and rot.
- **Mind the boring footguns.** Bytes vs. str from a cache, `in` vs. `startswith`, SSE vs. JSON, a lock TTL shorter than the work it guards — these cost more debugging time than any of the "interesting" problems.

---

## 6. A simplified end-to-end picture

```
                         ┌─────────────────────────────────────────────┐
   caller ──speaks──►    │  Voice platform (STT, TTS, endpointing)     │
                         └───────────────┬───────────────┬─────────────┘
                                         │               │
              (A) per-turn "what to say" │               │ (B) conversation-update webhook
                                         ▼               ▼
                              ┌────────────────┐   ┌────────────────────┐
                              │  OUR PROXY     │   │  analyzer (LLM)    │
                              │  /chat/compl.  │   │  updates checklist │
                              │                │   │  state             │
                              │ 1 read state   │   └─────────┬──────────┘
                              │ 2 inject next  │             │ writes
                              │   question     │   ┌─────────▼──────────┐
                              │ 3 call model   │   │  shared state store │
                              │ 4 stream SSE   │◄──┤  (per-call state)   │
                              └───────┬────────┘   └────────────────────┘
                                      │ stream
                              ┌───────▼────────┐
                              │  the LLM       │
                              └────────────────┘
```

Two independent platform→us channels: **(A)** the per-turn "decide what to say" request (the proxy), and **(B)** the after-each-utterance webhook that updates state. They communicate only through the shared per-call state store. The wait/endpointing config is tuned so (B) finishes writing before (A) reads.

---

## 7. References

- **Anthropic — Mid-conversation system messages** (the model-version-gated feature at the heart of the delivery problem): [docs](https://docs.anthropic.com/en/docs/build-with-claude/prompt-caching#mid-conversation-system-messages)
- **Anthropic — Prompt caching** (the cached-base-prompt + fresh-directive pattern): [docs](https://docs.anthropic.com/en/docs/build-with-claude/prompt-caching)
- **Anthropic — Messages API streaming** (the streaming interface we proxy): [docs](https://docs.anthropic.com/en/api/messages-streaming)
- **Vapi — Custom LLM** (pointing an assistant at your own endpoint; the core fix): [docs](https://docs.vapi.ai/customization/custom-llm)
- **Vapi — Assistant control / "Say" message** (the rigid direct-speech approach we abandoned): [docs](https://docs.vapi.ai/calls/call-features#control-messages)
- **OpenAI — Chat Completions streaming format** (the SSE chunk shape voice platforms expect): [docs](https://platform.openai.com/docs/api-reference/chat/create#chat-create-stream)
- **Server-Sent Events (SSE)** (the transport): [MDN](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events)
