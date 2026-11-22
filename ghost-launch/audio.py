"""Synthesised soundtrack for the Ghost launch video (no samples, numpy only).

Music follows the story: warm opening (0-7 s), tense minor pulse through the problems (7-20 s),
hard silence on the cut, a shimmering riser in the starfield, an impact on the flash to white,
then an uplifting major groove to the end card. SFX are placed on the exact frames the visuals use.

Run:  python3 audio.py   ->  out/audio.wav  (48 kHz stereo, 45.0 s)
"""
import wave
import numpy as np

SR = 48000
FPS = 60
DUR = 2700 / FPS
N = int(DUR * SR)
rng = np.random.default_rng(7)
t_all = np.arange(N) / SR


def at(frame):
    return int(frame / FPS * SR)


def env_adsr(n, a=0.01, d=0.1, s=0.7, r=0.2):
    a, d, r = int(a * SR), int(d * SR), int(r * SR)
    s_len = max(0, n - a - d - r)
    return np.concatenate([np.linspace(0, 1, a, False), np.linspace(1, s, d, False), np.full(s_len, s), np.linspace(s, 0, r)])[:n]


def lowpass(x, cutoff):
    X = np.fft.rfft(x)
    f = np.fft.rfftfreq(len(x), 1 / SR)
    X *= 1 / (1 + (f / cutoff) ** 4)
    return np.fft.irfft(X, len(x))


def highpass(x, cutoff):
    X = np.fft.rfft(x)
    f = np.fft.rfftfreq(len(x), 1 / SR)
    X *= 1 / (1 + (cutoff / np.maximum(f, 1)) ** 4)
    return np.fft.irfft(X, len(x))


def saw(freq, n, detune=0.0):
    t = np.arange(n) / SR
    out = np.zeros(n)
    for d in (-detune, 0, detune):
        ph = (t * freq * (1 + d)) % 1.0
        out += 2 * ph - 1
    return out / 3


def midi(m):
    return 440 * 2 ** ((m - 69) / 12)


L = np.zeros(N)
R = np.zeros(N)


def put(sig, start, gain=1.0, pan=0.0):
    if start >= N:
        return
    n = min(len(sig), N - start)
    gl, gr = gain * np.sqrt((1 - pan) / 2) * 1.414, gain * np.sqrt((1 + pan) / 2) * 1.414
    L[start:start + n] += sig[:n] * gl
    R[start:start + n] += sig[:n] * gr


# ---------------------------------------------------------------- music
def pad(chord, start_s, dur_s, gain, cutoff):
    n = int(dur_s * SR)
    sig = sum(saw(midi(m), n, 0.004) for m in chord) / len(chord)
    sig = lowpass(sig, cutoff) * env_adsr(n, 0.4, 0.3, 0.85, min(0.8, dur_s * 0.3))
    put(sig, int(start_s * SR), gain, -0.2)
    put(np.roll(sig, 480), int(start_s * SR), gain, 0.2)


def pluck(m, start_s, gain=0.18, decay=0.35, pan=0.0):
    n = int(0.9 * SR)
    t = np.arange(n) / SR
    f = midi(m)
    sig = (np.sin(2 * np.pi * f * t) + 0.35 * np.sin(4 * np.pi * f * t) + 0.12 * np.sin(6 * np.pi * f * t)) * np.exp(-t / decay)
    sig *= np.minimum(1, t / 0.003)
    put(sig, int(start_s * SR), gain, pan)


def kick(start_s, gain=0.55):
    n = int(0.35 * SR)
    t = np.arange(n) / SR
    f = 45 + 110 * np.exp(-t * 28)
    sig = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 9)
    put(sig, int(start_s * SR), gain)


def hat(start_s, gain=0.06, pan=0.3):
    n = int(0.06 * SR)
    sig = highpass(rng.standard_normal(n), 7000) * np.exp(-np.arange(n) / SR * 70)
    put(sig, int(start_s * SR), gain, pan)


