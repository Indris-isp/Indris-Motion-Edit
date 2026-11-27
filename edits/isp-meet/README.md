# Meet ISP Agency (the reel's design, ISP content)

This rebuilds the screen animation from the reference reel (`reference/reference.mp4`), frame-matched to it, and changes only the content to ISP's 7 scenes. The output is a 1920×1080 screen animation at 30 fps, 360 frames (12 s). It's authored on the reel's 10.33 s timeline and played about 16% slower so the text is easy to read (`OUT_DUR` in `motion.js`).

- **Timing:** every event is placed on the reel's frame, measured from 15 fps contact sheets (`reference/f15_sheet*.png`) and gridded full-res frames (`reference/grid_*.png`). This covers letter pops, echo frames, cuts, orbit steps, words, colour switches and confetti.
- **Sizes:** measured from the reel. The phone shows about 2.8 screen px per phone px in scenes 1–5 and 3.0 in scenes 6–7 (`reference/track_screen.py` finds the screen).
- **Smoothness:** each output frame blends 3 sub-frames (180° shutter, `render.cjs --sub 3`), giving the same natural motion blur the reel's camera recorded. Moves in scene 1 hold, then glide over the last 2–3 frames, as the reel's letters and dots do.
- **Transitions:** one ISP tile glides through the whole film with long eased moves (0.6–0.9 s of travel per transition, about 1.3 s into the logo). The logo's blocks stream into the centre and become the tile. The tile glides to the typed line's icon, then grows into the big lime tile as the colour floods out of it. Platforms slide through the slot like a carousel (0.44 s per slide). The tile then glides to the "ISP Agency ✓" icon and lands as the pink "ready" tile. A slow camera push keeps the screen gently moving.
- **Sound:** the reel's own soundtrack, slowed to 12 s with its pitch kept (ffmpeg `atempo`), so it stays in step with the slowed picture.
- **Sound (original note):** the reel's own soundtrack (`out/audio.wav`, extracted from `reference/reference.mp4`). Because the timing matches frame for frame, every click and whoosh lands on its event.

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
ffmpeg -y -i reference/reference.mp4 -vn -af "atempo=0.86111,apad=whole_dur=12" -ac 2 -ar 48000 out/audio.wav
```

```bash
node render.cjs --still $(python3 board.py --times) && python3 board.py
```

```bash
node render.cjs
```
