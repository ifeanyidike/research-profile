---
layout: post
title: "Streaming STT Has No Wall Clock"
date: 2026-07-12 00:00:00-0000
description: A caller's sentence vanished from a production voice call with no error anywhere. The hunt for it went through Deepgram endpointing internals, a mobile-network theory that died on the standards, Twilio's undocumented silence behavior, and four-day-old logs. What it found applies to anyone building real-time voice.
tags: voice-ai engineering debugging speech
categories: engineering
related_posts: false
---

## TL;DR

- A caller ordered items over the phone. Our agent confirmed half the order. The middle of the sentence was gone from the transcript, replaced by a phonetically similar mis-decode, and no error was logged anywhere. The stack: Twilio Media Streams → Pipecat → Deepgram streaming STT (nova-3), hosted on Fly.io.
- **Streaming STT engines measure pauses in audio, not in time.** If your pipeline stops sending frames, the model's clock stops with it. Speech that never gets a finalization is speech a finals-only pipeline silently throws away.
- **The measurement that "confirmed" my first theory had no power to test it.** A number can be real and still be worthless as evidence.
- **Twilio keeps sending frames during silence, but the docs never say so.** The strongest evidence is indirect: if it weren't true, every Twilio-plus-Deepgram deployment on the internet would be dropping calls constantly.
- **The same stalled stream corrupted our recording and our transcript differently.** Each artifact alone pointed to a wrong theory. Together they pinned the real layer.
- The fix that matters isn't a fix at all: ~20 lines of gap logging that stay on in production, so the next stall names its own culprit.

---

## One lost sentence

A caller told our phone agent something like _"give me six packs of the three-quarter clips, size 14, the long ones."_ The agent confirmed back half the order. The saved transcript had a hole in the middle of the sentence, patched over with a phonetically similar mis-decode. Nothing crashed. Nothing logged an error. As far as the system was concerned, the call had gone fine.

I went through three plausible theories before the logs of the actual incident settled it. Each theory came with a number attached that seemed to support it, which is exactly what made this bug worth writing up. Almost everything I learned along the way contradicts something the docs imply, or fills in something they don't say at all.

---

## Finding 1: Deepgram's endpointing clock only advances when you send audio

Streaming STT engines finalize a transcript when they detect a pause. The subtle part: a pause is silent _audio_, not silent _time_. Deepgram's endpointing runs on a voice activity detector that looks at the audio you send it. If your pipeline stops sending frames, you haven't given the model a pause. You've stopped its clock mid-word.

I verified this with a raw-websocket replay harness (`model=nova-3, encoding=linear16, sample_rate=8000, interim_results=true, endpointing=500`), pushing the same recording three ways:

| Input pattern                               | Endpointing behavior                                                                                                                                                                                                              |
| ------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Continuous audio, real silences included    | `speech_final` about 1.3s after each pause                                                                                                                                                                                        |
| Silent stretches withheld (frames not sent) | **No `speech_final` at all.** The same interim result re-emitted over and over; the only finalization was the periodic `is_final` flush, which needs roughly 3s of _accumulated audio_ and so arrived about 18s late in wall time |
| Gaps filled with zero-valued PCM            | `speech_final` in 0.7s                                                                                                                                                                                                            |

Three things follow from this that matter in production:

- A finals-only pipeline will silently lose any speech whose finalization never comes. Ours discards interim text; the interim handler in the framework is literally `pass`.
- Deepgram's `Finalize` message is the escape hatch. It forces immediate processing of buffered audio. But the docs carry a caveat that bit us in testing: a response is "not guaranteed if there is no significant amount of audio data to process." Your force-flush can legitimately return nothing on short utterances.
- `KeepAlive` prevents the 10-second NET-0001 connection kill but produces no transcripts. A connection that survives a silence gap tells you nothing about whether audio flowed through it.

---

## Finding 2: The number that "confirmed" my theory measured nothing

Early on I computed that only 31.3 seconds of audio had non-trivial energy across a 234.6-second call. I concluded the caller's mobile network was doing DTX (discontinuous transmission, where handsets genuinely stop transmitting during silence) and starving the STT of frames.

The number was real. The inference was wrong twice over.

First, RMS analysis of a recording cannot tell the difference between "no frames arrived" and "frames of digital silence arrived." Both look identical in the file. And in a call where the bot does most of the talking, 13% caller speech is just... a conversation. The measurement had no power to distinguish my hypothesis from a perfectly healthy call.

Second, the theory dies on the standards. In GSM and UMTS networks, DTX is a radio-link optimization: the handset sends SID (silence descriptor) frames, and the transcoder at the edge of the mobile network regenerates comfort noise into ordinary speech frames before the call ever reaches a wired leg. RFC 3389 exists precisely because G.711 has no comfort noise built into the codec. A mobile caller's silence reaches your telephony provider as continuous low-level noise, not as absent packets. DTX gaps can survive on pure-IP legs with negotiated comfort noise payloads, but that's a different network topology than a phone call.

The lesson I keep relearning: if a metric can't distinguish your hypothesis from the null, it isn't evidence, no matter how precise it looks.

---

## Finding 3: Twilio's silence behavior is undocumented and load-bearing

Whether Media Streams keeps sending `media` messages while the caller is silent decides your whole error model. If silence means no frames, then gaps in the stream are normal and you should tolerate them. If silence arrives as frames of quiet audio, then a gap in the stream always means something is broken. These lead to opposite designs, and the docs don't say which world you're in.

