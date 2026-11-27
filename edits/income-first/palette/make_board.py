"""Palette board: each 3-colour option from palettes.json applied to three real frames of the raw cut.

    python3 palette/make_board.py      (run from edits/income-first, after raw_cut.py)
"""
import json, os, subprocess, tempfile, textwrap
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter

HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(HERE)
F = os.path.join(ROOT, '../../video/fonts/')
def font(n, s): return ImageFont.truetype(F + n, s)

J = json.load(open(os.path.join(HERE, 'palettes.json'))); NEG = J['negative']
frames = []
for t in [9.0, 30.5, 47.0]:
    p = os.path.join(tempfile.gettempdir(), f'pal_{t}.png')
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-ss', str(t), '-i', os.path.join(ROOT, 'out/income_first_RAW_1080x1920.mp4'), '-frames:v', '1', p], check=True)
    frames.append(Image.open(p).convert('RGB'))
SC = [('brings you', [('income first', 'acc')]), ('one of those', [('starving', 'neg'), ('actors', 'acc')]), ('take care', [('of you', 'acc')])]


def mock(fr, c, k):
    im = fr.resize((360, 640), Image.LANCZOS); a = np.asarray(im, np.float32); y = np.linspace(0, 1, 640)[:, None, None]
    im = Image.fromarray((a * (1 - 0.55 * np.clip((y - 0.55) / 0.35, 0, 1))).astype(np.uint8)).convert('RGBA')
    txt = c.get('Text', c.get('Cream', '#F2EEE8')); run, keys = SC[k]; kf = font('InstrumentSerif-Italic.ttf', 54)
    ImageDraw.Draw(im).text((180, 452), run, font=font('Inter-500.ttf', 22), anchor='mm', fill=txt)
    total = sum(kf.getlength(w) for w, _ in keys) + kf.getlength(' ') * (len(keys) - 1); x = 180 - total / 2
    g = Image.new('RGBA', im.size, (0, 0, 0, 0)); t = Image.new('RGBA', im.size, (0, 0, 0, 0))
    for w, role in keys:
        col = NEG if role == 'neg' else c['Accent']
        for layer in (g, t): ImageDraw.Draw(layer).text((x, 492), w, font=kf, anchor='lm', fill=col)
        x += kf.getlength(w + ' ')
    im.alpha_composite(g.filter(ImageFilter.GaussianBlur(9))); im.alpha_composite(t)
    if 'Warm' in c and k == 0:
        d = ImageDraw.Draw(im); d.rounded_rectangle((110, 560, 250, 596), 18, fill=c['Warm'])
        d.text((180, 578), 'INCOME', font=font('Inter-800.ttf', 20), anchor='mm', fill=c['Base'])
    return im.convert('RGB')


rows = []
for p in J['palettes']:
    c = p['colors']; base = c['Base']; txtc = c.get('Text', c.get('Cream', '#F2EEE8'))
    row = Image.new('RGB', (1200, 520), base); d = ImageDraw.Draw(row)
    d.text((40, 36), f"{p['id']}  {p['name']}", font=font('Inter-700.ttf', 40), fill=txtc)
    lines = textwrap.wrap(p['why'], 52)
    for i, l in enumerate(lines): d.text((40, 96 + i * 28), l, font=font('Inter-400.ttf', 19), fill=txtc)
    y0 = 96 + len(lines) * 28 + 24
    for j, (role, h) in enumerate(list(c.items()) + [('Negative', NEG)]):
        x = 40 + j * 138; w = 120 if role != 'Negative' else 64
        d.rounded_rectangle((x, y0, x + w, y0 + 96), 16, fill=h, outline='#5a5f66' if role == 'Base' else None, width=2)
        d.text((x, y0 + 106), role, font=font('Inter-600.ttf', 17), fill=txtc); d.text((x, y0 + 130), h, font=font('Inter-500.ttf', 17), fill=txtc)
    d.text((40, y0 + 176), f"Accent on base: contrast {p['accent_on_base_contrast']}:1", font=font('Inter-500.ttf', 17), fill=txtc)
    for k in range(3): row.paste(mock(frames[k], c, k).resize((180, 320)), (640 + k * 185, 150))
    rows.append(row)
board = Image.new('RGB', (1200, 520 * len(rows)))
for i, r in enumerate(rows): board.paste(r, (0, i * 520))
board.save(os.path.join(HERE, 'palette_board.png'))
for p in J['palettes']:                         # per-palette mock strips for the planning page
    strip = Image.new('RGB', (3 * 360 + 2 * 12, 640), p['colors']['Base'])
    for k in range(3): strip.paste(mock(frames[k], p['colors'], k), (k * 372, 0))
    strip.resize((strip.width // 2, 320), Image.LANCZOS).save(os.path.join(HERE, f"mock_{p['id']}.jpg"), quality=86)
print('wrote palette_board.png + mock_*.jpg')
