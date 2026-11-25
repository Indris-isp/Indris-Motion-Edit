"""Premium vertical clip: "Acting is like gambling" (How They Started podcast, guest answer at 25:15-26:21).

House style: `.claude/skills/premium-short-form` (mode B, visual storytelling), same look as edits/vice-city.

    python3 edit.py                     -> out/gambling_premium_1080x1920.mp4
    python3 edit.py --still 3.0,20.5    -> out/still_*.png (output-time stills for a quick look)

Source: `src/excerpt_1515-1582.mp4` is a frame-exact excerpt of the 58-min multi-cam episode
(1280x720, 23.976 fps; excerpt frame k = source time EX_V0 + k / FPS). All timing constants below are in
SOURCE seconds (the full-episode timeline), so they can be checked against the full transcript.

Edit: SEGMENTS are the kept audio/video ranges (host interjections, dead pauses and "because you're right"
removed). Each output frame maps to one source time; the picture comes from SHOTS (one per beat), which
reframe the episode's own camera angles to 9:16:
  HOST        interviewer, brick wall
  G_FRONT     guest, straight-on medium shot
  G_FRONT_CU  guest, straight-on close-up
  G_SIDE      guest, blue-lit 3/4 side angle
  SPLIT       the episode's side-by-side two-shot, restacked as guest-over-host panels
plus 'card' (a crop of the episode or of a B-roll clip in a rounded card over a blurred fill: the host under
the title, the full "YEAH!" gesture) and stock B-roll (Mixkit, see src/broll/CREDITS.md), full-bleed or as a card.
"""
import json, math, os, subprocess, sys
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter

HERE = os.path.dirname(os.path.abspath(__file__))
SRC_V = os.path.join(HERE, 'src/excerpt_1515-1582.mp4')
SRC_A = os.path.join(HERE, 'src/excerpt_audio.flac')
EX_A0 = 1515.0                      # source time of the first audio sample in the excerpt
EX_V0 = 36324 * 1001 / 24000        # source time of excerpt frame 0 (1515.0152)
OUT = os.path.join(HERE, 'out/gambling_premium_1080x1920.mp4')
FONTS = os.path.join(HERE, '../../video/fonts')
W, H = 1080, 1920
FPS_N, FPS_D = 24000, 1001
FPS = FPS_N / FPS_D
SW, SH = 1280, 720
GOLD = (243, 214, 160)
RED = (255, 84, 70)

# ---------------------------------------------------------------- the cut (source seconds)
SEGMENTS = [
    (1519.62, 1528.40),   # HOST: there's a lot of no's in between the yeses, what's that experience been like over the years?
                          # GUEST: I want to relate it to gambling.      [host "Okay." removed]
    (1529.64, 1551.50),   # That constant search for that feeling of high ... constantly chasing that high.  [host "Mm-hmm. So," removed]
    (1553.06, 1558.80),   # and it's frustrating, it really is, and you have to be somebody who is consistent,
    (1559.76, 1560.60),   # determined,          (pauses tightened)
    (1561.00, 1561.80),   # persistent,
    (1562.36, 1564.98),   # because this is an industry that is
    (1565.42, 1566.72),   # full of rejection.   [host "Oh yeah." removed]
    (1567.36, 1572.28),   # And if you don't have thick skin, if you can't take it, this is not the industry for you
    (1574.03, 1580.76),   # [cut "because you're right that"] you're gonna get 99% no's and then that 1% one is like the rush that everybody's searching for.
]
_o = 0.0
SEG_OUT = []
for a, b in SEGMENTS:
    SEG_OUT.append((_o, a, b)); _o += b - a
DUR = _o
N_FRAMES = int(round(DUR * FPS))


def out_to_src(t):
    for o, a, b in reversed(SEG_OUT):
        if t >= o: return a + (t - o)
    return SEGMENTS[0][0]


def src_to_out(ts):
    for o, a, b in SEG_OUT:
        if ts <= b + 1e-6: return o + max(0.0, ts - a)
    return DUR


