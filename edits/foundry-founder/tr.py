import sys,json
from faster_whisper import WhisperModel
m=WhisperModel("small.en",device="cpu",compute_type="int8")
segs,_=m.transcribe(__import__("numpy").fromfile(sys.argv[1],dtype="float32"),word_timestamps=True)
out=[]
for s in segs:
    print(f"{s.start:6.2f}-{s.end:6.2f} {s.text}",flush=True)
    for w in s.words: out.append({"w":w.word.strip(),"s":round(w.start,2),"e":round(w.end,2)})
json.dump(out,open(sys.argv[2],"w"))
