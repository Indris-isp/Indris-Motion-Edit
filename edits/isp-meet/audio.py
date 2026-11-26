"""Synthesizes the soundtrack: an upbeat 120 BPM music bed plus light SFX that hit the scene cuts.
Everything is generated here (no samples, no licensing).  python3 audio.py  ->  out/audio.wav (48 kHz stereo)
Needs numpy + scipy.  Set SFX = False for music only.  Swap in your own track by replacing out/audio.wav.
"""
import wave
import numpy as np
from scipy.signal import butter, sosfilt

SFX = True
SR, BPM, DUR = 48000, 120, 19.0
BEAT = 60 / BPM
CUTS = [2.5, 5.0, 8.0, 10.0, 13.0, 15.5]          # must match SC in motion.js
N = int(DUR * SR)
L = np.zeros(N); R = np.zeros(N)
rng = np.random.default_rng(7)

def put(x, t, gain=1.0, pan=0.0):
    i = int(t * SR)
    if i >= N: return
    x = x[: N - i] * gain
    L[i:i + len(x)] += x * np.sqrt((1 - pan) / 2) * 1.414
    R[i:i + len(x)] += x * np.sqrt((1 + pan) / 2) * 1.414

def filt(x, kind, f):
    return sosfilt(butter(2, f, kind, fs=SR, output='sos'), x)

def env(n, a, d):
    t = np.arange(n) / SR
    return np.minimum(1, t / max(a, 1e-4)) * np.exp(-t / d)

hz = lambda m: 440 * 2 ** ((m - 69) / 12)

def kick():
    n = int(.45 * SR); t = np.arange(n) / SR
    f = 45 + 95 * np.exp(-t / .045)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * env(n, .002, .16) + .15 * filt(rng.standard_normal(n), 'highpass', 3000) * env(n, .001, .006)

def clap():
    n = int(.3 * SR); x = filt(rng.standard_normal(n), 'bandpass', [900, 2500]) if False else filt(filt(rng.standard_normal(n), 'highpass', 900), 'lowpass', 3500)
    e = env(n, .001, .09)
    for k in (0.0, .011, .022): e += .6 * env(n, .001, .008) * (np.arange(n) >= k * SR)
    return x * e * .5

def hat(open_=False):
    n = int((.18 if open_ else .05) * SR)
    return filt(rng.standard_normal(n), 'highpass', 7000) * env(n, .001, .06 if open_ else .015)

def saw(f, n, det=0.0):
    t = np.arange(n) / SR; y = np.zeros(n)
    for k in range(1, 14):
        if f * k > 9000: break
        y += np.sin(2 * np.pi * f * (1 + det) * k * t) / k
    return y

def pluck(f, dur=.35):
    n = int(dur * SR); t = np.arange(n) / SR
    y = np.sin(2 * np.pi * f * t) + .45 * np.sin(4 * np.pi * f * t) + .18 * np.sin(6 * np.pi * f * t)
    return y * env(n, .003, .12)

# chord progression, one chord per bar (4 beats): C  G  Am  F
CHORDS = [[48, 55, 60, 64, 67], [43, 55, 59, 62, 67], [45, 57, 60, 64, 69], [41, 57, 60, 65, 69]]
bar_len = 4 * BEAT
nbars = int(np.ceil(DUR / bar_len))
BREAK = (7.5, 8.0)   # tiny drop right before "Let's make your video better"

