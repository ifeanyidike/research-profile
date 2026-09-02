---
layout: post
title: "The Sentence Nobody Heard: What a Voice-AI Recording Actually Proves"
date: 2026-09-02 00:00:00-0000
description: A voice-agent transcript and recording can both contain words the caller never heard. We fixed this by recording closer to playback and using one provider clock for both sides of the call.
tags: voice-ai engineering debugging observability
categories: engineering
related_posts: false
---

## TL;DR

- TTS can create a full sentence before the phone plays it. A recorder placed near TTS can
  therefore save words the caller never heard.
- Moving the recording point closer to playback removed audio that was cancelled before
  release. It still could not prove what happened after the audio left our application.
- Our local stereo file kept the two speakers separate, but it built each channel with a
  different clock. This made some pauses and overlaps look wrong.
- We switched to the telephony provider's dual-channel recording. Both sides of the call
  now share one timeline in the provider's file.
- We also changed how we build transcripts during assistant handoffs. Words are now grouped
  by assistant and conversation context, not by timestamps alone.

---

## The sentence nobody heard

A caller began speaking while the voice agent was halfway through a sentence. The caller
kept talking, and the agent stopped playing on the phone.

However, text-to-speech had already created the rest of the agent's sentence. In this call,
our TTS service generated audio faster than the phone played it. Our old recorder sat
immediately after TTS, so it had already saved that complete synthetic audio. It did not
add new words after the interruption. It had recorded the words before playback stopped.

The saved artifacts therefore looked like this:

```text
TTS created:          the complete assistant sentence
Old recorder saved:  the complete assistant sentence
Phone played:        only the beginning, then stopped
Caller:              began speaking and continued
```

