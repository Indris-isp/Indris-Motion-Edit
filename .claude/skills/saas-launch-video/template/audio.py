"""Soundtrack for the launch film, synthesized with numpy only.

Reads out/cues.json (written by `node render.cjs` or `node render.cjs --cues`) and writes:
  out/music.wav  the synthesized bed: tense intro -> break at the 'turn' shot -> full groove from
                 the reveal -> outro from the 'cta' shot, sidechained to the kick
  out/sfx.wav    every shot's sound cues (whooshes on cuts, pops, typing, clicks, risers, hits)
  out/audio.wav  music + sfx (build.sh swaps in assets/music.* instead of the synth bed if present)

SFX kinds: shutter click_s whoosh whoosh_s pop popsN tick ticksN typeN click stamp down boom shimmer riser
           hit hit_s swoop swell reel(N)   (N = count; spacing scales with the shot's speed)
"""
import json, os, wave
import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
CU = json.load(open(os.path.join(HERE, 'out', 'cues.json')))
SR, DUR, BEAT = 44100, CU['DUR'], 60 / CU['BPM']
BAR = 4 * BEAT
M = CU['markers']
T_TURN = M['turn'] if M['turn'] is not None else None
T_DROP = M['drop'] or 0.0
T_CTA = M['cta']
N = int(DUR * SR) + SR
rng = np.random.default_rng(7)

def t_(d): return np.arange(max(1, int(d * SR))) / SR
def midi(n): return 440 * 2 ** ((n - 69) / 12)
def add(buf, x, at, g=1.0):
    i = int(at * SR)
    if i >= len(buf) or i < 0: return
    n = min(len(x), len(buf) - i); buf[i:i + n] += x[:n] * g
def filt(x, lo=None, hi=None):
    X = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1 / SR); m = np.ones_like(f)
    if lo: m *= 1 / (1 + (lo / np.maximum(f, 1)) ** 4)
    if hi: m *= 1 / (1 + (f / hi) ** 4)
    return np.fft.irfft(X * m, len(x))
def sweep_noise(d, f0, f1, chunks=24):
    n = int(d * SR); x = rng.standard_normal(n + 1024); out = np.zeros(n); edges = np.linspace(0, n, chunks + 1).astype(int)
    for k in range(chunks):
        a, b = edges[k], edges[k + 1]; fc = f0 * (f1 / f0) ** (k / max(1, chunks - 1))
        seg = filt(x[a:b + 1024], fc * .5, fc * 2); out[a:b] = seg[512:512 + b - a]
    return out
def osc(freq, d):
    n = int(d * SR); f = np.full(n, freq) if np.ndim(freq) == 0 else freq[:n]
    return np.sin(2 * np.pi * np.cumsum(f) / SR)

# ---------------- instruments ----------------
def kick(big=1.0):
    t = t_(.45); f = 45 + 95 * np.exp(-t / .035)
    return osc(f, .45) * np.exp(-t / (.22 * big)) + .3 * rng.standard_normal(len(t)) * np.exp(-t / .004)
def clap():
    t = t_(.3); n = filt(rng.standard_normal(len(t)), 900, 5000); env = np.zeros(len(t))
    for d in (0, .011, .022): env += np.exp(-np.maximum(t - d, 0) / .012) * (t >= d)
    return n * (env * .6 + np.exp(-t / .12) * .5)
def hat(open_=False):
    t = t_(.2); return filt(rng.standard_normal(len(t)), 7000) * np.exp(-t / (.07 if open_ else .022))
def pad_note(n, d):
    t = t_(d); x = np.zeros(len(t))
    for det in (-.0012, .0012, 0):
        for h in range(1, 9): x += np.sin(2 * np.pi * midi(n) * (1 + det) * h * t + h) / h ** 1.4
    return x * np.minimum(1, t / .35) * np.minimum(1, (d - t) / .5) / 6
def pluck(n):
    t = t_(.5); f = midi(n)
    return (np.sin(2 * np.pi * f * t) + .35 * np.sin(4 * np.pi * f * t) + .12 * np.sin(6 * np.pi * f * t)) * np.exp(-t / .16) * np.minimum(1, t / .003)
