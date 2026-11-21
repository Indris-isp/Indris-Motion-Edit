"""Temp soundtrack: synthesized music bed + SFX, cued from src/timing.json.
Replace public/soundtrack.wav with the licensed track when it arrives.
Run:  python3 scripts/soundtrack.py   ->  public/soundtrack.wav (48 kHz stereo, 30 s)
"""
import json, wave
import numpy as np

T = json.load(open('src/timing.json'))
SR, FPS = 48000, T['fps']
DUR = T['total'] / FPS
N = int(DUR * SR)
rng = np.random.default_rng(7)
t_all = np.arange(N) / SR

def at(scene, local):  # scene-local frame -> seconds
    return (T['scenes'][scene]['from'] + local) / FPS

def lowpass(x, k):  # moving-average smoothing (cheap low-pass)
    return np.convolve(x, np.ones(k) / k, mode='same')

def env(n, a, r):
    e = np.ones(n)
    a, r = int(a * SR), int(r * SR)
    if a: e[:a] = np.linspace(0, 1, a)
    if r: e[-r:] *= np.exp(-np.linspace(0, 6, r))
    return e

def place(buf, sig, sec, gain=1.0, pan=0.0):
    i = int(sec * SR); n = min(len(sig), N - i)
    if n <= 0: return
    buf[i:i + n, 0] += sig[:n] * gain * (1 - pan) ** 0.5
    buf[i:i + n, 1] += sig[:n] * gain * (1 + pan) ** 0.5

# ---------- music: 110 BPM, I–V–vi–IV in C, energy follows the story ----------
BPM = 110; beat = 60 / BPM; bar = 4 * beat
mus = np.zeros((N, 2))
note = lambda m: 440 * 2 ** ((m - 69) / 12)
chords = [[60, 64, 67, 71], [55, 59, 62, 67], [57, 60, 64, 69], [53, 57, 60, 65]]  # Cmaj7, G, Am, Fmaj7
s3, s4, s5 = at('s3', 0), at('s4', 0), at('s5', 0)

# energy curve: 0.35 intro (problem), 0.7 product, 1.0 payoff, resolve on logo
energy = np.interp(t_all, [0, s3 - 0.2, s3, s4, s5, DUR - 1.5, DUR], [0.35, 0.45, 0.75, 1.0, 0.85, 0.7, 0.0])

for b in range(int(DUR / bar) + 1):
    ch = chords[b % 4]; t0 = b * bar; n = int(bar * SR); tt = np.arange(n) / SR
    pad = sum(np.sin(2 * np.pi * note(m) * tt) + 0.5 * np.sin(2 * np.pi * note(m) * 1.003 * tt) for m in ch)
    pad *= env(n, 0.25, 0.4) * 0.05
    place(mus, pad, t0, 1.0, -0.2); place(mus, pad, t0 + 0.012, 0.8, 0.2)
    bass = np.sin(2 * np.pi * note(ch[0] - 24) * tt) * env(n, 0.01, 1.2) * 0.22
    place(mus, bass, t0)
    # arp from the product scene on
    if t0 >= s3 - bar:
        for k in range(8):
            m = ch[[0, 1, 2, 3, 2, 1, 2, 3][k]] + 12
            nn = int(beat / 2 * SR); ttt = np.arange(nn) / SR
            pl = (np.sin(2 * np.pi * note(m) * ttt) + 0.3 * np.sin(4 * np.pi * note(m) * ttt)) * env(nn, 0.003, 0.25) * 0.05
            place(mus, pl, t0 + k * beat / 2, 1.0, 0.35 if k % 2 else -0.35)

# drums: kick on every beat, hats from scene 3, clap on 2 & 4 in the payoff
kick_n = int(0.35 * SR); kt = np.arange(kick_n) / SR
kick = np.sin(2 * np.pi * (45 * kt + 70 * (1 - np.exp(-kt * 30)) / 30)) * np.exp(-kt * 9) * 0.6
hat = lowpass(rng.standard_normal(int(0.05 * SR)), 1)
hat = (hat - lowpass(hat, 6)) * np.exp(-np.arange(len(hat)) / SR * 70) * 0.12
clap = (rng.standard_normal(int(0.18 * SR)) * np.exp(-np.arange(int(0.18 * SR)) / SR * 22)) * 0.14
k = 0
while k * beat < DUR - 1.2:
    tb = k * beat
    if tb >= 0.5: place(mus, kick, tb, 0.55 if tb < s3 else 0.85)
    if tb >= s3: place(mus, hat, tb + beat / 2, 1.0, 0.3)
    if s4 <= tb < s5 + bar and k % 2 == 1: place(mus, clap, tb, 1.0, -0.1)
    k += 1
mus *= energy[:, None]

# ---------- SFX ----------
sfx = np.zeros((N, 2))
def tone(freq, dur, decay, glide=0.0):
    n = int(dur * SR); tt = np.arange(n) / SR
    f = freq * (1 + glide * np.exp(-tt * 25))
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * decay)
def noise_burst(dur, decay, smooth=1):
    n = int(dur * SR); x = rng.standard_normal(n)
    if smooth > 1: x = lowpass(x, smooth)
    return x * np.exp(-np.arange(n) / SR * decay)
def whoosh(dur=0.5, up=True):
    n = int(dur * SR); x = rng.standard_normal(n)
    a = lowpass(x, 40) * 4; b = lowpass(x, 6)
    mix = np.linspace(0, 1, n) if up else np.linspace(1, 0, n)
    shape = np.sin(np.linspace(0, np.pi, n)) ** 2
    return (a * (1 - mix) + b * mix) * shape * 0.5

