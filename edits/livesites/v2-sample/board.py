"""Tile approval stills into a labelled board: python3 board.py <stillsDir> <out.jpg>"""
import sys
from PIL import Image, ImageDraw, ImageFont
d, out = sys.argv[1], sys.argv[2]
F = 'fonts/Geist-Variable.woff2'
S = [  # t, beat, words, what happens
 (0.50,'A-roll wide','"Most developers send…"','Clean shot, captions only'),
 (1.30,'3D · brochure world','"…PDF brochures…"','Flash cut; brochure glides in'),
 (1.90,'3D','"…PDF brochures…"','Camera drifts back, purple rim light'),
 (3.00,'3D','"…to every inquiry."','Copies peel off, curl, fly out'),
 (3.50,'Split · 3D phone','"The buyer…"','Phone rises in; PDF lands in chat'),
 (4.30,'Split · 3D phone','"…opens it,"','The static PDF opens'),
 (5.00,'Split · 3D phone','"…has a question…"','Question floats out in 3D'),
 (6.20,'Split · 3D phone','"…nobody to answer."','"No reply"; the purple light dies'),
 (6.75,'Night → morning','"By the time…"','Flash cut; 11:48 PM over a dark horizon'),
 (7.50,'Night → morning','"…your sales representative…"','Hours roll; the horizon rises'),
 (9.00,'Night → morning','"…calls the next day,"','10:30 AM; glass call card slides up'),
 (10.30,'A-roll punch-in','"…the interest is gone."','Clean shot, captions only'),
]
tw, th, pad, lab = 360, 640, 18, 120
cols = 6; rows = 2
B = Image.new('RGB', (cols*(tw+pad)+pad, 110+rows*(th+lab+pad)+pad), '#FBFBFA'); g = ImageDraw.Draw(B)
def font(sz, w=500):
    f = ImageFont.truetype(F, sz)
    try: f.set_variation_by_axes([w])
    except Exception: pass
    return f
g.text((pad, 28), 'Livesites · VSL opening sample (10.6 s): v2 stills, premium 3D motion', font=font(40, 600), fill='#1D1D1F')
for i, (t, b, w, what) in enumerate(S):
    x = pad + (i % cols)*(tw+pad); y = 110 + (i//cols)*(th+lab+pad)
    im = Image.open(f'{d}/still_{t:.2f}.png').convert('RGB').resize((tw, th), Image.LANCZOS); B.paste(im, (x, y))
    g.text((x, y+th+10), f'{i+1}. {b}  ·  {t:.2f}s', font=font(20, 600), fill='#1D1D1F')
    g.text((x, y+th+40), w, font=font(19, 450), fill='#55545A')
    g.text((x, y+th+70), what, font=font(19, 450), fill='#8A8890')
B.save(out, quality=90); print(B.size)
