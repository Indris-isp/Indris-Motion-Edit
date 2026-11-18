# ISP Agency logo reveal: square version

This is a 12-second vertical logo reveal (1080×1920, 30 fps) with no audio. It sits on a bright orange radial gradient (background option A). The brackets and "Agency" are white. The centre circle, "ISP", "CREATIVE EDITING STUDIO" and the labels are black. Every move uses Easy Ease, and the frames have real motion blur.

| Time | Action |
|---|---|
| 0.3–1.0 s | A white square drops into the middle |
| 1.0–2.4 s | It bounces to the right. Each landing drops a circle that arcs back into the row, and on the last landing the square itself rounds into the third circle |
| 2.7–6.4 s | One at a time, each circle spins fast (two turns, easing down) and forms its logo part (the middle circle turns from white to black), with a one-word label: **Structure** (top-left bracket), **Focus** (core), **Clarity** (bottom-right bracket) |
| 6.9–8.4 s | The labels fade out, and the parts spin fast into the logo with an easy ease out |
| 8.55–9.35 s | The mark slides left |
| 8.8–10.9 s | "**ISP** Agency" appears letter by letter, each letter easing in from a blur, followed by "CREATIVE EDITING STUDIO" the same way |
| 9.3–12 s | Hold with a slow push-in |

`square.js` holds the whole animation. `CUES` at the top holds the timing, and `LABELS` holds the words.

## Rebuild

The labels use **Satoshi Medium** (free from Fontshare, ITF Free Font License). It isn't committed, so download it first:

```bash
mkdir -p fonts && curl -o fonts/Satoshi-Medium.woff2 "$(curl -s 'https://api.fontshare.com/v2/css?f[]=satoshi@500' | grep -o '//cdn[^)]*woff2' | head -1 | sed 's#^#https:#')"
```


```bash
cd logo-reveal-square
node render.cjs
ffmpeg -y -i out/video_silent.mp4 -c:v copy -an -movflags +faststart out/ISP_logo_reveal_square_1080x1920.mp4
```

Quick stills: `node render.cjs --still 1.3,3.0,9.7` writes them to `out/still_*.png`.
