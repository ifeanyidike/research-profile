---
layout: post
title: "Generate Early, Speak Late: Why Voice Responses Need an Admission Gate"
date: 2026-08-27 00:00:00-0000
description: A voice agent can start preparing a reply during a pause, only for the caller to begin speaking again before the reply reaches the phone. We fixed that race by separating response generation from permission to speak.
tags: voice-ai engineering debugging real-time-systems
categories: engineering
related_posts: false
---

## TL;DR

- A voice agent can start generating a reply during a natural pause, then receive more
  caller speech before that reply becomes audible. A safety check at the start of generation
  cannot protect the end of the pipeline.
- We moved the final decision to a response admission gate after TTS and before playback. It
  holds a reply while caller activity is unresolved, drops it when real speech is confirmed,
  and releases it when the trigger turns out to be noise.
- The gate has to hold more than audio. Transcript words, completion frames, tool results,
  and conversation updates must be released or discarded with the same response.
- A later call exposed a second problem: inbound speech activity was actually a delayed copy
  of the assistant coming back through the phone. That made us treat barge-in as provisional
  until VAD and STT agreed on what had happened.
- The useful pattern is to start expensive work early, while keeping the final side effect
  late and reversible for as long as possible.

---

## This starts where turn detection ends

My previous post on
[LLM-based turn detection]({% post_url 2026-07-15-llm-turn-detection-voice-agents %})
was about deciding whether a caller had finished speaking. One of the production failures
in that post involved a stale model verdict: the model decided a turn was complete, the
caller resumed while that decision was in flight, and the assistant spoke over the new
speech.

We fixed that by remembering whether the caller had resumed since inference began. That
closed one race, but there was another one farther down the pipeline.

A model response does not become audible as soon as the first token arrives. It still has
to pass through TTS, buffering, pacing, the transport, the telephony provider, and the
phone:

```text
caller pauses
    ↓
turn detector triggers
    ↓
LLM produces first text       ← our old final check
    ↓
TTS creates audio
    ↓
pipeline buffers and paces it
    ↓
telephony provider receives it
    ↓
caller may hear it
```

On the calls we investigated, first model content arrived roughly half a second before bot
audio. Half a second is more than enough time for someone to take a breath, remember one
more detail, and carry on talking.

We were checking whether it was reasonable to _generate_ a reply and treating that as
permission to _play_ it. Production showed us that those needed to be separate decisions.

---

## The missing half-second

Two calls made the problem obvious. In both, the caller paused and the assistant began
preparing a reply. The caller then resumed, but the reply was already on its way through
TTS. In one call the assistant talked over about three seconds of ongoing speech.

The phone connection was fine. We found no packet loss or media-ordering problem, and the
incidents did not line up with a new deployment. The bug was in our own state handling.

There were two parts.

First, we already had a flag that meant “the caller resumed after this inference started.”
VAD set it correctly. Later, while building the model request, one feature-specific path
replaced that flag with a value unavailable to other assistant modes. For those modes, the
replacement value was always false.

In simplified form, the code behaved like this:

```python
# We saw the caller resume.
resumed_since_inference = True

# Request building later erased it for other assistant modes.
resumed_since_inference = resumed_during_feature_gate
```

The fix was not a better detector. It was to stop erasing evidence we had already observed:

```python
resumed_since_inference = (
    resumed_since_inference
    or resumed_during_feature_gate
    or vad_is_currently_active
)
```

Second, our last caller check happened when the model produced its first content. Even after
fixing the flag, speech could still begin during TTS:

```text
check says quiet        caller resumes           audio released
      │                       │                         │
      ├──── TTS + buffering ──┼────────────────────────►
                              └── the check is already over
```

Changing the silence timeout would only move this window around. A shorter timeout would
make us more eager and create more interruptions. A longer one would slow down every normal
turn. The problem was where we made the decision, not how many milliseconds we waited.

---

## Put the decision next to playback

We added a response admission gate after TTS and before the parts of the pipeline that
release audio and record what was played.

```text
audio in → VAD → STT → turn logic → LLM → TTS → ADMISSION → audio out
                                                   │
                                                   ├─ release
                                                   └─ discard
```

The model still starts early. TTS still starts early. On an ordinary turn, the gate passes
frames straight through and adds no intentional delay.

It only holds a response when the latest caller state is uncertain: perhaps the caller
resumed after inference started, VAD is still active, or a transcript is expected but has
not arrived yet.

Once it holds a response, one of three things happens:

1. Caller speech is confirmed, so the response is discarded.
2. The activity is rejected as noise, so the original frames are released in order.
3. The evidence never resolves before the deadline, so the response is discarded.

The last choice is deliberately conservative. From inside the gate, a stuck VAD signal can
look the same as real speech whose transcript has stalled. Releasing on timeout would be
safe in the first case and would recreate the original bug in the second. We would rather
lose one generated reply than knowingly risk talking over a person.

