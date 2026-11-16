"""Synthesises the music bed + SFX for the ISP promo (27 s, 48 kHz stereo).
Everything is generated here, so there are no licensing questions.
Run from video/: python3 v2/audio.py  ->  out/v2/audio.wav
"""
import numpy as np, wave, os

SR, DUR = 48000, 27.0
N = int(SR * DUR)
rng = np.random.default_rng(7)
L = np.zeros(N); R = np.zeros(N)
FR = 1 / 30

def t_(d): return np.arange(int(d * SR)) / SR
def add(sig, at, gain=1.0, pan=0.0):
    i = int(at * SR)
    if i >= N: return
    s = sig[: N - i] * gain
    if s.ndim == 2:
        L[i:i + len(s)] += s[:, 0]; R[i:i + len(s)] += s[:, 1]; return
    L[i:i + len(s)] += s * np.sqrt(0.5 * (1 - pan)); R[i:i + len(s)] += s * np.sqrt(0.5 * (1 + pan))
def lp(x, fc):
    """one-pole lowpass; fc may be scalar or per-sample array"""
    fc = np.broadcast_to(np.asarray(fc, float), x.shape)
    a = 1 - np.exp(-2 * np.pi * fc / SR)
    y = np.empty_like(x); acc = 0.0
    for i in range(len(x)):
        acc += a[i] * (x[i] - acc); y[i] = acc
    return y
def note(m): return 440.0 * 2 ** ((m - 69) / 12)

# ---------------- music bed: warm pad + soft pluck arpeggio ----------------
chords = [[50, 54, 57, 61, 64], [47, 50, 54, 57, 61], [43, 47, 50, 54, 57], [45, 49, 52, 59, 64]]  # Dmaj9 Bm9 Gmaj9 A(add9)
seg = DUR / 8
pad = np.zeros(N)
tt = np.arange(N) / SR
for k in range(8):
    ch = chords[k % 4]; a, b = k * seg, (k + 1) * seg
    env = np.clip((tt - a + 0.9) / 1.2, 0, 1) * np.clip((b + 0.9 - tt) / 1.2, 0, 1)
    env = np.sin(env * np.pi / 2) ** 2
    m = env > 0
    for n in ch:
        f = note(n)
        for det in (-0.0018, 0.0, 0.0021):
            pad[m] += env[m] * (np.sin(2 * np.pi * f * (1 + det) * tt[m]) + 0.18 * np.sin(4 * np.pi * f * (1 + det) * tt[m])) / len(ch)
pad *= 0.5 + 0.12 * np.sin(2 * np.pi * 0.11 * tt)
pad = lp(pad, 900.0)
add(pad, 0, 0.16)

# pluck arpeggio (eighths at 100 bpm), quiet, panned
step = 0.3
for i in range(int(DUR / step)):
    t0 = i * step
    ch = chords[int(t0 // seg) % 4]
    n = ch[[0, 2, 4, 3, 1, 2, 4, 3][i % 8]] + 12
    d = t_(0.9); f = note(n)
    s = (np.sin(2 * np.pi * f * d) + 0.3 * np.sin(4 * np.pi * f * d)) * np.exp(-d * 6.5) * np.minimum(1, d * 400)
    add(s, t0, 0.045 * (0.85 + 0.3 * rng.random()), pan=0.35 * np.sin(i * 0.9))
# soft sub pulse on the beat
for i in range(int(DUR / 0.6)):
    d = t_(0.5); f = 48 + 30 * np.exp(-d * 30)
    add(np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-d * 9), i * 0.6, 0.10)

# ---------------- SFX ----------------
def whoosh(dur=0.42, peak=0.62, up=5200, low=250):
    d = t_(dur); x = rng.standard_normal(len(d))
    p = d / dur
    env = np.where(p < peak, (p / peak) ** 2.2, ((1 - p) / (1 - peak)) ** 1.6)
    fc = low + (up - low) * env
    y = lp(lp(x, fc), fc) * env
    y /= np.abs(y).max() + 1e-9
    pan = np.linspace(-0.8, 0.8, len(d))
    return np.stack([y * np.sqrt(0.5 * (1 - pan)), y * np.sqrt(0.5 * (1 + pan))], 1)
def pop(f0=820, f1=380):
    d = t_(0.16); f = f1 + (f0 - f1) * np.exp(-d * 45)
    s = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-d * 32) * np.minimum(1, d * 2000)
    return s
def tick():
    d = t_(0.04)
    return (np.sin(2 * np.pi * 2600 * d) * 0.6 + rng.standard_normal(len(d)) * 0.4) * np.exp(-d * 260)
def boom():
    d = t_(1.0); f = 42 + 70 * np.exp(-d * 14)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-d * 4.5)
def sting():
    d = t_(2.6); s = np.zeros(len(d))
    for m, g in ((74, 1), (78, .7), (81, .6), (86, .45), (90, .25)):
        f = note(m)
        s += g * (np.sin(2 * np.pi * f * d) + 0.25 * np.sin(2 * np.pi * f * 2.76 * d) * np.exp(-d * 6)) * np.exp(-d * (1.6 + m / 120))
    return s * np.minimum(1, d * 300) / 2.5

boundaries = [1.4, 2.8, 4.3, 5.9, 6.9, 10.8, 12.8, 13.9, 21.0, 24.3]
for b in boundaries:                       # whoosh peaks right on the cut
    add(whoosh(), b - 0.42 * 0.62 + 2 * FR, 0.30)
add(whoosh(0.30, 0.5, 7000), 0.0, 0.40)   # hook slam
add(boom(), 0.07, 0.38)
add(boom(), 21.0 + 1.62 + 4 * FR, 0.22)   # punchline lands
for i in range(3): add(pop(900 - i * 40), 4.3 + 0.3 + i * 0.28, 0.30)            # UI cards
for a in (7.05, 8.25, 9.45): add(pop(700, 300), a, 0.40)                          # hexagons
for i, a in enumerate((10.8, 11.25, 11.7, 12.15)): add(pop(560 + i * 60, 260), a, 0.30)  # word beats
for i, a in enumerate((14.15, 15.1, 16.05, 17.0, 18.0, 19.0)): add(pop(820 + 30 * (i % 3), 420), a, 0.30, pan=(-.3 if i % 2 == 0 else .3))  # pills
prev = 6
for f in range(int(5.95 * 30), int(6.65 * 30) + 2):                                # counter ticks
    tl = f / 30 - 5.9
    p = min(1, max(0, (tl - .05) / .7)); eo = 4 * p ** 3 if p < .5 else 1 - (-2 * p + 2) ** 3 / 2
    n = round(6 + 8 * eo)
    if n != prev: add(tick(), f / 30, 0.22); prev = n
add(sting(), 24.3 + 0.1, 0.55)                                                   # logo
add(boom(), 24.3 + 0.1, 0.25)

# ---------------- master ----------------
mixd = np.stack([L, R], 1)
fade = np.clip((DUR - tt) / 0.6, 0, 1)[:, None]
fin = np.clip(tt / 0.02, 0, 1)[:, None]
mixd *= fade * fin
mixd = np.tanh(mixd * 1.2) / np.tanh(1.2)
mixd *= 0.89 / np.abs(mixd).max()
os.makedirs('out/v2', exist_ok=True)
with wave.open('out/v2/audio.wav', 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((mixd * 32767).astype('<i2').tobytes())
print('wrote out/v2/audio.wav')
