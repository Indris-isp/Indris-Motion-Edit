"""Stills approval board for v3 (skill §7b): composes the listed output times with build.py and tiles them with labels."""
import os, subprocess, sys
from PIL import Image, ImageDraw, ImageFont
HERE = os.path.dirname(os.path.abspath(__file__))
FONT = os.path.join(HERE, '../../../video/fonts')
STILLS = [  # (output s, beat, scene, label)
    (0.30, 'B1', 'roto + captions', 'Hook: "I\'m gonna give you…"'), (0.85, 'B1', 'roto', '$20 counts up behind her'),
    (2.00, 'B2', '3D studio table', '"you gotta pay me back with"'), (3.25, 'B2', '3D studio table', '+$5 drops on the $20'), (4.25, 'B2', '3D studio table', '"…interest" + coins'),
    (5.30, 'B3', 'host A-roll', 'Host: "Wow, I like THAT"'), (7.30, 'B4', 'roto', '"when I was 15" behind her'), (8.50, 'B5', 'punch-in', '"my DAD he would give me"'),
    (9.60, 'B6', '3D studio table', '"allowance"'), (11.00, 'B6', '3D studio table', '"I wasn\'t into shopping" (struck)'), (12.60, 'B6', '3D studio table', '"I would just buy BOOKS"'),
    (13.80, 'B7', 'A-roll', '"therefore I SAVED…"'), (16.20, 'B8', 'punch-in', '"my FRIENDS and my FAMILY"'),
    (18.70, 'B9', '3D desk: calendar', '"they ran OUT of money"'), (20.10, 'B9', '3D desk: calendar', 'days cross out'), (21.50, 'B9', '3D desk: calendar', '"in the MIDDLE of the month"'),
    (24.90, 'B11', 'CU', '"guess what I DID?"'), (27.30, 'B13', '3D desk: loan book', '"but they had to pay…"'), (28.45, 'B13', '3D desk: loan book', '"+ interest" sticker'),
    (29.10, 'B14', 'host', 'Host laughs'), (31.40, 'B16', 'punch-in', '"he KNOCKED on my room DOOR"'), (34.10, 'B17', 'roto', '"I need $20" behind her'),
    (40.00, 'B20', 'CU', '"you still have all those MONEY?"'),
    (46.10, 'B24', '3D desk: loan book', '"I said DADDY remember"'), (47.50, 'B24', '3D desk: loan book', '"you owe me $20"'), (49.40, 'B24', '3D desk: loan book', '"and plus $5 for interest"'),
    (53.10, 'B26', '3D desk: loan book', '"but he DIDN\'T give me back"'), (54.35, 'B26', '3D desk: loan book', '"my INTEREST": struck, UNPAID'),
    (55.40, 'B27', 'CU', '"I\'m like COME ON"'), (56.10, 'B28', '3D desk: loan book', '"so that was my FIRST…"'), (57.00, 'B28', '3D desk: loan book', 'First business label slams'),
    (58.70, 'B28', '3D desk: loan book', '"entrepreneurial BUSINESS"'), (60.00, 'B29', 'A-roll', '"but I didn\'t know it was called"'), (61.30, 'B30', 'roto', 'ENTREPRENEURSHIP behind her'),
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
    d.text((20, 30), f'Dad interest v3 · stills {p}/{len(pages)} · built on the reviewed income-first kit', font=f(700, 40), fill=(242, 195, 91))
    for k, (t, beat, scene, label) in enumerate(items):
        x, y = 20 + (k % COLS) * (TW + 20), 100 + (k // COLS) * (TH + LH + 20)
        key = min(files, key=lambda v: abs(v - t))
        im.paste(Image.open(files[key]).convert('RGB').resize((TW, TH), Image.LANCZOS), (x, y))
        d.text((x, y + TH + 10), f'{beat} · {t:05.2f}s · {scene}', font=f(700, 21), fill=(242, 195, 91))
        d.text((x, y + TH + 40), label[:44], font=f(500, 21), fill=(235, 230, 222))
    out = os.path.join(HERE, f'../out/v3_stills_{p}.jpg'); im.save(out, quality=88); print(out)
