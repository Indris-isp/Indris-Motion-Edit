"""Raw cut of the "Find income first" clip: vertical 1080x1920, face-tracked, no captions / graphics / B-roll.

    python3 raw_cut.py --model path/to/face_detection_yunet_2023mar.onnx

Writes
  out/income_first_RAW_1080x1920.mp4        the raw cut (same 21 segments and audio chain as edit.py)
  out/income_first_RAW_preview_540x960.mp4  a light copy for the planning page
  analysis/raw_frames.csv                   frame-by-frame breakdown (one row per output frame)
  analysis/raw_tracking.json                per-frame crop + tracking summary

Tracking:
- Every output frame is mapped to its source frame (SEGMENTS from edit.py).
- YuNet finds the face and its five landmarks. The tracked point is the nose tip.
- Calm-operator framing per camera shot (it resets at every camera cut, so it never slides across one). The
  camera holds completely still while the nose is within a dead zone (+/-48 output px) of the centre. When the
  guest leans further, the camera eases over with capped speed and acceleration, so every move starts and stops
  softly. Missed detections are interpolated.
- The episode cuts to the host 0.3 s before the last word ends, so the guest's last frame is held through the tail.
- A 9:16 window at full source height (405x720, no upscale beyond the source) is centred on the smoothed nose
  x and clamped to the frame, so the crop never leaves the picture. The window is the full source height, so the
  face keeps its natural height in the frame. The script checks that the nose stays in the upper half and that
  the whole face box stays inside the crop on every frame.
"""
import csv, json, os, subprocess, sys
import numpy as np, cv2

HERE = os.path.dirname(os.path.abspath(__file__))
_src = open(os.path.join(HERE, 'edit.py')).read()
_cfg = {'__file__': os.path.join(HERE, 'edit.py')}
exec(_src[:_src.index('# ---------------------------------------------------------------- camera angles')], _cfg)
SEGMENTS, SEG_OUT, DUR, FPS, FPS_N, FPS_D = (_cfg[k] for k in ('SEGMENTS', 'SEG_OUT', 'DUR', 'FPS', 'FPS_N', 'FPS_D'))
EX_V0, EX_A0, SRC_V, SRC_A = (_cfg[k] for k in ('EX_V0', 'EX_A0', 'SRC_V', 'SRC_A'))
out_to_src = _cfg['out_to_src']
N = int(round(DUR * FPS))
SW, SH, W, H = 1280, 720, 1080, 1920
CW = SH * 9 / 16                                   # 405 px crop width at full height
# episode camera cuts inside the window (source s) and the angle on screen after each
CUTS = [(0, 'HOST'), (3095.30, 'G_FRONT'), (3104.02, 'G_SIDE'), (3119.37, 'G_FRONT'), (3129.75, 'G_SIDE'),
        (3132.46, 'G_FRONT'), (3149.15, 'HOST')]
SPEAKER = {'HOST': 'Interviewer (Brandon)', 'G_FRONT': 'Guest', 'G_SIDE': 'Guest'}
SIGMA_S = 0.4                                       # smoothing of the detected nose before the camera logic (s)
DEADZONE = 18                                       # source px (~48 output px) the nose may drift before the camera moves
GAIN = 0.15                                         # how quickly the camera closes the gap beyond the dead zone (per frame)
MAX_STEP = 3.5                                      # max camera speed, source px per frame
MAX_ACC = 0.30                                      # max change of speed per frame (soft starts and stops)
FREEZE_AFTER = 3149.10                              # the episode cuts to the host at 3149.15: hold the guest's last frame


def shot_of(ts):
    ts = min(ts, FREEZE_AFTER)
    k = max(i for i, (t, _) in enumerate(CUTS) if ts >= t)
    return k, CUTS[k][1]


def detect(model):
    det = cv2.FaceDetectorYN.create(model, '', (640, 360), 0.6, 0.3, 5)
    p = subprocess.Popen(['ffmpeg', '-v', 'error', '-i', SRC_V, '-f', 'rawvideo', '-pix_fmt', 'bgr24', '-'], stdout=subprocess.PIPE)
    want = [int(round((min(out_to_src(i / FPS), FREEZE_AFTER) - EX_V0) * FPS)) for i in range(N)]
    rows, k, img = [], -1, None
    for i, fk in enumerate(want):
        while k < fk:
            b = p.stdout.read(SW * SH * 3)
            if len(b) < SW * SH * 3: break
            img = np.frombuffer(b, np.uint8).reshape(SH, SW, 3); k += 1
        _, faces = det.detect(cv2.resize(img, (640, 360)))
        r = dict(out_frame=i, src_frame=fk)
        if faces is not None and len(faces):
            f = max(faces, key=lambda f: f[2] * f[3] * f[14]) * 2          # largest confident face, source px
            r.update(face_x=f[0], face_y=f[1], face_w=f[2], face_h=f[3], nose_x=f[8], nose_y=f[9], score=f[14] / 2)
        rows.append(r)
    p.kill()
    return rows


