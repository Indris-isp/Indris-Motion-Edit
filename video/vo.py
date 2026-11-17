"""Generates the voiceover with Kokoro (open-source TTS, Apache-2.0), one clip per line.
Usage: python3 vo.py <model_dir> [voice | blend:a*0.5+b*0.5] [speed]
Writes out/vo/<key>.wav (24 kHz mono) and out/vo/durations.json
"""
import sys, os, json
import soundfile as sf
import numpy as np
from kokoro_onnx import Kokoro

MODEL_DIR = sys.argv[1]
VOICE = sys.argv[2] if len(sys.argv) > 2 else 'af_heart'
SPEED = float(sys.argv[3]) if len(sys.argv) > 3 else 0.95

LINES = [
    ('hook', 'Your brand is always talking.'),
    ('why1', 'But every second a client spends confused'),
    ('why2', 'about what you do,'),
    ('prob', "is a second you're losing them."),
    ('count', 'Sixteen competitors. One scroll away.'),
    ('pain1', 'Losing trust.'),
    ('pain2', 'Losing leads.'),
    ('pain3', 'Losing deals.'),
    ('beat1', 'The...'),
    ('beat2', 'best...'),
    ('beat3', 'brands...'),
    ('contrast', "don't say more."),
    ('b1', "They're focused."),
    ('b2', 'Sharper.'),
    ('b3', 'Strategic.'),
    ('b4', 'They simplify the message.'),
    ('b5', 'They build trust instantly.'),
    ('b6', 'They make choosing easy.'),
    ('set', "Design isn't decoration."),
    ('punch', "It's strategy."),
    ('cta', "Let's build yours."),
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
for key, text in LINES:
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
