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
CUES = [  # (time, sound, gain)
    (3.12, click(), .45), (3.25, W, .5), (5.6, click(1800), .4), (6.75, whoosh(.6, 200, 1500), .45), (7.35, pop(440), .5),
    (8.0, shimmer(), .18), (10.7, whoosh(.6, 250, 2000), .5), (12.85, whoosh(.55, 300, 2600), .45), (15.0, whoosh(.5, 400, 3000), .45),
    (18.25, click(), .45), (18.85, pop(700, .12), .25), (19.35, pop(560), .4), (20.15, pop(480), .5),
    (21.0, whoosh(.45, 300, 1800), .35), (22.25, pop(620), .4), (23.85, whoosh(.9, 200, 1200), .3),
    (26.45, whoosh(.6, 600, 200), .35), (28.4, pop(500), .35), (29.0, pop(560), .35), (29.6, pop(620), .35),
    (30.35, whoosh(.45), .35), (30.85, pop(520), .35), (31.35, pop(560), .35), (31.85, pop(600), .35), (32.35, pop(640), .35),
    (33.5, whoosh(.5, 1800, 300), .4), (33.85, pop(400, .3), .55), (34.0, shimmer(1.8), .22),
]
for t, x, g in CUES: at(t, x, g)
# typing ticks while the offer is typed (15.7 – 17.85 s)
for t in np.arange(15.7, 17.85, 0.026): at(t + rng.uniform(-.006, .006), tick(), .12 * rng.uniform(.6, 1))

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
