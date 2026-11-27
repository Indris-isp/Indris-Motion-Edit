"""Dad-interest v3: rebuilt on the client-reviewed production kit (edits/income-first/v2): face-tracked A-roll,
lit 3D worlds with depth of field (scenes_di.js on the kit's makeStudio), text behind the speaker (MODNet roto),
whips into the designed beats, film grade, grain, SFX from the client's library.

    python3 raw_cut.py                 ../out/dad_interest_RAW_1080x1920.mp4 (face-tracked A-roll; its timeline = output timeline)
    python3 build.py plan              out/plan.json (scene list + word cues + caption chunks for scenes.cjs)
    node scenes.cjs                    designed scenes / overlays -> out/scenes/<name>/f*.png
    python3 build.py compose           ../out/dad_interest_premium_1080x1920.mp4
    python3 build.py --still 2.0,10.5  out/still_*.png (output seconds)
"""
import json, os, subprocess, sys
import numpy as np, cv2

HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(HERE)
RAW = os.path.join(ROOT, 'out/dad_interest_RAW_1080x1920.mp4')
OUT = os.path.join(ROOT, 'out/dad_interest_premium_1080x1920.mp4')
W, H = 1080, 1920
FPS_N, FPS_D = 24000, 1001; FPS = FPS_N / FPS_D
_argv = sys.argv; sys.argv = ['edit.py']
import importlib.util
_spec = importlib.util.spec_from_file_location('edit', os.path.join(ROOT, 'edit.py')); E = importlib.util.module_from_spec(_spec); _spec.loader.exec_module(E)
sys.argv = _argv
DUR = E.DUR; N = E.N_FRAMES
WORDS = [(round(a, 3), w) for a, b, w in E.WORDS]                 # output seconds

