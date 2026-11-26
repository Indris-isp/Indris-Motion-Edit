"""Finds the laptop screen's 4 corners in every frame of reference.mp4 (light screens directly, dark screens by
interpolating between the nearest light ones) and writes rectified 1920x1080 screen frames to rect/ for measuring."""
import cv2, numpy as np, json, os, sys
cap = cv2.VideoCapture('reference.mp4'); frames = []
while True:
    ok, f = cap.read()
    if not ok: break
    frames.append(f)
print('frames', len(frames))
def corners(f):
    g = cv2.cvtColor(f, cv2.COLOR_BGR2GRAY)
    g[:250] = 0                                    # ignore the caption sticker / curtains
    _, m = cv2.threshold(g, 110, 255, cv2.THRESH_BINARY)
    m = cv2.morphologyEx(m, cv2.MORPH_CLOSE, np.ones((15, 15), np.uint8))
    cs, _ = cv2.findContours(m, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    if not cs: return None
    c = max(cs, key=cv2.contourArea)
    if cv2.contourArea(c) < 720 * 1280 * .12: return None
    hull = cv2.convexHull(c)
    for eps in np.linspace(.01, .08, 15):
        a = cv2.approxPolyDP(hull, eps * cv2.arcLength(hull, True), True)
        if len(a) == 4: break
    if len(a) != 4: return None
    p = a.reshape(4, 2).astype(float); s = p.sum(1); d = np.diff(p, axis=1).ravel()
    q = np.array([p[s.argmin()], p[d.argmin()], p[s.argmax()], p[d.argmax()]])     # tl, tr, br, bl
    clip = [c[0] <= 2 or c[0] >= 717 or c[1] >= 1277 for c in q]
    if sum(clip) > 1: return None
    if clip[3]: q[3] = q[0] + q[2] - q[1]        # rebuild a clipped corner as a parallelogram
    if clip[2]: q[2] = q[1] + q[3] - q[0]
    if clip[0]: q[0] = q[1] + q[3] - q[2]
    if clip[1]: q[1] = q[0] + q[2] - q[3]
    w = np.linalg.norm(q[1] - q[0]); h = np.linalg.norm(q[3] - q[0])
    if h < 1 or not 1.72 < w / h < 1.84: return None   # not a clean 16:9 screen
    return q
C = [corners(f) for f in frames]
ok = [i for i, c in enumerate(C) if c is not None]
print('light frames with corners', len(ok)); print('ok frames', ok)
for i in range(len(C)):
    if C[i] is None:
        a = max([j for j in ok if j < i], default=None); b = min([j for j in ok if j > i], default=None)
        C[i] = C[b] if a is None else C[a] if b is None else C[a] + (C[b] - C[a]) * (i - a) / (b - a)
json.dump([c.tolist() for c in C], open('screen_corners.json', 'w'))
os.makedirs('rect', exist_ok=True)
dst = np.float32([[0, 0], [1920, 0], [1920, 1080], [0, 1080]])
for i, f in enumerate(frames):
    Hm = cv2.getPerspectiveTransform(np.float32(C[i]), dst)
    cv2.imwrite(f'rect/r{i:03d}.jpg', cv2.warpPerspective(f, Hm, (1920, 1080)), [cv2.IMWRITE_JPEG_QUALITY, 88])
