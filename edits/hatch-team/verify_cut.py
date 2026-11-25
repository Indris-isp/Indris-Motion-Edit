"""Checks the cut: audio level at every cut edge, and what the assembled audio actually says (Whisper).
    HF_HUB_OFFLINE=1 python3 verify_cut.py
"""
import importlib.util, os, subprocess, sys
import numpy as np
HERE = os.path.dirname(os.path.abspath(__file__))
spec = importlib.util.spec_from_file_location('ed', os.path.join(HERE, 'edit.py'))
ed = importlib.util.module_from_spec(spec); sys.argv = ['edit.py']; spec.loader.exec_module(ed)
raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', ed.SRC, '-t', '160', '-f', 'f32le', '-ac', '1', '-ar', '16000', '-'],
                     capture_output=True, check=True).stdout
a = np.frombuffer(raw, np.float32)
lvl = lambda t0, t1: 20 * np.log10(np.sqrt((a[int(t0 * 16000):int(t1 * 16000)] ** 2).mean()) + 1e-9)
print('edge level = 20 ms just inside the cut (speech ~ -25 dB, silence < -40 dB)')
parts, bad = [], 0
for j, c in enumerate(ed.TL):
    s = c['src_in']; e = s + c['n'] / ed.FPS
    li, lo = lvl(s, s + .02), lvl(e - .02, e)
    flag = ' <-- check' if max(li, lo) > -32 else ''
    bad += bool(flag)
    txt = ' '.join(ed.WORDS[i]['w'] for i in range(c['i0'], c['i1'] + 1))
    print(f"cut {j:2d}  src {s:7.2f}-{e:7.2f}  in {li:6.1f} dB  out {lo:6.1f} dB{flag}   {txt}")
    parts.append(a[int(s * 16000):int(e * 16000)])
print(f'{bad} edges above -32 dB')
from faster_whisper import WhisperModel
m = WhisperModel('large-v3', device='cpu', compute_type='int8', cpu_threads=4)
segs, _ = m.transcribe(np.concatenate(parts), language='en', word_timestamps=True, beam_size=5, condition_on_previous_text=False)
print('\nTHE ROUGH CUT SAYS:')
for sg in segs: print(f'[{sg.start:6.2f}] {sg.text.strip()}')
