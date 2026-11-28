"""Stills approval board for v3 (skill §7b): composes the listed output times with build.py and tiles them with labels."""
import os, subprocess, sys
from PIL import Image, ImageDraw, ImageFont
HERE = os.path.dirname(os.path.abspath(__file__))
FONT = os.path.join(HERE, '../../../video/fonts')
STILLS = [  # v5.2: movie-style B-roll in place of the UI scenes; speaker, camera, captions unchanged
    (0.85, 'B1', 'speaker + neon', "'I am gonna give you' · neon $20"), (3.00, 'B2', 'B-roll: cash changes hands', '"pay me back with $5 interest"'),
    (5.30, 'B3', 'host', 'Host: "Wow, I like THAT"'), (7.35, 'B4', 'speaker + neon', 'neon 15'), (8.60, 'B5', 'B-roll: kid gets allowance', '"my dad, he would give me"'),
    (9.60, 'B6', 'B-roll: counting bills', '"allowance"'), (10.90, 'B6', 'B-roll: shopping (B&W)', '"I was not into shopping"'), (12.30, 'B6', 'B-roll: reading', '"I would just buy books"'),
    (13.80, 'B7', 'speaker', '"therefore I SAVED"'), (19.40, 'B9', 'B-roll: empty wallet', '"they ran out of money"'), (21.20, 'B9', 'B-roll: calendar', '"in the middle of the month"'),
    (22.80, 'B10', 'B-roll: hands out', '"they came to me for money"'), (24.90, 'B11', 'speaker CU', '"guess what I DID?"'), (27.70, 'B13', 'B-roll: wallet cash', '"they had to pay interest"'),
    (29.10, 'B14', 'host', 'Host laughs'), (31.40, 'B16', 'B-roll: the door', '"he knocked on my room door"'), (34.10, 'B17', 'speaker + neon', '"I need" · neon $20'),
    (35.60, 'B18', 'B-roll: the stash', '"I went in my drawer"'), (37.70, 'B18', 'B-roll: counting', '"started COUNTING"'), (40.00, 'B19', 'speaker CU', '"you still have all those MONEY?"'),
    (46.60, 'B21', 'B-roll: wallet dollars', '"daddy, you owe me $20"'), (48.60, 'B21', 'B-roll: bill hand to hand', '"plus $5 for interest"'), (53.60, 'B23', 'B-roll: upset by the window', '"didn\'t give me back my interest"'),
    (55.40, 'B24', 'speaker CU', "'I am like COME ON'"), (57.30, 'B25', 'B-roll: the boss', '"my first entrepreneurial business"'), (61.30, 'B27', 'speaker + neon', 'neon ENTREPRENEURSHIP'),
    (1.95, 'T', 'push transition', 'speaker pushes up into B-roll'),
]
if '--compose' in sys.argv:
    subprocess.run([sys.executable, os.path.join(HERE, 'build.py'), '--still', ','.join(f'{t:.2f}' for t, *_ in STILLS)], check=True)
f = lambda w, s: ImageFont.truetype(os.path.join(FONT, f'Inter-{w}.ttf'), s)
TW, TH, LH, COLS = 432, 768, 104, 6
files = {round(float(n[6:-4]), 2): os.path.join(HERE, 'out', n) for n in os.listdir(os.path.join(HERE, 'out')) if n.startswith('still_')}
pages = [STILLS[i:i + 12] for i in range(0, len(STILLS), 12)]
for p, items in enumerate(pages, 1):
    rows = (len(items) + COLS - 1) // COLS
    im = Image.new('RGB', (COLS * (TW + 20) + 20, rows * (TH + LH + 20) + 100), (18, 16, 15)); d = ImageDraw.Draw(im)
    d.text((20, 30), f'Dad interest v5 · movie B-roll · stills {p}/{len(pages)}', font=f(700, 40), fill=(242, 195, 91))
    for k, (t, beat, scene, label) in enumerate(items):
        x, y = 20 + (k % COLS) * (TW + 20), 100 + (k // COLS) * (TH + LH + 20)
        key = min(files, key=lambda v: abs(v - t))
        im.paste(Image.open(files[key]).convert('RGB').resize((TW, TH), Image.LANCZOS), (x, y))
        d.text((x, y + TH + 10), f'{beat} · {t:05.2f}s · {scene}', font=f(700, 21), fill=(242, 195, 91))
        d.text((x, y + TH + 40), label[:44], font=f(500, 21), fill=(235, 230, 222))
    out = os.path.join(HERE, f'../out/v5_stills_{p}.jpg'); im.save(out, quality=88); print(out)
