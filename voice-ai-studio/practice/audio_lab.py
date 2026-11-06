"""Voice Studio audio lab: standard-library PCM, arithmetic and HTML only.

Creates known synthetic tones, not speech. No network, model, microphone,
subprocess, installed package or personal recording is accessed.
Run: python3 audio_lab.py --output voice-lab-output
"""
import argparse
import html
import math
from pathlib import Path
import struct
import wave

RATE = 16000
WINDOW = 400


def tone(frequency, amplitude=0.25, seconds=1, rate=RATE):
    """Normalised samples; 1 is the chosen digital full-scale boundary."""
    if not (0 < frequency < rate / 2 and amplitude >= 0 and seconds > 0):
        raise ValueError("Expected positive duration and a tone below Nyquist")
    return [amplitude * math.sin(2 * math.pi * frequency * n / rate)
            for n in range(round(seconds * rate))]


def pcm16(samples):
    """Symmetric quantisation to [-32767,32767]; clamp out-of-range input."""
    return [round(max(-1, min(1, value)) * 32767) for value in samples]


def moving_average(samples):
    """Two-tap causal average, zero initial history, tail omitted."""
    previous = 0
    result = []
    for value in samples:
        result.append((value + previous) / 2)
        previous = value
    return result


def dft(samples):
    """Unnormalised forward DFT, nonnegative bins, small frames only."""
    size = len(samples)
    if not size:
        raise ValueError("A DFT needs at least one sample")
    result = []
    for k in range(size // 2 + 1):
        real = 0
        imaginary = 0
        for n, value in enumerate(samples):
            angle = 2 * math.pi * k * n / size
            real += value * math.cos(angle)
            imaginary -= value * math.sin(angle)
        result.append((real, imaginary))
    return result


def write_wav(path, channels, rate=RATE):
    """Each channel is a sequence; interleave same-time samples into frames."""
    if not channels or len({len(c) for c in channels}) != 1:
        raise ValueError("Provide equal-length channels")
    encoded = [pcm16(c) for c in channels]
    interleaved = [value for frame in zip(*encoded) for value in frame]
    with wave.open(str(path), "wb") as stream:
        stream.setnchannels(len(channels))
        stream.setsampwidth(2)
        stream.setframerate(rate)
        stream.writeframes(struct.pack('<' + 'h' * len(interleaved), *interleaved))


def metadata(path):
    with wave.open(str(path), 'rb') as stream:
        frames = stream.getnframes()
        rate = stream.getframerate()
        channels = stream.getnchannels()
        width = stream.getsampwidth()
        raw = stream.readframes(frames)
    values = struct.unpack('<' + 'h' * (len(raw) // 2), raw)
    # This spectrum uses only the first channel of the first 400 audio frames.
    first = [value / 32767 for value in values[::channels]]
    spectrum = dft(first[:WINDOW])
    peak_bin = max(range(len(spectrum)), key=lambda k: math.hypot(*spectrum[k]))
    return dict(frames=frames, rate=rate, channels=channels, width=width,
                payload=len(raw), file_bytes=path.stat().st_size,
                seconds=frames / rate, peak_bin=peak_bin,
                peak_hz=peak_bin * rate / min(frames, WINDOW),
                peak=max(abs(v) for v in first), samples=first)


def plot(samples, label):
    # First 20 ms, fixed full-scale vertical axis for every plot.
    points = ' '.join(f'{i * 700 / 319:.2f},{100 - v * 90:.2f}'
                      for i, v in enumerate(samples[:320]))
    return (f'<svg viewBox="0 0 700 200" role="img" aria-label="{html.escape(label, quote=True)}">'
            '<path d="M0 100H700" stroke="#aaa"/>'
            f'<polyline points="{points}" fill="none" stroke="#21457a" stroke-width="2"/>'
            '</svg><p>Horizontal: 0–20 ms. Vertical: fixed −1 to +1 full scale. '
            'For stereo, the plot and spectrum use the left channel.</p>')


def make_lab(destination):
    destination = Path(destination)
    # Never replace an existing learner folder or edit.
    destination.mkdir(parents=False, exist_ok=False)
    base = tone(200)
    fixtures = {
        'tone-200': [base],
        'tone-400': [tone(400)],
        'tone-200-quiet': [tone(200, 0.125)],
        'stereo': [base, tone(400)],
        'silence': [[0] * RATE],
        'clipped': [tone(200, 1.2)],
        'filtered': [moving_average(base)],
        'cancelled': [[x + (-x) for x in base]],
    }
    cards = []
    for name, channels in fixtures.items():
        path = destination / (name + '.wav')
        write_wav(path, channels)
        info = metadata(path)
        peak = ('undefined for this all-zero signal' if not info['peak'] else
                f"bin {info['peak_bin']}, {info['peak_hz']:.0f} Hz")
        cards.append(f'''<section><h2>{name}</h2>
<p>{info['rate']} audio frames/s · {info['frames']} frames · {info['channels']} channel(s) · signed 16-bit PCM · {info['seconds']:.2f} s</p>
<p>PCM payload: {info['payload']} bytes. File: {info['file_bytes']} bytes. Peak absolute left-channel sample: {info['peak']:.4f} full scale.</p>
<details><summary>Spectrum details · for V15 and later</summary><p>Largest DFT magnitude in first {WINDOW} left-channel samples: {peak}. Rectangular window; bin spacing {RATE / WINDOW:g} Hz. No amplitude normalisation is applied to DFT coefficients.</p></details>
<audio controls preload="none" src="{name}.wav">Open the WAV link to inspect the audio.</audio>
<p><a href="{name}.wav">Open {name}.wav</a></p>
{plot(info['samples'], name + ': first 20 milliseconds')}</section>''')
    report = '''<!doctype html><html lang="en"><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1"><title>Local audio lab</title>
<style>body{font:18px/1.65 system-ui;margin:2rem auto;max-width:760px;padding:0 1rem;color:#24364a;background:#fafafa}section{border-top:1px solid #ccc;padding:1rem 0}h1,h2{line-height:1.2}svg,audio{width:100%}a{color:#21457a}</style>
<h1>Your local audio lab</h1><p>Known synthetic tones, not human speech. These files teach sampling, level, channels, phase and filtering. They cannot establish ASR or TTS quality.</p>
<p>Start playback at a comfortable low volume. Listening is optional; every comparison has plots and measurements. No microphone, model or network was used.</p>
<p>Predictions: 200 Hz gives four cycles in 20 ms; 400 Hz gives eight. Halving amplitude keeps frequency unchanged. The stereo file has the same duration and twice the PCM payload. Cancellation is exact here because the inputs are constructed opposites.</p>'''
    (destination / 'report.html').write_text(report + ''.join(cards) + '</html>', encoding='utf-8')
    return destination / 'report.html'


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--output', default='voice-lab-output', help='New output folder (must not already exist)')
    args = parser.parse_args()
    try:
        report = make_lab(args.output)
    except FileExistsError:
        parser.exit(2, 'Output folder already exists. Choose a new name with --output; existing work was not replaced.\n')
    print('Created 8 WAV files and', report)
    print('Open report.html in your browser. No server or extra packages are needed.')


if __name__ == '__main__':
    main()
