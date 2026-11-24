# Word-level transcript: python3 -I tx.py audio_16k_mono.wav words.json  (set HF_HUB_DISABLE_XET=1 if the model download fails)
import sys, json
from faster_whisper import WhisperModel
m = WhisperModel("small.en", device="cpu", compute_type="int8")
import wave, numpy as np
wf=wave.open(sys.argv[1]); a=np.frombuffer(wf.readframes(wf.getnframes()),dtype=np.int16).astype(np.float32)/32768
segs, info = m.transcribe(a, word_timestamps=True, beam_size=5)
out=[]
for s in segs:
    for w in s.words:
        out.append({"w":w.word.strip(),"s":round(w.start,2),"e":round(w.end,2)})
        print(f"{w.start:6.2f} {w.end:6.2f}  {w.word.strip()}")
json.dump(out, open(sys.argv[2],"w"), indent=1)
