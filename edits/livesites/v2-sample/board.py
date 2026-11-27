"""Tile approval stills into a labelled board: python3 board.py <stillsDir> <out.jpg>"""
import sys
from PIL import Image, ImageDraw, ImageFont
d, out = sys.argv[1], sys.argv[2]
F = 'fonts/Geist-Variable.woff2'
import os
S = [  # t, beat, words, what happens
 (0.30,'A-roll','"Most developers…"','Close-up zooms out; caption lockup'),
 (1.05,'Product shot','"…send PDF…"','Whole phone rises in, purple rim glow, light particles'),
 (1.60,'PDF lifts out','"…PDF brochures"','Attachment card lifts off the screen, phone falls out of focus'),
 (2.05,'Send bar lifts out','"…brochures"','Light sweeps along the bar; Send starts to glow'),
 (2.25,'Arrow flies','"to every…"','Button blooms, the arrow leaves with a light trail'),
 (2.70,'Full screen · delivered','"…every inquiry."','Flash → bright world; the PDF lands on each enquiry'),
 (3.30,'Full screen · buyer','"The buyer…"','Flash back; the buyer\'s phone with the brochure email'),
 (3.80,'Brochure lifts out','"…opens it,"','The brochure page lifts out big and sharp'),
 (4.80,'Question lifts out','"…has a question,"','The buyer\'s question rises in front, glowing edge'),
 (5.30,'Offline','"…and there\'s…"','"Sales team is offline" fades in'),
 (5.80,'No reply','"…nobody…"','"No reply · 1h 50m" pops in; the purple light drains'),
 (6.40,'End','"…to answer."','Camera eases back; the scene goes cold'),
]
tw, th, pad, lab = 360, 640, 18, 140
cols = 6; rows = 2 if len(S) > 6 else 1
B = Image.new('RGB', (cols*(tw+pad)+pad, 110+rows*(th+lab+pad)+pad), '#FBFBFA'); g = ImageDraw.Draw(B)
def font(sz, w=500):
    f = ImageFont.truetype(F, sz)
    try: f.set_variation_by_axes([w])
    except Exception: pass
    return f
g.text((pad, 28), 'Livesites · Scene 1 v4 · premium: glow, depth, lift-out cards', font=font(40, 600), fill='#1D1D1F')
for i, (t, b, w, what) in enumerate(S):
    x = pad + (i % cols)*(tw+pad); y = 110 + (i//cols)*(th+lab+pad)
    im = Image.open(f'{d}/still_{t:.2f}.png').convert('RGB').resize((tw, th), Image.LANCZOS); B.paste(im, (x, y))
    g.text((x, y+th+10), f'{i+1}. {b}  ·  {t:.2f}s', font=font(20, 600), fill='#1D1D1F')
    g.text((x, y+th+40), w, font=font(19, 450), fill='#55545A')
    import textwrap
    for j, ln in enumerate(textwrap.wrap(what, 34)[:2]): g.text((x, y+th+68+j*24), ln, font=font(18, 450), fill='#8A8890')
B.save(out, quality=90); print(B.size)
