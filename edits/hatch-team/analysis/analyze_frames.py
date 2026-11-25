"""Frame-by-frame breakdown of the source video.

For every frame: face box + landmarks (YuNet), head motion, global motion energy,
gesture-zone motion energy, histogram cut score, luma, audio RMS.
Writes frames.csv (one row per frame) and frames_summary.json.
"""
import csv, json, subprocess, sys, wave
import numpy as np, cv2

src, model, out_dir = sys.argv[1], sys.argv[2], sys.argv[3]
AW, AH = 960, 540                      # analysis resolution (half of 1920x1080)
SX = 1920 / AW                         # scale back to source pixels

probe = subprocess.run(['ffprobe', '-v', 'error', '-select_streams', 'v:0', '-count_packets',
                        '-show_entries', 'stream=nb_read_packets,r_frame_rate', '-of', 'json', src],
                       capture_output=True, text=True)
st = json.loads(probe.stdout)['streams'][0]
num, den = map(int, st['r_frame_rate'].split('/')); fps = num / den
nframes = int(st['nb_read_packets'])

# audio RMS per video frame
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', src, '-ac', '1', '-ar', '48000', f'{out_dir}/a48.wav'], check=True)
with wave.open(f'{out_dir}/a48.wav') as wf:
    a = np.frombuffer(wf.readframes(wf.getnframes()), np.int16).astype(np.float32) / 32768
spf = 48000 / fps
rms = np.array([np.sqrt(np.mean(a[int(i * spf):int((i + 1) * spf)] ** 2) + 1e-12) for i in range(nframes)])
db = 20 * np.log10(rms)

det = cv2.FaceDetectorYN.create(model, '', (AW, AH), 0.6, 0.3, 5)
proc = subprocess.Popen(['ffmpeg', '-v', 'error', '-i', src, '-vf', f'scale={AW}:{AH}', '-f', 'rawvideo',
                         '-pix_fmt', 'bgr24', '-'], stdout=subprocess.PIPE)
fsz = AW * AH * 3
rows, prev_g, prev_h, prev_c = [], None, None, None
# gesture zone: his right hand rises to the right of the face (in-frame right), above the burned captions
gz = (slice(int(AH * .20), int(AH * .74)), slice(int(AW * .56), int(AW * .82)))
i = 0
while True:
    buf = proc.stdout.read(fsz)
    if len(buf) < fsz: break
    f = np.frombuffer(buf, np.uint8).reshape(AH, AW, 3)
    g = cv2.cvtColor(f, cv2.COLOR_BGR2GRAY)
    gs = cv2.GaussianBlur(cv2.resize(g, (240, 135)), (3, 3), 0).astype(np.int16)
    hsv = cv2.cvtColor(f, cv2.COLOR_BGR2HSV)
    h = cv2.calcHist([hsv], [0, 1], None, [32, 32], [0, 180, 0, 256]); cv2.normalize(h, h)
    _, faces = det.detect(f)
    r = {'frame': i, 't': round(i / fps, 4), 'luma': round(float(g.mean()), 2), 'audio_db': round(float(db[i]) if i < len(db) else -120, 2)}
    if prev_g is not None:
        d = np.abs(gs - prev_g)
        r['motion'] = round(float(d.mean()), 3)
        gd = np.abs(g[gz].astype(np.int16) - prev_full[gz].astype(np.int16))
        r['gesture'] = round(float(gd.mean()), 3)
        r['cut'] = round(1 - float(cv2.compareHist(prev_h, h, cv2.HISTCMP_CORREL)), 5)
    else:
        r.update(motion=0, gesture=0, cut=0)
    if faces is not None and len(faces):
        fb = max(faces, key=lambda z: z[2] * z[3])
        x, y, w, hh = (float(v) * SX for v in fb[:4])
        lm = [float(v) * SX for v in fb[4:14]]
        cx, cy = x + w / 2, y + hh / 2
        r.update(face=1, fx=round(x, 1), fy=round(y, 1), fw=round(w, 1), fh=round(hh, 1), fcx=round(cx, 1), fcy=round(cy, 1),
                 eye_r_x=round(lm[0], 1), eye_r_y=round(lm[1], 1), eye_l_x=round(lm[2], 1), eye_l_y=round(lm[3], 1),
                 nose_x=round(lm[4], 1), nose_y=round(lm[5], 1), mouth_y=round((lm[7] + lm[9]) / 2, 1),
                 roll=round(float(np.degrees(np.arctan2(lm[3] - lm[1], lm[2] - lm[0]))), 2),
                 yaw=round(float((lm[4] - (lm[0] + lm[2]) / 2) / max(1, abs(lm[2] - lm[0]))), 3),
                 conf=round(float(fb[14]), 3))
        if prev_c is not None: r['head_motion'] = round(float(np.hypot(cx - prev_c[0], cy - prev_c[1])), 2)
        prev_c = (cx, cy)
    else:
        r['face'] = 0
    rows.append(r); prev_g, prev_h, prev_full = gs, h, g
    i += 1
    if i % 500 == 0: print(i, '/', nframes, flush=True)
proc.wait()

cols = ['frame', 't', 'face', 'conf', 'fx', 'fy', 'fw', 'fh', 'fcx', 'fcy', 'eye_r_x', 'eye_r_y', 'eye_l_x', 'eye_l_y',
        'nose_x', 'nose_y', 'mouth_y', 'roll', 'yaw', 'head_motion', 'motion', 'gesture', 'cut', 'luma', 'audio_db']
with open(f'{out_dir}/frames.csv', 'w', newline='') as fh:
    wr = csv.DictWriter(fh, cols); wr.writeheader(); wr.writerows(rows)
print('frames', len(rows), 'fps', fps)
