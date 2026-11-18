"""Square version: premium sound design modelled on the reference edit, placed from out/cues.json.
Usage: python3 audio.py  ->  out/audio.wav (48 kHz stereo)

What the reference does (measured from its audio track) and how this mirrors it:
  - no music, lots of silence between sounds            -> only a handful of sounds, real gaps
  - each shape appearing = one deep 808-style sub hit   -> sub hit (~55-100 Hz, ~0.25 s ring) per shape
    (~100 Hz body, -20 dB after ~0.22 s)
  - dots splitting = bright chime in D major             -> F#6 / D7 / A7 bell chime as circles drop
    (1480 / 2350 / 3520 Hz)
  - assembly = low sub rumble building ~2 s              -> sub drone + soft air riser under the fast spin
  - reveal = big impact, then a 43 Hz sub ringing out    -> impact (sub + crash) on the brand name,
    with soft sub pulses                                    long F1 (43.65 Hz) tail, gentle D-major plucks per letter
Every sound is synthesized here with numpy, so there are no licensing questions."""
import json, wave
import numpy as np

C = json.load(open('out/cues.json')); Q = C['CUES']
SR = 48000; N = int((C['DUR'] + 0.3) * SR)
dry = np.zeros((N, 2)); send = np.zeros((N, 2))      # send -> reverb
rng = np.random.default_rng(11)
t_ = lambda dur: np.arange(int(dur * SR)) / SR

def place(x, at, gain=1.0, pan=0.0, verb=0.0):
    i = int(at * SR); n = min(len(x), N - i)
    if n <= 0: return
    g = np.array([np.sqrt((1 - pan) / 2), np.sqrt((1 + pan) / 2)]) * 1.414 * gain
    dry[i:i + n] += x[:n, None] * g
    send[i:i + n] += x[:n, None] * g * verb

def band(x, lo, hi):                                   # FFT band-pass
    F = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1 / SR)
    F[(f < lo) | (f > hi)] = 0; return np.fft.irfft(F, len(x))

def sub_hit(f_hi=150, f_lo=55, dur=0.9, decay=9.0, drive=2.2, click=0.25):
    """808-style hit: pitch drops f_hi -> f_lo, saturated so harmonics reach phone speakers."""
    t = t_(dur); f = f_lo + (f_hi - f_lo) * np.exp(-t * 32)
    body = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * decay) * np.minimum(1, t / 0.0015)
    body = np.tanh(body * drive) / np.tanh(drive)
    tr = band(rng.standard_normal(len(t)), 800, 5000) * np.exp(-t * 260) * click
    return body + tr

def bell(freq, dur=1.6, decay=3.2):
    """Glassy chime: fundamental + bell partials, soft attack."""
    t = t_(dur); a = np.minimum(1, t / 0.002)
    parts = [(1, 1, 1), (2.0, .35, 1.6), (2.76, .22, 2.4), (5.4, .08, 4.0)]
    return sum(g * np.sin(2 * np.pi * freq * r * t) * np.exp(-t * decay * d) for r, g, d in parts) * a

def pluck(freq, dur=0.9):
    t = t_(dur)
    x = sum(np.sin(2 * np.pi * freq * h * t) / h ** 1.5 * np.exp(-t * (7 + 5 * h)) for h in (1, 2, 3, 4))
    return x * np.minimum(1, t / 0.003)

