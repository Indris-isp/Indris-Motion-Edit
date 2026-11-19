# I.S.P. Agency — 30 s launch video (Remotion)

16:9 master (1920 × 1080, 60 fps, H.264 yuv420p, CRF 16) plus 9:16 and 1:1 cutdowns, voiced from the client script.
Scene order, timing and camera are in [`STORYBOARD.md`](STORYBOARD.md).

| Output | File |
|---|---|
| 16:9 master | `out/ISP_launch_1920x1080.mp4` |
| 9:16 | `out/ISP_launch_1080x1920.mp4` |
| 1:1 | `out/ISP_launch_1080x1080.mp4` |

## Layout

| File | What it does |
|---|---|
| `src/config.ts` | **All revisions go here**: colours, copy, numbers, scene lengths. VO placement is computed from `src/vo.json` plus the script's `<break>` pauses, and the build fails if a line overruns its scene or the scenes don't add up to 1800 frames. |
| `src/lib.tsx` | Easing, entrances/exits, click press, drift, `Camera`, `Cursor` (arcs), counters, kinetic `Words`. |
| `src/brand.tsx` | ISP logo (vector), backdrop, font loading (render is blocked until fonts load). |
| `src/scenes/S1…S7` | One component per storyboard scene. |
| `scripts/vo.py` | Kokoro TTS voiceover, one clip per line, into `public/vo/`. |
| `scripts/stills.mjs` | Renders key-frame stills to `out/stills/`. |

## Commands

```bash
npm install
```

```bash
npm run studio
```

Remotion downloads its own headless browser. In an environment without that download, point it at a local Chrome with `REMOTION_CHROME=/path/to/chrome-headless-shell`.

```bash
npm run render
```

Remotion encodes JPEG frames as full-range `yuvj420p`. Convert to the broadcast-standard `yuv420p` for delivery:

```bash
ffmpeg -i out/ISP_launch_1920x1080.mp4 -vf "scale=in_range=pc:out_range=tv,format=yuv420p" -c:v libx264 -crf 16 -preset slow -c:a copy -movflags +faststart out/final.mp4
```

Cutdowns: `npm run render:9x16` and `npm run render:1x1`, then the same conversion.

## Re-voicing

Needs `pip install kokoro-onnx soundfile` and `kokoro.onnx` and `voices-v1.0.bin` (kokoro-onnx GitHub releases, `model-files-v1.0`) in `<model_dir>`.

```bash
python3 scripts/vo.py <model_dir> af_bella 1.05
```

That rewrites `public/vo/*.wav` and `src/vo.json`, and the video re-times itself. To use a real voice actor, replace the wavs (same names) and update the `dur` values in `src/vo.json`.
