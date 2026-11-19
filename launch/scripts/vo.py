"""Generates the voiceover with Kokoro TTS (Apache-2.0), one clip per line.
Usage: python3 scripts/vo.py <model_dir> [voice] [speed]
Writes public/vo/<key>.wav and src/vo.json ({key: {text, dur, pause}}).
`pause` is the <break> from the script that follows the line.
"""
import sys, os, json
import numpy as np, soundfile as sf
from kokoro_onnx import Kokoro

MODEL_DIR = sys.argv[1]
VOICE = sys.argv[2] if len(sys.argv) > 2 else 'af_bella'
SPEED = float(sys.argv[3]) if len(sys.argv) > 3 else 1.05

# (key, spoken text, on-screen text, pause after in s) — straight from the script
LINES = [
    ('posting',  'Posting every day...',              0.3),
    ('nobody',   "and still nobody's watching?",       0.4),
    ('unedited', 'Unedited footage.',                  0.2),
    ('nobrand',  'No personal brand.',                 0.2),
    ('nostrat',  'No strategy.',                       0.5),
    ('meet',     'Meet I. S. P. Agency.',              0.4),
    ('editing',  'Video editing.',                     0.2),
    ('branding', 'Personal branding.',                 0.2),
    ('growth',   'Social media growth.',               0.3),
    ('allone',   'All in one team.',                   0.3),
    ('turn',     'We turn your raw footage into content that actually grows you.', 0.4),
    ('record',   'You record.',                        0.3),
    ('handle',   'We handle the rest.',                0.4),
    ('book',     'Book your free strategy call today.',0.2),
    ('bio',      'Link in bio.',                       0.0),
]

k = Kokoro(os.path.join(MODEL_DIR, 'kokoro.onnx'), os.path.join(MODEL_DIR, 'voices-v1.0.bin'))
lang = 'en-gb' if VOICE.startswith('b') else 'en-us'
out = {}
for key, text, pause in LINES:
    a, sr = k.create(text, voice=VOICE, speed=SPEED, lang=lang)
    a = np.asarray(a, dtype=np.float32)
    thr = 0.01 * np.abs(a).max(); nz = np.where(np.abs(a) > thr)[0]
    a = a[max(0, nz[0] - int(.01 * sr)): nz[-1] + int(.06 * sr)]
    sf.write(f'public/vo/{key}.wav', a, sr)
    out[key] = {'text': text, 'dur': round(len(a) / sr, 3), 'pause': pause}
    print(f'{key:9s} {out[key]["dur"]:.2f}s  {text}')
os.makedirs('src', exist_ok=True)
json.dump(out, open('src/vo.json', 'w'), indent=1)
print('total speech+pauses', round(sum(v['dur'] + v['pause'] for v in out.values()), 2))
