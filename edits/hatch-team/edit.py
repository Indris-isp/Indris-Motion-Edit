"""Premium vertical clip from "How to Build a Real Estate Team That Actually Produces" (Hatch Coaching,
1920x1080 single-camera livestream, 184 s), in the house style of `.claude/skills/premium-short-form`
(mode B, visual storytelling). See README.md for the reasoning behind every choice.

    python3 edit.py --plan              -> out/plan.json (timeline, word times, scene cues) + prints the EDL
    node scenes.cjs                     -> out/scenes/<name>/f00000.png ... (designed scenes / overlays)
    python3 edit.py                     -> out/hatch_team_premium_1080x1920.mp4
    python3 edit.py --still 2.0,14.5    -> out/still_*.png (output-time stills)
    parallel: python3 edit.py --range 0:456 & ... (one per core), then python3 edit.py --mux

The clip is assembled from SEGMENTS (word-index ranges of words.json). Inside each segment, pauses longer
than MAX_GAP are cut out. Every cut lands on a change of virtual camera angle, so no jump cut is visible.
"""
import json, math, os, subprocess, sys
import numpy as np, cv2
from PIL import Image, ImageDraw, ImageFont, ImageFilter

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.environ.get('HATCH_SRC', os.path.join(HERE, 'src/hatch_team.mp4'))
OUT_DIR = os.path.join(HERE, 'out')
OUT = os.path.join(OUT_DIR, 'hatch_team_premium_1080x1920.mp4')
FONTS = os.path.join(HERE, '../../video/fonts')
W, H = 1080, 1920
FPS_NUM, FPS_DEN = 30000, 1001                     # same rate as the source (29.97), so frames map 1:1
FPS = FPS_NUM / FPS_DEN
SW, SH = 1920, 1080
WORDS = json.load(open(os.path.join(HERE, 'words.json')))
FACE = json.load(open(os.path.join(HERE, 'analysis/face_track.json')))   # per-source-frame [cx, eye_y] (smoothed)
AMBER = (247, 186, 104)    # the one accent colour (ties to the REL orange in the source)
RED = (255, 84, 70)

# ---------------------------------------------------------------- 1. the cut (word-index ranges)
SEGMENTS = [
    (0, 6),       # Real estate teams in their purest form,      [cut: "in my experience,"]
    (10, 15),     # exist because the leader has ego.
    (123, 130),   # for a real estate team to function well,      [cut: "I think that"]
    (134, 142),   # that ego has to be transformed into a blueprint.
    (226, 248),   # I have a buddy named Matt Miali and he runs this incredible team out of Connecticut, makes great money, high per agent productivity.
    (272, 293),   # What's the secret to your success? And he's like, Eric, this is going to be the most boring conversation that you've had.
    (296, 302),   # Number one, everybody agrees to show up.
    (317, 343),   # And if somebody is not there, every 25 people on the team text that person to say, hey, are you alive? Are you still in real estate?
    (354, 356),   # That's a blueprint,
    (365, 374),   # And then everybody has X number of conversations per week,
    (389, 398),   # And then they're going to add friends to their database.
    (404, 410),   # They're just doing simple things on repeat.
    (458, 461),   # This is the blueprint.
    (462, 465),   # It's not a suggestion.                       [cut: "It's a,"]
    (468, 472),   # you have to do this.
]
MAX_GAP, KEEP_GAP = 0.40, 0.16     # pauses longer than MAX_GAP shrink to ~KEEP_GAP (split into two cuts)
PRE, POST = 0.07, 0.14             # pad before the first / after the last word of a cut
HOLD = {142: .60, 461: .42}        # extra beat after these words (into the natural pause) so a scene can land


def build_cuts():
    """-> list of (src_in, src_out, first_word, last_word); every pause > MAX_GAP becomes a cut."""
    cuts = []
    for a, b in SEGMENTS:
        run = [a]
        for i in range(a + 1, b + 1):
            if WORDS[i]['s'] - WORDS[i - 1]['e'] > MAX_GAP: cuts.append((run[0], i - 1)); run = [i]
            else: run.append(i)
        cuts.append((run[0], b))
    out = []
    for i0, i1 in cuts:
        prev_e = WORDS[i0 - 1]['e'] if i0 > 0 else 0
        next_s = WORDS[i1 + 1]['s'] if i1 + 1 < len(WORDS) else 1e9
        s = max(WORDS[i0]['s'] - PRE, (prev_e + WORDS[i0]['s']) / 2, WORDS[i0]['s'] - KEEP_GAP / 2)
        e = min(WORDS[i1]['e'] + POST, (WORDS[i1]['e'] + next_s) / 2, WORDS[i1]['e'] + KEEP_GAP / 2 + .04)
        if i1 in HOLD: e = min(WORDS[i1]['e'] + POST + HOLD[i1], next_s - .1)
        out.append((s, e, i0, i1))
    return out


