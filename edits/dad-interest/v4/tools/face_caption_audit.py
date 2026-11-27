"""Finds frames of a render where caption/overlay text sits on a face.
    python3 face_caption_audit.py <video.mp4>
Face boxes: YuNet (chin extended 15%). Text: bright, low-saturation pixels with strong edges inside the face box are
not reliable, so the check uses the caption layers instead when available; here it samples the render at 4 fps and
reports frames whose face box intersects the caption band found by a text-likeness score (white/gold glyph edges)."""
import sys, subprocess, numpy as np, cv2
path = sys.argv[1]
det = cv2.FaceDetectorYN.create(sys.argv[2], '', (360, 640), 0.7, 0.3, 5)
p = subprocess.Popen(['ffmpeg', '-v', 'error', '-i', path, '-vf', 'fps=4', '-f', 'rawvideo', '-pix_fmt', 'bgr24', '-'], stdout=subprocess.PIPE)
k = 0
while True:
    b = p.stdout.read(1080 * 1920 * 3)
    if len(b) < 1080 * 1920 * 3: break
    f = np.frombuffer(b, np.uint8).reshape(1920, 1080, 3); t = k / 4; k += 1
    _, faces = det.detect(cv2.resize(f, (360, 640)))
    if faces is None: continue
    for fc in faces:
        x, y, w, h = (fc[:4] * 3).astype(int)
        y1 = y + int(h * 1.15)
        roi = f[max(0, y):y1, max(0, x):x + w]
        if roi.size == 0: continue
        hsv = cv2.cvtColor(roi, cv2.COLOR_BGR2HSV)
        white = (hsv[..., 2] > 225) & (hsv[..., 1] < 40)
        gold = (hsv[..., 0] > 15) & (hsv[..., 0] < 32) & (hsv[..., 1] > 110) & (hsv[..., 2] > 200)
        ed = cv2.Canny(cv2.cvtColor(roi, cv2.COLOR_BGR2GRAY), 120, 240) > 0
        score = float(((white | gold) & cv2.dilate(ed.astype(np.uint8), np.ones((3, 3))).astype(bool)).mean())
        if score > 0.012: print(f'{t:6.2f}s face y {y}-{y1} score {score:.3f}')
