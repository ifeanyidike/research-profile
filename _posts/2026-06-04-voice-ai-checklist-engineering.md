---
layout: post
title: "Making a Voice AI Reliably Follow a Checklist"
date: 2026-06-04 00:00:00-0000
description: Getting a real-time voice agent to walk a caller through a structured checklist — and the delivery bug that wasted weeks of prompt-tuning.
tags: voice-ai engineering
categories: engineering
related_posts: false
---

## TL;DR

- We wanted a voice agent to drive a caller through a structured checklist — a multi-section intake form with categories like scheduling, compliance, and open items, each with follow-up questions.
- The agent kept **ignoring the "next question"** we fed it: re-asking answered questions, inventing its own, skipping others.
- After weeks of prompt-tuning, the real problem turned out to be **where the instruction was going**, not how it was phrased. The messages we used to steer the model were being **silently dropped by the platform/model combination**.
- The fix was to stop depending on the voice platform to forward our instruction and instead **insert our own server as the "LLM"** (a custom-LLM proxy). Now _we_ build the prompt and call the model directly.
- That unlocked a second round of work: a one-question-at-a-time closing flow, fixing double-asked questions (two distinct root causes), a transcript "debounce," prompt caching, and `temperature=0`.

**The meta-lesson:** most of the work wasn't the feature — it was discovering the platform was misleading me about what the model actually received.

---

## 1. The setup

The system has three moving parts:

1. **A voice platform** ([Vapi](https://vapi.ai)) that handles the phone call: speech-to-text, text-to-speech, turn-taking, and orchestration. It calls out to an LLM to decide what the assistant says next.
2. **A conversational LLM** ("the voice model") that generates what the assistant says each turn.
3. **A separate analyzer LLM** that, after each caller utterance, updates a **state object** — what's been answered, what's still missing.

The loop, per turn:

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

## 2. Phase one — packaging the questions

Before we understood the real problem, we assumed the model was _seeing_ our instruction and just struggling to _act_ on it. So we iterated on format:

- **Send the whole checklist** each turn. The model was overwhelmed — skipped questions.
- **Send it as a structured array** in the system message. Cleaner for us, still hard for the model to reason over.
- **Send back only the _next_ question(s)**. Big improvement — the model can't skip ahead if it can only see what's next.
- **Consolidate questions into pairs**, so the assistant asks natural groups ("Any scheduling conflicts, and how about compliance?") instead of a robotic one-at-a-time march.
- Smaller nuances: numbered lists, "Any X?" vs. "Any _other_ X?" after at least one was reported, ordering sections sensibly, scoping questions per-location when a caller had been at multiple places.

Good format. Did **not** fix the core symptom, because the format was never the bottleneck.

---

## 3. Phase two — how the instruction reached the model

This is where the real story is.

### 3a. The "Say" command

Vapi exposes a `say` control message — force the assistant to speak specific text. We tried it.

It worked mechanically, but it was too rigid:

- No natural acknowledgement ("Got it.") before the question.
- It bypassed the model entirely — no consolidation, no handling unexpected follow-ups, no graceful recovery from mis-hearings.

A checklist read by a TTS puppet is not a conversation. Abandoned.

### 3b. Mid-conversation system messages

The natural mechanism: inject an operator instruction as a **system message mid-conversation** and let the model speak it naturally.

This **seemed to quasi-work.** Sometimes the assistant asked the right question; sometimes it didn't. That intermittency is what makes this kind of bug expensive — it looks like a prompting problem, so you tune prompts for weeks.

**What was actually happening:** the base system prompt has its own conversational flow, and the model carries training priors about what a checklist "should" contain. When our question happened to coincide with what the model would ask anyway, it _looked_ like our message had landed. When they diverged — re-asking answered items, asking things not in our list — it clearly hadn't. Our injected message was never reliably steering the conversation.

**The root cause:** mid-conversation system messages are a **model-version-gated feature**. At the time, they worked on one specific model only — and the voice platform didn't run that model. It ran one that doesn't honor them, and silently downgrades if you request the gated one.

> **Takeaway:** before tuning _how_ a model responds to an instruction, prove _that the instruction reaches the model on the exact model version in production._ "Appears in the platform's log" ≠ "was applied by the model."

### 3c. Sending it as a user message

User-role message? It _did_ reach the model, but:

- The platform **merged it into the caller's actual transcript**, corrupting the data.
- The model sometimes **read the operator framing out loud** ("Checklist system: ask the following...").

Net negative. Reverted.

### 3d. Switching models

We tried requesting the one model that supports mid-conversation system messages through the platform. It silently downgraded to one that doesn't.

The next question: why not switch to a different model provider entirely — one where the platform does pass system messages correctly? We could have. But by this point we'd already spent weeks debugging delivery issues we couldn't see, on a layer we didn't control. Switching providers might fix _this_ specific gating problem, but we'd still be trusting the platform to forward our messages correctly, still unable to verify what the model actually received, and still one silent platform change away from the same class of bug. We wanted to stop playing that game entirely.

### 3e. The fix — become the LLM

Every delivery mechanism failed for the same reason: **we didn't control the final prompt the model saw.**

Most voice platforms let you point the assistant at a **custom LLM endpoint**. The platform sends you an OpenAI-style chat-completions request each turn; you return the assistant's reply. By becoming that endpoint, we assemble the prompt ourselves.

```
Before:  platform ──► model provider                 (we hope our message lands)
After:   platform ──► OUR proxy ──► model provider    (we build the prompt)
```

#### What the platform sends us

Each turn, Vapi hits our endpoint with a standard chat-completions request:

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
  "call": { "id": "…" }
}
```

The `call.id` is our key into the per-call state store.

#### What the proxy does with it

The proxy sits between the platform and the actual model. On every request it:

1. **Extracts the call id** and looks up the current checklist state from the shared store — which sections are done, which are open, what the next question should be.

2. **Strips old directives** from the conversation history. The platform replays the entire message history each turn, which means our previously-injected directives come back in `messages`. We filter them out so they don't pile up and confuse the model. (This is where the `in` vs. `startswith` bug lived — more on that in 4a.)

3. **Builds a two-block system prompt.** The first block is the base prompt — the assistant's personality, tone, and general behavior. The second block is the per-turn directive: the exact next question to ask, plus any context about what the caller just said. The base prompt is large and stable; the directive is small and changes every turn.

```python
system = [
    {
        "type": "text",
        "text": base_prompt,
        "cache_control": {"type": "ephemeral"},
    },
    {
        "type": "text",
        "text": f"[DIRECTIVE] Ask the caller: {next_question}",
    },
]
```

The directive goes last so it's the freshest, highest-priority instruction the model sees. The base prompt is cached across turns so we don't pay for it twice.

4. **Calls the model directly** — not through the platform, not through any middleware. We pick the model, we set the temperature, we control the full request.

5. **Streams the response back as SSE.** Voice platforms expect Server-Sent Events in OpenAI's chunk format. If you return a single JSON blob instead of a stream, it silently fails — the caller hears nothing.

```python
def sse(obj):
    return f"data: {json.dumps(obj)}\n\n"

def generate():
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

#### Why this works where everything else didn't

The platform's job is now reduced to handling audio and turn-taking. It doesn't touch the prompt, doesn't pick the model, doesn't forward our instructions. All of that is ours. The next question is baked into the system prompt of every call we make — it can't get dropped, can't get downgraded, can't get merged into the transcript.

But unlike the rigid `say` command (3a), the model is still a model. It can acknowledge what the caller said, handle off-script input, and ask the directive naturally. If a caller mentions something unexpected — say, "we had a meeting" — the analyzer picks that up, and the next directive tells the model to explore it: what happened, who was there, what was discussed. Once the caller is done, the directive shifts back to the next open checklist item. The proxy controls _what_ the model should ask; the model controls _how_ it asks it. That's the balance the `say` command couldn't give us and the mid-conversation messages couldn't reliably deliver.

#### Latency

The proxy adds one network hop, but in practice the bottleneck is the model's time-to-first-token, not the proxy overhead. Prompt caching helps here — the base prompt (which doesn't change turn to turn) is cached, so the model only processes the short directive and the new user message. First-token latency dropped noticeably after we added caching.

