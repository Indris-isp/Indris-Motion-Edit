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
import json, math, os, subprocess, sys, wave
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(HERE, 'src/real_world__vice_city.mp4')
OUT = os.path.join(HERE, 'out/vice_city_premium_1080x1920.mp4')
FONTS = os.path.join(HERE, '../../video/fonts')
W, H, FPS = 1080, 1920, 24
SW, SH = 960, 720
SRC_FRAMES = 549                  # 22.875 s
LAST_VALID = 460                  # last non-black source frame (19.17 s); after it -> end card
CUT_F = (37, 63)                  # source frames dropped: the 1.1 s pause after "real world"
CUT = (CUT_F[0] / FPS, CUT_F[1] / FPS)
CX = 515                          # subject's horizontal centre in the source
GOLD = (243, 214, 160)
RED = (255, 84, 70)
INK = (20, 18, 16)


def src_to_out(t): return t if t < CUT[0] else t - (CUT[1] - CUT[0])


# ---------------------------------------------------------------- shot list
# (start, layout, [(t, zoom), ...], crop centre or None). Zoom keys are eased; hard cut at each start.
# 'framed' zoom is relative to the full 4:3 frame shown inside the Polaroid card.
SHOTS = [
    (0.00,  'full',   [(0.00, 1.34), (0.55, 1.14), (CUT[0], 1.17)], None),        # you enjoy the real world (settle-in open)
    (CUT[1], 'full',  [(CUT[1], 1.00), (5.21, 1.07)], None),                      # [jump cut] it's nice out here, feels good
    (5.21,  'framed', [(5.21, 1.00), (6.40, 1.05)], None),                        # DROP: beautiful scenes   (whole scene)
    (6.40,  'framed', [(6.40, 1.85), (7.27, 1.95)], (250, 195)),                  # fresh air       (tree + sky)
    (7.27,  'framed', [(7.27, 2.45), (8.79, 2.60)], (800, 150)),                  # birds chirping  (canopy)
    (8.79,  'full',   [(8.79, 1.28), (10.4, 1.36)], None),                        # makes you feel alive
    (10.58, 'full',   [(10.58, 1.02), (12.04, 1.18)], None),                      # too many people are inside f*cking
    (12.04, 'full',   [(12.04, 1.46), (12.3, 1.40), (13.17, 1.42)], None),        # GTA  (punch + shake + RGB split)
    (13.17, 'full',   [(13.17, 1.10), (14.62, 1.16)], None),                      # living a fake reality
    (14.62, 'full',   [(14.62, 1.24), (16.84, 1.32)], None),                      # instead of actually living their life
    (16.84, 'full',   [(16.84, 1.00), (18.67, 1.20), (SRC_FRAMES / FPS, 1.34)], None),  # ...put on this earth to live -> end card
]
FRAMED_IN = 5.21
HITS = [  # (source time, flash, rgb_split_px, shake_px)
    (CUT[1], 0.05, 0, 0), (5.21, 0.20, 0, 0), (8.79, 0.06, 0, 0), (12.04, 0.30, 18, 7), (13.63, 0.0, 9, 2), (19.23, 0.10, 0, 0),
]
COLD_IN, COLD_OUT = (10.5, 10.9), (14.65, 15.75)


def smooth(u): u = min(1, max(0, u)); return u * u * (3 - 2 * u)
def ease_out(u): u = min(1, max(0, u)); return 1 - (1 - u) ** 3


def shot_at(t):
    s = [x for x in SHOTS if x[0] <= t][-1]
    keys = s[2]
    if t <= keys[0][0]: return s[1], keys[0][1], s[3]
    for (t0, z0), (t1, z1) in zip(keys, keys[1:]):
        if t <= t1:
            u = (t - t0) / (t1 - t0)
            e = ease_out(u) if t0 == s[0] and z0 > z1 and t1 - t0 < 1 else smooth(u)
            return s[1], z0 + (z1 - z0) * e, s[3]
    return s[1], keys[-1][1], s[3]


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


