"""Premium vertical re-edit of `src/real_world__vice_city.mp4` (960x720 talking head, 23 s),
following the house style in `.claude/skills/premium-short-form` (mode B, visual storytelling).

    python3 edit.py                    -> out/vice_city_premium_1080x1920.mp4
    python3 edit.py --still 5.6,12.1   -> out/still_*.png (output-time stills for a quick look)

All timing constants below are in SOURCE seconds (the times in words.json). The only edit to the
timeline is one jump cut (CUT_F) that removes the dead-air pause after "real world"; output frames
simply skip those source frames, and the audio is cut at the same point with a short crossfade.

Per frame: source frame (old burned-in captions inpainted away) -> 9:16 reframe from SHOTS
(punch-ins, or the Polaroid card that shows the scenery on the music drop) -> grade that blends
WARM -> COLD (GTA / fake reality) -> WARM, with halation, vignette, grain, flash / RGB-split / shake
hits -> end card over a blurred freeze in the black tail -> word-by-word captions (Inter Medium
run-in words + giant gold Instrument Serif keyword, red for swear/negative words).
"""
import json, math, os, subprocess, sys
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(HERE, 'src/real_world__vice_city.mp4')
OUT = os.path.join(HERE, 'out/vice_city_premium_1080x1920.mp4')
FONTS = os.path.join(HERE, '../../video/fonts')
W, H, FPS = 1080, 1920, 24
SW, SH = 960, 720
SRC_FRAMES = 549                  # 22.875 s
LAST_VALID = 460                  # last non-black source frame (19.17 s)
END_F = LAST_VALID + 1            # the edit ends here, right after 'to live' (the black music tail is dropped)
CUT_F = (37, 63)                  # source frames dropped: the 1.1 s pause after "real world"
CUT = (CUT_F[0] / FPS, CUT_F[1] / FPS)
CX = 515                          # subject's horizontal centre in the source
GOLD = (243, 214, 160)
RED = (255, 84, 70)


def src_to_out(t): return t if t < CUT[0] else t - (CUT[1] - CUT[0])


# ---------------------------------------------------------------- shot list
# (start, layout, [(t, zoom), ...], b-roll name or None). Zoom keys are eased; hard cut at each start.
# 'full' = the speaker reframed to 9:16; 'broll' = a full-screen stock clip from src/broll/ (constant push-in).
SHOTS = [
    (0.00,  'full',  [(0.00, 1.34), (0.55, 1.14), (CUT[0], 1.17)], None),       # you enjoy the real world (settle-in open)
    (CUT[1], 'full', [(CUT[1], 1.00), (4.17, 1.06)], None),                     # [jump cut] it's nice out here
    (4.17,  'broll', [(4.17, 1.00), (5.21, 1.05)], 'sunrays'),                  # feels good
    (5.21,  'broll', [(5.21, 1.00), (6.40, 1.06)], 'canyon'),                   # DROP: beautiful scenes
    (6.40,  'broll', [(6.40, 1.00), (7.27, 1.05)], 'breath'),                   # fresh air
    (7.27,  'broll', [(7.27, 1.00), (8.79, 1.07)], 'bird'),                     # birds chirping
    (8.79,  'full',  [(8.79, 1.28), (10.4, 1.36)], None),                       # makes you feel alive
    (10.58, 'broll', [(10.58, 1.00), (12.04, 1.08)], 'gamer'),                  # too many people are inside f*cking
    (12.04, 'full',  [(12.04, 1.46), (12.3, 1.40), (13.17, 1.42)], None),       # GTA  (punch + shake + RGB split)
    (13.17, 'broll', [(13.17, 1.00), (14.62, 1.07)], 'vr'),                     # living a fake reality
    (14.62, 'full',  [(14.62, 1.20), (16.0, 1.27)], None),                      # instead of actually living
    (16.0,  'broll', [(16.0, 1.00), (16.84, 1.05)], 'friends'),                 # their life
    (16.84, 'full',  [(16.84, 1.00), (17.52, 1.05)], None),                     # that they've been put on
    (17.52, 'broll', [(17.52, 1.00), (17.96, 1.04)], 'earth'),                  # this earth
    (17.96, 'full',  [(17.96, 1.16), (18.67, 1.22), (END_F / FPS, 1.26)], None),       # to live
]
HITS = [  # (source time, flash, rgb_split_px, shake_px)
    (CUT[1], 0.05, 0, 0), (5.21, 0.20, 0, 0), (8.79, 0.06, 0, 0), (12.04, 0.30, 18, 7), (13.63, 0.0, 9, 2),
]
BROLL_GAIN = {'sunrays': 0.72}   # per-clip exposure trim for stock that runs hot
A_ROLL_LIFT = 0.78     # gamma on the speaker footage only (the source is underexposed); stock is already bright
COLD_IN, COLD_OUT = (10.5, 10.9), (14.65, 15.75)


