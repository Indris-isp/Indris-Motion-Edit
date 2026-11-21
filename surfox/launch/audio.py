"""Music bed + SFX for the SurFox launch video (no voiceover).
120 BPM, so every scene cut (on a half-second) lands on a beat.
SFX cues are in frames at 60 fps and follow src/scenes.tsx (scene start + local frame).
Mixed for phone speakers: light kick, controlled sub, a presence lift, and -14 LUFS.
Run:  python3 audio.py  ->  public/audio.wav (48 kHz stereo)
"""
import numpy as np
import soundfile as sf
import pyloudnorm as pyln
from scipy.signal import butter, sosfilt, fftconvolve

SR = 48000
DUR = 30.0
N = int(SR * DUR)
BEAT = 0.5
rng = np.random.default_rng(7)

# scene starts (frames) — must match src/config.ts
S = dict(hook=0, problem=210, reveal=420, doors=570, chat=750, booked=1110, always=1380, offer=1500, cta=1620)


def sec(frame):
    return frame / 60.0


def lp(x, fc, order=2):
    return sosfilt(butter(order, fc, 'low', fs=SR, output='sos'), x)


def hp(x, fc, order=2):
    return sosfilt(butter(order, fc, 'high', fs=SR, output='sos'), x)


def bp(x, lo, hi, order=2):
    return sosfilt(butter(order, [lo, hi], 'band', fs=SR, output='sos'), x)


def place(bus, x, at, gain=1.0):
    i = int(round(at * SR))
    if i < 0:
        x, i = x[-i:], 0
    if i >= len(bus):
        return
    n = min(len(x), len(bus) - i)
    bus[i:i + n] += x[:n] * gain


def env_ad(n, a, d):
    t = np.arange(n) / SR
    return np.minimum(1, t / max(a, 1e-4)) * np.exp(-t / d)


def note(m):
    return 440 * 2 ** ((m - 69) / 12)


def saw(freq, n, phase=0.0):
    # band-limited saw (additive) so the pads don't alias
    t = np.arange(n) / SR
    x = np.zeros(n)
    k = 1
    while k * freq < 9000 and k <= 24:
        x += np.sin(2 * np.pi * k * (freq * t + phase)) / k
        k += 1
    return x * 0.6


def bezier(x1, y1, x2, y2):
    """CSS / Remotion cubic-bezier easing, so SFX ticks follow the on-screen counters."""
    def f(t):
        lo, hi = 0.0, 1.0
        for _ in range(40):
            s = (lo + hi) / 2
            x = 3 * (1 - s) ** 2 * s * x1 + 3 * (1 - s) * s ** 2 * x2 + s ** 3
            lo, hi = (s, hi) if x < t else (lo, s)
        s = (lo + hi) / 2
        return 3 * (1 - s) ** 2 * s * y1 + 3 * (1 - s) * s ** 2 * y2 + s ** 3
    return f


EASE_OUT = bezier(0.16, 1, 0.3, 1)


