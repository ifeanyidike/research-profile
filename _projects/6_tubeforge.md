---
layout: page
title: TubeForge — Multimodal AI Generation Pipeline
description: End-to-end multimodal generation system producing temporally-aligned speech, visual, and language outputs from a single text prompt. Validated at scale — grew a faceless YouTube channel to thousands of subscribers autonomously.
importance: 6
category: Open Source
related_publications: false
---

**GitHub:** [github.com/ifeanyidike/tubeforge](https://github.com/ifeanyidike/tubeforge) &nbsp;·&nbsp; **Language:** Python

---

### Overview

TubeForge is a multimodal generation pipeline that produces temporally-aligned outputs across three modalities — language (script), speech (synthesized narration), and vision (AI-generated images and video) — assembled into a coherent final artifact. The system is conditioned either on a learned content profile induced from reference videos, or directly on a user prompt.

Validated at scale: the system autonomously grew a faceless YouTube storytelling channel to thousands of subscribers and views without any manual content creation.

The core research-relevant problem it solves is **cross-modal temporal alignment**: each generated visual segment must semantically correspond to its narration segment, with duration, pacing, and emotional register synchronized across modalities. This is the same alignment challenge studied in video-language model research.

---

### Two Operating Modes

- **Trained** — 3–5 reference videos from any niche. A `StyleProfile` is induced by extracting viral mechanics from transcripts via LLM analysis with extended thinking: hook structure, retention loop frequency, emotional arc timing, pacing, narrative pattern. All downstream generation is conditioned on this profile.
- **Creative** — A topic or story prompt as direct input. Full pipeline runs unconditioned.

---

### Pipeline

**Stage 1 — Topic & Research**
LLM samples the `StyleProfile` distribution to generate content angles and hook types ranked by estimated engagement potential.

**Stage 2 — Narrative Architecture**
Structural planning with extended thinking resolves 19 decisions before prose generation begins: emotional arc with peak at 60–75% of total duration, retention loops at ~30-second intervals, stakes escalation, character placement, and viral mechanics injected from the learned profile.

**Stage 3 — Script Generation**
Claude Opus generates the full script conditioned on the architecture. Target word count computed as `duration_minutes × WPM × correction_factor` (correction accounts for `[VISUAL:]` scene markers stripped before TTS). Validated within ±5% tolerance. Markers preserved for visual alignment.

**Stage 4–5 — Quality Scoring & Revision**
Separate Claude Sonnet pass scores the script (0–100) on viral potential, retention mechanics, and pacing. Scripts below threshold undergo targeted iterative refinement.

**Stage 6 — Speech Synthesis**
Script chunked at sentence boundaries to provider byte limits, synthesized, and concatenated. FFprobe measures actual audio duration post-synthesis for frame-accurate downstream alignment. Supports 8 TTS providers with automatic fallback.

**Stage 7 — Visual Generation**
Three modes:

- *Image+Effects* — generative image per scene (MiniMax FLUX 2 / Black Forest Labs FLUX 2) with Ken Burns zoom, 3D parallax, punch-in, motion blur, color grading, and particle compositing
- *Video Clips* — autoregressive video generation per scene (MiniMax Hailuo S2V-01 / Kling AI), 6–10 seconds at 768P/1080P
- *Hybrid* — cost-optimized mixture across scenes

**Character consistency** enforced as a modeling constraint via three-tier anchoring: fal.ai LoRA fine-tuning, Astria.ai LoRA embeddings, or MiniMax subject\_reference. Canonical embeddings compared against generated output at inference; distributional drift triggers re-generation.

**Stage 8 — Multimodal Assembly**
Single FFmpeg pass: visual timeline assembled to match narration duration, voiceover mixed with mood-matched background music, loudness normalized to −14 LUFS, word-level captions aligned from TTS timing metadata, hardware-accelerated encoding via `h264_videotoolbox`.

**Output:** H.264/AAC, 1080P, embedded SRT, 1280×720 thumbnail — upload-ready.

---

### Stack

`Python 3.12` · `FastAPI` · `async SQLAlchemy 2.0` · `PostgreSQL` · `FFmpeg` · `Claude API` · `OpenAI API` · `Gemini API` · `MiniMax FLUX` · `Kling AI` · `Google Cloud TTS` · `ElevenLabs` · `fal.ai LoRA` · `Docker`

---

### Engineering Notes

- **Prompt caching** on all large-context Claude calls — ~90% token cost reduction on repeated static contexts
- **Extended thinking** at niche analysis, narrative architecture, visual prompt construction, and title generation
- **Multi-provider fallback chains** across every external service with content-filter-aware prompt rewriting
- **Granular cost tracking** per project; typical full video under $1
- >90% test coverage enforced via pytest across unit, integration, e2e, load, and performance suites
- **WebSocket events** broadcast real-time pipeline state throughout execution

---

> **Research relevance:** TubeForge is a practical instantiation of multimodal generation and cross-modal alignment — producing semantically coherent, temporally synchronized outputs across language, speech, and vision. The profile-learning component (inducing style and structure from reference content) is a direct analogue to the few-shot conditioning problems studied in generative multimodal research. The gap between engineering heuristics used here and principled multimodal alignment is exactly what motivates the research questions I want to pursue.
