---
layout: page
title: AI Testimonial Intelligence Platform
description: Built a multimodal AI platform combining speech-to-text, sentiment analysis, and video understanding to automate testimonial insight extraction and story video composition at Cenphi.
importance: 3
category: Open Source
related_publications: false
---

**Company:** [Cenphi](https://cenphi.io) &nbsp;·&nbsp; **Role:** AI Engineer &nbsp;·&nbsp; **Year:** 2022–2023

---

### Problem

Marketing and sales teams collect large volumes of customer testimonial videos. Extracting compelling, usable insights — identifying the best moments, understanding sentiment arc, composing story narratives — was an entirely manual process requiring hours of human review per video. Cenphi needed an AI system to automate this pipeline end-to-end.

### Technical Approach

Built a multimodal AI pipeline spanning speech, language, and video:

**Speech & Transcription Layer**
- Implemented speech-to-text transcription pipeline using OpenAI Whisper with multi-speaker diarization
- Speaker-attributed transcripts enable downstream analysis to track who said what and when

**Language Understanding Layer**
- Sentiment analysis over transcript segments to produce a temporal sentiment arc across the video
- Topic modeling and key phrase extraction to identify the thematic structure of the testimonial
- Named entity recognition to extract products, features, and outcomes mentioned

**Video Composition Layer**
- Designed the *dynamic transcript strategy algorithm*: given a target video length and composition goal (highlight reel, story arc, objection-handling clip), the algorithm selects segments by jointly optimizing over sentiment score, topic coverage, speaker diversity, and pacing
- Automated generation of structured narrative scripts from selected segments
- Video highlight extraction and assembly pipeline using FFmpeg

### Stack

`Python` · `OpenAI Whisper` · `spaCy` · `Transformers (HuggingFace)` · `FFmpeg` · `FastAPI` · `LLMs for narrative generation`

### Results

- **~80% reduction** in manual content review time per video
- **~60% improvement** in client decision-making speed for content selection
- Shipped as the core AI feature of Cenphi's commercial platform

---

> **Research relevance:** This work sits at the intersection of my primary research interests — it required multimodal alignment (speech-language-video), temporal understanding, and evaluation of systems where "good" is inherently subjective. Designing the segment selection algorithm exposed me to the gap between engineering heuristics and principled multimodal optimization — exactly what video-language model research addresses.
