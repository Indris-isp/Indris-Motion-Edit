"""Tile approval stills into a labelled board: python3 board.py <stillsDir> <out.jpg>"""
import sys
from PIL import Image, ImageDraw, ImageFont
d, out = sys.argv[1], sys.argv[2]
F = 'fonts/Geist-Variable.woff2'
S = [  # t, beat, words, what happens
 (0.45,'B1 · A-roll wide','"Most developers…"','Title lockup glides in'),
 (1.60,'B1','"…send PDF brochures"','PDF card glides in by her'),
 (2.95,'B1','"…to every inquiry."','Copies cascade, one per inquiry'),
 (3.45,'B2 · split','"The buyer…"','Phone glides in: PDF in chat'),
 (4.20,'B2','"…opens it,"','The static PDF opens'),
 (5.40,'B2','"has a question, and there\'s…"','Question sent, dots appear'),
 (6.20,'B2','"…nobody to answer."','Dots vanish: "no reply"'),
 (6.75,'B3 · graphic','"By the time…"','11:48 PM, buyer asked'),
 (7.30,'B3','"…your sales representative…"','Clock rolls through the night'),
 (8.90,'B3','"…calls the next day,"','10:30 AM, call card slides up'),
 (9.75,'B4 · A-roll punch-in','"the interest…"','Interest meter, live gradient'),
 (10.50,'B4','"…is gone."','Meter drains to grey'),
]
tw, th, pad, lab = 360, 640, 18, 120
cols = 6; rows = 2
B = Image.new('RGB', (cols*(tw+pad)+pad, 110+rows*(th+lab+pad)+pad), '#FBFBFA'); g = ImageDraw.Draw(B)
def font(sz, w=500):
    f = ImageFont.truetype(F, sz)
    try: f.set_variation_by_axes([w])
    except Exception: pass
    return f
g.text((pad, 28), 'Livesites · VSL opening sample (10.6 s): stills for approval', font=font(40, 600), fill='#1D1D1F')
for i, (t, b, w, what) in enumerate(S):
    x = pad + (i % cols)*(tw+pad); y = 110 + (i//cols)*(th+lab+pad)
    im = Image.open(f'{d}/still_{t:.2f}.png').convert('RGB').resize((tw, th), Image.LANCZOS); B.paste(im, (x, y))
    g.text((x, y+th+10), f'{i+1}. {b}  ·  {t:.2f}s', font=font(20, 600), fill='#1D1D1F')
    g.text((x, y+th+40), w, font=font(19, 450), fill='#55545A')
    g.text((x, y+th+70), what, font=font(19, 450), fill='#8A8890')
B.save(out, quality=90); print(B.size)