# ---------------------------------------------------------------- the plan (output seconds)
# ('aroll', zoom keys) | ('roto', text scene, zoom keys) | ('scene', name)
BASE = [
    (0.00, 1.85, 'roto', ('r20a', [(0.00, 1.08), (0.60, 1.00), (1.85, 1.03)])),             # I'm gonna give you [$20 huge, behind her]
    (1.85, 4.45, 'broll', ('cash_hand', 'o_interest', [(1.85, 1.00), (4.45, 1.08)], 'film')),  # pay me back with +$5 INTEREST (cash changes hands)
    (4.45, 6.15, 'aroll', [(4.45, 1.00), (6.15, 1.06)]),                                   # host: Wow, I like THAT
    (6.15, 7.64, 'roto', ('r15', [(6.15, 1.00), (7.64, 1.04)])),                           # when I was [AGE 15 behind her]
    (7.64, 9.23, 'ai', ('dad_allowance', 'o_dad', [(7.64, 1.00), (9.23, 1.07)], False)),     # my dad, he would give me (AI: dad hands her the allowance)
    (9.23, 10.01, 'broll', ('allow', 'o_allow', [(9.23, 1.05), (10.01, 1.10)], 'warm')),    # ALLOWANCE
    (10.01, 11.73, 'broll', ('shop', 'o_shop', [(10.01, 1.00), (11.73, 1.06)], 'bw')),       # I wasn't into SHOPPING (B&W, struck red)
    (11.73, 12.77, 'ai', ('books', 'o_books', [(11.73, 1.00), (12.77, 1.07)], True)),        # I would just buy BOOKS (AI: her, arms full of books; word behind her)
    (12.77, 14.99, 'aroll', [(12.77, 1.00), (14.99, 1.05)]),                               # therefore I SAVED most of my money
    (14.99, 18.11, 'aroll', [(14.99, 1.30), (18.11, 1.36)]),                               # when my FRIENDS and my FAMILY
    (18.11, 20.41, 'broll', ('wallet0', 'o_broke', [(18.11, 1.00), (20.41, 1.07)], 'cold')), # they ran OUT OF MONEY (empty wallet)
    (20.41, 21.71, 'ui', 'ui_mid'),                                                       # in the middle of the month (calendar card, 15th circled)
    (21.71, 23.89, 'ai', ('friends_ask', 'o_friends', [(21.71, 1.00), (23.89, 1.07)], False)), # they came to me for MONEY (AI: friends at the lockers)
    (23.89, 25.61, 'aroll', [(23.89, 1.45), (25.61, 1.50)]),                               # guess what I DID?
    (25.61, 26.79, 'aroll', [(25.61, 1.00), (26.79, 1.03)]),                               # yeah I gave it to them
    (26.79, 28.57, 'ui', 'ui_loan1'),                                                     # but they had to pay INTEREST (loan cards, +interest chips)
    (28.57, 29.55, 'aroll', [(28.57, 1.00), (29.55, 1.07)]),                               # host laughs
    (29.55, 30.50, 'aroll', [(29.55, 1.00), (30.50, 1.03)]),                               # I remember my dad
    (30.50, 32.27, 'ai', ('dad_door', 'o_knock', [(30.50, 1.00), (32.27, 1.07)], True)),     # he KNOCKED on my room DOOR (AI: dad at her door, KNOCK behind him)
    (32.27, 34.49, 'roto', ('r20b', [(32.27, 1.00), (34.49, 1.05)])),                      # he said Latoya, I need [$20 behind her]
    (34.49, 36.78, 'ai', ('drawer', 'o_stash', [(34.49, 1.00), (36.78, 1.07)], False)),      # I went in my DRAWER (AI: her drawer of saved cash)
    (36.78, 38.52, 'broll', ('count', 'o_count', [(36.78, 1.02), (38.52, 1.08)], 'warm')),   # and I started COUNTING all my money
    (38.52, 40.65, 'aroll', [(38.52, 1.45), (40.65, 1.50)]),                               # he said WAIT, you still have all those MONEY?
    (40.65, 41.81, 'aroll', [(40.65, 1.12), (41.81, 1.15)]),                               # so I gave him $20
    (41.81, 43.75, 'aroll', [(41.81, 1.00), (43.75, 1.04)]),                               # the next time he got PAID
    (43.75, 45.31, 'aroll', [(43.75, 1.30), (45.31, 1.33)]),                               # he's giving me allowance
    (45.31, 49.66, 'ui', 'ui_loan2'),                                                     # daddy, you owe me $20 + $5 interest (invoice, total counts to $25)
    (49.66, 52.58, 'aroll', [(49.66, 1.00), (52.58, 1.05)]),                               # and he gave me my allowance and the $20
    (52.58, 54.48, 'ui', 'ui_loan3'),                                                     # but he DIDN'T give me back my INTEREST (declined, red glow)
    (54.48, 55.74, 'aroll', [(54.48, 1.42), (55.74, 1.48)]),                               # I'm like COME ON
    (55.74, 58.94, 'ai', ('teen_boss', 'rfirst', [(55.74, 1.00), (58.94, 1.07)], True)),     # so that was my FIRST BUSINESS (AI: her as a young entrepreneur, words behind)
    (58.94, 60.40, 'aroll', [(58.94, 1.00), (60.40, 1.03)]),                               # but I didn't know it was called
    (60.40, DUR, 'roto', ('rent', [(60.40, 1.10), (DUR, 1.16)])),                          # [ENTREPRENEURSHIP behind her]
]
WHIPS = [(b[0], 'h' if k % 2 else 'v') for k, b in enumerate([b for b in BASE if b[2] in ('broll', 'ui', 'broll_roto', 'ai')])]
SHAKES = [(E.src_to_out(772.99), 9), (E.src_to_out(773.82), 7)]                  # knock, knock
FACE_X = 540


def fi(t): return int(round(t * FPS))
def smooth(u): u = min(1, max(0, u)); return u * u * (3 - 2 * u)


def caption_chunks():
    """Caption chunks from ../edit.py (same grouping and keyword marks), output seconds."""
    out = []
    for items in E.CHUNK_ITEMS:
        ws = [[round(E.WORDS[it['i']][0], 3), it['txt'], it['mark']] for it in items]
        t1 = E.WORDS[items[-1]['i']][1]
        out.append(dict(t0=ws[0][0], t1=round(t1, 3), words=ws))
    for k in range(len(out) - 1): out[k]['t1'] = min(out[k]['t1'] + 0.3, out[k + 1]['t0'] - 0.02)
    return out


