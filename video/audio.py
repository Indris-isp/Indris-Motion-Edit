"""Builds the final soundtrack: voiceover only (no music, no SFX), placed from the timeline.
Run after vo.py + timeline.py:  python3 audio.py  ->  out/audio.wav (48 kHz stereo)
"""
import json, wave
import numpy as np
import soundfile as sf

TL = json.load(open('out/timeline.json'))
SR = 48000
N = int(TL['DUR'] * SR) + SR // 10
vo = np.zeros(N)
for key, at in TL['vo']:
    x, sr = sf.read(f'out/vo/{key}.wav', dtype='float32')
    if x.ndim > 1: x = x.mean(1)
    xi = np.interp(np.arange(int(len(x) * SR / sr)) * sr / SR, np.arange(len(x)), x)  # resample to 48 kHz
    fade = np.minimum(1, np.minimum(np.arange(len(xi)), np.arange(len(xi))[::-1]) / (0.004 * SR))  # de-click
    i = int(at * SR); n = min(len(xi), N - i)
    vo[i:i + n] += (xi * fade)[:n]
vo = np.tanh(vo / (np.abs(vo).max() + 1e-9) * 1.3) / np.tanh(1.3)   # gentle limiting
vo *= 0.89 / np.abs(vo).max()
st = np.stack([vo, vo], 1)
with wave.open('out/audio.wav', 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((st * 32767).astype('<i2').tobytes())
print('wrote out/audio.wav (voiceover only)')