CUTS = build_cuts()
# output timeline: each cut starts on a whole output frame
_t, TL = 0, []
for s, e, i0, i1 in CUTS:
    n = int(round((e - s) * FPS))
    TL.append(dict(src_in=s, n=n, o0=_t, i0=i0, i1=i1)); _t += n
N_FRAMES = _t
DUR = N_FRAMES / FPS


def src_time(k):
    """output frame -> (source time, cut index)"""
    for j, c in enumerate(TL):
        if k < c['o0'] + c['n']: return c['src_in'] + (k - c['o0']) / FPS, j
    c = TL[-1]; return c['src_in'] + (c['n'] - 1) / FPS, len(TL) - 1


def out_time(word_i, key='s'):
    """source word -> output time (the word must be inside the edit)"""
    for c in TL:
        if c['i0'] <= word_i <= c['i1']:
            return (c['o0'] + (WORDS[word_i][key] - c['src_in']) * FPS) / FPS
    raise ValueError(f'word {word_i} ({WORDS[word_i]["w"]}) is not in the edit')


def cut_start(j): return TL[j]['o0'] / FPS


# ---------------------------------------------------------------- 2. virtual camera angles
# One locked-off webcam. The angles are 9:16 crops of the clean band of the frame (y 18-1062, above the
# stream border; the burned-in captions at y 838-937 are inpainted). h = crop height in source px,
# eye = where the eye line sits in the crop (0 top, 1 bottom). See analysis/breakdown.md.
ANGLES = {
    'WIDE': dict(h=1040, eye=.50),   # full height: room, art, mic (1.85x upscale)
    'MCU':  dict(h=880, eye=.42),    # chest-up (2.2x)
    'CU':   dict(h=740, eye=.37),    # face + shoulders, the default "punch-in" (2.6x)
    'ECU':  dict(h=650, eye=.36),    # tight punch for the hardest beats (3.0x)
}
SAFE_Y0, SAFE_Y1, SAFE_X0, SAFE_X1 = 18, 1062, 30, 1890

# Shots: (output-time anchor, angle or scene, drift). Anchor = ('w', word index) -> 3 frames before the word
# (cut on the stressed syllable, picture arrives as the ear does) or ('c', cut index) -> exactly on the cut.
# drift = constant push-in over the shot (house rule: never leave a frame static).
SHOTS = [
    (0, 'WIDE', .03),                # Real estate teams in their purest form, exist because  (rack-focus opener)
    (12, 'CU', .05),                 # the leader has EGO
    (123, 'MCU', .03),               # for a real estate team to function well
    (134, 'scene:blueprint', 0),     # that ego has to be transformed into a BLUEPRINT
    (226, 'MCU', .03),               # I have a buddy named Matt Miali and he
    (235, 'WIDE', .04),              # runs this incredible team out of Connecticut, great money, productivity (+tags in headroom)
    (272, 'CU', .04),                # what's the secret to your success?
    (278, 'MCU', .03),               # and he's like, Erik,
    (288, 'ECU', .03),               # most BORING ... (grade drains; the cut after 'boring' flips to CU)
    (296, 'WIDE', .04),              # number one, everybody agrees to SHOW UP (+#1 in the wide shot's headroom)
    (317, 'CU', .03),                # and if somebody is not there,
    (323, 'scene:texts', 0),         # every 25 people on the team text that person: are you alive? ...
    (354, 'MCU', .04),               # that's a blueprint
    (365, 'WIDE', .03),              # and then everybody has
    (369, 'scene:board', 0),         # X number of conversations per week / add friends to their database
    (404, 'MCU', .04),               # they're just doing
    (407, 'CU', .04),                # simple things ON REPEAT  (follow pan: he turns his head on 'repeat')
    (458, 'scene:final', 0),         # This is the blueprint.
    (462, 'ECU', .045),              # It's NOT a suggestion.
    (468, 'CU', .04),                # you have to do this.
]
LEAD_F = 3
FLIP = {'WIDE': 'MCU', 'MCU': 'CU', 'CU': 'MCU', 'ECU': 'CU'}
FOLLOW = {407}                        # shots whose framing pans with the face instead of staying locked
SETTLE_F, SETTLE_Z = 0, .22           # (zoom-settle open: off, the rack-focus opener replaces it)