We deployed the proxy on the same cloud region as the model provider. Round-trip from platform → proxy → model → platform is around 300–500 ms for the first token, which is within the range where callers don't notice a gap.

---

## 4. The long tail of robustness

Getting delivery right was the unlock. Making it reliable was a second project.

### 4a. The "running with no system prompt" bug

We filtered our own injected directives out of the incoming history so they wouldn't pile up. The detection used a substring check (`marker in text`). But the base prompt itself mentions the marker, so the filter matched it and **dropped the entire base prompt**. The model was running with almost no instructions.

```python
# BUG: the base prompt mentions the marker, so this nukes it.
if marker in text: drop(text)

# FIX: only match if it STARTS with the marker.
if text.lstrip().startswith(marker): drop(text)
```

One-word fix. `in` → `startswith`.

### 4b. `temperature = 0`

At the default temperature the model paraphrased the exact questions and the closing lines. Setting `temperature = 0` made it follow instructions literally. Small change, big difference in reliability.

### 4c. One-question-at-a-time closing flow

The end-of-call wrap-up (summary → feedback → sign off) kept getting consolidated or skipped. Fix: a small driver that emits exactly one closing step per turn. The model can't compress steps it isn't shown.

### 4d. Double-asked questions — two root causes

A question would get asked twice. Looked like one bug; it was two:

1. **Close-logic gap.** Caller answers a merged question partially ("No scheduling conflicts, but we do have a compliance update...") — the denied half didn't get marked as answered, so it came back. Fixed in the analyzer's close detection.
2. **Lock contention.** Each call serializes analyzer updates behind a per-call lock. A fast back-to-back "No" could lose its turn to a lock timeout, leaving stale state. Fixed by reducing contention (next item).

### 4e. Transcript debounce

Voice platforms emit a conversation update for both the partial and the final transcript of one utterance. Both kicked off an analyzer run; they fought over the lock, and the final (more accurate) one sometimes lost.

Fix: a **newest-timestamp-wins** guard:

```python
latest = max(stored_latest, this_utterance_ts)
store(latest)

# Inside the analyzer, after acquiring the lock:
if this_utterance_ts < latest:
    return  # a newer turn arrived — bail
```

The final transcript always has the maximum timestamp, so it can never skip itself. Superseded partials bail in ~1 ms with no model call.

---

## 5. Lessons

- **Verify the channel before tuning the message.** Weeks went into prompt-tuning a message the model wasn't receiving. When behavior is intermittent, suspect delivery, not wording.
- **Intermittent success is the most expensive failure mode.** "Never works" gets debugged fast. "Works sometimes" sends you chasing ghosts.
- **When you don't control the final prompt, take control of it.** Becoming the LLM endpoint removed an entire class of platform-forwarding problems.
- **Prefer structural logic over keyword lists.** Distinguishing "no incidents" (denial) from "no issues _with_ the incident" (it happened) by where the word sits relative to the negation, not by a list of denial words.
- **Mind the boring footguns.** `in` vs. `startswith`, bytes vs. str from a cache, SSE vs. JSON, a lock TTL shorter than the work it guards — these cost more debugging time than the interesting problems.

---

## 6. End-to-end architecture

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

Two independent channels: **(A)** the per-turn request (the proxy), and **(B)** the webhook that updates state. They communicate only through the shared state store. Endpointing is tuned so (B) finishes writing before (A) reads.

---

## References

- [Anthropic — Mid-conversation system messages](https://docs.anthropic.com/en/docs/build-with-claude/prompt-caching#mid-conversation-system-messages)
- [Anthropic — Prompt caching](https://docs.anthropic.com/en/docs/build-with-claude/prompt-caching)
- [Anthropic — Messages API streaming](https://docs.anthropic.com/en/api/messages-streaming)
- [Vapi — Custom LLM](https://docs.vapi.ai/customization/custom-llm)
- [Vapi — Control messages](https://docs.vapi.ai/calls/call-features#control-messages)
- [OpenAI — Chat Completions streaming](https://platform.openai.com/docs/api-reference/chat/create#chat-create-stream)
- [MDN — Server-Sent Events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events)
