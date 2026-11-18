"""Synthesizes the soundtrack (soft pad + SFX), placed from out/cues.json written by render.cjs.
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
amp = np.clip(t / 2.5, 0, 1) * (1 - 0.85 * np.clip((t - Q['dark0']) / .2, 0, 1) * (1 - np.clip((t - Q['light0']) / .3, 0, 1)))
amp *= np.clip((C['DUR'] + 0.15 - t) / 1.0, 0, 1)
pad = lowpass(pad * amp, 900) * 0.10
L += pad; Rt += pad

# --- SFX ---
place(whoosh(0.75, 300, 2200, .9), Q['drop'], .18)
place(S(tone(150, 55, .4, .001, 12), .5 * pop(300, 40)), Q['land'], .55)
place(pop(380, 45), Q['land'] + .30, .18)
place(pop(620), Q['split'], .32); place(pop(820), Q['split'] + .05, .22, -.5); place(pop(820), Q['split'] + .07, .22, .5)
place(pop(500, 40), Q['merge1'], .28, -.3)
place(whoosh(.35, 1500, 400, .3), Q['fade'], .07)
for at, pan in [(Q['br1'], -.5), (Q['br2'], .5)]:
    place(whoosh(.6, 800, 3000, .8), at, .07, pan)
    place(click(), at, .35, pan); place(click(), at + .30, .3, pan); place(click(), at + .60, .4, pan)
place(S(tone(900, 260, .35, .001, 18, (1, 2, 3)), tone(120, 70, .3, .001, 14)), Q['core'], .45)   # the orange "pop"
for at, pan in [(Q['lab1'], -.4), (Q['lab2'], 0), (Q['lab3'], .4)]:
    place(tone(1760, 1760, .5, .002, 9), at, .05, pan)
place(whoosh(.9, 250, 1800, .7), Q['asm0'], .16)
place(whoosh(.45, 3000, 200, .4), Q['dark0'] - .1, .22)                      # into black
for i, at in enumerate(Q['snaps']):
    place(S(click(), .6 * pop(700 + 120 * i, 60)), at, .4, [-.4, .4, -.2, .2][i])
place(S(tone(110, 42, 1.6, .002, 3.2, (1, 2)), lowpass(rng.standard_normal(int(.08 * SR)), 900) * env(int(.08 * SR), .001, 40) * 2),
      Q['light0'], .7)                                                         # bass hit on the reveal
place(whoosh(.7, 500, 4000, .5), Q['word'] - .05, .12)
shim = sum(np.sin(2 * np.pi * f * t[:int(1.8 * SR)]) for f in (880, 1318.5, 1760)) * env(int(1.8 * SR), .02, 2.2)
place(shim, Q['sub'], .045)

st = np.stack([L, Rt], 1)
st = np.tanh(st / np.abs(st).max() * 1.2) / np.tanh(1.2) * 0.9
with wave.open('out/audio.wav', 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((st * 32767).astype('<i2').tobytes())
print('wrote out/audio.wav')
