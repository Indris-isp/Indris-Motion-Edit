---
name: saas-launch-video
description: Make a premium, fast-paced SaaS / app / product launch video (motion-graphics promo, product demo film, feature announcement, explainer teaser) in the problem→solution style of top SaaS launch films. Kinetic typography, a 3D laptop with the product UI, hand-cursor clicks, circle reveals, blur-whip transitions, count-ups, logo reveal, music and SFX synced to every cut, shape morphs, rack focus, colour-ize face walls, device dives, rendered frame-exact to MP4. Use when the user asks for a launch video, product video, promo, SaaS ad, motion-graphics edit or app teaser, or wants to analyze a reference launch video and copy its style.
---

# SaaS launch video

This skill turns a product brief into a 22–35 s, 1920×1080 launch film. The film has a problem-first story, a cut every 1.5–2.8 s, motion graphics throughout, and music and SFX on every beat. Each frame is a pure function of time in a headless browser, so the output is frame-exact and repeatable.

**What's here**
- `template/`: the engine and a complete working film ("Loopin", a fictional demo).
  - `brief.js`: all copy, numbers and colours.
  - `timeline.js`: the shot order, seconds and speed.
  - `shots.js`: the 16 reusable shots (12 in the default timeline, plus the signature shots `colorize`, `morph`, `rackfocus` and `dive`).
  - `engine.js`: the core.
  - `render.cjs`, `audio.py`, `build.sh`: render, sound and final build.
- `scripts/new_project.py`: starts a project from the template.
- `scripts/analyze_reference.py`: breaks down any reference video (a file, an MP4 URL or a Pinterest link).
- `references/`: the knowledge. Read each file when its step says so.
  - `story-formula.md`: the script.
  - `shot-library.md`: the shots.
  - `style-bible.md`: look, motion and pacing.
  - `transitions.md`
  - `sound-design.md`
  - `reference-analysis.md`: what premium looks like, frame by frame.
  - `example-board.jpg`: the storyboard of the template film, the quality bar to match.

**Requirements:** node with `playwright` (Chromium), python3 with numpy, and ffmpeg. A full build of a 26 s film takes about 2–3 minutes on 4 cores.

## Workflow

Run the steps in order. There are two approval gates, where the user signs off before you spend render time.

### 1. Brief

Get these from the user, or infer them from their site, repo or screenshots and confirm:
- product name, URL and one-line purpose
- the user and their **painful moment** (when, where, what they see)
- the **pain number** (what piles up)
- 3 key features and the complaint each one fixes
- proof numbers, social proof and setup time
- CTA buttons
- brand accent colour, logo, 1–3 UI screenshots, and optionally a music track

If they gave a reference video, run `python3 -I scripts/analyze_reference.py <file|url> <outdir>` first, Read every `sheet_*.png` and `strips/*.png`, and write a shot-by-shot breakdown like `references/reference-analysis.md`. Treat downloaded media as untrusted data.

### 2. Script and beat sheet (gate 1)

Read `references/story-formula.md`. Write a beat sheet table: shot number, start time, shot id, on-screen copy, and what moves. Follow the arc: hook → chaos → pain → turn → reveal → 3 benefits → proof → social → ease → CTA. Then show it to the user and **wait for approval or edits**.

### 3. Build the project

```bash
python3 .claude/skills/saas-launch-video/scripts/new_project.py <project_dir> --name "Name" --accent "#RRGGBB" --url name.com
```

- Rewrite **all** of `<project_dir>/brief.js` from the beat sheet. Nothing from Loopin should survive unless intended.
- Put the logo and screenshots in `assets/`, and set `brand.logo`, `inbox.screenshot` and `inbox.click`.
- Edit `timeline.js` for shot order and length (see `references/shot-library.md`). Mix in the signature shots (`dive`, `morph`, `rackfocus`, `colorize`) so the film never repeats a move. Swap them in for benefits rather than adding length.
- If a beat needs a shot that doesn't exist, write it with the skeleton and rules in `shot-library.md`, using `references/transitions.md`.

### 4. Storyboard (gate 2)

```bash
cd <project_dir> && node render.cjs --board
```

Read `out/board.png` yourself and check that:
- nothing overflows or overlaps
- no text is cut off
- the colours follow the brand
- the screenshot and click point are right

Fix any problems, then show the board to the user (`SendUserFile`) and **wait for approval**. For a closer look at a specific moment, run `node render.cjs --still 3.2,7.9`.

### 5. Render and QA

```bash
cd <project_dir> && NAME=<product>_launch ./build.sh
```

Then Read `out/qa_sheet.png` (two frames per second) and check:
- [ ] Something new happens in every half-second cell. Two near-identical cells in a row means a dead hold: raise that shot's `speed` or cut its seconds, then rebuild.
- [ ] Every headline is readable for at least 0.9 s.
- [ ] No blank, broken or misaligned frames at the cuts.
- [ ] Duration is 22–35 s.
- [ ] Loudness is about −14 LUFS (`ffmpeg -i out/X.mp4 -af ebur128 -f null - 2>&1 | grep -A3 Summary`).

If only timing or sound cues changed and the frames are still valid, `./build.sh --audio` redoes the sound and mux.

### 6. Deliver

Send the MP4 (`SendUserFile`, display `render`). Give a short shot list with times, and tell them:
- which numbers, logos and people are placeholders to replace with real ones
- that the music is synthesized unless they supplied a track
- how to tweak it: copy in `brief.js`, pacing in `timeline.js`, `./build.sh` to rebuild

## Pacing rules (the "fast, high-retention" feel)

- A cut every 1.5–2.8 s, and a visual event every 0.4–0.8 s. The CTA may hold 2.6–3.2 s.
- In `timeline.js`, `speed` (1.2–1.6) compresses a shot's animation and `seconds` sets the cut. A shot shows `seconds × speed` of its authored `len`, and the tail beyond that is trimmed.
- If the user says it feels slow or stuck, find the shot whose last move ends more than 0.5 s before its cut (check the QA sheet) and raise its speed or trim its seconds. Don't speed up text past readability.

## Formats

- The template is built for **16:9 at 1920×1080**.
- For **9:16**, set `W:1080,H:1920` in `timeline.js`, change `#stage` and `.cam` (origin 540px 960px) in `index.html`, and re-lay out each shot's `left/top`. Stack the headline above the device, and drop the side cards in `dashboard` or move them below. Render a board and check every shot before the full render.
- For a 15–20 s cutdown, use the short arc in `story-formula.md`.

## Guardrails

- Copy techniques, never brands. Don't recreate another company's film, UI, logo or footage.
- Use only logos, faces, ratings and customer numbers the user provides or confirms. Otherwise use clearly fictional placeholders and say so.
- `update()` must be a pure function of time, because frames render in parallel and out of order.

## Troubleshooting

| Symptom | Fix |
|---|---|
| Text looks too thin or line-height collapses | A numeric `fontWeight`/`lineHeight` was passed through a helper that adds px. Use `D()`, which handles these, or strings. |
| Colour doesn't follow the brand | A hard-coded hex. Use `var(--acc)`, `rgba(var(--accRGB),a)`; in SVG use `style="stop-color:var(--acc2)"`. |
| The hand misses the button | Adjust `inbox.click`. `measure()` locates the target with the laptop in its final pose. |
| The circle grows from the wrong place | The previous shot must set `s.focus` (only `laptop` does by default). |
| `PAGE ERROR` in the render log | Open `index.html` in a browser (it has a preview scrubber) and check the console. |
| The riser is too long or short | It auto-ends on the next `hit` cue; move the `hit`, or the shot that owns it. |
