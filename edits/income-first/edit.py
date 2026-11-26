"""Premium vertical clip: "Find income first" (How They Started podcast, host question at 51:24, guest answer to 52:29).

House style: `.claude/skills/premium-short-form` (mode B, visual storytelling), same look as edits/gambling.

    python3 edit.py                     -> out/income_first_1080x1920.mp4
    python3 edit.py --still 3.0,20.5    -> out/still_*.png (output-time stills for a quick look)

Source: `src/excerpt_3080-3156.mp4` is a frame-exact excerpt of the 58-min multi-cam episode
(1280x720, 23.976 fps; excerpt frame k = source time EX_V0 + k / FPS), and `src/host_react_3202.mp4` is a
frame-exact excerpt of the episode's side-by-side two-shot at 53:22-53:25 (the host listening and smiling while
the guest talks), used for one reaction cutaway. All timing constants below are in SOURCE seconds (the
full-episode timeline), so they can be checked against the full transcript.

Edit: SEGMENTS are the kept audio/video ranges (an "uh", "from whatever it is", "whatever it is", "whatever",
"especially if you've got families", a breath/"mm" and every pause over 0.3 s inside the answer removed; each
removed pause leaves 0.12 s). Each output frame maps to one source time; the picture comes from SHOTS (one per
beat), which reframe the episode's own camera angles to 9:16 (shot starts are aligned to the episode's own
camera cuts, so a reframe always matches the angle on screen):
  HOST        interviewer, brick wall
  G_FRONT     guest, straight-on medium shot
  G_SIDE      guest, blue-lit 3/4 side angle
  HOST_R      the interviewer's half of the two-shot (reaction cutaway, from host_react_3202.mp4)
plus 'card' (a crop of the episode or of a B-roll clip in a rounded card over a blurred fill), full-bleed B-roll
('bfull', Mixkit, see src/broll/CREDITS.md) and 'ticket' (a designed lottery-ticket graphic over the blurred guest).
"""
import json, math, os, subprocess, sys
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter

HERE = os.path.dirname(os.path.abspath(__file__))
SRC_V = os.path.join(HERE, 'src/excerpt_3080-3156.mp4')
SRC_A = os.path.join(HERE, 'src/excerpt_audio.flac')
SRC_R = os.path.join(HERE, 'src/host_react_3202.mp4')
EX_A0 = 3080.0                      # source time of the first audio sample in the excerpt
EX_V0 = 73846 * 1001 / 24000        # source time of excerpt frame 0 (3079.9936)
HR_V0 = 76773 * 1001 / 24000        # source time of host_react frame 0 (3202.0739)
OUT = os.path.join(HERE, 'out/income_first_1080x1920.mp4')
FONTS = os.path.join(HERE, '../../video/fonts')
W, H = 1080, 1920
FPS_N, FPS_D = 24000, 1001
FPS = FPS_N / FPS_D
SW, SH = 1280, 720
GOLD = (243, 214, 160)
RED = (255, 84, 70)