# ---------------------------------------------------------------- camera angles (source pixel space)
# cx: subject centre x; fy: face centre y (used to keep the face high in punch-ins)
ANGLES = {
    'HOST':       dict(cx=612, fy=200),
    'G_FRONT':    dict(cx=655, fy=110),
    'G_FRONT_CU': dict(cx=642, fy=190),
    'G_SIDE':     dict(cx=652, fy=150),
}
# Shot list, source seconds: (start, layout, param, [(t, zoom), ...]).  Hard cut at every start.
#   full  -> 9:16 reframe of the angle 'param' (zoom 1 = full source height)
#   stack -> the SPLIT two-shot restacked guest-over-host
#   card  -> param dict: a (cw x ch) crop around (cx, cy) of the episode (or of B-roll clip 'src') shown in a
#            rounded card of 'size' centred at y = cy_out, over a blurred fill; pops in at 'pop' (default: shot start)
#   bfull -> full-bleed 9:16 B-roll clip 'param'
HOST_CARD = dict(cx=612, cy=360, cw=576, ch=720, size=(900, 1125), cy_out=1010, pop=1519.62)
SHOTS = [
    (1519.62, 'card', HOST_CARD,    [(1519.62, 1.12), (1520.20, 1.00), (1523.40, 1.03)]),   # there's a lot of NO'S / in between the YESES   (host card under the title)
    (1523.40, 'card', HOST_CARD,    [(1523.40, 1.30), (1526.61, 1.36)]),                    # what's that EXPERIENCE been like over the years?  (punch-in inside the card)
    (1526.61, 'full', 'G_FRONT',    [(1526.61, 1.02), (1527.70, 1.07)]),                    # I want to relate it to
    (1527.70, 'bfull', 'chips_bet', [(1527.70, 1.00), (1530.70, 1.08)]),                    # GAMBLING / that constant search      (B-roll: all-in on chips)
    (1530.70, 'full', 'G_FRONT_CU', [(1530.70, 1.00), (1532.66, 1.05)]),                    # for that feeling of HIGH
    (1532.66, 'stack', None,        [(1532.66, 1.00), (1534.66, 1.04)]),                    # you're searching for that high        (two-shot, host listening)
    (1534.66, 'full', 'G_FRONT',    [(1534.66, 1.00), (1536.22, 1.04)]),                    # because when you get a
    (1536.22, 'card', dict(src='jackpot', cx=600, cy=360, cw=720, ch=720, size=(980, 980), cy_out=840, gain=1.3),
              [(1536.22, 1.00), (1537.22, 1.05)]),                    # BIG WIN                              (B-roll card: jackpot)
    (1537.22, 'full', 'G_FRONT',    [(1537.22, 1.32), (1540.30, 1.38)]),                    # when you NAIL and book that PRODUCTION
    (1540.30, 'full', 'G_FRONT',    [(1540.30, 1.06), (1541.46, 1.09)]),                    # that ROLE
    (1541.46, 'full', 'G_SIDE',     [(1541.46, 1.00), (1543.55, 1.05)]),                    # it releases all these like ENDORPHINS and you're like
    (1543.55, 'card', dict(cx=790, cy=360, cw=720, ch=720, size=(1000, 1000), cy_out=860),
              [(1543.55, 1.00), (1544.80, 1.06)]),                                         # YEAH!   (wide card so both fists stay in frame)
    (1544.80, 'full', 'G_SIDE',     [(1544.80, 1.26), (1547.75, 1.31)]),                    # and then you do THE JOB, it's OVER, you're like ah
    (1547.75, 'full', 'G_FRONT',    [(1547.75, 1.00), (1549.50, 1.05)]),                    # now you got to CHASE IT AGAIN
    (1549.50, 'card', dict(src='roulette', cx=660, cy=360, cw=576, ch=720, size=(880, 1100), cy_out=830),
              [(1549.50, 1.00), (1551.50, 1.07)]),                    # and you're just constantly CHASING THAT HIGH   (B-roll card: roulette)
    (1553.06, 'full', 'G_FRONT',    [(1553.06, 1.36), (1554.56, 1.40)]),                    # and it's FRUSTRATING, it really is     (close: stay on the face)
    (1554.56, 'full', 'G_FRONT',    [(1554.56, 1.05), (1556.05, 1.08)]),                    # and you have to be somebody
    (1556.05, 'full', 'G_SIDE',     [(1556.05, 1.00), (1558.80, 1.05)]),                    # who is CONSISTENT
    (1559.76, 'full', 'G_SIDE',     [(1559.76, 1.22), (1560.60, 1.25)]),                    # DETERMINED   (jump cut hidden by punch-in)
    (1561.00, 'full', 'G_SIDE',     [(1561.00, 1.44), (1561.80, 1.47)]),                    # PERSISTENT   (tighter again)
    (1562.36, 'full', 'G_SIDE',     [(1562.36, 1.04), (1564.98, 1.10)]),                    # because this is an INDUSTRY that is
    (1565.42, 'full', 'G_SIDE',     [(1565.42, 1.38), (1566.72, 1.42)]),                    # full of REJECTION
    (1567.36, 'full', 'G_FRONT',    [(1567.36, 1.00), (1569.95, 1.05)]),                    # and if you don't have THICK SKIN, if you CAN'T take it
    (1569.95, 'full', 'G_FRONT',    [(1569.95, 1.34), (1572.28, 1.40)]),                    # this is not the industry FOR YOU
    (1574.03, 'full', 'G_FRONT',    [(1574.03, 1.02), (1576.85, 1.09)]),                    # you're gonna get 99% NO'S             (giant count-up)
    (1576.85, 'full', 'G_FRONT',    [(1576.85, 1.36), (1577.80, 1.39)]),                    # and then that 1%                      (punch-in)
    (1577.80, 'card', dict(src='gold_chips', cx=640, cy=360, cw=576, ch=720, size=(880, 1100), cy_out=830),
              [(1577.80, 1.00), (1579.50, 1.07)]),                   # one is like THE RUSH                  (B-roll card: golden chips)
    (1579.50, 'full', 'G_FRONT',    [(1579.50, 1.20), (1580.76, 1.25)]),                    # that everybody's SEARCHING FOR        (end on the guest)
]
STACK = dict(top=(0, 640, 34), bottom=(640, 1280, 86))     # (x0, x1, crop top y) of the guest / host halves
# hits, source seconds: (t, flash, rgb_split_px, shake_px)
HITS = [(1527.72, 0.10, 0, 0), (1536.24, 0.10, 0, 0), (1544.40, 0.26, 10, 9), (1566.06, 0.0, 12, 3),
        (1574.78, 0.06, 0, 0), (1577.08, 0.20, 0, 5)]