def smooth(u): u = min(1, max(0, u)); return u * u * (3 - 2 * u)
def ease_out(u): u = min(1, max(0, u)); return 1 - (1 - u) ** 3


def shot_at(t):
    s = [x for x in SHOTS if x[0] <= t][-1]
    keys = s[2]
    if t <= keys[0][0]: return s[1], keys[0][1], s[3], s[0]
    for (t0, z0), (t1, z1) in zip(keys, keys[1:]):
        if t <= t1:
            u = (t - t0) / (t1 - t0)
            e = ease_out(u) if t0 == s[0] and z0 > z1 and t1 - t0 < 1 else smooth(u)
            return s[1], z0 + (z1 - z0) * e, s[3], s[0]
    return s[1], keys[-1][1], s[3], s[0]


# ---------------------------------------------------------------- source + caption removal
def dilate(m, n):
    for _ in range(n):
        m2 = m.copy(); m2[1:] |= m[:-1]; m2[:-1] |= m[1:]; m2[:, 1:] |= m[:, :-1]; m2[:, :-1] |= m[:, 1:]; m = m2
    return m


def remove_captions(f):
    """Inpaint only the white caption glyphs (+ their shadow) by diffusion from surrounding pixels."""
    y0, y1, x0, x1 = 356, 400, 425, 575
    reg = f[y0:y1, x0:x1].astype(np.float32)
    m = (reg.mean(2) > 222) & (reg.max(2) - reg.min(2) < 40)
    if not m.any(): return f
    m = dilate(m, 4)
    out = reg.copy(); w = (~m).astype(np.float32)
    for _ in range(80):
        p = np.pad(out * w[..., None], ((1, 1), (1, 1), (0, 0)), mode='edge'); pw = np.pad(w, 1, mode='edge')
        s = p[:-2, 1:-1] + p[2:, 1:-1] + p[1:-1, :-2] + p[1:-1, 2:]
        c = pw[:-2, 1:-1] + pw[2:, 1:-1] + pw[1:-1, :-2] + pw[1:-1, 2:]
        upd = m & (c > 0)
        out = np.where(upd[..., None], s / np.maximum(c, 1e-6)[..., None], out)
        w = np.where(m, (c > 0).astype(np.float32), 1.0).astype(np.float32)
    f = f.copy(); f[y0:y1, x0:x1] = out.clip(0, 255).astype(np.uint8)
    return f


def source_frames():
    p = subprocess.Popen(['ffmpeg', '-v', 'error', '-i', SRC, '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'],
                         stdout=subprocess.PIPE)
    n = SW * SH * 3
    while True:
        b = p.stdout.read(n)
        if len(b) < n: break
        yield np.frombuffer(b, np.uint8).reshape(SH, SW, 3)


# ---------------------------------------------------------------- reframe / layouts
def hit_env(t, k, tau):
    out = 0.0
    for th, *vals in HITS:
        if 0 <= t - th < 6 * tau: out += vals[k] * math.exp(-(t - th) / tau)
    return out


