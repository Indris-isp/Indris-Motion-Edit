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