# grade turns cold through the frustration / rejection beats and warms back on "1%"
COLD_IN, COLD_OUT, COLD_MAX = (1552.9, 1553.5), (1576.95, 1577.6), 0.65


def smooth(u): u = min(1, max(0, u)); return u * u * (3 - 2 * u)
def ease_out(u): u = min(1, max(0, u)); return 1 - (1 - u) ** 3
def back_out(u, s=1.7):
    u = min(1, max(0, u)) - 1; return 1 + u * u * ((s + 1) * u + s)


def shot_at(ts):
    s = [x for x in SHOTS if x[0] <= ts + 1e-6][-1]
    keys = s[3]
    if ts <= keys[0][0]: return s, keys[0][1]
    for (t0, z0), (t1, z1) in zip(keys, keys[1:]):
        if ts <= t1:
            u = (ts - t0) / (t1 - t0)
            e = ease_out(u) if z0 > z1 and t1 - t0 < 1 else smooth(u)    # quick settle-in, slow push otherwise
            return s, z0 + (z1 - z0) * e
    return s, keys[-1][1]


# ---------------------------------------------------------------- readers
class Reader:
    """Sequential raw-frame reader (frame index requests must not go backwards)."""
    def __init__(self, path, w, h):
        self.p = subprocess.Popen(['ffmpeg', '-v', 'error', '-i', path, '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'],
                                  stdout=subprocess.PIPE, stderr=subprocess.DEVNULL)
        self.w, self.h, self.k, self.img = w, h, -1, None

    def frame(self, k):
        while self.k < k:
            b = self.p.stdout.read(self.w * self.h * 3)
            if len(b) < self.w * self.h * 3: break            # past the end: hold the last frame
            self.img = Image.fromarray(np.frombuffer(b, np.uint8).reshape(self.h, self.w, 3)); self.k += 1
        return self.img


SRC = Reader(SRC_V, SW, SH)
_broll = {}
def broll_frame(name, start_src, ts):
    if name not in _broll:
        full = name == 'chips_bet'
        _broll[name] = Reader(os.path.join(HERE, f'src/broll/{name}.mp4'), *((W, H) if full else (1280, 720)))
    return _broll[name].frame(int(round((src_to_out(ts) - src_to_out(start_src)) * FPS)))


# ---------------------------------------------------------------- layouts
def hit_env(ts, k, tau):
    out = 0.0
    for th, *vals in HITS:
        if 0 <= ts - th < 6 * tau: out += vals[k] * math.exp(-(ts - th) / tau)
    return out


def shake(ts):
    sh = hit_env(ts, 2, 0.12)
    return sh * math.sin(ts * 97.0), sh * math.cos(ts * 71.0)


def full_layout(img, angle, z, ts):
    a = ANGLES[angle]
    ch = SH / z; cw = ch * 9 / 16
    dx, dy = shake(ts)
    x0 = min(max(a['cx'] - cw / 2 + dx, 0), SW - cw)
    y0 = min(max(a['fy'] - 0.30 * ch + dy, 0), SH - ch)
    return img.resize((W, H), Image.LANCZOS, box=(x0, y0, x0 + cw, y0 + ch)).filter(
        ImageFilter.UnsharpMask(radius=2.4, percent=60, threshold=2))


def stack_layout(img, z, ts):
    out = Image.new('RGB', (W, H), (12, 10, 9))
    ph = (H - 16) // 2
    for (x0, x1, top), oy in ((STACK['top'], 0), (STACK['bottom'], ph + 16)):
        cw = (x1 - x0) / z; chh = cw * ph / W
        cx = (x0 + x1) / 2
        y0 = min(max(top + (1 - 1 / z) * 90, 0), SH - chh)
        panel = img.resize((W, ph), Image.LANCZOS, box=(cx - cw / 2, y0, cx + cw / 2, y0 + chh))
        out.paste(panel.filter(ImageFilter.UnsharpMask(radius=2, percent=50, threshold=2)), (0, oy))
    return out


