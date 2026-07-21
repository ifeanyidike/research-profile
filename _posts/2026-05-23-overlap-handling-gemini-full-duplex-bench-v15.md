---
layout: post
title: "How Does Gemini Handle It When You Talk Over It?"
date: 2026-05-23 00:00:00-0000
description: I evaluated Gemini 3.1 Flash Live on four overlap scenarios from Full-Duplex-Bench v1.5 (user interruption, backchanneling, side conversation, and background speech) and found systematic prosodic adaptation after overlap events.
tags: voice-ai evaluation
categories: research
related_posts: false
related_publications: true
---

In a real conversation, people don't wait politely for each other to finish. They interrupt, they say "uh-huh" while the other person is still talking, they get distracted by someone else in the room. A voice AI system that can only handle clean turn-taking, where one person speaks and then the other, is not ready for the real world.

Full-duplex voice systems are designed to handle this messiness. They listen and speak simultaneously, so they can detect when you've interrupted them, decide whether to stop or keep going, and respond to the kind of overlapping speech that makes human conversation feel natural.

But how well do they actually do this? That's what I set out to measure.

## The four overlap scenarios

Full-Duplex-Bench v1.5 {% cite dike2026fullduplex_v15 %} defines four overlap scenarios, each requiring a different response from the model:

- **User interruption**: the user speaks while the model is talking, intending to take the floor. The model should stop and respond.
- **User backchannel**: the user says something brief ("uh-huh", "right") without intending to take over. The model should continue speaking.
- **Talking to another person**: the user speaks but is addressing someone else in the room. The model should resume after a brief pause.
- **Background speech**: there is speech in the environment, not directed at the model. The model should ignore it and resume.

I ran Gemini 3.1 Flash Live Preview (thinking_level=minimal) on all four scenarios on Apple Silicon using the MLX Whisper backend for transcription.

## What Gemini got right

On **user interruption**, Gemini responded correctly in **72% of cases**, stopping when the user took the floor and providing a relevant response. That is a strong result and close to the numbers reported in the original benchmark paper for the same model.

On **talking to another person** and **background speech**, Gemini resumed correctly in **50–63% of cases**. These are harder scenarios because the model must distinguish between speech directed at it and speech that isn't, without any explicit signal that tells it which is which.

## The prosodic finding

The most interesting result was not about whether Gemini responded correctly, but about _how it spoke_ after an overlap event.

After any overlap, regardless of type, Gemini's speech changed in a consistent pattern:

- **Speaking rate (WPM) increased**
- **Pitch increased**
- **Intensity (loudness) decreased**

This pattern held across scenarios and was statistically reliable. It suggests that Gemini adapts prosodically after being overlapped: speaking faster and higher but more softly, as if asserting continued presence without escalating dominance.

Whether this is intentional behaviour built into the model or an emergent property of its training data is an open question. But it is a measurable, systematic pattern, and as far as I can tell it has not been reported before for this model.

## Why the v1.5 metrics are more reliable than v1.0

In my [previous post](/blog/2026/asr-sensitivity-full-duplex-bench), I showed that Turn-Over Rate, the key metric in v1.0, varies by up to 62× across ASR backends on identical audio. The v1.5 metric suite is more robust. Stop latency and response latency are computed directly from audio timestamps using Voice Activity Detection, with no dependence on ASR word boundaries. The categorical behavior labels (respond, resume, uncertain, unknown) still use transcription, but the timing metrics are stable.

This is not a coincidence. It reflects a broader principle: metrics that measure acoustic events should be computed from acoustic signals, not from text derived from those signals.

## What comes next

These two papers, v1.0 on ASR sensitivity and v1.5 on overlap handling, are building toward a third paper that formalises this principle. The goal is a VAD-based evaluation framework for full-duplex turn-taking that is stable, reproducible, and does not depend on which transcription backend you happen to use.

If you are building or evaluating full-duplex voice systems and want to discuss the methodology, feel free to reach out.

**Preprint:** [Zenodo 10.5281/zenodo.20354457](https://doi.org/10.5281/zenodo.20354457) &nbsp;·&nbsp; **Code:** [GitHub](https://github.com/ifeanyidike/full-duplex-bench-repro)
