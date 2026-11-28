# Element compositor for the placed-lockup style: normal / difference / overlay blends, fade-ins, optional occlusion behind the speaker.
import sys, json, subprocess, numpy as np
from PIL import Image
V, B, OUT = sys.argv[1:4]; LIMIT = int(sys.argv[4]) if len(sys.argv) > 4 else 10**9
W, H, FPS = 1080, 1920, 50
els = json.load(open(f"{V}/elements.json"))["elements"]
cache = {}
def img(k):
    if k not in cache:
        a = np.asarray(Image.open(f"{V}/lines/{k}.png").convert("RGBA")).astype(np.float32) / 255
        if k == "arc_full":
            ys, xs = np.nonzero(a[..., 3] > 0.003); y0, x0 = ys.min(), xs.min(); a = a[y0:ys.max() + 1, x0:xs.max() + 1]; cache[k] = (a, int(x0), int(y0))
        else: cache[k] = (a, 0, 0)
    return cache[k]
def matte(i):
    p = f"{B}/matte/{i:05d}.png" if i < 1303 else f"{B}/matte_tail/{i-1303:05d}.png"
    return np.asarray(Image.open(p)).astype(np.float32)[..., None] / 255
src = subprocess.Popen(["ffmpeg", "-v", "error", "-i", f"{B}/base.mov", "-i", f"{B}/tail.mov", "-filter_complex", "[0:v][1:v]concat=n=2:v=1:a=0[v]", "-map", "[v]", "-f", "rawvideo", "-pix_fmt", "rgb24", "-"], stdout=subprocess.PIPE)
enc = subprocess.Popen(["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}", "-r", str(FPS), "-i", "-", "-c:v", "libx264", "-preset", "slow", "-crf", "16", "-pix_fmt", "yuv420p", OUT], stdin=subprocess.PIPE)
i = 0
while i < LIMIT:
    buf = src.stdout.read(W * H * 3)
    if len(buf) < W * H * 3: break
    t = i * 1000 / FPS
    bg = np.frombuffer(buf, np.uint8).reshape(H, W, 3).astype(np.float32) / 255
    out = bg.copy(); m = None
    for e in els:
        if not (e["t_in"] <= t < e["t_out"]): continue
        a_img, ox, oy = img(e["key"]); x, y = int(e["x"]) + ox, int(e["y"]) + oy
        h, w = a_img.shape[:2]; x0, y0, x1, y1 = max(0, x), max(0, y), min(W, x + w), min(H, y + h)
        if x1 <= x0 or y1 <= y0: continue
        sub = a_img[y0 - y:y1 - y, x0 - x:x1 - x]; col, a = sub[..., :3], sub[..., 3:4]
        ramp = min(1.0, (t - e["t_in"]) / e["fade"]) if e.get("fade") else 1.0
        a = a * ramp; reg = out[y0:y1, x0:x1]
        if e["blend"] == "difference": comp = reg * (1 - a) + np.abs(reg - col) * a
        elif e["blend"] == "overlay":
            ovl = np.where(reg < 0.5, 2 * reg * col, 1 - 2 * (1 - reg) * (1 - col)); ovl = ovl * 0.7 + col * 0.3; comp = reg * (1 - a) + ovl * a   # overlay, lifted 30% toward white for legibility
        else:   # normal white, switching to difference only where the background is near-white (reference: "inspiration" over the lamp)
            lum = (reg * np.array([0.2126, 0.7152, 0.0722], np.float32)).sum(2, keepdims=True)
            k = np.clip((lum - 0.62) / 0.18, 0, 1); k = k * k * (3 - 2 * k)
            tcol = col * (1 - k) + np.abs(reg - col) * k
            comp = reg * (1 - a) + tcol * a
        if e.get("behind"):
            if m is None: m = matte(i)
            mm = m[y0:y1, x0:x1]; comp = comp * (1 - mm) + bg[y0:y1, x0:x1] * mm
        out[y0:y1, x0:x1] = comp
    enc.stdin.write((out * 255 + 0.5).clip(0, 255).astype(np.uint8).tobytes()); i += 1
enc.stdin.close(); enc.wait(); src.kill(); print("frames", i)