def anchor_frame(word_i):
    """3 frames before the word (picture arrives as the ear does); exactly on the cut if the word opens one."""
    for c in TL:
        if c['i0'] <= word_i <= c['i1']:
            if word_i == c['i0']: return c['o0']
            return max(c['o0'], int(round(out_time(word_i) * FPS)) - LEAD_F)
    raise ValueError(word_i)


def build_shots():
    """Explicit shots + an automatic angle flip on every cut that doesn't already start a shot."""
    shots = sorted((anchor_frame(a), ang, d) for a, ang, d in SHOTS)
    follow = {anchor_frame(a) for a, _, _ in SHOTS if a in FOLLOW}
    starts = {f for f, _, _ in shots}
    for c in TL[1:]:
        f = c['o0']
        if any(abs(f - s) <= LEAD_F + 1 for s in starts): continue      # a designed cut is already there
        prev = [s for s in shots if s[0] < f][-1]
        if prev[1].startswith('scene:'): continue                       # scenes hide their own cuts
        shots.append((f, FLIP[prev[1]], prev[2])); shots.sort(); starts.add(f)
    return [dict(f0=f, f1=(shots[i + 1][0] if i + 1 < len(shots) else N_FRAMES), view=v, drift=d, follow=f in follow)
            for i, (f, v, d) in enumerate(shots)]


SHOT_LIST = build_shots()


def shot_at(k):
    for s in SHOT_LIST:
        if s['f0'] <= k < s['f1']: return s
    return SHOT_LIST[-1]


def smooth(u): u = min(1, max(0, u)); return u * u * (3 - 2 * u)
def ease_out(u): u = min(1, max(0, u)); return 1 - (1 - u) ** 3


def face_at(src_t):
    i = min(len(FACE) - 1, max(0, int(round(src_t * FPS))))
    return FACE[i]


_shot_face = {}
def shot_face(shot):
    key = shot['f0']
    if key not in _shot_face:
        pts = np.array([face_at(src_time(k)[0]) for k in range(shot['f0'], shot['f1'])])
        _shot_face[key] = tuple(np.median(pts, 0))
    return _shot_face[key]


def crop_box(view, k, src_t, shot):
    a = ANGLES[view]
    p = (k - shot['f0']) / max(1, shot['f1'] - shot['f0'])
    h = a['h'] / (1 + shot['drift'] * p)                    # constant slow push-in
    if k < SETTLE_F: h /= 1 + SETTLE_Z * (1 - ease_out(k / SETTLE_F))
    w = h * 9 / 16
    # framing is locked per shot (a real camera doesn't chase every head bob): median face over the shot
    cx, ey = shot_face(shot)
    if shot['follow']: cx = face_at(src_t)[0]                # operator pan (face track is already smoothed)
    x0 = min(max(cx - w / 2, SAFE_X0), SAFE_X1 - w)
    y0 = min(max(ey - a['eye'] * h, SAFE_Y0), SAFE_Y1 - h)
    return x0, y0, w, h


# ---------------------------------------------------------------- 3. source frames + caption removal
CAP_ROI = (812, 962, 520, 1490)          # y0, y1, x0, x1 of the burned-in caption band


def remove_captions(f):
    """Inpaint the burned-in caption glyphs (white / grey / orange) and their dark outline."""
    y0, y1, x0, x1 = CAP_ROI
    reg = f[y0:y1, x0:x1]
    hsv = cv2.cvtColor(reg, cv2.COLOR_RGB2HSV)
    grey = (hsv[..., 2] > 92) & (hsv[..., 1] < 70)            # white (spoken) + grey (upcoming) words
    orange = (hsv[..., 0] < 22) & (hsv[..., 1] > 140) & (hsv[..., 2] > 150)   # orange keyword
    m = (grey | orange).astype(np.uint8)
    m = cv2.morphologyEx(m, cv2.MORPH_OPEN, np.ones((2, 2), np.uint8))
    if m.sum() < 40: return f
    m = cv2.dilate(m, np.ones((3, 3), np.uint8), iterations=5) * 255
    f = f.copy()
    f[y0:y1, x0:x1] = cv2.inpaint(reg, m, 7, cv2.INPAINT_TELEA)
    return f


