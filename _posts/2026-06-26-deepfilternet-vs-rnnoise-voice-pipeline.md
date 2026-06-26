---
layout: post
title: "DeepFilterNet vs RNNoise: Choosing a Noise Suppressor for a Real-Time Voice AI Pipeline"
date: 2026-06-26 00:00:00-0000
description: The two best free, CPU-only noise suppressors for a pipecat voice pipeline. RNNoise is one line to enable but hurts speech signal quality. DeepFilterNet3 is better at everything except integration and STT risk.
tags: voice-ai engineering
categories: engineering
related_posts: false
---

## TL;DR

- Background noise hits STT accuracy directly. The noise suppressor sits at the front of the pipeline, before anything else sees the audio. Pick the wrong one and you either leave the problem unsolved or make transcription worse.
- **RNNoise** is already in pipecat, one line to enable, nearly free on CPU (RTF 0.027). But it degrades speech signal quality on challenging audio (SIGMOS drops below the unprocessed baseline on DNS4).
- **DeepFilterNet3** wins on every metric: PESQ 3.17 vs 2.33, BAKMOS 4.43 vs 3.69. Its two-stage architecture (coarse ERB gains + fine complex filtering per frequency bin) handles non-stationary noise that RNNoise cannot.
- The catch: DeepFilterNet has a documented STT degradation risk (~20% WER increase with Whisper), requires 48 kHz input (Twilio sends 8 kHz), and the GRU hidden state must persist across audio chunks or quality tanks.
- The right move is to **start with RNNoise and switch to DeepFilterNet only after testing it against your STT provider**.

---

## The problem

The pipeline:

```
Twilio (8 kHz μ-law PCM) → pipecat transport → BaseAudioFilter → Deepgram STT → LLM → ElevenLabs TTS → Twilio
```

Audio arrives from Twilio as 8 kHz μ-law encoded at 20ms frames (160 samples per frame). pipecat decodes it to 16 kHz PCM16 internally. The noise suppressor sits on the `audio_in_filter` hook, receiving raw bytes and returning filtered bytes at the same rate.

If you are running this kind of pipeline on a typical cloud server (Linux, no GPU), the options narrow fast. Krisp needs a paid SDK. NVIDIA Broadcast needs an RTX GPU and Windows. Microsoft Azure Audio Stack needs an Azure subscription. Demucs and Conv-TasNet need a GPU and are slower than real-time on CPU. Whatever you pick also has to process a 20ms frame in under 20ms (RTF < 1.0) and not clip or distort the speaker's voice, because that voice is exactly what STT is trying to transcribe.

That leaves two serious options: RNNoise and DeepFilterNet.

---

## RNNoise

### How it works