# Polaroid card (design-system §5 "white Polaroid border for picture-in-frame")
CARD_W, CARD_H, BORDER, CARD_CY, TILT = 920, 690, 20, 850, -1.6
PW, PH = CARD_W + 2 * BORDER, CARD_H + 2 * BORDER
_pol_mask = Image.new('L', (PW, PH), 0); ImageDraw.Draw(_pol_mask).rounded_rectangle((0, 0, PW - 1, PH - 1), 10, fill=255)
_img_mask = Image.new('L', (CARD_W, CARD_H), 0); ImageDraw.Draw(_img_mask).rounded_rectangle((0, 0, CARD_W - 1, CARD_H - 1), 4, fill=255)
_shadow = Image.new('L', (W, H), 0)
_sr = _pol_mask.rotate(TILT, Image.BICUBIC, expand=True)
_shadow.paste(_sr, ((W - _sr.width) // 2 + 14, CARD_CY - _sr.height // 2 + 30), _sr)
_shadow = _shadow.filter(ImageFilter.GaussianBlur(34)).point(lambda v: int(v * 0.85))


def framed_layout(img, z, t, centre):
    bw = SH * 9 / 16 * 1.25
    bg = img.resize((108, 192), Image.BILINEAR, box=(CX - bw / 2, 0, CX + bw / 2, SH))
    bg = bg.filter(ImageFilter.GaussianBlur(5)).resize((W, H), Image.BILINEAR)
    bg = Image.fromarray((np.asarray(bg, np.float32) * 0.40).astype(np.uint8))
    bg.paste(Image.new('RGB', (W, H), 0), (0, 0), _shadow)
    ccx, ccy = centre or (CX - 35, SH / 2)
    cw, ch = SW / z, SH / z
    x0 = min(max(ccx - cw / 2, 0), SW - cw); y0 = min(max(ccy - ch / 2, 0), SH - ch)
    photo = img.resize((CARD_W, CARD_H), Image.LANCZOS, box=(x0, y0, x0 + cw, y0 + ch)).filter(
        ImageFilter.UnsharpMask(radius=1.6, percent=50, threshold=2))
    pol = Image.new('RGBA', (PW, PH), (0, 0, 0, 0))
    pol.paste(Image.new('RGBA', (PW, PH), (246, 242, 234, 255)), (0, 0), _pol_mask)
    pol.paste(photo, (BORDER, BORDER), _img_mask)
    u = (t - FRAMED_IN) / 0.42                            # entrance: drops in from 125 % and settles
    s = 1.25 - 0.25 * ease_out(u)
    pol = pol.rotate(TILT * (0.3 + 0.7 * ease_out(u)), Image.BICUBIC, expand=True)
    if s != 1: pol = pol.resize((int(pol.width * s), int(pol.height * s)), Image.BICUBIC)
    bg = bg.convert('RGBA'); bg.alpha_composite(pol, ((W - pol.width) // 2, CARD_CY - pol.height // 2))
    return bg.convert('RGB')


# ---------------------------------------------------------------- grade / film look
def curves(c, fade, r_hl, r_sh, g_sh, b_hl, b_sh):
    x = np.arange(256) / 255.0
    y = x - c * np.sin(2 * np.pi * x) / (2 * np.pi)          # S-curve contrast
    y = fade + y * (0.975 - fade)                             # lifted blacks, rolled-off whites
    hl, sh = x ** 2, (1 - x) ** 2
    return np.stack([y + r_hl * hl + r_sh * sh, y + g_sh * sh, y + b_hl * hl + b_sh * sh]).clip(0, 1).astype(np.float32)


WARM = (curves(0.30, 0.035, 0.040, -0.015, 0.008, -0.045, 0.040), 1.08)   # teal shadows, golden highlights
COLD = (curves(0.42, 0.050, -0.035, -0.030, 0.018, 0.030, 0.065), 0.50)   # crushed, desaturated, steel blue
LUMA = np.array([0.2126, 0.7152, 0.0722], np.float32)
yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
VIGNETTE = (1 - 0.42 * (((xx - W / 2) / (W * 0.62)) ** 2 + ((yy - H * 0.46) / (H * 0.62)) ** 2) ** 1.3).clip(0.35, 1)[..., None]
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


def grade(img, t, oi):
    k = coldness(t)
    lut = WARM[0] * (1 - k) + COLD[0] * k
    sat = WARM[1] * (1 - k) + COLD[1] * k
    a = np.asarray(img)
    f = np.stack([lut[0][a[..., 0]], lut[1][a[..., 1]], lut[2][a[..., 2]]], -1)
    Y = (f @ LUMA)[..., None]
    f = Y + (f - Y) * sat
    hi = np.clip((Y - 0.62) / 0.38, 0, 1) * f                           # halation from highlights
    glow = Image.fromarray((hi * 255).astype(np.uint8)).resize((W // 8, H // 8), Image.BILINEAR)
    glow = np.asarray(glow.filter(ImageFilter.GaussianBlur(6)).resize((W, H), Image.BILINEAR), np.float32) / 255
    f = f + glow * np.array([0.42, 0.28, 0.17], np.float32) * (1 - 0.5 * k)
    f = f * VIGNETTE + hit_env(t, 0, 0.07)
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
LEAD = 3 / FPS                                    # words pop 3 frames before they're spoken
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
    return dict(img=im, ox=pad, by=pad + asc, adv=adv, asc=asc)


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


def place(fr, spr, cx_word, base_y, s, alpha):
    img = spr['img']
    if abs(s - 1) > 1e-3: img = img.resize((max(1, int(img.width * s)), max(1, int(img.height * s))), Image.BICUBIC)
    if alpha < 1: img = img.copy(); img.putalpha(img.getchannel('A').point(lambda v: int(v * alpha)))
    pivot_y = spr['by'] - spr['asc'] * 0.35                     # scale around the glyphs' optical centre
    px = int(cx_word - (spr['ox'] + spr['adv'] / 2) * s)
    py = int(base_y - spr['asc'] * 0.35 - pivot_y * s)
    fr.alpha_composite(img, (px, py)) if px >= 0 and py >= 0 else fr.paste(img, (px, py), img)


def draw_captions(frame, t):
    fr = frame.convert('RGBA')
    for n, (a, b, words) in enumerate(CHUNK_LAYOUT):
        t_on = WORDS[a][0] - LEAD
        t_off = WORDS[b][1] + 0.3
        if n + 1 < len(CHUNKS): t_off = min(t_off, WORDS[CHUNKS[n + 1][0]][0] - LEAD)
        if not (t_on <= t < t_off): continue
        out_a = min(1, (t_off - t) / (2 / FPS))
        for w in words:
            ts = WORDS[w['i']][0] - LEAD
            if t < ts: continue
            cx = w['x'] + w['spr']['adv'] / 2
            if w['key']:      # keyword hit: 0 -> 112 -> 100 % over 9 frames, white -> accent + glow
                u = (t - ts) / (9 / FPS)
                s = 1.12 * ease_out(u / 0.6) if u < 0.6 else 1.12 - 0.12 * smooth((u - 0.6) / 0.4)
                c = smooth((t - ts) / 0.25)
                spr = w['spr'] if c >= 1 else dict(w['spr'], img=Image.blend(w['spr_white']['img'], w['spr']['img'], c))
                place(fr, spr, cx, w['y'], max(s, 0.02), min(1, u / 0.3) * out_a)
            else:             # word pop: 80 -> 100 %, fade in, small rise, 5 frames
                u = ease_out((t - ts) / (5 / FPS))
                place(fr, w['spr'], cx, w['y'] + 10 * (1 - u), 0.8 + 0.2 * u, u * out_a)
    return fr.convert('RGB')


# ---------------------------------------------------------------- end card + CTA
END_T1, END_T2, CTA_T, FADE_OUT = 19.23, 19.71, 20.31, (22.3, SRC_FRAMES / FPS)


def tracked(text, fnt, track, color):
    w = sum(fnt.getlength(c) for c in text) + track * (len(text) - 1)
    asc, desc = fnt.getmetrics(); im = Image.new('RGBA', (int(w) + 4, asc + desc + 4), 0); d = ImageDraw.Draw(im); x = 2
    for c in text: d.text((x, 2), c, font=fnt, fill=color); x += fnt.getlength(c) + track
    return im


def pill(text, fnt, fg, bg):
    asc, desc = fnt.getmetrics(); tw = fnt.getlength(text); ph = asc + desc + 36; pw = int(tw) + 76
    im = Image.new('RGBA', (pw + 40, ph + 40), (0, 0, 0, 0))
    sh = Image.new('L', im.size, 0); ImageDraw.Draw(sh).rounded_rectangle((20, 26, 20 + pw, 26 + ph), ph // 2, fill=150)
    s = Image.new('RGBA', im.size, (0, 0, 0, 0)); s.putalpha(sh.filter(ImageFilter.GaussianBlur(12))); im.alpha_composite(s)
    d = ImageDraw.Draw(im); d.rounded_rectangle((20, 20, 20 + pw, 20 + ph), ph // 2, fill=bg + (255,))
    d.text((20 + pw / 2, 20 + ph / 2), text, font=fnt, fill=fg + (255,), anchor='mm')
    return im


END_SMALL = tracked('ON THIS EARTH', font('Inter-600.ttf', 34), 14, (255, 255, 255, 215))
END_TITLE = sprite('to live.', font(KEY_FONT, 230), GOLD, glow=GOLD)['img']
CTA = pill('Comment “LIVE” if you agree', font('Inter-600.ttf', 40), INK, GOLD)


def end_card(frame, t):
    if t < LAST_VALID / FPS: return frame
    u = t - LAST_VALID / FPS
    blur = 14 * smooth(u / 0.7)
    f = frame.filter(ImageFilter.GaussianBlur(blur)) if blur > 0.3 else frame
    f = Image.fromarray((np.asarray(f, np.float32) * (1 - 0.45 * smooth(u / 0.7))).astype(np.uint8)).convert('RGBA')
    for tt, im, y, rise in ((END_T1, END_SMALL, 760, 14), (END_T2, END_TITLE, 790, 30)):
        if t < tt: continue
        e = ease_out((t - tt) / 0.6); a = min(1, (t - tt) / 0.35)
        im2 = im.copy(); im2.putalpha(im.getchannel('A').point(lambda v: int(v * a)))
        f.alpha_composite(im2, ((W - im.width) // 2, int(y + rise * (1 - e))))
    if t >= END_T2 + 0.2:   # thin gold rule under the title
        lw = int(220 * ease_out((t - END_T2 - 0.2) / 0.8))
        if lw > 2: ImageDraw.Draw(f).rectangle(((W - lw) // 2, 1135, (W + lw) // 2, 1137), fill=GOLD + (200,))
    if t >= CTA_T:          # comment-keyword CTA: pop with overshoot
        u = (t - CTA_T) / (9 / FPS)
        s = 1.08 * ease_out(u / 0.6) if u < 0.6 else 1.08 - 0.08 * smooth((u - 0.6) / 0.4)
        im = CTA.resize((max(1, int(CTA.width * s)), max(1, int(CTA.height * s))), Image.BICUBIC)
        f.alpha_composite(im, ((W - im.width) // 2, 1290 - im.height // 2))
    return f.convert('RGB')


def render_frame(src_img, fi, oi):
    t = fi / FPS
    layout, z, centre = shot_at(t)
    img = framed_layout(src_img, z, t, centre) if layout == 'framed' else full_layout(src_img, z, t)
    img = grade(img, t, oi)
    img = end_card(img, t)
    img = draw_captions(img, t)
    if t > FADE_OUT[0]:
        k = 1 - smooth((t - FADE_OUT[0]) / (FADE_OUT[1] - FADE_OUT[0]))
        img = Image.fromarray((np.asarray(img, np.float32) * k).astype(np.uint8))
    return img


# ---------------------------------------------------------------- audio
def build_audio(path):
    sr = 48000; dur = src_to_out(SRC_FRAMES / FPS); n = int((dur + 0.3) * sr); sfx = np.zeros(n); r = np.random.default_rng(3)

    def whoosh(at, length=0.55, gain=0.22):
        m = int(length * sr); x = r.standard_normal(m)
        env = np.sin(np.linspace(0, np.pi, m)) ** 2 * np.linspace(0.4, 1, m)
        fc = np.geomspace(300, 4000, m); y = np.zeros(m); acc = 0.0      # rising low-pass sweep
        for i in range(m):
            a = 1 - math.exp(-2 * math.pi * fc[i] / sr); acc += a * (x[i] - acc); y[i] = acc
        i0 = int((src_to_out(at) - length * 0.75) * sr); sfx[i0:i0 + m] += y / np.abs(y).max() * env * gain

    def impact(at, gain=0.55):
        m = int(0.9 * sr); tt = np.arange(m) / sr
        body = np.sin(2 * np.pi * np.cumsum(38 + 70 * np.exp(-tt / 0.06)) / sr) * np.exp(-tt / 0.28)
        click = r.standard_normal(m) * np.exp(-tt / 0.012) * 0.35
        i0 = int(src_to_out(at) * sr); sfx[i0:i0 + m] += (body + click) * gain

    whoosh(5.21); whoosh(12.04, 0.4, 0.16); whoosh(19.23, 0.7, 0.18); impact(12.04); impact(19.23, 0.3)
    sfx_path = path + '.sfx.wav'
    with wave.open(sfx_path, 'wb') as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(sr)
        w.writeframes((np.clip(sfx, -1, 1) * 32767).astype('<i2').tobytes())
    xf = 0.04   # jump cut: overlap both sides by xf/2 so the crossfade keeps A/V sync
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', SRC, '-i', sfx_path, '-filter_complex',
                    f'[0:a]aresample=48000,asplit[x][y];[x]atrim=0:{CUT[0] + xf / 2},asetpts=PTS-STARTPTS[a1];'
                    f'[y]atrim={CUT[1] - xf / 2},asetpts=PTS-STARTPTS[a2];[a1][a2]acrossfade=d={xf}:c1=tri:c2=tri,'
                    'highpass=f=28,equalizer=f=3200:t=q:w=1.2:g=2,'
                    'acompressor=threshold=-20dB:ratio=2.5:attack=8:release=120:makeup=2[v];'
                    '[1:a]pan=stereo|c0=c0|c1=c0[s];'
                    '[v][s]amix=inputs=2:normalize=0,loudnorm=I=-14:TP=-1.5:LRA=9,alimiter=limit=0.87:level=0,'
                    f'afade=t=out:st={src_to_out(FADE_OUT[0])}:d={FADE_OUT[1] - FADE_OUT[0]},atrim=0:{dur}',
                    '-ar', '48000', path], check=True)
    os.remove(sfx_path)


def frames():
    """Yields (source frame index, output frame index, caption-free source image)."""
    last, oi = None, 0
    for fi, a in enumerate(source_frames()):
        if fi <= LAST_VALID: last = Image.fromarray(remove_captions(a))
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
