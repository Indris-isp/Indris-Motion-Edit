"""Music bed + SFX for the SurFox launch video (no voiceover).
120 BPM, so every scene cut (on a half-second) lands on a beat.
SFX cues are in frames at 60 fps and match storyboard.md / src/config.ts.
Run:  python3 audio.py  ->  public/audio.wav (48 kHz stereo)
"""
import numpy as np
import soundfile as sf
from scipy.signal import butter, sosfilt, fftconvolve

SR = 48000
DUR = 30.0
N = int(SR * DUR)
BEAT = 0.5
rng = np.random.default_rng(7)
t_all = np.arange(N) / SR


def f2s(frame):
    return frame / 60.0


def lp(x, fc, order=2):
    return sosfilt(butter(order, fc, 'low', fs=SR, output='sos'), x)


def hp(x, fc, order=2):
    return sosfilt(butter(order, fc, 'high', fs=SR, output='sos'), x)


def bp(x, lo, hi, order=2):
    return sosfilt(butter(order, [lo, hi], 'band', fs=SR, output='sos'), x)


def place(bus, x, at, gain=1.0):
    i = int(at * SR)
    if i >= len(bus):
        return
    n = min(len(x), len(bus) - i)
    bus[i:i + n] += x[:n] * gain


def env_ad(n, a, d):
    t = np.arange(n) / SR
    return np.minimum(1, t / max(a, 1e-4)) * np.exp(-t / d)


def note(m):  # midi -> Hz
    return 440 * 2 ** ((m - 69) / 12)


def saw(freq, n, phase=0.0):
    t = np.arange(n) / SR
    return 2 * ((t * freq + phase) % 1) - 1


# ---------------- music ----------------
CHORDS = [[57, 60, 64], [53, 57, 60], [48, 52, 55], [55, 59, 62]]  # Am F C G
pad = np.zeros(N); bass = np.zeros(N); kick = np.zeros(N); hat = np.zeros(N); arp = np.zeros(N)
duck = np.ones(N)

bar_len = 4 * BEAT
for b in range(int(DUR / bar_len) + 1):
    t0 = b * bar_len
    ch = CHORDS[b % 4]
    if t0 >= 27.0:
        ch = CHORDS[0]
    n = int((bar_len + 0.6) * SR)
    x = np.zeros(n)
    for m in ch:
        for det in (-0.08, 0.0, 0.08):
            x += saw(note(m) * 2 ** (det / 12), n, rng.random())
    tt = np.arange(n) / SR
    e = np.minimum(1, tt / 0.35) * np.where(tt > bar_len, np.exp(-(tt - bar_len) / 0.2), 1)
    place(pad, lp(x, 1400) * e * 0.05, t0)