def wt(word, n=0):
    k = 0
    for t, w in WORDS:
        if w.lower().strip(",.?!") == word:
            if k == n: return t
            k += 1
    raise KeyError(word)


def sfx_cues():
    """v4 SFX cue sheet (output s), client library only (references/sound-design.md): a whoosh peaking on every cut into
    B-roll / cards, low hits on the giant-word reveals, pops on chips and keywords, paper/card slides. Gain = dB under speech."""
    Wk, S = 'peak', 'start'
    c = [(0.00, '2900', S, -13), (wt('$20'), '2299', S, -15), (wt('$20'), '3005', S, -19),
         (1.85, '1462', Wk, -15), (wt('$5'), '2299', S, -15), (wt('$5'), '2364', S, -17), (wt('interest'), '2633', S, -19),
         (4.45, '1461', Wk, -19), (wt('15'), '2919', Wk, -14), (wt('15'), '3144', S, -17),
         (7.64, '3060', Wk, -16), (wt('dad'), '3005', S, -21),
         (9.23, '1462', Wk, -16), (wt('allowance'), '2299', S, -16), (10.01, '1464', Wk, -17), (wt('shopping') + 0.35, '1464', Wk, -18),
         (11.73, '1462', Wk, -16), (wt('books'), '2299', S, -15), (12.77, '1461', Wk, -19), (14.99, '1462', Wk, -19),
         (18.11, '2301', Wk, -15), (wt('money', 1), '2299', S, -16),
         (20.41, '3060', Wk, -16), (20.55, '1109', S, -26), (20.75, '1109', S, -26), (20.95, '1109', S, -26), (wt('middle'), '2364', S, -16),
         (21.71, '1461', Wk, -19), (23.89, '1462', Wk, -18), (wt('did'), '2364', S, -18), (25.61, '1461', Wk, -20),
         (26.79, '2633', Wk, -16), (26.84, '2605', S, -20), (26.96, '2605', S, -21), (wt('interest', 1), '2354', S, -17), (wt('interest', 1) + 0.12, '2354', S, -18),
         (28.57, '1461', Wk, -19), (30.50, '1462', Wk, -17), (wt('knocked'), '2299', S, -14), (wt('door'), '2299', S, -14),
         (wt('$20', 1), '2919', Wk, -14), (34.49, '1462', Wk, -17), (wt('drawer'), '3005', S, -19),
         (36.78, '1464', Wk, -17), (wt('counting'), '2299', S, -16), (38.52, '1461', Wk, -19),
         (40.65, '1461', Wk, -21), (41.81, '1461', Wk, -21), (43.75, '1462', Wk, -20),
         (45.31, '3060', Wk, -16), (45.36, '2605', S, -19), (wt('$20', 3), '1109', S, -20), (wt('$5', 1), '2354', S, -17), (wt('$5', 1) + 0.4, '1120', S, -18),
         (49.66, '1461', Wk, -20), (52.58, '2301', Wk, -15), (52.73, '1120', S, -19), (wt('interest', 3), '1464', Wk, -18),
         (wt('interest', 3) + 0.12, '2354', S, -15), (wt('interest', 3) + 0.12, '2299', S, -15),
         (54.48, '1462', Wk, -18), (wt('come'), '563', S, -16),
         (55.74, '2633', Wk, -16), (wt('first'), '2919', Wk, -13), (wt('business'), '3144', S, -16),
         (58.94, '1461', Wk, -20), (wt('entrepreneurship') - 0.2, '2919', Wk, -15)]
    return sorted(c)


