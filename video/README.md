# ISP Agency promo (kinetic typography)

This is a ~33-second vertical promo: 1080×1920 at 30 fps, with a voiceover. The video's length comes from the voice: `timeline.py` derives every scene boundary and cue from the VO clip durations.

Every frame is a pure function of time (`window.renderAt(seconds)` in `motion.js`). A headless browser renders each frame, so motion blur, glows and timing come out exactly to the frame.

| File | What it does |
|---|---|
| `index.html` | Stage, brand tokens (CSS variables) and fonts. Open it in a browser for a live preview with a scrubber. |
| `motion.js` | All 11 scenes, the transitions and the ambient decor. Each scene is one `addScene({...})` block. |
| `vo.py` | Generates the voiceover with Kokoro TTS (Apache-2.0), one clip per line, into `out/vo/`. |
| `timeline.py` | Builds `timeline.js` / `out/timeline.json` (scene times, cues, VO placement) from the clip durations. |
| `audio.py` | Synthesizes the music bed and SFX, places the VO and ducks the music under it, into `out/audio.wav`. |
| `render.cjs` | Renders the frames to PNG and encodes `out/video_silent.mp4`. |
| `fonts/` | Inter and Instrument Serif (both SIL OFL). |

## Rebuild

```bash
cd video
```

Generating the voice needs `pip install kokoro-onnx soundfile` and the model files `kokoro.onnx` and `voices-v1.0.bin` (from the kokoro-onnx GitHub releases) in `<model_dir>`. The default voice is `af_heart`; try `am_michael` or `bm_george` for a male voice.

```bash
python3 vo.py <model_dir> af_heart 0.95
```

```bash
python3 timeline.py
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
- **Timing:** it follows the voice automatically. Edit a line in `vo.py`, then re-run vo → timeline → audio → render. To use your own recording, replace the clips in `out/vo/` (same names), then run timeline → audio → render.
- **Logo:** `LOGO` in `motion.js` is a vector recreation of the ISP mark. Replace it with the official SVG if you have one.
