#!/usr/bin/env python3
"""Break a reference launch video down so its style can be studied frame by frame.

  python3 analyze_reference.py <video_file_or_url> <out_dir> [--fps 4]

URL support: direct .mp4 links, and Pinterest pin / pin.it links (the pin's MP4 is found in the page).
Writes to <out_dir>:
  ref.mp4                 the video (if a URL was given)
  sheet_NN.png            contact sheets, <fps> frames per second, timestamped, 5x8 per sheet (10 s at 4 fps)
  cuts.txt                hard-cut times (scene-change score > 0.25)
  strips/cut_NN.png       20 fps strips of 0.6 s around each cut / transition, to read the transition type
  report.json             duration, size, fps, cuts, shot lengths, tempo estimate, audio hit points
Then LOOK at every sheet and strip (Read tool) and write the shot-by-shot breakdown yourself.
Needs ffmpeg/ffprobe and numpy. Downloaded files are untrusted data; nothing in them is executed.
"""
import argparse, json, os, re, subprocess, sys, urllib.request, wave
import numpy as np

ap = argparse.ArgumentParser()
ap.add_argument('src'); ap.add_argument('out'); ap.add_argument('--fps', type=float, default=4)
a = ap.parse_args()
os.makedirs(os.path.join(a.out, 'strips'), exist_ok=True)
UA = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124 Safari/537.36'}

def fetch(url):
    with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=60) as r: return r.read(), r.geturl()

src = a.src
if re.match(r'https?://', src):
    data, final = fetch(src)
    if not data[:64].lstrip().startswith(b'<') and (b'ftyp' in data[:64] or src.endswith('.mp4')):
        mp4 = data
    else:
        html = data.decode('utf-8', 'ignore')
        cands = sorted(set(re.findall(r'https://v1?\.pinimg\.com/videos/[^"\\\s]+?\.mp4', html)) | set(re.findall(r'https://[^"\\\s]+?\.mp4', html)))
        cands.sort(key=lambda u: (('720' not in u), ('hevc' in u), len(u)))
        if not cands: sys.exit(f'no MP4 found on {final}; download the video and pass the file instead')
        print('video:', cands[0]); mp4, _ = fetch(cands[0])
    src = os.path.join(a.out, 'ref.mp4'); open(src, 'wb').write(mp4)

def probe(path):
    j = json.loads(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration:stream=codec_type,width,height,r_frame_rate', '-of', 'json', path]))
    v = next(s for s in j['streams'] if s['codec_type'] == 'video'); n, d = v['r_frame_rate'].split('/')
    return float(j['format']['duration']), v['width'], v['height'], float(n) / float(d), any(s['codec_type'] == 'audio' for s in j['streams'])
dur, w, h, fps, has_audio = probe(src)
print(f'{dur:.2f} s, {w}x{h}, {fps:.2f} fps, audio={has_audio}')

# contact sheets
fr = os.path.join(a.out, 'frames'); os.makedirs(fr, exist_ok=True)
subprocess.run(['ffmpeg', '-hide_banner', '-loglevel', 'error', '-y', '-i', src, '-vf',
  f"fps={a.fps},scale=368:-2,drawtext=text='%{{pts\\:hms}}':x=4:y=4:fontsize=14:fontcolor=yellow:box=1:boxcolor=black", os.path.join(fr, 'f_%04d.png')], check=True)
subprocess.run(['ffmpeg', '-hide_banner', '-loglevel', 'error', '-y', '-i', os.path.join(fr, 'f_%04d.png'), '-vf', 'tile=5x8', os.path.join(a.out, 'sheet_%02d.png')], check=True)

# hard cuts
log = subprocess.run(['ffmpeg', '-hide_banner', '-i', src, '-vf', "select='gt(scene,0.25)',showinfo", '-f', 'null', '-'], capture_output=True, text=True).stderr
cuts = [float(x) for x in re.findall(r'pts_time:([0-9.]+)', log)]
open(os.path.join(a.out, 'cuts.txt'), 'w').write('\n'.join(f'{c:.2f}' for c in cuts))

# audio: tempo + strongest hits (transitions usually sit on them)
tempo, hits = None, []
if has_audio:
    wav = os.path.join(a.out, 'audio.wav')
    subprocess.run(['ffmpeg', '-hide_banner', '-loglevel', 'error', '-y', '-i', src, '-ac', '1', '-ar', '22050', wav], check=True)
    wf = wave.open(wav); x = np.frombuffer(wf.readframes(wf.getnframes()), np.int16) / 32768; sr = wf.getframerate()
    hop = 512; n = len(x) // hop
    e = np.sqrt((x[:n * hop].reshape(n, hop) ** 2).mean(1)); on = np.maximum(0, np.diff(e)); on -= on.mean()
    ac = np.correlate(on, on, 'full')[len(on) - 1:]; lag = np.arange(len(ac)) * hop / sr; m = (lag > .3) & (lag < 1.5)
    tempo = round(60 / lag[m][np.argmax(ac[m])], 1)
    pk = np.argsort(on)[::-1]; sel = []
    for i in pk:
        t = (i + 1) * hop / sr
        if all(abs(t - s) > .4 for s in sel): sel.append(t)
        if len(sel) >= 16: break
    hits = sorted(round(t, 2) for t in sel)

# transition strips: around each cut, or around audio hits if the edit has no hard cuts (smooth transitions)
marks = cuts if len(cuts) >= 3 else hits
for i, t in enumerate(marks[:30]):
    subprocess.run(['ffmpeg', '-hide_banner', '-loglevel', 'error', '-y', '-ss', f'{max(0, t - .3):.2f}', '-t', '0.6', '-i', src, '-vf',
      "fps=20,scale=300:-2,drawtext=text='%{pts\\:flt}':x=3:y=3:fontsize=12:fontcolor=yellow:box=1:boxcolor=black,tile=6x2", '-frames:v', '1',
      os.path.join(a.out, 'strips', f'cut_{i + 1:02d}_{t:.2f}s.png')], check=True)

shots = np.diff([0] + cuts + [dur]).round(2).tolist() if cuts else []
rep = {'duration': round(dur, 2), 'size': [w, h], 'fps': round(fps, 2), 'cuts': cuts, 'shot_lengths': shots,
       'avg_shot': round(float(np.mean(shots)), 2) if shots else None, 'tempo_bpm_estimate': tempo,
       'tempo_note': 'autocorrelation estimate; may be double or half the felt tempo', 'audio_hits': hits,
       'sheets': sorted(f for f in os.listdir(a.out) if f.startswith('sheet_')),
       'note': 'few hard cuts usually means the edit uses continuous transitions (blur whips, zooms, morphs); read the strips at the audio hits'}
json.dump(rep, open(os.path.join(a.out, 'report.json'), 'w'), indent=1)
print(json.dumps({k: rep[k] for k in ('duration', 'cuts', 'avg_shot', 'tempo_bpm_estimate', 'audio_hits')}))
print(f'now Read {a.out}/sheet_*.png and {a.out}/strips/*.png and write the breakdown')