The answer (continuous ~20ms frames, 50 per second, with silence as quiet μ-law payloads) has to be assembled from scraps:

- A Twilio blog post mentions, in passing, that "partial transcripts can have empty text when audio data containing silence is sent."
- The Voice SDK docs say muted calls send silent audio frames. Silence-as-frames is the platform's philosophy.
- The best evidence is indirect: Deepgram's own Twilio integration pipes media straight through with no KeepAlives, and Deepgram closes any stream that goes 10 seconds without audio. If Twilio paused during silence, every Twilio-plus-Deepgram deployment on the internet would drop mid-call, constantly. They don't.

Two adjacent facts from Twilio's Voice Insights docs deserve more attention than they get. Twilio does no packet-loss concealment or jitter buffering on its media edges; degradation coming in from a carrier is passed through to you. And comfort noise packets Twilio receives are not propagated internally. So a bad carrier leg _can_ surface as genuine holes in your media stream; Twilio won't paper over it. The one gift you get in return: every media message carries a stream-relative `timestamp` and a `chunk` sequence number. That turned out to be the forensic tool this whole investigation was missing.

---

## Finding 4: One stalled stream, two different corruptions

Fly.io keeps about 7 days of logs, fetchable by nanosecond timestamp (`GET /api/v1/apps/:app/logs?next_token=<ns>`; depending on your token type, the header is `Authorization: FlyV1 <token>`, not `Bearer`). The failing call was four days old: inside the window. That flipped the investigation from "try to reproduce a rare bug" to "read the actual incident." Worth noting because we had made multiple instrumented test calls by then, and every single one came back pristine.

The failure signature, pieced together from DEBUG logs:

- **28.7 seconds of zero pipeline events.** No VAD transitions, no interim transcripts, spanning exactly the doomed sentence. HTTP health checks answered 200 the whole time. The event loop was alive; the inbound audio just wasn't reaching the processors.
- **Then a burst.** VAD turn-start. The neural end-of-turn model returned COMPLETE only 1.3s later, because the flushed audio ended on a finished-sounding edge. Three `speech_final` results landed inside two seconds. The middle clause was gone, replaced by the mis-decode. And one trailing fragment surfaced 13 seconds later, which turned out to be the caller correcting the bot. A good reminder that log archaeology needs the recording open next to it.

The recording cleared the model twice over:

1. **The full sentence is in our own recording, clean.** Batch nova-3, the same model as the live session, transcribes it perfectly, word timings and all. The audio was intact and the model was capable. The failure lives entirely in the timing of delivery into the streaming session.
2. **The recording is missing a different phrase, one the live STT heard fine.** The recorder aligns audio buffers to a wall clock; the STT consumes frames in the order they arrive. Fed the same stall-then-burst, each one coped differently and each corrupted a different span. Same frames in, two disjoint failure surfaces out. Either artifact on its own supports a wrong theory. Together they pin the layer.

While ruling things out inside the framework, I audited the full inbound audio path and found exactly one code path that _deletes_ audio rather than delaying it: the Deepgram service silently drops every chunk while its connection is down mid-reconnect. The send is guarded by `if self._connection:` with no else and no buffer. Zero reconnect log lines in this call cleared it here, but it's a real word-eater with the same symptom fingerprint, worth knowing about if you run this stack. Everything else in the path (transport queues, inter-worker buses) is unbounded asyncio queues, which can delay audio but never lose it.

One more thing from the same audit, filed under "check your framework's defaults": the neural turn analyzer was active on calls that predate the PR that supposedly added it, because the library's default turn-stop strategy instantiates one whenever the app passes no strategies. "We haven't enabled X" is not the same as "X isn't running."

---

## Finding 5: Make the next stall name its own culprit

One question was left: _where_ do frames stall? The candidates were the carrier leg, Twilio's egress, the network path to our host, or in-process scheduling. Four different owners, four different fixes. Building all four blind would have been weeks of wasted work.

The resolution is about 20 lines, and it leans on Twilio's per-message clock:

- At the websocket: log the delta in Twilio's `timestamp` field against the wall-clock arrival delta, per media message, and warn when either jumps past 500ms.
- At the pipeline's audio input: one more inter-frame gap check.

Every future stall then identifies itself in a single log line:

| Signature                                       | Verdict                                                                           |
| ----------------------------------------------- | --------------------------------------------------------------------------------- |
| Twilio's timestamps jump across the gap         | Twilio never sent the audio: carrier or provider problem; escalate with call SIDs |
| Timestamps contiguous, frames arrive in a lump  | Network-path delay: a TCP stall between provider and host                         |
| Websocket arrivals on time, pipeline input late | In-process: event loop or queue stall, and the log names the stage                |

The operational point matters more than the code: this ships to production and stays on. It's silent on healthy calls, so it costs nothing, and rare failures don't reproduce on demand. Our test calls proved that by refusing to fail. Real traffic does the reproducing. Your job is to have the evidence already being written down when it does.

---

## What actually moved the investigation

Every wrong turn in this hunt was a plausible theory with a number attached. What moved it forward each time was distrusting my own conclusions: replaying audio under controlled conditions instead of trusting intuition about the STT, reading the framework source and the RFCs instead of folklore, mining the real incident's logs instead of chasing reproductions that kept coming back clean, and finally instrumenting so the next incident argues its own case.

The model wasn't deaf and the audio wasn't lost. The pipeline's sense of _when_ had broken. And in streaming speech, _when_ is the only clock there is.