class Source:
    """Sequential reader that serves arbitrary increasing source frame indices."""
    def __init__(self):
        self.p = subprocess.Popen(['ffmpeg', '-v', 'error', '-i', SRC, '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'],
                                  stdout=subprocess.PIPE)
        self.i, self.buf = -1, None

    def get(self, idx):
        while self.i < idx:
            b = self.p.stdout.read(SW * SH * 3)
            if len(b) < SW * SH * 3: break
            self.buf = b; self.i += 1
        return np.frombuffer(self.buf, np.uint8).reshape(SH, SW, 3)


def reframe(f, box):
    x0, y0, w, h = box
    sc = H / h
    M = np.float32([[sc, 0, -x0 * sc], [0, sc, -y0 * sc]])
    o = cv2.warpAffine(f, M, (W, H), flags=cv2.INTER_LANCZOS4, borderMode=cv2.BORDER_REFLECT)
    bl = cv2.GaussianBlur(o, (0, 0), 1.6)
    return cv2.addWeighted(o, 1.55, bl, -0.55, 0)           # unsharp: the upscale needs it


# ---------------------------------------------------------------- 4. grade / film look (house look, vice-city)
def curves(c, fade, r_hl, r_sh, g_sh, b_hl, b_sh):
    x = np.arange(256) / 255.0
    y = x - c * np.sin(2 * np.pi * x) / (2 * np.pi)
    y = fade + y * (0.975 - fade)
    hl, sh = x ** 2, (1 - x) ** 2
    return np.stack([y + r_hl * hl + r_sh * sh, y + g_sh * sh, y + b_hl * hl + b_sh * sh]).clip(0, 1).astype(np.float32)


