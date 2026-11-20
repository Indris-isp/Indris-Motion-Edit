"""Synthesizes a subtle SFX layer (whooshes, clicks, pops, typing) cued to video.html's timeline,
then mixes it under the client's voiceover track.

  python3 sfx.py <voiceover.mp3>   ->  out/sfx.wav, out/audio_mix.wav (48 kHz stereo, 36 s)

Cue times mirror CONFIG in video.html; edit CUES to move or remove a sound.
"""
import subprocess, sys, wave
import numpy as np

SR, DUR = 48000, 36.0
N = int(SR * DUR)
rng = np.random.default_rng(7)

def env(n, a=0.005, r=0.2):
    t = np.arange(n) / SR
    return np.minimum(1, t / a) * np.exp(-t / r)

def whoosh(d=0.45, f0=300, f1=2400):
    """band-limited noise with a rising/falling sweep and a smooth swell"""
    n = int(d * SR); t = np.arange(n) / SR
    x = rng.standard_normal(n)
    out = np.zeros(n); y1 = y2 = 0.0
    fc = f0 + (f1 - f0) * np.sin(np.pi * t / d) ** 2         # sweep up then down
    for i in range(n):                                          # simple resonant low-pass
        g = 2 * np.sin(np.pi * fc[i] / SR); y1 += g * (x[i] - y1 - 0.5 * y2); y2 += g * y1; out[i] = y1
    sw = np.sin(np.pi * t / d) ** 2
    return out / (np.abs(out).max() + 1e-9) * sw

def click(f=2600, d=0.03):
    n = int(d * SR); t = np.arange(n) / SR
    return np.sin(2 * np.pi * f * t) * env(n, .0005, .006) + 0.3 * rng.standard_normal(n) * env(n, .0003, .002)

def pop(f=520, d=0.18):
    n = int(d * SR); t = np.arange(n) / SR
    fr = f * (1 + 0.9 * np.exp(-t / .02))                        # pitch drop = bubbly pop
    return np.sin(2 * np.pi * np.cumsum(fr) / SR) * env(n, .002, .05)

def shimmer(d=1.4):
    n = int(d * SR); t = np.arange(n) / SR
    x = sum(np.sin(2 * np.pi * f * t + p) for f, p in [(1318, 0), (1760, 1), (2637, 2), (3520, 3)])
    return x / 4 * env(n, .02, .45)

def tick():
    n = int(.012 * SR)
    return rng.standard_normal(n) * env(n, .0003, .0025)

SFX = np.zeros(N)
def at(t, x, g):
    i = max(0, int(t * SR)); n = min(len(x), N - i)
    if n > 0: SFX[i:i + n] += x[:n] * g

W = whoosh()
CUES = [  # (time, sound, gain), cued to video.html v4 (HalftoneMotion structure)
    (2.0, whoosh(.6, 900, 300), .3), (4.0, click(), .5), (4.05, shimmer(.5), .25), (4.28, whoosh(.45, 2600, 300), .45),
    (4.34, pop(520), .35), (4.64, pop(560), .35), (4.88, pop(600), .35), (5.26, pop(640), .35),
    (5.72, whoosh(.45, 300, 2400), .4), (7.3, whoosh(.45, 300, 2400), .4),
    (7.75, whoosh(.6, 400, 2000), .3), (8.42, pop(560, .12), .3), (9.68, pop(600, .12), .3), (10.36, pop(640, .12), .3),
    (10.8, whoosh(.5, 300, 3000), .45), (11.1, pop(700, .1), .2), (15.5, shimmer(.6), .2),
    (15.95, whoosh(.5, 400, 1800), .3), (16.44, pop(520), .35), (20.12, click(), .5), (20.18, whoosh(.6, 300, 2400), .4),
    (21.85, whoosh(.5, 1600, 300), .3), (22.1, pop(560), .3), (23.22, pop(600), .3), (24.26, pop(640), .3),
    (27.05, whoosh(.45), .3), (32.2, click(), .5), (32.38, pop(480, .2), .4),
    (33.55, whoosh(.6, 300, 2600), .45), (34.3, pop(400, .3), .5), (34.42, shimmer(1.6), .25),
]
for t, x, g in CUES: at(t, x, g)
# thumb taps while the offer is typed (11.15 – 14.5 s)
for t in [x for seg in [(0,0.75),(1.0,1.75),(2.12,3.1),(3.56,3.95),(28.2,29.0),(29.22,29.95),(30.98,31.9)] for x in np.arange(seg[0], seg[1], 0.075)]: at(t + rng.uniform(-.006, .006), tick(), .12 * rng.uniform(.6, 1))

SFX *= 0.5 / (np.abs(SFX).max() + 1e-9)       # SFX peak at -6 dBFS before mixing

def write(path, mono_or_st):
    st = mono_or_st if mono_or_st.ndim == 2 else np.stack([mono_or_st] * 2, 1)
    with wave.open(path, 'wb') as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((np.clip(st, -1, 1) * 32767).astype('<i2').tobytes())

write('out/sfx.wav', SFX)
# decode the voiceover (48 kHz stereo), pad to 36 s, mix SFX 9 dB under it
raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', sys.argv[1], '-ac', '2', '-ar', str(SR), '-f', 's16le', '-'], capture_output=True, check=True).stdout
vo = np.frombuffer(raw, '<i2').reshape(-1, 2).astype(np.float64) / 32768
mix = np.zeros((N, 2)); mix[:min(N, len(vo))] = vo[:N]
mix += np.stack([SFX, SFX], 1) * 10 ** (-9 / 20)
tail = int(.8 * SR); mix[-tail:] *= np.linspace(1, 0, tail)[:, None] ** 2    # soft end
mix *= min(1, .97 / np.abs(mix).max())
write('out/audio_mix.wav', mix)
print('wrote out/sfx.wav and out/audio_mix.wav')
