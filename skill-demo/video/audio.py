"""Synthesizes the soundtrack for the Loopin demo: a 120 BPM music bed and SFX at the
cue times in cues.js (whooshes on cuts, pops, typing, clicks, risers and hits).
Needs only numpy.  Usage:  python3 audio.py  ->  out/audio.wav (44.1 kHz stereo)
"""
import json, os, wave
import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
src = open(os.path.join(HERE, 'cues.js')).read()
CUES = json.loads(src[src.index('{'):src.index('};') + 1])
ST = [0.0]
for d in CUES['dur']: ST.append(ST[-1] + d)
AU, K = CUES['authored'], CUES['speed']
SR, DUR, BEAT = 44100, ST[-1], 60 / CUES['BPM']
BAR = 4 * BEAT
T_TURN, T_HIT, T_CTA = ST[3], ST[4], ST[11]

def remap(T):
    """authored time -> (real time, speed of that scene)"""
    i = max(j for j in range(len(AU) - 1) if AU[j] <= T or j == 0)
    if AU[i + 1] - T <= .3: return ST[i + 1] - (AU[i + 1] - T), K[i]   # stick to the cut
    return ST[i] + (T - AU[i]) / K[i], K[i]
N = int(DUR * SR) + SR
rng = np.random.default_rng(7)

def t_(d): return np.arange(int(d * SR)) / SR
def midi(n): return 440 * 2 ** ((n - 69) / 12)
def add(buf, x, at, g=1.0):
    i = int(at * SR)
    if i >= len(buf): return
    n = min(len(x), len(buf) - i); buf[i:i + n] += x[:n] * g
def filt(x, lo=None, hi=None):
    """Brick-ish FFT band filter with soft edges."""
    X = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1 / SR); m = np.ones_like(f)
    if lo: m *= 1 / (1 + (lo / np.maximum(f, 1)) ** 4)
    if hi: m *= 1 / (1 + (f / hi) ** 4)
    return np.fft.irfft(X * m, len(x))
def sweep_noise(d, f0, f1, chunks=24):
    """Noise whose band rises/falls from f0 to f1 (whooshes, risers)."""
    n = int(d * SR); x = rng.standard_normal(n); out = np.zeros(n); edges = np.linspace(0, n, chunks + 1).astype(int)
    for k in range(chunks):
        a, b = edges[k], edges[k + 1]; fc = f0 * (f1 / f0) ** (k / max(1, chunks - 1))
        seg = filt(x[max(0, a - 512):b + 512], fc * .5, fc * 2)
        out[a:b] = seg[(a - max(0, a - 512)):(a - max(0, a - 512)) + (b - a)]
    return out
def osc(freq, d):
    f = np.broadcast_to(freq, (int(d * SR),)) if np.ndim(freq) == 0 else freq
    return np.sin(2 * np.pi * np.cumsum(f) / SR)

# ---------------- instruments ----------------
def kick(big=1.0):
    t = t_(.45); f = 45 + 95 * np.exp(-t / .035)
    return (osc(f, .45) * np.exp(-t / (.22 * big)) + .3 * rng.standard_normal(len(t)) * np.exp(-t / .004))
def clap():
    t = t_(.3); n = filt(rng.standard_normal(len(t)), 900, 5000)
    env = np.zeros(len(t))
    for d in (0, .011, .022): env += np.exp(-np.maximum(t - d, 0) / .012) * (t >= d)
    return n * (env * .6 + np.exp(-t / .12) * .5)
def hat(open_=False):
    t = t_(.2); return filt(rng.standard_normal(len(t)), 7000) * np.exp(-t / (.07 if open_ else .022))
def pad_note(n, d, cut=None):
    t = t_(d); x = np.zeros(len(t))
    for det in (-.0012, .0012, 0):
        for h in range(1, 9): x += np.sin(2 * np.pi * midi(n) * (1 + det) * h * t + h) / h ** 1.4
    env = np.minimum(1, t / .35) * np.minimum(1, (d - t) / .5)
    return x * env / 6
def pluck(n):
    t = t_(.5); return (np.sin(2 * np.pi * midi(n) * t) + .35 * np.sin(4 * np.pi * midi(n) * t) + .12 * np.sin(6 * np.pi * midi(n) * t)) * np.exp(-t / .16) * np.minimum(1, t / .003)
def bass_note(n, d):
    t = t_(d); x = np.sin(2 * np.pi * midi(n) * t) + .25 * np.sin(4 * np.pi * midi(n) * t)
    return x * np.minimum(1, t / .01) * np.exp(-t / .5) * np.minimum(1, (d - t) / .03)