WARM = curves(0.26, 0.030, 0.035, -0.012, 0.006, -0.040, 0.035)
LUMA = np.array([0.2126, 0.7152, 0.0722], np.float32)
yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
VIGNETTE = (1 - 0.24 * (((xx - W / 2) / (W * 0.62)) ** 2 + ((yy - H * 0.44) / (H * 0.62)) ** 2) ** 1.3).clip(0.58, 1)[..., None]
_y = np.linspace(0, 1, H, dtype=np.float32)[:, None, None]
SCRIM = 1 - 0.40 * np.clip((_y - 0.52) / 0.24, 0, 1) ** 1.5 * np.clip((0.99 - _y) / 0.12, 0.35, 1)
rng = np.random.default_rng(7)
GRAIN = [cv2.resize(rng.standard_normal((H // 2, W // 2)).astype(np.float32) * .5, (W, H))[..., None] for _ in range(10)]
del yy, xx
A_ROLL_LIFT = 0.86
LIFT = ((np.arange(256) / 255.0) ** A_ROLL_LIFT * 255).round().astype(np.uint8)
SAT = 1.06


def drain(t):
    """'the most boring conversation': colour drains to near-grey, then comes back."""
    a, b = out_time(289), out_time(293, 'e') + .15
    if t < a - .25 or t > b + .3: return 0.0
    return smooth((t - (a - .25)) / .3) * (1 - smooth((t - b) / .3)) * .85


def grade(img, k, t, lift=True, film=True):
    a = LIFT[img] if lift else img
    f = np.stack([WARM[0][a[..., 0]], WARM[1][a[..., 1]], WARM[2][a[..., 2]]], -1) if film else a.astype(np.float32) / 255
    Y = (f @ LUMA)[..., None]
    sat = SAT * (1 - drain(t))
    f = Y + (f - Y) * sat
    hi = np.clip((Y - 0.62) / 0.38, 0, 1) * f                                 # halation
    glow = cv2.resize(cv2.GaussianBlur(cv2.resize(hi, (W // 8, H // 8)), (0, 0), 6), (W, H))
    f = f + glow * np.array([0.40, 0.27, 0.16], np.float32)
    f = f * VIGNETTE * SCRIM
    lum = (f @ LUMA)[..., None]
    f = f + GRAIN[k % len(GRAIN)] * (0.050 * (1.1 - lum) + 0.012)
    return (f.clip(0, 1) * 255).astype(np.uint8)


# ---------------------------------------------------------------- 5. captions (house animation, vice-city)
_fonts = {}
def font(name, size):
    if (name, size) not in _fonts: _fonts[name, size] = ImageFont.truetype(os.path.join(FONTS, name), size)
    return _fonts[name, size]


RUN_FONT, RUN_SIZE = 'Inter-500.ttf', 58
SWEAR_FONT = 'Inter-700.ttf'
KEY_FONT, KEY_SIZE = 'InstrumentSerif-Italic.ttf', 150
LEAD = 3 / FPS
CAP_Y = 1400
WIDE_CAP_DY = 110                     # in WIDE shots the caption block drops below his chin (still inside the safe zone)
MAX_LINE = 960
DISPLAY = {'Eric,': 'Erik,', 'Miali': 'Miali', '25': '25', 'X': 'X'}
# (first word, last word, keyword indices, red indices). One keyword per beat; red = negative.
# Chunks inside the designed scenes (blueprint / texts / board / final) are omitted: the scene typography
# carries those words. 'Miali' (232) is never shown: the surname spelling is Whisper's guess.
CHUNKS = [
    (0, 2, {1, 2}, set()),            # real / ESTATE TEAMS
    (3, 6, {5, 6}, set()),            # in their / PUREST FORM
    (10, 11, {10}, set()),            # EXIST / because
    (12, 15, {15}, set()),            # the leader has / EGO
    (123, 127, {125, 126, 127}, set()),   # for a / REAL ESTATE TEAM
    (128, 130, {129}, set()),         # to / FUNCTION / well
    (226, 231, {231}, set()),         # i have a buddy named / MATT
    (233, 238, {237}, set()),         # and he runs this / INCREDIBLE / team
    (239, 241, {241}, set()),         # out of / CONNECTICUT
    (242, 244, {243, 244}, set()),    # makes / GREAT MONEY
    (245, 248, {248}, set()),         # high per agent / PRODUCTIVITY
    (272, 277, {274}, set()),         # what's the / SECRET / to your success?
    (278, 281, {281}, set()),         # and he's like, / ERIK,
    (282, 288, set(), set()),         # this is going to be the most
    (289, 293, {289}, set()),         # BORING / conversation that you've had
    (296, 297, {296, 297}, set()),    # NUMBER ONE
    (298, 302, {301, 302}, set()),    # everybody agrees to / SHOW UP
    (317, 322, {321}, {321}),         # and if somebody is / NOT / there
    (354, 356, {356}, set()),         # that's a / BLUEPRINT
    (365, 368, {367}, set()),         # and then / EVERYBODY / has
    (404, 406, set(), set()),         # they're just doing
    (407, 410, {409, 410}, set()),    # simple things / ON REPEAT
    (462, 465, {463}, {463}),         # it's / NOT / a suggestion
    (468, 472, {472}, set()),         # you have to do / THIS
]
LETTER_WORDS = {15, 289, 410}         # only these assemble letter by letter: ego, boring, repeat


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


def clean(w):
    w = DISPLAY.get(w, w)
    return w if w in ('X', '25', 'Erik,', 'Matt', 'Miali', 'Connecticut,', 'Connecticut', 'I', "I'm") else w.lower()


def layout_chunk(i0, i1, keys, reds):
    words = [dict(i=i, txt=clean(WORDS[i]['w']), key=i in keys, red=i in reds) for i in range(i0, i1 + 1)]
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
                acc = RED if w['red'] else AMBER
                w['spr'] = sprite(w['txt'], font(KEY_FONT, size), acc, glow=acc)
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


WORD_IN, WORD_BLUR = 6 / FPS, 12
WORD_RISE = (30, 40)
LETTER_IN, LETTER_BLUR, LETTER_SPREAD = 5 / FPS, 14, 0.40
BLOCK_GROW, EXIT_T, EXIT_BLUR, EXIT_GROW = 0.03, 4 / FPS, 9, 0.035
STRIP_Y0, STRIP_H = CAP_Y - 560, 720
_CL = None


def chunk_layouts():
    global _CL
    if _CL is None:
        _CL = []
        for a, b, k, r in CHUNKS:
            words = layout_chunk(a, b, k, r)
            for w in words:
                w['t'] = out_time(w['i'])
                if w['i'] in LETTER_WORDS:
                    spr = w['spr']; fnt = spr['font']; txt = w['txt']; w['letters'] = []
                    idx = [j for j, c in enumerate(txt) if c != ' ']
                    order = np.random.default_rng(w['i'] * 7919).permutation(len(idx))
                    for kk, j in enumerate(idx):
                        w['letters'].append((sprite(txt[j], fnt, spr['color'], glow=spr['glow']), fnt.getlength(txt[:j]),
                                             float(LETTER_SPREAD * order[kk] / max(1, len(idx) - 1))))
            top = min(w['y'] - w['spr']['asc'] for w in words)
            t_on = out_time(a) - LEAD
            dy = WIDE_CAP_DY if shot_at(int(round((t_on + LEAD) * FPS)))['view'] == 'WIDE' else 0
            _CL.append(dict(words=words, t_on=t_on, t_end=out_time(b, 'e') + .3, cy=(top + CAP_Y) / 2, dy=dy))
        for n, c in enumerate(_CL):
            if n + 1 < len(_CL): c['t_end'] = min(c['t_end'], _CL[n + 1]['t_on'])
    return _CL


def _put(strip, img, x, y, alpha, blur):
    if blur >= 0.5: img = img.filter(ImageFilter.GaussianBlur(float(blur)))
    if alpha < 0.999: img = img.copy(); img.putalpha(img.getchannel('A').point(lambda v: int(v * alpha)))
    strip.alpha_composite(img, (max(0, int(x)), int(y - STRIP_Y0)))


def draw_captions(fr, t):
    for c in chunk_layouts():
        t_on, t_off = c['t_on'], c['t_end']
        if not (t_on <= t < t_off): continue
        strip = Image.new('RGBA', (W, STRIP_H), (0, 0, 0, 0))
        for w in c['words']:
            ts = w['t'] - LEAD
            if t < ts: continue
            spr = w['spr']; x0 = w['x'] - spr['ox']; y0 = w['y'] - spr['by']
            if 'letters' in w:
                for ls, dx, delay in w['letters']:
                    u = (t - ts - delay) / LETTER_IN
                    if u <= 0: continue
                    _put(strip, ls['img'], x0 + dx, y0, min(1, u * 1.5), LETTER_BLUR * (1 - ease_out(u)))
            else:
                u = (t - ts) / WORD_IN
                rise = WORD_RISE[1] if w['key'] else WORD_RISE[0]
                _put(strip, spr['img'], x0, y0 + rise * (1 - ease_out(u)), min(1, u * 1.6), WORD_BLUR * (1 - ease_out(u)))
        life = smooth((t - t_on) / max(0.3, t_off - t_on))
        e = smooth((t - (t_off - EXIT_T)) / EXIT_T)
        sc = 1 + BLOCK_GROW * life + EXIT_GROW * e
        if e > 0:
            strip = strip.filter(ImageFilter.GaussianBlur(EXIT_BLUR * e))
            strip.putalpha(strip.getchannel('A').point(lambda v: int(v * (1 - e))))
        cy = c['cy'] - STRIP_Y0
        sw, sh = int(W * sc), int(STRIP_H * sc)
        strip = strip.resize((sw, sh), Image.BICUBIC)
        ox, oy = int((sw - W) / 2), int(cy * sc - cy)
        fr.alpha_composite(strip.crop((ox, oy, ox + W, oy + STRIP_H)), (0, STRIP_Y0 + c['dy']))
    return fr


# ---------------------------------------------------------------- opener (rack focus over the logo sting)
# The livestream's "REAL ESTATE LIVE" logo sting covers his face from 0.1 to 5.0 s (source). The hook audio
# plays over a rack-focus opener: the same room, heavily blurred (clean footage from BG_SRC on), with the
# title banner + captions; once the logo is gone the real footage pulls focus just before "the leader has ego".
LOGO_END_SRC, BG_SRC = 5.05, 60.0
OPENER_END = (TL[1]['o0'] + (LOGO_END_SRC - TL[1]['src_in']) * FPS) / FPS
FOCUS_T, OPENER_BLUR = .45, 26.0


def opener_blur(t):
    if t < OPENER_END: return OPENER_BLUR
    return OPENER_BLUR * (1 - smooth((t - OPENER_END) / FOCUS_T))

FADE_OUT_T = 0.40



# ---------------------------------------------------------------- 6. designed scenes + overlays (scenes.html)
def scene_plan():
    """Scenes (full-screen, replace the speaker) and overlays (on top of the speaker), with word cues in
    scene-local seconds. Written to out/plan.json for scenes.cjs."""
    def span(view):
        s = [x for x in SHOT_LIST if x['view'] == view][0]; return s['f0'], s['f1']
    def cues(t0, **kw): return {k: round(out_time(*v) - t0 if isinstance(v, tuple) else out_time(v) - t0, 3) for k, v in kw.items()}
    sc = []
    for name, kw in [
        ('blueprint', dict(ego=135, transformed=139, blueprint=142)),
        ('texts', dict(every=323, n25=324, text=329, alive=337, still=338, estate=343)),
        ('board', dict(x=369, week=374, add=394, database=398)),
        ('final', dict(this=458, blueprint=461)),
    ]:
        f0, f1 = span('scene:' + name)
        sc.append(dict(name=name, kind='scene', f0=f0, f1=f1, cues=cues(f0 / FPS, **kw)))
    ov = [
        ('title', 0, int(round((OPENER_END + .3) * FPS)), dict()),
        ('tags', int(round(out_time(239) * FPS)) - 6, int(round((out_time(248, 'e') + .5) * FPS)),
         dict(ct=241, money=243, prod=245)),
        ('rule1', int(round(out_time(296) * FPS)) - 4, int(round((out_time(302, 'e') + .25) * FPS)), dict(show=301)),
    ]
    for name, f0, f1, kw in ov:
        sc.append(dict(name=name, kind='overlay', f0=f0, f1=f1, cues=cues(f0 / FPS, **kw)))
    return sc


SCENES = scene_plan()
_scene_cache = {}


def scene_frame(name, idx):
    p = os.path.join(OUT_DIR, 'scenes', name, f'f{idx:05d}.png')
    if not os.path.exists(p): return None
    return cv2.cvtColor(cv2.imread(p, cv2.IMREAD_UNCHANGED), cv2.COLOR_BGRA2RGBA)


def scenes_at(k):
    return [s for s in SCENES if s['f0'] <= k < s['f1']]


# ---------------------------------------------------------------- 7. render
def render_frame(src, k, bg_src):
    t = k / FPS
    st, _ = src_time(k)
    shot = shot_at(k)
    full = None
    for s in scenes_at(k):
        if s['kind'] == 'scene': full = s
    if full is not None:
        rgba = scene_frame(full['name'], k - full['f0'])
        img = grade(rgba[..., :3], k, t, lift=False, film=False)
    else:
        if t < OPENER_END:
            f = remove_captions(bg_src.get(int(round((BG_SRC + t) * FPS))))
        else:
            f = remove_captions(src.get(int(round(st * FPS))))
        v = reframe(f, crop_box(shot['view'], k, st, shot))
        b = opener_blur(t)
        if b > .3:
            v = cv2.GaussianBlur(v, (0, 0), b)
            v = (v.astype(np.float32) * (1 - .35 * b / OPENER_BLUR)).astype(np.uint8)
        img = grade(v, k, t)
    fr = Image.fromarray(img).convert('RGBA')
    for s in scenes_at(k):
        if s['kind'] == 'overlay':
            o = scene_frame(s['name'], k - s['f0'])
            if o is not None: fr.alpha_composite(Image.fromarray(o))
    fr = draw_captions(fr, t)
    out = np.asarray(fr.convert('RGB'))
    if t > DUR - FADE_OUT_T:
        out = (out.astype(np.float32) * (1 - smooth((t - (DUR - FADE_OUT_T)) / FADE_OUT_T))).astype(np.uint8)
    return out


def build_audio(path):
    """Concatenate the cuts sample-exactly (8 ms raised-cosine joins), then EQ / comp / -14 LUFS / end fade."""
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', SRC, '-t', str(TL[-1]['src_in'] + TL[-1]['n'] / FPS + 1),
                          '-f', 'f32le', '-ac', '2', '-ar', '48000', '-'], capture_output=True, check=True).stdout
    a = np.frombuffer(raw, np.float32).reshape(-1, 2)
    xf = int(0.008 * 48000); ramp = (0.5 - 0.5 * np.cos(np.linspace(0, np.pi, xf)))[:, None].astype(np.float32)
    parts = []
    for c in TL:
        s0 = int(round(c['src_in'] * 48000)); n = int(round(c['n'] / FPS * 48000))
        seg = a[s0:s0 + n].copy()
        seg[:xf] *= ramp; seg[-xf:] *= ramp[::-1]
        parts.append(seg)
    pcm = np.concatenate(parts)
    tmp = path + '.raw.wav'
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'f32le', '-ac', '2', '-ar', '48000', '-i', '-', tmp],
                   input=pcm.tobytes(), check=True)
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', tmp, '-af',
                    'highpass=f=70,equalizer=f=220:t=q:w=1:g=-1.5,equalizer=f=3200:t=q:w=1.2:g=2.5,'
                    'acompressor=threshold=-21dB:ratio=2.6:attack=6:release=110:makeup=2,'
                    'loudnorm=I=-14:TP=-1.5:LRA=8,alimiter=limit=0.87:level=0,'
                    f'afade=t=out:st={DUR - FADE_OUT_T:.3f}:d={FADE_OUT_T}', '-ar', '48000', path], check=True)
    os.remove(tmp)


def print_edl():
    print(f'{len(TL)} cuts, {N_FRAMES} frames, {DUR:.2f} s')
    for j, c in enumerate(TL):
        txt = ' '.join(WORDS[i]['w'] for i in range(c['i0'], c['i1'] + 1))
        print(f"cut {j:2d}  out {c['o0'] / FPS:6.2f}-{(c['o0'] + c['n']) / FPS:6.2f}  src {c['src_in']:7.2f}-{c['src_in'] + c['n'] / FPS:7.2f}  {txt}")
    print('shots:')
    for s in SHOT_LIST:
        print(f"  {s['f0'] / FPS:6.2f}-{s['f1'] / FPS:6.2f}  ({(s['f1'] - s['f0']) / FPS:4.2f}s)  {s['view']}")


def main():
    os.makedirs(OUT_DIR, exist_ok=True)
    if '--plan' in sys.argv:
        json.dump(dict(fps=FPS, frames=N_FRAMES, dur=DUR, scenes=SCENES,
                       cuts=[dict(c, src_out=c['src_in'] + c['n'] / FPS) for c in TL],
                       shots=[dict(s, t0=s['f0'] / FPS, t1=s['f1'] / FPS) for s in SHOT_LIST]),
                  open(os.path.join(OUT_DIR, 'plan.json'), 'w'), indent=1)
        print_edl(); return
    if '--still' in sys.argv:
        want = sorted(int(round(float(x) * FPS)) for x in sys.argv[sys.argv.index('--still') + 1].split(','))
        src, bg = Source(), Source()
        for k in want:
            Image.fromarray(render_frame(src, k, bg)).save(os.path.join(OUT_DIR, f'still_{k / FPS:05.2f}.png'))
        return
    if '--mux' in sys.argv:            # join the --range parts + the audio into the final file
        parts = sorted(f for f in os.listdir(OUT_DIR) if f.startswith('part_') and f.endswith('.mp4'))
        lst = os.path.join(OUT_DIR, 'parts.txt')
        open(lst, 'w').write(''.join(f"file '{p}'\n" for p in parts))
        audio = os.path.join(OUT_DIR, 'audio.wav'); build_audio(audio)
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', lst, '-i', audio, '-c:v', 'copy',
                        '-c:a', 'aac', '-b:a', '256k', '-shortest', '-movflags', '+faststart', OUT], check=True)
        for p in parts: os.remove(os.path.join(OUT_DIR, p))
        os.remove(lst); print('wrote', OUT); return
    k0, k1 = 0, N_FRAMES
    if '--range' in sys.argv:
        k0, k1 = map(int, sys.argv[sys.argv.index('--range') + 1].split(':'))
    part = os.path.join(OUT_DIR, f'part_{k0:05d}.mp4') if '--range' in sys.argv else None
    if part is None:
        audio = os.path.join(OUT_DIR, 'audio.wav'); build_audio(audio)
    args = ['ffmpeg', '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{W}x{H}',
            '-framerate', f'{FPS_NUM}/{FPS_DEN}', '-i', '-']
    if part is None: args += ['-i', audio]
    args += ['-c:v', 'libx264', '-preset', 'slow', '-crf', '18', '-tune', 'film', '-pix_fmt', 'yuv420p',
             '-color_primaries', 'bt709', '-color_trc', 'bt709', '-colorspace', 'bt709']
    args += (['-c:a', 'aac', '-b:a', '256k', '-shortest', '-movflags', '+faststart', OUT] if part is None else [part])
    enc = subprocess.Popen(args, stdin=subprocess.PIPE)
    src, bg = Source(), Source()
    for k in range(k0, k1):
        enc.stdin.write(render_frame(src, k, bg).tobytes())
        if k % 60 == 0: print(f'{k / FPS:5.1f}s', flush=True)
    enc.stdin.close(); enc.wait()
    print('wrote', part or OUT)


if __name__ == '__main__':
    main()
