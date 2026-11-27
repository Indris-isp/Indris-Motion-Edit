"""Stills approval board for v3 (skill §7b): composes the listed output times with build.py and tiles them with labels."""
import os, subprocess, sys
from PIL import Image, ImageDraw, ImageFont
HERE = os.path.dirname(os.path.abspath(__file__))
FONT = os.path.join(HERE, '../../../video/fonts')
STILLS = [  # v5 storyboard (Pinterest reference: lavender UI world, eased camera, push transitions)
    (0.85, 'B1', 'speaker + neon', "'I am gonna give you' · neon $20 counts up"), (2.90, 'B2', 'UI: request card', '"pay me back with +$5"'), (4.20, 'B2', 'UI: request card', 'pull-back reveals "interest", circled'),
    (5.30, 'B3', 'host', 'Host: "Wow, I like THAT"'), (7.35, 'B4', 'speaker + neon', 'neon 15'), (8.90, 'B5', 'cut-out on gradient', '"my DAD" circled, Dad behind them'),
    (10.70, 'B6', 'UI: checklist', 'shopping x, girly stuff x'), (12.60, 'B6', 'UI: checklist', 'BOOKS check, "books" circled'), (13.80, 'B7', 'speaker', '"therefore I SAVED"'),
    (19.40, 'B9', 'UI: calendar', 'days cross out, wallet $0'), (21.50, 'B9', 'UI: calendar', '15th circled, "middle"'), (23.40, 'B10', 'UI: messages', 'friends ask to borrow'),
    (24.90, 'B11', 'speaker CU', '"guess what I DID?"'), (28.30, 'B13', 'UI: loans', '+ interest chips, "interest" circled'), (29.10, 'B14', 'host', 'Host laughs'),
    (31.90, 'B16', 'cut-out on gradient', 'dad: knock knock'), (34.10, 'B17', 'speaker + neon', '"I need" · neon $20'), (36.20, 'B18', 'UI: photo cards', 'real money photos fly in, "drawer"'),
    (38.30, 'B18', 'UI: photo cards', '"started COUNTING"'), (40.00, 'B19', 'speaker CU', '"you still have all those MONEY?"'), (47.60, 'B21', 'UI: invoice', '"you owe me $20" (total counts)'),
    (49.50, 'B21', 'UI: invoice', '+$5 = $25, pull-back reveals "$25"'), (54.30, 'B23', 'UI: declined', 'interest declined, red glow'), (55.40, 'B24', 'speaker CU', "'I am like COME ON'"),
    (57.60, 'B25', 'cut-out on gradient', '"my FIRST" circled, chips'), (61.30, 'B27', 'speaker + neon', 'neon ENTREPRENEURSHIP'), (1.95, 'T', 'push transition', 'vertical push + motion blur'),
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
    d.text((20, 30), f'Dad interest v5 · Pinterest-reference redesign · stills {p}/{len(pages)}', font=f(700, 40), fill=(242, 195, 91))
    for k, (t, beat, scene, label) in enumerate(items):
        x, y = 20 + (k % COLS) * (TW + 20), 100 + (k // COLS) * (TH + LH + 20)
        key = min(files, key=lambda v: abs(v - t))
        im.paste(Image.open(files[key]).convert('RGB').resize((TW, TH), Image.LANCZOS), (x, y))
        d.text((x, y + TH + 10), f'{beat} · {t:05.2f}s · {scene}', font=f(700, 21), fill=(242, 195, 91))
        d.text((x, y + TH + 40), label[:44], font=f(500, 21), fill=(235, 230, 222))
    out = os.path.join(HERE, f'../out/v5_stills_{p}.jpg'); im.save(out, quality=88); print(out)
