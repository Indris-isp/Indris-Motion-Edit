"""Stills approval board for v3 (skill §7b): composes the listed output times with build.py and tiles them with labels."""
import os, subprocess, sys
from PIL import Image, ImageDraw, ImageFont
HERE = os.path.dirname(os.path.abspath(__file__))
FONT = os.path.join(HERE, '../../../video/fonts')
STILLS = [  # AI beats (layered: person and background move separately)
    (8.40, 'B5', 'AI: dad hands her the allowance', '"my DAD"'), (9.10, 'B5', 'AI: dad hands her the allowance', '"he would give me"'),
    (12.50, 'B8', 'AI: her with an armful of books', '"I would just buy BOOKS" (word behind her)'),
    (22.40, 'B12', 'AI: friends at the lockers', '"they came to me for…"'), (23.50, 'B12', 'AI: friends at the lockers', '"…MONEY"'),
    (31.00, 'B18', 'AI: dad at her bedroom door', 'KNOCK (behind him)'), (32.10, 'B18', 'AI: dad at her bedroom door', 'KNOCK KNOCK'),
    (36.30, 'B20', 'real footage: dollar bills', '"I went in my DRAWER"'),
    (56.60, 'B28', 'AI: her as a young entrepreneur', 'FIRST behind her'), (58.70, 'B28', 'AI: her as a young entrepreneur', 'FIRST BUSINESS'),
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
    d.text((20, 30), f'Dad interest v4 · AI images for the relatable beats · stills {p}/{len(pages)}', font=f(700, 40), fill=(242, 195, 91))
    for k, (t, beat, scene, label) in enumerate(items):
        x, y = 20 + (k % COLS) * (TW + 20), 100 + (k // COLS) * (TH + LH + 20)
        key = min(files, key=lambda v: abs(v - t))
        im.paste(Image.open(files[key]).convert('RGB').resize((TW, TH), Image.LANCZOS), (x, y))
        d.text((x, y + TH + 10), f'{beat} · {t:05.2f}s · {scene}', font=f(700, 21), fill=(242, 195, 91))
        d.text((x, y + TH + 40), label[:44], font=f(500, 21), fill=(235, 230, 222))
    out = os.path.join(HERE, f'../out/v4_ai_stills_{p}.jpg'); im.save(out, quality=88); print(out)
