"""Premium vertical clip: "I charged my dad interest" (Talk About It podcast, guest Toya Simone, source 12:07-14:06).

House style: `.claude/skills/premium-short-form` (mode B, visual storytelling), same look as edits/gambling.

    python3 edit.py                     -> out/dad_interest_premium_1080x1920.mp4
    python3 edit.py --still 3.0,20.5    -> out/still_*.png (output-time stills for a quick look)

Source: `src/excerpt_725-849.mp4` is a frame-exact excerpt of the 47-min episode (1920x1080, 23.976 fps;
excerpt frame k = source time EX_V0 + k / FPS). All timing constants below are in SOURCE seconds (the
full-episode timeline, see analysis/transcript_full.md) unless a name says OUT.

The clip is re-ordered: the hook ("I'm gonna give you $20, but you gotta pay me back with $5 interest", 13:04)
plays first, then the host's reaction, then the story from the start. SEGMENTS are the kept ranges in OUTPUT
order; every join was checked by re-transcribing the cut (see README). Because segments are re-ordered, every
source time maps to output time by containment (segments never overlap in the source).

Pictures (SHOTS, one per beat) reframe the episode's own camera angles to 9:16:
  GUEST   guest on the grey couch (the only guest angle; punch-ins make the MCU / CU)
  HOST    host on the red-curtain set
plus designed scenes drawn here: 'spend' (stacked tags on a blurred plate), 'calendar', 'ledger' (the
recurring loan book, 4 stages) and a 'card' (the guest in a rounded card under the title, hook only).
"""
import json, math, os, re, subprocess, sys
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter

HERE = os.path.dirname(os.path.abspath(__file__))
SRC_V = os.path.join(HERE, 'src/excerpt_725-849.mp4')
SRC_A = os.path.join(HERE, 'src/excerpt_audio.flac')
EX_A0 = 725.0                       # source time of the first audio sample in the excerpt
EX_V0 = 725.0160                    # source time of excerpt frame 0 (measured against the full episode)
OUT = os.path.join(HERE, 'out/dad_interest_premium_1080x1920.mp4')
FONTS = os.path.join(HERE, '../../video/fonts')
W, H = 1080, 1920
FPS_N, FPS_D = 24000, 1001
FPS = FPS_N / FPS_D
SW, SH = 1920, 1080
GOLD = (243, 214, 160)
GOLD_DEEP = (214, 160, 84)
RED = (255, 84, 70)
INK = (36, 32, 44)
INK_GOLD = (168, 118, 40)
INK_RED = (200, 40, 36)

# ---------------------------------------------------------------- the cut (source seconds, OUTPUT order)
SEGMENTS = [
    (784.15, 788.60, "I'm gonna give you $20 but you gotta pay me back with $5 interest"),            # hook (13:04)
    (789.56, 791.26, "Wow I like that"),                                                               # host reaction
    (727.17, 728.66, "when I was 15"),
    (732.36, 733.95, "my dad he would give me"),                                                       # ["as I said" cut]
    (735.14, 735.92, "allowance"),                                                                     # pause tightened
    (737.50, 739.22, "I wasn't into shopping"),                                                        # ["because" cut]
    (743.04, 751.72, "I would just buy books therefore I saved most of my money when my friends and my family they ran out of money"),
    (751.98, 757.18, "in the middle of the month they came to me for money guess what I did"),       # pause tightened
    (759.30, 763.24, "Yeah I gave it to them but they had to pay interest"),                          # [host "You gave it to them?" cut] + host laugh
    (769.42, 770.37, "I remember my dad"),
    (772.31, 776.30, "he knocked on my room door he said Latoya I need $20"),                         # ["he was going to work and he came" cut]
    (776.97, 783.13, "I went in my drawer and I started counting all my money he said wait you still have all those money"),
    (791.58, 800.59, "So I gave him $20 the next time he got paid he's giving me allowance I said daddy remember you owe me $20 and plus $5 for interest"),
    (801.12, 807.20, "And he gave me my allowance and the $20 but he didn't give me back my interest I'm like come on"),
    (839.72, 845.62, "so that was my first entrepreneur business but I didn't know it was called entrepreneurship"),
]
SEG_OUT = []
_o = 0.0
for a, b, _ in SEGMENTS:
    SEG_OUT.append((_o, a, b)); _o += b - a
DUR = _o
N_FRAMES = int(round(DUR * FPS))


def out_to_src(t):
    for o, a, b in reversed(SEG_OUT):
        if t >= o: return a + (t - o)
    return SEGMENTS[0][0]


def src_to_out(ts):
    """Output time of source time ts (the segment containing it; nearest segment edge otherwise)."""
    best = None
    for o, a, b in SEG_OUT:
        if a - 1e-6 <= ts <= b + 1e-6: return o + (ts - a)
        d = min(abs(ts - a), abs(ts - b))
        if best is None or d < best[0]: best = (d, o + min(max(ts, a), b) - a)
    return best[1]


