"""Face-tracked 9:16 raw cut of the dad-interest clip (the income-first raw_cut.py camera, adapted to this clip).

    python3 raw_cut.py   -> ../out/dad_interest_RAW_1080x1920.mp4 (+ analysis/raw_tracking.json)

Segments, word timings and the source excerpt come from ../edit.py. The cut is re-ordered (hook first), so frames are
read with random access. Camera shots reset the tracker: the guest camera, and the host camera at 762.26 (laugh) and
789.75-791.25 ("Wow, I like that"; the guest frames before 789.80 are replaced by the first host frame).
YuNet finds the face; the nose x drives a calm dead-zone camera (velocity and acceleration capped).
"""
import json, os, subprocess, sys
import numpy as np, cv2
from PIL import Image
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(HERE)
sys.argv = ['edit.py']
import importlib.util
spec = importlib.util.spec_from_file_location('edit', os.path.join(ROOT, 'edit.py')); E = importlib.util.module_from_spec(spec); spec.loader.exec_module(E)
FPS, N, SW, SH, W, H = E.FPS, E.N_FRAMES, 1920, 1080, 1080, 1920
CW = SH * 9 / 16
HOST = [(762.26, 763.30), (789.56, 791.30)]
def angle(ts): return 'HOST' if any(a <= ts < b for a, b in HOST) else 'GUEST'
def clamp_ts(ts): return min(max(ts, 789.80), 791.20) if 789.56 <= ts < 791.30 else ts
SIGMA_S, DEADZONE, GAIN, MAX_STEP, MAX_ACC = 0.4, 26, 0.15, 5.0, 0.45   # source px (1080p: 1.5x the 720p values)


def frames():
    """(out index, source time, angle, RGB frame) for every output frame (random access through edit.py's Reader)."""
    for i in range(N):
        ts = clamp_ts(E.out_to_src(i / FPS))
        yield i, ts, angle(ts), np.asarray(E.src_frame(ts))


def main():
    det = cv2.FaceDetectorYN.create(os.path.join(ROOT, 'models/yunet.onnx'), '', (640, 360), 0.6, 0.3, 5)
    rows = []
    for i, ts, ang, img in frames():
        _, faces = det.detect(cv2.resize(img[..., ::-1], (640, 360)))
        r = dict(i=i, ts=ts, angle=ang)
        if faces is not None and len(faces):
            f = max(faces, key=lambda f: f[2] * f[3] * f[14]) * 3
            r.update(nx=float(f[8]), ny=float(f[9]), fx=float(f[0]), fw=float(f[2]))
        rows.append(r)
    # shot id: a new shot at every segment start and every angle change
    seg = [max(k for k, (o, a, b) in enumerate(E.SEG_OUT) if r['i'] / FPS >= o - 1e-9) for r in rows]
    shot, s = [], 0
    for k, r in enumerate(rows):
        if k and (seg[k] != seg[k - 1] or r['angle'] != rows[k - 1]['angle']): s += 1
        shot.append(s)
    shot = np.array(shot); nx = np.array([r.get('nx', np.nan) for r in rows]); track = np.zeros(len(rows))
    sig = SIGMA_S * FPS
    for s in np.unique(shot):
        idx = np.where(shot == s)[0]; v = nx[idx]; ok = ~np.isnan(v)
        v = np.interp(np.arange(len(v)), np.where(ok)[0], v[ok]) if ok.any() else np.full(len(v), 925.0)
        x = np.arange(len(v)); tgt = np.array([(np.exp(-0.5 * ((x - j) / sig) ** 2) * v).sum() / np.exp(-0.5 * ((x - j) / sig) ** 2).sum() for j in range(len(v))])
        c, vel = float(np.median(v)), 0.0
        for j in range(len(v)):
            err = tgt[j] - c; excess = np.sign(err) * max(0.0, abs(err) - DEADZONE)
            want = float(np.clip(excess * GAIN, -MAX_STEP, MAX_STEP)); vel += float(np.clip(want - vel, -MAX_ACC, MAX_ACC))
            c += vel; track[idx[j]] = c
    x0 = np.clip(track - CW / 2, 0, SW - CW)
    det_rate = float(np.mean(~np.isnan(nx)))
    os.makedirs(os.path.join(HERE, 'analysis'), exist_ok=True)
    json.dump(dict(detected=round(det_rate, 4), crop_x0=[round(float(v), 1) for v in x0], shot=shot.tolist(),
                   face_y=[round(r.get('ny', -1), 1) for r in rows]), open(os.path.join(HERE, 'analysis/raw_tracking.json'), 'w'))
    print('detected', det_rate, 'shots', int(shot.max()) + 1)
    out = os.path.join(ROOT, 'out/dad_interest_RAW_1080x1920.mp4')
    wav = os.path.join(HERE, 'raw_audio.wav')
    E.build_audio(wav)
    enc = subprocess.Popen(['ffmpeg', '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{W}x{H}', '-r', f'{E.FPS_N}/{E.FPS_D}',
                            '-i', '-', '-i', wav, '-c:v', 'libx264', '-preset', 'slow', '-crf', '17', '-pix_fmt', 'yuv420p',
                            '-c:a', 'aac', '-b:a', '256k', '-shortest', '-movflags', '+faststart', out], stdin=subprocess.PIPE)
    for i, ts, ang, img in frames():
        a = x0[i]
        enc.stdin.write(Image.fromarray(img).resize((W, H), Image.LANCZOS, box=(a, 0, a + CW, SH)).tobytes())
    enc.stdin.close(); enc.wait(); os.remove(wav)
    print('wrote', out)


if __name__ == '__main__':
    main()
