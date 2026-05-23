---
layout: post
title: "Why Your Full-Duplex Benchmark Score Depends on Which Transcription Tool You Use"
date: 2026-05-20 00:00:00-0000
description: I reproduced Full-Duplex-Bench v1.0 for Gemini 3.1 Flash Live and found that a key evaluation metric varies by up to 62× just from switching the ASR backend — on the exact same audio.
tags: speech voice-ai evaluation full-duplex
categories: research
related_posts: false
related_publications: true
---

When you evaluate a full-duplex voice AI system, you want to know: does it handle turn-taking well? Does it stop talking when the user interrupts? Does it respond at the right moment? These are the questions that separate a natural-feeling voice agent from one that constantly talks over you.

The standard way to measure this is a metric called **Turn-Over Rate (TOR)** — roughly, the fraction of cases where the model correctly yielded the floor when the user spoke. Higher is better. The original Full-Duplex-Bench {% cite dike2026fullduplex %} uses this as one of its primary metrics.

There is a problem with how TOR is computed. It relies on ASR (automatic speech recognition) to transcribe the model's output and extract word boundary timestamps. The metric then checks whether the last word in the model's transcript ended before the user started speaking. Simple enough — but that means your TOR score depends not just on how well your model behaves, but on which transcription system you used to analyze it.

## What I did

I reproduced the Full-Duplex-Bench v1.0 evaluation pipeline for **Gemini 3.1 Flash Live Preview** on Apple Silicon (M3 Max, no CUDA). The original benchmark uses `nvidia/parakeet-tdt-0.6b-v2` via NeMo, which requires a CUDA GPU. I replaced it with two alternatives:

- **MLX Whisper-v3** — runs natively on Apple Silicon via mlx-whisper, no GPU needed
- **AssemblyAI** — cloud-based REST API, GPU-free

I ran the full evaluation pipeline with both backends on identical audio and compared the scores.

## The finding

The results were striking. On the pause handling task, TOR varied from **0.856** (MLX Whisper) to **0.111** (AssemblyAI) — nearly an **8× difference** on the same model output. On the synthetic pause handling task, the gap was even larger: **0.934** vs **0.015**, a **62× difference**.

To be clear: same model, same audio recordings, same evaluation logic. The only thing that changed was which tool transcribed the output.

The reason is that ASR backends place word boundary timestamps differently. MLX Whisper tends to assign timestamps closer to when words actually end acoustically. AssemblyAI uses more conservative boundaries, so it often places the final word endpoint later in the audio — causing the metric to classify a correct yielding as a failure.

Not all metrics were sensitive. JSD and backchannel frequency — which depend on audio timestamps from VAD rather than ASR word boundaries — were **identical across both backends**. LLM-as-judge scores for user interruption quality were nearly identical too (3.53 vs 3.51). The instability is specific to metrics that rely on ASR word boundary timestamps.

## Why this matters

If you publish a TOR score without specifying your ASR backend, the number is not reproducible. Worse, if two papers evaluate different models with different ASR backends, their TOR scores are not comparable — even if the evaluation framework is otherwise identical.

This is not a minor implementation detail. It is a methodological gap that affects the reliability of the entire evaluation ecosystem for full-duplex dialogue systems.

The fix is not simply "use a better ASR." No ASR system produces ground-truth word boundary timestamps — they are a byproduct of language modeling, not acoustic detection. TOR is fundamentally measuring an acoustic event (when does speech stop?) using a linguistic tool (where does the transcript end?). That mismatch is the root cause.

## What comes next

This finding motivates a cleaner approach: compute TOR directly from the audio signal using Voice Activity Detection, which does not depend on transcription at all. I am currently developing and validating a VAD-based alternative metric that is stable across backends. That work will be the subject of a future paper.

For now: if you are benchmarking full-duplex systems using TOR, pin your ASR backend, report it explicitly, and treat cross-paper comparisons with caution.

**Preprint:** [Zenodo 10.5281/zenodo.20305268](https://doi.org/10.5281/zenodo.20305268) &nbsp;·&nbsp; **Code:** [GitHub](https://github.com/ifeanyidike/full-duplex-bench-repro)