def clap(start_s, gain=0.14):
    n = int(0.18 * SR)
    t = np.arange(n) / SR
    sig = highpass(rng.standard_normal(n), 1200) * (np.exp(-t * 30) + 0.5 * np.exp(-np.maximum(0, t - 0.012) * 30) * (t > 0.012))
    put(sig, int(start_s * SR), gain)


BPM = 104
BEAT = 60 / BPM

# Act 1 (0–7 s): warm, open
for i, ch in enumerate([[57, 64, 69, 73], [54, 61, 66, 69]]):
    pad(ch, i * 3.5, 3.6, 0.10, 1800)
for k in range(int(7 / (BEAT / 2))):
    pluck([69, 73, 76, 81][k % 4], k * BEAT / 2, 0.07, 0.25, 0.4 if k % 2 else -0.4)

# Act 2 (7–20 s): tense minor pulse, filter slowly opening
for i, ch in enumerate([[45, 52, 57, 60], [41, 48, 53, 57], [43, 50, 55, 58], [45, 52, 57, 60]]):
    pad(ch, 7 + i * 3.25, 3.35, 0.11, 700 + i * 350)
k = 0
tt = 7.0
while tt < 19.9:
    pluck([33, 33, 45, 33][k % 4], tt, 0.16, 0.12)
    if k % 4 == 0:
        kick(tt, 0.35)
    hat(tt + BEAT / 4, 0.035)
    tt += BEAT / 2
    k += 1
# rising tension in the last 3 s
n = int(3 * SR)
rise = lowpass(saw(midi(57), n, 0.01), 2500) * np.linspace(0, 1, n) ** 2
put(rise, int(17 * SR), 0.06)
# hard silence at 20.0 s (the cut to the starfield)
cut = int(20.0 * SR)
L[cut - 200:cut] *= np.linspace(1, 0, 200)
R[cut - 200:cut] *= np.linspace(1, 0, 200)
L[cut:int(20.05 * SR)] = 0
R[cut:int(20.05 * SR)] = 0

# Act 3 (20–21.7 s): starfield shimmer riser
n = int(1.7 * SR)
t = np.arange(n) / SR
shimmer = sum(np.sin(2 * np.pi * midi(m) * t * (1 + 0.002 * np.sin(2 * np.pi * 5 * t))) for m in (81, 88, 93, 100)) / 4
shimmer *= np.linspace(0, 1, n) ** 1.6
noise_r = highpass(rng.standard_normal(n), 3000) * np.linspace(0, 1, n) ** 3 * 0.25
put(shimmer + noise_r, int(20.05 * SR), 0.14)

# Act 4–5 (21.67–45 s): uplifting major groove  (I–V–vi–IV in D major)
START4 = 1300 / FPS
prog = [[50, 57, 62, 66], [45, 52, 57, 61], [47, 54, 59, 62], [43, 50, 55, 59]]
bar = BEAT * 4
i = 0
s = START4
while s < DUR - 0.01:
    d = min(bar, DUR - s)
    pad(prog[i % 4], s, d + 0.1, 0.10, 2600)
    pluck(prog[i % 4][0] - 12, s, 0.2, 0.3)
    i += 1
    s += bar
k = 0
s = START4
arp = [74, 78, 81, 86, 81, 78]
while s < DUR - 1.2:
    beat_in_bar = k % 8
    if beat_in_bar in (0, 4) and s > START4 + 0.1:
        kick(s, 0.45)
    if beat_in_bar in (2, 6) and s > START4 + bar:
        clap(s, 0.12)
    hat(s + BEAT / 4, 0.04, -0.3 if k % 2 else 0.3)
    pluck(arp[k % len(arp)], s, 0.055, 0.18, 0.5 if k % 2 else -0.5)
    s += BEAT / 2
    k += 1
