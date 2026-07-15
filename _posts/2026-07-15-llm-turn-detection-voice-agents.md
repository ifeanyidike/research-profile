---
layout: post
title: "LLM-Based Turn Detection in Voice Agents: Three Failure Modes from Production"
date: 2026-07-15 00:00:00-0000
description: Knowing when a caller is done talking is the hardest continuous decision in a voice pipeline. Audio-only endpointers can't judge semantic completeness, so we let the LLM decide. It worked — until three failure modes showed up in production, all of them races between asynchronous components.
tags: voice-ai engineering debugging
categories: engineering
related_posts: false
---

## TL;DR

- A voice agent has to decide, every moment of a call, whether the caller has finished their turn or is just pausing. Get it wrong and the agent either talks over people or leaves dead silence. This is called endpointing.
- Audio-only endpointers hear prosody, not meaning. They can't tell a complete "No." from the first beat of a list. In our production traffic, the neural endpointer returned "incomplete" on about 40% of turns — and its worst cases were exactly the shortest, most confident answers.
- Letting the LLM judge turn completion fixes this. Pipecat's `filter_incomplete_user_turns` has the model prepend a marker (✓ for complete, ○ for incomplete-short, ◐ for incomplete-long) to every response. The marker gates whether the response gets spoken. When it works, the agent finally sounds like it's listening to the words.
- **Failure 1: Prefill rejection.** The markers get written back into context as assistant messages. On models that reject assistant-message prefill (Claude 4.5/4.6 with extended thinking, and others), a request whose context ends on one of these markers returns a hard 400. We hit this when multiple inference triggers queued up and a late one dequeued after the first response had already been appended. Reported upstream ([#5035](https://github.com/pipecat-ai/pipecat/issues/5035), [#5036](https://github.com/pipecat-ai/pipecat/issues/5036)).
- **Failure 2: Stale verdicts.** The LLM verdict takes a full round-trip. If the caller resumes speaking in that window, the ✓ arrives stale — correct about the moment it was triggered, wrong about the moment it lands. The usual guard checks whether the caller is speaking _right now_, but a micro-pause between resumed words can fool it. The fix: guard on an edge (has the caller resumed since this inference started?), not a level (is the caller speaking at this instant?).
- **Failure 3: Timer epoch mismatch.** Two timers govern incomplete turns — a re-engagement timer ("nudge the caller after N seconds of silence") and a watchdog ("force-close a stuck turn after M seconds"). Ours counted from different origins: the re-engagement timer from when the verdict was produced, the watchdog from when inference was triggered. The watchdog always won the race, pre-empting the nudge with dead air.
- You cannot debug any of this from a transcript. The races live in the timing between components. Instrument the turn lifecycle as timestamped events — VAD, STT, verdict, TTS — or you're guessing.

---

## The shape of a voice pipeline

A real-time voice agent is a pipeline. Audio comes in from a phone line, flows through a chain of components, and audio goes back out.

```
audio in  →  VAD  →  STT  →  turn detector  →  LLM  →  TTS  →  audio out
             is there   speech    is the turn    decide   text
             speech?    → text    over?          reply    → speech
```

Every box adds latency, and the turn detector decides when the LLM is even _allowed_ to start. Three components matter here:

- **VAD** (voice activity detection) answers a purely acoustic question: _is someone making speech sounds right now?_ It knows nothing about words. It flips between "speech" and "silence," usually with a small configurable hangover — say, "declare silence after 200ms of quiet."
- **STT** (speech-to-text) streams. It emits _interim_ hypotheses that update as more audio arrives ("I need" → "I need to") and then a _final_ when it commits. Interims are fast and wrong; finals are slower and stable.
- **The turn detector** is the one we care about. Its job is to declare the caller's turn _over_, which triggers everything downstream. Fire it too early and you interrupt. Fire it too late and you stall.

VAD tells you when _audio_ stops. It does not tell you when a _thought_ is finished. "Give me a second, I need to check —" contains plenty of silence and is obviously not a completed turn. Endpointing is the entire gap between those two facts.

---

## The tension: fast versus patient

Humans hand off turns fast. The typical gap between one speaker stopping and the next starting is around 200 milliseconds ([Stivers et al., 2009](https://www.pnas.org/doi/10.1073/pnas.0903616106); [Levinson & Torreira, 2015](https://www.frontiersin.org/articles/10.3389/fpsyg.2015.00731/full)) — often _negative_, because we predict the end of your sentence and start before you're done. Anything approaching a full second of silence before a reply already feels sluggish.

So the latency budget is brutal. But that same budget is what makes interruption easy: if you're eager enough to reply in 300ms, you're eager enough to jump on a mid-sentence breath. Every endpointing strategy is a point on this trade-off curve, and the curve has no free lunch. Pushing toward "responsive" pushes toward "interrupts." Pushing toward "patient" pushes toward "dead air."

There's no single right threshold because _the right amount of patience depends on what was said_, and acoustics alone can't see that. Three utterances that are acoustically similar — a short burst of speech followed by silence — but conversationally different:

- A complete answer: `"No."` → the turn is over; reply immediately.
- The start of a list: `"item one, item two,"` then a breath → the turn is not over; the speaker is mid-enumeration.
- A stalling preamble: `"That's a good question…"` → the turn is not over; the real answer hasn't started.

To an audio-only detector these look nearly identical. To anything that understands the words, they're obviously distinct.

---

## Audio-only endpointing and its blind spots

The oldest strategy is a fixed silence timeout: after N milliseconds of VAD-silence, declare the turn over. Simple, and still what most systems fall back to. The problem is that a single N can't serve both the person who answers "No." and the person dictating a list with pauses. Set N short and you cut off the list. Set N long and every crisp answer drags.

The improvement is a small machine-learned model — Pipecat calls it "smart turn" — that predicts end-of-turn from acoustic and prosodic cues: falling pitch, final-syllable lengthening, the shape of a completed intonation contour. These are real signals and the models help. But they share one structural limitation: an audio-only endpointer hears prosody, not meaning. It cannot tell a complete "No." from the first beat of a list, because the difference isn't in the sound — it's in the semantics.

In our production telephony traffic, the smart turn model returned "incomplete" on roughly 40% of turns, and it was least reliable exactly where you'd predict: single-word answers, short confirmations, and anything read out as structured data (a sequence of digits or letters).

The failure has a second-order effect. When the smart model declines to commit, the system falls through to the wall-clock safety net — a fixed silence timeout, often several seconds. So the shortest, most confident human answers are the ones punished with the longest waits. A crisp "No." could sit for multiple seconds before the agent reacted.

You can tune the thresholds, but you're just sliding along the same trade-off curve. To break out of it you need a detector that understands language. You already have one in the pipeline.

---

## Let the language model judge the turn

The LLM already reads the entire conversation and understands it. What if it also decided whether the caller's turn was complete? This is the idea behind Pipecat's [`filter_incomplete_user_turns`](https://docs.pipecat.ai/api-reference/server/utilities/turn-management/filter-incomplete-turns).

The mechanism: instruct the model to begin every response with a single-character completion marker, then treat that marker as a control signal rather than speech.

| Marker | Meaning                 | Behavior                                                                                                                                                             |
| :----: | ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **✓**  | Complete                | The turn is finished. The rest of the response is the real reply and gets spoken. Zero added latency — the model answered in the same breath it judged completeness. |
| **○**  | Incomplete — short wait | The caller was cut off mid-thought and will likely resume in a couple of seconds. Suppress the response; stay silent; wait briefly.                                  |
| **◐**  | Incomplete — long wait  | The caller is deliberating ("let me think…"). Suppress the response; give them more room before gently re-engaging.                                                  |

The architecture that makes this fast is a two-tier split. The cheap detectors — VAD and the smart turn model — are demoted to _triggers_: they fire an LLM inference early and aggressively, but they no longer finalize the turn. Only the model's ✓ finalizes. So you get the best of both tiers: an eager trigger keeps latency low, and a semantic decision keeps interruptions down.

Walk the three hard cases through it. "No." → the model recognizes a complete answer, emits ✓, and speaks — no penalty for being short. The start of a list → the model sees an unfinished thought, emits ○, and the agent holds. The stalling preamble → ◐, and the agent waits. Turn-taking has moved from acoustics to meaning. When it works, it feels like the machine is finally listening to the words.

And then you ship it, and production files three bug reports.

---

## Failure one: prefill rejection

For the model to condition on its past verdicts, the markers get written back into the conversation history as assistant-role messages. A suppressed ○ becomes a standalone assistant turn whose entire content is ○. A spoken answer becomes an assistant turn like `✓ The next available appointment is Thursday`. The model should see its own prior decisions so it can stay consistent.

But some models enforce a hard rule: a request may not end on an assistant message. The final message must come from the user (or be a tool result). Ending on an assistant turn is called prefill, and prefill-restricted models reject it outright. Claude 4.5 and 4.6 with extended thinking reject it. The moment a new inference fires while the conversation still ends with one of these markers, you get a hard 400 — not a degraded answer, a dead request.

Here is the failure reduced to its essence:

```python
# A conversation whose last message is the model's own —
# here, a persisted "incomplete" marker:
messages = [
    {"role": "user",      "content": "the caller's turn so far"},
    {"role": "assistant", "content": "○"},   # trailing assistant turn
]
# -> HTTP 400: "This model does not support assistant message
#    prefill. The conversation must end with a user message."

# The identical context, ending on the user, is accepted:
messages = [
    {"role": "assistant", "content": "the model's prior turn"},
    {"role": "user",      "content": "the caller's reply"},
]
# -> 200 OK
```

We hit this through two different doors. First: when multiple inference triggers queue up during a single pause — the smart turn model and a speech-timeout both fire within milliseconds — the first generation succeeds and appends its response to shared context. The queued second generation then dequeues and builds its request against that context, which now ends on the assistant's own reply. The API rejects it. Different triggers, identical wall.

Second: a standalone ○ is left trailing when the caller resumes speaking and the streaming aggregator folds the resumed words into the earlier user message rather than appending a fresh one — so the marker stays at the tail.

I reported both variants upstream ([#5035](https://github.com/pipecat-ai/pipecat/issues/5035), [#5036](https://github.com/pipecat-ai/pipecat/issues/5036)). The proposed fix is provider-agnostic: skip any generation whose context ends with an assistant message rather than debouncing triggers, since legitimate resumed-speech checks shouldn't be blocked either.

**The general lesson:** any design that writes model output back into the prompt as assistant turns inherits a new invariant — _the next request must never end on an assistant message._ Either guarantee a user or tool message always lands last, or skip any generation whose context currently ends on the assistant. The marker-in-context pattern is powerful, but it silently assumes prefill is legal, and on a growing set of models it isn't.

---

## Failure two: the stale verdict

This is the subtle one, and the most instructive. The completion verdict is not instantaneous. A detector triggers the inference at some moment; the ✓ comes back one full LLM round-trip later — a few hundred milliseconds to a couple of seconds. In that window, the caller can start talking again. If they do, the ✓ is stale: it was a correct judgment about a turn that is no longer over.

Picture a caller reading a list with a natural pause between items. The pause looks like an ending; a detector triggers an inference. The caller resumes with the next item. The inference — which was judging the moment before the resume — returns ✓, and the agent starts speaking directly over the caller's next words.

```
                pause → trigger              ✓ lands
                     │                          │
Caller    ▓▓▓▓▓▓▓▓▓▓│          ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│▓▓▓▓▓▓▓▓
          <item one> │          <……… item two ……│……>
                     │                          │
LLM                  ├─ inference in flight ───►│
                     │                          │
Bot/TTS              │                          ▓▓▓▓▓▓▓▓  ✓ speaks — over the caller
                                          collision └── ▲ ──┘
          0.0s            0.38s              0.62s
```

The verdict is correct about t = 0.38s and wrong about t = 0.62s. The caller resumed inside the inference window; the ✓ arrives stale and the agent barges in.

Frameworks anticipate part of this. The usual guard is: if the caller is speaking when a finalization lands, drop it. But that guard checks the _instantaneous_ speaking flag — and that's where it fails. With an aggressive VAD hangover (say 200ms), any micro-pause between the resumed words reads as "not speaking" at the exact instant the verdict arrives. The guard samples the level at the wrong microsecond, sees silence, and waves the stale verdict through. And even when the guard does catch it, it often only cancels the turn bookkeeping — the response text was already generated and is on its way to the speaker. The agent talks anyway.

The fix is a change of variable: don't ask whether the caller is speaking _now_ (a level); ask whether the caller has resumed _since this inference started_ (an edge). Latch the resume event, and treat any ✓ that arrives after a resume as stale.

```python
on caller_resumed_speaking():        # VAD "started (again)" — an edge
    resumed_since_inference = True

on inference_start():
    resumed_since_inference = False

on completion_verdict(mark):
    if mark == "✓" and resumed_since_inference:
        # stale: the caller is mid-utterance again
        suppress_response()        # don't speak the generated text
        keep_turn_open()           # let the new speech merge in;
                                   # re-decide at the next real pause
    else:
        speak(mark)
```

**The general lesson:** in an asynchronous turn system, a decision is only valid relative to the state at the moment it resolves, not the moment it was triggered. Guard on events (edges), not instantaneous levels — a level sampled at one unlucky instant lies. This is the same discipline as edge-triggered interrupts and compare-and-swap: validate against a transition, not a snapshot.

---

## Failure three: two timers, two clocks

The last one is quieter but worth naming because it's a whole category. Once you have incomplete verdicts, you need timers: after an ○, wait a few seconds and, if the caller never resumes, gently re-prompt. Separately, a watchdog guards against a turn that gets stuck — inference fired but nothing ever finalized — and force-closes it after some ceiling.

Two timers governing one state machine. The bug is when they count from different origins. Our re-engagement timer started when the verdict was produced; the watchdog started when inference was triggered — one full LLM round-trip earlier. So the watchdog was always ahead, and it kept pre-empting the re-engagement nudge, force-closing the turn and producing longer dead air than either timer intended. Nothing was individually misconfigured; the two clocks didn't share an origin.

**The general lesson:** when multiple timeouts govern one state machine, pin them to a single clock and a single origin — or reason explicitly about the offset between them. Independent timers with implicit, different epochs don't just misfire individually; they race, and the emergent behavior belongs to neither.

---

## You cannot debug this from a transcript

Every one of these was invisible in the finished transcript. "The agent interrupted me" and "there was a long silence" are the only symptoms a transcript preserves, and neither tells you why. The races live in the timing between components, and the transcript throws the timing away.

The tool that works is an event-sourced timeline of the turn lifecycle. Instrument the pipeline with an observer that emits a timestamped event — millisecond offsets from call start — for every meaningful transition:

- VAD started / stopped speaking
- STT interim (with text) and STT final (with text)
- Turn-detector trigger, and the completion verdict (✓ / ○ / ◐)
- LLM request start, LLM response end
- TTS started / stopped

Write those to a store you can query. Now a vague complaint becomes a precise reconstruction: _inference triggered at 0.38s, caller-resume interim at 0.52s, stale ✓ at 0.62s, TTS onset at 0.66s._ That's not a hunch about a race — that's the race, on a clock.

Treat turns as data. If you can't draw the last thirty seconds of a call as a labeled timing diagram straight from your telemetry, you can't debug its turn-taking yet.

---

## What to take away

1. Turn-taking is a layered, asynchronous system. Most of its bugs are races between layers, not defects inside any one of them.
2. Audio-only endpointing can't judge semantic completeness. Its blind spots are exactly the crispest human answers — short confirmations and read-out data.
3. Letting the LLM gate the turn trades acoustics for meaning. It's a real advance — and it couples your turn-taking to LLM latency and to the model API's constraints.
4. Any "write model output back into the prompt" pattern must respect trailing-message rules. On prefill-restricted models, a request ending on the assistant is a hard failure.
5. Validate asynchronous decisions against the state at resolution time. Guard on edges, not sampled levels.
6. Unify the epochs of every timer that touches one state machine, or their races will produce behavior you never designed.
7. Instrument the turn lifecycle as queryable events. It's the only lens that shows the races at all.

---

_Field notes from building real-time voice agents. Timing figures are drawn from production telephony traffic. The prefill bugs described in failure one were reported upstream to Pipecat ([#5035](https://github.com/pipecat-ai/pipecat/issues/5035), [#5036](https://github.com/pipecat-ai/pipecat/issues/5036))._