The existing response watchdog recovers from that discard. It may re-prompt after a bounded
silence, and the next response is generated from the conversation the caller actually
experienced.

---

## Dropping the audio is not enough

At first glance this looks like an audio-buffering problem:

```python
if caller_is_speaking:
    drop(tts_audio)
```

That would fix the sound while leaving the rest of the call in a bad state.

A generated response brings several kinds of data through the pipeline:

- TTS audio;
- word timing used by the transcript;
- events saying which assistant words were played;
- response-complete frames;
- tool calls and tool results;
- conversation updates that become model history;
- pacing and watchdog state.

Imagine dropping the audio but committing the assistant message. On the next turn, the
model sees a sentence the caller never heard. It may assume a question was already asked,
refer back to an explanation it never gave, or skip a required step. The transcript can
also show the discarded words as if they were spoken.

So the gate holds the response as one unit. A release preserves the original frame order. A
discard removes the audio, word events, completion, and context tail together. A handoff,
interruption, cancellation, node shutdown, or call end also invalidates anything still
waiting in the gate.

There is some defensive bookkeeping around this. Resolver tasks carry a generation number,
so a task that wakes up late cannot release frames after another path has already cancelled
them. It is mundane code, but it prevents the worst kind of race: audio coming back from a
response the system believes it discarded.

---

## The production call that proved the gate worked

Tests can reproduce a timing order, but we also wanted to see the same race occur on a real
call.

One production call gave us exactly that:

| Event                                  | Relative time |
| -------------------------------------- | ------------: |
| LLM request began                      |         0.0 s |
| First model content arrived            |        +1.3 s |
| New caller transcript evidence arrived |        +1.9 s |
| More caller evidence arrived           |        +2.9 s |
| Gate held and discarded the response   |        +3.0 s |
| Caller continued speaking until        |        +5.2 s |
| Next valid bot playback began          |        +8.1 s |

The response had already begun generating when the caller resumed. By the time its TTS
frames reached admission, the new caller evidence was available. The gate held the response
and discarded it almost immediately.

There was no bot-start or provider playout event for that reply. The provider’s
dual-channel recording showed caller activity through the interval and no bot activity
until the next valid response.

It was the same post-model, pre-audio window that caused the earlier collisions. This time
the response stopped at the boundary instead of reaching the caller.

---

## The inbound speaker was the assistant

Not long after that fix, we found a stranger failure.

The assistant was speaking when VAD detected activity on the inbound channel. Our barge-in
path did what it was supposed to do and stopped the assistant. STT then returned a
high-confidence five-word final, and the model interpreted it as the caller asking for more
time. A few seconds later the assistant played its scripted wait acknowledgement.

The caller had not spoken.

The inbound audio was a delayed, device-processed copy of the assistant’s own voice. Four of
the five transcribed words matched the opening of the assistant response. The first word was
different, which was enough to miss our existing exact-prefix echo check.

The timeline made the ordering problem clear:

| Event                               | Time from playback start |
| ----------------------------------- | -----------------------: |
| Assistant playback began            |                    0.0 s |
| Inbound activity appeared           |                   +1.0 s |
| Playback was cleared                |                   +1.3 s |
| Five-word STT final arrived         |                   +2.2 s |
| Model classified it as a long wait  |                   +4.8 s |
| Scripted wait acknowledgement began |                   +8.3 s |

Only the beginning of the generated response was recorded as played.

No individual component had behaved wildly:

- VAD saw speech-like audio;
- barge-in stopped playback;
- STT returned plausible words;
- the model interpreted those words as a request to wait;
- the wait coordinator acknowledged the request once.

The mistake happened before all of that. We had allowed assistant echo to open a caller
turn.

---

## How we established that it was echo

The transcript was suggestive, but matching words are not enough. A caller can repeat the
assistant or correct something it said.

The provider’s dual-channel recording gave us inbound and outbound audio on the same clock.
The suspicious inbound segment matched the assistant channel best at a delay of about
700 milliseconds. Its 10 ms energy-envelope correlation was around 0.65, and its
log-spectral cosine similarity was around 0.95. The raw waveforms were less similar, which
is what I would expect after the audio has passed through a speaker, microphone, handset
processing, and a phone codec.

Another interruption in the same call gave us a useful comparison. None of its first five
words matched the assistant, and its energy-envelope correlation was about 0.27.

Put together, the evidence described a simple chain:

```text
assistant audio
    ↓ about 700 ms through the device and phone path
inbound speech-like audio
    ↓
VAD starts
    ↓
barge-in clears playback
    ↓
STT returns a near-copy of the assistant opening
    ↓
the near-copy becomes a caller turn
```