# final resolve chord on the end card
pad([50, 57, 62, 66, 69], DUR - 2.6, 2.6, 0.14, 3200)

# ---------------------------------------------------------------- SFX
def click(frame, gain=0.25, pan=0.0):
    n = int(0.03 * SR)
    t = np.arange(n) / SR
    sig = (rng.standard_normal(n) * 0.5 + np.sin(2 * np.pi * 2400 * t)) * np.exp(-t * 260)
    put(sig, at(frame), gain, pan)


def key(frame, gain=0.10):
    n = int(0.025 * SR)
    t = np.arange(n) / SR
    sig = highpass(rng.standard_normal(n), 2500) * np.exp(-t * 320)
    put(sig, at(frame), gain, rng.uniform(-0.3, 0.3))


def pop(frame, gain=0.22, pitch=900, pan=0.0):
    n = int(0.12 * SR)
    t = np.arange(n) / SR
    f = pitch * (1 + 1.5 * np.exp(-t * 40))
    sig = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 30)
    put(sig, at(frame), gain, pan)


def whoosh(frame, dur=0.45, gain=0.25, up=True):
    n = int(dur * SR)
    t = np.linspace(0, 1, n)
    noise = rng.standard_normal(n)
    sig = lowpass(noise, 2500) * np.sin(np.pi * t) ** 2
    sig = highpass(sig, 300)
    put(sig, at(frame), gain, -0.4 if up else 0.4)


def impact(frame, gain=0.6):
    n = int(1.4 * SR)
    t = np.arange(n) / SR
    boom = np.sin(2 * np.pi * np.cumsum(40 + 80 * np.exp(-t * 18)) / SR) * np.exp(-t * 3.5)
    air = lowpass(rng.standard_normal(n), 1800) * np.exp(-t * 6) * 0.4
    put(boom + air, at(frame), gain)


def chime(frame, notes=(86, 90, 93), gain=0.12):
    for j, m in enumerate(notes):
        n = int(1.2 * SR)
        t = np.arange(n) / SR
        sig = np.sin(2 * np.pi * midi(m) * t) * np.exp(-t * 3) * np.minimum(1, t / 0.002)
        put(sig, at(frame) + int(j * 0.06 * SR), gain, (j - 1) * 0.4)


def tick(frame, gain=0.12, pitch=3200):
    n = int(0.02 * SR)
    t = np.arange(n) / SR
    put(np.sin(2 * np.pi * pitch * t) * np.exp(-t * 400), at(frame), gain)


def buzz(frame, gain=0.16):
    n = int(0.35 * SR)
    t = np.arange(n) / SR
    sig = np.sign(np.sin(2 * np.pi * 140 * t)) * np.exp(-t * 6) * (0.6 + 0.4 * np.sign(np.sin(2 * np.pi * 14 * t)))
    put(lowpass(sig, 1800), at(frame), gain)


def down_whoop(frame, dur=1.1, gain=0.12):
    n = int(dur * SR)
    t = np.arange(n) / SR
    f = 700 * np.exp(-t * 1.6) + 120
    put(np.sin(2 * np.pi * np.cumsum(f) / SR) * np.sin(np.pi * t / dur), at(frame), gain)


def swish(frame, dur=0.7, gain=0.12):
    n = int(dur * SR)
    t = np.arange(n) / SR
    sig = highpass(rng.standard_normal(n), 4000) * np.sin(np.pi * t / dur) ** 2
    put(sig, at(frame), gain, 0.3)


# Scene 01 · hook (0)
for k in range(10):
    key(6 + 3 * k)
for k in range(6):
    pop(58 + 6 * k, 0.12, 700 + 80 * k, -0.6 + 0.24 * k)
for f in (96, 128, 156, 180):
    tick(f, 0.10, 2600)
whoosh(190, 0.4, 0.14)
# Scene 02 · who (210)
for k in range(12):
    pop(212 + 3 * k, 0.05, 1100 + 40 * k, rng.uniform(-0.7, 0.7))
