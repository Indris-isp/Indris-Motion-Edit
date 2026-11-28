"""Builds out/stills_board.png: the reel's frame next to 4 ISP stills per scene (run `node render.cjs --still ...` first)."""
from PIL import Image, ImageDraw, ImageFont
F = lambda s, w=600: ImageFont.truetype(f'../../video/fonts/Inter-{w}.ttf', s)
ROWS = [
 ("1  Meet", 0.9, [0.5, 0.95, 1.2, 1.6], 'Letters M · e · e · t and coloured dots fly together into a small "Meet" with a dot line'),
 ("2  ISP logo", 2.2, [1.85, 1.95, 2.1, 2.5], 'Pixel-glitch cut to lavender ripples; ISP mark + "Agency" reveal; green tile grows out of the mark'),
 ("3  ISP + socials", 3.0, [2.6, 2.75, 3.1, 3.45], "ISP tile in the middle; platforms pop out on a 3×3 grid and step round (icons on sides, dots on corners)"),
 ("4  Let's make your video better", 4.3, [3.85, 4.0, 4.2, 4.5], 'Flash to light; typed word by word, the line re-centres; "better" in bold'),
 ("5  Instagram · YouTube · Facebook · TikTok", 6.3, [5.1, 5.7, 6.3, 6.9], "Colour screen per platform: ISP tile ··· platform circle, name underneath, dot rows"),
 ("6  ISP Agency · All in one place, less pressure", 8.0, [7.2, 7.4, 7.6, 8.1], '"ISP Agency ✓" tag, then the lines type in grey and darken'),
 ("7  ISP Agency · Video is ready", 8.8, [8.45, 8.6, 8.8, 9.6], 'Pink ISP tile + "Video is ready / ISP Agency" card; confetti pops and falls'),
]
if __name__ == '__main__':
    import sys
    if sys.argv[1:] == ['--times']: print(','.join(str(t) for r in ROWS for t in r[2])); sys.exit()
    tw, th, rw, pad, head = 400, 225, 386, 16, 64
    B = Image.new('RGB', (pad + rw + pad + 4 * (tw + pad) + pad, 110 + len(ROWS) * (th + head + pad)), '#121212'); d = ImageDraw.Draw(B)
    d.text((pad, 24), "Meet ISP Agency · the reel's design with your content · stills for approval", fill='#fff', font=F(34))
    d.text((pad, 70), "Left: the reel you sent.  Right: the ISP version (1920×1080 screen animation, 10.8 s).", fill='#9a9a9a', font=F(20, 400))
    for r, (title, rt, ts, desc) in enumerate(ROWS):
        y = 110 + r * (th + head + pad)
        d.text((pad, y + 4), title, fill='#FF9A40', font=F(26)); d.text((pad, y + 36), desc, fill='#b5b5b5', font=F(19, 400))
        B.paste(Image.open(f'reference/hi/b{rt}.png').resize((rw, th)), (pad, y + head))
        d.rectangle([pad, y + head, pad + 92, y + head + 28], fill='#000'); d.text((pad + 8, y + head + 3), f"REEL {rt}s", fill='#fff', font=F(16))
        for c, t in enumerate(ts):
            x = pad + rw + pad + 4 + c * (tw + pad)
            B.paste(Image.open(f'out/still_{t:.2f}.png').resize((tw, th)), (x, y + head))
            d.rectangle([x, y + head + th - 28, x + 70, y + head + th], fill='#000'); d.text((x + 8, y + head + th - 25), f"{t:.2f}s", fill='#fff', font=F(16))
    B.save('out/stills_board.png'); print('wrote out/stills_board.png', B.size)
