"""Tile approval stills into a labelled board: python3 board.py <stillsDir> <out.jpg>"""
import sys
from PIL import Image, ImageDraw, ImageFont
d, out = sys.argv[1], sys.argv[2]
F = 'fonts/Geist-Variable.woff2'
import os
S = [  # t, beat, words, what happens
 (0.10,'A-roll punch-in','"Most…"','Face-tracked close-up, caption in the headroom'),
 (0.60,'Zoom out','"…developers…"','Camera pulls back to the wide (0.85 s ease)'),
 (1.20,'Drag into split','"…send PDF…"','Video slides down; the stage is pulled in on top'),
 (1.60,'3D phone','"…PDF brochures"','Phone drops in: a new email + the PDF attached'),
 (1.90,'Camera tracks in','"…PDF brochures"','Push in on the attachment card'),
 (2.20,'Tap send','"…to every…"','Send lights up in the live gradient; sheet slides away'),
 (2.70,'Sent list','"…to every inquiry."','Camera pans down 12 sent rows'),
 (3.25,'Flip','"The buyer…"','Phone spins 360°: now it is the buyer\'s phone'),
 (3.80,'Buyer opens it','"…opens it,"','Unread mail → static PDF page opens'),
 (4.70,'The question','"…has a question,"','Reply sheet rises; question types in'),
 (5.70,'No reply','"…and there\'s nobody…"','Sent · seen · the clock runs · NO REPLY'),
 (6.35,'Screen locks','"…to answer."','Screen goes dark at 1:42 AM; purple light dies'),
]
tw, th, pad, lab = 360, 640, 18, 140
cols = 6; rows = 2
B = Image.new('RGB', (cols*(tw+pad)+pad, 110+rows*(th+lab+pad)+pad), '#FBFBFA'); g = ImageDraw.Draw(B)
def font(sz, w=500):
    f = ImageFont.truetype(F, sz)
    try: f.set_variation_by_axes([w])
    except Exception: pass
    return f
g.text((pad, 28), 'Livesites · Scene 1 storyboard · zoom out → drag split → 3D phone, camera tracks through the mail app', font=font(40, 600), fill='#1D1D1F')
for i, (t, b, w, what) in enumerate(S):
    x = pad + (i % cols)*(tw+pad); y = 110 + (i//cols)*(th+lab+pad)
    im = Image.open(f'{d}/still_{t:.2f}.png').convert('RGB').resize((tw, th), Image.LANCZOS); B.paste(im, (x, y))
    g.text((x, y+th+10), f'{i+1}. {b}  ·  {t:.2f}s', font=font(20, 600), fill='#1D1D1F')
    g.text((x, y+th+40), w, font=font(19, 450), fill='#55545A')
    import textwrap
    for j, ln in enumerate(textwrap.wrap(what, 34)[:2]): g.text((x, y+th+68+j*24), ln, font=font(18, 450), fill='#8A8890')
B.save(out, quality=90); print(B.size)
