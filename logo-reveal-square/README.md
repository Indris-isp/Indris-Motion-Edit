# ISP Agency logo reveal: square version

This is a 9-second vertical logo reveal (1080×1920, 30 fps) on a bright orange radial gradient (background option A). All moves use Easy Ease, and the frames have real motion blur.

| Time | Action |
|---|---|
| 0.3–1.6 s | A black square drops in, squashes on landing and bounces twice |
| 1.75–2.4 s | It rolls to the right over its corner |
| 2.4–3.35 s | It keeps rotating and splits into three squares |
| 3.3–3.95 s | The squares "mark" into the logo: the outer two cut into brackets, and the middle one rounds into the white core (with a small wind-up) |
| 3.95–5.25 s | The mark spins fast and eases out into the upright logo |
| 5.45–6.35 s | The mark slides left as "**ISP** Agency" slides out from behind it, followed by "CREATIVE EDITING STUDIO" |
| 6.4–9 s | Hold with a slow push-in |

`square.js` holds the whole animation, and `CUES` at the top holds the timing. Rebuild:

```bash
cd logo-reveal-square
node render.cjs
python3 audio.py
ffmpeg -y -i out/video_silent.mp4 -i out/audio.wav -c:v copy -c:a aac -b:a 192k -shortest -movflags +faststart out/ISP_logo_reveal_square_1080x1920.mp4
```
