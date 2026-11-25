"""Premium vertical re-edit of `src/real_world__vice_city.mp4` (960x720 talking head, 23 s).

    python3 edit.py                 -> out/vice_city_premium_1080x1920.mp4
    python3 edit.py --still 5.6,12.1  -> out/still_*.png (quick look at single frames)

Every output frame is a pure function of time t:
  1. the source frame (with the old burned-in captions inpainted away),
  2. a 9:16 reframe whose zoom follows the shot list SHOTS (punch-ins on phrase changes,
     slow push inside each shot), or the 'framed' card layout on the music drop,
  3. a grade that blends from WARM (real world) to COLD (GTA / fake reality) and back,
     plus halation, vignette, film grain, flashes, shake and RGB split on hits,
  4. word-by-word captions from words.json (Inter ExtraBold + Instrument Serif Italic keys),
  5. an end card over a blurred freeze of the last shot in the black tail.
Audio: the original mix + synthesized whoosh / impact SFX, EQ, loudness-normalised to -14 LUFS.
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
DUR = 22.875                      # source video length
LAST_VALID = 460                  # last non-black source frame (19.17 s); after it -> end card
CX = 515                          # subject's horizontal centre in the source
GOLD = (243, 214, 160)

# ---------------------------------------------------------------- shot list
# (start, layout, [(t, zoom), ...])  zoom keys are eased with smoothstep; hard cut at each start.
SHOTS = [
    (0.00,  'full',   [(0.00, 1.34), (0.55, 1.14), (2.79, 1.20)]),   # you enjoy the real world (settle-in open)
    (2.79,  'full',   [(2.79, 1.00), (5.21, 1.08)]),                 # it's nice out here, feels good
    (5.21,  'framed', [(5.21, 1.00), (8.79, 1.07)]),                 # DROP: beautiful scenes, fresh air, birds chirping
    (8.79,  'full',   [(8.79, 1.28), (10.4, 1.36)]),                 # makes you feel alive
    (10.63, 'full',   [(10.63, 1.02), (12.08, 1.18)]),               # too many people are inside f***ing
    (12.08, 'full',   [(12.08, 1.46), (12.35, 1.40), (13.21, 1.42)]),# GTA  (punch + shake + RGB split)
    (13.21, 'full',   [(13.21, 1.10), (14.67, 1.16)]),               # living a fake reality
    (14.67, 'full',   [(14.67, 1.24), (16.88, 1.32)]),               # instead of actually living their life
    (16.88, 'full',   [(16.88, 1.00), (18.67, 1.20), (DUR, 1.34)]),  # that they've been put on this earth to live -> end card
]
HITS = [  # (time, flash, rgb_split_px, shake_px)
    (5.21, 0.20, 0, 0), (8.79, 0.06, 0, 0), (12.08, 0.30, 18, 7), (13.67, 0.0, 9, 2), (19.23, 0.10, 0, 0),
]
COLD_IN, COLD_OUT = (10.55, 10.95), (14.7, 15.8)  # grade ramps


def smooth(u): u = min(1, max(0, u)); return u * u * (3 - 2 * u)
def ease_out(u): u = min(1, max(0, u)); return 1 - (1 - u) ** 3


def shot_at(t):
    s = [x for x in SHOTS if x[0] <= t][-1]
    keys = s[2]
    if t <= keys[0][0]: return s[1], keys[0][1], s[0]
    for (t0, z0), (t1, z1) in zip(keys, keys[1:]):
        if t <= t1:
            u = (t - t0) / (t1 - t0)
            e = ease_out(u) if t0 == s[0] and z0 > z1 and t1 - t0 < 1 else smooth(u)
            return s[1], z0 + (z1 - z0) * e, s[0]
    return s[1], keys[-1][1], s[0]


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


CARD_W, CARD_H, CARD_R, CARD_CY = 1000, 750, 38, 880
_card_mask = Image.new('L', (CARD_W, CARD_H), 0)
ImageDraw.Draw(_card_mask).rounded_rectangle((0, 0, CARD_W - 1, CARD_H - 1), CARD_R, fill=255)
_card_shadow = Image.new('L', (W, H), 0)
ImageDraw.Draw(_card_shadow).rounded_rectangle(((W - CARD_W) // 2, CARD_CY - CARD_H // 2 + 24,
                                                (W + CARD_W) // 2, CARD_CY + CARD_H // 2 + 24), CARD_R, fill=200)
_card_shadow = _card_shadow.filter(ImageFilter.GaussianBlur(40))


def framed_layout(img, z, t, t_in):
    bw = SH * 9 / 16 * 1.25
    bg = img.resize((108, 192), Image.BILINEAR, box=(CX - bw / 2, 0, CX + bw / 2, SH))
    bg = bg.filter(ImageFilter.GaussianBlur(5)).resize((W, H), Image.BILINEAR)
    bg = Image.fromarray((np.asarray(bg, np.float32) * 0.42).astype(np.uint8))
    bg.paste(Image.new('RGB', (W, H), 0), (0, 0), _card_shadow)
    cw, ch = SW / z, SH / z
    x0 = min(max(CX - 35 - cw / 2, 0), SW - cw); y0 = (SH - ch) * 0.35
    s = 1.10 - 0.10 * ease_out((t - t_in) / 0.45)       # entrance: card settles from 110 %
    fw, fh = int(CARD_W * s), int(CARD_H * s)
    card = img.resize((fw, fh), Image.LANCZOS, box=(x0, y0, x0 + cw, y0 + ch)).filter(
        ImageFilter.UnsharpMask(radius=1.6, percent=50, threshold=2))
    mask = _card_mask.resize((fw, fh), Image.BILINEAR)
    bg.paste(card, ((W - fw) // 2, CARD_CY - fh // 2), mask)
    edge = Image.new('RGBA', (fw, fh), 0)
    ImageDraw.Draw(edge).rounded_rectangle((0, 0, fw - 1, fh - 1), int(CARD_R * s), outline=(255, 255, 255, 40), width=2)
    bg = bg.convert('RGBA'); bg.alpha_composite(edge, ((W - fw) // 2, CARD_CY - fh // 2))
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


def grade(img, t, fi):
    k = coldness(t)
    lut = WARM[0] * (1 - k) + COLD[0] * k
    sat = WARM[1] * (1 - k) + COLD[1] * k
    a = np.asarray(img)
    f = np.stack([lut[0][a[..., 0]], lut[1][a[..., 1]], lut[2][a[..., 2]]], -1)
    Y = (f @ np.array([0.2126, 0.7152, 0.0722], np.float32))[..., None]
    f = Y + (f - Y) * sat
    # halation: warm glow bleeding from highlights
    hi = np.clip((Y - 0.62) / 0.38, 0, 1) * f
    glow = Image.fromarray((hi * 255).astype(np.uint8)).resize((W // 8, H // 8), Image.BILINEAR)
    glow = np.asarray(glow.filter(ImageFilter.GaussianBlur(6)).resize((W, H), Image.BILINEAR), np.float32) / 255
    f = f + glow * np.array([0.42, 0.28, 0.17], np.float32) * (1 - 0.5 * k)
    f = f * VIGNETTE
    f = f + hit_env(t, 0, 0.07)                                         # exposure flash on hits
    lum = (f @ np.array([0.2126, 0.7152, 0.0722], np.float32))[..., None]
    f = f + GRAIN[fi % len(GRAIN)] * (0.055 * (1.1 - lum) + 0.012)     # film grain, stronger in shadows
    o = (f.clip(0, 1) * 255).astype(np.uint8)
    ca = int(round(hit_env(t, 1, 0.09)))
    if ca:
        o = o.copy(); o[..., 0] = np.roll(o[..., 0], ca, 1); o[..., 2] = np.roll(o[..., 2], -ca, 1)
    return Image.fromarray(o)


# ---------------------------------------------------------------- captions
F_SANS = ImageFont.truetype(os.path.join(FONTS, 'Inter-800.ttf'), 76)
F_SERIF = ImageFont.truetype(os.path.join(FONTS, 'InstrumentSerif-Italic.ttf'), 112)
KEYS = {'real', 'world', 'beautiful', 'alive', 'GTA', 'fake', 'reality', 'life', 'live', 'earth'}
DISPLAY = {"fucking": "f*cking"}
CHUNKS = [(0, 2), (3, 4), (5, 8), (9, 10), (11, 12), (13, 14), (15, 16), (17, 20), (21, 24),
          (25, 27), (28, 31), (32, 35), (36, 37), (38, 42), (43, 46)]
CAP_Y = 1430            # baseline of a single caption line
MAX_LINE = 940
WORDS = json.load(open(os.path.join(HERE, 'words.json')))


def sprite(text, font, color):
    asc, desc = font.getmetrics(); tw = font.getlength(text); pad = 30
    im = Image.new('RGBA', (int(tw) + 2 * pad, asc + desc + 2 * pad), 0)
    sh = Image.new('L', im.size, 0)
    ImageDraw.Draw(sh).text((pad, pad + asc), text, font=font, anchor='ls', fill=255)
    shadow = Image.new('RGBA', im.size, (0, 0, 0, 0)); shadow.putalpha(sh.filter(ImageFilter.GaussianBlur(9)).point(lambda v: v * 0.75))
    im.alpha_composite(shadow, (0, 5))
    ImageDraw.Draw(im).text((pad, pad + asc), text, font=font, anchor='ls', fill=color + (255,))
    return im, pad, pad + asc, tw  # sprite, x of glyph origin, baseline y, advance


def layout_chunk(i0, i1):
    items = []
    for i in range(i0, i1 + 1):
        w = WORDS[i][2]; key = w in KEYS
        txt = DISPLAY.get(w, w if w == 'GTA' else w.lower())
        font = F_SERIF if key else F_SANS
        items.append(dict(i=i, spr=sprite(txt, font, GOLD if key else (255, 255, 255)), space=font.getlength(' ') * 0.9))
    lines, cur, width = [], [], 0
    for it in items:
        adv = it['spr'][3]
        if cur and width + it['space'] + adv > MAX_LINE: lines.append(cur); cur, width = [], 0
        width += (it['space'] if cur else 0) + adv; cur.append(it)
    lines.append(cur)
    lh = 104
    for li, line in enumerate(lines):
        total = sum(it['spr'][3] for it in line) + sum(it['space'] for it in line[1:])
        x = (W - total) / 2
        for it in line:
            it['x'] = x; it['y'] = CAP_Y - (len(lines) - 1 - li) * lh
            x += it['spr'][3] + it['space']
    return items


CHUNK_LAYOUT = [(a, b, layout_chunk(a, b)) for a, b in CHUNKS]


def draw_captions(frame, t):
    fr = frame.convert('RGBA')
    for n, (a, b, items) in enumerate(CHUNK_LAYOUT):
        t_on = WORDS[a][0]
        t_off = WORDS[b][1] + 0.55
        if n + 1 < len(CHUNKS): t_off = min(t_off, WORDS[CHUNKS[n + 1][0]][0])
        if not (t_on <= t < t_off): continue
        out_a = min(1, (t_off - t) / 0.08)
        for it in items:
            ws = WORDS[it['i']][0]
            if t < ws: continue
            u = ease_out((t - ws) / 0.16)
            spr, ox, by, _ = it['spr']
            s = 0.82 + 0.18 * u
            alpha = min(1, (t - ws) / 0.07) * out_a
            img = spr.resize((max(1, int(spr.width * s)), max(1, int(spr.height * s))), Image.BICUBIC) if s < 0.999 else spr
            if alpha < 1:
                img = img.copy(); img.putalpha(img.getchannel('A').point(lambda v: int(v * alpha)))
            cx = it['x'] + it['spr'][3] / 2
            px = int(cx - (ox + it['spr'][3] / 2) * s)
            py = int(it['y'] + 22 * (1 - u) - by * s)
            fr.alpha_composite(img, (max(0, px), max(0, py)))
    return fr.convert('RGB')


# ---------------------------------------------------------------- end card
F_SMALL = ImageFont.truetype(os.path.join(FONTS, 'Inter-600.ttf'), 34)
F_TITLE = ImageFont.truetype(os.path.join(FONTS, 'InstrumentSerif-Italic.ttf'), 230)
END_T1, END_T2, FADE_OUT = 19.23, 19.71, (22.05, 22.875)


def tracked(text, font, track):
    w = sum(font.getlength(c) for c in text) + track * (len(text) - 1)
    asc, desc = font.getmetrics(); im = Image.new('RGBA', (int(w) + 4, asc + desc + 4), 0); d = ImageDraw.Draw(im); x = 2
    for c in text: d.text((x, 2), c, font=font, fill=(255, 255, 255, 215)); x += font.getlength(c) + track
    return im


END_SMALL = tracked('ON THIS EARTH', F_SMALL, 14)
END_TITLE = sprite('to live.', F_TITLE, GOLD)[0]


def end_card(frame, t):
    if t < LAST_VALID / FPS: return frame
    u = (t - LAST_VALID / FPS)
    blur = 14 * smooth(u / 0.7)
    f = frame.filter(ImageFilter.GaussianBlur(blur)) if blur > 0.3 else frame
    f = Image.fromarray((np.asarray(f, np.float32) * (1 - 0.45 * smooth(u / 0.7))).astype(np.uint8)).convert('RGBA')
    for tt, im, y, rise in ((END_T1, END_SMALL, 780, 14), (END_T2, END_TITLE, 815, 30)):
        if t < tt: continue
        e = ease_out((t - tt) / 0.6); a = min(1, (t - tt) / 0.35)
        im2 = im.copy(); im2.putalpha(im.getchannel('A').point(lambda v: int(v * a)))
        f.alpha_composite(im2, ((W - im.width) // 2, int(y + rise * (1 - e))))
    if t >= END_T2:   # thin gold rule under the title
        e = ease_out((t - END_T2 - 0.2) / 0.8); lw = int(220 * e)
        if lw > 2: ImageDraw.Draw(f).rectangle(((W - lw) // 2, 1150, (W + lw) // 2, 1152), fill=GOLD + (200,))
    return f.convert('RGB')


def render_frame(src_img, fi):
    t = fi / FPS
    layout, z, s0 = shot_at(t)
    img = framed_layout(src_img, z, t, s0) if layout == 'framed' else full_layout(src_img, z, t)
    img = grade(img, t, fi)
    img = end_card(img, t)
    img = draw_captions(img, t)
    if t > FADE_OUT[0]:
        k = 1 - smooth((t - FADE_OUT[0]) / (FADE_OUT[1] - FADE_OUT[0]))
        img = Image.fromarray((np.asarray(img, np.float32) * k).astype(np.uint8))
    return img


# ---------------------------------------------------------------- audio
def build_audio(path):
    sr = 48000; n = int((DUR + 0.2) * sr); sfx = np.zeros(n); r = np.random.default_rng(3)

    def whoosh(at, length=0.55, gain=0.22):
        m = int(length * sr); x = r.standard_normal(m)
        env = np.sin(np.linspace(0, np.pi, m)) ** 2 * np.linspace(0.4, 1, m)
        fc = np.geomspace(300, 4000, m)                      # rising one-pole low-pass sweep
        y = np.zeros(m); acc = 0.0
        for i in range(m):
            a = 1 - math.exp(-2 * math.pi * fc[i] / sr); acc += a * (x[i] - acc); y[i] = acc
        i0 = int((at - length * 0.75) * sr); sfx[i0:i0 + m] += y / np.abs(y).max() * env * gain

    def impact(at, gain=0.55):
        m = int(0.9 * sr); tt = np.arange(m) / sr
        f = 38 + 70 * np.exp(-tt / 0.06)
        body = np.sin(2 * np.pi * np.cumsum(f) / sr) * np.exp(-tt / 0.28)
        click = r.standard_normal(m) * np.exp(-tt / 0.012) * 0.35
        i0 = int(at * sr); sfx[i0:i0 + m] += (body + click) * gain

    whoosh(5.21); whoosh(12.08, 0.4, 0.16); whoosh(19.23, 0.7, 0.18); impact(12.08); impact(19.23, 0.3)
    sfx_path = path + '.sfx.wav'
    import wave
    with wave.open(sfx_path, 'wb') as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(sr)
        w.writeframes((np.clip(sfx, -1, 1) * 32767).astype('<i2').tobytes())
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', SRC, '-i', sfx_path, '-filter_complex',
                    '[0:a]aresample=48000,highpass=f=28,equalizer=f=3200:t=q:w=1.2:g=2,'
                    'acompressor=threshold=-20dB:ratio=2.5:attack=8:release=120:makeup=2[v];'
                    '[1:a]pan=stereo|c0=c0|c1=c0[s];'
                    f'[v][s]amix=inputs=2:normalize=0,loudnorm=I=-14:TP=-1.5:LRA=9,alimiter=limit=0.87:level=0,'
                    f'afade=t=out:st={FADE_OUT[0]}:d={FADE_OUT[1] - FADE_OUT[0]},atrim=0:{DUR}',
                    '-ar', '48000', path], check=True)
    os.remove(sfx_path)


def main():
    os.makedirs(os.path.join(HERE, 'out'), exist_ok=True)
    if '--still' in sys.argv:
        times = [float(x) for x in sys.argv[sys.argv.index('--still') + 1].split(',')]
        want = {min(int(round(t * FPS)), int(DUR * FPS) - 1): t for t in times}
        last = None
        for fi, a in enumerate(source_frames()):
            if fi <= LAST_VALID: last = Image.fromarray(remove_captions(a))
            if fi in want:
                render_frame(last, fi).save(os.path.join(HERE, f'out/still_{want[fi]:05.2f}.png'))
        return
    audio = os.path.join(HERE, 'out/audio.wav'); build_audio(audio)
    enc = subprocess.Popen(['ffmpeg', '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{W}x{H}',
                            '-r', str(FPS), '-i', '-', '-i', audio, '-c:v', 'libx264', '-preset', 'slow', '-crf', '20',
                            '-tune', 'film', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '256k', '-shortest',
                            '-movflags', '+faststart', OUT], stdin=subprocess.PIPE)
    last = None
    for fi, a in enumerate(source_frames()):
        if fi <= LAST_VALID: last = Image.fromarray(remove_captions(a))
        enc.stdin.write(render_frame(last, fi).tobytes())
        if fi % 48 == 0: print(f'{fi / FPS:5.1f}s', flush=True)
    enc.stdin.close(); enc.wait()
    print('wrote', OUT)


if __name__ == '__main__':
    main()
