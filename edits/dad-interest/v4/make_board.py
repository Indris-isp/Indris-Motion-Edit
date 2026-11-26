"""Stills approval board for v3 (skill §7b): composes the listed output times with build.py and tiles them with labels."""
import os, subprocess, sys
from PIL import Image, ImageDraw, ImageFont
HERE = os.path.dirname(os.path.abspath(__file__))
FONT = os.path.join(HERE, '../../../video/fonts')
STILLS = [  # (output s, beat, scene, label)
    (0.85, 'B1', 'roto', 'Hook: giant $20 behind her (count-up)'), (2.30, 'B2', 'B-roll: cash changes hands', '"you gotta pay me back with"'),
    (3.40, 'B2', 'B-roll: cash changes hands', '+$5 lands'), (4.25, 'B2', 'B-roll: cash changes hands', '"...interest" (gold serif)'),
    (5.30, 'B3', 'host', 'Host: "Wow, I like THAT"'), (7.35, 'B4', 'roto', 'AGE 15 behind her (count-up)'),
    (8.40, 'B5', 'B-roll: father + daughter', '"my DAD" editorial serif'), (9.10, 'B5', 'B-roll: father + daughter', '"he would give me"'),
    (9.80, 'B6', 'B-roll: kid counting cash', 'ALLOWANCE'), (11.38, 'B7', 'B-roll: shopping (B&W)', 'SHOPPING struck in red'),
    (12.50, 'B8', 'B-roll: book stack', '"I would just buy BOOKS"'), (13.80, 'B9', 'A-roll', '"therefore I SAVED"'),
    (16.20, 'B10', 'punch-in', '"my FRIENDS and my FAMILY"'), (19.60, 'B11', 'B-roll: empty wallet (cold)', '"they ran OUT OF MONEY"'),
    (20.95, 'B11', 'UI card: calendar', 'days cross out'), (21.60, 'B11', 'UI card: calendar', '15th circled: "in the MIDDLE of the month"'),
    (24.90, 'B13', 'CU', '"guess what I DID?"'), (27.40, 'B15', 'UI cards: loans', '"but they had to pay"'), (28.45, 'B15', 'UI cards: loans', '+ interest chips pop'),
    (29.10, 'B16', 'host', 'Host laughs'), (31.00, 'B18', 'B-roll: bedroom door', 'KNOCK'), (32.10, 'B18', 'B-roll: bedroom door', 'KNOCK KNOCK'),
    (34.10, 'B19', 'roto', '"I need $20" behind her'), (36.30, 'B20', 'B-roll: her cash', '"I went in my DRAWER"'),
    (38.00, 'B21', 'B-roll: counting cash', 'COUNTING all my money'), (40.00, 'B22', 'CU', '"you still have all those MONEY?"'),
    (46.20, 'B24', 'UI card: invoice', '"I said DADDY"'), (47.60, 'B24', 'UI card: invoice', '"you owe me $20" (total counts)'),
    (49.50, 'B24', 'UI card: invoice', '"+ $5 for interest" = $25'), (53.30, 'B26', 'UI card: declined', '"but he DIDN\'T"'),
    (54.40, 'B26', 'UI card: declined', '"my INTEREST": declined, red glow'), (55.40, 'B27', 'CU', '"I\'m like COME ON"'),
    (56.60, 'B28', 'B-roll: young entrepreneur (roto)', 'FIRST behind her'), (58.70, 'B28', 'B-roll: young entrepreneur (roto)', 'FIRST BUSINESS, "entrepreneurial"'),
    (61.30, 'B30', 'roto', 'ENTREPRENEURSHIP behind her'),
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
    d.text((20, 30), f'Dad interest v4 · premium redesign · stills {p}/{len(pages)}', font=f(700, 40), fill=(242, 195, 91))
    for k, (t, beat, scene, label) in enumerate(items):
        x, y = 20 + (k % COLS) * (TW + 20), 100 + (k // COLS) * (TH + LH + 20)
        key = min(files, key=lambda v: abs(v - t))
        im.paste(Image.open(files[key]).convert('RGB').resize((TW, TH), Image.LANCZOS), (x, y))
        d.text((x, y + TH + 10), f'{beat} · {t:05.2f}s · {scene}', font=f(700, 21), fill=(242, 195, 91))
        d.text((x, y + TH + 40), label[:44], font=f(500, 21), fill=(235, 230, 222))
    out = os.path.join(HERE, f'../out/v4_stills_{p}.jpg'); im.save(out, quality=88); print(out)