# ---------------------------------------------------------------- the cut (source seconds)
SEGMENTS = [
    (3084.300, 3089.285),   # HOST: And what message would you give people who are watching this and who want to get into acting?
                            #       [cut: producing, putting together their own feature film, what kind of advice ... getting into it?]
    (3095.450, 3100.930),   # GUEST: So my advice to anybody who wants to play this game is find something
    (3101.050, 3103.750),   #        that brings you income first.
    (3104.830, 3105.925),   # [cut "uh"] If you can
    (3106.045, 3107.200),   # find a way to
    (3107.320, 3109.190),   # have those checks rolling in       [cut: from whatever it is,]
    (3110.130, 3112.800),   # you get into real estate, you get in the stock market,      [cut: whatever it is,]
    (3113.595, 3114.485),   # you find a
    (3114.605, 3115.870),   # full-time job,                     [cut: whatever,]
    (3116.410, 3119.125),   # that brings the money in,
    (3119.245, 3120.850),   # then pursue this.
    (3121.000, 3125.710),   # Because if you are going to be what I call one of those starving actors,
    (3125.830, 3128.985),   # I mean, you're better off buying a lottery ticket.
    (3129.105, 3129.575),   # [host, audio only: "Yeah."]
    (3129.695, 3132.855),   # So don't do that to yourselves. Don't do that to your families,   [cut: especially if you've got families.]
    (3133.940, 3134.935),   # I've seen actors
    (3135.055, 3137.085),   # make their
    (3137.205, 3139.100),   # families suffer,
    (3139.220, 3141.250),   # pursuing their dream, we'll call it.       [cut: breath / host "mm"]
    (3142.580, 3143.720),   # No, don't do that.
    (3144.620, 3149.450),   # This industry is not going to take care of you in that way.   (conclusion; host "100%" not used)
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
    'HOST':       dict(cx=650, fy=190),     # measured on this window's frames (the guest sits further right here
    'G_FRONT':    dict(cx=715, fy=190),     #  than in the gambling excerpt)
    'G_SIDE':     dict(cx=665, fy=195),
    'HOST_R':     dict(cx=945, fy=200),     # interviewer's half of the two-shot (x 652-1280)
}
# Episode camera cuts inside the window (source s): HOST ..3095.30 | G_FRONT ..3104.02 | G_SIDE ..3119.37 |
# G_FRONT ..3129.75 | G_SIDE ..3132.46 | G_FRONT ..3149.15
# Shot list, source seconds: (start, layout, param, [(t, zoom), ...]).  Hard cut at every start.
#   full   -> 9:16 reframe of the angle 'param' (zoom 1 = full source height)
#   xfull  -> 9:16 reframe of the host-reaction excerpt; param = (angle, source time of its first frame)
#   card   -> param dict: a (cw x ch) crop around (cx, cy) of the episode (or of B-roll clip 'src') shown in a
#             rounded card of 'size' centred at y = cy_out, over a blurred fill; pops in at 'pop' (default: shot start)
#   bfull  -> full-bleed 9:16 B-roll clip 'param'
#   ticket -> the lottery-ticket graphic over the blurred guest
HOST_CARD = dict(cx=612, cy=360, cw=576, ch=720, size=(900, 1125), cy_out=1010, pop=3084.30)
BCARD = dict(cx=640, cy=360, cw=720, ch=720, size=(920, 920), cy_out=800)
SHOTS = [
    (3084.300, 'card', HOST_CARD,    [(3084.30, 1.12), (3084.90, 1.00), (3086.06, 1.03)]),   # and what MESSAGE would you give people   (host card under the title)
    (3086.060, 'card', HOST_CARD,    [(3086.06, 1.26), (3087.39, 1.30)]),                    # who are watching this and                 (punch-in inside the card)
    (3087.390, 'full', 'HOST',       [(3087.39, 1.10), (3089.29, 1.16)]),                    # who want to get into ACTING?              (full-screen host)
    (3095.450, 'full', 'G_FRONT',    [(3095.45, 1.00), (3098.66, 1.05)]),                    # so my ADVICE to anybody who wants to PLAY THIS GAME
    (3098.660, 'full', 'G_FRONT',    [(3098.66, 1.26), (3102.12, 1.31)]),                    # is find something that brings you        (punch-in hides the pause cut)
    (3102.120, 'full', 'G_FRONT',    [(3102.12, 1.52), (3103.75, 1.57)]),                    # INCOME FIRST                              (tight: the thesis)
    (3104.830, 'full', 'G_SIDE',     [(3104.83, 1.00), (3108.18, 1.06)]),                    # if you can find a way to have those       (new side)
    (3108.180, 'card', dict(BCARD, src='cash_counter', size=(960, 740), cw=880, ch=680, gain=1.05),
               [(3108.18, 1.00), (3109.19, 1.05)]),                                          # CHECKS ROLLING IN                         (B-roll card)
    (3110.130, 'card', dict(BCARD, src='house_keys'), [(3110.13, 1.00), (3111.42, 1.06)]),    # you get into REAL ESTATE                  (B-roll card)
    (3111.420, 'card', dict(BCARD, src='stocks', gain=1.25), [(3111.42, 1.00), (3112.80, 1.07)]),  # you get in the STOCK MARKET       (B-roll card)
    (3113.595, 'bfull', 'typing',    [(3113.60, 1.00), (3115.87, 1.08)]),                    # you find a FULL-TIME JOB                  (full-bleed vertical B-roll)
    (3116.410, 'full', 'G_SIDE',     [(3116.41, 1.30), (3119.37, 1.35)]),                    # that brings the MONEY in, then           (punch-in)
    (3119.370, 'full', 'G_FRONT',    [(3119.37, 1.06), (3120.85, 1.09)]),                    # PURSUE this                              (episode cut to front)
    (3121.000, 'full', 'G_FRONT',    [(3121.00, 1.00), (3124.28, 1.05)]),                    # because if you are going to be what I call one of those
    (3124.280, 'card', dict(BCARD, src='empty_wallet', cx=560), [(3124.28, 1.00), (3125.71, 1.07)]),  # STARVING ACTORS        (B-roll card)
    (3125.830, 'full', 'G_FRONT',    [(3125.83, 1.30), (3128.34, 1.36)]),                    # I mean, you're better off buying a        (punch-in)
    (3128.340, 'ticket', None,       [(3128.34, 1.00), (3129.75, 1.04)]),                    # LOTTERY TICKET   [+ host "Yeah." audio]   (designed graphic)
    (3129.750, 'full', 'G_SIDE',     [(3129.75, 1.00), (3131.62, 1.04)]),                    # so DON'T do that to yourselves           (episode cut to side)
    (3131.620, 'full', 'G_SIDE',     [(3131.62, 1.30), (3132.46, 1.33)]),                    # don't do that to your                     (punch-in)
    (3132.460, 'full', 'G_FRONT',    [(3132.46, 1.40), (3132.86, 1.42)]),                    # FAMILIES                                  (episode cut to front, tight)
    (3133.940, 'full', 'G_FRONT',    [(3133.94, 1.00), (3137.09, 1.05)]),                    # I've seen actors make their
    (3137.205, 'full', 'G_FRONT',    [(3137.21, 1.50), (3139.10, 1.56)]),                    # families SUFFER                           (tightest: emotion on the face)
    (3139.220, 'xfull', ('HOST_R', 3203.10), [(3139.22, 1.06), (3141.25, 1.12)]),          # pursuing their DREAM, we'll call it       (host reaction cutaway)
    (3142.580, 'full', 'G_FRONT',    [(3142.58, 1.14), (3143.72, 1.17)]),                    # no, DON'T do that
    (3144.620, 'full', 'G_FRONT',    [(3144.62, 1.00), (3146.96, 1.06)]),                    # this INDUSTRY is not going to
    (3146.960, 'full', 'G_FRONT',    [(3146.96, 1.32), (3149.45, 1.40)]),                    # TAKE CARE OF YOU in that way              (the conclusion, held to the end)
]
STACK = dict(top=(0, 640, 34), bottom=(640, 1280, 86))     # (x0, x1, crop top y) of the guest / host halves
# hits, source seconds: (t, flash, rgb_split_px, shake_px)
HITS = [(3102.14, 0.10, 0, 0), (3108.20, 0.07, 0, 0), (3128.36, 0.16, 6, 6), (3138.18, 0.0, 9, 2),
        (3146.98, 0.06, 0, 0)]
