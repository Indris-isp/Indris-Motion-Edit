"""Stills approval board for v3 (skill §7b): composes the listed output times with build.py and tiles them with labels."""
import os, subprocess, sys
from PIL import Image, ImageDraw, ImageFont
HERE = os.path.dirname(os.path.abspath(__file__))
FONT = os.path.join(HERE, '../../../video/fonts')
STILLS = [  # coloured text with the new light glow
    (4.25, 'B2', 'B-roll', 'gold serif "interest"'), (7.35, 'B4', 'roto', 'gold 15'), (13.80, 'B9', 'A-roll caption', 'gold "saved"'),
    (20.10, 'B11', 'B-roll', 'gold MONEY'), (23.50, 'B12', 'AI image', 'gold serif "money"'), (32.10, 'B18', 'AI image', 'gold KNOCK'),
    (49.50, 'B24', 'UI card', 'gold serif "$5 / interest"'), (55.40, 'B27', 'A-roll caption', 'red "come on"'), (58.70, 'B28', 'AI image', 'gold BUSINESS'),
]
if '--compose' in sys.argv:
    subprocess.run([sys.executable, os.path.join(HERE, 'build.py'), '--still', ','.join(f'{t:.2f}' for t, *_ in STILLS)], check=True)
f = lambda w, s: ImageFont.truetype(os.path.join(FONT, f'Inter-{w}.ttf'), s)
TW, TH, LH, COLS = 432, 768, 104, 5
files = {round(float(n[6:-4]), 2): os.path.join(HERE, 'out', n) for n in os.listdir(os.path.join(HERE, 'out')) if n.startswith('still_')}
pages = [STILLS[i:i + 12] for i in range(0, len(STILLS), 12)]
for p, items in enumerate(pages, 1):
    rows = (len(items) + COLS - 1) // COLS
    im = Image.new('RGB', (COLS * (TW + 20) + 20, rows * (TH + LH + 20) + 100), (18, 16, 15)); d = ImageDraw.Draw(im)
    d.text((20, 30), f'Dad interest v4 · light glow on the coloured text · stills {p}/{len(pages)}', font=f(700, 40), fill=(242, 195, 91))
    for k, (t, beat, scene, label) in enumerate(items):
        x, y = 20 + (k % COLS) * (TW + 20), 100 + (k // COLS) * (TH + LH + 20)
        key = min(files, key=lambda v: abs(v - t))
        im.paste(Image.open(files[key]).convert('RGB').resize((TW, TH), Image.LANCZOS), (x, y))
        d.text((x, y + TH + 10), f'{beat} · {t:05.2f}s · {scene}', font=f(700, 21), fill=(242, 195, 91))
        d.text((x, y + TH + 40), label[:44], font=f(500, 21), fill=(235, 230, 222))
    out = os.path.join(HERE, f'../out/v4_glow_stills_{p}.jpg'); im.save(out, quality=88); print(out)
