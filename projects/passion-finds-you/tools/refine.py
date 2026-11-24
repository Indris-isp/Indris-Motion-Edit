# Refine Whisper word edges to 1 ms using the energy envelope, then map to the silence-cut timeline.
import sys, json, wave, numpy as np
wav, words_p, cuts_p, out = sys.argv[1:5]
w=wave.open(wav); sr=w.getframerate(); a=np.frombuffer(w.readframes(w.getnframes()),dtype=np.int16).astype(float)/32768
hop=sr//1000; win=sr//200   # 5 ms window, 1 ms hop
n=(len(a)-win)//hop; c=np.concatenate([[0],np.cumsum(a*a)])
db=10*np.log10((c[np.arange(n)*hop+win]-c[np.arange(n)*hop])/win+1e-12)
loud=db>-45
W=json.load(open(words_p)); cuts=json.load(open(cuts_p))["segments_frame_snapped_ms"]
def onset(t, lo, hi):           # first loud ms in [lo,hi] at/after a quiet run
    lo,hi=max(0,lo),min(n-1,hi)
    idx=np.nonzero(loud[lo:hi])[0]
    return lo+idx[0] if len(idx) else t
def offset(t, lo, hi):
    lo,hi=max(0,lo),min(n-1,hi)
    idx=np.nonzero(loud[lo:hi])[0]
    return lo+idx[-1]+1 if len(idx) else t
R=[]
for i,x in enumerate(W):
    s,e=int(round(x["s"]*1000)),int(round(x["e"]*1000))
    prev_e=int(round(W[i-1]["e"]*1000)) if i else -10**9
    next_s=int(round(W[i+1]["s"]*1000)) if i+1<len(W) else 10**9
    # quiet gap before this word? -> snap start to true onset
    if s-prev_e>=40 or i==0 or not loud[max(0,s-30):s].any():
        lo=max(prev_e, s-400) if i else 0
        s2=onset(s, lo, min(e, s+400))
    else: s2=s
    if next_s-e>=40 or i==len(W)-1 or not loud[e:e+30].any():
        e2=offset(e, max(s2+20,e-400), min(next_s, e+400) if i+1<len(W) else e+400)
    else: e2=e
    R.append({"i":i,"word":x["w"],"src_start_ms":int(s2),"src_end_ms":int(max(e2,s2+20))})
# map to cut timeline
acc=[];t=0
for s,e in cuts: acc.append((s,e,t)); t+=e-s
def to_cut(ms):
    for s,e,o in acc:
        if s<=ms<=e: return o+ms-s
    # inside a removed gap: clamp to nearest kept edge
    best=min(acc,key=lambda k: min(abs(ms-k[0]),abs(ms-k[1])))
    s,e,o=best; return o if abs(ms-s)<abs(ms-e) else o+e-s
for r in R:
    r["cut_start_ms"]=to_cut(r["src_start_ms"]); r["cut_end_ms"]=to_cut(r["src_end_ms"])
json.dump(R,open(out,"w"),indent=1)
for r in R: print(f'{r["i"]:3d} {r["word"]:12s} src {r["src_start_ms"]:6d}-{r["src_end_ms"]:6d}  cut {r["cut_start_ms"]:6d}-{r["cut_end_ms"]:6d}')
