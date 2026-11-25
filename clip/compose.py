"""Composite the final vertical clip.

background (out/bg.png) + virtual-camera crop of the source inside the rounded card
+ transparent overlay frames (out/fg/) -> out/<name>.mp4 with loudness-normalised audio.

Usage: python3 compose.py <source.mp4> [--preview N]  (N: only the first N frames)
"""
import json, os, subprocess, sys
import numpy as np, cv2

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, 'out')
src = sys.argv[1]
preview = int(sys.argv[sys.argv.index('--preview') + 1]) if '--preview' in sys.argv else None
C = json.load(open(os.path.join(OUT, 'clip.json')))
K = C['card']; CW, CH = K['w'], K['h']; ASPECT = CW / CH
FPS_NUM, FPS_DEN = C['fps_num'], C['fps_den']
N = preview or C['frames']
SAFE = C['safe']          # usable source area: above the burned-in captions, inside the border
SW, SH = 1920, 1080

# ---- rounded-card alpha mask (supersampled for clean corners) ----
ss = 4
m = np.zeros((CH * ss, CW * ss), np.uint8)
r = K['r'] * ss
cv2.rectangle(m, (r, 0), (CW * ss - r, CH * ss), 255, -1); cv2.rectangle(m, (0, r), (CW * ss, CH * ss - r), 255, -1)
for cx, cy in [(r, r), (CW * ss - r, r), (r, CH * ss - r), (CW * ss - r, CH * ss - r)]: cv2.circle(m, (cx, cy), r, 255, -1, cv2.LINE_AA)
mask = (cv2.resize(m, (CW, CH), interpolation=cv2.INTER_AREA).astype(np.float32) / 255)[..., None]

bg = cv2.imread(os.path.join(OUT, 'bg.png'), cv2.IMREAD_COLOR).astype(np.float32)
bg_card = bg[K['y']:K['y'] + CH, K['x']:K['x'] + CW].copy()

# ---- grade: gentle S-curve, a touch of warmth and saturation ----
lut_x = np.arange(256, dtype=np.float32) / 255
curve = lut_x + 0.035 * np.sin(2 * np.pi * (lut_x - 0.5))   # mild S: darker shadows, brighter highlights
LUT = np.clip(curve * 255, 0, 255).astype(np.uint8)
WARM = np.array([0.975, 1.0, 1.03], np.float32)     # BGR gains

def shot_at(t):
    for s in C['shots']:
        if s['s'] <= t < s['e']: return s
    return C['shots'][-1]

def crop_rect(t):
    s = shot_at(t)
    p = clamp01((t - s['s']) / max(1e-3, s['e'] - s['s']))
    ease = p * p * (3 - 2 * p)
    h = s['h'] * (1 - s.get('push', 0) * ease)
    w = h * ASPECT
    cx, cy = s['cx'], s['cy']
    x0 = min(max(cx - w / 2, SAFE['x0']), SAFE['x1'] - w)
    y0 = min(max(cy - h / 2, SAFE['y0']), SAFE['y1'] - h)
    return x0, y0, w, h

def clamp01(v): return 0.0 if v < 0 else 1.0 if v > 1 else v

def render_card(frame, t):
    x0, y0, w, h = crop_rect(t)
    sc = CW / w
    M = np.float32([[sc, 0, -x0 * sc], [0, sc, -y0 * sc]])
    v = cv2.warpAffine(frame, M, (CW, CH), flags=cv2.INTER_LANCZOS4, borderMode=cv2.BORDER_REFLECT)
    v = cv2.LUT(v, LUT)
    hsv = cv2.cvtColor(v, cv2.COLOR_BGR2HSV).astype(np.float32)
    hsv[..., 1] = np.clip(hsv[..., 1] * 1.07, 0, 255)
    v = cv2.cvtColor(hsv.astype(np.uint8), cv2.COLOR_HSV2BGR).astype(np.float32) * WARM
    amt = 0.35 + 0.25 * min(1.0, max(0.0, sc - 1.0))       # sharpen more when we upscale more
    blur = cv2.GaussianBlur(v, (0, 0), 1.1)
    v = np.clip(v + amt * (v - blur), 0, 255)
    return v

dec = subprocess.Popen(['ffmpeg', '-v', 'error', '-ss', f"{C['in']:.4f}", '-i', src, '-t', f"{N * FPS_DEN / FPS_NUM + 0.2:.4f}",
                        '-f', 'rawvideo', '-pix_fmt', 'bgr24', '-'], stdout=subprocess.PIPE)
name = C['name'] + ('_preview' if preview else '')
out_path = os.path.join(OUT, name + '.mp4')
af = f"loudnorm=I=-14:TP=-1.2:LRA=9,afade=t=in:st=0:d=0.02,afade=t=out:st={N * FPS_DEN / FPS_NUM - 0.30:.3f}:d=0.30"
enc = subprocess.Popen(['ffmpeg', '-v', 'error', '-y',
                        '-f', 'rawvideo', '-pix_fmt', 'bgr24', '-s', '1080x1920', '-framerate', f'{FPS_NUM}/{FPS_DEN}', '-i', '-',
                        '-ss', f"{C['in']:.4f}", '-t', f"{N * FPS_DEN / FPS_NUM:.4f}", '-i', src,
                        '-map', '0:v', '-map', '1:a', '-af', af, '-ar', '48000',
                        '-c:v', 'libx264', '-preset', 'slow', '-crf', '16', '-pix_fmt', 'yuv420p',
                        '-color_primaries', 'bt709', '-color_trc', 'bt709', '-colorspace', 'bt709',
                        '-c:a', 'aac', '-b:a', '192k', '-movflags', '+faststart', out_path], stdin=subprocess.PIPE)
fsz = SW * SH * 3
fg_dir = os.path.join(OUT, 'fg')
for k in range(N):
    buf = dec.stdout.read(fsz)
    if len(buf) < fsz: print('source ended early at frame', k); break
    frame = np.frombuffer(buf, np.uint8).reshape(SH, SW, 3)
    t = k * FPS_DEN / FPS_NUM
    out = bg.copy()
    v = render_card(frame, t)
    out[K['y']:K['y'] + CH, K['x']:K['x'] + CW] = v * mask + bg_card * (1 - mask)
    fg = cv2.imread(os.path.join(fg_dir, f'f{k:05d}.png'), cv2.IMREAD_UNCHANGED)
    if fg is not None:
        a = fg[..., 3:4].astype(np.float32) / 255
        out = fg[..., :3].astype(np.float32) * a + out * (1 - a)
    enc.stdin.write(np.clip(out + 0.5, 0, 255).astype(np.uint8).tobytes())
    if k % 150 == 0: print(f'{k}/{N}', flush=True)
enc.stdin.close(); enc.wait(); dec.kill()
print('wrote', out_path)
