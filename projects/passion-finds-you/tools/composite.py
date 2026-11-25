# Final composite: letterbox -> caption in DIFFERENCE mode -> speaker matte on top (20% ghost) -> encode.
import sys, json, subprocess, numpy as np
from PIL import Image
B = sys.argv[1]; OUT = sys.argv[2]; LIMIT = int(sys.argv[3]) if len(sys.argv) > 3 else 10**9
W, H, FPS = 1080, 1920, 50
GHOST = float(sys.argv[4]) if len(sys.argv) > 4 else 0.50
tl = json.load(open(f"{B}/timeline.json")); caps = tl["captions"]
layers = {}
def layer(cid):
    if cid not in layers:
        a = np.asarray(Image.open(f"{B}/layers/{cid}.png").convert("RGBA")).astype(np.float32) / 255
        ys, xs = np.nonzero(a[..., 3] > 0.002)
        y0, y1, x0, x1 = ys.min(), ys.max() + 1, xs.min(), xs.max() + 1
        layers[cid] = (y0, y1, x0, x1, a[y0:y1, x0:x1, :3], a[y0:y1, x0:x1, 3:4])
    return layers[cid]
def matte(i):
    p = f"{B}/matte/{i:05d}.png" if i < 1303 else f"{B}/matte_tail/{i-1303:05d}.png"
    return np.asarray(Image.open(p)).astype(np.float32)[..., None] / 255
src = subprocess.Popen(["ffmpeg", "-v", "error", "-i", f"{B}/base.mov", "-i", f"{B}/tail.mov", "-filter_complex", "[0:v][1:v]concat=n=2:v=1:a=0[v]", "-map", "[v]", "-f", "rawvideo", "-pix_fmt", "rgb24", "-"], stdout=subprocess.PIPE)
enc = subprocess.Popen(["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}", "-r", str(FPS), "-i", "-",
                        "-i", f"{B}/base.mov", "-i", f"{B}/tail.mov", "-filter_complex", "[1:a][2:a]concat=n=2:v=0:a=1[a]", "-map", "0:v", "-map", "[a]",
                        "-c:v", "libx264", "-preset", "slow", "-crf", "16", "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart", OUT], stdin=subprocess.PIPE)
i = 0
while i < LIMIT:
    buf = src.stdout.read(W * H * 3)
    if len(buf) < W * H * 3: break
    t = i * 1000 / FPS
    bg = np.frombuffer(buf, np.uint8).reshape(H, W, 3).astype(np.float32) / 255
    # 1. letterbox open: picture revealed from a thin centre strip, linear over 0.8 s
    if t < tl["letterbox_ms"]:
        open_h = max(0.04, t / tl["letterbox_ms"]) * H
        top = int(round((H - open_h) / 2)); bot = int(round((H + open_h) / 2))
        bg = bg.copy(); bg[:top] = 0; bg[bot:] = 0
    out = bg
    c = next((c for c in caps if c["t"] <= t < c["out"]), None)
    if c and c["lines"]:
        y0, y1, x0, x1, col, a = layer(c["id"])
        region = bg[y0:y1, x0:x1]
        if c.get("blend") == "difference":
            comp = region * (1 - a) + np.abs(region - col) * a    # 2a. difference blend (0:02-0:10)
        else:
            comp = region * (1 - a) + a                           # 2b. plain white text, normal blend
        m = matte(i)[y0:y1, x0:x1] * (1 - GHOST)                  # 3. speaker in front of the text
        out = bg.copy(); out[y0:y1, x0:x1] = comp * (1 - m) + region * m
    enc.stdin.write((out * 255 + 0.5).clip(0, 255).astype(np.uint8).tobytes())
    i += 1
    if i % 200 == 0: print(i, flush=True)
enc.stdin.close(); enc.wait(); src.kill()
print("frames", i)