# ---------------- arrangement ----------------
drums, bass, pads, plk = (np.zeros(N) for _ in range(4))
kicks = []
A_CH = [[57, 60, 64], [53, 57, 60]]                         # Am, F (tense intro)
C_CH = [[53, 57, 60, 64], [55, 59, 62, 67], [57, 60, 64, 67], [48, 55, 60, 64]]  # Fmaj7 G Am7 C
C_RT = [41, 43, 45, 36]
# A: 0 – 8.5  (half-time pulse, ticking hats, dark pad)
for b in range(int(np.ceil(T_TURN / BAR))):
    add(pads, filt(sum(pad_note(n, BAR + .2) for n in A_CH[b % 2]), None, 900), b * BAR, .9)
    add(bass, bass_note(33 if b % 2 == 0 else 29, BAR - .1), b * BAR, .8)
for k in range(int(T_TURN / BEAT) + 1):
    tt = k * BEAT
    if k % 2 == 0: add(drums, kick(.8), tt, .75); kicks.append(tt)
    add(drums, hat(), tt + BEAT / 2, .10); add(drums, hat(), tt, .05)
# B: 8.5 – 11 (break: shimmer pad only, riser and boom come from SFX)
add(pads, filt(sum(pad_note(n, T_HIT - T_TURN + .2) for n in [69, 72, 76]), 300, 3000), T_TURN - .05, .45)
# C: 11 – 36 (full groove)
bar0 = T_HIT
for b in range(int(np.ceil((T_CTA - bar0) / BAR))):
    t0 = bar0 + b * BAR; ch = C_CH[b % 4]
    if t0 >= T_CTA - .05: break
    add(pads, filt(sum(pad_note(n, min(BAR, T_CTA - t0) + .15) for n in ch), None, 2600), t0, .8)
    for e in range(8):
        if t0 + e * BEAT / 2 >= T_CTA - .05: break
        add(bass, bass_note(C_RT[b % 4] + (12 if e % 4 == 3 else 0), BEAT / 2 * .9), t0 + e * BEAT / 2, .9)
        add(plk, pluck(ch[(e * 3) % len(ch)] + 12 + (12 if e in (3, 6) else 0)), t0 + e * BEAT / 2, .55)
    for q in range(4):
        tt = t0 + q * BEAT
        if tt >= T_CTA - .05: break
        add(drums, kick(), tt, 1.0); kicks.append(tt)
        if q % 2 == 1: add(drums, clap(), tt, .45)
        for s in range(4): add(drums, hat(open_=(s == 2)), tt + s * BEAT / 4, .16 if s == 2 else .07)