def blurred_fill(img, box):
    """Full-frame background: a 9:16 crop of img, heavily blurred and darkened."""
    small = img.resize((W // 10, H // 10), Image.BILINEAR, box=box).filter(ImageFilter.GaussianBlur(4))
    a = np.asarray(small.resize((W, H), Image.BILINEAR), np.float32) * 0.58
    return Image.fromarray(a.astype(np.uint8))


_masks = {}
def card_mask(cw, chh, r=40):
    if (cw, chh) not in _masks:
        ss = 3
        m = Image.new('L', (cw * ss, chh * ss), 0)
        ImageDraw.Draw(m).rounded_rectangle((0, 0, cw * ss - 1, chh * ss - 1), r * ss, fill=255)
        m = m.resize((cw, chh), Image.LANCZOS)
        pad = 80
        sh = Image.new('L', (cw + 2 * pad, chh + 2 * pad), 0)
        ImageDraw.Draw(sh).rounded_rectangle((pad, pad + 24, pad + cw, pad + chh + 24), r, fill=170)
        _masks[cw, chh] = (m, sh.filter(ImageFilter.GaussianBlur(30)), pad)
    return _masks[cw, chh]


def card_layout(img, crop, card_wh, cy, z, t_in, ts, gain=1.0):
    """img's crop box (16:9 source) shown in a rounded card, pop-in on entry, push-in inside."""
    x0, y0, x1, y1 = crop
    bw, bh = x1 - x0, y1 - y0
    fill_w = (y1 - y0) * 9 / 16; fcx = (x0 + x1) / 2
    bg = blurred_fill(img, (max(0, fcx - fill_w / 2), y0, min(img.width, fcx + fill_w / 2), y1))
    p = back_out((ts - t_in) / 0.30, 1.4)
    sc = 0.86 + 0.14 * p
    cw, chh = int(card_wh[0] * sc) // 2 * 2, int(card_wh[1] * sc) // 2 * 2
    iw, ih = bw / z, bh / z
    cx, ccy = (x0 + x1) / 2, (y0 + y1) / 2
    dx, dy = shake(ts)
    content = img.resize((cw, chh), Image.LANCZOS, box=(cx - iw / 2 + dx, ccy - ih / 2 + dy, cx + iw / 2 + dx, ccy + ih / 2 + dy))
    content = content.filter(ImageFilter.UnsharpMask(radius=2, percent=50, threshold=2))
    if gain != 1.0: content = Image.fromarray(np.clip(np.asarray(content, np.float32) * gain, 0, 255).astype(np.uint8))
    m, sh, pad = card_mask(cw, chh)
    px, py = (W - cw) // 2, int(cy - chh / 2)
    black = Image.new('RGB', sh.size, (0, 0, 0))
    bg.paste(black, (px - pad, py - pad), sh)
    bg.paste(content, (px, py), m)
    rim = Image.new('RGBA', (cw, chh), (0, 0, 0, 0))
    ImageDraw.Draw(rim).rounded_rectangle((1, 1, cw - 2, chh - 2), 40, outline=(255, 255, 255, 60), width=3)
    bg.paste(rim, (px, py), rim)
    return bg


def picture(ts):
    s, z = shot_at(ts)
    start, layout, param = s[0], s[1], s[2]
    if layout == 'bfull':
        b = broll_frame(param, start, ts)
        cw, ch = W / z, H / z
        return b.resize((W, H), Image.BICUBIC, box=((W - cw) / 2, (H - ch) / 2, (W + cw) / 2, (H + ch) / 2)), False
    if layout == 'card' and 'src' in param:
        img = broll_frame(param['src'], start, ts)
    else:
        img = SRC.frame(int(round((ts - EX_V0) * FPS)))
    if layout == 'full': return full_layout(img, param, z, ts), True
    if layout == 'stack': return stack_layout(img, z, ts), True
    p = param
    crop = (p['cx'] - p['cw'] / 2, p['cy'] - p['ch'] / 2, p['cx'] + p['cw'] / 2, p['cy'] + p['ch'] / 2)
    return card_layout(img, crop, p['size'], p['cy_out'], z, p.get('pop', start), ts, p.get('gain', 1.0)), 'src' not in p


# ---------------------------------------------------------------- grade / film look (same recipe as vice-city)
def curves(c, fade, r_hl, r_sh, g_sh, b_hl, b_sh):
    x = np.arange(256) / 255.0
    y = x - c * np.sin(2 * np.pi * x) / (2 * np.pi)
    y = fade + y * (0.975 - fade)
    hl, sh = x ** 2, (1 - x) ** 2
    return np.stack([y + r_hl * hl + r_sh * sh, y + g_sh * sh, y + b_hl * hl + b_sh * sh]).clip(0, 1).astype(np.float32)


WARM = (curves(0.26, 0.030, 0.035, -0.012, 0.006, -0.040, 0.035), 1.06)
COLD = (curves(0.32, 0.045, -0.035, -0.030, 0.018, 0.030, 0.065), 0.55)
LUMA = np.array([0.2126, 0.7152, 0.0722], np.float32)
yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
VIGNETTE = (1 - 0.24 * (((xx - W / 2) / (W * 0.62)) ** 2 + ((yy - H * 0.46) / (H * 0.62)) ** 2) ** 1.3).clip(0.55, 1)[..., None]
_y = np.linspace(0, 1, H, dtype=np.float32)[:, None, None]
SCRIM = 1 - 0.40 * np.clip((_y - 0.52) / 0.24, 0, 1) ** 1.5 * np.clip((0.98 - _y) / 0.12, 0.35, 1)     # caption legibility
TOPSCRIM = 1 - 0.35 * np.clip((0.22 - _y) / 0.22, 0, 1) ** 1.2                                          # headline legibility
rng = np.random.default_rng(11)
GRAIN = []
for _ in range(10):
    g = Image.fromarray(((rng.standard_normal((H // 2, W // 2)) * 0.5 + 0.5).clip(0, 1) * 255).astype(np.uint8))
    GRAIN.append((np.asarray(g.resize((W, H), Image.BILINEAR), np.float32) / 255 - 0.5)[..., None])
del yy, xx


def coldness(ts):
    if ts < COLD_IN[0] or ts > COLD_OUT[1]: return 0.0
    if ts < COLD_IN[1]: return COLD_MAX * smooth((ts - COLD_IN[0]) / (COLD_IN[1] - COLD_IN[0]))
    if ts < COLD_OUT[0]: return COLD_MAX
    return COLD_MAX * (1 - smooth((ts - COLD_OUT[0]) / (COLD_OUT[1] - COLD_OUT[0])))


def grade(img, ts, oi, t_out):
    k = coldness(ts)
    lut = WARM[0] * (1 - k) + COLD[0] * k
    sat = WARM[1] * (1 - k) + COLD[1] * k
    a = np.asarray(img)
    f = np.stack([lut[0][a[..., 0]], lut[1][a[..., 1]], lut[2][a[..., 2]]], -1)
    Y = (f @ LUMA)[..., None]
    f = Y + (f - Y) * sat
    hi = np.clip((Y - 0.62) / 0.38, 0, 1) * f
    glow = Image.fromarray((hi * 255).astype(np.uint8)).resize((W // 8, H // 8), Image.BILINEAR)
    glow = np.asarray(glow.filter(ImageFilter.GaussianBlur(6)).resize((W, H), Image.BILINEAR), np.float32) / 255
    f = f + glow * np.array([0.40, 0.27, 0.16], np.float32) * (1 - 0.5 * k)
    f = f * VIGNETTE * SCRIM
    if t_out < HEAD_T[1] + 0.3: f = f * (1 - (1 - TOPSCRIM) * head_alpha(t_out))
    f = f + hit_env(ts, 0, 0.07)
    lum = (f @ LUMA)[..., None]
    f = f + GRAIN[oi % len(GRAIN)] * (0.050 * (1.1 - lum) + 0.012)
    o = (f.clip(0, 1) * 255).astype(np.uint8)
    ca = int(round(hit_env(ts, 1, 0.09)))
    if ca:
        o = o.copy(); o[..., 0] = np.roll(o[..., 0], ca, 1); o[..., 2] = np.roll(o[..., 2], -ca, 1)
    return Image.fromarray(o)


# ---------------------------------------------------------------- text
_fonts = {}
def font(name, size):
    if (name, size) not in _fonts: _fonts[name, size] = ImageFont.truetype(os.path.join(FONTS, name), size)
    return _fonts[name, size]


def sprite(text, fnt, color, glow=None, shadow=0.8):
    asc, desc = fnt.getmetrics(); adv = fnt.getlength(text); pad = 44
    size = (int(adv) + 2 * pad, asc + desc + 2 * pad)
    m = Image.new('L', size, 0); ImageDraw.Draw(m).text((pad, pad + asc), text, font=fnt, anchor='ls', fill=255)
    im = Image.new('RGBA', size, (0, 0, 0, 0))
    sh = Image.new('RGBA', size, (0, 0, 0, 0)); sh.putalpha(m.filter(ImageFilter.GaussianBlur(10)).point(lambda v: int(v * shadow)))
    im.alpha_composite(sh, (0, 6))
    if glow:
        g = Image.new('RGBA', size, glow + (0,)); g.putalpha(m.filter(ImageFilter.GaussianBlur(16)).point(lambda v: int(v * 0.55)))
        im.alpha_composite(g)
    fill = Image.new('RGBA', size, color + (0,)); fill.putalpha(m); im.alpha_composite(fill)
    return dict(img=im, ox=pad, by=pad + asc, adv=adv, asc=asc, font=fnt, color=color, glow=glow)


def pill(text, size=70):
    """Gold pill tag (stacked-list scene A5): dark Inter Bold caps on a gold gradient."""
    fnt = font('Inter-700.ttf', size)
    tw = fnt.getlength(text); asc, desc = fnt.getmetrics()
    pw, ph, pad = int(tw + 2 * 0.62 * size), int(size * 1.62), 40
    im = Image.new('RGBA', (pw + 2 * pad, ph + 2 * pad), (0, 0, 0, 0))
    sh = Image.new('L', im.size, 0); ImageDraw.Draw(sh).rounded_rectangle((pad, pad + 10, pad + pw, pad + ph + 10), ph // 2, fill=150)
    im.putalpha(sh.filter(ImageFilter.GaussianBlur(14)))
    glow = Image.new('L', im.size, 0); ImageDraw.Draw(glow).rounded_rectangle((pad, pad, pad + pw, pad + ph), ph // 2, fill=120)
    gl = Image.new('RGBA', im.size, GOLD + (0,)); gl.putalpha(glow.filter(ImageFilter.GaussianBlur(18))); im.alpha_composite(gl)
    grad = np.linspace(0, 1, ph)[:, None, None]
    body = (np.array([255, 226, 172]) * (1 - grad) + np.array([214, 160, 84]) * grad) * np.ones((ph, pw, 1))
    bm = Image.new('L', (pw, ph), 0); ImageDraw.Draw(bm).rounded_rectangle((0, 0, pw - 1, ph - 1), ph // 2, fill=255)
    im.paste(Image.fromarray(body.astype(np.uint8)), (pad, pad), bm)
    ImageDraw.Draw(im).text((pad + pw / 2, pad + ph / 2 + 2), text, font=fnt, anchor='mm', fill=(26, 18, 10))
    return dict(img=im, w=pw + 2 * pad, h=ph + 2 * pad)


# ---------------------------------------------------------------- captions
RUN_FONT, RUN_SIZE = 'Inter-500.ttf', 58
SWEAR_FONT = 'Inter-700.ttf'
KEY_FONT, KEY_SIZE = 'InstrumentSerif-Italic.ttf', 146
LEAD = 3 / FPS
CAP_Y = 1420
MAX_LINE = 960
WORDS_SRC = json.load(open(os.path.join(HERE, 'words_src.json')))
WORDS = [(src_to_out(a), src_to_out(b), w) for a, b, w in WORDS_SRC]          # output seconds
DISPLAY = {'i': 'I', 'yeah!': 'YEAH!'}
HIDE = {137, 142}                     # 99% / 1% are shown as the giant number instead
# (first word, last word, keyword indices, red indices, style)
CHUNKS = [
    (0, 4, {4}, {4}, ''),                 # there's a lot of / NO'S
    (5, 8, {8}, set(), ''),               # in between the / YESES
    (9, 11, {11}, set(), ''),             # what's that / EXPERIENCE
    (12, 16, {16}, set(), ''),            # been like over the / YEARS
    (17, 23, {23}, set(), ''),            # i want to relate it to / GAMBLING
    (24, 26, {25, 26}, set(), ''),        # that / CONSTANT SEARCH
    (27, 31, {31}, set(), ''),            # for that feeling of / HIGH
    (32, 36, {36}, set(), ''),            # you're searching for that / HIGH
    (37, 43, {42, 43}, set(), ''),        # because when you get a / BIG WIN
    (44, 46, {46}, set(), ''),            # when you / NAIL
    (47, 50, {50}, set(), ''),            # and book that / PRODUCTION
    (51, 52, {52}, set(), ''),            # that / ROLE
    (53, 58, {58}, set(), ''),            # it releases all these like / ENDORPHINS
    (59, 62, {62}, set(), ''),            # and you're like / YEAH!
    (63, 68, {67, 68}, set(), ''),        # and then you do / THE JOB
    (69, 73, {70}, set(), ''),            # it's / OVER / you're like ah
    (74, 80, {78, 79, 80}, set(), ''),    # now you got to / CHASE IT AGAIN
    (81, 87, {85, 86, 87}, set(), ''),    # and you're just constantly / CHASING THAT HIGH
    (88, 93, {90}, {90}, ''),             # and it's / FRUSTRATING / it really is
    (94, 101, set(), set(), ''),          # and you have to be somebody who is
    (102, 104, set(), set(), 'tags'),     # CONSISTENT / DETERMINED / PERSISTENT (stacked gold pills)
    (105, 111, {109}, set(), ''),         # because this is an / INDUSTRY / that is
    (112, 114, {114}, {114}, ''),         # full of / REJECTION
    (115, 121, {120, 121}, set(), ''),    # and if you don't have / THICK SKIN
    (122, 126, {124}, {124}, ''),         # if you / CAN'T / take it
    (127, 133, {132, 133}, set(), ''),    # this is not the industry / FOR YOU
    (134, 138, {138}, {138}, ''),         # you're gonna get [99%] / NO'S
    (139, 142, set(), set(), ''),         # and then that [1%]
    (143, 147, {146, 147}, set(), ''),    # one is like / THE RUSH
    (148, 151, {150, 151}, set(), ''),    # that everybody's / SEARCHING FOR
]
LETTER_WORDS = {23, 147}                  # gambling, rush: assemble letter by letter


def clean(w):
    w = w.strip(',.?!') if w != 'yeah!' else w
    return DISPLAY.get(w.lower(), w.lower())


def layout_chunk(i0, i1, keys, reds, style):
    words = [dict(i=i, txt=clean(WORDS[i][2]), key=i in keys, red=i in reds) for i in range(i0, i1 + 1) if i not in HIDE]
    if style == 'tags':
        y = CAP_Y + 20
        for w in reversed(words):
            w['pill'] = pill(w['txt'].upper()); w['x'] = (W - w['pill']['w']) / 2; w['y'] = y - w['pill']['h']; y -= 140
        return words
    runs = []
    for w in words:
        if runs and runs[-1][0]['key'] == w['key']: runs[-1].append(w)
        else: runs.append([w])
    lines = []
    for run in runs:
        if run[0]['key']:
            size = KEY_SIZE + (40 if run[0]['txt'] == 'YEAH!' else 0)
            while font(KEY_FONT, size).getlength(' '.join(w['txt'] for w in run)) > MAX_LINE: size -= 6
            for w in run:
                acc = RED if w['red'] else GOLD
                w['spr'] = sprite(w['txt'], font(KEY_FONT, size), acc, glow=acc)
                w['space'] = font(KEY_FONT, size).getlength(' ') * 1.6
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


CHUNK_LAYOUT = [(c[0], c[1], c[4], layout_chunk(*c)) for c in CHUNKS]
WORD_IN, WORD_BLUR, WORD_RISE = 6 / FPS, 12, (30, 40)
LETTER_IN, LETTER_BLUR, LETTER_SPREAD = 5 / FPS, 14, 0.36
BLOCK_GROW, EXIT_T, EXIT_BLUR, EXIT_GROW = 0.03, 4 / FPS, 9, 0.035
STRIP_Y0, STRIP_H = CAP_Y - 600, 760


def _letters(w):
    spr = w['spr']; fnt = spr['font']; txt = w['txt']; out = []
    idx = [j for j, c in enumerate(txt) if c != ' ']
    order = np.random.default_rng(w['i'] * 7919).permutation(len(idx))
    for k, j in enumerate(idx):
        out.append((sprite(txt[j], fnt, spr['color'], glow=spr['glow']), fnt.getlength(txt[:j]), float(LETTER_SPREAD * order[k] / max(1, len(idx) - 1))))
    return out


for _a, _b, _st, _words in CHUNK_LAYOUT:
    for _w in _words:
        if _w['i'] in LETTER_WORDS: _w['letters'] = _letters(_w)
    _words[0]['block_cy'] = CAP_Y - 120


def _put(strip, img, x, y, alpha, blur, scale=1.0):
    if scale != 1.0:
        w0, h0 = img.size; img = img.resize((max(1, int(w0 * scale)), max(1, int(h0 * scale))), Image.BICUBIC)
        x += (w0 - img.size[0]) / 2; y += (h0 - img.size[1]) / 2
    if blur >= 0.5: img = img.filter(ImageFilter.GaussianBlur(float(blur)))
    if alpha < 0.999: img = img.copy(); img.putalpha(img.getchannel('A').point(lambda v: int(v * alpha)))
    strip.alpha_composite(img, (max(0, int(x)), int(y - STRIP_Y0)))


def chunk_window(n):
    a, b = CHUNK_LAYOUT[n][0], CHUNK_LAYOUT[n][1]
    t_on = WORDS[a][0] - LEAD
    t_off = WORDS[b][1] + 0.3
    if n + 1 < len(CHUNK_LAYOUT): t_off = min(t_off, WORDS[CHUNK_LAYOUT[n + 1][0]][0] - LEAD)
    return t_on, min(t_off, DUR)


def draw_captions(fr, t):
    for n, (a, b, style, words) in enumerate(CHUNK_LAYOUT):
        t_on, t_off = chunk_window(n)
        if not (t_on <= t < t_off): continue
        strip = Image.new('RGBA', (W, STRIP_H), (0, 0, 0, 0))
        for w in words:
            ts = WORDS[w['i']][0] - LEAD
            if t < ts: continue
            if 'pill' in w:
                u = (t - ts) / (7 / FPS)
                _put(strip, w['pill']['img'], w['x'], w['y'], min(1, u * 1.8), 8 * (1 - ease_out(u)), 0.6 + 0.4 * back_out(u))
                continue
            spr = w['spr']; x0 = w['x'] - spr['ox']; y0 = w['y'] - spr['by']
            if 'letters' in w:
                for ls, dx, delay in w['letters']:
                    u = (t - ts - delay) / LETTER_IN
                    if u <= 0: continue
                    _put(strip, ls['img'], x0 + dx, y0, min(1, u * 1.5), LETTER_BLUR * (1 - ease_out(u)))
            else:
                u = (t - ts) / WORD_IN
                rise = WORD_RISE[1] if w['key'] else WORD_RISE[0]
                sc = 0.7 + 0.3 * back_out(u) if w['txt'] == 'YEAH!' else 1.0
                _put(strip, spr['img'], x0, y0 + rise * (1 - ease_out(u)), min(1, u * 1.6), WORD_BLUR * (1 - ease_out(u)), sc)
        life = smooth((t - t_on) / max(0.3, t_off - t_on))
        e = smooth((t - (t_off - EXIT_T)) / EXIT_T) if t_off < DUR - 0.01 else 0.0
        sc = 1 + BLOCK_GROW * life + EXIT_GROW * e
        if e > 0:
            strip = strip.filter(ImageFilter.GaussianBlur(EXIT_BLUR * e))
            strip.putalpha(strip.getchannel('A').point(lambda v: int(v * (1 - e))))
        cy = words[0]['block_cy'] - STRIP_Y0
        sw, sh = int(W * sc), int(STRIP_H * sc)
        strip = strip.resize((sw, sh), Image.BICUBIC)
        ox, oy = int((sw - W) / 2), int(cy * sc - cy)
        fr.alpha_composite(strip.crop((ox, oy, ox + W, oy + STRIP_H)), (0, STRIP_Y0))


# ---------------------------------------------------------------- headline (title banner, first beat) + giant number
HEAD_T = (0.05, 6.55)                 # output seconds: on during the host's question
HEAD_LINES = [('Why acting is like', 'Inter-600.ttf', 62, (255, 255, 255), None), ('gambling', 'InstrumentSerif-Italic.ttf', 150, GOLD, GOLD)]
HEAD_Y = [262, 400]                   # baselines (13.6 % / 20.8 % of the height)
HEAD_SPR = [sprite(t, font(f, s), c, glow=g) for t, f, s, c, g in HEAD_LINES]


def head_alpha(t):
    return smooth((t - HEAD_T[0]) / 0.35) * (1 - smooth((t - (HEAD_T[1] - 0.25)) / 0.25))


def draw_headline(fr, t):
    if not (HEAD_T[0] <= t < HEAD_T[1]): return
    out = smooth((t - (HEAD_T[1] - 0.25)) / 0.25)
    for k, (spr, by) in enumerate(zip(HEAD_SPR, HEAD_Y)):
        u = (t - HEAD_T[0] - 0.12 * k) / 0.45
        if u <= 0: continue
        a = min(1, u * 1.4) * (1 - out)
        img = spr['img']
        _put_abs(fr, img, (W - spr['adv']) / 2 - spr['ox'], by - spr['by'] + 26 * (1 - ease_out(u)) - 20 * out,
                 a, 10 * (1 - ease_out(u)) + 8 * out)


def _put_abs(fr, img, x, y, alpha, blur):
    if blur >= 0.5: img = img.filter(ImageFilter.GaussianBlur(float(blur)))
    if alpha < 0.999: img = img.copy(); img.putalpha(img.getchannel('A').point(lambda v: int(v * alpha)))
    fr.alpha_composite(img, (int(x), int(y)))


NUM_FONT = 'Inter-800.ttf'
N99 = WORDS[137][0]; N1 = WORDS[142][0]
NUM_ON, NUM_OFF = N99 - 0.42, src_to_out(1577.80)      # count-up lands on "99", 1% until the gold-chips card
NUM_Y = 930                                           # centre: over the dark shirt, under the face
_num_cache = {}
def num_sprite(text, gold):
    if (text, gold) not in _num_cache:
        f = font(NUM_FONT, 300)
        _num_cache[text, gold] = sprite(text, f, GOLD if gold else (255, 255, 255), glow=GOLD, shadow=0.9)
    return _num_cache[text, gold]


def draw_number(fr, t):
    if not (NUM_ON <= t < NUM_OFF): return
    if t < N1 - LEAD:
        v = int(round(99 * ease_out((t - NUM_ON) / 0.45)))
        txt, gold, t0 = f'{v}%', False, NUM_ON
    else:
        txt, gold, t0 = '1%', True, N1 - LEAD
    spr = num_sprite(txt, gold)
    u = (t - t0) / 0.28
    sc = 0.6 + 0.4 * back_out(u)
    out = smooth((t - (NUM_OFF - 0.12)) / 0.12)
    img = spr['img']
    w0, h0 = img.size
    img = img.resize((max(1, int(w0 * sc)), max(1, int(h0 * sc))), Image.BICUBIC)
    x = W / 2 - img.size[0] / 2
    y = NUM_Y - img.size[1] / 2 + 30
    _put_abs(fr, img, x, y, min(1, u * 2) * (1 - out), 10 * (1 - ease_out(u)))


# ---------------------------------------------------------------- frame + audio
FADE_OUT = (DUR - 0.30, DUR)


def render_frame(oi):
    t = oi / FPS
    ts = out_to_src(t)
    img, is_src = picture(ts)
    img = grade(img, ts, oi, t)
    fr = img.convert('RGBA')
    draw_number(fr, t)
    draw_headline(fr, t)
    draw_captions(fr, t)
    fr = fr.convert('RGB')
    if t > FADE_OUT[0]:
        k = 1 - 0.85 * smooth((t - FADE_OUT[0]) / (FADE_OUT[1] - FADE_OUT[0]))
        fr = Image.fromarray((np.asarray(fr, np.float32) * k).astype(np.uint8))
    return fr


def build_audio(path):
    """Kept segments joined with 10 ms fades at every cut, light EQ/compression, -14 LUFS, short end fade."""
    parts, chain = [], []
    for k, (a, b) in enumerate(SEGMENTS):
        d = b - a
        chain.append(f'[0:a]atrim={a - EX_A0:.4f}:{b - EX_A0:.4f},asetpts=PTS-STARTPTS,'
                     f'afade=t=in:st=0:d=0.010,afade=t=out:st={d - 0.010:.4f}:d=0.010[s{k}]')
        parts.append(f'[s{k}]')
    fc = ';'.join(chain) + ';' + ''.join(parts) + f'concat=n={len(SEGMENTS)}:v=0:a=1,' + \
        'highpass=f=60,equalizer=f=3000:t=q:w=1.2:g=2,acompressor=threshold=-20dB:ratio=2.5:attack=8:release=120:makeup=2,' + \
        f'loudnorm=I=-14:TP=-1.5:LRA=9,alimiter=limit=0.87:level=0,afade=t=out:st={FADE_OUT[0]:.3f}:d={FADE_OUT[1] - FADE_OUT[0]:.3f},' + \
        f'atrim=0:{N_FRAMES / FPS:.4f}'
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', SRC_A, '-filter_complex', fc, '-ar', '48000', path], check=True)


def main():
    os.makedirs(os.path.join(HERE, 'out'), exist_ok=True)
    print(f'{len(SEGMENTS)} segments, {DUR:.2f} s, {N_FRAMES} frames')
    if '--still' in sys.argv:
        want = sorted(int(round(float(x) * FPS)) for x in sys.argv[sys.argv.index('--still') + 1].split(','))
        for oi in want:
            render_frame(oi).save(os.path.join(HERE, f'out/still_{oi / FPS:05.2f}.png'))
        return
    audio = os.path.join(HERE, 'out/audio.wav'); build_audio(audio)
    enc = subprocess.Popen(['ffmpeg', '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{W}x{H}',
                            '-r', f'{FPS_N}/{FPS_D}', '-i', '-', '-i', audio, '-c:v', 'libx264', '-preset', 'slow', '-crf', '20', '-maxrate', '7M', '-bufsize', '14M',
                            '-tune', 'film', '-pix_fmt', 'yuv420p', '-color_primaries', 'bt709', '-color_trc', 'bt709',
                            '-colorspace', 'bt709', '-c:a', 'aac', '-b:a', '256k', '-shortest', '-movflags', '+faststart', OUT],
                           stdin=subprocess.PIPE)
    for oi in range(N_FRAMES):
        enc.stdin.write(render_frame(oi).tobytes())
        if oi % 96 == 0: print(f'{oi / FPS:5.1f}s', flush=True)
    enc.stdin.close(); enc.wait()
    print('wrote', OUT)


if __name__ == '__main__':
    main()
