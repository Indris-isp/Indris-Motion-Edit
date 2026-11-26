"""v2.1 of "Find income first": the client's line-by-line plan (planning page), cut after "...to your families." (37.9 s),
palette A "Studio Cyan" (accent #5FD8F5, base #0F1113, text #F2EEE8, negative #FF5446).

    python3 build.py prep              B-roll crops (9:16, 23.976 fps), red-carpet person matte (MODNet), villa sky mask
    python3 build.py plan              out/plan.json (scene list + word cues for scenes.cjs)
    node scenes.cjs                    designed scenes / caption overlays -> out/scenes/<name>/f*.png
    python3 build.py compose           out/income_first_v2_1080x1920.mp4
    python3 build.py --still 2.0,10.5  out/still_*.png (output seconds)

The A-roll is the face-tracked raw cut (../out/income_first_RAW_1080x1920.mp4); its timeline is the output timeline.
"""
import json, os, subprocess, sys
import numpy as np, cv2

HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(HERE)
RAW = os.path.join(ROOT, 'out/income_first_RAW_1080x1920.mp4')
OUT = os.path.join(HERE, 'out/income_first_v2_1080x1920.mp4')
W, H = 1080, 1920
FPS_N, FPS_D = 24000, 1001; FPS = FPS_N / FPS_D
SPEECH_END = 37.925                    # end of "...to your families." (a clean segment boundary of the raw cut)
DUR = 38.17
N = int(round(DUR * FPS))

# ---------------------------------------------------------------- words (output seconds)
_src = open(os.path.join(ROOT, 'edit.py')).read(); _ns = {'__file__': os.path.join(ROOT, 'edit.py')}
exec(_src[:_src.index('# ---------------------------------------------------------------- camera angles')], _ns)
WORDS = [(round(_ns['src_to_out'](a), 3), w) for a, b, w in json.load(open(os.path.join(ROOT, 'words_src.json')))]
WORDS = [(t, w) for t, w in WORDS if t < SPEECH_END]