def plan():
    os.makedirs(os.path.join(HERE, 'out'), exist_ok=True)
    sc = []
    for a, b, kind, p in BASE:
        name = {'ui': p, 'roto': p[0] if kind == 'roto' else None, 'broll': p[1] if kind == 'broll' else None, 'broll_roto': p[1] if kind == 'broll_roto' else None, 'ai': p[1] if kind == 'ai' else None}.get(kind)
        if name:
            cues = dict(words=[[round(t - a, 3), w] for t, w in WORDS if a - 0.35 <= t < b])
            names = [name + '@back', name + '@front'] if kind == 'ai' and p[3] else [name]
            for nm in names:
                sc.append(dict(name=nm, kind='scene' if kind == 'ui' else 'overlay', f0=fi(a), f1=fi(b), cues=cues))
    sc.append(dict(name='caps', kind='overlay', f0=0, f1=N, cues=dict(chunks=caption_chunks())))
    json.dump(dict(fps=FPS, scenes=sc), open(os.path.join(HERE, 'out/plan.json'), 'w'), indent=1)
    json.dump(sfx_cues(), open(os.path.join(HERE, 'audio/cues.json'), 'w'))
    print(len(sc), 'scenes')


# ---------------------------------------------------------------- compose
def curves(c, lift, r_sh, b_sh, b_hl, r_hl=0.0):
    x = np.arange(256) / 255.0
    y = x - c * np.sin(2 * np.pi * x) / (2 * np.pi); y = lift + y * (0.975 - lift)
    hl, sh = x ** 2, (1 - x) ** 2
    return (np.stack([y + r_sh * sh + r_hl * hl, y, y + b_sh * sh + b_hl * hl]).clip(0, 1) * 255).astype(np.uint8)