# D: 36 – 40 (outro: big hit, pad + sparse plucks)
add(pads, filt(sum(pad_note(n, 4.2) for n in [48, 55, 60, 64, 71]), None, 2400), T_CTA, .9)
add(bass, bass_note(36, DUR - T_CTA), T_CTA, .9)
for e, n in enumerate([76, 72, 79, 76, 84, 79]): add(plk, pluck(n), T_CTA + e * BEAT / 2, .45 * (1 - e / 8))
kicks.append(T_CTA)
# sidechain duck on everything tonal
tt = np.arange(N) / SR; duck = np.ones(N)
for k in kicks:
    i = int(k * SR); seg = tt[i:i + SR // 2] - k; duck[i:i + len(seg)] = np.minimum(duck[i:i + len(seg)], 1 - .55 * np.exp(-seg / .11))
music = drums * .55 + (bass * .32 + pads * .24 + plk * .13) * duck

# ---------------- SFX ----------------
sfx = np.zeros(N)
def whoosh(d=.4, g=1.0):
    x = sweep_noise(d, 300, 3500); t = t_(d)[:len(x)]; return x * np.sin(np.pi * (t / d) ** .7) ** 2 * g
def pop(f=650):
    t = t_(.12); f_ = f * (1 + .6 * (1 - np.exp(-t / .02))); return osc(f_, .12) * np.exp(-t / .045) * np.minimum(1, t / .002)
def tick(): t = t_(.03); return filt(rng.standard_normal(len(t)), 2500, 9000) * np.exp(-t / .006)
def key(): t = t_(.04); return filt(rng.standard_normal(len(t)), 1800, 6500) * np.exp(-t / .008)
def click():
    t = t_(.08); return filt(rng.standard_normal(len(t)), 1500, 7000) * np.exp(-t / .007) + .6 * np.sin(2 * np.pi * 160 * t) * np.exp(-t / .03)
def boom():
    t = t_(2.0); return np.sin(2 * np.pi * (38 + 40 * np.exp(-t / .08)) * t) * np.exp(-t / .7) + .25 * filt(rng.standard_normal(len(t)), None, 400) * np.exp(-t / .5)
def riser(d):
    x = sweep_noise(d, 250, 7000, 40); t = t_(d)[:len(x)]; tone = osc(200 * (6 ** (t / d)), d)[:len(x)]
    return (x * .8 + tone * .18) * (t / d) ** 2.2
def hit(big=1.0):
    t = t_(2.2); crash = filt(rng.standard_normal(len(t)), 3000) * np.exp(-t / (.9 * big))
    return np.concatenate([kick(1.6), np.zeros(len(t) - int(.45 * SR))]) * 1.2 + crash * .5 + np.sin(2 * np.pi * 45 * t) * np.exp(-t / .6) * .8
def shimmer():
    t = t_(1.8); x = sum(np.sin(2 * np.pi * f * t + p) * (.6 + .4 * np.sin(2 * np.pi * r * t)) for f, p, r in [(2093, 0, 5), (2637, 1, 7), (3136, 2, 6), (4186, 3, 9)])
    return x * np.sin(np.pi * t / 1.8) ** 2 / 4
def down():
    t = t_(1.0); return osc(700 * (0.11 ** (t / 1.0)), 1.0) * np.sin(np.pi * t) * .5 + sweep_noise(1.0, 3000, 200)[:len(t)] * np.sin(np.pi * t) * .5
def stamp():
    t = t_(.3); return np.sin(2 * np.pi * (70 + 80 * np.exp(-t / .02)) * t) * np.exp(-t / .1) + filt(rng.standard_normal(len(t)), 800, 5000) * np.exp(-t / .03) * .6
def swoop():
    t = t_(.35); return osc(300 * 4 ** (t / .35), .35) * np.sin(np.pi * t / .35) * .6
def swell():
    t = t_(.7); return sweep_noise(.7, 600, 4000)[:len(t)] * (t / .7) ** 2 * np.exp(-np.maximum(t - .6, 0) / .03)

def reel_times(n=8):  # when the slot-reel number crosses each integer (matches pos = 8*eo(...))
    return [.1 + 1.2 * (-np.log2(1 - k / (n + .0001)) / 10) for k in range(1, n + 1)]

hits = sorted(remap(a)[0] for a, kd in CUES['sfx'] if kd == 'hit')
for at0, kind in CUES['sfx']:
    at, k = remap(at0)
    base = ''.join(c for c in kind if not c.isdigit()); cnt = int(''.join(c for c in kind if c.isdigit()) or 1)
    if kind == 'whoosh': add(sfx, whoosh(.42), at, .55)
    elif kind == 'whoosh_s': add(sfx, whoosh(.3), at, .3)
    elif base == 'pops': [add(sfx, pop(520 + 260 * rng.random()), at + i * .075 / k, .22) for i in range(cnt)]
    elif kind == 'pop': add(sfx, pop(700), at, .3)
    elif kind == 'tick': add(sfx, tick(), at, .5)
    elif base == 'ticks': [add(sfx, tick(), at + i * (.06 + .012 * i) / k, .3) for i in range(cnt)]
    elif base == 'type': [add(sfx, key(), at + (i * .045 + rng.random() * .012) / k, .16) for i in range(cnt)]
    elif kind == 'click': add(sfx, click(), at, .55)
    elif kind == 'stamp': add(sfx, stamp(), at, .6)
    elif kind == 'down': add(sfx, down(), at, .35)
    elif kind == 'boom': add(sfx, boom(), at, .9)
    elif kind == 'shimmer': add(sfx, shimmer(), at, .35)
    elif base == 'riser': d = min(h for h in hits if h > at) - at; add(sfx, riser(d), at, .45)
    elif kind == 'hit': add(sfx, hit(), at, .8)
    elif kind == 'hit_s': add(sfx, hit(.4), at, .35)
    elif kind == 'swoop': add(sfx, swoop(), at, .3)
    elif kind == 'swell': add(sfx, swell(), at, .3)
    elif base == 'reel': [add(sfx, tick(), at + (r - .1) / k, .45) for r in reel_times(cnt)]
    else: print('unknown sfx', kind)

# ---------------- reverb + master ----------------
def reverb(x, seed):
    r = np.random.default_rng(seed); it = t_(1.8); ir = filt(r.standard_normal(len(it)), 200, 6000) * np.exp(-it / .42)
    n = 1 << int(np.ceil(np.log2(len(x) + len(ir))))
    y = np.fft.irfft(np.fft.rfft(x, n) * np.fft.rfft(ir, n), n)[:len(x)]
    return y / (np.abs(y).max() + 1e-9) * np.abs(x).max()
dry = music + sfx
L_ = dry + .22 * reverb(pads * .24 * duck + plk * .13 + sfx * .6, 1)
R_ = dry + .22 * reverb(pads * .24 * duck + plk * .13 + sfx * .6, 2)
st = np.stack([L_, R_], 1)[:int(DUR * SR)]
fade = np.ones(len(st)); fl = int(.8 * SR); fade[-fl:] = np.linspace(1, 0, fl) ** 1.5
st *= fade[:, None]
st = np.tanh(st / np.abs(st).max() * 1.6) / np.tanh(1.6) * .9
os.makedirs(os.path.join(HERE, 'out'), exist_ok=True)
with wave.open(os.path.join(HERE, 'out', 'audio.wav'), 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((st * 32767).astype('<i2').tobytes())
print('wrote out/audio.wav', round(len(st) / SR, 2), 's')