# ---------------------------------------------------------------- the plan (output seconds), one row per planning-page line
# base layer: ('aroll', zoom keys) | ('broll', clip) | ('scene', name) | special compositors
BASE = [
    (0.00, 1.36, 'aroll', [(0.00, 1.10), (1.36, 1.00)]),        # l01 host: caption appears and zooms out (??? like the ref)
    (1.36, 3.06, 'orbit', None),                                 # l01 orbit card: host face in a circle, viewers orbiting
    (3.06, 3.98, 'broll', 'clapper'),                            # l02 movie B-roll
    (3.98, 5.17, 'roto', 'red_carpet'),                          # l02 "ACTING?" behind the actor (roto)
    (5.17, 6.95, 'aroll', [(5.17, 1.00), (6.95, 1.05)]),         # l03 caption centre -> slides left
    (6.95, 8.19, 'aroll', [(6.95, 1.22), (8.19, 1.26)]),         # l03 punch-in on "play this game"
    (8.19, 9.70, 'aroll', [(8.19, 1.00), (9.70, 1.05)]),         # l04 "is find something"
    (9.70, 13.19, 'scene', 'coins'),                             # l04 3D phone + cyan coin rain (client's Pinterest ref)
    (13.19, 17.33, 'scene', 'puzzle_v12'),                       # l05 V12 world: pieces drift together, bulb lights
    (17.33, 18.57, 'villa', 'villa'),                            # l06 house + "GET INTO REAL ESTATE"
    (18.57, 19.96, 'scene', 'crt'),                              # l07 CRT + sticky notes, new text
    (19.96, 24.95, 'scene', 'mat'),                              # l08-l09 V08 cutting mat, one sheet (no pan)
    (24.95, 26.61, 'aroll', [(24.95, 1.00), (26.61, 1.05)]),     # l09 whip back to the A-roll + caption (the card zoom-out read as cheap)
    (26.61, 28.35, 'aroll', [(26.61, 1.00), (28.35, 1.04)]),     # l10 captions in the A-roll
    (28.35, 29.71, 'aroll', [(28.35, 1.18), (29.71, 1.21)]),
    (29.71, 31.61, 'aroll', [(29.71, 1.40), (31.61, 1.45)]),     #     STARVING ACTORS, tight
    (31.61, 34.39, 'scene', 'lottery3d'),                        # l11 3D purchase: cash -> terminal -> ticket
    (34.39, 34.95, 'aroll', [(34.39, 1.25), (34.95, 1.27)]),     # l12 "YEAH." bold
    (34.95, 36.11, 'aroll', [(34.95, 1.00), (36.11, 1.04)]),     # l13 caption in the A-roll (boxed serif)
    (36.11, 36.69, 'aroll', [(36.11, 1.20), (36.69, 1.22)]),
    (36.69, DUR, 'broll', 'family'),                             # l14 family, editorial design
]
# scenes.cjs renders these (kind 'scene' = opaque, 'overlay' = transparent)
SCENES = [('cap_q', 0.00, 1.36, 'overlay'), ('orbit', 1.36, 3.06, 'scene'), ('cap_clap', 3.06, 3.98, 'overlay'),
          ('acting_text', 3.98, 5.17, 'overlay'), ('cap_acting', 3.98, 5.17, 'overlay'), ('cap_advice', 5.17, 8.19, 'overlay'),
          ('cap_find', 8.19, 9.70, 'overlay'), ('coins', 9.70, 13.19, 'scene'), ('coins_text', 9.70, 13.19, 'overlay'), ('puzzle_v12', 13.19, 17.33, 'scene'),
          ('house_text', 17.33, 18.57, 'overlay'), ('crt', 18.57, 19.96, 'scene'), ('mat', 19.96, 24.95, 'scene'),
          ('pursue', 24.95, 26.61, 'overlay'), ('cap_starving', 26.61, 31.61, 'overlay'), ('lottery3d', 31.61, 34.39, 'scene'),
          ('cap_yeah', 34.39, 34.95, 'overlay'), ('cap_dont', 34.95, 36.69, 'overlay'), ('family_text', 36.69, DUR, 'overlay')]
SPECIAL = {'acting_text'}                    # composited behind the person, not as a plain overlay
# B-roll crops: (Mixkit id, source offset s, 9:16 crop centre x in the 1280x720 source, grade)
BROLL = {'clapper': ('46353', 14.0, 400, 'film'), 'red_carpet': ('23000', 5.0, 400, 'film'), 'villa': ('47286', 2.0, 1000, 'bw'),
         'family': ('33729', 1.0, 620, 'warm')}
# whip transitions into each designed beat (directional motion smear across the cut, as in the V08 / V12 references)
WHIPS = [(1.36, 'v'), (3.06, 'h'), (9.70, 'v'), (13.19, 'h'), (17.33, 'v'), (18.57, 'h'), (19.96, 'h'), (24.95, 'v'), (31.61, 'v'), (34.39, 'h'), (36.69, 'h')]
ORBIT_FACE = (540, 1060, 150)                                 # circle centre / radius on the orbit card
FACE = (540, 560)                                             # face centre in the raw cut (nose x is centred by the tracker)


def fi(t): return int(round(t * FPS))
def smooth(u): u = min(1, max(0, u)); return u * u * (3 - 2 * u)
def ease_out(u): u = min(1, max(0, u)); return 1 - (1 - u) ** 3


