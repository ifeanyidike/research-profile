---
layout: page
title: Full-Duplex Conversational AI — Benchmark Reproduction & Extension
description: Reproduction and extension of Full-Duplex-Bench (Lin et al., 2025), evaluating turn-taking and overlap handling in voice AI systems.
importance: 4
category: Research
related_publications: true
---

**Status:** ✅ Complete &nbsp;·&nbsp; **Type:** Paper Reproduction & Extension

---

### Overview

This project reproduces and extends **Full-Duplex-Bench** (Lin et al., 2025), a benchmark for evaluating turn-taking, overlap handling, and real-time responsiveness in full-duplex conversational voice AI systems.

Full-duplex voice systems — where the model can both listen and speak simultaneously, handling interruptions and backchannels naturally — represent the frontier of conversational AI. Unlike traditional turn-based ASR → LLM → TTS pipelines, they require fundamentally different architecture and face distinct evaluation challenges.

### Motivation

My work building production voice AI systems at Datastrut AI exposed the real-world difficulty of the problems this benchmark measures. The multi-caller feature I built — where construction site foremen and supervisors collaborate on a single AI-assisted call — surfaces exactly the multi-speaker overlap and turn-negotiation challenges that Full-Duplex-Bench evaluates.

---

### Part 1: v1.0 Reproduction + ASR Sensitivity Analysis (Complete)

We reproduced the Full-Duplex-Bench v1.0 evaluation pipeline for **Gemini 3.1 Flash Live Preview** on Apple Silicon (M3 Max, no CUDA) and ran a controlled comparison of three ASR backends to measure how much transcription system choice affects the final evaluation scores.

**Key finding:** TOR and response latency vary significantly across ASR backends — up to 62× on identical audio — while JSD, backchannel frequency, and LLM-as-judge scores remain stable. Any benchmark using TOR should pin and report its ASR backend.

**Preprint:** [Zenodo 10.5281/zenodo.20305268](https://doi.org/10.5281/zenodo.20305268) &nbsp;·&nbsp; **Code:** [GitHub](https://github.com/ifeanyidike/full-duplex-bench-repro)

---

### Part 2: v1.5 Overlap Handling (Complete)

v1.5 extends the benchmark with four simulated overlap scenarios: user interruption, listener backchannel, side conversation, and ambient speech, using a richer metric suite — categorical dialogue behaviors, prosodic adaptation (pitch, WPM, intensity), and stop/response latency.

**Key findings:** Gemini correctly responds to user interruptions in 72% of cases and resumes after non-addressed overlap in 50–63% of cases. After overlap events, speaking rate and pitch increase while intensity drops — a statistically reliable pattern suggesting prosodic adaptation without dominance assertion.

**Preprint:** [Zenodo 10.5281/zenodo.20354457](https://doi.org/10.5281/zenodo.20354457) &nbsp;·&nbsp; **Code:** [GitHub](https://github.com/ifeanyidike/full-duplex-bench-repro)

---

### References

- Lin et al., "Full-Duplex-Bench: A Benchmark for Full-Duplex Speech Language Models," ASRU 2025. [GitHub](https://github.com/DanielLin94144/Full-Duplex-Bench)
