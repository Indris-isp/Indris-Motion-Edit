"""Keys the hand-held phone clip (Mixkit 28300, green screen) and tracks the phone screen.

  python3 key_phone.py
    -> assets/frames/hand/NNNN.webp   hand + phone with transparent background and transparent screen
                                      (only the tapping thumb stays visible over the screen)
    -> assets/frames/hand/quads.json  per-frame screen corners [tl,tr,br,bl] in crop coordinates

Uses the clip from START for COUNT frames at 30 fps, cropped to CROP (x, y, w, h).
"""
import json, os, subprocess
import numpy as np
from PIL import Image

SRC = 'assets/nature/hand_phone.mp4'
OUT = 'assets/frames/hand'
START, COUNT, FPS = 5.6, 170, 30
CROP = (380, 0, 1300, 1080)
W, H = CROP[2], CROP[3]

os.makedirs(OUT, exist_ok=True)
raw = subprocess.run(['ffmpeg', '-v', 'error', '-ss', str(START), '-i', SRC, '-frames:v', str(COUNT),
                      '-vf', f'fps={FPS},crop={W}:{H}:{CROP[0]}:{CROP[1]}', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'],
                     capture_output=True, check=True).stdout
frames = np.frombuffer(raw, np.uint8).reshape(-1, H, W, 3)
yy, xx = np.mgrid[0:H, 0:W]

def corners(mask):
    ys, xs = np.nonzero(mask)
    s, d = xs + ys, xs - ys
    return [[float(xs[s.argmin()]), float(ys[s.argmin()])], [float(xs[d.argmax()]), float(ys[d.argmax()])],
            [float(xs[s.argmax()]), float(ys[s.argmax()])], [float(xs[d.argmin()]), float(ys[d.argmin()])]]

quads = []
for i, f in enumerate(frames):
    r, g, b = [f[..., k].astype(np.int16) for k in range(3)]
    green = (g - np.maximum(r, b)) > 40
    dark = (r < 70) & (g < 70) & (b < 70)
    # phone body = biggest dark blob; take the bounding box of dark pixels in the left-centre area
    ys, xs = np.nonzero(dark & (xx < W * 0.75))
    x0, x1, y0, y1 = np.percentile(xs, 1), np.percentile(xs, 99), np.percentile(ys, 1), np.percentile(ys, 99)
    inside = (xx > x0 + 4) & (xx < x1 - 4) & (yy > y0 + 4) & (yy < y1 - 4)
    screen = green & inside
    quads.append(corners(screen))
q = np.array(quads)                                   # (n,4,2)
# temporal smoothing (the phone moves slowly; a tapping thumb can bite a corner for a few frames)
from statistics import median
sm = q.copy()
for i in range(len(q)):
    a, b_ = max(0, i - 3), min(len(q), i + 4)
    sm[i] = np.median(q[a:b_], axis=0)
for i, f in enumerate(frames):
    r, g, b = [f[..., k].astype(np.float32) for k in range(3)]
    spill = g - np.maximum(r, b)
    alpha = np.clip(1 - (spill - 12) / 38, 0, 1)                       # soft green key
    # inside the screen quad keep only skin (the tapping thumb): drop the green and the tracking marker
    tl, tr, br, bl = sm[i]
    def side(p, q_):
        return (q_[0] - p[0]) * (yy - p[1]) - (q_[1] - p[1]) * (xx - p[0])
    inq = (side(tl, tr) >= 0) & (side(tr, br) >= 0) & (side(br, bl) >= 0) & (side(bl, tl) >= 0)
    skin = ((r - b) > 28) & (r > g) & (r > 90)
    alpha = np.where(inq & ~skin, 0, alpha)
    # despill: pull residual green on edges back to the red/blue level
    g2 = np.where(spill > 0, np.maximum(r, b) + 0.15 * spill, g)
    rgba = np.dstack([r, g2, b, alpha * 255]).clip(0, 255).astype(np.uint8)
    Image.fromarray(rgba, 'RGBA').save(f'{OUT}/{i + 1:04d}.webp', quality=88, method=4)
data = {'crop': CROP, 'fps': FPS, 'quads': sm.round(1).tolist()}
json.dump(data, open(f'{OUT}/quads.json', 'w'))
open(f'{OUT}/quads.js', 'w').write('window.QUADS_DATA=' + json.dumps(data) + ';')
print('frames', len(frames), 'first quad', sm[0].round(1).tolist(), 'last', sm[-1].round(1).tolist())
