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
    i = int(t * SR); n = min(len(x), N - i)
    if n > 0: SFX[i:i + n] += x[:n] * g

W = whoosh()
CUES = [  # (time, sound, gain), cued to video.html v3 (synced to the voiceover)
    (0.82, whoosh(.32, 400, 2600), .25), (1.86, whoosh(.32, 400, 2600), .25), (3.1, whoosh(.32, 400, 2600), .25),
    (4.05, click(), .45), (4.1, whoosh(.45, 300, 2600), .45), (4.84, pop(520), .4), (5.42, click(1800), .35),
    (5.62, whoosh(.45, 200, 1500), .4), (5.9, pop(440, .25), .5), (6.15, shimmer(), .16),
    (7.15, whoosh(.55, 300, 2600), .45), (7.6, pop(700, .1), .3), (9.28, whoosh(.55, 300, 2400), .4), (10.88, whoosh(.45, 400, 3000), .35),
    (14.58, click(), .45), (14.62, pop(700, .12), .3), (15.2, pop(480, .2), .4),
    (15.95, whoosh(.5, 300, 2400), .4), (16.3, whoosh(1.1, 200, 1200), .3), (16.85, pop(520), .3), (18.55, pop(560), .3),
    (20.35, whoosh(.6, 600, 200), .35), (21.85, whoosh(.45, 1200, 300), .3),
    (22.0, pop(560), .3), (23.1, pop(600), .3), (24.14, pop(640), .3),
    (27.0, whoosh(.5), .3), (27.4, pop(500), .3), (28.12, pop(540), .35), (29.16, pop(580), .35), (30.92, pop(620), .35), (32.3, shimmer(1.2), .15),
    (33.4, whoosh(.5, 1800, 300), .4), (33.5, pop(400, .3), .55), (33.65, shimmer(1.8), .22), (33.74, pop(600), .35),
]
for t, x, g in CUES: at(t, x, g)
# thumb taps while the offer is typed (11.15 – 14.5 s)
for t in np.arange(11.15, 14.5, 0.11): at(t + rng.uniform(-.006, .006), tick(), .12 * rng.uniform(.6, 1))

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
