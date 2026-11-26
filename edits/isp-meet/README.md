# Meet ISP Agency (the reel's design, ISP content)

This rebuilds the screen animation from the reference reel (`reference/reference.mp4`), keeping its design, motion and timing and changing only the content to ISP's 7 scenes. The output is a 1920×1080 screen animation at 30 fps, 10.8 s long.

| # | Reel segment | ISP version | Time |
|---|---|---|---|
| 1 | "M e e t" letters and coloured dots assemble | Meet | 0.0–1.8 s |
| 2 | "Symphony" logo on lavender ripples | ISP logo + "Agency" | 1.8–2.55 s |
| 3 | Green app tile with items orbiting on a 3×3 grid | ISP tile, with social platforms orbiting | 2.55–3.75 s |
| 4 | "Let's **connect** your tools", typed | "Let's make your video **better**" | 3.75–4.9 s |
| 5 | Colour screens: link tile ··· tool circle | ISP ··· Instagram / YouTube / Facebook / TikTok | 4.9–7.15 s |
| 6 | "Tools Connected ✓ / Everything is connected." | "ISP Agency ✓ / All in one place, less pressure." | 7.15–8.4 s |
| 7 | "Home screen is ready" + confetti | "Video is ready / ISP Agency" + confetti | 8.4–10.8 s |

One green tile (the ISP app icon) travels through scenes 2–6, as the reel's tile does.

## Files

| File | What it does |
|---|---|
| `index.html` | Stage, scene backgrounds and tile styles. Open it in a browser for a live preview with a scrubber. |
| `motion.js` | All 7 scenes. `SEG` at the top holds the scene times; each scene's block holds its copy and motion. |
| `icons.js` | Platform glyphs from Simple Icons v13 (CC0). |
| `logos/isp/` | The official ISP logo: the original JPG, plus a traced SVG and transparent PNG in white and in black. |
| `reference/` | The reel, frame grabs and contact sheets used to match the design. |
| `render.cjs` | Renders stills (`--still 1,2.5`) or the full video to `out/isp_meet_screen_1920x1080.mp4`. |
| `board.py` | Builds `out/stills_board.png`, with the reel next to the ISP stills for each scene. |
| `audio.py` | Cue sheet of the client's library SFX (whoosh peaks on the cuts, pops on reveals, 3 low hits). Needs the library WAVs in `audio/src/sfx/` (Drive IDs in `.claude/skills/premium-short-form/references/sound-design.md`). Add `audio/src/music.wav` for a full mix. |

## Rebuild

```bash
node render.cjs --still $(python3 board.py --times) && python3 board.py
```

```bash
node render.cjs
```
