# ISP Agency promo (kinetic typography)

This is a 27-second vertical promo: 1080×1920 at 30 fps, 810 frames.

Every frame is a pure function of time (`window.renderAt(seconds)` in `motion.js`). A headless browser renders each frame, so motion blur, glows and timing come out exactly to the frame.

| File | What it does |
|---|---|
| `index.html` | Stage, brand tokens (CSS variables) and fonts. Open it in a browser for a live preview with a scrubber. |
| `motion.js` | All 11 scenes, the transitions and the ambient decor. Each scene is one `addScene({...})` block. |
| `audio.py` | Synthesizes the music bed and SFX into `out/audio.wav`. |
| `render.cjs` | Renders the frames to PNG and encodes `out/video_silent.mp4`. |
| `fonts/` | Inter and Instrument Serif (both SIL OFL). |

## Rebuild

```bash
cd video
```

```bash
python3 audio.py
```

```bash
node render.cjs
```

```bash
ffmpeg -y -i out/video_silent.mp4 -i out/audio.wav -c:v copy -c:a aac -b:a 192k -shortest -movflags +faststart out/ISP_promo_1080x1920.mp4
```

To render quick stills: `node render.cjs --still 1.0,5.5,20.0` writes them to `out/still_*.png`.

## Editing

- **Colors:** the constants at the top of `motion.js` (`ACC`, `TXT`, `MUT`, `BG`) and the `:root` variables in `index.html`.
- **Copy:** each scene's `build()` contains its text.
- **Timing:** each scene has `start`/`end`, and its `update(lt)` uses times local to the scene. If you move a scene, also update the SFX times in `audio.py`.
- **Logo:** `LOGO` in `motion.js` is a vector recreation of the ISP mark. Replace it with the official SVG if you have one.

## v2: reference-aligned cut

`v2/` is a second version laid out to match the reference edit closely: a white background, smaller type, and the same scene order. The scenes are: hook "Attention is expensive.", watch dial, audience viewfinder, "Trying to understand" with review cards, a 6 → 14 counter, a cluster of 3 hexagons, the word beats "The brands people remember", "Aren't louder.", a 6-pill cloud, the punchline "It's leverage." inside an oval, and a small logo with the handle. It reuses the same motion engine. `v2/scenes.js` is the editable source, and `v2/motion.js` is that source combined with the engine.

```bash
python3 v2/audio.py
```

```bash
node render.cjs --page v2/index.html --out out/v2
```

```bash
ffmpeg -y -i out/v2/video_silent.mp4 -i out/v2/audio.wav -c:v copy -c:a aac -b:a 192k -shortest -movflags +faststart out/ISP_promo_v2_1080x1920.mp4
```