# ---------------------------------------------------------------- camera angles (source pixel space)
ANGLES = {
    'GUEST': dict(cx=925, fy=430),
    'HOST':  dict(cx=1170, fy=250),
}
# Shot list, SOURCE seconds: (start, layout, param, [(t, zoom), ...]). Hard cut at every start.
#   full     -> 9:16 reframe of angle 'param' (zoom 1 = full source height); param may be a dict
#               dict(angle=, tmin=, tmax=) to clamp the source time (freeze-frames past a camera switch)
#   card     -> the guest in a rounded card over a blurred fill (hook, under the title)
#   spend / calendar -> designed scenes;  ledger -> the loan book, param = stage 1..4
HOOK_CARD = dict(cx=925, cy=540, cw=840, ch=1050, size=(880, 1100), cy_out=1000)
SHOTS = [
    (784.15, 'card', HOOK_CARD,  [(784.15, 1.10), (784.60, 1.00), (786.00, 1.03)]),   # I'm gonna give you [$20]
    (786.00, 'card', HOOK_CARD,  [(786.00, 1.28), (788.60, 1.34)]),                   # but you gotta pay me back with [+$5] INTEREST
    (789.56, 'full', dict(angle='HOST', tmin=789.80, tmax=791.20), [(789.56, 1.00), (791.26, 1.06)]),  # Wow, I like that
    (727.17, 'full', 'GUEST',    [(727.17, 1.00), (728.66, 1.05)]),                   # when I was [15]
    (732.36, 'full', 'GUEST',    [(732.36, 1.32), (733.95, 1.37)]),                   # my DAD he would give me
    (735.14, 'spend', None,      [(735.14, 1.00), (744.08, 1.06)]),                   # ALLOWANCE / SHOPPING (struck) / BOOKS
    (744.08, 'full', 'GUEST',    [(744.08, 1.00), (746.30, 1.05)]),                   # therefore I SAVED most of my money
    (746.30, 'full', 'GUEST',    [(746.30, 1.34), (749.42, 1.39)]),                   # when my FRIENDS and my FAMILY
    (749.42, 'calendar', None,   [(749.42, 1.00), (753.30, 1.06)]),                   # they RAN OUT of money / in the MIDDLE of the month
    (753.28, 'full', 'GUEST',    [(753.28, 1.06), (755.46, 1.10)]),                   # they came to me for MONEY
    (755.46, 'full', 'GUEST',    [(755.46, 1.44), (757.18, 1.48)]),                   # guess what I DID?   (punch-in)
    (759.30, 'full', 'GUEST',    [(759.30, 1.00), (760.48, 1.03)]),                   # Yeah, I gave it to them
    (760.48, 'ledger', 1,        [(760.48, 1.00), (762.26, 1.04)]),                   # but they had to pay INTEREST   (loan book opens)
    (762.26, 'full', 'HOST',     [(762.26, 1.00), (763.24, 1.07)]),                   # (host laughing)
    (769.42, 'full', 'GUEST',    [(769.42, 1.00), (770.37, 1.03)]),                   # I remember my dad
    (772.31, 'full', 'GUEST',    [(772.31, 1.26), (774.08, 1.30)]),                   # he KNOCKED on my room DOOR   (knock-knock shakes)
    (774.08, 'full', 'GUEST',    [(774.08, 1.00), (776.30, 1.05)]),                   # he said Latoya, I need [$20]
    (776.97, 'full', 'GUEST',    [(776.97, 1.32), (779.26, 1.36)]),                   # I went in my DRAWER
    (779.26, 'full', 'GUEST',    [(779.26, 1.04), (781.00, 1.07)]),                   # and I started COUNTING all my money
    (781.00, 'full', 'GUEST',    [(781.00, 1.46), (783.13, 1.50)]),                   # he said WAIT, you still have all those money?
    (791.58, 'full', 'GUEST',    [(791.58, 1.10), (792.74, 1.13)]),                   # so I gave him $20
    (792.74, 'full', 'GUEST',    [(792.74, 1.00), (794.68, 1.04)]),                   # the next time he got PAID
    (794.68, 'full', 'GUEST',    [(794.68, 1.30), (796.24, 1.33)]),                   # he's giving me allowance
    (796.24, 'ledger', 2,        [(796.24, 1.00), (800.59, 1.07)]),                   # I said daddy, remember you owe me $20 + $5 for interest
    (801.12, 'full', 'GUEST',    [(801.12, 1.00), (804.04, 1.05)]),                   # and he gave me my allowance and the $20
    (804.04, 'ledger', 3,        [(804.04, 1.04), (805.94, 1.08)]),                   # but he DIDN'T give me back my INTEREST   ($5 struck red)
    (805.94, 'full', 'GUEST',    [(805.94, 1.42), (807.20, 1.48)]),                   # I'm like, COME ON
    (839.72, 'ledger', 4,        [(839.72, 1.00), (842.92, 1.06)]),                   # so that was my FIRST business   (stamp)
    (842.92, 'full', 'GUEST',    [(842.92, 1.00), (844.48, 1.04)]),                   # but I didn't know it was called
    (844.48, 'full', 'GUEST',    [(844.48, 1.30), (845.62, 1.36)]),                   # ENTREPRENEURSHIP
]
SHOTS_OUT = sorted((src_to_out(s[0]), s) for s in SHOTS)
# hits, SOURCE seconds: (t, flash, rgb_split_px, shake_px)
HITS = [(784.86, 0.08, 0, 0), (787.24, 0.16, 0, 4), (728.16, 0.10, 0, 0), (735.16, 0.06, 0, 0),
        (772.99, 0.0, 0, 11), (773.82, 0.0, 0, 9), (775.82, 0.08, 0, 0), (781.02, 0.10, 6, 0),
        (805.58, 0.0, 10, 3), (806.52, 0.0, 0, 6), (840.62, 0.26, 6, 10), (844.50, 0.10, 0, 0)]
# grade turns cold on "he didn't give me back my interest / come on" and warms back on the payoff
COLD_OUT_T = (src_to_out(804.0), src_to_out(804.5), src_to_out(807.2), src_to_out(839.72) + 0.4)
COLD_MAX = 0.55


def smooth(u): u = min(1, max(0, u)); return u * u * (3 - 2 * u)
def ease_out(u): u = min(1, max(0, u)); return 1 - (1 - u) ** 3
def back_out(u, s=1.7):
    u = min(1, max(0, u)) - 1; return 1 + u * u * ((s + 1) * u + s)


def shot_at(t):
    """Current shot and its zoom at OUTPUT time t."""
    s = [x for o, x in SHOTS_OUT if o <= t + 1e-6][-1]
    ts = out_to_src(t)
    keys = s[3]
    if ts <= keys[0][0]: return s, keys[0][1]
    for (t0, z0), (t1, z1) in zip(keys, keys[1:]):
        if ts <= t1:
            u = (ts - t0) / (t1 - t0)
            e = ease_out(u) if z0 > z1 and t1 - t0 < 1 else smooth(u)    # quick settle-in, slow push otherwise
            return s, z0 + (z1 - z0) * e
    return s, keys[-1][1]


