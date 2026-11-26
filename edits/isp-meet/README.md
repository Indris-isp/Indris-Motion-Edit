# Meet ISP Agency (the reel's design, ISP content)

This rebuilds the screen animation from the reference reel (`reference/reference.mp4`), frame-matched to it, and changes only the content to ISP's 7 scenes. The output is a 1920×1080 screen animation at 30 fps, 310 frames (10.33 s, the reel's exact length).

- **Timing:** every event is placed on the reel's frame, measured from 15 fps contact sheets (`reference/f15_sheet*.png`) and gridded full-res frames (`reference/grid_*.png`). This covers letter pops, echo frames, cuts, orbit steps, words, colour switches and confetti.
- **Sizes:** measured from the reel. The phone shows about 2.8 screen px per phone px in scenes 1–5 and 3.0 in scenes 6–7 (`reference/track_screen.py` finds the screen).
- **Smoothness:** each output frame blends 3 sub-frames (180° shutter, `render.cjs --sub 3`), giving the same natural motion blur the reel's camera recorded. Moves in scene 1 hold, then glide over the last 2–3 frames, as the reel's letters and dots do.
- **Transitions (seamless, as in the reel):**
  - **Meet → logo:** "Meet" slides left into the wordmark's place and swallows the nearest dot. The screen brightens to lavender, the dots become glows, and the wordmark builds where "Meet" landed.
  - **Logo → orbit:** the mark shatters into pixel blocks (`logo_blocks.js`) and the word smears sideways. The green tile pops in at the centre as the screen dims.
  - **Orbit → text:** the cluster blooms into a white glow while the screen turns light, and the text's icon appears in place.
  - **Text → colour screens:** the icon turns lime, then grows and glides into the big tile in 2 frames, while the circle fades in where it sits.
  - **The last two cuts:** 1–2 frame crossfades, each with a one-frame icon glitch.
- **Platform switches:** a soft ~3-frame dissolve of the whole screen (background, logo, label and circle tint), and the "···" builds up one dot at a time, matching the reel. The blocky look in the reel is only its video compression.
- **Sound:** the reel's own soundtrack (`out/audio.wav`, extracted from `reference/reference.mp4`). Because the timing matches frame for frame, every click and whoosh lands on its event.

| # | Reel segment | ISP version | Time |
|---|---|---|---|
| 1 | "M e e t" letters and coloured dots assemble | Meet | 0.0–1.78 s |
| 2 | "Symphony" logo on lavender ripples | ISP logo + "Agency" | 1.78–2.57 s |
| 3 | Green app tile with items orbiting on a 3×3 grid | ISP tile, with social platforms orbiting | 2.57–3.73 s |
| 4 | "Let's **connect** your tools", typed | "Let's make your video **better**" | 3.73–4.77 s |
| 5 | 6 colour screens: link tile ··· tool circle | ISP ··· Instagram / YouTube / Facebook / TikTok / LinkedIn / X | 4.77–7.38 s |
| 6 | "Tools Connected ✓ / Everything is connected." | "ISP Agency ✓ / All in one place, less pressure." | 7.38–8.31 s |
| 7 | "Home screen is ready" + confetti | "Video is ready / ISP Agency" + confetti | 8.31–10.33 s |

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
| `audio.py` | Not used for this cut, since the reel's own audio is used instead. An alternative cue sheet of the client's library SFX (whoosh peaks on the cuts, pops on reveals, 3 low hits). Needs the library WAVs in `audio/src/sfx/` (Drive IDs in `.claude/skills/premium-short-form/references/sound-design.md`). Add `audio/src/music.wav` for a full mix. |

## Rebuild

```bash
ffmpeg -y -i reference/reference.mp4 -vn -ac 2 -ar 48000 out/audio.wav
```

```bash
node render.cjs --still $(python3 board.py --times) && python3 board.py
```

```bash
node render.cjs
```