def counter_ticks(start, dur, to, step, ease=EASE_OUT):
    """Frames where the displayed counter crosses each `step` (dense early, sparse as it settles)."""
    out, last = [], 0
    for fr in range(dur + 1):
        v = to * ease(fr / dur)
        k = int(v // step)
        if k > last:
            out.append(start + fr)
            last = k
    return out


in_drop = lambda t: 7.0 <= t < 23.0 or 25.0 <= t < 27.0

# ---------------- music ----------------
CHORDS = [[57, 60, 64], [53, 57, 60], [48, 52, 55], [55, 59, 62]]  # Am F C G
pad = np.zeros(N); bass = np.zeros(N); kick = np.zeros(N); hat = np.zeros(N); arp = np.zeros(N); pulse = np.zeros(N)
duck = np.ones(N)
bar_len = 4 * BEAT

for b in range(int(DUR / bar_len) + 1):
    t0 = b * bar_len
    ch = CHORDS[0] if t0 >= 27.0 else CHORDS[b % 4]
    n = int((bar_len + 0.6) * SR)
    x = np.zeros(n)
    for m in ch + [ch[0] + 12]:
        for det in (-0.07, 0.0, 0.07):
            x += saw(note(m) * 2 ** (det / 12), n, rng.random())
    tt = np.arange(n) / SR
    e = np.minimum(1, tt / 0.35) * np.where(tt > bar_len, np.exp(-(tt - bar_len) / 0.2), 1)
    quiet = not in_drop(t0)
    g = 0.05 if quiet else 0.034          # pads carry the intro and breakdown, sit back in the drop
    place(pad, lp(x, 2600) * e * g, t0)

# soft pulse (filtered tom on every beat) keeps energy in the intro and breakdown
for k in range(int(DUR / BEAT)):
    t0 = k * BEAT
    if in_drop(t0) or t0 >= 27.0:
        continue
    n = int(0.3 * SR)
    tt = np.arange(n) / SR
    fr = 70 + 60 * np.exp(-tt / 0.03)
    x = np.sin(2 * np.pi * np.cumsum(fr) / SR) * np.exp(-tt / 0.12)
    x += hp(rng.standard_normal(n), 3000) * np.exp(-tt / 0.004) * 0.15   # small click so phones hear it
    place(pulse, x * (0.32 if k % 2 == 0 else 0.2), t0)

# bass on eighths, drop sections only — lighter, harmonics so it reads on small speakers
for k in range(int(DUR / (BEAT / 2))):
    t0 = k * BEAT / 2
    if not in_drop(t0):
        continue
    root = CHORDS[int(t0 // bar_len) % 4][0] - 24
    n = int(0.24 * SR)
    tt = np.arange(n) / SR
    x = np.sin(2 * np.pi * note(root) * tt) + 0.5 * np.sin(4 * np.pi * note(root) * tt) + 0.25 * np.sin(6 * np.pi * note(root) * tt)
    place(bass, np.tanh(1.4 * x) * env_ad(n, 0.005, 0.11) * 0.17, t0)

# kick: lighter, higher, with a beater click
for k in range(int(DUR / BEAT)):
    t0 = k * BEAT
    if not in_drop(t0):
        continue
    n = int(0.35 * SR)
    tt = np.arange(n) / SR
    fr = 58 + 100 * np.exp(-tt / 0.03)
    x = np.sin(2 * np.pi * np.cumsum(fr) / SR) * np.exp(-tt / 0.12)
    x += hp(rng.standard_normal(n), 2500) * np.exp(-tt / 0.003) * 0.25
    place(kick, x * 0.42, t0)
    i = int(t0 * SR)
    m = min(int(0.25 * SR), N - i)
    duck[i:i + m] = np.minimum(duck[i:i + m], 1 - 0.28 * np.exp(-np.arange(m) / SR / 0.08))

# offbeat hats (soft attack) from the chat scene on
for k in range(int(DUR / BEAT)):
    t0 = k * BEAT + BEAT / 2
    if not (12.5 <= t0 < 23.0 or 25.0 <= t0 < 27.0):
        continue
    n = int(0.07 * SR)
    place(hat, hp(rng.standard_normal(n), 6500) * env_ad(n, 0.003, 0.025) * 0.14, t0)

# plucked arp (16ths), an octave up for presence
for k in range(int(DUR / (BEAT / 4))):
    t0 = k * BEAT / 4
    if t0 < 1.0 or t0 >= 27.0:
        continue
    ch = CHORDS[int(t0 // bar_len) % 4]
    m = ch[[0, 1, 2, 1][k % 4]] + 24 + (12 if k % 8 == 6 else 0)
    n = int(0.3 * SR)
    tt = np.arange(n) / SR
    x = (np.sin(2 * np.pi * note(m) * tt) + 0.3 * np.sin(4 * np.pi * note(m) * tt)) * env_ad(n, 0.002, 0.08)
    g = 0.05 if t0 < 3.5 else 0.06
    place(arp, x * g, t0)

# final chord ring-out from the logo hit
n = int(3.0 * SR)
x = np.zeros(n)
for m in [45, 57, 60, 64, 69, 76]:
    x += saw(note(m), n, rng.random()) * (0.6 if m < 50 else 1)
place(pad, lp(x, 3000) * env_ad(n, 0.01, 1.2) * 0.07, 27.0)

music = (pad + arp + bass) * duck + kick + hat + pulse

# ---------------- SFX ----------------
sfx = np.zeros(N)


def whoosh(d=0.45, g=0.3):
    n = int(d * SR)
    tt = np.arange(n) / SR
    no = rng.standard_normal(n)
    mix = np.clip(tt / d, 0, 1)
    e = np.sin(np.pi * np.clip(tt / d, 0, 1)) ** 2
    return (lp(no, 1200) * (1 - mix) * 0.5 + hp(no, 3000) * mix * 0.5 + bp(no, 800, 5000) * 0.5) * e * g


def pop(f0=900, g=0.3):
    n = int(0.1 * SR)
    tt = np.arange(n) / SR
    fr = f0 * (1 + 0.5 * (1 - np.exp(-tt / 0.02)))
    ph = 2 * np.pi * np.cumsum(fr) / SR
    return (np.sin(ph) + 0.35 * np.sin(2 * ph)) * env_ad(n, 0.002, 0.035) * g


def tick(g=0.18):
    n = int(0.025 * SR)
    tt = np.arange(n) / SR
    return (np.sin(2 * np.pi * 3400 * tt) + 0.3 * rng.standard_normal(n)) * env_ad(n, 0.0005, 0.005) * g


def bell(freqs, spacing=0.07, g=0.2, d=0.9):
    n = int((d * 2 + spacing * len(freqs)) * SR)
    x = np.zeros(n)
    for i, fq in enumerate(freqs):
        m = int(d * 2 * SR)
        tt = np.arange(m) / SR
        y = (np.sin(2 * np.pi * fq * tt) + 0.35 * np.sin(2 * np.pi * fq * 2.76 * tt) * np.exp(-tt / 0.15)) * env_ad(m, 0.002, d)
        j = int(i * spacing * SR)
        x[j:j + m] += y
    return x * g


def impact(g=0.5):
    n = int(1.6 * SR)
    tt = np.arange(n) / SR
    fr = 45 + 80 * np.exp(-tt / 0.07)
    boom = np.sin(2 * np.pi * np.cumsum(fr) / SR) * np.exp(-tt / 0.35)
    crack = bp(rng.standard_normal(n), 1500, 7000) * np.exp(-tt / 0.05) * 0.6   # top end so phones hear the hit
    tail = lp(rng.standard_normal(n), 4000) * np.exp(-tt / 0.4) * 0.12
    return np.tanh((boom + crack + tail) * 1.3) * g


def riser(d, g=0.22):
    """Ends exactly at its placement time + d; the last 40 ms fade so it resolves into the hit."""
    n = int(d * SR)
    tt = np.arange(n) / SR
    no = hp(rng.standard_normal(n), 1500)
    pitch = np.sin(2 * np.pi * np.cumsum(260 + 900 * (tt / d) ** 2) / SR) * 0.25
    tailfade = np.clip((d - tt) / 0.04, 0, 1)
    return (no * 0.5 + pitch) * (tt / d) ** 2.2 * tailfade * g


def shimmer(g=0.16):
    # bright "power-on" for the fox eyes igniting (no second boom)
    x = bell([1760, 2637, 3520], 0.03, g, 0.5)
    n = int(0.4 * SR)
    x[:n] += hp(rng.standard_normal(n), 5000) * env_ad(n, 0.005, 0.08) * g * 0.5
    return x


def click(g=0.35):
    n = int(0.03 * SR)
    tt = np.arange(n) / SR
    return (rng.standard_normal(n) * np.exp(-tt / 0.002) + np.sin(2 * np.pi * 2200 * tt) * np.exp(-tt / 0.008)) * g


# transitions: whoosh peaks on each cut, plus night falling in scene 6
for fr in [S['problem'], S['doors'], S['chat'], S['booked'], S['booked'] + 128, S['always'], S['offer']]:
    place(sfx, whoosh(), sec(fr) - 0.225)

# hook
place(sfx, bell([1318.5, 1975.5], 0.09, 0.2, 0.5), sec(S['hook'] + 60))       # notification lands

# problem: ticks follow the 0h → 9h 22m count, thunk when it lands
for fr in counter_ticks(S['problem'] + 36, 60, 562, 45):
    place(sfx, tick(), sec(fr))
place(sfx, pop(260, 0.3), sec(S['problem'] + 96))

# reveal: riser resolves into one impact on the cut / drop, shimmer when the eyes ignite
place(sfx, riser(1.5), sec(S['reveal']) - 1.5)
place(sfx, impact(0.5), sec(S['reveal']))
place(sfx, shimmer(), sec(S['reveal'] + 36))

# doors
for i in range(3):
    place(sfx, pop(820, 0.24), sec(S['doors'] + 10 + i * 4 + 6))
    place(sfx, pop(1250, 0.24), sec(S['doors'] + 52 + i * 6))

# chat: clock ticks every 0.5 s of displayed time while the AI types (linear, real time)
for k in range(1, 9):
    place(sfx, tick(0.12), sec(S['chat'] + 20 + k * 7.5))
for fr in [80, 122, 176, 216]:
    place(sfx, pop(1000, 0.26), sec(S['chat'] + fr + 4))
for fr in [134, 228]:
    place(sfx, bell([1568, 2093], 0.05, 0.16, 0.3), sec(S['chat'] + fr + 4))
place(sfx, whoosh(0.5, 0.16), sec(S['chat'] + 232))                          # zoom in

# booked
for i in range(4):
    place(sfx, pop(900, 0.18), sec(S['booked'] + 22 + i * 4 + 4))
for fr in counter_ticks(S['booked'] + 32, 60, 243, 20):
    place(sfx, tick(0.13), sec(fr))
place(sfx, bell([659.3, 830.6, 987.8, 1318.5], 0.07, 0.24, 0.9), sec(S['booked'] + 144))

# always on
for i in range(3):
    place(sfx, pop(950, 0.2), sec(S['always'] + 28 + i * 4 + 4))

# offer: ticks follow $0 → $49
for fr in counter_ticks(S['offer'] + 6, 60, 49, 4):
    place(sfx, tick(0.15), sec(fr))
place(sfx, pop(320, 0.4), sec(S['offer'] + 66))

# cta: riser resolves into the impact on the cut, shimmer on the eyes, click on the button
place(sfx, riser(1.3, 0.2), sec(S['cta']) - 1.3)
place(sfx, impact(0.55), sec(S['cta']))
place(sfx, shimmer(0.18), sec(S['cta'] + 18))
place(sfx, click(), sec(S['cta'] + 98))

# ---------------- mix + master ----------------
ir_n = int(1.6 * SR)
ir = rng.standard_normal(ir_n) * np.exp(-np.arange(ir_n) / SR / 0.35)
ir /= np.sqrt((ir ** 2).sum())
send = (pad + arp) * duck * 0.6 + sfx * 0.2
L = music + sfx + fftconvolve(send, ir)[:N] * 0.3
R = music + sfx + fftconvolve(send, np.roll(ir, 97))[:N] * 0.3
st = np.stack([L, R], 1)
st = hp(st.T, 35).T                                  # nothing useful below 35 Hz
st = st + 0.6 * bp(st.T, 2000, 6000).T               # presence lift for phone speakers
fade = np.clip((DUR - np.arange(N) / SR) / 0.6, 0, 1)
st *= fade[:, None]
# gentle limiter, then loudness-normalise to -14 LUFS with ~-1 dBTP headroom
meter = pyln.Meter(SR)
st = st / (np.abs(st).max() + 1e-9)
for _ in range(4):
    gain = 10 ** ((-14.0 - meter.integrated_loudness(st)) / 20)
    st = np.tanh(st * gain * 1.15) / 1.15
st = np.clip(st, -0.89, 0.89)
sf.write('public/audio.wav', st.astype(np.float32), SR, subtype='PCM_16')
print('wrote public/audio.wav  LUFS %.1f  peak %.2f' % (meter.integrated_loudness(st), np.abs(st).max()))
