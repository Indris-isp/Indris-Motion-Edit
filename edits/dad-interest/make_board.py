"""Stills approval board (skill §7b): renders each listed beat moment at full resolution and tiles them with labels."""
import os, sys
sys.argv = ['edit.py']
import importlib.util
spec = importlib.util.spec_from_file_location('edit', os.path.join(os.path.dirname(os.path.abspath(__file__)), 'edit.py'))
e = importlib.util.module_from_spec(spec); spec.loader.exec_module(e)
from PIL import Image, ImageDraw

O = e.src_to_out
# (board, beat, source time, label, scene id)
STILLS = [
    (1, 'B1', 784.30, 'Hook: card pops in under the title', 'A8 + card'),
    (1, 'B1', 785.10, '"I\'m gonna give you $20" (count-up lands)', 'A8 + giant number'),
    (1, 'B2', 788.20, '"...with +$5 INTEREST" (letters assemble)', 'A8 + punch-in'),
    (1, 'B6', 735.60, '"allowance"', 'A5 tags'),
    (1, 'B6', 739.10, '"I wasn\'t into shopping" (struck)', 'A5 tags'),
    (1, 'B6', 744.00, '"I would just buy books"', 'A5 tags'),
    (1, 'B9', 749.70, '"they ran out of money" (entrance)', 'C5 desk: calendar'),
    (1, 'B9', 751.50, 'days cross out', 'C5 desk: calendar'),
    (1, 'B9', 753.10, '"in the MIDDLE of the month" (15th circled)', 'C5 desk: calendar'),
    (2, 'B13', 760.90, '"but they had to pay..." (loan book opens)', 'C5 desk: ledger 1'),
    (2, 'B13', 762.15, '"...INTEREST" (tick)', 'C5 desk: ledger 1'),
    (2, 'B24', 797.00, '"I said daddy, remember"', 'C5 desk: ledger 2'),
    (2, 'B24', 798.40, '"you owe me $20"', 'C5 desk: ledger 2'),
    (2, 'B24', 800.40, '"and plus $5 for interest"', 'C5 desk: ledger 2'),
    (2, 'B26', 804.60, '"but he DIDN\'T give me back" ($20 ticked)', 'C5 desk: ledger 3, cold'),
    (2, 'B26', 805.90, '"my INTEREST" ($5 struck, X)', 'C5 desk: ledger 3, cold'),
    (2, 'B28', 840.66, '"my FIRST..." (stamp slams)', 'C5 desk: ledger 4'),
    (2, 'B28', 842.70, '"entrepreneurial BUSINESS"', 'C5 desk: ledger 4'),
    (3, 'B3', 790.60, 'Host reaction "Wow, I like THAT"', 'A1 host'),
    (3, 'B4', 728.40, '"When I was 15" (count-up)', 'A2 giant number'),
    (3, 'B5', 733.30, '"my DAD he would give me"', 'A1 MCU punch-in'),
    (3, 'B14', 762.80, 'Host laughs', 'A1 host'),
    (3, 'B16', 773.95, '"he KNOCKED on my room DOOR"', 'A1 punch-in'),
    (3, 'B17', 776.05, '"I need $20"', 'A2 giant number'),
    (3, 'B20', 782.60, '"he said WAIT, ... all those MONEY?"', 'A1 CU'),
    (3, 'B27', 807.00, '"I\'m like COME ON" (red, cold)', 'A1 CU'),
    (3, 'B30', 845.10, '"ENTREPRENEURSHIP" (last frame)', 'A1 + letter assemble'),
]
TW, TH, LH = 432, 768, 120
os.makedirs(os.path.join(e.HERE, 'out/stills'), exist_ok=True)
boards = {}
for b, beat, ts, label, sid in STILLS:
    t = O(ts); oi = int(round(t * e.FPS))
    fr = e.render_frame(oi)
    fr.save(os.path.join(e.HERE, f'out/stills/{beat}_{t:05.2f}.png'))
    boards.setdefault(b, []).append((beat, t, label, sid, fr.resize((TW, TH), Image.LANCZOS)))
TITLES = {1: 'Board 1: designed beats (hook, tags, calendar)', 2: 'Board 2: designed beats (the loan book)', 3: 'Board 3: A-roll caption styles and giant numbers'}
for b, items in boards.items():
    cols = min(len(items), 5); rows = (len(items) + cols - 1) // cols
    bw, bh = cols * (TW + 24) + 24, rows * (TH + LH + 24) + 110
    im = Image.new('RGB', (bw, bh), (18, 16, 15)); d = ImageDraw.Draw(im)
    d.text((24, 34), TITLES[b], font=e.font('Inter-700.ttf', 44), fill=(243, 214, 160))
    for k, (beat, t, label, sid, th) in enumerate(items):
        x, y = 24 + (k % cols) * (TW + 24), 110 + (k // cols) * (TH + LH + 24)
        im.paste(th, (x, y))
        d.text((x, y + TH + 12), f'{beat}  ·  {t:05.2f} s  ·  {sid}', font=e.font('Inter-700.ttf', 22), fill=(243, 214, 160))
        words, line = label.split(), ''
        lines = []
        for w in words:
            if e.font('Inter-500.ttf', 22).getlength(line + ' ' + w) > TW: lines.append(line); line = w
            else: line = (line + ' ' + w).strip()
        lines.append(line)
        for j, ln in enumerate(lines[:3]):
            d.text((x, y + TH + 44 + j * 28), ln, font=e.font('Inter-500.ttf', 22), fill=(235, 230, 222))
    im.save(os.path.join(e.HERE, f'out/stills_board_{b}.jpg'), quality=90)
    print('board', b, im.size)