# ---------------------------------------------------------------- reader (random access: the cut is re-ordered)
class Reader:
    def __init__(self, path, w, h):
        self.path, self.w, self.h, self.p, self.k, self.img = path, w, h, None, -10, None

    def _open(self, k):
        if self.p: self.p.kill()
        self.p = subprocess.Popen(['ffmpeg', '-v', 'error', '-ss', f'{max(0, k - 0.3) / FPS:.4f}', '-i', self.path,
                                   '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], stdout=subprocess.PIPE, stderr=subprocess.DEVNULL)
        self.k = k - 1

    def frame(self, k):
        if k < self.k or k > self.k + 48: self._open(k)
        while self.k < k:
            b = self.p.stdout.read(self.w * self.h * 3)
            if len(b) < self.w * self.h * 3: break
            self.img = Image.fromarray(np.frombuffer(b, np.uint8).reshape(self.h, self.w, 3)); self.k += 1
        return self.img


SRC = Reader(SRC_V, SW, SH)
def src_frame(ts): return SRC.frame(int(round((ts - EX_V0) * FPS)))


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
    y0 = min(max(a['fy'] - 0.36 * ch + dy, 0), SH - ch)
    return img.resize((W, H), Image.LANCZOS, box=(x0, y0, x0 + cw, y0 + ch)).filter(
        ImageFilter.UnsharpMask(radius=2.4, percent=55, threshold=2))


def blurred_fill(img, box, k=0.58):
    small = img.resize((W // 10, H // 10), Image.BILINEAR, box=box).filter(ImageFilter.GaussianBlur(4))
    a = np.asarray(small.resize((W, H), Image.BILINEAR), np.float32) * k
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


def card_layout(img, p, z, t_pop, ts):
    x0, y0 = p['cx'] - p['cw'] / 2, p['cy'] - p['ch'] / 2
    x1, y1 = x0 + p['cw'], y0 + p['ch']
    fill_w = SH * 9 / 16
    bg = blurred_fill(img, (p['cx'] - fill_w / 2, 0, p['cx'] + fill_w / 2, SH))
    u = t_pop / 0.30
    sc = 0.86 + 0.14 * back_out(u, 1.4)
    cw, chh = int(p['size'][0] * sc) // 2 * 2, int(p['size'][1] * sc) // 2 * 2
    iw, ih = (x1 - x0) / z, (y1 - y0) / z
    cx, cy = (x0 + x1) / 2, (y0 + y1) / 2 - (1 - 1 / z) * 120       # punch-in drifts up towards the face
    dx, dy = shake(ts)
    content = img.resize((cw, chh), Image.LANCZOS, box=(cx - iw / 2 + dx, cy - ih / 2 + dy, cx + iw / 2 + dx, cy + ih / 2 + dy))
    content = content.filter(ImageFilter.UnsharpMask(radius=2, percent=50, threshold=2))
    m, sh, pad = card_mask(cw, chh)
    px, py = (W - cw) // 2, int(p['cy_out'] - chh / 2)
    bg.paste(Image.new('RGB', sh.size, (0, 0, 0)), (px - pad, py - pad), sh)
    bg.paste(content, (px, py), m)
    rim = Image.new('RGBA', (cw, chh), (0, 0, 0, 0))
    ImageDraw.Draw(rim).rounded_rectangle((1, 1, cw - 2, chh - 2), 40, outline=(255, 255, 255, 60), width=3)
    bg.paste(rim, (px, py), rim)
    return bg


# ---------------------------------------------------------------- fonts + sprites
_fonts = {}
def font(name, size):
    if (name, size) not in _fonts: _fonts[name, size] = ImageFont.truetype(os.path.join(FONTS, name), size)
    return _fonts[name, size]


def sprite(text, fnt, color, glow=None, shadow=0.8):
    asc, desc = fnt.getmetrics(); adv = fnt.getlength(text); pad = 44
    size = (int(adv) + 2 * pad, asc + desc + 2 * pad)
    m = Image.new('L', size, 0); ImageDraw.Draw(m).text((pad, pad + asc), text, font=fnt, anchor='ls', fill=255)
    im = Image.new('RGBA', size, (0, 0, 0, 0))
    if shadow:
        sh = Image.new('RGBA', size, (0, 0, 0, 0)); sh.putalpha(m.filter(ImageFilter.GaussianBlur(10)).point(lambda v: int(v * shadow)))
        im.alpha_composite(sh, (0, 6))
    if glow:
        g = Image.new('RGBA', size, glow + (0,)); g.putalpha(m.filter(ImageFilter.GaussianBlur(16)).point(lambda v: int(v * 0.55)))
        im.alpha_composite(g)
    fill = Image.new('RGBA', size, color + (0,)); fill.putalpha(m); im.alpha_composite(fill)
    return dict(img=im, ox=pad, by=pad + asc, adv=adv, asc=asc, font=fnt, color=color, glow=glow)


def put(fr, img, x, y, alpha=1.0, blur=0.0, scale=1.0, angle=0.0):
    """Composite an RGBA sprite at (x, y) (top-left of the unscaled sprite), scaled/rotated about its centre."""
    if scale != 1.0 or angle:
        w0, h0 = img.size
        if scale != 1.0: img = img.resize((max(1, int(w0 * scale)), max(1, int(h0 * scale))), Image.BICUBIC)
        if angle: img = img.rotate(angle, Image.BICUBIC, expand=True)
        x += (w0 - img.size[0]) / 2; y += (h0 - img.size[1]) / 2
    if blur >= 0.5: img = img.filter(ImageFilter.GaussianBlur(float(blur)))
    if alpha < 0.999: img = img.copy(); img.putalpha(img.getchannel('A').point(lambda v: int(v * max(0, alpha))))
    x, y = int(round(x)), int(round(y))
    cx0, cy0 = max(0, -x), max(0, -y)
    if cx0 >= img.size[0] or cy0 >= img.size[1]: return
    if cx0 or cy0: img = img.crop((cx0, cy0, img.size[0], img.size[1])); x += cx0; y += cy0
    if x >= fr.size[0] or y >= fr.size[1]: return
    fr.alpha_composite(img, (x, y))


def pill(text, size=64, gold=True):
    """Tag pill: dark Inter Bold caps on a gold gradient, or white caps on a dark glass pill."""
    fnt = font('Inter-700.ttf', size)
    tw = fnt.getlength(text)
    pw, ph, pad = int(tw + 2 * 0.62 * size), int(size * 1.62), 40
    im = Image.new('RGBA', (pw + 2 * pad, ph + 2 * pad), (0, 0, 0, 0))
    sh = Image.new('L', im.size, 0); ImageDraw.Draw(sh).rounded_rectangle((pad, pad + 10, pad + pw, pad + ph + 10), ph // 2, fill=150)
    im.putalpha(sh.filter(ImageFilter.GaussianBlur(14)))
    bm = Image.new('L', (pw, ph), 0); ImageDraw.Draw(bm).rounded_rectangle((0, 0, pw - 1, ph - 1), ph // 2, fill=255)
    if gold:
        glow = Image.new('L', im.size, 0); ImageDraw.Draw(glow).rounded_rectangle((pad, pad, pad + pw, pad + ph), ph // 2, fill=120)
        gl = Image.new('RGBA', im.size, GOLD + (0,)); gl.putalpha(glow.filter(ImageFilter.GaussianBlur(18))); im.alpha_composite(gl)
        grad = np.linspace(0, 1, ph)[:, None, None]
        body = (np.array([255, 226, 172]) * (1 - grad) + np.array(GOLD_DEEP) * grad) * np.ones((ph, pw, 1))
        im.paste(Image.fromarray(body.astype(np.uint8)), (pad, pad), bm)
        ImageDraw.Draw(im).text((pad + pw / 2, pad + ph / 2 + 2), text, font=fnt, anchor='mm', fill=(26, 18, 10))
    else:
        glass = Image.new('RGBA', (pw, ph), (20, 18, 18, 205)); im.paste(glass, (pad, pad), bm)
        ImageDraw.Draw(im).rounded_rectangle((pad, pad, pad + pw - 1, pad + ph - 1), ph // 2, outline=(255, 255, 255, 90), width=3)
        ImageDraw.Draw(im).text((pad + pw / 2, pad + ph / 2 + 2), text, font=fnt, anchor='mm', fill=(245, 240, 232))
    return dict(img=im, w=pw + 2 * pad, h=ph + 2 * pad, pw=pw, ph=ph, pad=pad)


# ---------------------------------------------------------------- designed-scene ground: warm charcoal + gold light + bokeh
_yy, _xx = np.mgrid[0:H, 0:W].astype(np.float32)
_rad = np.sqrt(((_xx - W * 0.5) / W) ** 2 + ((_yy - H * 0.30) / H) ** 2)
GROUND = (np.array([14, 12, 11], np.float32) * (1 - np.clip(_yy / H, 0, 1))[..., None] +
          np.array([30, 24, 18], np.float32) * np.clip(_yy / H, 0, 1)[..., None] +
          np.array([120, 88, 46], np.float32) * (np.clip(1 - _rad / 0.55, 0, 1) ** 2.2)[..., None])
GROUND = Image.fromarray(GROUND.clip(0, 255).astype(np.uint8))
_rng = np.random.default_rng(5)
BOKEH = [(_rng.uniform(0, W), _rng.uniform(0, H), _rng.uniform(14, 46), _rng.uniform(0.15, 0.5), _rng.uniform(-1, 1)) for _ in range(26)]
_bokeh_cache = {}
def bokeh_sprite(r):
    r = int(r)
    if r not in _bokeh_cache:
        s = Image.new('RGBA', (4 * r, 4 * r), (0, 0, 0, 0))
        m = Image.new('L', s.size, 0); ImageDraw.Draw(m).ellipse((r, r, 3 * r, 3 * r), fill=255)
        c = Image.new('RGBA', s.size, (255, 206, 130, 0)); c.putalpha(m.filter(ImageFilter.GaussianBlur(r * 0.35)))
        _bokeh_cache[r] = c
    return _bokeh_cache[r]


def ground(t):
    fr = GROUND.copy().convert('RGBA')
    for x, y, r, a, v in BOKEH:
        put(fr, bokeh_sprite(r), x + 14 * math.sin(t * 0.3 + v * 3) - 2 * r, (y - 18 * t * (0.6 + v)) % (H + 200) - 100 - 2 * r,
            alpha=a * (0.7 + 0.3 * math.sin(t * 1.3 + v * 5)))
    return fr


def paper(w, h, seed):
    rng = np.random.default_rng(seed)
    low = Image.fromarray((rng.standard_normal((h // 40 + 2, w // 40 + 2)) * 40 + 128).clip(0, 255).astype(np.uint8)).resize((w, h), Image.BICUBIC)
    fine = rng.standard_normal((h, w)).astype(np.float32) * 5
    base = np.array([244, 236, 220], np.float32)
    a = base + (np.asarray(low, np.float32)[..., None] - 128) * np.array([0.10, 0.10, 0.13]) + fine[..., None]
    yy = np.linspace(0, 1, h)[:, None, None]
    a = a * (1 - 0.05 * yy)
    return Image.fromarray(a.clip(0, 255).astype(np.uint8)).convert('RGBA')


def wipe(spr_img, u):
    """Handwriting-style left-to-right reveal of a sprite (u: 0..1)."""
    if u >= 1: return spr_img
    w, h = spr_img.size
    edge = u * (w + 60) - 30
    ramp = np.clip((edge - np.arange(w, dtype=np.float32)) / 30 + 0.5, 0, 1)
    m = Image.fromarray((ramp[None, :].repeat(h, 0) * 255).astype(np.uint8))
    out = spr_img.copy(); out.putalpha(Image.fromarray((np.asarray(spr_img.getchannel('A'), np.float32) * np.asarray(m, np.float32) / 255).astype(np.uint8)))
    return out


def paper_card(page, t_rel, z, ts, angle=-2.2, cy=700):
    """Paper page (RGBA) floating over the ground: drop shadow, slow rotation drift, push-in z."""
    fr = ground(t_rel + ts * 0.0)
    sc = 0.80 * z
    ang = angle + 0.6 * math.sin(t_rel * 0.7)
    pw, ph = page.size
    sh = Image.new('RGBA', (pw + 160, ph + 160), (0, 0, 0, 0))
    m = Image.new('L', sh.size, 0); ImageDraw.Draw(m).rounded_rectangle((80, 110, 80 + pw, 110 + ph), 18, fill=200)
    sh.putalpha(m.filter(ImageFilter.GaussianBlur(34)))
    dx, dy = shake(ts)
    put(fr, sh, W / 2 - sh.size[0] / 2 + dx, cy - sh.size[1] / 2 + dy, scale=sc, angle=ang)
    put(fr, page, W / 2 - pw / 2 + dx, cy - ph / 2 + dy, scale=sc, angle=ang)
    return fr


# ---- scene: the loan book (ledger), 4 stages
LEDGER_W, LEDGER_H = 900, 980
LEDGER_PAPER = paper(LEDGER_W, LEDGER_H, 3)
_d = ImageDraw.Draw(LEDGER_PAPER)
for k in range(9):
    yl = 250 + k * 92
    _d.line((40, yl, LEDGER_W - 40, yl), fill=(150, 170, 200, 150), width=2)
_d.line((118, 40, 118, LEDGER_H - 40), fill=(220, 120, 120, 170), width=3)
LEDGER_PAPER.putalpha(card_mask(LEDGER_W, LEDGER_H, 18)[0])
HAND = 'InstrumentSerif-Italic.ttf'
L_TITLE = sprite('Loans', font(HAND, 128), INK, shadow=0)
L_SUB = sprite('who owes me', font('Inter-600.ttf', 34), (120, 110, 104), shadow=0)
L_ROWS = {   # key: (sprite, x, baseline y) on the page
    'ff':     (sprite('Friends & family', font(HAND, 70), INK, shadow=0), 150, 418),
    'ff_int': (sprite('+ interest', font(HAND, 70), INK_GOLD, shadow=0), 590, 418),
    'dad':    (sprite('Dad', font(HAND, 92), INK, shadow=0), 150, 602),
    'd20':    (sprite('$20', font(HAND, 104), INK, shadow=0), 360, 602),
    'd5':     (sprite('+ $5', font(HAND, 104), INK_GOLD, shadow=0), 540, 602),
}
CHECK_POS = {'ff': (40, 366), 'd20': (40, 546)}
# Stage timings (SOURCE seconds): when each row starts writing. Rows written in an earlier stage are static.
LEDGER_WRITE = {1: [('ff', 760.66), ('ff_int', 761.36)],
                2: [('dad', 796.80), ('d20', 797.94), ('d5', 799.18)]}
LEDGER_TICK = {('ff', 1): 761.80, ('d20', 3): 804.10}
LEDGER_STRIKE = 805.56            # "+ $5" struck red on "interest"
STAMP_T = 840.60                  # FIRST BUSINESS stamp on "first"


def draw_check(fr_page, x, y, u, color, size=56, width=11):
    if u <= 0: return
    pts = [(x, y + size * 0.55), (x + size * 0.38, y + size), (x + size * 1.05, y)]
    d = ImageDraw.Draw(fr_page)
    l1 = math.dist(pts[0], pts[1]); l2 = math.dist(pts[1], pts[2]); L = (l1 + l2) * min(1, u)
    if L <= l1:
        p = (pts[0][0] + (pts[1][0] - pts[0][0]) * L / l1, pts[0][1] + (pts[1][1] - pts[0][1]) * L / l1)
        d.line([pts[0], p], fill=color, width=width, joint='curve')
    else:
        q = (L - l1) / l2
        p = (pts[1][0] + (pts[2][0] - pts[1][0]) * q, pts[1][1] + (pts[2][1] - pts[1][1]) * q)
        d.line([pts[0], pts[1], p], fill=color, width=width, joint='curve')


_stamp = None
def stamp_sprite():
    global _stamp
    if _stamp is None:
        fnt = font('Inter-800.ttf', 74); fnt2 = font('Inter-700.ttf', 34)
        w, h = 640, 250
        m = Image.new('L', (w, h), 0); d = ImageDraw.Draw(m)
        d.rounded_rectangle((8, 8, w - 8, h - 8), 26, outline=255, width=10)
        d.rounded_rectangle((26, 26, w - 26, h - 26), 16, outline=255, width=3)
        d.text((w / 2, 112), 'FIRST BUSINESS', font=fnt, anchor='mm', fill=255)
        d.text((w / 2, 180), 'EST. AGE 15', font=fnt2, anchor='mm', fill=255)
        rng = np.random.default_rng(9)
        grit = (rng.random((h, w)) > 0.16).astype(np.float32)
        a = np.asarray(m, np.float32) * grit * 0.92
        im = Image.new('RGBA', (w, h), (176, 118, 34, 0)); im.putalpha(Image.fromarray(a.astype(np.uint8)))
        _stamp = im
    return _stamp


def ledger_scene(stage, t_rel, z, ts):
    page = LEDGER_PAPER.copy()
    put(page, L_TITLE['img'], 150 - L_TITLE['ox'], 170 - L_TITLE['by'])
    put(page, L_SUB['img'], 470 - L_SUB['ox'], 164 - L_SUB['by'])
    written = {}
    for st, rows in LEDGER_WRITE.items():
        for key, t0 in rows:
            if st < stage: written[key] = 1.0
            elif st == stage: written[key] = max(0.0, (ts - t0) / (0.12 + 0.0011 * L_ROWS[key][0]['adv']))
    for key, u in written.items():
        if u <= 0: continue
        spr, x, by = L_ROWS[key]
        put(page, wipe(spr['img'], min(1, u)), x - spr['ox'], by - spr['by'])
    for (key, st), t0 in LEDGER_TICK.items():
        u = 1.0 if st < stage else ((ts - t0) / 0.28 if st == stage else 0)
        if key in written and u > 0:
            draw_check(page, *CHECK_POS[key], ease_out(u), (178, 128, 46), size=50, width=10)
    if stage >= 3:
        spr, x, by = L_ROWS['d5']
        u = 1.0 if stage > 3 else ease_out((ts - LEDGER_STRIKE) / 0.22)
        if u > 0:
            d = ImageDraw.Draw(page)
            x0, x1, yl = x - 6, x + spr['adv'] + 8, by - 34
            d.line((x0, yl + 4, x0 + (x1 - x0) * u, yl - 6 * u), fill=INK_RED, width=10)
            if u >= 1:
                d.line((x1 + 30, by - 74, x1 + 86, by - 14), fill=INK_RED, width=10)
                d.line((x1 + 86, by - 74, x1 + 30, by - 14), fill=INK_RED, width=10)
    if stage == 4 and ts >= STAMP_T - 0.02:
        u = (ts - STAMP_T) / 0.16
        sc = 1.0 + 0.7 * (1 - ease_out(u))
        st = stamp_sprite()
        put(page, st, LEDGER_W / 2 - st.size[0] / 2, 760 - st.size[1] / 2, alpha=min(1, u * 3 + 0.2), scale=sc, angle=-7)
    return paper_card(page, t_rel, z, ts)


# ---- scene: calendar (they ran out of money / in the middle of the month)
CAL_W, CAL_H = 860, 900
CAL_PAPER = paper(CAL_W, CAL_H, 7)
_cm = card_mask(CAL_W, CAL_H, 26)[0]
_d = ImageDraw.Draw(CAL_PAPER)
_grad = np.linspace(0, 1, 160)[:, None, None]
_band = (np.array([255, 226, 172]) * (1 - _grad) + np.array(GOLD_DEEP) * _grad) * np.ones((160, CAL_W, 1))
CAL_PAPER.paste(Image.fromarray(_band.astype(np.uint8)), (0, 0))
_d.text((CAL_W / 2, 64), 'THIS MONTH', font=font('Inter-800.ttf', 58), anchor='mm', fill=(30, 20, 10))
_d.text((CAL_W / 2, 120), 'allowance day: the 1st', font=font('Inter-500.ttf', 30), anchor='mm', fill=(70, 48, 20))
CAL_X0, CAL_Y0, CELL_W, CELL_H = 50, 250, (CAL_W - 100) / 7, 118
for i, ch in enumerate('SMTWTFS'):
    _d.text((CAL_X0 + CELL_W * (i + 0.5), 208), ch, font=font('Inter-700.ttf', 30), anchor='mm', fill=(130, 118, 108))
CAL_OFF = 2                           # the 1st falls on a Tuesday
def cal_cell(day):
    k = day - 1 + CAL_OFF
    return CAL_X0 + CELL_W * (k % 7), CAL_Y0 + CELL_H * (k // 7)
for day in range(1, 32):
    x, y = cal_cell(day)
    _d.text((x + CELL_W / 2, y + CELL_H / 2), str(day), font=font('Inter-600.ttf', 44), anchor='mm', fill=(52, 46, 54))
CAL_PAPER.putalpha(_cm)
CAL_T0, CAL_MID = 750.14, 752.64       # days tick by from "ran out of money"; the 15th is circled on "middle"


def calendar_scene(t_rel, z, ts):
    page = CAL_PAPER.copy()
    d = ImageDraw.Draw(page)
    days = 14 * smooth((ts - CAL_T0) / (CAL_MID - 0.1 - CAL_T0)) if ts > CAL_T0 else 0
    for day in range(1, 16):
        u = min(1, max(0, days - (day - 1)))
        if u <= 0: break
        x, y = cal_cell(day)
        if day < 15:
            ov = Image.new('RGBA', page.size, (0, 0, 0, 0)); od = ImageDraw.Draw(ov)
            od.line((x + 22, y + CELL_H - 26, x + 22 + (CELL_W - 44) * u, y + 26 + (CELL_H - 52) * (1 - u)), fill=INK_RED + (150,), width=6)
            page.alpha_composite(ov)
    u = (ts - CAL_MID) / 0.36
    if u > 0:
        x, y = cal_cell(15)
        cx, cy, r = x + CELL_W / 2, y + CELL_H / 2, 54
        a1 = -110 + 380 * ease_out(u)
        for wdt, off in ((11, 0), (5, 3)):
            d.arc((cx - r - off, cy - r * 0.9, cx + r + off, cy + r * 0.9 + off), -110, a1, fill=INK_RED, width=wdt)
    return paper_card(page, t_rel, z, ts, angle=1.8, cy=690)


# ---- scene: allowance -> shopping (struck) -> books, stacked tags on a blurred plate of the guest
SPEND_TAGS = [('ALLOWANCE', True, 735.18, None, 640), ('SHOPPING', False, 738.58, 738.98, 860), ('BOOKS', True, 743.66, None, 1080)]
_spend = [(pill(txt, 92, gold), t0, strike, y) for txt, gold, t0, strike, y in SPEND_TAGS]


def spend_scene(t_rel, z, ts):
    img = src_frame(ts)
    fill_w = SH * 9 / 16
    bg = blurred_fill(img, (ANGLES['GUEST']['cx'] - fill_w / 2 / z, 0, ANGLES['GUEST']['cx'] + fill_w / 2 / z, SH), 0.78).convert('RGBA')
    for p, t0, strike, y in _spend:
        if ts < t0: continue
        u = (ts - t0) / (7 / FPS)
        put(bg, p['img'], (W - p['w']) / 2, y - p['h'] / 2 + 30 * (1 - ease_out(u)), min(1, u * 1.8), 8 * (1 - ease_out(u)), 0.6 + 0.4 * back_out(u))
        if strike and ts > strike:
            v = ease_out((ts - strike) / 0.2)
            d = ImageDraw.Draw(bg)
            x0 = (W - p['pw']) / 2 - 24; x1 = x0 + (p['pw'] + 48) * v
            d.line((x0, y + 4, x1, y - 4 * v), fill=RED, width=10)
    return bg


def picture(t):
    s, z = shot_at(t)
    ts = out_to_src(t)
    start, layout, param = s[0], s[1], s[2]
    t_rel = t - src_to_out(start)
    if layout == 'ledger': return ledger_scene(param, t_rel, z, ts).convert('RGB')
    if layout == 'calendar': return calendar_scene(t_rel, z, ts).convert('RGB')
    if layout == 'spend': return spend_scene(t_rel, z, ts).convert('RGB')
    if layout == 'card': return card_layout(src_frame(ts), param, z, t - src_to_out(SHOTS[0][0]), ts)
    if isinstance(param, dict):
        img = src_frame(min(max(ts, param['tmin']), param['tmax'])); angle = param['angle']
    else:
        img = src_frame(ts); angle = param
    return full_layout(img, angle, z, ts)


# ---------------------------------------------------------------- grade / film look (same recipe as gambling)
def curves(c, fade, r_hl, r_sh, g_sh, b_hl, b_sh):
    x = np.arange(256) / 255.0
    y = x - c * np.sin(2 * np.pi * x) / (2 * np.pi)
    y = fade + y * (0.975 - fade)
    hl, sh = x ** 2, (1 - x) ** 2
    return np.stack([y + r_hl * hl + r_sh * sh, y + g_sh * sh, y + b_hl * hl + b_sh * sh]).clip(0, 1).astype(np.float32)


WARM = (curves(0.26, 0.030, 0.035, -0.012, 0.006, -0.040, 0.035), 1.04)
COLD = (curves(0.32, 0.045, -0.035, -0.030, 0.018, 0.030, 0.065), 0.55)
LUMA = np.array([0.2126, 0.7152, 0.0722], np.float32)
VIGNETTE = (1 - 0.24 * (((_xx - W / 2) / (W * 0.62)) ** 2 + ((_yy - H * 0.46) / (H * 0.62)) ** 2) ** 1.3).clip(0.55, 1)[..., None]
_y = np.linspace(0, 1, H, dtype=np.float32)[:, None, None]
SCRIM = 1 - 0.40 * np.clip((_y - 0.52) / 0.24, 0, 1) ** 1.5 * np.clip((0.98 - _y) / 0.12, 0.35, 1)
TOPSCRIM = 1 - 0.35 * np.clip((0.22 - _y) / 0.22, 0, 1) ** 1.2
rng = np.random.default_rng(11)
GRAIN = []
for _ in range(10):
    g = Image.fromarray(((rng.standard_normal((H // 2, W // 2)) * 0.5 + 0.5).clip(0, 1) * 255).astype(np.uint8))
    GRAIN.append((np.asarray(g.resize((W, H), Image.BILINEAR), np.float32) / 255 - 0.5)[..., None])
del _yy, _xx, _rad


def coldness(t):
    a, b, c, d = COLD_OUT_T
    if t < a or t > d: return 0.0
    if t < b: return COLD_MAX * smooth((t - a) / (b - a))
    if t < c: return COLD_MAX
    return COLD_MAX * (1 - smooth((t - c) / (d - c)))


def grade(img, ts, oi, t):
    k = coldness(t)
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
    if t < HEAD_T[1] + 0.3: f = f * (1 - (1 - TOPSCRIM) * head_alpha(t))
    f = f + hit_env(ts, 0, 0.07)
    lum = (f @ LUMA)[..., None]
    f = f + GRAIN[oi % len(GRAIN)] * (0.050 * (1.1 - lum) + 0.012)
    o = (f.clip(0, 1) * 255).astype(np.uint8)
    ca = int(round(hit_env(ts, 1, 0.09)))
    if ca:
        o = o.copy(); o[..., 0] = np.roll(o[..., 0], ca, 1); o[..., 2] = np.roll(o[..., 2], -ca, 1)
    return Image.fromarray(o)


# ---------------------------------------------------------------- words (OUTPUT seconds)
def _norm(w): return re.sub(r"[^a-z0-9'$]", '', w.lower())


def build_words():
    """Match each segment's verified text to the medium.en word timings, clamp into the segment, map to OUTPUT."""
    src = json.load(open(os.path.join(HERE, 'words_src.json')))
    out = []
    for (o, a, b), (_, _, text) in zip(SEG_OUT, SEGMENTS):
        cand = [w for w in src if a - 1.0 <= w[0] <= b + 0.3]
        j = 0
        for tok in text.split():
            while j < len(cand) and _norm(cand[j][2]) != _norm(tok): j += 1
            if j == len(cand): raise SystemExit(f'word {tok!r} not found near {a}')
            s0, s1 = min(max(cand[j][0], a), b - 0.05), min(max(cand[j][1], a + 0.05), b)
            out.append((o + s0 - a, o + s1 - a, tok)); j += 1
    return out


WORDS = build_words()

# Caption chunks over WORDS, in order. Markers: *word keyword (gold serif), !word red keyword,
# ^word letter-assembled keyword, ~word hidden (shown as a giant number or a tag instead). '|' separates chunks.
CHUNKS = """i'm gonna give you ~$20 | but you gotta pay me back | with ~$5 ^interest |
wow i like *that | when i was ~15 | my *dad he would give me | ~allowance | i wasn't into ~shopping | i would just buy ~books |
therefore i *saved most of my money | when my *friends and my *family | they ran *out of money | in the *middle of the month |
they came to me for *money | guess what i *did? | yeah i gave it to them | but they had to pay *interest |
i remember my dad | he *knocked on my room *door | he said *latoya | i need *$20 | i went in my *drawer |
and i started *counting all my money | he said *wait | you still have all those *money? |
so i gave him *$20 | the next time he got *paid | he's giving me allowance | i said *daddy remember | you owe me *$20 |
and plus *$5 for *interest | and he gave me my allowance | and the *$20 | but he !didn't give me back | my !interest |
i'm like !come !on | so that was my *first | entrepreneurial *business | but i didn't know it was called | ^entrepreneurship"""
DISPLAY = {'i': 'I', "i'm": "I'm", 'latoya': 'Latoya', 'entrepreneur': 'entrepreneurial', 'money?': 'money?', 'did?': 'did?'}
SPEND_HIDE_CHUNKS = {'allowance', 'shopping', 'books'}


def parse_chunks():
    chunks, k = [], 0
    for part in CHUNKS.replace('\n', ' ').split('|'):
        toks = part.split()
        if not toks: continue
        items = []
        for tok in toks:
            mark = tok[0] if tok[0] in '*!^~' else ''
            word = tok[1:] if mark else tok
            if _norm(word) != _norm(WORDS[k][2]) and not (word == 'entrepreneurial' and WORDS[k][2] == 'entrepreneur'):
                raise SystemExit(f'chunk word {word!r} != transcript word {WORDS[k][2]!r} (#{k})')
            items.append(dict(i=k, mark=mark, txt=DISPLAY.get(word, word)))
            k += 1
        chunks.append(items)
    if k != len(WORDS): raise SystemExit(f'chunks cover {k} of {len(WORDS)} words')
    return chunks


RUN_FONT, RUN_SIZE = 'Inter-500.ttf', 58
KEY_FONT, KEY_SIZE = 'InstrumentSerif-Italic.ttf', 146
LEAD = 3 / FPS
CAP_Y = 1420
MAX_LINE = 960


def layout_chunk(items):
    words = [dict(w) for w in items if w['mark'] != '~']
    for w in words:
        w['key'] = w['mark'] in '*!^' and w['mark'] != ''
        w['red'] = w['mark'] == '!'
    runs = []
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
                w['space'] = font(KEY_FONT, size).getlength(' ') * 1.6
            lines.append((run, int(size * 0.92)))
        else:
            cur = []
            for w in run:
                f = font(RUN_FONT, RUN_SIZE)
                w['spr'] = sprite(w['txt'], f, (255, 255, 255)); w['space'] = f.getlength(' ')
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


LETTER_IN, LETTER_BLUR, LETTER_SPREAD = 5 / FPS, 14, 0.36
WORD_IN, WORD_BLUR, WORD_RISE = 6 / FPS, 12, (30, 40)
BLOCK_GROW, EXIT_T, EXIT_BLUR, EXIT_GROW = 0.03, 4 / FPS, 9, 0.035
STRIP_Y0, STRIP_H = CAP_Y - 600, 760


def _letters(w):
    spr = w['spr']; fnt = spr['font']; txt = w['txt']; out = []
    idx = [j for j, c in enumerate(txt) if c != ' ']
    order = np.random.default_rng(w['i'] * 7919).permutation(len(idx))
    for k, j in enumerate(idx):
        out.append((sprite(txt[j], fnt, spr['color'], glow=spr['glow']), fnt.getlength(txt[:j]), float(LETTER_SPREAD * order[k] / max(1, len(idx) - 1))))
    return out


CHUNK_ITEMS = parse_chunks()
CHUNK_LAYOUT = []
for items in CHUNK_ITEMS:
    words = layout_chunk(items)
    for w in words:
        if w['mark'] == '^': w['letters'] = _letters(w)
    CHUNK_LAYOUT.append((items[0]['i'], items[-1]['i'], words))


def chunk_window(n):
    a, b, _ = CHUNK_LAYOUT[n]
    t_on = WORDS[a][0] - LEAD
    t_off = WORDS[b][1] + 0.3
    if n + 1 < len(CHUNK_LAYOUT): t_off = min(t_off, WORDS[CHUNK_LAYOUT[n + 1][0]][0] - LEAD)
    return t_on, min(t_off, DUR)


def _sput(strip, img, x, y, alpha, blur, scale=1.0):
    put(strip, img, x, y - STRIP_Y0, alpha, blur, scale)


def draw_captions(fr, t):
    for n, (a, b, words) in enumerate(CHUNK_LAYOUT):
        if not words: continue
        t_on, t_off = chunk_window(n)
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
                    _sput(strip, ls['img'], x0 + dx, y0, min(1, u * 1.5), LETTER_BLUR * (1 - ease_out(u)))
            else:
                u = (t - ts) / WORD_IN
                rise = WORD_RISE[1] if w['key'] else WORD_RISE[0]
                _sput(strip, spr['img'], x0, y0 + rise * (1 - ease_out(u)), min(1, u * 1.6), WORD_BLUR * (1 - ease_out(u)))
        life = smooth((t - t_on) / max(0.3, t_off - t_on))
        e = smooth((t - (t_off - EXIT_T)) / EXIT_T) if t_off < DUR - 0.01 else 0.0
        sc = 1 + BLOCK_GROW * life + EXIT_GROW * e
        if e > 0:
            strip = strip.filter(ImageFilter.GaussianBlur(EXIT_BLUR * e))
            strip.putalpha(strip.getchannel('A').point(lambda v: int(v * (1 - e))))
        cy = CAP_Y - 120 - STRIP_Y0
        sw, sh = int(W * sc), int(STRIP_H * sc)
        strip = strip.resize((sw, sh), Image.BICUBIC)
        ox, oy = int((sw - W) / 2), int(cy * sc - cy)
        fr.alpha_composite(strip.crop((ox, oy, ox + W, oy + STRIP_H)), (0, STRIP_Y0))


# ---------------------------------------------------------------- headline (title banner over the hook) + giant numbers
HEAD_T = (0.05, src_to_out(788.60) + 0.05)
HEAD_LINES = [('At 15, she charged her own dad', 'Inter-600.ttf', 58, (255, 255, 255), None), ('interest', 'InstrumentSerif-Italic.ttf', 150, GOLD, GOLD)]
HEAD_Y = [262, 396]
HEAD_SPR = [sprite(t, font(f, s), c, glow=g) for t, f, s, c, g in HEAD_LINES]


def head_alpha(t):
    return smooth((t - HEAD_T[0]) / 0.35) * (1 - smooth((t - (HEAD_T[1] - 0.25)) / 0.25))


def draw_headline(fr, t):
    if not (HEAD_T[0] <= t < HEAD_T[1]): return
    out = smooth((t - (HEAD_T[1] - 0.25)) / 0.25)
    for k, (spr, by) in enumerate(zip(HEAD_SPR, HEAD_Y)):
        u = (t - HEAD_T[0] - 0.12 * k) / 0.45
        if u <= 0: continue
        put(fr, spr['img'], (W - spr['adv']) / 2 - spr['ox'], by - spr['by'] + 26 * (1 - ease_out(u)) - 20 * out,
            min(1, u * 1.4) * (1 - out), 10 * (1 - ease_out(u)) + 8 * out)


NUM_FONT = 'Inter-800.ttf'
# giant numbers: (source on, source off, text template, count-up target or None, gold, centre y)
NUMBERS = [
    (784.84, 787.22, '${}', 20, False, 1150),      # I'm gonna give you $20
    (787.22, 788.60, '+$5', None, True, 1150),      # ... with $5 interest
    (728.14, 728.66, '{}', 15, True, 1040),         # when I was 15
    (775.80, 776.30, '${}', 20, False, 1040),       # I need $20
]
_num_cache = {}
def num_sprite(text, gold):
    if (text, gold) not in _num_cache:
        _num_cache[text, gold] = sprite(text, font(NUM_FONT, 300), GOLD if gold else (255, 255, 255), glow=GOLD, shadow=0.9)
    return _num_cache[text, gold]


def draw_number(fr, t):
    for s_on, s_off, tpl, target, gold, cy in NUMBERS:
        on, off = src_to_out(s_on) - LEAD - (0.40 if target else 0), src_to_out(s_off)
        if not (on <= t < off): continue
        if target:
            v = int(round(target * ease_out((t - on) / 0.40)))
            txt = tpl.format(v)
        else:
            txt = tpl
        spr = num_sprite(txt, gold)
        u = (t - on) / 0.28
        sc = 0.6 + 0.4 * back_out(u)
        out = smooth((t - (off - 0.12)) / 0.12) if off < DUR - 0.01 else 0
        put(fr, spr['img'], W / 2 - spr['img'].size[0] / 2, cy - spr['img'].size[1] / 2, min(1, u * 2) * (1 - out),
            10 * (1 - ease_out(u)), sc)


# ---------------------------------------------------------------- frame + audio
FADE_OUT = (DUR - 0.35, DUR)


def render_frame(oi):
    t = oi / FPS
    ts = out_to_src(t)
    img = picture(t)
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


SEG_FADES = {8: (0.010, 0.080), 14: (0.010, 0.150)}      # host laugh and the last word get softer tails


def build_audio(path):
    """Kept segments joined with 10 ms fades at every cut, light EQ/compression, -14 LUFS, short end fade."""
    parts, chain = [], []
    for k, (a, b, _) in enumerate(SEGMENTS):
        d = b - a
        fi, fo = SEG_FADES.get(k, (0.010, 0.010))
        chain.append(f'[0:a]atrim={a - EX_A0:.4f}:{b - EX_A0:.4f},asetpts=PTS-STARTPTS,'
                     f'afade=t=in:st=0:d={fi},afade=t=out:st={d - fo:.4f}:d={fo}[s{k}]')
        parts.append(f'[s{k}]')
    fc = ';'.join(chain) + ';' + ''.join(parts) + f'concat=n={len(SEGMENTS)}:v=0:a=1,' + \
        'highpass=f=60,equalizer=f=3000:t=q:w=1.2:g=2,acompressor=threshold=-20dB:ratio=2.5:attack=8:release=120:makeup=2,' + \
        f'loudnorm=I=-14:TP=-1.5:LRA=9,alimiter=limit=0.87:level=0,afade=t=out:st={FADE_OUT[0]:.3f}:d={FADE_OUT[1] - FADE_OUT[0]:.3f},' + \
        f'atrim=0:{N_FRAMES / FPS:.4f}'
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', SRC_A, '-filter_complex', fc, '-ar', '48000', path], check=True)


def main():
    os.makedirs(os.path.join(HERE, 'out'), exist_ok=True)
    print(f'{len(SEGMENTS)} segments, {DUR:.2f} s, {N_FRAMES} frames, {len(WORDS)} words')
    if '--still' in sys.argv:
        want = sorted(int(round(float(x) * FPS)) for x in sys.argv[sys.argv.index('--still') + 1].split(','))
        for oi in want:
            render_frame(oi).save(os.path.join(HERE, f'out/still_{oi / FPS:05.2f}.png'))
        return
    rng_ = None
    if '--range' in sys.argv:           # --range a:b  renders output frames [a, b) to out/part_a.mp4 (no audio)
        a, b = map(int, sys.argv[sys.argv.index('--range') + 1].split(':'))
        rng_ = (a, min(b, N_FRAMES))
        dst = os.path.join(HERE, f'out/part_{a:05d}.mp4')
        enc = subprocess.Popen(['ffmpeg', '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{W}x{H}',
                                '-r', f'{FPS_N}/{FPS_D}', '-i', '-', '-c:v', 'libx264', '-preset', 'slow', '-crf', '20',
                                '-maxrate', '7M', '-bufsize', '14M', '-tune', 'film', '-pix_fmt', 'yuv420p', dst], stdin=subprocess.PIPE)
        for oi in range(*rng_):
            enc.stdin.write(render_frame(oi).tobytes())
        enc.stdin.close(); enc.wait(); return
    if '--mux' in sys.argv:             # join out/part_*.mp4 (from --range runs) with the audio
        audio = os.path.join(HERE, 'out/audio.wav'); build_audio(audio)
        parts = sorted(p for p in os.listdir(os.path.join(HERE, 'out')) if p.startswith('part_'))
        lst = os.path.join(HERE, 'out/parts.txt')
        open(lst, 'w').write(''.join(f"file '{p}'\n" for p in parts))
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', lst, '-i', audio, '-c:v', 'copy',
                        '-color_primaries', 'bt709', '-color_trc', 'bt709', '-colorspace', 'bt709',
                        '-c:a', 'aac', '-b:a', '256k', '-shortest', '-movflags', '+faststart', OUT], check=True)
        print('wrote', OUT); return
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