# ---------------------------------------------------------------- prep
def prep():
    os.makedirs(os.path.join(HERE, 'out'), exist_ok=True)
    for name, (mid, off, cx, _) in BROLL.items():
        dur = max(b - a for a, b, kind, p in BASE if p == name) + 0.3
        x0 = int(min(max(cx - 405 / 2, 0), 1280 - 405))
        vf = f'fps={FPS_N}/{FPS_D},crop=405:720:{x0}:0,scale={W}:{H}:flags=lanczos,unsharp=5:5:0.6'
        if name == 'villa':        # wide: 1280x720 -> 1536x864, house on the right third, padded to 9:16 (sky is drawn in compose)
            vf = f'fps={FPS_N}/{FPS_D},scale=1536:864:flags=lanczos,crop={W}:864:420:0,pad={W}:{H}:0:{H - 864}:black,unsharp=5:5:0.5'
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-ss', str(off), '-i', os.path.join(HERE, f'src/raw_{name}.mp4'), '-t', f'{dur:.3f}', '-an',
                        '-vf', vf,
                        '-c:v', 'libx264', '-crf', '14', '-pix_fmt', 'yuv420p', os.path.join(HERE, f'src/{name}.mp4')], check=True)
        print('prepped', name)
    # red-carpet person matte (MODNet, Apache-2.0)
    import onnxruntime as ort
    sess = ort.InferenceSession(os.path.join(HERE, 'models/modnet.onnx'), providers=['CPUExecutionProvider'])
    iname = sess.get_inputs()[0].name
    mats = []
    for f in read_all(os.path.join(HERE, 'src/red_carpet.mp4')):
        x = cv2.resize(f, (544, 960), interpolation=cv2.INTER_AREA).astype(np.float32) / 255
        x = ((x - 0.5) / 0.5).transpose(2, 0, 1)[None]
        a = sess.run(None, {iname: x})[0][0, 0]
        mats.append(cv2.resize(a, (W // 2, H // 2), interpolation=cv2.INTER_LINEAR))
    np.save(os.path.join(HERE, 'out/red_carpet_matte.npy'), np.clip(np.array(mats), 0, 1).astype(np.float16))
    # villa sky mask (static shot): bright, low-saturation or blue pixels connected to the top edge
    f = next(read_all(os.path.join(HERE, 'src/villa.mp4')))
    hsv = cv2.cvtColor(f[..., ::-1], cv2.COLOR_RGB2HSV)
    sky = ((hsv[..., 2] > 150) & ((hsv[..., 1] < 70) | ((hsv[..., 0] > 85) & (hsv[..., 0] < 130)))).astype(np.uint8)
    Y0 = H - 864                                   # the photo starts here; above it is drawn sky
    sky[:Y0] = 1; sky[Y0 + 500:] = 0
    n, lab = cv2.connectedComponents(sky)
    top = set(np.unique(lab[0][sky[0] > 0]))
    m = np.isin(lab, list(top - {0})).astype(np.float32)
    m = cv2.morphologyEx(m, cv2.MORPH_CLOSE, np.ones((9, 9), np.uint8))
    m = cv2.GaussianBlur(m, (0, 0), 2.5)
    cv2.imwrite(os.path.join(HERE, 'out/villa_sky.png'), (m * 255).astype(np.uint8))
    print('matte + sky mask done')


def read_all(path):
    p = subprocess.Popen(['ffmpeg', '-v', 'error', '-i', path, '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], stdout=subprocess.PIPE)
    while True:
        b = p.stdout.read(W * H * 3)
        if len(b) < W * H * 3: break
        yield np.frombuffer(b, np.uint8).reshape(H, W, 3)


class Reader:
    def __init__(self, path): self.g, self.k, self.img = read_all(path), -1, None
    def frame(self, k):
        while self.k < k:
            try: self.img = next(self.g); self.k += 1
            except StopIteration: break
        return self.img


# ---------------------------------------------------------------- plan
def plan():
    os.makedirs(os.path.join(HERE, 'out'), exist_ok=True)
    sc = []
    for name, a, b, kind in SCENES:
        words = [[round(t - a, 3), w] for t, w in WORDS if a - 0.35 <= t < b]
        sc.append(dict(name=name, kind=kind, f0=fi(a), f1=fi(b), cues=dict(words=words)))
    json.dump(dict(fps=FPS, scenes=sc), open(os.path.join(HERE, 'out/plan.json'), 'w'), indent=1)
    print(len(sc), 'scenes')


# ---------------------------------------------------------------- compose
def curves(c, lift, r_sh, b_sh, b_hl):
    x = np.arange(256) / 255.0
    y = x - c * np.sin(2 * np.pi * x) / (2 * np.pi); y = lift + y * (0.975 - lift)
    hl, sh = x ** 2, (1 - x) ** 2
    return (np.stack([y + r_sh * sh, y, y + b_sh * sh + b_hl * hl]).clip(0, 1) * 255).astype(np.uint8)
LUT = {'film': curves(0.22, 0.03, -0.010, 0.030, -0.015), 'warm': curves(0.18, 0.035, 0.02, -0.01, -0.03), 'bw': curves(0.30, 0.04, 0, 0, 0)}
yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
VIG = (1 - 0.22 * (((xx - W / 2) / (W * 0.62)) ** 2 + ((yy - H * 0.46) / (H * 0.62)) ** 2) ** 1.3).clip(0.55, 1)[..., None]
_y = np.linspace(0, 1, H, dtype=np.float32)[:, None, None]
SCRIM = 1 - 0.38 * np.clip((_y - 0.55) / 0.22, 0, 1) ** 1.5 * np.clip((0.98 - _y) / 0.12, 0.35, 1)
rng = np.random.default_rng(7)
GRAIN = [cv2.resize((rng.standard_normal((H // 2, W // 2)) * 0.5).astype(np.float32), (W, H))[..., None] for _ in range(8)]
del yy, xx


def grade(img, kind):
    lut = LUT[kind]
    if kind == 'bw':
        g = cv2.cvtColor(img, cv2.COLOR_RGB2GRAY); g = lut[0][g]; return np.stack([g, g, g], -1)
    return np.stack([lut[0][img[..., 0]], lut[1][img[..., 1]], lut[2][img[..., 2]]], -1)


def zoom(img, z, c=FACE):
    if z <= 1.001: return img
    cw, ch = W / z, H / z
    x0 = min(max(c[0] - cw / 2, 0), W - cw); y0 = min(max(c[1] - 0.30 * ch, 0), H - ch)
    return cv2.resize(img[int(y0):int(y0 + ch), int(x0):int(x0 + cw)], (W, H), interpolation=cv2.INTER_CUBIC)


def keyz(keys, t):
    for (t0, z0), (t1, z1) in zip(keys, keys[1:]):
        if t <= t1: return z0 + (z1 - z0) * smooth((t - t0) / max(1e-6, t1 - t0))
    return keys[-1][1]


_png = {}
def scene_rgba(name, k):
    p = os.path.join(HERE, f'out/scenes/{name}/f{k:05d}.png')
    if not os.path.exists(p):
        files = sorted(os.listdir(os.path.dirname(p))); p = os.path.join(os.path.dirname(p), files[-1])
    im = cv2.imread(p, cv2.IMREAD_UNCHANGED)
    if im.shape[2] == 3: im = np.dstack([im, np.full(im.shape[:2], 255, np.uint8)])
    return np.dstack([im[..., 2::-1], im[..., 3]])


def over(base, rgba, mask=None):
    a = rgba[..., 3:4].astype(np.float32) / 255
    if mask is not None: a = a * mask[..., None]
    return (base.astype(np.float32) * (1 - a) + rgba[..., :3].astype(np.float32) * a).astype(np.uint8)


class Compositor:
    def __init__(self):
        self.ar = Reader(RAW)
        self.br = {n: Reader(os.path.join(HERE, f'src/{n}.mp4')) for n in BROLL}
        self.matte = np.load(os.path.join(HERE, 'out/red_carpet_matte.npy')) if os.path.exists(os.path.join(HERE, 'out/red_carpet_matte.npy')) else None
        sky = cv2.imread(os.path.join(HERE, 'out/villa_sky.png'), cv2.IMREAD_GRAYSCALE)
        self.sky = sky.astype(np.float32) / 255 if sky is not None else None
        self.offer_last = None
        self.prev = None
        yy, xx = np.mgrid[0:H, 0:W]; self.yy, self.xx = yy, xx

    def frame(self, i):
        t = i / FPS
        a = self.ar.frame(min(i, fi(SPEECH_END) - 1))                 # A-roll is read on every frame (sequential reader)
        seg = next(s for s in BASE if s[0] <= t < s[1] + 1e-9) if t < BASE[-1][1] else BASE[-1]
        t0, t1, kind, p = seg
        lf = fi(t) - fi(t0)
        if kind == 'aroll':
            img = grade(zoom(a, keyz(p, t)), 'film')
        elif kind in ('broll', 'roto', 'villa'):
            b = self.br[p].frame(lf)
            img = grade(b, BROLL[p][3])
            if kind == 'roto' and self.matte is not None:
                txt = scene_rgba('acting_text', lf)
                m = cv2.resize(self.matte[min(lf, len(self.matte) - 1)].astype(np.float32), (W, H))
                img = over(img, txt, 1 - np.clip((m - 0.15) / 0.6, 0, 1))
            if kind == 'villa':
                img = self.villa(b, (t - t0) / (t1 - t0))
                img = over(img, scene_rgba('house_text', lf), self.sky_z)
        elif kind == 'scene':
            img = scene_rgba(p, lf)[..., :3].copy()
            if p == 'mat': self.offer_last = img
        elif kind == 'orbit':
            img = scene_rgba('orbit', lf)[..., :3].copy()
            img = self.iris(img, grade(a, 'film'), t - t0)
        elif kind == 'zoomout':
            img = grade(zoom(a, keyz(p, t)), 'film')
            u = (t - t0) / 0.42
            if u < 1 and self.offer_last is not None: img = self.card(img, self.offer_last, u)
        for name, s0, s1, kk in SCENES:
            if kk == 'overlay' and name not in SPECIAL and name != 'house_text' and s0 <= t < s1:
                img = over(img, scene_rgba(name, fi(t) - fi(s0)))
        f = img.astype(np.float32) / 255
        if kind in ('aroll', 'broll', 'roto', 'zoomout', 'villa'): f = f * SCRIM
        f = f * VIG
        f = f + GRAIN[i % len(GRAIN)] * 0.035
        if t > SPEECH_END: f = f * (1 - smooth((t - SPEECH_END) / (DUR - SPEECH_END)))
        out = (f.clip(0, 1) * 255).astype(np.uint8)
        for wt, d in WHIPS:                              # 2 frames smeared before the cut, 3 after
            k = i - fi(wt)
            if -2 <= k <= 2:
                L = [70, 120, 150, 90, 40][k + 2]
                ker = np.zeros((L, L), np.float32)
                if d == 'h': ker[L // 2, :] = 1.0 / L
                else: ker[:, L // 2] = 1.0 / L
                src = out if k >= 0 or self.prev is None else out
                out = cv2.filter2D(src, -1, ker, borderType=cv2.BORDER_REFLECT)
                if k == 0 and self.prev is not None: out = cv2.addWeighted(out, 0.55, cv2.filter2D(self.prev, -1, ker, borderType=cv2.BORDER_REFLECT), 0.45, 0)
        self.prev = out
        return out

    def villa(self, b, u):
        """B&W villa in the lower part of the frame under a drawn grey sky, slow push-in (sky mask follows the zoom)."""
        Y0 = H - 864
        if not hasattr(self, 'skybg'):
            top = cv2.cvtColor(b[Y0:Y0 + 40], cv2.COLOR_RGB2GRAY).mean()
            g = np.linspace(top * 0.62, top, Y0 + 60)[:, None] * np.ones((1, W))
            self.skybg = np.dstack([g, g, g]).astype(np.float32)
        f = grade(b, 'bw').astype(np.float32)
        f[:Y0 + 60] = self.skybg * (1 - np.clip((np.arange(Y0 + 60) - Y0)[:, None, None] / 60, 0, 1)) + f[:Y0 + 60] * np.clip((np.arange(Y0 + 60) - Y0)[:, None, None] / 60, 0, 1)
        z = 1 + 0.05 * u
        img = zoom(f.astype(np.uint8), z, (540, 1300))
        self.sky_z = zoom((self.sky * 255).astype(np.uint8)[..., None].repeat(3, 2), z, (540, 1300))[..., 0].astype(np.float32) / 255
        return img

    def iris(self, card, face, u):
        """The host shrinks from full frame into the orbit circle (0.4 s), then lives in the circle."""
        cx0, cy0, r0 = FACE[0], FACE[1], 1400
        cx1, cy1, r1 = ORBIT_FACE
        e = ease_out(u / 0.42)
        cx, cy, r = cx0 + (cx1 - cx0) * e, cy0 + (cy1 - cy0) * e, r0 + (r1 - r0) * e
        s = 1 + (0.62 - 1) * e                                          # scale the host so the face fits the circle
        M = np.float32([[s, 0, cx - FACE[0] * s], [0, s, cy - FACE[1] * s]])
        f = cv2.warpAffine(face, M, (W, H), flags=cv2.INTER_LINEAR, borderMode=cv2.BORDER_REPLICATE)
        d = np.sqrt((self.xx - cx) ** 2 + (self.yy - cy) ** 2)
        m = np.clip((r - d) / 2.0, 0, 1)[..., None]
        out = card.astype(np.float32) * (1 - m) + f.astype(np.float32) * m
        ring = np.clip(1 - np.abs(d - r - 3) / 4, 0, 1)[..., None] * (e > 0.6)
        out = out * (1 - ring) + np.array([95, 216, 245], np.float32) * ring
        return out.astype(np.uint8)

    def card(self, base, last, u):
        """The offer scene shrinks into a card and flies up, revealing the A-roll."""
        e = smooth(u); s = 1 - 0.62 * e
        small = cv2.resize(last, (int(W * s), int(H * s)), interpolation=cv2.INTER_AREA)
        y = int((H - small.shape[0]) / 2 - 900 * e ** 2); x = (W - small.shape[1]) // 2
        out = base.copy(); a = 1 - smooth((u - 0.7) / 0.3)
        y0, y1 = max(0, y), min(H, y + small.shape[0])
        if y1 > y0:
            region = out[y0:y1, x:x + small.shape[1]].astype(np.float32)
            out[y0:y1, x:x + small.shape[1]] = (region * (1 - a) + small[y0 - y:y1 - y].astype(np.float32) * a).astype(np.uint8)
        return out


def audio(path):
    """Voice from the raw cut, then the music bed + SFX mix (audio/mix.py, cues from the reference analysis)."""
    voice = path + '.voice.wav'
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', RAW, '-vn', '-af',
                    f'atrim=0:{SPEECH_END},afade=t=out:st={SPEECH_END - 0.06:.3f}:d=0.06,apad=whole_dur={N / FPS:.4f}',
                    '-ar', '48000', '-ac', '2', voice], check=True)
    subprocess.run([sys.executable, os.path.join(HERE, 'audio/mix.py'), voice, path], check=True)
    os.remove(voice)


def compose():
    c = Compositor()
    if '--still' in sys.argv:
        want = sorted(fi(float(x)) for x in sys.argv[sys.argv.index('--still') + 1].split(','))
        for i in range(max(want) + 1):
            img = c.frame(i)
            if i in want: cv2.imwrite(os.path.join(HERE, f'out/still_{i / FPS:05.2f}.png'), img[..., ::-1])
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
    {'prep': prep, 'plan': plan, 'compose': compose, '--still': compose}[cmd]()
