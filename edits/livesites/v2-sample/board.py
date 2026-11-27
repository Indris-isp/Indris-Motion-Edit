"""Tile approval stills into a labelled board: python3 board.py <stillsDir> <out.jpg>"""
import sys
from PIL import Image, ImageDraw, ImageFont
d, out = sys.argv[1], sys.argv[2]
F = 'fonts/Geist-Variable.woff2'
import os
S = [  # t, beat, words, what happens
 (0.25,'A-roll · caption lockup','"Most…"','Small light word rises in, in the headroom'),
 (0.60,'A-roll · caption lockup','"…developers…"','Keyword big + bold under it (R8 stack)'),
 (0.95,'A-roll · caption lockup','"…send"','Last word offset right; camera zooming out'),
 (1.85,'Split · karaoke line','"PDF brochures"','Keywords bold in the brand gradient'),
 (2.75,'Split · karaoke line','"to every inquiry."','Words rise in one by one as spoken'),
 (3.75,'Split · karaoke line','"The buyer opens…"','White words with a soft glow; keyword in purple'),
 (4.75,'Split · karaoke line','"has a question,"','Pill title + purple status tag (R8 layout)'),
 (5.70,'Split · karaoke line','"and there\'s nobody"','Pill turns grey: no one answers'),
 (6.35,'Split · karaoke line','"to answer."','Screen locks; line ends the scene'),
]
tw, th, pad, lab = 360, 640, 18, 140
cols = 6; rows = 2 if len(S) > 6 else 1
B = Image.new('RGB', (cols*(tw+pad)+pad, 110+rows*(th+lab+pad)+pad), '#FBFBFA'); g = ImageDraw.Draw(B)
def font(sz, w=500):
    f = ImageFont.truetype(F, sz)
    try: f.set_variation_by_axes([w])
    except Exception: pass
    return f
g.text((pad, 28), 'Livesites · Scene 1 · captions in the Agni-reference style (A-roll lockup + karaoke line)', font=font(40, 600), fill='#1D1D1F')
for i, (t, b, w, what) in enumerate(S):
    x = pad + (i % cols)*(tw+pad); y = 110 + (i//cols)*(th+lab+pad)
    im = Image.open(f'{d}/still_{t:.2f}.png').convert('RGB').resize((tw, th), Image.LANCZOS); B.paste(im, (x, y))
    g.text((x, y+th+10), f'{i+1}. {b}  ·  {t:.2f}s', font=font(20, 600), fill='#1D1D1F')
    g.text((x, y+th+40), w, font=font(19, 450), fill='#55545A')
    import textwrap
    for j, ln in enumerate(textwrap.wrap(what, 34)[:2]): g.text((x, y+th+68+j*24), ln, font=font(18, 450), fill='#8A8890')
B.save(out, quality=90); print(B.size)