def bass_note(n, d):
    t = t_(d); f = midi(n); x = np.sin(2 * np.pi * f * t) + .25 * np.sin(4 * np.pi * f * t)
    return x * np.minimum(1, t / .01) * np.exp(-t / .5) * np.minimum(1, (d - t) / .03)

# ---------------- music ----------------
drums, bass, pads, plk = (np.zeros(N) for _ in range(4)); kicks = []
CALM = CU.get('MUSIC') == 'calm'   # story films: soft pad + felt-piano bed, no drums (TIMELINE.MUSIC = 'calm')
def felt(n, v=1.0):                # soft piano-ish note: a few decaying partials, slow attack, lowpassed
    d = 2.6; t = t_(d); f = midi(n)
    x = sum(a * np.sin(2 * np.pi * f * k * t) * np.exp(-t / (1.1 / k)) for k, a in ((1, 1), (2, .35), (3, .12), (4, .05)))
    return filt(x * np.minimum(1, t / .012), None, 2200) * v
if CALM:
    PROG = [[53, 57, 60, 64], [52, 55, 59, 64], [50, 53, 57, 60, 64], [46, 50, 53, 57]]   # Fmaj7  Cmaj7/E  Dm9  Bbmaj7
    ROOT = [41, 40, 38, 34]; seg = 2 * BAR; nseg = int(np.ceil(DUR / seg)); end = DUR - 4.0
    for b in range(nseg):
        t0 = b * seg; ch = PROG[b % 4] if t0 < end else [53, 57, 60, 64, 69]
        add(pads, filt(sum(pad_note(n, seg + .6) for n in ch), None, 1500), t0, .7)
        add(bass, bass_note(ROOT[b % 4] if t0 < end else 41, seg - .05), t0, .35)
        for e, n in enumerate([ch[0] + 12, ch[2] + 12, ch[1] + 24, ch[3] + 12, ch[2] + 24, ch[1] + 12]):   # sparse arpeggio
            te = t0 + e * (seg / 6) + (rng.random() - .5) * .03
            if te < DUR - 1.2: add(plk, felt(n, .55 + .25 * rng.random()), te, 1)
    music = bass * .22 + pads * .30 + plk * .20
    tonal_wet = pads * .30 + plk * .26

if not CALM:
    A_CH = [[57, 60, 64], [53, 57, 60]]                                    # Am  F   (problem: tense)
    C_CH = [[53, 57, 60, 64], [55, 59, 62, 67], [57, 60, 64, 67], [48, 55, 60, 64]]  # Fmaj7 G Am7 C (solution: lift)
    C_RT = [41, 43, 45, 36]
    if T_TURN is not None:                                                  # A: intro until the turn
        for b in range(int(np.ceil(T_TURN / BAR))):
            add(pads, filt(sum(pad_note(n, BAR + .2) for n in A_CH[b % 2]), None, 900), b * BAR, .9)
            add(bass, bass_note(33 if b % 2 == 0 else 29, BAR - .1), b * BAR, .8)
        for k in range(int(T_TURN / BEAT) + 1):
            tt = k * BEAT
            if k % 2 == 0: add(drums, kick(.8), tt, .75); kicks.append(tt)
            add(drums, hat(), tt + BEAT / 2, .10); add(drums, hat(), tt, .05)
        add(pads, filt(sum(pad_note(n, T_DROP - T_TURN + .2) for n in [69, 72, 76]), 300, 3000), T_TURN - .05, .45)  # B: break
    b = 0                                                                    # C: groove from the reveal to the CTA
    while T_DROP + b * BAR < T_CTA - .05:
        t0 = T_DROP + b * BAR; ch = C_CH[b % 4]
        add(pads, filt(sum(pad_note(n, min(BAR, T_CTA - t0) + .15) for n in ch), None, 2600), t0, .8)
        for e in range(8):
            te = t0 + e * BEAT / 2
            if te >= T_CTA - .05: break
            add(bass, bass_note(C_RT[b % 4] + (12 if e % 4 == 3 else 0), BEAT / 2 * .9), te, .9)
            add(plk, pluck(ch[(e * 3) % len(ch)] + 12 + (12 if e in (3, 6) else 0)), te, .55)
        for q in range(4):
            tt = t0 + q * BEAT
            if tt >= T_CTA - .05: break
            add(drums, kick(), tt, 1.0); kicks.append(tt)
            if q % 2 == 1: add(drums, clap(), tt, .45)
            for s in range(4): add(drums, hat(open_=(s == 2)), tt + s * BEAT / 4, .16 if s == 2 else .07)
        b += 1
    add(pads, filt(sum(pad_note(n, DUR - T_CTA + .5) for n in [48, 55, 60, 64, 71]), None, 2400), T_CTA, .9)  # D: outro
    add(bass, bass_note(36, DUR - T_CTA + .3), T_CTA, .9)
    for e, n in enumerate([76, 72, 79, 76, 84, 79]): add(plk, pluck(n), T_CTA + e * BEAT / 2, .45 * (1 - e / 8))
    kicks.append(T_CTA)
