# Find speech segments at 1 ms resolution; silence = >= MIN_GAP ms below THRESH dBFS. Keep PAD ms either side.
import sys, json, wave, numpy as np
wav, out = sys.argv[1], sys.argv[2]
THRESH, MIN_GAP, PAD = float(sys.argv[3]), int(sys.argv[4]), int(sys.argv[5])
w=wave.open(wav); sr=w.getframerate(); a=np.frombuffer(w.readframes(w.getnframes()),dtype=np.int16).astype(float)/32768
hop=sr//1000; win=sr//100                         # 1 ms hop, 10 ms window
n=(len(a)-win)//hop
c=np.concatenate([[0],np.cumsum(a*a)])
e=(c[np.arange(n)*hop+win]-c[np.arange(n)*hop])/win
db=10*np.log10(e+1e-12)
loud=db>THRESH
# the 10 ms window at ms i covers i..i+10, so a frame is loud if any window touching it is loud
lm=np.zeros(n+10,bool)
for k in range(10): lm[k:k+n]|=loud
lm=lm[:n]
segs=[]; i=0
while i<n:
    if lm[i]:
        j=i
        while j<n and lm[j]: j+=1
        segs.append([i,j]); i=j
    else: i+=1
# merge segments separated by gaps shorter than MIN_GAP
m=[segs[0]]
for s in segs[1:]:
    if s[0]-m[-1][1] < MIN_GAP: m[-1][1]=s[1]
    else: m.append(s)
dur=len(a)/sr*1000
keep=[[max(0,s-PAD),min(int(dur),e+PAD)] for s,e in m]
# drop blips shorter than 40 ms (clicks)
keep=[k for k in keep if k[1]-k[0]-2*PAD>=40]
tot=sum(e-s for s,e in keep)
json.dump({"threshold_db":THRESH,"min_gap_ms":MIN_GAP,"pad_ms":PAD,"source_ms":round(dur),"kept_ms":tot,"segments_ms":keep},open(out,"w"),indent=1)
print(f"segments {len(keep)}  source {dur/1000:.3f}s -> kept {tot/1000:.3f}s  removed {(dur-tot)/1000:.3f}s")
