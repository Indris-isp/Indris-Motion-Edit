"""Generates the voiceover with Kokoro (open-source TTS, Apache-2.0), one clip per line.
Usage: python3 vo.py <model_dir> [voice | blend:a*0.5+b*0.5] [speed]
Writes out/vo/<key>.wav (24 kHz mono), out/vo/durations.json and out/vo/breaks.json
"""
import sys, os, json
import soundfile as sf
import numpy as np
from kokoro_onnx import Kokoro

MODEL_DIR = sys.argv[1]
VOICE = sys.argv[2] if len(sys.argv) > 2 else 'af_heart'
SPEED = float(sys.argv[3]) if len(sys.argv) > 3 else 0.95

# (key, spoken text, pause after the line in seconds — the script's <break time> tags)
# "I S P" is spelled with spaces so the TTS says the letters without sentence stops.
LINES = [
    ('hook1', 'Posting every day...', .3),
    ('hook2', "and still nobody's watching?", .4),
    ('p1', 'Unedited footage.', .2),
    ('p2', 'No personal brand.', .2),
    ('p3', 'No strategy.', .5),
    ('meet', 'Meet I S P Agency.', .4),
    ('s1', 'Video editing.', .2),
    ('s2', 'Personal branding.', .2),
    ('s3', 'Social media growth.', .3),
    ('team', 'All in one team.', .3),
    ('turn', 'We turn your raw footage into content that actually grows you.', .4),
    ('you1', 'You record.', .3),
    ('you2', 'We handle the rest.', .4),
    ('cta1', 'Book your free strategy call today.', .2),
    ('cta2', 'Link in bio.', 0),
]

k = Kokoro(os.path.join(MODEL_DIR, 'kokoro.onnx'), os.path.join(MODEL_DIR, 'voices-v1.0.bin'))
# blends: "blend:af_heart*0.5+af_bella*0.5" mixes voice styles by weight
if VOICE.startswith('blend:'):
    parts = [p.split('*') for p in VOICE[6:].split('+')]
    STYLE = sum(k.get_voice_style(v) * float(w) for v, w in parts)
    LANG = 'en-gb' if all(v.startswith('b') for v, _ in parts) else 'en-us'
else:
    STYLE, LANG = VOICE, ('en-gb' if VOICE.startswith('b') else 'en-us')
os.makedirs('out/vo', exist_ok=True)
dur = {}
for key, text, _ in LINES:
    audio, sr = k.create(text, voice=STYLE, speed=SPEED, lang=LANG)
    a = np.asarray(audio, dtype=np.float32)
    # trim leading/trailing silence
    thr = 0.01 * np.abs(a).max()
    nz = np.where(np.abs(a) > thr)[0]
    a = a[max(0, nz[0] - int(.01 * sr)): nz[-1] + int(.06 * sr)]
    sf.write(f'out/vo/{key}.wav', a, sr)
    dur[key] = round(len(a) / sr, 3)
    print(f'{key:9s} {dur[key]:.2f}s  {text}')
json.dump(dur, open('out/vo/durations.json', 'w'), indent=1)
json.dump({k: b for k, _, b in LINES}, open('out/vo/breaks.json', 'w'), indent=1)