for k in range(0, 30, 2):
    key(306 + 2 * k, 0.08)
whoosh(398, 0.4, 0.16)
# Scene 03 · reach (420)
whoosh(452, 0.45, 0.3)
pop(490, 0.2, 600)
down_whoop(516, 1.2, 0.12)
pop(580, 0.18, 500)
whoosh(640, 0.35, 0.28, False)
# Scene 04 · fees (660)
pop(704, 0.22, 650)
for k in range(10):
    tick(752 + 6 * k, 0.09, 3600 - 120 * k)
whoosh(752, 0.6, 0.18, False)
for k in range(0, 34, 2):
    key(806 + 2 * k, 0.07)
whoosh(880, 0.35, 0.28, False)
# Scene 05 · tools (900)
for k in range(5):
    pop(908 + 6 * k, 0.12, 800 + 60 * k)
for k in range(5):
    pop(940 + 16 * k, 0.16, 1200, 0.3)
    tick(940 + 16 * k + 4, 0.08, 2000)
for f in (1028, 1060):
    click(f, 0.22)
click(1090, 0.22)
buzz(1090, 0.16)
for k in range(0, 37, 2):
    key(1100 + int(1.6 * k), 0.07)
# Scene 06 · meet (1200)
swish(1210, 0.9, 0.08)
swish(1240, 0.8, 0.1)
impact(1294, 0.7)
for k in range(6):
    key(1304 + 5 * k, 0.09)
chime(1340, (81, 86, 90), 0.08)
# Scene 07 · publish (1440)
whoosh(1440, 0.6, 0.14)
for k in range(0, 24, 2):
    key(1470 + 2 * k, 0.07)
click(1556, 0.26)
whoosh(1570, 0.4, 0.3, False)
for k in range(3):
    chime(1586 + 6 * k, (93 + k * 2,), 0.07)
for k in range(0, 26, 2):
    key(1604 + 2 * k, 0.06)
# Scene 08 · paid (1680)
click(1730, 0.25)
pop(1731, 0.12, 1400)
for k in range(10):
    pop(1740 + 5 * k, 0.05, 900 + 50 * k, rng.uniform(-0.7, 0.7))
whoosh(1800, 0.6, 0.2)
click(1838, 0.24)
chime(1864, (86, 90, 93), 0.09)
# Scene 09 · dash (1920)
whoosh(1985, 0.5, 0.14)
swish(2004, 0.8, 0.08)
for k in range(3):
    pop(2066 + 5 * k, 0.14, 900 + 120 * k, (k - 1) * 0.5)
# Scene 10 · proof (2160)
for k in range(20):
    tick(2166 + 3 * k, 0.06, 3000 + 40 * k)
impact(2226, 0.35)
whoosh(2324, 0.35, 0.14)
# Scene 11 · payoff (2340)
for k in range(11):
    tick(2344 + 6 * k, 0.12, 1800)
click(2404, 0.25)
whoosh(2424, 0.4, 0.14)
impact(2436, 0.4)
# Scene 12 · CTA (2520)
chime(2524, (74, 81, 86, 90), 0.1)
for k in range(0, 36, 3):
    key(2548 + k, 0.06)
click(2640, 0.25)
chime(2642, (93,), 0.06)

# ---------------------------------------------------------------- master
mix = np.stack([L, R], 1)
mix = np.tanh(mix * 1.6) / np.tanh(1.6)
fade_in, fade_out = int(0.05 * SR), int(0.6 * SR)
mix[:fade_in] *= np.linspace(0, 1, fade_in)[:, None]
mix[-fade_out:] *= np.linspace(1, 0, fade_out)[:, None]
mix *= 0.89 / np.abs(mix).max()
with wave.open("out/audio.wav", "wb") as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes((mix * 32767).astype("<i2").tobytes())
print(f"wrote out/audio.wav ({DUR:.1f} s)")
