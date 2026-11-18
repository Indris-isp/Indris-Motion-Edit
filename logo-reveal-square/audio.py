"""Square version. Synthesizes the soundtrack (soft pad + SFX), placed from out/cues.json written by render.cjs.
Usage: python3 audio.py  ->  out/audio.wav (48 kHz stereo)
Every sound is generated here with numpy, so there are no licensing questions."""
import json, wave
import numpy as np

C = json.load(open('out/cues.json')); Q = C['CUES']
SR = 48000; N = int((C['DUR'] + 0.2) * SR)
L = np.zeros(N); Rt = np.zeros(N)
rng = np.random.default_rng(7)

def S(*xs):  # mix clips of different lengths
    out = np.zeros(max(len(x) for x in xs))
    for x in xs: out[:len(x)] += x
    return out

def env(n, a, d):  # attack (s), exponential decay rate
    t = np.arange(n) / SR
    return np.minimum(1, t / max(a, 1e-4)) * np.exp(-t * d)

def place(x, at, gain=1.0, pan=0.0):
    i = int(at * SR); n = min(len(x), N - i)
    if n <= 0: return
    L[i:i + n] += x[:n] * gain * np.sqrt((1 - pan) / 2) * 1.414
    Rt[i:i + n] += x[:n] * gain * np.sqrt((1 + pan) / 2) * 1.414

def lowpass(x, cut):  # one-pole, cut may be an array (sweeps)
    a = np.exp(-2 * np.pi * np.broadcast_to(cut, x.shape) / SR); y = np.zeros_like(x); s = 0.0
    for i in range(len(x)): s = (1 - a[i]) * x[i] + a[i] * s; y[i] = s
    return y

def tone(f0, f1, dur, a=0.002, d=20, harm=(1,)):
    n = int(dur * SR); f = np.geomspace(f0, f1, n); ph = 2 * np.pi * np.cumsum(f) / SR
    return sum(np.sin(ph * h) / h for h in harm) * env(n, a, d)

def whoosh(dur, f0, f1, d_in=0.6):
    n = int(dur * SR); t = np.linspace(0, 1, n)
    shape = np.sin(np.pi * np.clip(t / d_in, 0, 1) * 0.5) * np.clip((1 - t) / (1 - d_in), 0, 1) ** 1.5
    return lowpass(rng.standard_normal(n), np.geomspace(f0, f1, n)) * shape * 3

pop = lambda f=520, d=30: S(tone(f * 1.6, f, 0.25, 0.001, d, (1, 2)), 0.3 * lowpass(rng.standard_normal(int(.01 * SR)), 4000))
click = lambda: S(lowpass(rng.standard_normal(int(.004 * SR)), 6000) * 2, tone(2400, 1800, .03, .0005, 160) * .4)

# --- soft pad bed (D minor add9), swelling in and opening up at the logo ---
n = N; t = np.arange(n) / SR
pad = np.zeros(n)
for f, g in [(73.4, .5), (110, .35), (146.8, .3), (174.6, .22), (220, .2), (329.6, .12)]:
    pad += g * np.sin(2 * np.pi * f * t + 0.6 * np.sin(2 * np.pi * 0.21 * t + f))
amp = np.clip(t / 2.0, 0, 1) * (0.8 + 0.4 * np.clip((t - Q['slide0']) / .8, 0, 1))
amp *= np.clip((C['DUR'] + 0.15 - t) / 1.0, 0, 1)
pad = lowpass(pad * amp, 900) * 0.10
L += pad; Rt += pad

# --- SFX ---
place(whoosh(0.7, 300, 2000, .9), Q['drop'], .16)
place(S(tone(120, 45, .5, .001, 10), .6 * pop(260, 40)), Q['land'], .6)
place(S(tone(110, 50, .3, .001, 16), .4 * pop(300, 50)), Q['land2'], .3)
place(pop(340, 60), Q['land3'], .12)
place(whoosh(.65, 400, 1600, .6), Q['roll0'], .12, .3); place(S(tone(140, 60, .3, .001, 18), .5 * click()), Q['roll1'] - .03, .35, .3)
place(whoosh(.9, 600, 2600, .6), Q['roll1'], .10)
place(pop(620), Q['split0'] + .12, .30, -.4); place(pop(780), Q['split0'] + .2, .30, .4)
for i in range(3): place(click(), Q['mark0'] + .12 + .18 * i, .38, [-.5, 0, .5][i])
place(tone(900, 300, .35, .001, 18, (1, 2, 3)), Q['mark0'] + .35, .3)
place(whoosh(1.3, 300, 4500, .25), Q['fast0'], .28)
place(S(tone(110, 42, 1.6, .002, 3.2, (1, 2)), lowpass(rng.standard_normal(int(.08 * SR)), 900) * env(int(.08 * SR), .001, 40) * 2), Q['slide0'] - .05, .7)
place(whoosh(.8, 500, 4000, .5), Q['word'] - .05, .13)
shim = sum(np.sin(2 * np.pi * f * t[:int(1.8 * SR)]) for f in (880, 1318.5, 1760)) * env(int(1.8 * SR), .02, 2.2)
place(shim, Q['sub'], .045)

st = np.stack([L, Rt], 1)
st = np.tanh(st / np.abs(st).max() * 1.2) / np.tanh(1.2) * 0.9
with wave.open('out/audio.wav', 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((st * 32767).astype('<i2').tobytes())
print('wrote out/audio.wav')