# grade turns cold through the "families suffer" beat and warms back for the conclusion
FREEZE_AFTER = 3149.10
COLD_IN, COLD_OUT, COLD_MAX = (3133.7, 3134.3), (3144.3, 3144.9), 0.6

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
REACT = Reader(SRC_R, SW, SH)
FULL_BROLL = {'typing'}                 # B-roll that is already vertical 1080x1920
_broll = {}
def broll_frame(name, start_src, ts):
    if name not in _broll:
        _broll[name] = Reader(os.path.join(HERE, f'src/broll/{name}.mp4'), *((W, H) if name in FULL_BROLL else (1280, 720)))
    return _broll[name].frame(int(round((src_to_out(ts) - src_to_out(start_src)) * FPS)))


def react_frame(start_src, r0, ts):
    """Host-reaction excerpt: plays from source time r0 when the shot starts, in output time."""
    return REACT.frame(int(round((r0 + src_to_out(ts) - src_to_out(start_src) - HR_V0) * FPS)))


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


def make_ticket():
    """Designed lottery ticket (scene C-type metaphor): cream paper, gold rim, perforated stub, number balls,
    a silver scratch panel. Drawn once at 2x and downsampled."""
    ss, tw, th = 2, 860, 430
    im = Image.new('RGBA', (tw * ss, th * ss), (0, 0, 0, 0))
    body = Image.new('L', im.size, 0)
    d = ImageDraw.Draw(body); d.rounded_rectangle((0, 0, tw * ss - 1, th * ss - 1), 34 * ss, fill=255)
    stub_x = 220 * ss
    for cy in (0, th * ss): d.ellipse((stub_x - 26 * ss, cy - 26 * ss, stub_x + 26 * ss, cy + 26 * ss), fill=0)   # notches
    grad = np.linspace(0, 1, th * ss)[:, None, None]
    paper = (np.array([250, 240, 214]) * (1 - grad) + np.array([236, 214, 166]) * grad) * np.ones((th * ss, tw * ss, 1))
    im.paste(Image.fromarray(paper.astype(np.uint8)), (0, 0), body)
    d = ImageDraw.Draw(im)
    d.rounded_rectangle((14 * ss, 14 * ss, (tw - 14) * ss, (th - 14) * ss), 26 * ss, outline=(196, 150, 72), width=4 * ss)
    for y in range(40 * ss, (th - 36) * ss, 22 * ss):                                    # perforation
        d.line((stub_x, y, stub_x, y + 11 * ss), fill=(170, 130, 70), width=3 * ss)
    red, ink = (179, 38, 30), (58, 40, 22)
    stub_f = ImageFont.truetype(os.path.join(FONTS, 'Inter-800.ttf'), 46 * ss)
    st = Image.new('RGBA', (300 * ss, 80 * ss), (0, 0, 0, 0))
    ImageDraw.Draw(st).text((150 * ss, 40 * ss), 'No. 0451', font=stub_f, anchor='mm', fill=ink)
    st = st.rotate(90, expand=True, resample=Image.BICUBIC)
    im.alpha_composite(st, (int(110 * ss - st.width / 2), int(th * ss / 2 - st.height / 2)))
    cx = (stub_x + (tw - 14) * ss) // 2
    d.text((cx, 96 * ss), 'LOTTERY', font=ImageFont.truetype(os.path.join(FONTS, 'Inter-800.ttf'), 92 * ss), anchor='mm', fill=red)
    d.text((cx, 158 * ss), 'T I C K E T', font=ImageFont.truetype(os.path.join(FONTS, 'Inter-600.ttf'), 34 * ss), anchor='mm', fill=ink)
    nf = ImageFont.truetype(os.path.join(FONTS, 'Inter-700.ttf'), 34 * ss)
    for k, n in enumerate(['07', '14', '23', '38', '41']):
        bx, by, r = cx + (k - 2) * 92 * ss, 236 * ss, 36 * ss
        d.ellipse((bx - r, by - r, bx + r, by + r), fill=(255, 252, 240), outline=(196, 150, 72), width=4 * ss)
        d.text((bx, by + 1 * ss), n, font=nf, anchor='mm', fill=ink)
    sx0, sy0, sx1, sy1 = cx - 230 * ss, 300 * ss, cx + 230 * ss, 382 * ss
    sg = np.linspace(0, 1, sx1 - sx0)[None, :, None]
    silver = (np.array([214, 216, 222]) * (1 - sg) + np.array([160, 164, 172]) * sg) * np.ones((sy1 - sy0, sx1 - sx0, 1))
    sm = Image.new('L', (sx1 - sx0, sy1 - sy0), 0); ImageDraw.Draw(sm).rounded_rectangle((0, 0, sx1 - sx0 - 1, sy1 - sy0 - 1), 16 * ss, fill=255)
    im.paste(Image.fromarray(silver.astype(np.uint8)), (sx0, sy0), sm)
    d.text((cx, (sy0 + sy1) // 2), 'SCRATCH HERE', font=ImageFont.truetype(os.path.join(FONTS, 'Inter-700.ttf'), 30 * ss), anchor='mm', fill=(98, 100, 108))
    im = im.resize((tw, th), Image.LANCZOS)
    pad = 70                                                                               # soft drop shadow
    out = Image.new('RGBA', (tw + 2 * pad, th + 2 * pad), (0, 0, 0, 0))
    sh = Image.new('RGBA', out.size, (0, 0, 0, 0)); sh.putalpha(Image.new('L', out.size, 0))
    shm = Image.new('L', out.size, 0); shm.paste(im.getchannel('A').point(lambda v: int(v * 0.7)), (pad, pad + 26))
    sh.putalpha(shm.filter(ImageFilter.GaussianBlur(24)))
    out.alpha_composite(sh); out.alpha_composite(im, (pad, pad))
    return out


TICKET = make_ticket()


def ticket_layout(img, z, t_in, ts):
    """The ticket pops in over the blurred, darkened guest shot, tilted, drifting and slowly pushing in."""
    bg = blurred_fill(img, (SW / 2 - SH * 9 / 32, 0, SW / 2 + SH * 9 / 32, SH))
    u = (src_to_out(ts) - src_to_out(t_in))
    p = back_out(u / 0.32, 1.6)
    sc = (0.55 + 0.45 * p) * z * 0.94
    ang = -9 + 4 * ease_out(u / 0.5) + 0.8 * math.sin(u * 2.4)
    t = TICKET.resize((int(TICKET.width * sc), int(TICKET.height * sc)), Image.BICUBIC).rotate(ang, expand=True, resample=Image.BICUBIC)
    dx, dy = shake(ts)
    bg.paste(t, (int(W / 2 - t.width / 2 + dx), int(860 - t.height / 2 - 14 * u + dy)), t)
    return bg


def picture(ts):
    s, z = shot_at(ts)
    start, layout, param = s[0], s[1], s[2]
    if layout == 'bfull':
        b = broll_frame(param, start, ts)
        cw, ch = W / z, H / z
        return b.resize((W, H), Image.BICUBIC, box=((W - cw) / 2, (H - ch) / 2, (W + cw) / 2, (H + ch) / 2)), False
    if layout == 'xfull':
        return full_layout(react_frame(start, param[1], ts), param[0], z, ts), True
    if layout == 'card' and 'src' in param:
        img = broll_frame(param['src'], start, ts)
    else:
        img = SRC.frame(int(round((min(ts, FREEZE_AFTER) - EX_V0) * FPS)))   # hold the guest's last frame (episode cuts to the host at 3149.15)
    if layout == 'ticket': return ticket_layout(img, z, start, ts), False
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
DISPLAY = {'i': 'I', "i've": "I've"}
HIDE = set()
# (first word, last word, keyword indices, red indices, style)   -- word indices into words_src.json
CHUNKS = [
    (0, 6, {2}, set(), ''),               # and what / MESSAGE / would you give people      (HOST)
    (7, 11, set(), set(), ''),            # who are watching this and
    (12, 17, {17}, set(), ''),            # who want to get into / ACTING?
    (18, 22, {20}, set(), ''),            # so my / ADVICE / to anybody                     (GUEST)
    (23, 28, {26, 27, 28}, set(), ''),    # who wants to / PLAY THIS GAME
    (29, 34, set(), set(), ''),           # is find something that brings you
    (35, 36, {35, 36}, set(), ''),        # INCOME FIRST                                   (thesis; letters assemble)
    (37, 42, set(), set(), ''),           # if you can find a way
    (43, 45, set(), set(), ''),           # to have those
    (46, 48, {46, 47, 48}, set(), ''),    # CHECKS ROLLING IN
    (49, 53, {52, 53}, set(), ''),        # you get into / REAL ESTATE
    (54, 59, {58, 59}, set(), ''),        # you get in the / STOCK MARKET
    (60, 64, {63, 64}, set(), ''),        # you find a / FULL-TIME JOB
    (65, 69, {68}, set(), ''),            # that brings the / MONEY / in
    (70, 72, {71}, set(), ''),            # then / PURSUE / this
    (73, 79, set(), set(), ''),           # because if you are going to be
    (80, 85, set(), set(), ''),           # what I call one of those
    (86, 87, {86, 87}, {86}, ''),         # STARVING (red) ACTORS
    (88, 94, set(), set(), ''),           # I mean, you're better off buying a
    (95, 96, {95, 96}, set(), ''),        # LOTTERY TICKET                                 (letters assemble, over the ticket)
    (97, 102, {98}, {98}, ''),            # so / DON'T (red) / do that to yourselves
    (103, 108, {108}, set(), ''),         # don't do that to your / FAMILIES
    (109, 112, set(), set(), ''),         # I've seen actors make
    (113, 115, {115}, {115}, ''),         # their families / SUFFER (red)
    (116, 121, {118}, set(), ''),         # pursuing their / DREAM / we'll call it
    (122, 125, {123}, {123}, ''),         # no, / DON'T (red) / do that
    (126, 131, {127}, set(), ''),         # this / INDUSTRY / is not going to
    (132, 138, {132, 133, 134, 135}, set(), ''),   # TAKE CARE OF YOU / in that way   (the conclusion)
]
LETTER_WORDS = {35, 95}                   # income, lottery: assemble letter by letter


def clean(w):
    w = w.strip(',.?!')
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
                sc = 1.0
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
HEAD_T = (0.05, 3.05)                 # output seconds: on while the host is in the card (ends at the full-screen punch-in)
HEAD_LINES = [('The acting advice', 'Inter-600.ttf', 62, (255, 255, 255), None), ('nobody wants to hear', 'InstrumentSerif-Italic.ttf', 112, GOLD, GOLD)]
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


# ---------------------------------------------------------------- frame + audio
FADE_OUT = (DUR - 0.30, DUR)


def render_frame(oi):
    t = oi / FPS
    ts = out_to_src(t)
    img, is_src = picture(ts)
    img = grade(img, ts, oi, t)
    fr = img.convert('RGBA')
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
