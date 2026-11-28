"""Tile approval stills into a labelled board: python3 board.py <stillsDir> <out.jpg>"""
import sys
from PIL import Image, ImageDraw, ImageFont
d, out = sys.argv[1], sys.argv[2]
F = 'fonts/Geist-Variable.woff2'
import os
S = [  # t, beat, words, what happens
 (0.30,'A-roll','"Most developers…"','Close-up zooms out; caption lockup'),
 (1.30,'Frosted UI','"…send PDF…"','Dark stage, soft purple light; the PDF card slides up'),
 (1.70,'Typing','"…PDF brochures"','A giant frosted message bar; the text types in'),
 (2.05,'Cursor clicks Send','"…brochures"','Cursor glides in and clicks; Send turns purple'),
 (2.28,'Whip','"to every…"','The message whips up and away with motion blur'),
 (2.70,'Full screen · delivered','"…every inquiry."','Flash to a light world; frosted pills get the PDF'),
 (3.25,'Phone whips in','"The buyer…"','Dark-mode iPhone whips in from the side'),
 (3.90,'Brochure + sticker','"…opens it,"','The page comes forward; STATIC PDF slaps on'),
 (4.80,'The question','"…has a question,"','Rahul\'s reply in frosted glass'),
 (5.30,'Offline','"…and there\'s…"','Question moves up; Skyline Sales: offline'),
 (5.75,'The wait','"…nobody…"','A huge thin timer counts the wait; UNANSWERED tag'),
 (6.40,'Cold','"…to answer."','Timer greys out at 1h 50m; the purple light drains'),
]
tw, th, pad, lab = 360, 640, 18, 140
cols = 6; rows = 2 if len(S) > 6 else 1
B = Image.new('RGB', (cols*(tw+pad)+pad, 110+rows*(th+lab+pad)+pad), '#FBFBFA'); g = ImageDraw.Draw(B)
def font(sz, w=500):
    f = ImageFont.truetype(F, sz)
    try: f.set_variation_by_axes([w])
    except Exception: pass
    return f
g.text((pad, 28), 'Livesites · Scene 1 v6.1 · R10 design language · new premium ending', font=font(40, 600), fill='#1D1D1F')
for i, (t, b, w, what) in enumerate(S):
    x = pad + (i % cols)*(tw+pad); y = 110 + (i//cols)*(th+lab+pad)
    im = Image.open(f'{d}/still_{t:.2f}.png').convert('RGB').resize((tw, th), Image.LANCZOS); B.paste(im, (x, y))
    g.text((x, y+th+10), f'{i+1}. {b}  ·  {t:.2f}s', font=font(20, 600), fill='#1D1D1F')
    g.text((x, y+th+40), w, font=font(19, 450), fill='#55545A')
    import textwrap
    for j, ln in enumerate(textwrap.wrap(what, 34)[:2]): g.text((x, y+th+68+j*24), ln, font=font(18, 450), fill='#8A8890')
B.save(out, quality=90); print(B.size)
