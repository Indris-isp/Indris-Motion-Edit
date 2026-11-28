"""Retimed voiceover: drops the false start, caps pauses (see retime.py), fades every join."""
import json, subprocess
import numpy as np
SR=16000
pcm=np.frombuffer(subprocess.run(['ffmpeg','-v','error','-i','src/vo.m4a','-ac','1','-ar',str(SR),'-f','f32le','-'],capture_output=True,check=True).stdout,dtype='float32')
def db(t):
    i=int(t*SR); x=pcm[max(i,0):i+160]
    return 20*np.log10(np.sqrt((x**2).mean())+1e-9) if len(x) else -99
def snap(t, step, quiet=-50, need=3, limit=0.5):
    # walk from t in direction step (10 ms) until `need` consecutive windows are below `quiet` dB
    run=0; u=t
    for _ in range(int(limit/0.01)):
        run = run+1 if db(u) < quiet else 0
        if run>=need: return u - step*(need-1)*0.01 if step<0 else u
        u += step*0.01
    return u
w = json.load(open('words_retimed.json'))
PRE, POST, TOTAL = 0.15, 0.28, 149.5
segs = []
for x in w:
    shift = round(x['s'] - x['ns'], 3)
    if segs and abs(segs[-1]['shift'] - shift) < 1e-3: segs[-1]['e'] = x['e']
    else: segs.append({'s': x['s'], 'e': x['e'], 'shift': shift})
f, labels = [], []
for i, g in enumerate(segs):
    a, b = snap(g['s'] - 0.02, -1), snap(g['e'], +1) + 0.06
    a = min(a, g['s'] - PRE) if i == 0 else a - 0.03
    d = b - a; at = a - g['shift']
    f.append(f"[0:a]atrim={a:.3f}:{b:.3f},asetpts=PTS-STARTPTS,afade=t=in:d=0.03,afade=t=out:st={d-0.06:.3f}:d=0.06,adelay={int(at*1000)}|{int(at*1000)}[s{i}]")
    labels.append(f"[s{i}]")
f.append(''.join(labels) + f"amix=inputs={len(labels)}:normalize=0,apad,atrim=0:{TOTAL},highpass=f=70,acompressor=threshold=-20dB:ratio=2.5:attack=8:release=120,loudnorm=I=-15:TP=-1.5:LRA=9[out]")
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', 'src/vo.m4a', '-filter_complex', ';'.join(f), '-map', '[out]', '-ar', '48000', '-ac', '2', 'out/vo_retimed.wav'], check=True)
print(len(segs), 'segments')