def full_layout(img, z, t):
    cw, ch = SH * 9 / 16 / z, SH / z
    sh = hit_env(t, 2, 0.12)
    dx = sh * math.sin(t * 97.0); dy = sh * math.cos(t * 71.0)
    x0 = min(max(CX - cw / 2 + dx, 0), SW - cw)
    y0 = min(max((SH - ch) * 0.10 + dy, 0), SH - ch)
    return img.resize((W, H), Image.LANCZOS, box=(x0, y0, x0 + cw, y0 + ch)).filter(
        ImageFilter.UnsharpMask(radius=2.2, percent=55, threshold=2))


class BRoll:
    """Sequential reader for a 1080x1920 / 24 fps stock segment in src/broll/ (see CREDITS.md there)."""
    def __init__(self, name):
        self.p = subprocess.Popen(['ffmpeg', '-v', 'error', '-i', os.path.join(HERE, f'src/broll/{name}.mp4'),
                                   '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], stdout=subprocess.PIPE,
                                  stderr=subprocess.DEVNULL)
        self.k, self.img = -1, None

    def frame(self, k):
        while self.k < k:
            b = self.p.stdout.read(W * H * 3)
            if len(b) < W * H * 3: break               # clip shorter than the shot: hold its last frame
            self.img = Image.fromarray(np.frombuffer(b, np.uint8).reshape(H, W, 3)); self.k += 1
        return self.img


_broll = {}
def broll_layout(name, start, z, t):
    if name not in _broll: _broll[name] = BRoll(name)
    img = _broll[name].frame(int(round((t - start) * FPS)))
    cw, ch = W / z, H / z
    img = img.resize((W, H), Image.BICUBIC, box=((W - cw) / 2, (H - ch) / 2, (W + cw) / 2, (H + ch) / 2))
    g = BROLL_GAIN.get(name)
    return img if g is None else Image.fromarray((np.asarray(img, np.float32) * g).astype(np.uint8))


# ---------------------------------------------------------------- grade / film look
def curves(c, fade, r_hl, r_sh, g_sh, b_hl, b_sh):
    x = np.arange(256) / 255.0
    y = x - c * np.sin(2 * np.pi * x) / (2 * np.pi)          # S-curve contrast
    y = fade + y * (0.975 - fade)                             # lifted blacks, rolled-off whites
    hl, sh = x ** 2, (1 - x) ** 2
    return np.stack([y + r_hl * hl + r_sh * sh, y + g_sh * sh, y + b_hl * hl + b_sh * sh]).clip(0, 1).astype(np.float32)


WARM = (curves(0.30, 0.035, 0.040, -0.015, 0.008, -0.045, 0.040), 1.08)   # teal shadows, golden highlights
COLD = (curves(0.34, 0.045, -0.035, -0.030, 0.018, 0.030, 0.065), 0.50)   # crushed, desaturated, steel blue
LUMA = np.array([0.2126, 0.7152, 0.0722], np.float32)
yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
VIGNETTE = (1 - 0.26 * (((xx - W / 2) / (W * 0.62)) ** 2 + ((yy - H * 0.46) / (H * 0.62)) ** 2) ** 1.3).clip(0.55, 1)[..., None]
_y = np.linspace(0, 1, H, dtype=np.float32)[:, None, None]
SCRIM = 1 - 0.38 * np.clip((_y - 0.50) / 0.25, 0, 1) ** 1.5 * np.clip((0.98 - _y) / 0.12, 0.35, 1)   # caption legibility
rng = np.random.default_rng(7)
GRAIN = []
for _ in range(10):
    g = Image.fromarray(((rng.standard_normal((H // 2, W // 2)) * 0.5 + 0.5).clip(0, 1) * 255).astype(np.uint8))
    GRAIN.append((np.asarray(g.resize((W, H), Image.BILINEAR), np.float32) / 255 - 0.5)[..., None])
del yy, xx


def coldness(t):
    if t < COLD_IN[0] or t > COLD_OUT[1]: return 0.0
    if t < COLD_IN[1]: return smooth((t - COLD_IN[0]) / (COLD_IN[1] - COLD_IN[0]))
    if t < COLD_OUT[0]: return 1.0
    return 1 - smooth((t - COLD_OUT[0]) / (COLD_OUT[1] - COLD_OUT[0]))


LIFT = ((np.arange(256) / 255.0) ** A_ROLL_LIFT * 255).round().astype(np.uint8)


def grade(img, t, oi, lift):
    k = coldness(t)
    lut = WARM[0] * (1 - k) + COLD[0] * k
    sat = WARM[1] * (1 - k) + COLD[1] * k
    a = np.asarray(img)
    if lift: a = LIFT[a]
    f = np.stack([lut[0][a[..., 0]], lut[1][a[..., 1]], lut[2][a[..., 2]]], -1)
    Y = (f @ LUMA)[..., None]
    f = Y + (f - Y) * sat
    hi = np.clip((Y - 0.62) / 0.38, 0, 1) * f                           # halation from highlights
    glow = Image.fromarray((hi * 255).astype(np.uint8)).resize((W // 8, H // 8), Image.BILINEAR)
    glow = np.asarray(glow.filter(ImageFilter.GaussianBlur(6)).resize((W, H), Image.BILINEAR), np.float32) / 255
    f = f + glow * np.array([0.42, 0.28, 0.17], np.float32) * (1 - 0.5 * k)
    f = f * VIGNETTE * SCRIM + hit_env(t, 0, 0.07)
    lum = (f @ LUMA)[..., None]
    f = f + GRAIN[oi % len(GRAIN)] * (0.055 * (1.1 - lum) + 0.012)     # film grain, stronger in shadows
    o = (f.clip(0, 1) * 255).astype(np.uint8)
    ca = int(round(hit_env(t, 1, 0.09)))
    if ca:
        o = o.copy(); o[..., 0] = np.roll(o[..., 0], ca, 1); o[..., 2] = np.roll(o[..., 2], -ca, 1)
    return Image.fromarray(o)


# ---------------------------------------------------------------- captions
_fonts = {}
def font(name, size):
    if (name, size) not in _fonts: _fonts[name, size] = ImageFont.truetype(os.path.join(FONTS, name), size)
    return _fonts[name, size]


RUN_FONT, RUN_SIZE = 'Inter-500.ttf', 58          # run-in words: Inter Medium
SWEAR_FONT = 'Inter-700.ttf'
KEY_FONT, KEY_SIZE = 'InstrumentSerif-Italic.ttf', 150   # keyword: elegant serif (mode B)
LEAD = 3 / FPS                                    # words start revealing 3 frames before they're spoken
CAP_Y = 1400                                      # baseline of the bottom caption line (73 % height)
MAX_LINE = 960
WORDS = json.load(open(os.path.join(HERE, 'words.json')))
DISPLAY = {'fucking': 'f*cking', 'GTA': 'GTA'}
# (first word, last word, keyword indices, red indices): one keyword per beat, red = swear/negative
CHUNKS = [
    (0, 4, {3, 4}, set()),          # you enjoy the / REAL WORLD
    (5, 8, {7, 8}, set()),          # it's nice / OUT HERE
    (9, 10, {10}, set()),           # feels / GOOD
    (11, 12, {11}, set()),          # BEAUTIFUL / scenes
    (13, 14, {13, 14}, set()),      # FRESH AIR
    (15, 16, {15, 16}, set()),      # BIRDS CHIRPING
    (17, 20, {20}, set()),          # makes you feel / ALIVE
    (21, 24, {21, 22}, set()),      # TOO MANY / people are
    (25, 27, {27}, {26}),           # inside f*cking / GTA
    (28, 31, {30, 31}, {30, 31}),   # living a / FAKE REALITY
    (32, 35, {34, 35}, set()),      # instead of / ACTUALLY LIVING
    (36, 37, {37}, set()),          # their / LIFE
    (38, 44, {43, 44}, set()),      # that they've been put on / THIS EARTH
    (45, 46, {46}, set()),          # to / LIVE
]


def sprite(text, fnt, color, glow=None):
    asc, desc = fnt.getmetrics(); adv = fnt.getlength(text); pad = 40
    size = (int(adv) + 2 * pad, asc + desc + 2 * pad)
    m = Image.new('L', size, 0); ImageDraw.Draw(m).text((pad, pad + asc), text, font=fnt, anchor='ls', fill=255)
    im = Image.new('RGBA', size, (0, 0, 0, 0))
    sh = Image.new('RGBA', size, (0, 0, 0, 0)); sh.putalpha(m.filter(ImageFilter.GaussianBlur(10)).point(lambda v: int(v * 0.8)))
    im.alpha_composite(sh, (0, 6))
    if glow:
        g = Image.new('RGBA', size, glow + (0,)); g.putalpha(m.filter(ImageFilter.GaussianBlur(16)).point(lambda v: int(v * 0.55)))
        im.alpha_composite(g)
    fill = Image.new('RGBA', size, color + (0,)); fill.putalpha(m); im.alpha_composite(fill)
    return dict(img=im, ox=pad, by=pad + asc, adv=adv, asc=asc, font=fnt, color=color, glow=glow)


def layout_chunk(i0, i1, keys, reds):
    words = []
    for i in range(i0, i1 + 1):
        w = WORDS[i][2]; txt = DISPLAY.get(w, w.lower())
        words.append(dict(i=i, txt=txt, key=i in keys, red=i in reds))
    runs = []                                        # consecutive same-style words share a line
    for w in words:
        if runs and runs[-1][0]['key'] == w['key']: runs[-1].append(w)
        else: runs.append([w])
    lines = []
    for run in runs:
        if run[0]['key']:
            size = KEY_SIZE
            while font(KEY_FONT, size).getlength(' '.join(w['txt'] for w in run)) > MAX_LINE: size -= 6
            for w in run:
                acc = RED if w['red'] else GOLD
                w['spr'] = sprite(w['txt'], font(KEY_FONT, size), acc, glow=acc)
                w['spr_white'] = sprite(w['txt'], font(KEY_FONT, size), (255, 255, 255))
                w['space'] = font(KEY_FONT, size).getlength(' ') * 1.7
            lines.append((run, int(size * 0.92)))
        else:
            cur = []
            for w in run:
                f = font(SWEAR_FONT if w['red'] else RUN_FONT, RUN_SIZE)
                w['spr'] = sprite(w['txt'], f, RED if w['red'] else (255, 255, 255)); w['space'] = f.getlength(' ')
                width = sum(x['spr']['adv'] + x['space'] for x in cur) + w['spr']['adv']
                if cur and width > MAX_LINE: lines.append((cur, int(RUN_SIZE * 1.3))); cur = []
                cur.append(w)
            lines.append((cur, int(RUN_SIZE * 1.3)))
    y = CAP_Y
    for line, lh in reversed(lines):
        total = sum(w['spr']['adv'] for w in line) + sum(w['space'] for w in line[1:])
        x = (W - total) / 2
        for w in line:
            w['x'], w['y'] = x, y
            x += w['spr']['adv'] + w['space']
        y -= lh
    return words


CHUNK_LAYOUT = [(a, b, layout_chunk(a, b, k, r)) for a, b, k, r in CHUNKS]

# Caption animation, matched to the reference edit:
#  - every word rises in: it starts ~30 px low and blurred, then slides up, fades in and sharpens;
#  - three keywords (LETTER_WORDS) instead assemble letter by letter in random order;
#  - the whole caption block slowly grows 100 -> 103 % while on screen, then blurs, fades and grows out.
WORD_IN, WORD_BLUR = 6 / FPS, 12          # word reveal time, starting blur radius (px)
WORD_RISE = (30, 40)                      # rise-in distance (px): run-in words, keywords
LETTER_WORDS = {11, 20, 46}               # only these keywords assemble letter by letter: beautiful, alive, live
LETTER_IN, LETTER_BLUR, LETTER_SPREAD = 5 / FPS, 14, 0.40
BLOCK_GROW, EXIT_T, EXIT_BLUR, EXIT_GROW = 0.03, 4 / FPS, 9, 0.035
STRIP_Y0, STRIP_H = CAP_Y - 560, 720      # caption layer band (covers up to three lines)


def _letters(w):
    """Per-letter sprites (with the word's own colour/glow) and their random reveal offsets."""
    spr = w['spr']; fnt = spr['font']; txt = w['txt']; out = []
    idx = [j for j, c in enumerate(txt) if c != ' ']
    order = np.random.default_rng(w['i'] * 7919).permutation(len(idx))
    for k, j in enumerate(idx):
        ls = sprite(txt[j], fnt, spr['color'], glow=spr['glow'])
        delay = float(LETTER_SPREAD * order[k] / max(1, len(idx) - 1))
        out.append((ls, fnt.getlength(txt[:j]), delay))
    return out


for _a, _b, _words in CHUNK_LAYOUT:
    for _w in _words:
        if _w['i'] in LETTER_WORDS: _w['letters'] = _letters(_w)
    _top = min(w['y'] - w['spr']['asc'] for w in _words)
    _words[0]['block_cy'] = (_top + CAP_Y) / 2


def _put(strip, img, x, y, alpha, blur):
    if blur >= 0.5: img = img.filter(ImageFilter.GaussianBlur(float(blur)))
    if alpha < 0.999: img = img.copy(); img.putalpha(img.getchannel('A').point(lambda v: int(v * alpha)))
    strip.alpha_composite(img, (max(0, int(x)), int(y - STRIP_Y0)))


def draw_captions(frame, t):
    fr = frame.convert('RGBA')
    for n, (a, b, words) in enumerate(CHUNK_LAYOUT):
        t_on = WORDS[a][0] - LEAD
        t_off = WORDS[b][1] + 0.3
        if n + 1 < len(CHUNKS): t_off = min(t_off, WORDS[CHUNKS[n + 1][0]][0] - LEAD)
        if not (t_on <= t < t_off): continue
        strip = Image.new('RGBA', (W, STRIP_H), (0, 0, 0, 0))
        for w in words:
            ts = WORDS[w['i']][0] - LEAD
            if t < ts: continue
            spr = w['spr']; x0 = w['x'] - spr['ox']; y0 = w['y'] - spr['by']
            if 'letters' in w:
                for ls, dx, delay in w['letters']:
                    u = (t - ts - delay) / LETTER_IN
                    if u <= 0: continue
                    _put(strip, ls['img'], x0 + dx, y0, min(1, u * 1.5), LETTER_BLUR * (1 - ease_out(u)))
            else:
                u = (t - ts) / WORD_IN
                rise = WORD_RISE[1] if w['key'] else WORD_RISE[0]          # blur + fade + rise in
                _put(strip, spr['img'], x0, y0 + rise * (1 - ease_out(u)), min(1, u * 1.6), WORD_BLUR * (1 - ease_out(u)))
        life = smooth((t - t_on) / max(0.3, t_off - t_on))
        e = smooth((t - (t_off - EXIT_T)) / EXIT_T)                       # exit progress
        sc = 1 + BLOCK_GROW * life + EXIT_GROW * e
        if e > 0:
            strip = strip.filter(ImageFilter.GaussianBlur(EXIT_BLUR * e))
            strip.putalpha(strip.getchannel('A').point(lambda v: int(v * (1 - e))))
        cy = words[0]['block_cy'] - STRIP_Y0
        sw, sh = int(W * sc), int(STRIP_H * sc)
        strip = strip.resize((sw, sh), Image.BICUBIC)
        ox, oy = int((sw - W) / 2), int(cy * sc - cy)
        fr.alpha_composite(strip.crop((ox, oy, ox + W, oy + STRIP_H)), (0, STRIP_Y0))
    return fr.convert('RGB')


FADE_OUT = (END_F / FPS - 0.45, END_F / FPS)    # short fade to black after 'to live'


def render_frame(src_img, fi, oi):
    t = fi / FPS
    layout, z, clip, start = shot_at(t)
    img = broll_layout(clip, start, z, t) if layout == 'broll' else full_layout(src_img, z, t)
    img = grade(img, t, oi, lift=layout != 'broll')
    img = draw_captions(img, t)
    if t > FADE_OUT[0]:
        k = 1 - smooth((t - FADE_OUT[0]) / (FADE_OUT[1] - FADE_OUT[0]))
        img = Image.fromarray((np.asarray(img, np.float32) * k).astype(np.uint8))
    return img


# ---------------------------------------------------------------- audio
def build_audio(path):
    """The original voice + music only (no added SFX): jump-cut crossfade, light EQ/compression, -14 LUFS, end fade."""
    dur = src_to_out(END_F / FPS)
    xf = 0.04   # jump cut: overlap both sides by xf/2 so the crossfade keeps A/V sync
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', SRC, '-filter_complex',
                    f'[0:a]aresample=48000,asplit[x][y];[x]atrim=0:{CUT[0] + xf / 2},asetpts=PTS-STARTPTS[a1];'
                    f'[y]atrim={CUT[1] - xf / 2},asetpts=PTS-STARTPTS[a2];[a1][a2]acrossfade=d={xf}:c1=tri:c2=tri,'
                    'highpass=f=28,equalizer=f=3200:t=q:w=1.2:g=2,'
                    'acompressor=threshold=-20dB:ratio=2.5:attack=8:release=120:makeup=2,'
                    'loudnorm=I=-14:TP=-1.5:LRA=9,alimiter=limit=0.87:level=0,'
                    f'afade=t=out:st={src_to_out(FADE_OUT[0])}:d={FADE_OUT[1] - FADE_OUT[0]},atrim=0:{dur}',
                    '-ar', '48000', path], check=True)


def frames():
    """Yields (source frame index, output frame index, caption-free source image)."""
    last, oi = None, 0
    for fi, a in enumerate(source_frames()):
        if fi <= LAST_VALID: last = Image.fromarray(remove_captions(a))
        if fi >= END_F: break
        if CUT_F[0] <= fi < CUT_F[1]: continue
        yield fi, oi, last; oi += 1


def main():
    os.makedirs(os.path.join(HERE, 'out'), exist_ok=True)
    if '--still' in sys.argv:
        want = {int(round(float(x) * FPS)): x for x in sys.argv[sys.argv.index('--still') + 1].split(',')}
        for fi, oi, img in frames():
            if oi in want: render_frame(img, fi, oi).save(os.path.join(HERE, f'out/still_{float(want[oi]):05.2f}.png'))
        return
    audio = os.path.join(HERE, 'out/audio.wav'); build_audio(audio)
    enc = subprocess.Popen(['ffmpeg', '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{W}x{H}',
                            '-r', str(FPS), '-i', '-', '-i', audio, '-c:v', 'libx264', '-preset', 'slow', '-crf', '20',
                            '-tune', 'film', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '256k', '-shortest',
                            '-movflags', '+faststart', OUT], stdin=subprocess.PIPE)
    for fi, oi, img in frames():
        enc.stdin.write(render_frame(img, fi, oi).tobytes())
        if oi % 48 == 0: print(f'{oi / FPS:5.1f}s', flush=True)
    enc.stdin.close(); enc.wait()
    print('wrote', OUT)


if __name__ == '__main__':
    main()