tt = np.arange(N) / SR; duck = np.ones(N)
for k in kicks:
    i = int(k * SR); seg = tt[i:i + SR // 2] - k; duck[i:i + len(seg)] = np.minimum(duck[i:i + len(seg)], 1 - .55 * np.exp(-seg / .11))
if not CALM:
    music = drums * .55 + (bass * .32 + pads * .24 + plk * .13) * duck
    tonal_wet = pads * .24 * duck + plk * .13

# ---------------- SFX ----------------
sfx = np.zeros(N)
def whoosh(d=.4):
    x = sweep_noise(d, 300, 3500); t = t_(d)[:len(x)]; return x * np.sin(np.pi * (t / d) ** .7) ** 2
def pop(f=650):
    t = t_(.12); return osc(f * (1 + .6 * (1 - np.exp(-t / .02))), .12) * np.exp(-t / .045) * np.minimum(1, t / .002)
def tick(): t = t_(.03); return filt(rng.standard_normal(len(t)), 2500, 9000) * np.exp(-t / .006)
def key(): t = t_(.04); return filt(rng.standard_normal(len(t)), 1800, 6500) * np.exp(-t / .008)
def click():
    t = t_(.08); return filt(rng.standard_normal(len(t)), 1500, 7000) * np.exp(-t / .007) + .6 * np.sin(2 * np.pi * 160 * t) * np.exp(-t / .03)
def boom():
    t = t_(2.0); return np.sin(2 * np.pi * (38 + 40 * np.exp(-t / .08)) * t) * np.exp(-t / .7) + .25 * filt(rng.standard_normal(len(t)), None, 400) * np.exp(-t / .5)
def riser(d):
    d = max(.3, d); x = sweep_noise(d, 250, 7000, 40); t = t_(d)[:len(x)]
    return (x * .8 + osc(200 * (6 ** (t / d)), d)[:len(x)] * .18) * (t / d) ** 2.2
def hit(big=1.0):
    t = t_(2.2); crash = filt(rng.standard_normal(len(t)), 3000) * np.exp(-t / (.9 * big))
    k = np.zeros(len(t)); kk = kick(1.6); k[:len(kk)] = kk
    return k * 1.2 + crash * .5 + np.sin(2 * np.pi * 45 * t) * np.exp(-t / .6) * .8
def shimmer():
    t = t_(1.8); x = sum(np.sin(2 * np.pi * f * t + p) * (.6 + .4 * np.sin(2 * np.pi * r * t)) for f, p, r in [(2093, 0, 5), (2637, 1, 7), (3136, 2, 6), (4186, 3, 9)])
    return x * np.sin(np.pi * t / 1.8) ** 2 / 4
def down():
    t = t_(1.0); return osc(700 * (0.11 ** t), 1.0) * np.sin(np.pi * t) * .5 + sweep_noise(1.0, 3000, 200)[:len(t)] * np.sin(np.pi * t) * .5
def stamp():
    t = t_(.3); return np.sin(2 * np.pi * (70 + 80 * np.exp(-t / .02)) * t) * np.exp(-t / .1) + filt(rng.standard_normal(len(t)), 800, 5000) * np.exp(-t / .03) * .6
def shutter():                     # camera shutter: two mechanical clicks ~70 ms apart + a short air burst
    t = t_(.16); a = filt(rng.standard_normal(len(t)), 1500, 9000) * np.exp(-t / .006)
    t2 = t_(.2); b = filt(rng.standard_normal(len(t2)), 900, 6000) * np.exp(-t2 / .012) * .8
    air = filt(rng.standard_normal(len(t_(.12))), 2000, 7000) * np.exp(-t_(.12) / .03) * .15
    out = np.zeros(int(.3 * SR)); out[:len(a)] += a; out[int(.07 * SR):int(.07 * SR) + len(b)] += b; out[:len(air)] += air
    return out
def swoop():
    t = t_(.35); return osc(300 * 4 ** (t / .35), .35) * np.sin(np.pi * t / .35) * .6
def swell():
    t = t_(.7); return sweep_noise(.7, 600, 4000)[:len(t)] * (t / .7) ** 2 * np.exp(-np.maximum(t - .6, 0) / .03)

hits = sorted(a for a, kd, _ in CU['sfx'] if kd == 'hit') + [DUR]
for at, kind, k in CU['sfx']:
    base = ''.join(c for c in kind if not c.isdigit()); cnt = int(''.join(c for c in kind if c.isdigit()) or 8)
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
    elif kind == 'riser': add(sfx, riser(min(h for h in hits if h > at) - at), at, .45)   # always lands on the next hit
    elif kind == 'hit': add(sfx, hit(), at, .8)
    elif kind == 'hit_s': add(sfx, hit(.4), at, .35)
    elif kind == 'swoop': add(sfx, swoop(), at, .3)
    elif kind == 'shutter': add(sfx, shutter(), at, .5)
    elif kind == 'click_s': add(sfx, click(), at, .22)
    elif kind == 'swell': add(sfx, swell(), at, .3)
    elif base == 'reel':  # ticks where an eased reel (pos = n * expoOut) crosses each number
        for j in range(1, cnt + 1): add(sfx, tick(), at + 1.2 * (-np.log2(1 - j / (cnt + 1e-4)) / 10) / k, .45)
    else: print('unknown sfx kind:', kind)

# ---------------- reverb + master ----------------
def reverb(x, seed):
    r = np.random.default_rng(seed); it = t_(1.8); ir = filt(r.standard_normal(len(it)), 200, 6000) * np.exp(-it / .42)
    n = 1 << int(np.ceil(np.log2(len(x) + len(ir))))
    y = np.fft.irfft(np.fft.rfft(x, n) * np.fft.rfft(ir, n), n)[:len(x)]
    return y / (np.abs(y).max() + 1e-9) * (np.abs(x).max() + 1e-9)
def master(st):
    st = st[:int(DUR * SR)].copy(); fl = int(.8 * SR)
    st[-fl:] *= (np.linspace(1, 0, fl) ** 1.5)[:, None]
    return np.tanh(st / (np.abs(st).max() + 1e-9) * 1.6) / np.tanh(1.6) * .9
def write(name, st):
    with wave.open(os.path.join(HERE, 'out', name), 'wb') as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((st * 32767).astype('<i2').tobytes())
wl, wr = reverb(tonal_wet + sfx * .6, 1), reverb(tonal_wet + sfx * .6, 2)
write('audio.wav', master(np.stack([music + sfx + .22 * wl, music + sfx + .22 * wr], 1)))
write('music.wav', master(np.stack([music + .22 * reverb(tonal_wet, 1), music + .22 * reverb(tonal_wet, 2)], 1)))
write('sfx.wav', master(np.stack([sfx + .2 * reverb(sfx, 3), sfx + .2 * reverb(sfx, 4)], 1)) * .8)
print(f'wrote out/audio.wav, music.wav, sfx.wav ({DUR:.2f} s, {len(CU["sfx"])} cues)')
