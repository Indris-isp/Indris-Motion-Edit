# Robust Video Matting over a video -> 8-bit alpha PNGs (one per frame)
import sys, subprocess, numpy as np, onnxruntime as ort
from PIL import Image
src, model, out = sys.argv[1:4]
W, H = 1080, 1920
sess = ort.InferenceSession(model, providers=["CPUExecutionProvider"])
rec = [np.zeros([1, 1, 1, 1], np.float32)] * 4
dsr = np.array([0.25], np.float32)
p = subprocess.Popen(["ffmpeg", "-v", "error", "-i", src, "-f", "rawvideo", "-pix_fmt", "rgb24", "-"], stdout=subprocess.PIPE)
i = 0
while True:
    buf = p.stdout.read(W * H * 3)
    if len(buf) < W * H * 3: break
    x = np.frombuffer(buf, np.uint8).reshape(H, W, 3).astype(np.float32).transpose(2, 0, 1)[None] / 255
    fgr, pha, *rec = sess.run(None, {"src": x, "r1i": rec[0], "r2i": rec[1], "r3i": rec[2], "r4i": rec[3], "downsample_ratio": dsr})
    Image.fromarray((pha[0, 0] * 255).clip(0, 255).astype(np.uint8)).save(f"{out}/{i:05d}.png")
    i += 1
    if i % 100 == 0: print(i, flush=True)
print("done", i)
