"""Tile approval stills into a labelled board: python3 board.py <stillsDir> <out.jpg>"""
import sys
from PIL import Image, ImageDraw, ImageFont
d, out = sys.argv[1], sys.argv[2]
F = 'fonts/Geist-Variable.woff2'
import os
S = [  # t, beat, words, what happens
 (0.30,'A-roll','"Most developers…"','Close-up zooms out; caption lockup in the headroom'),
 (1.05,'Phone rises in','"…send PDF…"','Split done by 0.9 s; the email builds in line by line'),
 (1.70,'The PDF attaches','"…PDF brochures"','Big brochure card slides in; camera glides down to it'),
 (2.00,'Send glows','"…brochures"','Camera tracks to Send; it lights up and glows (Claude)'),
 (2.20,'Press','"to…"','Button presses; the screen dims'),
 (2.32,'Arrow flies up','"…every…"','The arrow leaves the button and flies out of the phone'),
 (2.60,'Delivered','"…every inquiry"','White flash → bright world; the arrow drops the PDF on each enquiry'),
 (2.95,'Every inquiry','"…inquiry."','All 4 enquiries now hold the PDF'),
 (3.90,'The buyer opens it','"The buyer opens it,"','Flash back; the brochure page wipes open on the buyer\'s phone'),
 (4.70,'The question','"…has a question,"','A big question bubble pops in; camera glides to it'),
 (5.30,'Offline','"…and there\'s…"','"Sales team is offline" fades in'),
 (6.40,'No reply','"…nobody to answer."','"No reply · 1h 50m" pops in; purple light dies; camera eases back'),
]
tw, th, pad, lab = 360, 640, 18, 140
cols = 6; rows = 2 if len(S) > 6 else 1
B = Image.new('RGB', (cols*(tw+pad)+pad, 110+rows*(th+lab+pad)+pad), '#FBFBFA'); g = ImageDraw.Draw(B)
def font(sz, w=500):
    f = ImageFont.truetype(F, sz)
    try: f.set_variation_by_axes([w])
    except Exception: pass
    return f
g.text((pad, 28), 'Livesites · Scene 1 v3 · slower and readable · send like the Claude video', font=font(40, 600), fill='#1D1D1F')
for i, (t, b, w, what) in enumerate(S):
    x = pad + (i % cols)*(tw+pad); y = 110 + (i//cols)*(th+lab+pad)
    im = Image.open(f'{d}/still_{t:.2f}.png').convert('RGB').resize((tw, th), Image.LANCZOS); B.paste(im, (x, y))
    g.text((x, y+th+10), f'{i+1}. {b}  ·  {t:.2f}s', font=font(20, 600), fill='#1D1D1F')
    g.text((x, y+th+40), w, font=font(19, 450), fill='#55545A')
    import textwrap
    for j, ln in enumerate(textwrap.wrap(what, 34)[:2]): g.text((x, y+th+68+j*24), ln, font=font(18, 450), fill='#8A8890')
B.save(out, quality=90); print(B.size)