def air(dur, f0, f1, curve=2.0):
    """Soft filtered-noise swell (riser/whoosh) with a rising or falling band."""
    n = int(dur * SR); x = rng.standard_normal(n); out = np.zeros(n); seg = 2048
    for s in range(0, n, seg // 2):                    # overlap-add band sweep
        p = s / n; fc = f0 * (f1 / f0) ** p
        w = np.hanning(min(seg, n - s)); chunk = x[s:s + len(w)] * w
        out[s:s + len(w)] += band(chunk, fc * .5, fc * 1.6)
    shape = (np.linspace(0, 1, n) ** curve)
    return out * shape / (np.abs(out).max() + 1e-9)

def note(name):
    names = {'C': -9, 'D': -7, 'E': -5, 'F': -4, 'F#': -3, 'G': -2, 'A': 0, 'B': 2}
    return 440 * 2 ** ((names[name[:-1]] + 12 * (int(name[-1]) - 4)) / 12)

# --- 1. square appears, drops, bounces right ---
place(air(0.65, 900, 3000, 1.6), Q['drop'] + .05, .05, 0, .3)          # barely-there air on the fall
place(sub_hit(170, 62, .6, 11, 2.0, .35), Q['land1'], .95, 0, .12)     # landing thump
place(sub_hit(170, 70, .5, 14, 1.8, .3), Q['land2'], .55, .25, .12)
place(sub_hit(170, 78, .4, 16, 1.6, .25), Q['land3'], .38, .45, .12)

# circles dropping out: bright D-major chime (F#6 / A6 / D7), like the reference split
for at, n_, pan in [(Q['land1'] + .02, 'F#6', -.35), (Q['land2'] + .02, 'A6', .1), (Q['land3'] + .1, 'D7', .5)]:
    place(bell(note(n_)), at, .16, pan, .55)

# --- 2. each shape forms: one deep sub hit (the reference's signature sound) ---
for i, f0 in enumerate(Q['form']):
    pan = [-.3, 0, .3][i]
    place(sub_hit(150, 55, .9, 8.5, 2.4, .3), f0 + .04, 1.0, pan * .4, .15)
    place(air(.35, 4000, 1200, .4)[::-1] * 0.6, f0 - .3, .05, pan, .2)  # tiny pre-swell into the hit

# --- 3. assembly: fast spin with a sub build, silence gap, then the big reveal ---
place(sub_hit(130, 50, .9, 6, 2.0, .2), Q['asm0'] + .02, .65, 0, .2)   # spin launch
impact = Q['word'] + .02
b0, b1 = Q['asm0'] + .35, impact - .06                                   # build, then ~60 ms of silence
tb = t_(b1 - b0); fb = 30 + 13.65 * (tb / tb[-1]) ** 1.5                 # drone glides up to F1 (43.65 Hz)
drone = np.sin(2 * np.pi * np.cumsum(fb) / SR) * (tb / tb[-1]) ** 2.2
drone = np.tanh(drone * 2.5) / np.tanh(2.5) * np.minimum(1, (tb[-1] - tb) / 0.02)
place(drone, b0, .26, 0, .05)
riser = air(b1 - b0, 250, 7000, 2.6) * np.minimum(1, (tb[-1] - tb) / 0.02)
place(riser, b0, .10, 0, .35)
place(air(.55, 3500, 600, .3)[::-1][::-1] * np.linspace(1, 0, int(.55 * SR)), Q['slide0'], .04, -.3, .3)  # light swoosh on the slide

# the reveal impact: deep sub with a long 43.65 Hz tail + a bright crash
place(sub_hit(160, 43.65, 3.4, 1.15, 2.8, .45), impact, 1.0, 0, .2)
crash = band(rng.standard_normal(int(2.2 * SR)), 2500, 14000) * np.exp(-t_(2.2) * 3.2)
place(crash, impact, .10, -.15, .9); place(band(rng.standard_normal(int(2.2 * SR)), 2500, 14000) * np.exp(-t_(2.2) * 3.2), impact, .10, .15, .9)
place(bell(note('D6'), 2.5, 1.6) + .6 * bell(note('A6'), 2.5, 1.8) + .4 * bell(note('F#6'), 2.5, 2.0), impact, .09, 0, .7)

# --- 4. brand name: soft sub pulses + an ascending D-major pluck as each letter locks in ---
scale = ['D5', 'F#5', 'A5', 'D6', 'E6', 'F#6', 'A6', 'B6', 'D7']
for i in range(9):
    at = Q['word'] + Q['wordStep'] * i + Q['wordDur']
    place(pluck(note(scale[i])), at, .085, -.4 + .8 * i / 8, .6)
for k, at in enumerate([Q['sub'] - .05, Q['sub'] + .45]):              # gentle sub pulses, like the reference tail
    place(sub_hit(120, 43.65, 1.2, 4, 1.8, .05), at, .35 - .1 * k, 0, .1)
end = Q['sub'] + Q['subStep'] * 22 + Q['subDur']
place(bell(note('D7'), 2.2, 2.2) + .5 * bell(note('A7'), 2.2, 2.6), end, .07, .2, .8)

# --- reverb: stereo decaying-noise impulse response, FFT convolution ---
irn = int(2.4 * SR); ti = np.arange(irn) / SR
ir = np.stack([band(rng.standard_normal(irn), 200, 9000) * np.exp(-ti * 2.6) for _ in range(2)], 1)
ir[:int(.012 * SR)] = 0                                                    # 12 ms pre-delay
M = 1 << int(np.ceil(np.log2(N + irn)))
wet = np.stack([np.fft.irfft(np.fft.rfft(send[:, c], M) * np.fft.rfft(ir[:, c], M), M)[:N] for c in range(2)], 1)
wet *= 0.9 / (np.abs(wet).max() + 1e-9) * (np.abs(send).max() + 1e-9) * 0.8

# --- master: high-pass rumble, gentle glue, peak-normalize ---
mix = dry + wet
mix = np.stack([band(mix[:, c], 28, 18000) for c in range(2)], 1)
mix = np.tanh(mix / np.abs(mix).max() * 1.6) / np.tanh(1.6)
mix *= 0.89 / np.abs(mix).max()
mix[-int(.05 * SR):] *= np.linspace(1, 0, int(.05 * SR))[:, None]
with wave.open('out/audio.wav', 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((mix[:int(C['DUR'] * SR)] * 32767).astype('<i2').tobytes())
print('wrote out/audio.wav')
