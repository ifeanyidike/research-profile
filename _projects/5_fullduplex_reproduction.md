---
layout: page
title: Full-Duplex Conversational AI — Benchmark Reproduction & Extension
description: Reproduction and extension of Full-Duplex-Bench v1.5 (Lin et al., 2025), evaluating turn-taking and multi-speaker dialogue in voice AI systems. In progress, Summer 2026.
importance: 5
category: Research
related_publications: false
---

**Status:** 🔬 In Progress &nbsp;·&nbsp; **Target:** Summer 2026 &nbsp;·&nbsp; **Type:** Paper Reproduction & Extension

---

### Overview

This project reproduces and extends **Full-Duplex-Bench v1.5** (Lin et al., 2025, ASRU), a benchmark for evaluating turn-taking, overlap handling, and real-time responsiveness in full-duplex conversational voice AI systems.

Full-duplex voice systems — where the model can both listen and speak simultaneously, handling interruptions and back-channels naturally — represent the frontier of conversational AI. Unlike traditional turn-based ASR → LLM → TTS pipelines, full-duplex systems require fundamentally different architecture and face distinct evaluation challenges.

### Motivation

My work building production voice AI systems at Datastrut AI exposed the real-world difficulty of the problems this benchmark measures. The multi-caller feature I built — where construction site foremen and supervisors collaborate on a single AI-assisted call — surfaces exactly the multi-speaker overlap and turn-negotiation challenges that Full-Duplex-Bench evaluates. I want to understand these problems rigorously, not just engineer around them.

### Reproduction Plan

1. **Reproduce core results** from Full-Duplex-Bench v1.5 using the released evaluation code and dataset
2. **Extend to open-source models:** Evaluate Moshi (Kyutai), Qwen2.5-Omni, and GLM-4-Voice — models not included in the original paper, which focused on closed-API systems
3. **Domain-specific disfluency evaluation:** Construct a small evaluation set reflecting construction industry audio conditions (background noise, domain-specific terminology, multi-speaker overlap patterns similar to jobsite communication)
4. **Multi-speaker metrics:** Develop and report additional metrics capturing multi-speaker scenario performance, motivated by real production requirements

### References

- Lin et al., "Full-Duplex-Bench: A Benchmark for Full-Duplex Speech Language Models," ASRU 2025. [GitHub](https://github.com/DanielLin94144/Full-Duplex-Bench)

---

> **Code and writeup will be linked here on completion.**