def add(*xs):
    out = np.zeros(max(len(x) for x in xs))
    for x in xs: out[:len(x)] += x
    return out

pop = tone(900, 0.12, 30, glide=0.6) * 0.35
click = add(noise_burst(0.025, 250) * 0.4, tone(2400, 0.02, 300) * 0.25)
thunk = add(tone(140, 0.25, 18, glide=0.4) * 0.6, noise_burst(0.04, 120, 8) * 0.3)
chime = sum(tone(note(m), 1.4, 3.2) * g for m, g in [(84, .25), (88, .18), (91, .15), (96, .08)])
tick = tone(1500, 0.05, 90) * 0.3

# Review notes (rev 3): no whoosh ("marker") or chime ("cling") anywhere.
def crush(x, levels=10):  # bit-crush for a digital edge
    return np.round(x * levels) / levels
def digital_pop():
    n = int(0.07 * SR); tt = np.arange(n) / SR
    f = 520 + 1500 * (1 - np.exp(-tt * 60))
    return add(crush(np.sin(2 * np.pi * np.cumsum(f) / SR)) * np.exp(-tt * 55) * 0.42, tone(3200, 0.012, 400) * 0.15)
def digital_bubble(base):
    n = int(0.09 * SR); tt = np.arange(n) / SR
    f = base * (1 + 1.4 * (1 - np.exp(-tt * 45)))
    return crush(np.sin(2 * np.pi * np.cumsum(f) / SR), 14) * np.sin(np.linspace(0, np.pi, n)) ** 0.6 * np.exp(-tt * 18) * 0.26
def notify():
    a1 = tone(1318.5, 0.16, 26) * 0.22
    a2 = tone(1760.0, 0.26, 18) * 0.2
    out = np.zeros(len(a1) + int(0.075 * SR) + len(a2))
    out[:len(a1)] += a1; i = int(0.075 * SR); out[i:i + len(a2)] += a2
    return out
def handwriting(dur):
    n = int(dur * SR); out = np.zeros(n); tt = np.arange(n) / SR
    speed = 0.35 + 0.65 * np.abs(np.sin(tt / dur * np.pi * 5.5))  # stroke speed, loops of the signature
    pos = 0
    while pos < n:
        g = int(rng.uniform(0.006, 0.014) * SR); g = min(g, n - pos)
        grain = rng.standard_normal(g); grain = grain - lowpass(grain, 5)
        blip = np.sin(2 * np.pi * rng.uniform(2400, 4200) * np.arange(g) / SR) * 0.25
        out[pos:pos + g] += crush((grain * 0.5 + blip) * np.hanning(g), 8) * speed[pos]
        pos += g + int(rng.uniform(0.008, 0.03) * SR)
    edge = np.minimum(1, np.minimum(tt, dur - tt) / 0.05)
    return out * edge * 0.22

for i, fr in enumerate(T['s1']['cards']): place(sfx, pop, at('s1', fr), 0.9, [-0.2, 0.2, -0.1, 0.1][i])
for fr in T['sfx']['digitalPop']: place(sfx, digital_pop(), fr / FPS, 1.0)
for i in range(len("Still waiting on a signature?".split())):
    place(sfx, digital_bubble(420 + 70 * i), at('s1', T['s1']['headline'] + i * 4), 1.0, -0.25 + 0.1 * i)
for fr in T['s2']['land']: place(sfx, thunk, at('s2', fr), 0.8)
for key in ['pick1', 'drop1', 'pick2', 'drop2']: place(sfx, click, at('s3', T['s3'][key]), 0.9)
place(sfx, click, at('s3', T['s3']['send']), 1.1)
place(sfx, notify(), at('s3', T['s3']['toast']), 1.0, 0.15)
place(sfx, tick, at('s4', T['s4']['viewed']), 1.0)
sa, sb = T['s4']['sign']
place(sfx, handwriting((sb - sa) / FPS), at('s4', sa), 1.0, 0.25)
place(sfx, click, at('s4', T['s4']['finish']), 1.0)

# Glitch stutters: gated noise + bit-crushed square blips, re-rolled every 2 video frames like the picture.
def glitch_sfx(length_frames, amp):
    n = int(length_frames / FPS * SR); out = np.zeros(n); step = int(2 / FPS * SR)
    for s in range(0, n, step):
        seg = min(step, n - s); tt = np.arange(seg) / SR
        if rng.random() < 0.75:
            f0 = rng.choice([220, 330, 880, 1760, 2640]) * (1 + rng.random() * 0.1)
            sq = np.sign(np.sin(2 * np.pi * f0 * tt)) * 0.5
            nz = np.round(rng.standard_normal(seg) * 3) / 3 * 0.6
            out[s:s + seg] = (sq if rng.random() < 0.5 else nz) * (0.4 + 0.6 * rng.random())
    shape = np.sin(np.linspace(0, np.pi, n)) ** 0.5
    return out * shape * amp * 0.5
for h in T['fx']['glitch']:
    place(sfx, glitch_sfx(h['len'] + 2, h['amp']), (h['at'] - h['len'] / 2) / FPS, 1.0, float(rng.uniform(-0.3, 0.3)))

mix = mus * 0.9 + sfx
mix = np.tanh(mix / (np.abs(mix).max() + 1e-9) * 1.4) / np.tanh(1.4)
fade = np.ones(N); fade[-int(0.8 * SR):] = np.linspace(1, 0, int(0.8 * SR)); fade[:int(0.02 * SR)] = np.linspace(0, 1, int(0.02 * SR))
mix *= fade[:, None] * 0.89
with wave.open('public/soundtrack.wav', 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((mix * 32767).astype('<i2').tobytes())
print(f'wrote public/soundtrack.wav ({DUR:.1f} s)')