# sub bass on eighth notes, from the reveal (7.0 s) to 23.0 and 25.0 to 27.0
for k in range(int(DUR / (BEAT / 2))):
    t0 = k * BEAT / 2
    if not (7.0 <= t0 < 23.0 or 25.0 <= t0 < 27.0):
        continue
    root = CHORDS[int(t0 // bar_len) % 4][0] - 24
    n = int(0.24 * SR)
    tt = np.arange(n) / SR
    x = np.sin(2 * np.pi * note(root) * tt) + 0.3 * np.sin(4 * np.pi * note(root) * tt)
    place(bass, np.tanh(1.6 * x) * env_ad(n, 0.005, 0.12) * 0.32, t0)

# kick: 4 on the floor from 7.0 to 23.0, and 25.0 to 27.0
for k in range(int(DUR / BEAT)):
    t0 = k * BEAT
    if not (7.0 <= t0 < 23.0 or 25.0 <= t0 < 27.0):
        continue
    n = int(0.4 * SR)
    tt = np.arange(n) / SR
    fr = 45 + 95 * np.exp(-tt / 0.035)
    x = np.sin(2 * np.pi * np.cumsum(fr) / SR) * np.exp(-tt / 0.16)
    place(kick, x * 0.85, t0)
    i = int(t0 * SR)
    m = min(int(0.3 * SR), N - i)
    duck[i:i + m] = np.minimum(duck[i:i + m], 1 - 0.55 * np.exp(-np.arange(m) / SR / 0.09))

# offbeat hats from 12.5 to 23.0, and 25.0 to 27.0
for k in range(int(DUR / BEAT)):
    t0 = k * BEAT + BEAT / 2
    if not (12.5 <= t0 < 23.0 or 25.0 <= t0 < 27.0):
        continue
    n = int(0.06 * SR)
    place(hat, hp(rng.standard_normal(n), 7000) * env_ad(n, 0.001, 0.018) * 0.16, t0)

# plucked arp (16ths) from 3.5 s on, quiet under the hook/problem, fuller later
for k in range(int(DUR / (BEAT / 4))):
    t0 = k * BEAT / 4
    if t0 < 3.5 or t0 >= 27.0:
        continue
    ch = CHORDS[int(t0 // bar_len) % 4]
    m = ch[[0, 1, 2, 1][k % 4]] + 12 + (12 if k % 8 == 6 else 0)
    n = int(0.3 * SR)
    tt = np.arange(n) / SR
    x = (np.sin(2 * np.pi * note(m) * tt) + 0.25 * np.sin(6 * np.pi * note(m) * tt)) * env_ad(n, 0.002, 0.09)
    g = 0.035 if t0 < 7.0 else (0.03 if 23.0 <= t0 < 25.0 else 0.055)
    place(arp, x * g, t0)

# final chord ring-out at the logo hit (27.33 s)
n = int(2.7 * SR)
x = np.zeros(n)
for m in [45, 57, 60, 64, 69, 76]:
    x += saw(note(m), n, rng.random()) * (0.6 if m < 50 else 1)
x = lp(x, 2200) * env_ad(n, 0.01, 1.1) * 0.06
place(pad, x, f2s(1640))

music = (pad + arp) * duck + bass * duck + kick + hat

# ---------------- SFX ----------------
sfx = np.zeros(N)


def whoosh(d=0.45, g=0.22):
    n = int(d * SR)
    tt = np.arange(n) / SR
    no = rng.standard_normal(n)
    lo, hi = lp(no, 900), hp(no, 2500)
    mix = np.clip(tt / d, 0, 1)
    e = np.sin(np.pi * np.clip(tt / d, 0, 1)) ** 2
    return (lo * (1 - mix) * 0.6 + hi * mix * 0.4 + bp(no, 600, 4000) * 0.5) * e * g


def pop(f0=620, g=0.25):
    n = int(0.09 * SR)
    tt = np.arange(n) / SR
    fr = f0 * (1 + 0.6 * (1 - np.exp(-tt / 0.02)))
    return np.sin(2 * np.pi * np.cumsum(fr) / SR) * env_ad(n, 0.002, 0.03) * g


def tick(g=0.12):
    n = int(0.02 * SR)
    tt = np.arange(n) / SR
    return (np.sin(2 * np.pi * 3200 * tt) + 0.4 * rng.standard_normal(n)) * env_ad(n, 0.0005, 0.004) * g


def bell(freqs, spacing=0.07, g=0.16, d=0.9):
    n = int((d * 2 + spacing * len(freqs)) * SR)
    x = np.zeros(n)
    for i, fq in enumerate(freqs):
        m = int(d * 2 * SR)
        tt = np.arange(m) / SR
        y = (np.sin(2 * np.pi * fq * tt) + 0.35 * np.sin(2 * np.pi * fq * 2.76 * tt) * np.exp(-tt / 0.15)) * env_ad(m, 0.002, d)
        j = int(i * spacing * SR)
        x[j:j + m] += y
    return x * g


def impact(g=0.55):
    n = int(1.6 * SR)
    tt = np.arange(n) / SR
    fr = 38 + 70 * np.exp(-tt / 0.08)
    boom = np.sin(2 * np.pi * np.cumsum(fr) / SR) * np.exp(-tt / 0.5)
    noise = lp(rng.standard_normal(n), 2500) * np.exp(-tt / 0.08) * 0.35
    return np.tanh((boom + noise) * 1.4) * g


def riser(d, g=0.18):
    n = int(d * SR)
    tt = np.arange(n) / SR
    no = hp(rng.standard_normal(n), 1500)
    pitch = np.sin(2 * np.pi * np.cumsum(220 + 700 * (tt / d) ** 2) / SR) * 0.25
    return (no * 0.5 + pitch) * (tt / d) ** 2.2 * g


def click(g=0.3):
    n = int(0.03 * SR)
    tt = np.arange(n) / SR
    return (rng.standard_normal(n) * np.exp(-tt / 0.002) + np.sin(2 * np.pi * 1900 * tt) * np.exp(-tt / 0.008)) * g


# transitions (scene cuts + night falling in scene 6)
for fr in [210, 420, 570, 750, 1110, 1238, 1380, 1500, 1620]:
    place(sfx, whoosh(), f2s(fr) - 0.22)
place(sfx, whoosh(0.5, 0.12), f2s(750 + 212))           # camera zoom into the tag
place(sfx, bell([1318.5, 1975.5], 0.09, 0.14, 0.5), f2s(56))  # notification ping
for fr in [588, 592, 596]:
    place(sfx, pop(520, 0.18), f2s(fr) + 0.05)            # channel cards
for fr in [630, 636, 642]:
    place(sfx, pop(880, 0.2), f2s(fr))                    # answered chips
for fr in [794, 842, 896, 946]:
    place(sfx, pop(700, 0.22), f2s(fr))                   # chat bubbles
for fr in [854, 958]:
    place(sfx, bell([1568, 2093], 0.05, 0.1, 0.3), f2s(fr))  # lead tags
for fr in range(254, 315, 4):
    place(sfx, tick(), f2s(fr))                           # 0h → 9h 22m
for fr in [1140, 1144, 1148, 1152]:
    place(sfx, pop(600, 0.15), f2s(fr))                   # lead fields
for fr in range(1150, 1211, 6):
    place(sfx, tick(0.09), f2s(fr))                       # time to qualify
place(sfx, bell([659.3, 830.6, 987.8, 1318.5], 0.07, 0.2, 0.9), f2s(1250))  # call booked
for fr in [1414, 1418, 1422]:
    place(sfx, pop(760, 0.16), f2s(fr))                   # 24/7 rows
for fr in range(1512, 1573, 5):
    place(sfx, tick(0.1), f2s(fr))                        # $0 → $49
place(sfx, pop(300, 0.35), f2s(1572))
place(sfx, riser(1.5), f2s(420) - 1.5)
place(sfx, impact(0.55), f2s(456))                        # eyes ignite
place(sfx, riser(1.3, 0.16), f2s(1620) - 1.3)
place(sfx, impact(0.6), f2s(1640))                        # logo hit
place(sfx, click(), f2s(1720))                            # CTA click

# ---------------- mix ----------------
ir_n = int(1.6 * SR)
ir = rng.standard_normal(ir_n) * np.exp(-np.arange(ir_n) / SR / 0.35)
ir /= np.sqrt((ir ** 2).sum())
wetL = fftconvolve((pad + arp) * duck * 0.6 + sfx * 0.25, ir)[:N]
wetR = fftconvolve((pad + arp) * duck * 0.6 + sfx * 0.25, np.roll(ir, 97))[:N]
dry = music + sfx
L = dry + wetL * 0.35
R = dry + wetR * 0.35
fade = np.clip((DUR - t_all) / 0.6, 0, 1)  # last 0.6 s
st = np.stack([L * fade, R * fade], 1)
st = hp(st.T, 25).T
st = np.tanh(st / (np.abs(st).max() + 1e-9) * 1.4) / np.tanh(1.4)
st *= 0.89 / np.abs(st).max()
sf.write('public/audio.wav', st.astype(np.float32), SR, subtype='PCM_16')
print('wrote public/audio.wav', st.shape[0] / SR, 's')
