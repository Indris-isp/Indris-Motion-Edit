# ISP Agency logo reveal: square version

This is a 12-second vertical logo reveal (1080×1920, 30 fps) on a bright orange radial gradient (background option A). It is paced like the reference: every move is a single Easy Ease, with no wobble, and the frames have real motion blur.

| Time | Action |
|---|---|
| 0.3–1.6 s | A black square drops in and lands with one soft bounce |
| 1.6–2.9 s | It spins fast to the right and eases down smoothly, leaving three squares in a row |
| 3.1–7.0 s | One by one, each square "marks" into a logo part, with a title and a one-line explanation: **Structure** (top-left bracket), **Focus** (white core), **Clarity** (bottom-right bracket) |
| 7.55–9.25 s | The explanations fade out, and the parts spin fast into the logo with an easy ease out |
| 9.45–10.35 s | The mark slides left as "**ISP** Agency" slides out from behind it, followed by "CREATIVE EDITING STUDIO" |
| 10.4–12 s | Hold with a slow push-in |

The explanation copy is in `EXPLAIN` at the top of `square.js`.

`square.js` holds the whole animation, and `CUES` at the top holds the timing. Rebuild:

```bash
cd logo-reveal-square
node render.cjs
python3 audio.py
ffmpeg -y -i out/video_silent.mp4 -i out/audio.wav -c:v copy -c:a aac -b:a 192k -shortest -movflags +faststart out/ISP_logo_reveal_square_1080x1920.mp4
```