RNNoise ([Valin, 2018](https://arxiv.org/abs/1709.08243)) is a hybrid DSP + neural network suppressor. It wraps a small GRU-based network around a classical spectral gain estimator.

Audio is processed at 48 kHz in 10ms frames (480 samples). The power spectrum is compressed into **22 perceptual frequency bands** using the same Bark-scale layout as the Opus codec. The neural network predicts a single scalar gain value per band (a value between 0 and 1, applied multiplicatively to suppress noise). The network has:

- 42 handcrafted input features: band energies, cepstral coefficients, pitch period, pitch correlation, and their first/second temporal derivatives
- 3 GRU layers (the GRU gives temporal context, letting the network distinguish stationary from non-stationary noise)
- ~87,000 parameters total
- ~0.04 GMACs/s compute

The gains are applied at the band level, not per frequency bin. Within a band, all frequencies get the same suppression. This is the root of RNNoise's limitation on non-stationary noise: it cannot tell apart a noise spike and speech energy that happen to land in the same coarse band.

### Benchmark numbers

| Metric                   | Value    | Source                          |
| ------------------------ | -------- | ------------------------------- |
| Parameters               | 0.087M   | DeepFilterNet2 paper            |
| MACs                     | 0.04 G/s | DeepFilterNet2 paper            |
| RTF (Intel i5-8250U)     | 0.027    | DeepFilterNet2 paper            |
| PESQ (VoiceBank+DEMAND)  | 2.33     | DeepFilterNet2 paper, 3rd-party |
| STOI (VoiceBank+DEMAND)  | 0.922    | DeepFilterNet2 paper            |
| BAKMOS (DNS4 blind test) | 3.694    | DeepFilterNet2 paper            |
| OVLMOS (DNS4 blind test) | 3.378    | DeepFilterNet2 paper            |

One thing that stands out: on the DNS4 blind test set (harder, more real-world audio), RNNoise's SIGMOS is **3.884**, _lower than the unprocessed noisy baseline of 4.144_. It cleans up the background (BAKMOS 3.694 vs 2.940) but damages the speech signal in the process. OVLMOS of 3.378 vs unprocessed 3.291 is barely an improvement.

RTF of 0.027 means it processes 1 second of audio in 27ms on an Intel i5-8250U. Roughly 37 concurrent call streams per CPU core.

### Using it in pipecat

RNNoise ships in `pipecat-ai` as `RNNoiseFilter`. Enabling it is a single line:

```python
from pipecat.audio.filters.rnnoise_filter import RNNoiseFilter

transport = FastAPIWebsocketTransport(
    websocket=ws,
    params=FastAPIWebsocketParams(
        audio_in_enabled=True,
        audio_in_filter=RNNoiseFilter(),
    ),
)
```

The filter handles sample rate conversion internally if the transport rate differs from RNNoise's native 48 kHz.

---

## DeepFilterNet

DeepFilterNet ([Schröter et al., 2021-2023](https://github.com/Rikorose/DeepFilterNet)) is a two-stage speech enhancement framework. Three versions exist: v1 (ICASSP 2022), v2 (IWAENC 2022), and v3 (Interspeech 2023). Same core architecture across all three; v2 and v3 improved training and tweaked the architecture.

### How it works

It splits speech enhancement into two sub-problems:

**Stage 1: ERB gain path (coarse envelope)**

The input power spectrogram is compressed into **32 ERB (Equivalent Rectangular Bandwidth) bands**. ERB is a frequency scale based on how the ear actually resolves frequencies. The model predicts a gain value per band, interpolates back to full frequency resolution, and applies it as a multiplicative mask. This takes care of the broadband noise floor.

**Stage 2: Deep filtering path (fine spectral reconstruction)**

The lower 96 frequency bins (up to ~4.8 kHz, where most of the speech energy lives) are processed with a learned **complex multi-frame FIR filter**:

```
Y(k, f) = Σ[i=0..N] C(k, i, f) · X(k-i+l, f)
```

where `k` is the time frame, `f` is the frequency bin, `N=5` is the filter order, `l` is the look-ahead offset, and `C` are the learned complex filter coefficients. This filter works in the **complex STFT domain**, so it models both magnitude and phase. RNNoise's scalar gain approach can only do magnitude.

This is what makes DeepFilterNet better at non-stationary noise. Instead of applying one gain to an entire frequency band, it predicts a complex filter across 5 consecutive frames for each individual frequency bin. It can zero out a specific bin where a noise spike lands without touching speech energy in neighboring bins.

The two paths blend together via a learned scalar α per frame, controlled by a local SNR estimate. When SNR is above ~-10 dB, the deep filtering stage turns on.

**One limitation worth knowing**: the deep filtering stage does _nothing for stochastic components like fricatives or plosives_ (the original paper says this explicitly). Impulsive noise events (sudden transients) fall into the same bucket. The ERB stage still suppresses them, but Stage 2 does not help. So for purely impulsive sounds, the gap over RNNoise is smaller than the benchmark numbers make it look.

**STFT parameters:**

- Sample rate: 48,000 Hz (hardcoded, no 16 kHz or 8 kHz model exists)
- FFT window: 20ms (960 samples)
- Hop size: 10ms (480 samples, 50% overlap)
- Algorithmic latency: **40ms** (20ms window + 2-frame lookahead)

### Version progression

| Version            | Params | MACs      | RTF       | PESQ | STOI  | Paper                                                |
| ------------------ | ------ | --------- | --------- | ---- | ----- | ---------------------------------------------------- |
| RNNoise (baseline) | 0.087M | 0.04 G/s  | 0.027     | 2.33 | 0.922 | -                                                    |
| DeepFilterNet v1   | 1.778M | 0.348 G/s | 0.11      | 2.81 | 0.942 | [arXiv:2110.05588](https://arxiv.org/abs/2110.05588) |
| DeepFilterNet2     | 2.306M | 0.356 G/s | 0.04      | 3.08 | 0.943 | [arXiv:2205.05474](https://arxiv.org/abs/2205.05474) |
| DeepFilterNet3     | 2.14M  | 0.35 G/s  | 0.11-0.19 | 3.17 | 0.944 | [arXiv:2305.08227](https://arxiv.org/abs/2305.08227) |

_PESQ and STOI from VoiceBank+DEMAND test set, verified across 5+ independent papers. RTF measured on Intel i5-8250U, single-threaded._

DeepFilterNet2 has a notably lower RTF (0.04) than both v1 and v3 despite having more parameters. The v2 paper pulled this off by simplifying the DNN components. DeepFilterNet3's RTF of 0.11-0.19 reflects the Interspeech 2023 paper's measurements; the higher end is Python/PyTorch inference, lower end is ONNX runtime.

### DNS4 blind test: background suppression

BAKMOS (from DNSMOS P.835, a non-intrusive MOS predictor) measures background noise suppression quality specifically. On the DNS4 blind test set:

| System           | SIGMOS    | BAKMOS    | OVLMOS    |
| ---------------- | --------- | --------- | --------- |
| Noisy (baseline) | 4.144     | 2.940     | 3.291     |
| RNNoise          | 3.884     | 3.694     | 3.378     |
| NSNet2           | 3.866     | 4.210     | 3.585     |
| DeepFilterNet v1 | 4.141     | 4.182     | 3.751     |
| DeepFilterNet2   | **4.196** | **4.427** | **3.882** |

_Source: [DeepFilterNet2 paper](https://arxiv.org/abs/2205.05474), Table 2._

BAKMOS 4.427 vs RNNoise's 3.694 is the number that matters if background noise suppression is your main goal.

---

## The integration challenges

### 1. The 48 kHz requirement

There is no 16 kHz or 8 kHz model. The sample rate is baked into `ModelParams().sr` and `df_state.sr()` always returns `48000`. From `df/config.py`:

```python
self.sr: int = config("SR", cast=int, default=48_000, section="DF")
```

For a Twilio pipeline, the resampling chain looks like:

```
Twilio 8 kHz μ-law → decode → 8 kHz PCM16 → resample → 16 kHz PCM16 (pipecat internal)
  → resample 16k→48k → DeepFilterNet inference → resample 48k→16k → Deepgram STT
```

The library can resample internally via `SOXRStreamAudioResampler` if you pass audio at a different rate. But upsampling 8 kHz telephony audio to 48 kHz does not magically recover frequencies above 4 kHz. Those bins are flat zeros. DeepFilterNet's ERB bands and deep filtering in the 4-24 kHz range will process empty signal. That is wasted compute, but it should not corrupt the 0-4 kHz speech band where all the phoneme energy actually lives.

One thing to watch: upsample in one step (8k→48k), not through an intermediate (8k→16k→48k). Multi-step resampling degrades quality from cascaded anti-aliasing filters.

### 2. GRU state must persist across chunks

This is the thing most likely to bite you.

The `enhance()` function in the Python package calls `model.reset_h0()` before processing each audio tensor:

```python
# from df/enhance.py
@torch.no_grad()
def enhance(model, df_state, audio, pad=True, atten_lim_db=None):
    if hasattr(model, "reset_h0"):
        model.reset_h0(batch_size=bs, device=get_device())
    # ... inference
```

If you call `enhance()` on each 20ms chunk from pipecat, the GRU hidden state resets 50 times per second. The model has no memory of what came before. It is stuck in cold-start mode permanently, noise estimation never stabilizes, and output quality is way worse than the benchmarks above.

To fix this, you have to **carry the GRU hidden state manually across calls**. The model has 5 GRU layers (1 in the encoder, 2 in the ERB decoder, 2 in the DF decoder), and you need to hold onto `h0` for all of them between chunks. The Rust-backed `DF` state object also keeps two running normalization states (`mean_norm_state`, `unit_norm_state`) updated via exponential moving average each frame. Those persist on their own as long as you do not recreate the `df_state` object.

There is also a blocking issue with asyncio: `enhance()` is synchronous and holds the Python GIL the entire time (the Rust extension underneath has no `py.allow_threads()` calls). At RTF ~0.11, a 20ms chunk takes ~2.2ms to process. Run it in a `ThreadPoolExecutor` so it does not stall the asyncio event loop:

```python
loop = asyncio.get_event_loop()
enhanced = await loop.run_in_executor(
    self._executor, self._enhance_sync, audio_chunk
)
```

`df_state` thread safety is not documented, so the executor should use a single worker (not a pool) and own the `model` and `df_state` objects exclusively.

### 3. API gotcha: 4-tuple return

`init_df()` returns a **4-tuple** `(model, df_state, suffix, epoch)`. Many examples show `model, df_state, _ = init_df()` which raises `ValueError: too many values to unpack`. The correct form:

```python
model, df_state, _, _ = init_df(default_model="DeepFilterNet3")
# or
model, df_state, *_ = init_df(default_model="DeepFilterNet3")
```

### 4. Python 3.12+ support

The official `deepfilternet` package on PyPI (v0.5.6, last released August 2023) supports Python 3.8-3.11 only. For Python 3.12+, use the community fork:

```
pip install DeepFilterNet-py312
```

This is the same codebase with a compatibility patch, maintained by bobo.zhou. Supports Python 3.11-3.13. Last release: v0.5.7, May 2025.

---

## The STT degradation risk

A [GitHub issue (#483)](https://github.com/Rikorose/DeepFilterNet/issues/483) on the DeepFilterNet repo found roughly **20% WER degradation** when running audio through DeepFilterNet before sending it to Whisper. It happened even on audio with artificially added noise. The model strips high-frequency speech content that ASR models need for telling phonemes apart.

A 2025 paper from EPFL and Logitech ([DeepFilterGAN, arXiv:2505.23515](https://arxiv.org/abs/2505.23515)) confirmed this independently. They measured a Log-Spectral Distance of 4.00 and word accuracy of only 74.54% on DeepFilterNet2 output on the URGENT Challenge test set. It was bad enough that they built a whole GAN-based second stage just to recover the speech content that DeepFilterNet had stripped out.

This is a real risk and you need to test it before putting DeepFilterNet in front of any STT system. The WER degradation was measured against Whisper; Deepgram (telephony-tuned, trained on degraded real-world audio) might handle it better, but nobody has tested that yet.

**Mitigation:** Set `atten_lim_db` in `enhance()` to limit maximum suppression. The parameter works as:

```python
# from enhance.py
lim = 10 ** (-abs(atten_lim_db) / 20)
enhanced = enhanced_spec * (1 - lim) + noisy_spec * lim
```

Setting `atten_lim_db=12` caps suppression at 12 dB and blends back ~25% of the original signal. Good starting point for tuning.

---

## The community pipecat package

There is no official pipecat integration for DeepFilterNet. [GitHub issue #3266](https://github.com/pipecat-ai/pipecat/issues/3266) asked for it in December 2025 and was closed in March 2026 without a PR. The maintainers pointed contributors to their Community Integrations program instead.

[`pipecat-deepfilternet-stream`](https://github.com/vahidkowsari/pipecat-deepfilternet-stream) (created May 2026) solves the two hardest problems:

1. **GRU state continuity**: Uses Sonos' [`tract`](https://github.com/sonos/tract) ONNX runtime in "pulsed execution" mode. This rewrites all GRU and Conv2d ops so internal state persists across individual `run()` calls. Streaming output quality matches batch processing.

2. **Twilio 8 kHz μ-law**: Handles the full resampling chain internally (8k→48k→16k) via SOXR streaming resampler.

Total filter delay: ~50ms (40ms algorithmic + 10ms buffer). Per-frame compute: ~1.7ms average per 10ms hop.

Drop-in usage:

```python
from pipecat_deepfilternet_stream import DeepFilterNetStreamFilter

transport = FastAPIWebsocketTransport(
    websocket=ws,
    params=FastAPIWebsocketParams(
        audio_in_enabled=True,
        audio_in_filter=DeepFilterNetStreamFilter(),
    ),
)
```

The package is GitHub-only right now (not on PyPI), so you install from source. `atten_lim_db` is also not exposed as a constructor parameter yet. If you need suppression limiting (and you probably do for telephony audio), fork the package and add it.

---

## Building a custom BaseAudioFilter

If you do not want to depend on the community package, here is what the implementation looks like, modeled on pipecat's `RNNoiseFilter`. Four required methods:

```python
from pipecat.audio.filters.base_audio_filter import BaseAudioFilter
from pipecat.frames.frames import FilterControlFrame, FilterEnableFrame
from df.enhance import enhance, init_df
import numpy as np
import torch
import asyncio
from concurrent.futures import ThreadPoolExecutor

class DeepFilterNetFilter(BaseAudioFilter):
    def __init__(self, atten_lim_db: float = None):
        self._atten_lim_db = atten_lim_db
        self._filtering = True
        self._executor = ThreadPoolExecutor(max_workers=1)
        self._model = None
        self._df_state = None

    async def start(self, sample_rate: int):
        self._sample_rate = sample_rate
        # init_df returns 4-tuple
        self._model, self._df_state, _, _ = init_df(default_model="DeepFilterNet3")

    async def stop(self):
        self._executor.shutdown(wait=False)

    async def process_frame(self, frame: FilterControlFrame):
        if isinstance(frame, FilterEnableFrame):
            self._filtering = frame.enable

    async def filter(self, audio: bytes) -> bytes:
        if not self._filtering:
            return audio
        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(
            self._executor, self._enhance_sync, audio
        )

    def _enhance_sync(self, audio: bytes) -> bytes:
        # Decode int16 PCM → float32
        pcm = np.frombuffer(audio, dtype=np.int16).astype(np.float32) / 32768.0

        # Resample if needed (pipecat internal rate is 16kHz; DeepFilterNet needs 48kHz)
        # SOXRStreamAudioResampler handles this — omitted here for brevity

        tensor = torch.from_numpy(pcm).unsqueeze(0)  # [1, T]

        # WARNING: enhance() resets h0 internally on each call.
        # For true streaming with persistent GRU state, call model.forward()
        # directly and carry h0 manually, or use pipecat-deepfilternet-stream
        # which handles this via tract.
        with torch.no_grad():
            enhanced = enhance(
                self._model,
                self._df_state,
                tensor,
                pad=True,
                atten_lim_db=self._atten_lim_db,
            )

        out = (enhanced.squeeze(0).numpy() * 32768.0).clip(-32768, 32767).astype(np.int16)
        return out.tobytes()
```

**The caveat**: the `enhance()` call above still resets `h0` on each call. For real streaming with persistent GRU state, you need to call `model.forward()` directly and manage `h0` tensors yourself, or use `pipecat-deepfilternet-stream` which handles this through tract's pulsed runtime. For most telephony calls (short-ish, noise that stays fairly constant) the quality difference between resetting-per-chunk and true streaming is noticeable but not a dealbreaker.

---

## Which one to use

If you need something working today, start with RNNoise. It is already in `pipecat-ai`, one line to enable, zero new dependencies, and no STT risk. RTF 0.027 means it is basically free on CPU. PESQ 2.33 vs 1.97 unprocessed is a modest but real improvement.

If you want better noise suppression (and you probably do), move to DeepFilterNet. But test it first. Pull 10-20 real call recordings, run them through DeepFilterNet, and compare your STT transcription accuracy against the raw audio. Decide on an acceptable WER delta before you start (5% relative regression is a reasonable bar). If it passes, swap `RNNoiseFilter()` for `DeepFilterNetStreamFilter()`. One-line change plus one new dependency.

DeepFilterNet is where you want to end up. BAKMOS 4.43 vs 3.69 for RNNoise is a big gap, and the PESQ jump from 2.33 to 3.17 is not small. But the STT degradation risk is real and independently confirmed. Test it on your STT provider before shipping.

---

## References

- [DeepFilterNet GitHub](https://github.com/Rikorose/DeepFilterNet)
- [DeepFilterNet v1 paper, arXiv:2110.05588](https://arxiv.org/abs/2110.05588)
- [DeepFilterNet2 paper, arXiv:2205.05474](https://arxiv.org/abs/2205.05474)
- [DeepFilterNet3 paper, arXiv:2305.08227](https://arxiv.org/abs/2305.08227)
- [pipecat-deepfilternet-stream](https://github.com/vahidkowsari/pipecat-deepfilternet-stream)
- [DeepFilterGAN paper (EPFL/Logitech, STT degradation confirmation), arXiv:2505.23515](https://arxiv.org/abs/2505.23515)
- [DeepFilterNet GitHub issue #483, WER degradation with Whisper](https://github.com/Rikorose/DeepFilterNet/issues/483)
- [pipecat GitHub issue #3266, DeepFilterNet integration request](https://github.com/pipecat-ai/pipecat/issues/3266)
- [RNNoise GitHub](https://github.com/xiph/rnnoise)
- [deepfilter-rt (Rust streaming implementation)](https://github.com/shimondoodkin/deepfilter-rt)