LUT = curves(0.22, 0.03, -0.010, 0.030, -0.030, 0.015)                         # film: teal shadows, warm highlights
yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
VIG = (1 - 0.22 * (((xx - W / 2) / (W * 0.62)) ** 2 + ((yy - H * 0.46) / (H * 0.62)) ** 2) ** 1.3).clip(0.55, 1)[..., None]
_y = np.linspace(0, 1, H, dtype=np.float32)[:, None, None]
SCRIM = 1 - 0.38 * np.clip((_y - 0.55) / 0.22, 0, 1) ** 1.5 * np.clip((0.98 - _y) / 0.12, 0.35, 1)
TYPESCRIM = (1 - 0.45 * np.clip((0.36 - _y) / 0.36, 0, 1) ** 1.3) * (1 - 0.40 * np.clip((_y - 0.58) / 0.30, 0, 1) ** 1.4)
rng = np.random.default_rng(7)
GRAIN = [cv2.resize((rng.standard_normal((H // 2, W // 2)) * 0.5).astype(np.float32), (W, H))[..., None] for _ in range(8)]
del yy, xx


def grade(img): return np.stack([LUT[0][img[..., 0]], LUT[1][img[..., 1]], LUT[2][img[..., 2]]], -1)
LUTS = {'film': LUT, 'warm': curves(0.20, 0.03, 0.02, -0.01, -0.035, 0.02), 'cold': curves(0.26, 0.04, -0.03, 0.05, 0.02, -0.02), 'bw': curves(0.30, 0.04, 0, 0, 0)}
def gradek(img, look):
    L = LUTS[look]
    if look == 'bw':
        g = cv2.cvtColor(img, cv2.COLOR_RGB2GRAY); g = L[0][g]; return np.stack([g, g, g], -1)
    out = np.stack([L[0][img[..., 0]], L[1][img[..., 1]], L[2][img[..., 2]]], -1)
    if look == 'cold':
        gr = cv2.cvtColor(out, cv2.COLOR_RGB2GRAY)[..., None].astype(np.float32); out = (gr * 0.45 + out * 0.55).astype(np.uint8)
    return out


def zoom(img, z, dx=0.0, dy=0.0, face=True):
    cw, ch = W / z, H / z
    x0 = min(max(FACE_X - cw / 2 + dx, 0), W - cw); y0 = min(max((560 - 0.30 * ch if face else (H - ch) / 2) + dy, 0), H - ch)
    if z <= 1.001 and not dx and not dy: return img
    return cv2.resize(img[int(y0):int(y0 + ch), int(x0):int(x0 + cw)], (W, H), interpolation=cv2.INTER_CUBIC)


def keyz(keys, t):
    for (t0, z0), (t1, z1) in zip(keys, keys[1:]):
        if t <= t1:
            u = (t - t0) / max(1e-6, t1 - t0)
            return z0 + (z1 - z0) * ((1 - (1 - min(1, u)) ** 3) if z0 > z1 and t1 - t0 < 1 else smooth(u))
    return keys[-1][1]


def scene_rgba(name, k):
    d = os.path.join(HERE, f'out/scenes/{name}'); p = os.path.join(d, f'f{k:05d}.png')
    if not os.path.exists(p): p = os.path.join(d, sorted(os.listdir(d))[-1])
    im = cv2.imread(p, cv2.IMREAD_UNCHANGED)
    if im.shape[2] == 3: im = np.dstack([im, np.full(im.shape[:2], 255, np.uint8)])
    return np.dstack([im[..., 2::-1], im[..., 3]])


def over(base, rgba, mask=None):
    a = rgba[..., 3:4].astype(np.float32) / 255
    if mask is not None: a = a * mask[..., None]
    return (base.astype(np.float32) * (1 - a) + rgba[..., :3].astype(np.float32) * a).astype(np.uint8)


class Matte:
    """MODNet person matte (Apache-2.0) on the graded A-roll frame, for text placed behind the speaker."""
    def __init__(self):
        import onnxruntime as ort
        self.s = ort.InferenceSession(os.path.join(ROOT, 'models/modnet.onnx'), providers=['CPUExecutionProvider'])
        self.n = self.s.get_inputs()[0].name
    def __call__(self, img):
        x = cv2.resize(img, (544, 960), interpolation=cv2.INTER_AREA).astype(np.float32) / 255
        a = self.s.run(None, {self.n: ((x - 0.5) / 0.5).transpose(2, 0, 1)[None]})[0][0, 0]
        return cv2.resize(np.clip(a, 0, 1), (W, H), interpolation=cv2.INTER_LINEAR)


class Reader:
    def __init__(self, path):
        self.p = subprocess.Popen(['ffmpeg', '-v', 'error', '-i', path, '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], stdout=subprocess.PIPE)
        self.k, self.img = -1, None
    def frame(self, k):
        while self.k < k:
            b = self.p.stdout.read(W * H * 3)
            if len(b) < W * H * 3: break
            self.img = np.frombuffer(b, np.uint8).reshape(H, W, 3); self.k += 1
        return self.img


class Compositor:
    def __init__(self):
        self.ar = Reader(RAW); self.prev = None; self.matte = None; self.br = {}; self.ai = {}
        self.chunks = caption_chunks()
        self.cap_shift = self.plan_caption_dodge()
        self.t_ent = wt('entrepreneurship') - 0.15

    # per-image camera (fg = person layer; the background moves 45% as much and is softly defocused):
    # scale from -> to, pan x/y (px) from -> to, roll (deg) from -> to
    AI_CAM = {'dad_allowance': ((1.05, 1.15), (34, -30), (10, -24), (0, 0)),     # slow dolly-in toward the bill, drifting left
              'books':         ((1.03, 1.13), (0, 0), (24, -34), (0, 0)),         # push in and rise to her face
              'friends_ask':   ((1.10, 1.12), (-52, 52), (0, -10), (0, 0)),       # sideways truck along the lockers
              'dad_door':      ((1.00, 1.12), (12, -12), (0, -30), (0, 0)),       # dolly toward dad at the door
              'drawer':        ((1.07, 1.15), (0, 0), (0, -16), (-1.4, 0.9)),     # top-down push with a gentle roll
              'teen_boss':     ((1.15, 1.02), (0, 0), (-26, 0), (0, 0))}          # pull-out reveal behind her

    def ai_layers(self, name):
        """AI still (src/ai/<name>.png, 1080x1920) -> person layer + matte and a clean, softly defocused background
        (the person is inpainted out of the background so the parallax never shows a ghost)."""
        if name not in self.ai:
            img = cv2.cvtColor(cv2.imread(os.path.join(HERE, f'src/ai/{name}.png')), cv2.COLOR_BGR2RGB)
            img = gradek(img, 'warm')
            if self.matte is None: self.matte = Matte()
            m = cv2.GaussianBlur(np.clip((self.matte(img) - 0.1) / 0.7, 0, 1), (0, 0), 1.5)
            md = cv2.dilate((m > 0.2).astype(np.uint8), np.ones((41, 41), np.uint8))
            small = cv2.resize(img, (270, 480), interpolation=cv2.INTER_AREA)
            inp = cv2.inpaint(small, cv2.resize(md, (270, 480), interpolation=cv2.INTER_NEAREST), 9, cv2.INPAINT_TELEA)
            inp = cv2.resize(inp, (W, H), interpolation=cv2.INTER_CUBIC)
            mb = cv2.GaussianBlur(md.astype(np.float32), (0, 0), 12)[..., None]
            bg = (img.astype(np.float32) * (1 - mb) + inp.astype(np.float32) * mb)
            bg = cv2.GaussianBlur(bg, (0, 0), 3.2).clip(0, 255).astype(np.uint8)
            self.ai[name] = (img, m, bg)
        return self.ai[name]

    @staticmethod
    def warp(img, s, tx, ty, rot, interp=cv2.INTER_CUBIC):
        M = cv2.getRotationMatrix2D((W / 2, H / 2), rot, s); M[0, 2] += tx; M[1, 2] += ty
        return cv2.warpAffine(img, M, (W, H), flags=interp, borderMode=cv2.BORDER_REFLECT)

    def ai_frame(self, p, t, lf, dx, dy):
        """2.5D camera on an AI still: the person layer moves along an eased path (ease-in-out sine over the beat, plus a
        0.45 s settle after the whip), the clean background follows at 45% (parallax) and stays soft (depth of field).
        The giant word sits between the layers when 'behind' is set; captions are always on top."""
        name, ov, keys, behind = p
        img, m, bgimg = self.ai_layers(name)
        b0, b1 = next((s[0], s[1]) for s in BASE if s[2] == 'ai' and s[3][0] == name)
        u = min(1.0, max(0.0, (t - b0) / (b1 - b0)))
        e = 0.5 - 0.5 * np.cos(np.pi * u)
        settle = 1 + 0.045 * (1 - min(1.0, (t - b0) / 0.45)) ** 3                    # eases out of the whip
        (s0, s1), (x0, x1), (y0, y1), (r0, r1) = self.AI_CAM[name]
        sf = (s0 + (s1 - s0) * e) * settle; tx = x0 + (x1 - x0) * e + dx; ty = y0 + (y1 - y0) * e + dy; rot = r0 + (r1 - r0) * e
        sb = 1 + (sf - 1) * 0.45 + 0.02
        fg = self.warp(img, sf, tx, ty, rot)
        mf = self.warp(m, sf, tx, ty, rot, cv2.INTER_LINEAR)[..., None]
        bg = self.warp(bgimg, sb, tx * 0.45, ty * 0.45, rot * 0.5)
        bgf = bg.astype(np.float32) / 255 * TYPESCRIM
        fgf = fg.astype(np.float32) / 255 * TYPESCRIM
        if behind:
            bgf = over((bgf.clip(0, 1) * 255).astype(np.uint8), scene_rgba(ov + '@back', lf)).astype(np.float32) / 255
            out = bgf * (1 - mf) + fgf * mf
            return over((out.clip(0, 1) * 255).astype(np.uint8), scene_rgba(ov + '@front', lf)).astype(np.float32) / 255
        out = bgf * (1 - mf) + fgf * mf
        return over((out.clip(0, 1) * 255).astype(np.uint8), scene_rgba(ov, lf)).astype(np.float32) / 255

    def plan_caption_dodge(self):
        """Captions never sit on a face: for every caption chunk shown over the A-roll, find her face box (YuNet on the
        zoomed frame, chin +15%) and the chunk's text box (caption layer alpha), then move the whole chunk down (or up if
        there is no room) just enough to clear the face. One shift per chunk, so nothing jumps mid-phrase."""
        det = cv2.FaceDetectorYN.create(os.path.join(ROOT, 'models/yunet.onnx'), '', (360, 640), 0.7, 0.3, 5)
        rd = Reader(RAW); need = {}
        for i in range(N):
            t = i / FPS
            t0, t1, kind, p = next(s for s in BASE if s[0] <= t < s[1] + 1e-9) if t < BASE[-1][1] else BASE[-1]
            a = rd.frame(i)
            if kind not in ('aroll', 'roto') or not self.caps_ok(t, t0): continue
            k = next((n for n, c in enumerate(self.chunks) if c['t0'] - 0.13 <= t < c['t1']), None)
            if k is None: continue
            img = zoom(a, keyz(p if kind == 'aroll' else p[1], t))
            _, faces = det.detect(cv2.resize(img[..., ::-1], (360, 640)))
            if faces is None: continue
            al = cv2.imread(os.path.join(HERE, f'out/scenes/caps/f{i:05d}.png'), cv2.IMREAD_UNCHANGED)[..., 3]
            rows = np.where(al.max(1) > 40)[0]
            if not len(rows): continue
            top, bot = int(rows.min()), int(rows.max())
            for fc in faces:
                fy0, fy1 = int(fc[1] * 3), int((fc[1] + fc[3] * 1.15) * 3)
                if top < fy1 + 20 and bot > fy0 - 20:
                    d = need.setdefault(k, dict(down=0, up=0, top=top, bot=bot))
                    d['down'] = max(d['down'], fy1 + 28 - top); d['up'] = max(d['up'], bot - (fy0 - 28))
                    d['top'] = min(d['top'], top); d['bot'] = max(d['bot'], bot)
        shift_chunk = {}
        for k, d in need.items():
            room_down, room_up = 1640 - d['bot'], d['top'] - 250
            shift_chunk[k] = d['down'] if d['down'] <= room_down else (-d['up'] if d['up'] <= room_up else room_down)
            print(f"caption dodge: '{' '.join(w for _, w, _ in self.chunks[k]['words'])}' {shift_chunk[k]:+d}px", flush=True)
        out = {}
        for i in range(N):
            t = i / FPS
            k = next((n for n, c in enumerate(self.chunks) if c['t0'] - 0.13 <= t < c['t1']), None)
            if k in shift_chunk: out[i] = int(shift_chunk[k])
        return out

    def caps_ok(self, t, beat_t0):
        """No caption left over from a designed beat on the face after the cut, and no caption under the giant last word."""
        if t >= self.t_ent: return False
        prev = [b for b in BASE if b[1] <= beat_t0 + 1e-6]
        if prev and prev[-1][2] not in ('aroll', 'roto'):
            ch = next((c for c in self.chunks if c['t0'] - 0.13 <= t < c['t1']), None)
            if ch and ch['t0'] < beat_t0 - 0.05: return False
        return True

    def frame(self, i):
        t = i / FPS
        a = self.ar.frame(i)
        t0, t1, kind, p = next(s for s in BASE if s[0] <= t < s[1] + 1e-9) if t < BASE[-1][1] else BASE[-1]
        lf = fi(t) - fi(t0)
        sh = sum(px * np.exp(-(t - ts) / 0.12) for ts, px in SHAKES if 0 <= t - ts < 0.7)
        dx, dy = sh * np.sin(t * 97), sh * np.cos(t * 71)
        if kind in ('aroll', 'roto'):
            keys = p if kind == 'aroll' else p[1]
            img = grade(zoom(a, keyz(keys, t), dx, dy))
            if kind == 'roto':
                if self.matte is None: self.matte = Matte()
                m = self.matte(img)
                img = over(img, scene_rgba(p[0], lf), 1 - np.clip((m - 0.15) / 0.6, 0, 1))
            f = img.astype(np.float32) / 255 * SCRIM
            if self.caps_ok(t, t0):
                cap = scene_rgba('caps', i)
                sh = self.cap_shift.get(i, 0)
                if sh: cap = np.roll(cap, sh, axis=0); cap[:sh] = 0 if sh > 0 else cap[:sh]; cap[sh:] = 0 if sh < 0 else cap[sh:]
                f = over((f.clip(0, 1) * 255).astype(np.uint8), cap).astype(np.float32) / 255
        elif kind in ('broll', 'broll_roto'):
            clip, ov, keys, look = p
            if clip not in self.br: self.br[clip] = Reader(os.path.join(HERE, f'src/broll/{clip}.mp4'))
            img = gradek(zoom(self.br[clip].frame(lf), keyz(keys, t), dx, dy, face=False), look)
            f = img.astype(np.float32) / 255 * TYPESCRIM                      # darker top and bottom so the big type reads
            img = (f.clip(0, 1) * 255).astype(np.uint8)
            if kind == 'broll_roto':
                if self.matte is None: self.matte = Matte()
                m = self.matte(img)
                img = over(img, scene_rgba(ov, lf), 1 - np.clip((m - 0.15) / 0.6, 0, 1))
            else:
                img = over(img, scene_rgba(ov, lf))
            f = img.astype(np.float32) / 255
        elif kind == 'ai':
            f = self.ai_frame(p, t, lf, dx, dy)
        else:
            f = scene_rgba(p, lf)[..., :3].astype(np.float32) / 255
        f = f * VIG
        f = f + GRAIN[i % len(GRAIN)] * 0.032
        if t > DUR - 0.35: f = f * (1 - 0.85 * smooth((t - (DUR - 0.35)) / 0.35))
        out = (f.clip(0, 1) * 255).astype(np.uint8)
        for wt, d in WHIPS:                                # 2 frames smeared before the cut, 3 after
            k = i - fi(wt)
            if -2 <= k <= 2:
                L = [70, 120, 150, 90, 40][k + 2]
                ker = np.zeros((L, L), np.float32)
                if d == 'h': ker[L // 2, :] = 1.0 / L
                else: ker[:, L // 2] = 1.0 / L
                out = cv2.filter2D(out, -1, ker, borderType=cv2.BORDER_REFLECT)
                if k == 0 and self.prev is not None: out = cv2.addWeighted(out, 0.55, cv2.filter2D(self.prev, -1, ker, borderType=cv2.BORDER_REFLECT), 0.45, 0)
        self.prev = out
        return out


def audio(path):
    voice = path + '.voice.wav'
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', RAW, '-vn', '-af', f'apad=whole_dur={N / FPS:.4f}', '-ar', '48000', '-ac', '2', voice], check=True)
    if os.path.exists(os.path.join(HERE, 'audio/mix.py')) and os.path.isdir(os.path.join(HERE, 'audio/src/sfx')):
        subprocess.run([sys.executable, os.path.join(HERE, 'audio/mix.py'), voice, path], check=True); os.remove(voice)
    else:
        os.replace(voice, path)


def compose():
    c = Compositor()
    if '--still' in sys.argv:
        want = sorted(fi(float(x)) for x in sys.argv[sys.argv.index('--still') + 1].split(','))
        for i in range(max(want) + 1):
            if i in want or any(0 <= w - i <= 3 for w in want):
                img = c.frame(i)
                if i in want: cv2.imwrite(os.path.join(HERE, f'out/still_{i / FPS:05.2f}.png'), img[..., ::-1])
            else:
                c.ar.frame(i)
        return
    wav = os.path.join(HERE, 'out/audio.wav'); audio(wav)
    enc = subprocess.Popen(['ffmpeg', '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{W}x{H}', '-r', f'{FPS_N}/{FPS_D}',
                            '-i', '-', '-i', wav, '-c:v', 'libx264', '-preset', 'slow', '-crf', '19', '-pix_fmt', 'yuv420p',
                            '-c:a', 'aac', '-b:a', '256k', '-shortest', '-movflags', '+faststart', OUT], stdin=subprocess.PIPE)
    for i in range(N):
        enc.stdin.write(c.frame(i).tobytes())
        if i % 96 == 0: print(f'{i / FPS:5.1f}s', flush=True)
    enc.stdin.close(); enc.wait(); os.remove(wav)
    print('wrote', OUT)


if __name__ == '__main__':
    cmd = sys.argv[1] if len(sys.argv) > 1 else 'compose'
    {'plan': plan, 'compose': compose, '--still': compose}[cmd]()