def smooth_track(rows):
    """Calm-operator framing per camera shot (it resets at every camera cut, so it never slides across one).
    The camera starts on the shot's median nose position. It stays completely still while the smoothed nose is within
    DEADZONE px of the frame centre. When the nose leaves that zone, it eases towards it: the velocity and the
    acceleration are both capped, so every move starts and stops softly. Missed detections are interpolated."""
    shots = np.array([shot_of(out_to_src(r['out_frame'] / FPS))[0] for r in rows])
    nx = np.array([float(r['nose_x']) if 'nose_x' in r else np.nan for r in rows])
    track, moving = np.zeros(len(rows)), np.zeros(len(rows), bool)
    sig = SIGMA_S * FPS
    for s in np.unique(shots):
        idx = np.where(shots == s)[0]
        v = nx[idx]; ok = ~np.isnan(v)
        v = np.interp(np.arange(len(v)), np.where(ok)[0], v[ok]) if ok.any() else np.full(len(v), SW / 2)
        x = np.arange(len(v)); tgt = np.empty(len(v))
        for j in range(len(v)):
            w = np.exp(-0.5 * ((x - j) / sig) ** 2); tgt[j] = (w * v).sum() / w.sum()
        c, vel = float(np.median(v)), 0.0
        for j in range(len(v)):
            err = tgt[j] - c
            excess = np.sign(err) * max(0.0, abs(err) - DEADZONE)
            want = float(np.clip(excess * GAIN, -MAX_STEP, MAX_STEP))
            vel += float(np.clip(want - vel, -MAX_ACC, MAX_ACC))
            c += vel; track[idx[j]] = c; moving[idx[j]] = abs(vel) > 0.05
    return shots, track, moving


def audio(path):
    parts, chain = [], []
    for k, (a, b) in enumerate(SEGMENTS):
        d = b - a
        chain.append(f'[0:a]atrim={a - EX_A0:.4f}:{b - EX_A0:.4f},asetpts=PTS-STARTPTS,'
                     f'afade=t=in:st=0:d=0.010,afade=t=out:st={d - 0.010:.4f}:d=0.010[s{k}]')
        parts.append(f'[s{k}]')
    fc = ';'.join(chain) + ';' + ''.join(parts) + f'concat=n={len(SEGMENTS)}:v=0:a=1,' + \
        'highpass=f=60,equalizer=f=3000:t=q:w=1.2:g=2,acompressor=threshold=-20dB:ratio=2.5:attack=8:release=120:makeup=2,' + \
        f'loudnorm=I=-14:TP=-1.5:LRA=9,alimiter=limit=0.87:level=0,atrim=0:{N / FPS:.4f}'
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', SRC_A, '-filter_complex', fc, '-ar', '48000', path], check=True)


