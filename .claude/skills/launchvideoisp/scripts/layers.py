#!/usr/bin/env python3
"""Cut real UI screenshots into animatable layers.

  python3 layers.py grid <image> [out.png]
      Draws a labelled 10% grid over the image (writes <image>_grid.png). READ it to pick coordinates.

  python3 layers.py crop <image> <x%> <y%> <w%> <h%> <out.png> [--round 16] [--pad 0]
      Crops a region given in percent of the image (x, y = top-left). --round adds rounded,
      transparent corners (px at the source scale); --pad grows the box by N px on every side.

  python3 layers.py fit <image> <out.png> --max 2400
      Downscales a huge screenshot (keeps aspect) so it renders fast.

  python3 layers.py info <image>
      Prints the size.

Typical use: grid the product screenshot, Read the grid, then crop the pieces that should move on
their own (a toast, a stat card, a chart, a button, a sidebar) and list them as `layers` in brief.js
with their position as fractions of the screenshot.
"""
import sys
from PIL import Image, ImageDraw, ImageFont

def font(size):
    for f in ('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', '/System/Library/Fonts/Supplemental/Arial Bold.ttf', 'C:/Windows/Fonts/arialbd.ttf'):
        try: return ImageFont.truetype(f, size)
        except Exception: pass
    return ImageFont.load_default()

def grid(path, out=None):
    im = Image.open(path).convert('RGBA'); W, H = im.size
    ov = Image.new('RGBA', im.size, (0, 0, 0, 0)); d = ImageDraw.Draw(ov); f = font(max(14, W // 70))
    for i in range(1, 10):
        x, y = W * i // 10, H * i // 10
        d.line([(x, 0), (x, H)], fill=(255, 0, 90, 170), width=max(1, W // 900))
        d.line([(0, y), (W, y)], fill=(255, 0, 90, 170), width=max(1, W // 900))
        for (tx, ty, t) in ((x + 4, 4, f'{i * 10}%'), (4, y + 2, f'{i * 10}%')):
            bb = d.textbbox((tx, ty), t, font=f); d.rectangle(bb, fill=(255, 0, 90, 220)); d.text((tx, ty), t, fill='white', font=f)
    for i in range(1, 20, 2):  # 5% ticks
        x, y = W * i // 20, H * i // 20
        d.line([(x, 0), (x, H)], fill=(255, 0, 90, 60), width=1); d.line([(0, y), (W, y)], fill=(255, 0, 90, 60), width=1)
    out = out or path.rsplit('.', 1)[0] + '_grid.png'
    Image.alpha_composite(im, ov).convert('RGB').save(out); print(out, f'{W}x{H}')

def crop(path, x, y, w, h, out, rnd=0, pad=0):
    im = Image.open(path).convert('RGBA'); W, H = im.size
    box = [round(W * x / 100) - pad, round(H * y / 100) - pad, round(W * (x + w) / 100) + pad, round(H * (y + h) / 100) + pad]
    box = [max(0, box[0]), max(0, box[1]), min(W, box[2]), min(H, box[3])]
    c = im.crop(box)
    if rnd:
        m = Image.new('L', c.size, 0); ImageDraw.Draw(m).rounded_rectangle([0, 0, c.size[0] - 1, c.size[1] - 1], radius=rnd, fill=255)
        c.putalpha(m)
    c.save(out); print(out, f'{c.size[0]}x{c.size[1]}', 'box(px)=', box)

def fit(path, out, mx):
    im = Image.open(path); s = min(1, mx / max(im.size))
    im.resize((round(im.size[0] * s), round(im.size[1] * s)), Image.LANCZOS).save(out); print(out, im.size, '->', (round(im.size[0] * s), round(im.size[1] * s)))

if __name__ == '__main__':
    a = sys.argv[1:]
    if not a: sys.exit(__doc__)
    opt = lambda k, d: (float(a[a.index(k) + 1]) if k in a else d)
    if a[0] == 'grid': grid(a[1], a[2] if len(a) > 2 else None)
    elif a[0] == 'crop': crop(a[1], *map(float, a[2:6]), a[6], int(opt('--round', 0)), int(opt('--pad', 0)))
    elif a[0] == 'fit': fit(a[1], a[2], opt('--max', 2400))
    elif a[0] == 'info': print(Image.open(a[1]).size)
    else: sys.exit(__doc__)