for b in range(nbars):
    ch = CHORDS[b % 4]; t0 = b * bar_len
    n = int(bar_len * SR)
    # pad: detuned saws, lowpassed, slow swell
    pad = sum(saw(hz(m), n, d) for m in ch[1:] for d in (-.004, .004))
    pad = filt(pad, 'lowpass', 1400) * np.minimum(1, np.arange(n) / (.25 * SR)) * np.minimum(1, (n - np.arange(n)) / (.05 * SR))
    put(pad, t0, .035 * (.5 if b == 0 else 1), -.2); put(pad, t0 + .012, .03 * (.5 if b == 0 else 1), .3)
    for s in range(8):                                   # 8th-note bass + arpeggio
        ts = t0 + s * BEAT / 2
        if ts >= DUR or (BREAK[0] <= ts < BREAK[1]): continue
        if ts >= 1.0:
            bn = int(BEAT / 2 * SR) - 200
            bass = filt(saw(hz(ch[0] - 12 + (12 if s % 2 else 0)), bn), 'lowpass', 520) * env(bn, .004, .14)
            put(bass, ts, .22)
        arp = [ch[1], ch[2], ch[3], ch[4], ch[3], ch[2], ch[4] + 12 - 12, ch[2] + 12]
        put(pluck(hz(arp[s] + 12)), ts, .09, -.35 if s % 2 else .35)

for k in range(int(DUR / BEAT)):                          # drums
    t = k * BEAT
    if t < 1.0 or BREAK[0] <= t < BREAK[1] or t > DUR - .5: continue
    put(kick(), t, .75)
    if k % 2 == 1: put(clap(), t, .55, .05)
    put(hat(k % 4 == 3), t + BEAT / 2, .16, .25)
    put(hat(), t + BEAT / 4, .07, -.25); put(hat(), t + 3 * BEAT / 4, .07, -.25)
put(kick(), DUR - .5, .8); put(clap(), DUR - .5, .4)          # final hit

if SFX:
    def whoosh(d=.45):
        n = int(d * SR); x = rng.standard_normal(n); out = np.zeros(n); seg = 512
        for i in range(0, n, seg):                       # rising band-pass sweep
            p = i / n; f = 400 + 5000 * p ** 2
            out[i:i + seg] = filt(x[i:i + seg], 'bandpass', [f * .7, min(f * 1.4, 20000)])[: len(out[i:i + seg])]
        e = (np.arange(n) / n) ** 2.2; e[-int(.03 * SR):] *= np.linspace(1, 0, int(.03 * SR))
        return out * e
    def pop(f=900):
        n = int(.12 * SR); t = np.arange(n) / SR
        return np.sin(2 * np.pi * (f + 600 * np.exp(-t / .02)) * t) * env(n, .001, .035)
    def ding():
        n = int(1.6 * SR); t = np.arange(n) / SR
        return sum(a * np.sin(2 * np.pi * hz(m) * t) for m, a in ((84, 1), (91, .5), (96, .3))) * env(n, .002, .45)
    def riser(d):
        n = int(d * SR); t = np.arange(n) / SR
        return filt(rng.standard_normal(n), 'highpass', 2000) * (t / d) ** 3 * .6 + np.sin(2 * np.pi * np.cumsum(200 + 900 * (t / d) ** 2) / SR) * (t / d) ** 3 * .25
    for c in CUTS: put(whoosh(), c - .42, .32, .1)
    for i in range(6): put(pop(800 + 60 * i), 2.5 + .2 + i * .1 + .05, .12, (-.3, .3)[i % 2])     # brand cards
    for i in range(4): put(pop(1000 + 80 * i), 5.0 + .3 + i * .09 + .05, .1, (-.4, .4)[i % 2])   # orbit chips
    for i in range(4): put(pop(700 + 120 * i), 10.0 + .05 + (i % 2) * .12 + (1.59 if i > 1 else 0), .12)  # platform tiles
    put(riser(1.0), 7.0, .22)
    put(ding(), 15.5 + 1.9, .2)

mix = np.stack([L, R], 1)
mix[-int(.35 * SR):] *= np.linspace(1, 0, int(.35 * SR))[:, None]
mix = np.tanh(mix / (np.abs(mix).max() + 1e-9) * 1.6) / np.tanh(1.6)
mix *= 0.89 / np.abs(mix).max()
with wave.open('out/audio.wav', 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((mix * 32767).astype('<i2').tobytes())
print(f'wrote out/audio.wav ({DUR:.1f}s, SFX={"on" if SFX else "off"})')
