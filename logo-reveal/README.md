# ISP Agency logo reveal

A 12-second vertical logo reveal (1080×1920, 30 fps) that follows the structure of the reference edit. A dot drops in and splits. Three shapes then draw on with one-word labels, assemble into the mark, dip to black for a quick reshuffle, and land on the "ISP Agency" wordmark.

| File | What it does |
|---|---|
| `index.html` | Canvas stage. Open it in a browser for a live preview with play and a scrubber. |
| `reveal.js` | The whole animation as a pure function of time. `CUES` holds the timing, and the constants at the top hold the brand colours, mark geometry, labels and subline. |
| `render.cjs` | Renders every frame with headless Chromium (8 sub-frames each for motion blur) and encodes `out/video_silent.mp4`. It also writes `out/cues.json`. |
| `audio.py` | Synthesizes the pad and the SFX (drop, pops, draw-on clicks, whooshes, snaps, bass hit) at the cue times and writes `out/audio.wav`. |

Fonts come from `../video/fonts` (Inter, SIL OFL).

## Rebuild

```bash
cd logo-reveal
node render.cjs
python3 audio.py
ffmpeg -y -i out/video_silent.mp4 -i out/audio.wav -c:v copy -c:a aac -b:a 192k -shortest -movflags +faststart out/ISP_logo_reveal_1080x1920.mp4
```

Quick stills: `node render.cjs --still 3.5,9.3,12` writes them to `out/still_*.png`.

## Beats

| Time | Action |
|---|---|
| 0.3–1.3 s | A black dot drops in, squashes on landing and bounces |
| 1.3–2.7 s | It splits into three, and the middle dot merges left, leaving two |
| 3.1–7.0 s | The top-left bracket draws on ("Structure"), the orange core pops in ("Focus"), and the bottom-right bracket draws on ("Clarity") |
| 7.8–9.1 s | The labels fade out, and the shapes compress and rotate into the diagonal viewfinder, then to vertical |
| 8.9–10.0 s | Dip to black: the brackets invert to cream and four snaps reshuffle the mark into place |
| 10.0–12 s | Back to cream. The mark slides left, "**ISP** Agency" wipes in, and then "CREATIVE EDITING STUDIO" |