The transcript also used [word timings produced by
TTS](https://elevenlabs.io/docs/eleven-api/guides/how-to/websockets/realtime-tts), so it
contained the same unheard ending. The transcript and local recording agreed because both
came from the generation side of the pipeline. They showed what TTS had prepared, not what
the phone had played.

This was the first useful distinction:

| What happened                  | Where we can see it                          |
| ------------------------------ | -------------------------------------------- |
| The model wrote the words      | Model output                                 |
| TTS created the audio          | TTS audio and word timings                   |
| Our application queued it      | The audio output queue                       |
| Our application released it    | The output stage                             |
| Twilio received or sent it     | Twilio events and the Twilio recording       |
| The caller's speaker played it | No server-side file can prove this by itself |

We were using evidence from the second row to make a claim about the last one.

---

## First fix: record near release

The first fix was to record closer to playback.

For the transcript, we sent each TTS word through the same path as its audio. The transcript
recorder sat after the stage that sends audio at phone-call speed. It saved a word only
when the matching audio reached that stage.

If the caller interrupted, the pipeline cancelled the remaining audio. Those words never
reached the transcript recorder. The saved turn now ended at the last whole word released,
not the last word created by TTS.

We made a similar change for audio. We moved the assistant's recording point out of the TTS
worker and into the main media path. It now captured assistant audio after the transport
had paced and sent it. It captured caller audio after echo cancellation.

This removed the unheard tail from the local recording. But I had to be careful about the
language I used. The new recorder showed what we had **released for playback**.

Released still does not mean heard. A successful WebSocket send only tells us that our
output path accepted the audio. It is not a playback acknowledgement from Twilio. Twilio
uses a separate [`mark` protocol](https://www.twilio.com/docs/voice/media-streams/websocket-messages#mark-message)
to track whether buffered media has completed or been cleared. Our recorder did not wait
for those provider events. Even they say nothing about the phone's final buffer or speaker.

We could now say that our output path released the audio. We could not say that the caller
heard it.

## Separate channels did not give us a shared clock

In [Moving Our Voice AI to Pipecat]({% post_url
2026-07-05-pipecat-migration-voice-ai %}), I wrote that a stereo recording with the caller
on one side and the assistant on the other made interruption debugging straightforward.
That was too broad.

Separate channels tell me who made each sound. They do not tell me exactly when each person
spoke if the channels use different clocks.

Our local recorder used two clocks. It placed caller samples back to back, based on sample
count. It placed assistant audio based on when each chunk reached the recorder. Short gaps
were removed. Longer gaps were estimated with the application's clock.

The result looked like one timeline, but it was built from two different time sources.

This caused visible errors in production recordings. In one case, call events showed that
the caller stopped before the assistant began. The stereo recording made them sound as if
they spoke at the same time. Some recordings also ran longer than the call-event timeline.
The difference was larger when callers interrupted the assistant.

The event log could not tell us which timeline was right. A voice activity detector (VAD)
stop only means that the detector stopped seeing caller speech. A bot-start event only
means that our application released assistant audio. Neither event points to an exact
sample in the WAV file.

The local file was still useful. It kept the two speakers separate and showed which audio
reached our output path. But it could not prove that the two speakers overlapped at the
provider.

---

## Let the provider own the media timeline

We stopped using the local mix as the main call recording. We moved that job to the
telephony provider.

Twilio now starts a recording before it opens the media stream. We record both tracks in
separate channels and keep the silence. Twilio documents these options for
[`<Start><Recording>`](https://www.twilio.com/docs/voice/twiml/recording). Its
[Recording resource](https://www.twilio.com/docs/voice/api/recording) also confirms that a
two-party dual-channel file stores each call leg in a separate channel.

Because the tracks are two channels in one file, they share the file's time axis.

That changed what the file meant:

```text
local reconstruction

caller samples ── caller sample count ──┐
                                        ├── estimated stereo timeline
assistant audio ─ local arrival clock ──┘

provider recording

inbound track  ──┐
                 ├── one provider media timeline
outbound track ──┘
```

The provider recording is still not a microphone inside the caller's room. Twilio defines
the [inbound track as audio it receives and the outbound track as audio it
generates](https://www.twilio.com/docs/configurations/recording#composition-policy). A phone
can still buffer or suppress audio after that point.

However, both tracks now use the same file time axis. We can make reliable claims about
when they overlapped at Twilio.

Starting the recording was the easy part. We also had to make sure the saved file was safe
to trust.

## Download and check the recording

In our flow, the live media connection closes before we fetch the provider recording. The
call is over, but the recording is not yet stored in our system. We wait for Twilio's
[`completed` callback](https://www.twilio.com/docs/voice/twiml/recording#recordingstatuscallbackevent),
which means the file has finished processing and is available.

The callback includes the [exact recording
ID](https://www.twilio.com/docs/voice/twiml/recording#recordingstatuscallback). Twilio also
[signs its webhook
requests](https://www.twilio.com/docs/usage/webhooks/getting-started-twilio-webhooks#validate-that-webhook-requests-are-coming-from-twilio),
which lets us reject callbacks that did not come from Twilio. We then download the file
through an authenticated path and check it before we publish its URL.

We only accept the file if:

- the response is a readable WAV, not an HTML error page with a successful status;
- it is non-empty, uncompressed, dual-channel, 8 kHz, 16-bit audio;
- its header, frame body, and reported duration agree within a small tolerance;
- the transfer stays within time and size limits.

After the file passes these checks, we upload it to a fixed storage path for that call. A
retry writes to the same place, so it does not create duplicate files.

If the download or validation fails, the call finishes without a recording URL. We record
a safe error event instead. We never publish a link to a file we have not checked.

A call can produce more than one provider recording during retries. We delete only the
recording named in the signed callback. We also wait until our call record and transcript
job have saved the local copy. If deletion fails, a retry queue tries again later.

We save the call's end time as soon as the media stream closes. The later download does not
change the call duration. A three-minute conversation remains a three-minute conversation,
even if the recording takes another minute to arrive.

These checks do not change the audio. They make the recording URL meaningful. If the URL
exists, we know that we downloaded and validated the file.

---

## The text had an identity problem too

We later found a related problem during an assistant handoff.

One assistant finished speaking. A second assistant then gave its greeting. The caller
heard the two sentences in the correct order. The transcript split them into many
alternating fragments and displayed them as one broken assistant turn.

No words were missing. Their timestamps were the problem.

Each assistant had its own TTS service. The second assistant could start creating its
greeting while the first assistant's audio was still waiting to play. Their TTS word
timestamps overlapped, even though the audio played one sentence after the other.

Our transcript recorder used one shared word buffer. As words arrived, the buffer kept
switching between the two assistants. The code that built the final transcript made the
problem worse. It grouped nearby messages by role, and both speakers had the role
`assistant`.

We changed the recorder to keep a separate word buffer for each assistant and conversation
context. An end marker closes only the matching buffer. The formatter also starts a new
turn when the assistant ID changes.

This fixed the word order and kept the two turns separate. It did not make every timestamp
exact. The first word of the second greeting can still have an early time. But one
assistant's timing can no longer break apart the other assistant's sentence.

Audio needed one media clock. Text needed a playback boundary and a stable speaker ID.

## The new recording solved another bug

The provider recording helped us solve another incident soon after. In
[Generate Early, Speak Late]({% post_url
2026-08-27-generate-early-speak-late-voice-response-admission %}), the inbound channel
seemed to contain a caller interruption. Because both channels shared the provider file's
time axis, we could compare them directly. The inbound speech was a delayed copy of the
assistant. The caller had not spoken.

That diagnosis would have been much weaker with our local mix. We would first have had to
argue that the delay and overlap were not artifacts of the recorder itself.

Now, when I open a call recording, I ask four questions. Where was it captured? Which clock
placed the samples? What does each channel contain? What can still happen after capture?

Until I know those answers, I treat the file as evidence of one part of the call, not the
whole call.
