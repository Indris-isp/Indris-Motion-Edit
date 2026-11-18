"""Square version: sound effects only (no music), placed from out/cues.json written by render.cjs.
Usage: python3 audio.py  ->  out/audio.wav (48 kHz stereo)
Every sound is generated here with numpy, so there are no licensing questions."""
import json, wave
import numpy as np

C = json.load(open('out/cues.json')); Q = C['CUES']; FPS = C['FPS']
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
thud = lambda f=120: S(tone(f, f * .38, .5, .001, 10), .6 * pop(f * 2.2, 40))
tick = lambda f: S(tone(f, f * .9, .025, .0003, 220), .5 * lowpass(rng.standard_normal(int(.003 * SR)), 7000))

# --- 1. drop + bounces to the right, dropping circles ---
place(whoosh(0.7, 300, 2000, .9), Q['drop'], .16)
place(thud(120), Q['land1'], .62, -.05)
place(thud(135), Q['land2'], .42, .2)
place(thud(150), Q['land3'], .30, .45)
for at, to, dur in [(Q['land1'], -.6, .62), (Q['land2'], 0.0, .50)]:     # circle tossed out, then lands in its slot
    place(pop(700, 45), at + .02, .22, to * .5)
    place(S(tone(260, 150, .2, .001, 30), .4 * click()), at + dur, .22, to)
place(pop(560, 35), Q['land3'] + .12, .2, .45)                          # square rounds into the third circle

# --- 2. each circle spins fast and forms its part ---
for i, f0 in enumerate(Q['form']):
    pan = [-.5, 0, .5][i]
    place(whoosh(.75, 4200, 600, .12), f0, .22, pan)                      # fast spin, easing down
    place(click(), f0 + .55, .26, pan); place(click(), f0 + .62, .18, pan) # shape locks in
    place(tone(820 if i == 1 else 640, 300, .35, .001, 18, (1, 2, 3)), f0 + .6, .26 if i == 1 else .18, pan)
    place(tone(1760, 1760, .6, .002, 8), f0 + .45, .05, pan)            # label appears

# --- 3. fast spin into the logo, slide left ---
place(whoosh(1.3, 400, 4800, .2), Q['asm0'], .32)
place(S(tone(110, 42, 1.6, .002, 3.2, (1, 2)),
        lowpass(rng.standard_normal(int(.08 * SR)), 900) * env(int(.08 * SR), .001, 40) * 2), Q['asm1'] - .12, .7)
place(whoosh(.8, 1800, 400, .35), Q['slide0'], .12, -.3)

# --- 4. brand name counter: a tick for every glyph change, a firmer click when each letter locks ---
def counter(start, step, dur, n, gain, base, skip=()):
    for i in range(n):
        if i in skip: continue
        a0 = start + step * i; pan = -.35 + .7 * i / max(1, n - 1)
        k = 0
        while True:
            f = int(np.ceil(a0 * FPS / 2) * 2) + 2 * k             # glyph changes every 2 frames
            if f / FPS >= a0 + dur: break
            place(tick(base * (1.0 + .25 * ((i * 7 + k * 3) % 5) / 5)), f / FPS, gain, pan); k += 1
        place(S(click(), .5 * tick(base * .6)), a0 + dur, gain * 1.6, pan)
counter(Q['word'], Q['wordStep'], Q['wordDur'], 9, .16, 3200)              # I S P A g e n c y
sub = 'CREATIVE EDITING STUDIO'
counter(Q['sub'], Q['subStep'], Q['subDur'], len(sub), .07, 4200, skip=[i for i, ch in enumerate(sub) if ch == ' '])
end = Q['sub'] + Q['subStep'] * (len(sub) - 1) + Q['subDur']
shim = sum(np.sin(2 * np.pi * f * np.arange(int(1.6 * SR)) / SR) for f in (880, 1318.5, 1760)) * env(int(1.6 * SR), .02, 2.4)
place(shim, end, .05)

st = np.stack([L, Rt], 1)
st = np.tanh(st / np.abs(st).max() * 1.2) / np.tanh(1.2) * 0.9
with wave.open('out/audio.wav', 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((st * 32767).astype('<i2').tobytes())
print('wrote out/audio.wav')