Our exact echo check ran when the final transcript arrived. By then playback had already
been cleared for nearly a second. Even a perfect transcript classifier could prevent the
phantom turn from reaching the model, but it could not restore the sentence we had already
cut off.

We needed the post-playback side of admission to wait for more evidence too.

---

## Barge-in became provisional

Before this change, VAD during assistant playback meant “clear the audio now.” That is the
right response to a real interruption and the wrong response to echo.

The new path treats VAD as a provisional interruption:

1. VAD still flows to STT and the turn logic immediately.
2. New assistant frames are held instead of being committed or thrown away.
3. The gate waits for the turn strategy to resolve that specific VAD sequence.
4. Accepted caller text clears provider audio and discards the held tail.
5. Echo or noise releases the tail in its original order.
6. A stalled resolver fails closed after the deadline, clearing the queued tail and keeping
   only the assistant prefix that was already released.

Normal playback is unchanged. The extra grace applies only after suspicious inbound
activity.

The sequence number matters. If another VAD start arrives while the gate is draining held
frames, it must stop and hold again. Otherwise we could release into newer caller speech.
We also cap how many times the pre-audio and post-playback paths can re-hold a response, so
continuous noise cannot suspend it forever.

This is slower than clearing on the first VAD edge, but only in the ambiguous case. It buys
enough time to distinguish a real caller from a false acoustic trigger.

---

## The matcher is narrow on purpose

We considered using the acoustic correlation directly as the gate. That would have been
easy to justify from this one call and dangerous as a general rule.

An always-on energy tripwire had fired repeatedly across many unrelated calls. It was
useful for investigation, but far too noisy to decide when caller speech should be ignored.
A good diagnostic signal is not automatically a safe behavior signal.

The text fallback we shipped is intentionally constrained:

- keep the existing exact-prefix check;
- enable the new behavior only for selected assistants;
- start matching at the first word;
- require at least five aligned words;
- allow exactly one substitution;
- reject insertions, deletions, substring matches, and mid-sentence matches;
- require the match to occur within the existing six-second window.

The limits came from the failure we had actually observed. The final differed from the
assistant opening at one position. Five words with one substitution still leaves 80%
aligned evidence. Starting at word zero reduces the chance that an ordinary sentence is
gated because it happens to contain a phrase the assistant used earlier.

We ran the rule against a historical set of known exact echo gates and accepted
interruptions. It preserved every exact gate, recovered the independently confirmed
near-echo case, and added no new one-substitution gates among the other reviewed
interruptions.

That gave us enough confidence for a scoped canary. It did not make the ambiguity disappear.
A caller who immediately repeats the assistant’s opening with one changed word looks the
same as this echo at the text layer. The feature therefore remained default-off outside a
small canary, with telemetry recording which match rule fired.

The recording established the cause. The matcher is just a careful response to that known
shape, not a claim that five words can prove acoustic echo.

---

## What happens when the gate cannot decide

Code in the speech path needs an explicit failure policy. Otherwise a provider timeout or
cleanup race eventually invents one for you.

These are the rules we settled on:

- With no unresolved caller activity, frames pass through normally.
- Confirmed caller speech discards stale output and clears any provider-queued tail.
- Rejected echo or noise releases held frames in order.
- A resolver error or deadline discards rather than releasing into uncertainty.
- Handoff, interruption, shutdown, and call cleanup discard and cancel pending work.
- If part of the assistant response was already released, only that audible prefix enters
  played context.

The deadline case is the awkward one. A stuck VAD state might cause us to throw away a
perfectly good response. Real caller speech with delayed STT might look exactly the same.
There is no safe local test that separates them, so the gate chooses the error that does not
talk over a person.

The caller may hear a short silence before the watchdog recovers. That is not ideal, but it
is bounded and visible in telemetry. More importantly, the transcript and future model
context do not pretend the discarded response was spoken.

---

## The cases we have not solved

The production bugs that led to this work are fixed, but there are still shapes the current
rule does not cover.

A local loopback harness found two:

1. A recognizer can split one echoed utterance into several finals. The first fragment
   begins at word zero and is gated; a later continuation begins in the middle of the
   assistant sentence and can escape the matcher.
2. Scripted greetings take a different playback path from model responses. Echo-triggered
   VAD can still truncate a greeting because the provisional tail hold does not wrap that
   path.

We did not find either pattern in the production corpus we reviewed. None of the accepted
interruptions appeared within the monitored interval after an echo gate, and the
greeting-window clears we inspected contained text unrelated to the greeting.

For now those are monitored edge cases, not reasons to make the matcher broader. Every new
echo rule also creates a new way to ignore a real caller, so I want production evidence
before adding one.

---

_Field notes from building production telephony voice agents. Relative timings and
diagnostic measurements come from anonymized call events, provider-owned dual-channel
recordings, deterministic replays, and a read-only historical interruption corpus._