def main():
    model = sys.argv[sys.argv.index('--model') + 1]
    os.makedirs(os.path.join(HERE, 'out'), exist_ok=True); os.makedirs(os.path.join(HERE, 'analysis'), exist_ok=True)
    rows = detect(model)
    shots, sm, moving = smooth_track(rows)
    words = [(a, b, w) for a, b, w in json.load(open(os.path.join(HERE, 'words_src.json')))]
    a_db = None
    wav = os.path.join(HERE, 'out/raw_audio.wav'); audio(wav)
    import soundfile as sf
    au, sr = sf.read(wav, dtype='float32'); au = au.mean(1) if au.ndim > 1 else au
    spf = sr / FPS
    worst_l = worst_r = 1e9; max_nose_y = 0; centre_err = []
    for i, r in enumerate(rows):
        ts = out_to_src(i / FPS)
        x0 = float(np.clip(sm[i] - CW / 2, 0, SW - CW))
        r.update(t_out=round(i / FPS, 3), t_src=round(ts, 3), shot=int(shots[i]), angle=shot_of(ts)[1])
        r['speaker'] = SPEAKER[r['angle']] if not (3129.105 <= ts <= 3129.575) else 'Interviewer (audio only: "Yeah.")'
        r['segment'] = max(k for k, (o, a, b) in enumerate(SEG_OUT) if i / FPS >= o - 1e-9) + 1
        r['crop_x0'] = round(x0, 1); r['track_x'] = round(float(sm[i]), 1)
        seg = au[int(i * spf):int((i + 1) * spf)]
        r['audio_db'] = round(float(20 * np.log10(np.sqrt((seg ** 2).mean()) + 1e-9)), 1) if len(seg) else -120.0
        r['word'] = next((w for a, b, w in words if a - 0.02 <= ts <= b + 0.02), '')
        if 'nose_x' in r:
            r['nose_out_x'] = round(float((r['nose_x'] - x0) / CW * W), 1); r['nose_out_y'] = round(float(r['nose_y'] / SH * H), 1)
            r['margin_l'] = round(float((r['face_x'] - x0) / CW * W), 1); r['margin_r'] = round(float((x0 + CW - r['face_x'] - r['face_w']) / CW * W), 1)
            worst_l, worst_r = min(worst_l, r['margin_l']), min(worst_r, r['margin_r'])
            max_nose_y = max(max_nose_y, r['nose_out_y']); centre_err.append(abs(r['nose_out_x'] - W / 2))
    cols = ['out_frame', 't_out', 't_src', 'src_frame', 'segment', 'shot', 'angle', 'speaker', 'word', 'audio_db', 'score',
            'face_x', 'face_y', 'face_w', 'face_h', 'nose_x', 'nose_y', 'track_x', 'crop_x0', 'nose_out_x', 'nose_out_y', 'margin_l', 'margin_r']
    with open(os.path.join(HERE, 'analysis/raw_frames.csv'), 'w', newline='') as f:
        wr = csv.DictWriter(f, cols); wr.writeheader()
        for r in rows: wr.writerow({c: (round(float(r[c]), 1) if isinstance(r.get(c), (np.floating, float)) else r.get(c, '')) for c in cols})
    det_rate = sum('nose_x' in r for r in rows) / len(rows)
    summary = dict(frames=len(rows), detected=round(det_rate, 4), camera_moving_share=round(float(moving.mean()), 3), deadzone_src_px=DEADZONE, sigma_s=SIGMA_S, crop_w=CW, crop_h=SH,
                   min_face_margin_left_px=float(worst_l), min_face_margin_right_px=float(worst_r), max_nose_y_px=float(max_nose_y), frame_h_px=H,
                   nose_centre_error_px=dict(median=float(np.median(centre_err)), p95=float(np.percentile(centre_err, 95)), max=float(max(centre_err))),
                   max_crop_step_px_per_frame=float(max(abs(rows[i]['crop_x0'] - rows[i - 1]['crop_x0']) for i in range(1, len(rows)) if shots[i] == shots[i - 1])))
    json.dump(dict(summary=summary, crop_x0=[r['crop_x0'] for r in rows]), open(os.path.join(HERE, 'analysis/raw_tracking.json'), 'w'))
    print(json.dumps(summary, indent=1))

    out = os.path.join(HERE, 'out/income_first_RAW_1080x1920.mp4')
    enc = subprocess.Popen(['ffmpeg', '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{W}x{H}', '-r', f'{FPS_N}/{FPS_D}',
                            '-i', '-', '-i', wav, '-c:v', 'libx264', '-preset', 'slow', '-crf', '18', '-pix_fmt', 'yuv420p',
                            '-c:a', 'aac', '-b:a', '256k', '-shortest', '-movflags', '+faststart', out], stdin=subprocess.PIPE)
    p = subprocess.Popen(['ffmpeg', '-v', 'error', '-i', SRC_V, '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], stdout=subprocess.PIPE)
    k, img = -1, None
    from PIL import Image
    for r in rows:
        while k < r['src_frame']:
            b = p.stdout.read(SW * SH * 3)
            if len(b) < SW * SH * 3: break
            img = Image.frombuffer('RGB', (SW, SH), b); k += 1
        x0 = r['crop_x0']
        enc.stdin.write(img.resize((W, H), Image.LANCZOS, box=(x0, 0, x0 + CW, SH)).tobytes())
    enc.stdin.close(); enc.wait(); p.kill()
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', out, '-vf', 'scale=540:960', '-c:v', 'libx264', '-crf', '28', '-preset', 'slow',
                    '-c:a', 'aac', '-b:a', '96k', '-movflags', '+faststart', os.path.join(HERE, 'out/income_first_RAW_preview_540x960.mp4')], check=True)
    os.remove(wav)
    print('wrote', out)


if __name__ == '__main__':
    main()
