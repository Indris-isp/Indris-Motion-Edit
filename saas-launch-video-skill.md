# saas-launch-video: complete skill (knowledge + code)

> **For Claude, in a new chat:** this file contains a complete skill for making premium, fast-paced SaaS launch
> videos (problem → solution, motion graphics, music and SFX) in **16:9 and 9:16**.
> 1. If you can run code (Claude Code), recreate the skill: write every file in **Part 2** to
>    `.claude/skills/saas-launch-video/<path>` exactly as given. Download the Inter font (https://rsms.me/inter/,
>    SIL OFL) as `template/fonts/Inter-400.ttf` … `Inter-800.ttf`, and run `chmod +x template/build.sh`.
>    Needs node + playwright (Chromium), python3 + numpy, and ffmpeg.
> 2. Then follow **`SKILL.md`** (Part 1) step by step: brief → beat sheet (user approves) → project →
>    storyboard board (user approves) → render + QA → deliver.
> 3. If you can't run code, use Part 1 as the creative reference: write the script, beat sheet, shot list,
>    timings, copy and sound plan for a human editor.

**Not included:** the Inter `.ttf` files and `references/example-board.jpg` (binary files).

## Contents
- Part 1: Instructions and knowledge
  - `SKILL.md`
  - `references/story-formula.md`
  - `references/style-bible.md`
  - `references/shot-library.md`
  - `references/transitions.md`
  - `references/sound-design.md`
  - `references/reference-analysis.md`
- Part 2: Source code (write each file at its path)
  - `template/brief.js`
  - `template/timeline.js`
  - `template/index.html`
  - `template/engine.js`
  - `template/shots.js`
  - `template/render.cjs`
  - `template/audio.py`
  - `template/build.sh`
  - `template/fonts/LICENSE.txt`
  - `scripts/new_project.py`
  - `scripts/analyze_reference.py`

---

# Part 1: Instructions and knowledge

## `SKILL.md`

````markdown
---
name: saas-launch-video
description: Make a premium, fast-paced SaaS / app / product launch video (motion-graphics promo, product demo film, feature announcement, explainer teaser) in the problem→solution style of top SaaS launch films. Kinetic typography, a 3D laptop with the product UI, hand-cursor clicks, circle reveals, blur-whip transitions, count-ups, logo reveal, music and SFX synced to every cut, shape morphs, rack focus, colour-ize face walls, device dives, rendered frame-exact to MP4 in 16:9 and 9:16 (Reels/TikTok/Shorts). Use when the user asks for a launch video, product video, promo, SaaS ad, motion-graphics edit or app teaser, or wants to analyze a reference launch video and copy its style.
---

# SaaS launch video

This skill turns a product brief into a 22–35 s launch film, in 16:9 (1920×1080) and/or 9:16 (1080×1920). The film has a problem-first story, a cut every 1.5–2.8 s, motion graphics throughout, and music and SFX on every beat. Each frame is a pure function of time in a headless browser, so the output is frame-exact and repeatable.

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
cd <project_dir> && node render.cjs --board                   # add --format 9:16 for the vertical board
```

Read `out/board.png` yourself and check that:
- nothing overflows or overlaps
- no text is cut off
- the colours follow the brand
- the screenshot and click point are right

Fix any problems, then show the board to the user (`SendUserFile`) and **wait for approval**. For a closer look at a specific moment, run `node render.cjs --still 3.2,7.9`.

### 5. Render and QA

```bash
cd <project_dir> && NAME=<product>_launch ./build.sh          # add FORMAT=9:16 or FORMAT=both for vertical
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

One project renders both formats from the same brief and timeline:

| Format | Size | Use | Command |
|---|---|---|---|
| **16:9** | 1920×1080 | Website, YouTube, Product Hunt, LinkedIn, X | `./build.sh` → `out/<NAME>.mp4` |
| **9:16** | 1080×1920 | Reels, TikTok, Shorts, Stories | `FORMAT=9:16 ./build.sh` → `out/<NAME>_9x16.mp4` |
| both | | | `FORMAT=both ./build.sh` |

- Boards and stills take the flag too: `node render.cjs --board --format 9:16` writes `out/board_9x16.png`.
- In the browser preview, use the "switch to 9:16" link, or open `index.html?fmt=9:16`.
- To make 9:16 the project default, set `FORMAT: '9:16'` in `timeline.js`.
- Every shot has a portrait layout (`lv(landscape, vertical)` in `shots.js`):
  - copy is stacked above the device
  - big numbers and taglines break onto two lines
  - the morph ends in a tall panel
  - `dive` flies into a **phone** instead of a laptop
  - `rackfocus` shows `rack.l1/l2` above the laptop
- For a different vertical cut (vertical viewers drop off faster), add `shotsVertical: [...]` to `timeline.js`. It replaces `shots` in 9:16 only, so you can drop the slower beats (e.g. `social`, `reel`) and aim for 15–22 s.
- Vertical safe zone: keep copy out of the top 250 px and bottom 350 px, where app UI sits. The template layouts already do.
- Check the 9:16 board as carefully as the 16:9 one. Long product names or headlines can overflow a 1080 px width: shorten the copy, or lower that shot's font size with `lv(...)`.
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
````

## `references/story-formula.md`

### Story formula: problem first, then the fix

The film sells a *relief*. The viewer has to feel the problem in the first 6–8 seconds, before they see the product. Write the script in this order. Every beat is one idea and one shot.

#### The arc (about 26 s; scale to 22–35 s)

| # | Beat | Job | Shot | Seconds |
|---|---|---|---|---|
| 1 | **Hook** | A real, specific moment the viewer has lived | `hook` | 1.5–1.8 |
| 2 | **Chaos** | Show the mess the problem creates | `chaos` | 1.8–2.2 |
| 3 | **Pain** | Turn the mess into one number | `pain` | 2.0–2.4 |
| 4 | **Turn** | Darkness, then light: the product is coming | `turn` | 1.8–2.2 |
| 5 | **Reveal** | Name + icon | `brand` | 1.5–1.8 |
| 6–8 | **Benefits ×3** | Each one is a headline + UI proof that kills one part of the pain | `laptop`, `circle`, `fanout`, or the signature shots `colorize`, `morph`, `rackfocus`, `dive` | 2.4–2.8 each |
| 9 | **Proof** | Outcome numbers | `dashboard` | 2.2–2.6 |
| 10 | **Social proof** | Others trust it | `social` | 1.7–2.0 |
| 11 | **Ease** | It's fast to start (removes the last objection) | `reel` | 1.5–1.8 |
| 12 | **CTA** | Name, tagline, buttons, URL | `cta` | 2.6–3.2 |

Shorter cuts (15–20 s, e.g. for social): hook → pain → turn → brand → 2 benefits → cta. Longer cuts add benefits, never longer holds.

#### Copy rules

- **Hook:** a time, a notification, a calendar, a counter. Concrete beats clever: "9:14 am" plus "any update on the v2 feedback??" beats "Feedback is hard."
- **Chaos headline:** name the problem in 2 + 1–2 words, with the payoff word in accent: "Feedback is / **everywhere.**", "Who's actually / **in today?**"
- **Pain number:** a count that sounds painful at a glance ("127 unread", "46 replies", "9 tools") plus a red delta pill ("+38 today").
- **Benefit headlines:** verb-led or outcome-led, 2–4 words per line, line 2 in accent. Each must answer one complaint from the chaos/pain beats.
  - "Every comment, / **one inbox.**" answers *everywhere*
  - "Sorted by AI. / **Instantly.**" answers *which file? / missed this*
  - "Reply once. / **Everyone sees it.**" answers *still waiting… / hello?*
- **Proof:** one big multiplier in the headline ("Close feedback **3.2× faster**"), then 2–4 supporting numbers in the UI.
- **Social:** "Trusted by / **N+ teams**", logos, a rating. Only use real logos and numbers the user provides; otherwise make up obviously fictional ones for a demo, and say so.
- **Ease:** "**02** minutes to set up", "Live in **10** minutes".
- **CTA tagline:** a call phrase plus an accent payoff: "Close the loop **on every client.**" Two buttons max, plus the URL.
- No sentence longer than about 6 words on screen. If it needs a comma, it is two beats.

#### Beat sheet format (show this to the user before building)

```
#  t      shot       on-screen copy                         what moves
1  0.0    hook       9:13 → 9:14 am · "any update on v2??"  focus-pull, digit roll, message flies in
2  1.6    chaos      Feedback is / everywhere.              card wall pops, headline blur-whips in
...
```

#### Mapping a product into the brief

1. Ask: *who* is the user, *what moment* hurts, *what* do they count when it hurts, *which 3* features remove it, *what numbers* prove it, *how fast* is setup, and what the CTA is.
2. Fill `brief.js` top to bottom in the same order as the arc.
3. Make sure the people, messages and complaints in the problem beats come back resolved in the benefit beats. Re-using the same names and items sells continuity.

---

## `references/style-bible.md`

### Style bible

#### Look

- **Canvas:** 1920×1080. White to `#F5F7FC` vertical gradient, with soft accent "blobs" (`.blob`, 90 px blur) in 1–2 corners. Only the turn shot is dark (accent-tinted navy starfield).
- **Colour:** **one** accent (`BRIEF.brand.accent`). The engine derives the rest:
  - `--acc2` is lighter and `--acc3` darker (for gradients and domes).
  - `--acc4` is a pale tint, used for text on accent.
  - `--tint` is a near-white tint, used for chips and highlights.
  - `--night1/2` are the dark sky.
  - Red `#FF4D4F` is only for alerts and badges.
  - Channel and integration colours are the only other hues.
- **Type:** Inter (bundled, SIL OFL).
  - Headlines are 600 weight, letter-spacing −0.045em, line-height 1.02, and 96–124 px. The wordmark is 700 at −0.06em.
  - Line 1 is ink (`#0B0D12`) and line 2 is accent.
  - UI text is 15–26 px, 500/600.
- **Surfaces:** white cards with radius 18–32 and a deep soft shadow `0 30px 80px -20px rgba(30,50,110,.28)`. Pills are radius 999. Glass columns on accent are `rgba(255,255,255,.12)` with a 1.5 px inner line.
- **Atmosphere layers:** vertical light rays (`.rays`), the accent dome horizon (dashboard), the light-equalizer glow (CTA), and repeated-word patterns at 7% white (circle).
- **Details that sell "real product":** avatars, red count badges, typing cursors, a 3D hand pointer, click ripples, toggles, tooltips and checkmarks.

#### Motion

| Use | Easing | Typical duration (authored) |
|---|---|---|
| Elements arriving | `eo` (expo out) | 0.35–0.6 s |
| Pops (badges, pills, icons) | `bo` (back out, 1.5) | 0.25–0.45 s |
| Camera, laptop, flights across the frame | `eio` (cubic in-out) | 0.5–1.0 s |
| Exits | `ei` (cubic in) | 0.2–0.25 s |

- **Stagger** lists 0.07–0.17 s apart. Never reveal a group at once.
- **Constant drift:** every shot's camera layer scales 1 → 1.04–1.07 over the shot, and floating cards bob ±5–10 px with `Math.sin(t)`. A still frame reads as "stuck".
- **Motion blur:** anything that moves fast gets blur proportional to its speed. Use `vel(fn, t)`, and directional blur with `bx`/`by` (an SVG filter) for horizontal and vertical moves.
- **Focus pulls:** headlines enter from 24–36 px blur and scale 1.06 → 1 (`blurIn`), or type on with a per-character blur (`typeP`).
- **Type-on speed:** about 12–20 characters per authored second, and the cursor blinks at 2.6 Hz after typing.

#### Pacing (the part that makes it feel fast)

- A new visual event every 0.4–0.8 s of real time.
- Shots last 1.5–2.8 s (CTA 2.6–3.2 s). The whole film is 22–35 s.
- A shot's last motion must land within about 0.5 s of its cut. If a shot has a dead hold, raise its `speed` (1.2–1.6) or cut `seconds` in `timeline.js`.
- Text must stay readable: a 2-line headline needs ≥ 0.9 s fully visible.
- Alternate rhythm: a busy shot (chaos, circle sort) next to a clean one (pain number, brand).

#### Don'ts

- No stock-video look: no gradients across the whole frame, no drop-shadowed text, no bevels.
- No more than one accent hue, and no emoji in headlines.
- No real third-party logos, faces or trademarks unless the user supplies and owns them.
- Don't copy a reference's brand, UI or footage. Copy the techniques.

---

## `references/shot-library.md`

### Shot library (`template/shots.js`)

All 16 shots are listed below. Each shot is a self-contained block: it reads its copy from `BRIEF`, has its own sound cues, and declares its default transitions. `timeline.js` picks and orders shots: `[id, secondsOnScreen, speed, {overrides}]`.

| id | Beat | Brief fields | len (authored) | Transitions | What moves |
|---|---|---|---|---|---|
| `hook` | Problem moment | `hook.from/to/suffix/notifMeta/notif`, `people[0]` | 2.5 | out: whip | Clock focus-pulls in, the last digit rolls, a message flies in with motion blur, and a red dot pops |
| `chaos` | Chaos | `chaos.l1/l2/sources/messages` | 3.0 | in: whip, out: zoom | A tilted 3D wall of 54 message cards pops in by distance with badges, and the headline lines blur-whip in from the right |
| `pain` | Pain number | `pain.value/unit/pill/complaints` | 3.0 | in: zoom | Count-up to the number, a red pill stamps on, complaint bubbles orbit, then grayscale and dip to black |
| `turn` | Turn | (logo) | 2.5 | ends with a white flash | Starfield fades in, a flare draws a glowing ring, the ring becomes the app icon, the flare settles on its corner, then a white flash |
| `brand` | Reveal | `product`, `channels`, `brand.logo` | 2.5 | out: up (flash in) | Icon lands, slides left, and the wordmark types on; channel pills rise |
| `laptop` | Benefit + UI | `inbox.*` (or `inbox.screenshot` + `inbox.click`) | 5.0 | in: up | Headline types on, a 3D laptop swings in with motion blur, rows stagger, a 3D hand travels and clicks, a ripple plays and the action button pops. It exposes `s.focus` for the next shot. |
| `circle` | Benefit on accent | `sort.*` | 4.0 | circle reveal in, out: zoom | An accent circle grows from the previous shot's focus point, the headline blurs in over a drifting word pattern, and chips fly into three counted columns |
| `fanout` | Benefit: one → many | `reply.*`, `channels` | 4.0 | in: zoom, out: whip | Headline types on, a composer types a message, send is pressed, lines draw out to each channel, and each gets a check ✓ |
| `dashboard` | Proof numbers | `proof.*` | 4.0 | in: whip, out: up | The accent dome rises with the dashboard, metrics count up, bars grow, side cards fan out from behind, and a quote pill pops |
| `social` | Social proof | `social.*` | 3.0 | in: up, out: fade | "Trusted by N+" counts up, a logo marquee scrolls past a glowing scan line, and the rating ticks up |
| `reel` | Ease | `setup.*` | 2.5 | in/out: fade | A slot-reel of numbers rolls on an arc with vertical motion blur and lands; the label types on |
| `colorize` | Benefit: integrations / adoption | `colorize.l1/l2/toggle/pill`, `people`, `channels` | 3.2 | in: up, out: whip | Grey wall of 135 faces pops in, headline types, a toggle switches on, faces light up to colour one by one with channel badges, then a "synced" pill |
| `morph` | Benefit with headline + UI | `morph.*` | 4.0 | in: zoom, out: up | Accent card with headline → folder (a tab grows) → white UI panel (the tab widens into the header), tiles stagger in, a side panel slides in, the hand clicks and the button flips to done ✓ |
| `rackfocus` | Benefit: an action | `rack.*`, `inbox.nav/items` (or `rack.screenshot`) | 3.0 | whips itself in, out: fade | Laptop whips in with heavy motion blur, a request types into the bar, the hand clicks send, then the camera pushes 2× onto the button while the screen and a foreground element go out of focus. Exposes `s.focus`. |
| `dive` | Transition into a world | `dive.l1/l2`, `channels` (or `dive.screenshot`) | 3.2 | in: fade, out: whip | A laptop rises and the camera flies into its screen until the screen is exactly the frame (no cut). Cards spread out and the headline lands on a glass card over a thin grid. |
| `cta` | CTA | `product`, `cta.*`, `url` | 4.0 | in: zoom | Icon pops with rotation, the wordmark types on, the tagline focus-pulls, buttons stagger up, the URL fades in, and the equalizer glow pulses |

#### Using screenshots instead of the mock UI

- Put a 16:10 screenshot in `assets/` and set `BRIEF.inbox.screenshot = 'assets/app.png'`.
- Set `BRIEF.inbox.click = [x, y]` (fractions of the image) to the button the hand should press. A ring marks the click.
- The circle shot then grows from that point.

#### Reordering and reusing

- The order and count are free. Shots can repeat with overrides, e.g. `['laptop', 2.6, 1.5, { tin: 'whip' }]`. Note that a repeated shot shows the same brief copy; to show different copy, add a variant shot (below).
- `circle` should follow a shot that sets `s.focus` (`laptop` or `rackfocus`). Otherwise it grows from the centre.
- `dive` and `morph` are the smoothest transitions in the set: use `dive` right after `brand` ("now look inside"), or between benefits; `morph` turns a headline card into the product, which suits any feature that is a panel or object.
- `turn` should be followed by `brand`, because `brand` fades out the white flash the turn leaves behind.
- The music follows the shots: the intro runs until `turn`, the groove starts at the shot after it, and the outro starts at `cta`. Without a `turn` shot the groove plays from the start.

#### Writing a new shot (or a variant with different copy)

```js
shot('myshot', { hero: 1.8, len: 3.0, tin: 'whip', tout: 'fade',
  sfx: [[0.1, 'whoosh_s'], [0.9, 'pops4'], [2.8, 'whoosh']],
  build(c, s) {                       // c = camera layer, s = state. Build DOM once.
    D(c, 'blob', { width: 900, height: 600, left: 500, top: 250 });
    s.h1 = typed(c, 'ctr head', { left: 960, top: 300, fontSize: '104px' }, [{ t: B.my.l1 }], false);
    s.h2 = typed(c, 'ctr head acc', { left: 960, top: 410, fontSize: '104px' }, [{ t: B.my.l2 }]);
    s.card = D(c, 'ctr card', { left: 960, top: 720, width: 900, height: 300 });
  },
  update(t, s, c) {                   // t = authored seconds. Pure function of t: never accumulate state.
    S(c, { s: L(1, 1.04, t / 3) });   // constant camera drift
    typeP(s.h1, P(t, .1, .5), t, false); typeP(s.h2, P(t, .5, .9), t);
    const k = P(t, .6, 1.1); S(s.card, { y: (1 - eo(k)) * 120, o: k * 2, b: (1 - eo(k)) * 10 });
  } });
```

Rules:
- Lay out for both formats: use `CX`, `CY`, `W`, `H` and `lv(landscape, vertical)` instead of fixed numbers, and check both boards.
- `update` must be a pure function of `t`, because frames render out of order on 4 workers.
- Position with `left`/`top`, plus `ctr` for centring. Animate only through `S()` or `transform`/`opacity`/`filter`.
- Shared helpers: `mkHand(c)` + `moveHand(h, t, x, y, t0, t1)` for a hand that travels and presses, `centerOf(el)` for a target's stage position (call it in `measure()`), and `iconHTML`/`glyphHTML`/`av` for the icon, glyphs and avatars.
- Pass numbers in `D()` styles only for px properties. `fontWeight`/`lineHeight`/`opacity`/`zIndex`/`flex` stay unitless (the helper handles them). Write font sizes as strings like `'104px'`.
- Use CSS variables (`var(--acc)`, `rgba(var(--accRGB),.5)`) instead of hex, so the theme follows the brief. In SVG, put colours in `style="stroke:var(--acc)"`, not in attributes.
- Put new copy in `brief.js` under a new key, not inline.
- Add `sfx` for every arrival: whoosh on cuts, pops on staggers, type on typing, click on clicks.

---

## `references/transitions.md`

### Transitions

The reference cuts almost never look like a plain cut. Each one below is either built into the engine or has a recipe here.

#### Built in (`tin` / `tout` on a shot, or a timeline override)

| Name | How | Feels like | Use between |
|---|---|---|---|
| `whip` | ±700–800 px horizontal slide with 60–70 px directional blur, 0.24–0.3 s | Energy, "next!" | Problem beats; benefit → proof |
| `up` | Vertical version of the whip | A lift, progress | Brand → first benefit; proof → social |
| `zoom` | Out: scale to 1.6 with blur and fade. In: from 0.82 with blur. | Diving in, focus | Chaos → pain (zoom *into* the problem); into a CTA |
| `fade` | Opacity plus blur plus a slight scale | Calm, a breath | Social → reel → cta |

#### Built into specific shots

| Name | Where | Recipe |
|---|---|---|
| **Focus pull** | Hook clock, headlines (`blurIn`) | blur 36 → 0 with scale 1.14 → 1, expo out |
| **Digit roll** | `hook` | Two stacked glyphs in a masked 1.2em box; translateY −1.2em with blur peaking mid-roll |
| **Dip to black** | End of `pain` | grayscale 0 → 1, then a radial dark overlay 0 → 1 over about 1 s |
| **Light-flare ring → icon** | `turn` | Dash-array circle draws while rotating, a flare (cross lines plus core) rides the arc head, the ring expands and fades as the icon pops with back-out |
| **White exposure flash** | End of `turn` → start of `brand` | `flash()` 0 → 1 (quadratic) at the end, then 1 → 0 (expo) at the start of the next shot |
| **Circle reveal** | `circle` | `clip-path: circle(R at focus)`, R 0 → 2300 px with `eio` over 0.7 s, and a soft ring at the edge. Set `under: 0.75` so the previous shot stays visible beneath it. |
| **Type-on** | Headlines and wordmarks | `typed()` + `typeP()`: per-character blur, rise and opacity, with a blinking accent cursor |
| **Count-up** | `pain`, `dashboard`, `social` | `Math.round(value * eo(P(t,a,b)))` with tabular numbers |
| **Slot reel** | `reel` | Numbers on an arc (`x = -d²·26`), scaled and faded by distance, vertical blur from speed |
| **3D swing-in** | `laptop` | rotateY −60° → −24° while translating in, blur from speed, and a sin bob afterwards |

#### Signature transitions (each is a shot)

| Name | Shot | Recipe |
|---|---|---|
| **Shape morph** | `morph` | One card box is keyframed (`layout(t)`): square 560 (radius 90) → folder 1000×600 (radius 34, a tab element grows on the top-left) → panel 1100×640. An accent fill layer fades over a white layer, the tab widens and drops into the header bar, then content cross-fades in. |
| **Rack focus / depth of field** | `rackfocus` | The UI sits in a `soft` layer and the button is outside it. The camera scales 1 → 2 around the button (origin = the button, plus a 60% pull toward the centre). `soft` blurs 0 → 7 px and the laptop base 0 → 10 px. A large, heavily blurred foreground pill slides past to sell depth. |
| **Colour-ize wall** | `colorize` | A face grid with `grayscale(1)` and opacity .5. After a toggle animates on, chosen faces go to grayscale(0) with a scale pop and a channel badge, staggered by distance from the centre plus jitter. A radial white wash keeps the copy readable. |
| **Device dive** | `dive` | The screen content is authored at full 1920×1080 and shown scaled by 880/1920 inside a 16:9 screen centred on the stage. The camera scales by 1920/880 around the centre with `eio`, so at the end the screen *is* the frame. The bezel blurs as it passes and the corner radius goes to 0. Then the content keeps animating. |
| **Glass card world** | `dive` (after the dive) | `backdrop-filter: blur(22px)` card at 14% white with a 2 px inner line, a thin 1-px white grid, and words on the card. With a screenshot, the screenshot blurs and gets an accent tint. |

#### Recipe still open

- **Comet message** (ref A 3.5 s): a pill moving along a path with 3–4 trailing copies at decreasing opacity and increasing blur. Build it as a shot when a brief needs it.

#### Choosing transitions

- Inside the problem section use hard, fast moves (whip, zoom). Use a **dark turn** between problem and solution, so the contrast is the "relief" moment. Use smoother moves (up, circle, fade) in the solution and proof sections.
- Never use the same transition three times in a row.
- Every transition gets a sound (whoosh, or a hit for big reveals): see `sound-design.md`.

---

## `references/sound-design.md`

### Sound design

Half of "premium" is sound. Every visual arrival gets a sound, and the music changes mood at the turn.

#### Music bed (`audio.py`, synthesized, `TIMELINE.BPM`, default 128)

| Section | When | Content |
|---|---|---|
| A: tension | 0 → start of `turn` | Am/F pad filtered dark, half-time kick, ticking hats, low bass pulses |
| B: break | `turn` | Kick drops out. Sub boom, a high shimmer pad, and a riser into the reveal. |
| C: groove | reveal (shot after `turn`) → `cta` | Fmaj7–G–Am7–C, four-on-the-floor kick, claps on 2 and 4, 16th hats, 8th-note bass and plucks, pad and bass ducked by the kick |
| D: outro | `cta` → end | A big hit, a sustained C chord, a falling pluck motif, and a fade-out over the last 0.8 s |

The synthesized bed is decent but not studio quality. For client work, ask for a licensed track and drop it in `assets/music.wav|mp3|m4a`. `build.sh` mixes it with the synthesized SFX, trims it to length, fades it out and loudness-normalizes to −14 LUFS. Pick tracks around 100–130 BPM with a clear drop. If needed, move the `turn` shot so the reveal lands on the drop.

#### SFX kinds (per-shot `sfx: [[authoredTime, kind]]`)

| Kind | Sound | Use on |
|---|---|---|
| `whoosh` / `whoosh_s` | Band-swept noise, 0.42 s / 0.3 s | Every whip, zoom or up cut (place at `len − 0.2`, so it sticks to the cut); `_s` for element flights |
| `pop`, `popsN` | Pitched blip; N of them at 75 ms spacing | Badges, pills and staggered cards |
| `tick`, `ticksN` | Short click; N decelerating | Digit roll, count-ups |
| `typeN` | N keyboard clicks | Typing headlines and messages (N ≈ characters ÷ 2) |
| `click` | Mouse click with a low thump | Hand or button presses |
| `stamp` | Thump with a noise burst | The red pain pill |
| `down` | Falling tone with filtered noise | Dip to black |
| `boom` | Sub drop | Start of the dark turn |
| `shimmer` | Bell cluster | Light flare drawing |
| `riser` | Rising noise and tone, **auto-length up to the next `hit`** | Before the reveal and before the CTA |
| `hit` / `hit_s` | Kick with crash and sub / a smaller one | The reveal, the CTA, the circle reveal |
| `swoop` | Rising sine | Something sent or launched |
| `swell` | Soft noise swell | The very first frame |
| `reel` / `reelN` | Ticks where the reel crosses each number | Slot reel |

Timing rules:
- Cues are written in the shot's *authored* time and are rescaled by the shot's speed.
- Cues within 0.3 s of the authored `len` stick to the cut, even when the shot is trimmed.
- Cues that fall inside a trimmed tail are dropped.

#### Mix targets

- Final output is −14 LUFS integrated with −1 dBTP (done in `build.sh`).
- Typing and ticks sit quietly under the music. Hits and whooshes are the loudest events.
- Check with `ffmpeg -i out/launch.mp4 -af ebur128 -f null -`.

---

## `references/reference-analysis.md`

### Reference breakdown

This style was studied from two premium SaaS launch films, frame by frame at 4 fps, with 20 fps strips around every transition and an audio tempo and hit analysis. Use it to see what "premium" means here, and run `scripts/analyze_reference.py` on any new reference the user brings.

#### Ref A: office-booking SaaS, 48.8 s, 16:9, 60 fps (the main model)

| Time | Beat | On screen |
|---|---|---|
| 0.0–1.0 | Hook (problem) | "8:01 am" pulls into focus from heavy blur. The minute digit rolls to 8:02, and a tiny chat bubble pops in at the corner. |
| 1.0–2.0 | Problem | "Who's actually **in today?**", with line 2 in the accent colour. Team tags float around it with tiny cursors. |
| 2.0–3.0 | Problem grows | A tilted 3D grid of tiles (chat icon, calendar, faces, "?" badges) flies in. This is the chaos shot. |
| 3.0–3.3 | Transition | Blur whip: the grid streaks off sideways and the next line streaks in from the same blur. |
| 3.3–4.2 | Problem | "One question", and a message pill shoots across on a comet trail. |
| 4.2–5.7 | Problem | A chat input types "is anyone in today?" with an accent cursor, above channel chips. |
| 5.7–7.5 | Problem peaks | A thread card. Replies stack up and a red badge counts from 1 to 46. Avatar bubbles orbit. |
| 7.6–9.1 | Pain stat | Blur whip to "**46 replies**" with a red "46 new" pill. The frame desaturates and dips to black. |
| 9.2–11.3 | Turn | Dark navy starfield. A light flare draws a glowing ring, which solidifies into the app icon with a lens-flare star on its corner. |
| 11.3–11.8 | Transition | White exposure flash from dark to light. |
| 12.0–13.6 | Brand | The icon slides left and the wordmark types on. Integration pills sit below. |
| 13.7–15.4 | Value 1 | "Right where your **team works**" types on, with integration icons floating above and below. |
| 15.5–17.4 | Proof of fit | A wall of grey faces. A toggle flips on and faces turn to colour one by one. |
| 17.5–18.7 | Value 2 | "See [avatar stack] **who's in**", with real avatars inline in the sentence. |
| 18.8–21.6 | Demo | A 3D-tilted laptop with the real UI swings in. A 3D hand cursor clicks, and the camera pushes into the screen with depth of field. |
| 21.7–23.4 | Value 3 | "Book next to **your team**" with a button pill that gets clicked. |
| 23.6–25.5 | Demo | A floor-plan card. A selection box draws, a path traces and tooltips pop. |
| 25.5–26.0 | Transition | Circle reveal: an accent dot grows from the click point and fills the screen. |
| 26.0–27.2 | Value 4 | Headline on solid accent, over a background pattern of the same words repeated. |
| 27.2–30.0 | Demo | An accent card morphs into a folder and then into the UI. A panel slides in and a button flips to a "done ✓" state. |
| 30.0–31.3 | Value 5 | A headline on accent with vertical light rays, and an integration icon bounces in. |
| 31.3–34.4 | Demo | A fast whip into a laptop with heavy motion blur, a click, and a rack focus. |
| 34.5–36.1 | Problem flipped | "Don't let your office **go to waste**", with a bar-chart icon building. |
| 36.1–38.6 | Proof | A dashboard on an accent dome horizon. Numbers count up, bars grow and side cards fan out. |
| 38.7–40.8 | Social proof | "Trusted by **500+ companies**" counts up, a logo marquee scrolls, and a G2 rating ticks up. |
| 41.0–42.8 | Proof | Avatar cluster, a counter, a "Live in 10 min" pill and a hand-drawn arrow. |
| 43.0–45.0 | Ease | A vertical slot reel rolls 05 to 10: "10 minutes to go live". |
| 45.0–48.8 | CTA | Icon and wordmark, the tagline with its last word in accent, two buttons, the URL, and an accent light-equalizer glow at the bottom. |

**Pacing:** a visual event every 0.4–0.8 s and a new scene every 1.5–2.5 s. The longest hold is about 3 s, on the CTA, and nothing is ever fully static.

**Audio:** about 92 BPM, felt in double time (≈185). The big hits sit exactly on the transitions: logo 12.3 s, laptop 18.6 s, circle reveal 25.9 s, whip 31.5 s.

#### Ref B: Mac AI assistant teaser, 15 s, 16:9, 25 fps

- Words fade in one at a time in a thin font on grey. A real object (a phone) emerges from an app icon, then a hard cut to black on the beat.
- The camera travels through devices with no visible cut: phone → app → laptop screen → live screen recording → scenic wallpaper.
- The wallpaper becomes the world: the laptop sits on grass inside a rounded glass card with thin grid lines, and the words are placed around the card.
- Takeaway: zoom between screens and objects so the cut disappears.

#### Shared rules (what makes it premium)

1. **Story:** a problem in a real moment → the pain grows (chaos, a growing number) → a dark turn → the reveal → 4–6 single-benefit beats (headline, then UI proof) → numbers and logos → it's easy → CTA.
2. **Headlines:** two lines, 3–6 words in total. Line 1 is ink and line 2 is the accent payoff. They type on or come out of blur, and leave the same way.
3. **Look:** a white or very light background, soft accent blobs, vertical light rays, deep soft shadows, glass and white cards, rounded geometric sans, one accent plus red for alerts.
4. **Motion:** expo-out moves with a slight overshoot. Constant drift and stagger. Motion blur on anything fast, and depth of field on 3D.
5. **Small details:** cursors, 3D hand pointers, avatar bubbles, red badges, chat pills, toggles, tooltips, count-ups.

---


# Part 2: Source code

## `template/brief.js`

````js
/* BRIEF: every word, number and colour in the film. Edit this file first.
 * The values below are the "Loopin" demo (a fictional product). Replace them all.
 * Keep headlines to 2-4 words per line; line 2 is the accent-coloured payoff.
 */
window.BRIEF = {
  product: 'Loopin',
  url: 'loopin.app',
  brand: {
    accent: '#2F6BFF',            // the one brand colour; the rest of the palette derives from it
    // accentLight: '#5B8CFF', accentDark: '#1F4FD6', ink: '#0B0D12', font: 'Inter',
    logo: null,                   // e.g. 'assets/logo.svg' (square works best); null = generated ring icon
  },
  people: ['MK', 'JL', 'AS', 'TR', 'BN', 'EO'],   // initials, or image paths like 'assets/p1.jpg'
  channels: [['#', '#7C5CFF', 'Chat'], ['@', '#FF6A3D', 'Email'], ['✓', '#19B36B', 'Docs']], // [glyph, colour, label]

  /* PROBLEM — a real moment */
  hook: { from: '9:13', to: '9:14', suffix: 'am', notifMeta: 'Client · 9:14', notif: 'any update on the v2 feedback??' },
  /* PROBLEM — the chaos */
  chaos: {
    l1: 'Feedback is', l2: 'everywhere.',
    sources: [['#', '#7C5CFF'], ['@', '#FF6A3D'], ['✉', '#2386D6'], ['☎', '#19B36B']],
    messages: ['is this the final?', 'see my comments', 'logo bigger pls', 'where’s v2??', 'can we revert?', 'feedback in doc', 'urgent!!', 'did you see this?'],
  },
  /* PAIN — the problem as a number */
  pain: { value: 127, unit: 'unread', pill: '+38 today', complaints: ['still waiting…', 'v2??', 'which file?', 'hello?', 'ETA?', 'missed this'] },

  /* BENEFIT — product UI on a 3D laptop, hand clicks the action */
  inbox: {
    l1: 'Every comment,', l2: 'one inbox.',
    screenshot: null,             // e.g. 'assets/app.png' (16:10). If set, replaces the mock UI below.
    click: [0.86, 0.2],           // where the hand clicks on the screenshot (fractions of width, height)
    nav: ['Inbox', 'Assigned', 'Done', 'Clients'],
    title: 'All feedback', badge: '5 new',
    items: [['Logo needs more contrast', 'Design'], ['Pricing copy feels long', 'Copy'], ['Love the new hero!', 'Praise'], ['Checkout bug on Safari', 'Bug'], ['Can we add dark mode?', 'Request']],
    tags: { Design: ['#EEF3FF', '#2F6BFF'], Copy: ['#FFF3E8', '#E0701E'], Praise: ['#E8FBF2', '#139B6E'], Bug: ['#FFECEC', '#D63C3C'], Request: ['#F1ECFF', '#6A4BE0'] },
    action: 'Resolve ✓',
  },
  /* BENEFIT — circle reveal, things sort themselves */
  sort: {
    l1: 'Sorted by AI.', l2: 'Instantly.', pattern: ['by AI', 'instantly sorted'],
    columns: ['Design', 'Bug', 'Praise'],
    chips: [['Logo needs contrast', 0], ['Checkout bug on Safari', 1], ['Love the new hero!', 2], ['Spacing on mobile', 0], ['Login loops twice', 1], ['Great onboarding', 2], ['Icons feel heavy', 0], ['PDF export fails', 1], ['So much faster', 2]],
  },
  /* BENEFIT — one action fans out to many places (uses channels) */
  reply: { l1: 'Reply once.', l2: 'Everyone sees it.', message: 'Fixed in v2.1, take a look ✓', avatar: 'YOU' },

  /* BENEFIT — grey wall of faces lights up as a toggle connects (integrations / team adoption) */
  colorize: { l1: 'Plugs into', l2: 'your tools.', toggle: 'Connect Chat, Email & Docs', pill: '48 clients synced' },
  /* BENEFIT — accent card with a headline morphs into a folder, then into the product panel; a hand approves */
  morph: { l1: 'Approvals,', l2: 'one click.', title: 'Review · Homepage v2', panelTitle: 'Homepage v2',
    meta: [['Owner', 'Maya K.'], ['Due', 'Today'], ['Comments', '12 resolved']], button: 'Approve', done: 'Approved ✓' },
  /* BENEFIT — laptop whips in, a request types and sends, camera pushes onto the button with depth of field */
  rack: { request: 'Review the new pricing page', button: 'Send request', done: 'Sent ✓', screenshot: null,
    l1: 'Ask once.', l2: 'Get answers.' },   // l1/l2 show in 9:16 only (fills the space above the laptop)
  /* TRANSITION/BENEFIT — camera dives into the laptop screen until it fills the frame; headline on glass */
  dive: { l1: 'Lives where', l2: 'you already work.', screenshot: null },

  /* PROOF — dashboard with count-ups */
  proof: {
    pre: 'Close feedback ', accent: '3.2× faster',
    panel: 'Feedback overview', period: 'This week',
    m1: { label: 'Resolved', to: 12480 },
    m2: { label: 'Avg. reply', from: 60, to: 18, unit: ' min' },
    bars: [40, 62, 48, 80, 96, 120, 150],
    left: { label: 'Clients happy', to: 94, suffix: '%' },
    right: { label: 'Rating', to: 4.9 },
    quote: '“we shipped v2 a week early”',
  },
  /* PROOF — social proof */
  social: { l1: 'Trusted by', from: 300, to: 1200, suffix: '+ teams',
    logos: ['Northwind', 'kitebase', 'LUMEN&CO', 'Orbital', 'acme.io', 'Brightline', 'QUANTA', 'fernway'],   // or image paths
    rating: { from: 4.1, to: 4.9, note: '600+ reviews' } },
  /* EASE — slot-reel number */
  setup: { from: 10, to: 2, l1: 'minutes', l2: 'to set up' },
  /* CTA */
  cta: { tagline: ['Close the loop ', 'on every client.'], primary: 'Start free →', secondary: 'Book a demo' },
};
````

## `template/timeline.js`

````js
/* TIMELINE: which shots, in what order, how long, how fast.
 * Each row: [shotId, secondsOnScreen, speed, overrides?]
 *   secondsOnScreen: real time the shot is visible (cut point = pacing).
 *   speed: plays the shot's authored animation this many times faster.
 *          The shot shows secondsOnScreen*speed of its authored length (see shots.js `len`);
 *          if that is less than `len`, the tail hold is trimmed.
 *   overrides: e.g. { tin: 'whip', tout: 'fade' } to change the transitions.
 * Shots: hook chaos pain turn brand laptop circle fanout dashboard social reel cta,
 *        plus colorize morph rackfocus dive (see references/shot-library.md). For example,
 *        swap a benefit for ['dive', 2.5, 1.25] or ['morph', 2.8, 1.35] to vary the moves.
 * Pacing rules: 1.5-2.8 s per shot, CTA 2.5-3.5 s, total 22-35 s. A shot whose last move ends
 * more than 0.6 s before its cut will feel stuck: raise speed or lower seconds.
 */
window.TIMELINE = {
  FPS: 30, BPM: 128,
  FORMAT: '16:9',          // or '9:16'. Override per render with FORMAT=9:16 ./build.sh (or FORMAT=both)
  // shotsVertical: [...],  // optional: a different (shorter) shot list for 9:16 only
  shots: [
    ['hook',      1.6, 1.35],
    ['chaos',     2.0, 1.3],
    ['pain',      2.2, 1.35],
    ['turn',      2.0, 1.25],
    ['brand',     1.7, 1.3],
    ['laptop',    2.7, 1.55],
    ['circle',    2.6, 1.35],
    ['fanout',    2.6, 1.35],
    ['dashboard', 2.4, 1.4],
    ['social',    1.9, 1.3],
    ['reel',      1.7, 1.25],
    ['cta',       3.0, 1.2],
  ],
};
````

## `template/index.html`

````html
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Launch film</title>
<style>
@font-face{font-family:Inter;src:url(fonts/Inter-400.ttf);font-weight:400}
@font-face{font-family:Inter;src:url(fonts/Inter-500.ttf);font-weight:500}
@font-face{font-family:Inter;src:url(fonts/Inter-600.ttf);font-weight:600}
@font-face{font-family:Inter;src:url(fonts/Inter-700.ttf);font-weight:700}
@font-face{font-family:Inter;src:url(fonts/Inter-800.ttf);font-weight:800}
/* palette is derived from BRIEF.brand.accent by applyTheme() in engine.js */
:root{--acc:#2F6BFF;--accRGB:47,107,255;--acc2:#5B8CFF;--acc2RGB:91,140,255;--acc3:#1F4FD6;--acc4:#CFE0FF;--tint:#EEF3FF;--blobRGB:157,187,255;
  --night1:#0E2A6B;--night2:#06112E;--ink:#0B0D12;--mut:#8A90A0;--red:#FF4D4F;--font:Inter}
*{box-sizing:border-box}
html,body{margin:0;background:#111;overflow:hidden}
#wrap{position:absolute;left:0;top:0;transform-origin:0 0}
#stage{position:relative;width:1920px;height:1080px;overflow:hidden;background:#fff;font-family:var(--font),Inter,sans-serif;color:var(--ink);-webkit-font-smoothing:antialiased}
.scene{position:absolute;inset:0;overflow:hidden;display:none;will-change:transform,filter}
.cam{position:absolute;inset:0;transform-origin:var(--camOrigin,960px 540px)}
.abs{position:absolute}
.ctr{position:absolute;transform:translate(-50%,-50%)}
.blob{position:absolute;border-radius:50%;filter:blur(90px);background:radial-gradient(circle,rgba(var(--blobRGB),1) 0%,rgba(var(--blobRGB),0) 70%)}
.rays{position:absolute;left:0;right:0;bottom:0;filter:blur(18px);
  background:repeating-linear-gradient(90deg,rgba(var(--accRGB),0) 0 40px,rgba(var(--accRGB),.55) 40px 70px,rgba(var(--accRGB),.1) 70px 120px,rgba(var(--acc2RGB),.7) 120px 140px);
  -webkit-mask-image:linear-gradient(0deg,#000 0%,rgba(0,0,0,.6) 40%,transparent 100%)}
.head{font-weight:600;letter-spacing:-.045em;line-height:1.02;white-space:pre}
.acc{color:var(--acc)}
.card{background:#fff;border-radius:22px;box-shadow:0 30px 80px -20px rgba(30,50,110,.28),0 4px 14px rgba(30,50,110,.08)}
.pill{display:inline-flex;align-items:center;gap:10px;padding:10px 18px;border-radius:999px;background:#fff;font-weight:500;font-size:20px;white-space:nowrap;box-shadow:0 12px 30px -8px rgba(30,50,110,.25)}
.av{border-radius:50%;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:600;border:3px solid #fff;flex:none;box-shadow:0 8px 20px -6px rgba(0,0,0,.3)}
.badge{background:var(--red);color:#fff;font-weight:700;border-radius:999px;padding:4px 12px;font-size:18px}
.icon{width:120px;height:120px;border-radius:30px;background:linear-gradient(160deg,var(--acc2),var(--acc) 60%,var(--acc3));flex:none;
  box-shadow:inset 0 2px 0 rgba(255,255,255,.6),inset 0 -6px 14px rgba(0,0,0,.18),0 24px 50px -12px rgba(var(--accRGB),.6);display:flex;align-items:center;justify-content:center}
.icon i{width:45%;height:45%;border-radius:50%;border:solid var(--ink);border-width:calc(var(--s,120px)*.11);background:#fff;display:block}
.glyph{width:64px;height:64px;border-radius:16px;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700;font-size:30px;flex:none;box-shadow:0 14px 30px -10px rgba(0,0,0,.35)}
.row{display:flex;align-items:center;gap:14px}
.ln{height:12px;border-radius:6px;background:#E7EBF3}
.tag{font-size:14px;font-weight:600;padding:5px 10px;border-radius:8px;white-space:nowrap}
.ch{display:inline-block;white-space:pre}
.cur{display:inline-block;width:.07em;height:.9em;background:var(--acc);border-radius:3px;vertical-align:-.08em;margin-left:.04em}
.num{font-variant-numeric:tabular-nums}
#flash{position:absolute;inset:0;background:#fff;opacity:0;pointer-events:none;z-index:500}
#ui{position:fixed;left:0;right:0;bottom:0;display:flex;gap:12px;align-items:center;padding:10px 16px;background:rgba(0,0,0,.75);color:#fff;font:13px Inter,sans-serif}
#ui input{flex:1}
body.render #ui{display:none}
</style>
</head>
<body>
<div id="wrap"><div id="stage"><div id="flash"></div></div></div>
<svg width="0" height="0" style="position:absolute"><defs id="fdefs"></defs></svg>
<div id="ui"><button id="play">Play</button><a id="fmt" style="color:#9cf"></a><input id="scrub" type="range" min="0" value="0"><span id="tc">0.00s</span><span>(preview only, no audio; the render is frame-exact)</span></div>
<script src="brief.js"></script>
<script src="timeline.js"></script>
<script src="engine.js"></script>
<script src="shots.js"></script>
<script>
boot();
/* preview: fit to window, play/scrub. Rendering adds ?render=1 and drives renderAt() itself. */
const R = new URLSearchParams(location.search).has('render');
if (R) document.body.classList.add('render');
const fl = document.getElementById('fmt'); fl.textContent = V ? 'switch to 16:9' : 'switch to 9:16'; fl.href = '?fmt=' + (V ? '16:9' : '9:16');
const wrap = document.getElementById('wrap');
function fit() { const s = R ? 1 : Math.min(innerWidth / W, (innerHeight - 48) / H); wrap.style.transform = `scale(${s})`; }
addEventListener('resize', fit); fit();
if (!R) {
  const scrub = document.getElementById('scrub'), tc = document.getElementById('tc'), btn = document.getElementById('play');
  let playing = false, t0 = 0, cur = 0;
  const wait = setInterval(() => { if (!window.READY) return; clearInterval(wait); scrub.max = window.TOTAL - 1; }, 50);
  scrub.oninput = () => { cur = scrub.value / FPS; window.renderAt(cur); tc.textContent = cur.toFixed(2) + 's'; };
  btn.onclick = () => { playing = !playing; btn.textContent = playing ? 'Pause' : 'Play'; t0 = performance.now() - cur * 1000; };
  (function loop() { if (playing && window.READY) { cur = ((performance.now() - t0) / 1000) % window.DUR; window.renderAt(cur); scrub.value = Math.floor(cur * FPS); tc.textContent = cur.toFixed(2) + 's'; } requestAnimationFrame(loop); })();
}
</script>
</body>
</html>
````

## `template/engine.js`

````js
/* SaaS launch video engine.
 * Every frame is a pure function of time: window.renderAt(seconds).
 * Shots (shots.js) register with shot(id, def); timeline.js orders them and sets
 * each one's on-screen duration and playback speed. Copy and colours come from brief.js.
 */
'use strict';
const TL = window.TIMELINE, B = window.BRIEF;
/* FORMAT: '16:9' (1920x1080) or '9:16' (1080x1920). Set TIMELINE.FORMAT, or override per render with ?fmt=9:16 */
const FMT = new URLSearchParams(location.search).get('fmt') || TL.FORMAT || '16:9';
const V = FMT === '9:16';                       // vertical
const W = V ? 1080 : 1920, H = V ? 1920 : 1080, FPS = TL.FPS || 30;
const CX = W / 2, CY = H / 2;
const lv = (land, vert) => V ? vert : land;     // pick a value per format

/* ---------- math & easing ---------- */
const C = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const P = (t, a, b) => C((t - a) / (b - a));
const L = (a, b, p) => a + (b - a) * p;
const eo = p => p >= 1 ? 1 : 1 - Math.pow(2, -10 * p);                     // expo out: fast in, long settle
const eio = p => p < .5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;  // cubic in-out: camera moves
const ei = p => p * p * p;                                                  // cubic in: exits
const bo = p => { const c1 = 1.5, c3 = c1 + 1; return p <= 0 ? 0 : 1 + c3 * Math.pow(p - 1, 3) + c1 * Math.pow(p - 1, 2); }; // back out: pops
const hash = n => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
const vel = (f, t) => Math.abs(f(t + 1 / 60) - f(t - 1 / 60));             // px moved in one 30 fps frame → motion blur

/* ---------- theme: derive the palette from one accent colour ---------- */
function hexRgb(h) { h = h.replace('#', ''); if (h.length === 3) h = h.split('').map(c => c + c).join(''); return [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16)); }
const mix = (a, b, p) => a.map((v, i) => Math.round(v + (b[i] - v) * p));
const rgbS = c => c.join(',');
function applyTheme(br) {
  const a = hexRgb(br.accent), wt = [255, 255, 255], bk = [0, 0, 0], r = document.documentElement.style;
  const acc2 = br.accentLight ? hexRgb(br.accentLight) : mix(a, wt, .28), acc3 = br.accentDark ? hexRgb(br.accentDark) : mix(a, bk, .22);
  r.setProperty('--acc', `rgb(${rgbS(a)})`); r.setProperty('--accRGB', rgbS(a));
  r.setProperty('--acc2', `rgb(${rgbS(acc2)})`); r.setProperty('--acc2RGB', rgbS(acc2));
  r.setProperty('--acc3', `rgb(${rgbS(acc3)})`);
  r.setProperty('--acc4', `rgb(${rgbS(mix(a, wt, .75))})`);
  r.setProperty('--tint', `rgb(${rgbS(mix(a, wt, .91))})`);
  r.setProperty('--blobRGB', rgbS(mix(a, wt, .55)));
  r.setProperty('--night1', `rgb(${rgbS(mix(a, bk, .62))})`); r.setProperty('--night2', `rgb(${rgbS(mix(a, bk, .86))})`);
  if (br.ink) r.setProperty('--ink', br.ink);
  if (br.font) r.setProperty('--font', br.font);
}

/* ---------- DOM ---------- */
const stage = document.getElementById('stage'), fdefs = document.getElementById('fdefs');
const NOPX = /opacity|zIndex|flex|fontWeight|lineHeight/;
function D(parent, cls, style, html) {
  const e = document.createElement('div'); if (cls) e.className = cls;
  if (style) for (const k in style) e.style[k] = typeof style[k] === 'number' && !NOPX.test(k) ? style[k] + 'px' : style[k];
  if (html != null) e.innerHTML = html; parent.appendChild(e); return e;
}
let fid = 0;
function mkBlur() { // directional (SVG) blur: real-looking horizontal/vertical motion blur
  const id = 'mb' + (fid++);
  fdefs.insertAdjacentHTML('beforeend', `<filter id="${id}" x="-50%" y="-50%" width="200%" height="200%" color-interpolation-filters="sRGB"><feGaussianBlur stdDeviation="0 0"/></filter>`);
  const g = fdefs.lastElementChild.firstElementChild;
  return { url: `url(#${id})`, set(bx, by) { g.setAttribute('stdDeviation', `${bx.toFixed(2)} ${by.toFixed(2)}`); } };
}
/* S(el, {x y s r rx ry o b bx by f}): transform + opacity + blur (iso b, or directional bx/by). .ctr elements are centred on left/top. */
function S(e, o) {
  const c = e.classList.contains('ctr') ? 'translate(-50%,-50%) ' : '';
  e.style.transform = `${c}translate(${(o.x || 0).toFixed(2)}px,${(o.y || 0).toFixed(2)}px) rotateX(${o.rx || 0}deg) rotateY(${o.ry || 0}deg) rotate(${(o.r || 0).toFixed(2)}deg) scale(${(o.s == null ? 1 : o.s).toFixed(4)})`;
  if (o.o != null) { e.style.opacity = C(o.o).toFixed(3); e.style.visibility = o.o <= 0.001 ? 'hidden' : 'visible'; }
  let f = o.f || '';
  if (o.bx != null || o.by != null) {
    const bx = o.bx || 0, by = o.by || 0;
    if (bx > .15 || by > .15) { if (!e._mb) e._mb = mkBlur(); e._mb.set(bx, by); f += ' ' + e._mb.url; }
  } else if (o.b > .1) f += ` blur(${o.b.toFixed(2)}px)`;
  e.style.filter = f.trim() || 'none';
}
const AVC = [['#FFB86B', '#F06A2A'], ['#7C5CFF', '#4B2FD6'], ['#3DD6A0', '#139B6E'], ['#FF7AA8', '#D63C77'], ['#6FC3FF', '#2386D6'], ['#FFD36B', '#E09A12']];
/* avatar: initials on a gradient, or an image if `n` looks like a path */
const av = (n, s, i) => /\.(png|jpe?g|webp|svg)$/i.test(n)
  ? `<div class="av" style="width:${s}px;height:${s}px;background:url('${n}') center/cover"></div>`
  : `<div class="av" style="width:${s}px;height:${s}px;font-size:${s * .36}px;background:linear-gradient(135deg,${AVC[i % 6][0]},${AVC[i % 6][1]})">${n}</div>`;
const person = i => (B.people || ['MK', 'JL', 'AS', 'TR', 'BN', 'EO'])[i % (B.people || [1, 2, 3, 4, 5, 6]).length];
/* app icon: brief logo image, or a generated glossy ring icon */
const iconHTML = s => B.brand.logo
  ? `<div class="icon" style="width:${s}px;height:${s}px;border-radius:${s * .25}px;background:#fff;overflow:hidden"><img src="${B.brand.logo}" style="width:100%;height:100%;object-fit:contain"></div>`
  : `<div class="icon" style="width:${s}px;height:${s}px;border-radius:${s * .25}px;--s:${s}px"><i></i></div>`;
/* 3D-looking hand pointer (fingertip at 35,8 inside the 110x130 box) */
const handHTML = () => `<svg width="110" height="130" viewBox="0 0 22 26"><defs><linearGradient id="hg${fid++}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" style="stop-color:var(--acc2)"/><stop offset="1" style="stop-color:var(--acc3)"/></linearGradient></defs><path d="M7 1.5c1 0 1.8.8 1.8 1.8v7.2l.6-.1c.9-.1 1.7.4 2 1.2.6-.3 1.4-.3 2 .1.5-.3 1.3-.3 1.9.1.9.6 1.5 1.6 1.5 2.7V19c0 3.3-2.7 6-6 6H9.6c-1.7 0-3.3-.8-4.3-2.1L1.6 18c-.6-.8-.5-1.9.3-2.5.8-.6 1.9-.5 2.5.3l.8 1V3.3C5.2 2.3 6 1.5 7 1.5z" fill="url(#hg${fid - 1})" stroke="#fff" stroke-width="1"/></svg>`;
function mkHand(c) { const h = D(c, 'abs', { left: 0, top: 0, width: 110, height: 130, filter: 'drop-shadow(0 18px 18px rgba(20,40,110,.45))' }, handHTML()); h.style.transformOrigin = '35px 8px'; return h; }
/* animate a hand from off-frame (dx,dy) to the target tip position (tx,ty), arriving at t1, pressing at t1..t1+.3 */
function moveHand(h, t, tx, ty, t0, t1, dx = 420, dy = 520) {
  const hp = eio(P(t, t0, t1)), press = t > t1 && t < t1 + .3 ? 1 - .12 * Math.sin(P(t, t1, t1 + .3) * Math.PI) : 1;
  S(h, { x: L(tx - 35 + dx, tx - 35, hp) - Math.sin(hp * Math.PI) * 60, y: L(ty - 8 + dy, ty - 8, hp), s: press, o: P(t, t0 - .05, t0 + .15), r: L(18, 0, hp) });
}
/* centre of an element in stage coordinates */
function centerOf(e) { const r = e.getBoundingClientRect(), sr = stage.getBoundingClientRect(); return { x: r.left - sr.left + r.width / 2, y: r.top - sr.top + r.height / 2 }; }
const glyphHTML = (g, col, s = 26) => `<span class="glyph" style="width:${s}px;height:${s}px;border-radius:${s * .27}px;font-size:${s * .54}px;background:${col}">${g}</span>`;

/* typed text. segs: [{t, cls}] → {el, chars, cur}; typeP(T, p, t) reveals p∈[0,1] with blur-in per char + blinking cursor */
function typed(parent, cls, style, segs, cursor = true) {
  const e = D(parent, cls, style); const chars = [];
  for (const s of segs) {
    const g = document.createElement('span'); if (s.cls) g.className = s.cls; e.appendChild(g);
    for (const ch of s.t) { if (ch === '\n') { g.appendChild(document.createElement('br')); continue; } const c = document.createElement('span'); c.className = 'ch'; c.textContent = ch; g.appendChild(c); chars.push(c); }
  }
  let cur = null; if (cursor) { cur = document.createElement('span'); cur.className = 'cur'; e.appendChild(cur); }
  return { el: e, chars, cur };
}
function typeP(T, p, t, curOn = true) {
  const n = p * T.chars.length;
  T.chars.forEach((c, i) => {
    const k = C(n - i);
    c.style.display = k > 0 ? 'inline-block' : 'none';
    c.style.opacity = (.25 + .75 * k).toFixed(3);
    c.style.filter = k < 1 ? `blur(${((1 - k) * 6).toFixed(2)}px)` : 'none';
    c.style.transform = `translateY(${((1 - k) * 8).toFixed(1)}px)`;
  });
  if (T.cur) T.cur.style.opacity = !curOn || p <= 0 ? 0 : (p < 1 ? 1 : (Math.floor(t * 2.6) % 2 ? 0 : 1));
}
/* whole-element focus-pull reveal */
function blurIn(e, t, a, b, o = {}) {
  const p = eo(P(t, a, b));
  S(e, { o: C((t - a) / ((b - a) * .4)), b: (1 - p) * (o.blur || 24), s: L(o.s0 || 1.06, 1, p), y: (1 - p) * (o.y || 0), x: (1 - p) * (o.x || 0) });
}
const flash = v => { document.getElementById('flash').style.opacity = C(v).toFixed(3); };

/* ---------- shot registry + timeline ---------- */
const SHOTS = {};
function shot(id, def) { SHOTS[id] = def; }
const scenes = [];
function buildTimeline() {
  let a = 0;
  (V && TL.shotsVertical ? TL.shotsVertical : TL.shots).forEach((row, i) => {
    const [id, dur, k = 1, over = {}] = row, def = SHOTS[id];
    if (!def) throw new Error('unknown shot ' + id);
    const sc = Object.assign({ id, i, a, b: a + dur, dur, k, vd: dur * k }, def, over);
    sc.root = D(stage, 'scene', { background: sc.bg || 'linear-gradient(180deg,#fff 0%,#F5F7FC 100%)', zIndex: i + 1 });
    sc.cam = D(sc.root, 'cam'); sc.st = {};
    sc.build(sc.cam, sc.st, sc);
    scenes.push(sc); a += dur;
  });
  window.DUR = a; window.TOTAL = Math.round(a * FPS);
}
/* scene-level transitions (tin/tout): whip, up, zoom, fade */
function applyTr(sc, lt) {
  const d = sc.dur; const o = { x: 0, y: 0, s: 1, o: 1, bx: 0, by: 0 };
  const I = sc.tin, O = sc.tout, ti = .3, to = .24;
  if (I && lt < ti) {
    const p = eo(lt / ti), q = 1 - p;
    if (I === 'whip') { o.x = q * W * .36; o.bx = q * 60; }
    if (I === 'up') { o.y = q * 500; o.by = q * 50; }
    if (I === 'zoom') { o.s = L(.82, 1, p); o.bx = o.by = q * 24; }
    if (I === 'fade') { o.o = C(lt / .2); o.bx = o.by = q * 30; o.s = L(1.06, 1, p); }
  }
  if (O && lt > d - to) {
    const p = ei(P(lt, d - to, d));
    if (O === 'whip') { o.x += -p * W * .42; o.bx += p * 70; }
    if (O === 'up') { o.y += -p * 600; o.by += p * 60; }
    if (O === 'zoom') { o.s *= L(1, 1.6, p); o.bx += p * 30; o.by += p * 30; o.o = 1 - p * .6; }
    if (O === 'fade') { o.o = 1 - p; o.bx += p * 30; o.by += p * 30; }
  }
  S(sc.root, o);
}
function show(sc, lt) { sc.root.style.display = 'block'; applyTr(sc, lt); sc.update(lt * sc.k, sc.st, sc.cam, sc); }
window.renderAt = function (t) {
  flash(0);
  for (const sc of scenes) sc.root.style.display = 'none';
  scenes.forEach((sc, i) => {
    const lt = t - sc.a;
    if (lt >= 0 && lt < sc.dur) {
      if (sc.under && i > 0 && lt < sc.under) { const pv = scenes[i - 1]; show(pv, pv.dur - 0.001); }
      show(sc, lt);
    }
  });
};
/* sound cues in real time. Shot sfx are [authoredTime, kind]; cues within .3 s of the shot's authored end stick to the cut. */
window.exportCues = function () {
  const sfx = [];
  for (const sc of scenes) for (const [lt, kind] of (sc.sfx || [])) {
    const fromEnd = (sc.len || sc.vd) - lt;
    let at;
    if (fromEnd <= .3) at = sc.b - fromEnd;
    else if (lt <= sc.vd + .05) at = sc.a + lt / sc.k;
    else continue; // that part of the shot was trimmed
    sfx.push([+at.toFixed(3), kind, sc.k]);
  }
  sfx.sort((x, y) => x[0] - y[0]);
  const find = id => { const s = scenes.find(s => s.id === id); return s ? s : null; };
  const turn = find('turn'), cta = find('cta');
  return { FPS, BPM: TL.BPM || 128, DUR: window.DUR, W, H, FMT, sfx,
    markers: { turn: turn ? turn.a : null, drop: turn ? turn.b : 0, cta: cta ? cta.a : window.DUR },
    scenes: scenes.map(s => ({ id: s.id, a: s.a, b: s.b, k: s.k, hero: s.hero })) };
};
function boot() {
  stage.style.width = W + 'px'; stage.style.height = H + 'px';
  document.documentElement.style.setProperty('--camOrigin', `${CX}px ${CY}px`);
  applyTheme(B.brand);
  buildTimeline();
  document.fonts.ready.then(() => Promise.all([...document.images].map(im => im.complete ? 0 : new Promise(r => { im.onload = im.onerror = r; })))).then(() => {
    for (const sc of scenes) if (sc.measure) { sc.root.style.display = 'block'; sc.measure(sc.st, sc); sc.root.style.display = 'none'; }
    window.renderAt(0); window.READY = true;
  });
}
````

## `template/shots.js`

````js
/* SHOT LIBRARY. Each shot: shot(id, { len, tin, tout, bg, under, sfx, build(c, s, sc), update(t, s, c, sc), measure? })
 *   hero — authored time of the shot's best still (used for the storyboard board)
 *   len  — authored length in seconds (t in update() runs 0..len, scaled by the timeline speed)
 *   sfx  — [[t, kind], ...] in authored time; see audio.py for kinds
 *   c    — the shot's camera layer (scale it for a slow push); s — per-shot state
 * Stage is W x H: 1920x1080 (16:9) or 1080x1920 (9:16, V=true). Centre is CX, CY. lv(landscape, vertical)
 * picks a value per format. All copy comes from BRIEF (B), all colours from CSS vars.
 */
'use strict';

/* ===== hook: a real moment — a clock rolls a minute, a message lands ===== */
shot('hook', { hero: 1.9, len: 2.5, tout: 'whip',
  sfx: [[0.02, 'swell'], [1.0, 'tick'], [1.3, 'whoosh_s'], [1.35, 'pop'], [2.32, 'whoosh']],
  build(c, s) {
    const h = B.hook, pre = h.from.slice(0, -1), d1 = h.from.slice(-1), d2 = h.to.slice(-1);
    D(c, 'blob', { width: 900, height: 600, left: -200, top: H - 350 });
    D(c, 'blob', { width: 700, height: 500, left: W - 550, top: -200, opacity: .7 });
    s.clock = D(c, 'ctr head', { left: CX, top: CY, fontSize: lv(230, 190) + 'px', lineHeight: 1.2, display: 'flex', alignItems: 'flex-start' },
      `<span>${pre}</span><span style="display:block;position:relative;width:.62em;height:1.2em;overflow:hidden;-webkit-mask-image:linear-gradient(180deg,transparent 0%,#000 18%,#000 82%,transparent 100%)"><span class="dg" style="position:absolute;left:0;top:0;display:block"><span style="display:block;height:1.2em">${d1}</span><span style="display:block;height:1.2em">${d2}</span></span></span><span class="acc" style="font-weight:500">&nbsp;${h.suffix}</span>`);
    s.dg = s.clock.querySelector('.dg');
    s.notif = D(c, 'ctr card row', { left: lv(1500, CX), top: lv(215, CY - 340), padding: '16px 22px', borderRadius: '18px' },
      `${av(person(0), 54, 0)}<div><div style="font-size:15px;color:var(--mut);font-weight:600">${h.notifMeta}</div><div style="font-size:22px;font-weight:600;white-space:nowrap">${h.notif}</div></div>`);
    s.dot = D(c, 'ctr', { left: lv(1500, CX), top: lv(120, CY - 435), width: 14, height: 14, borderRadius: '50%', background: 'var(--red)' });
  },
  update(t, s, c) {
    S(c, { s: L(1, 1.05, t / 2.5) });
    const p = eo(P(t, 0, .8));
    S(s.clock, { o: C(t / .3), b: (1 - p) * 36, s: L(1.14, 1, p) });
    const r = eio(P(t, .95, 1.25));
    s.dg.style.transform = `translateY(${-r * 1.2}em)`; s.dg.style.filter = `blur(${(Math.sin(r * Math.PI) * 7).toFixed(1)}px)`;
    const nx = tt => L(460, 0, bo(P(tt, 1.3, 1.8))), ny = tt => L(-140, 0, bo(P(tt, 1.3, 1.8)));
    S(s.notif, { x: nx(t), y: ny(t), r: L(10, -3, eo(P(t, 1.3, 1.8))), o: C((t - 1.3) * 6), bx: vel(nx, t) * .25, by: vel(ny, t) * .2 });
    S(s.dot, { x: 250, y: 50, s: bo(P(t, 1.7, 1.95)), o: P(t, 1.7, 1.75) });
  } });

/* ===== chaos: tilted 3D wall of message cards + blur-whip headline ===== */
shot('chaos', { hero: 1.6, len: 3.0, tin: 'whip', tout: 'zoom',
  sfx: [[0.12, 'pops6'], [0.28, 'whoosh_s'], [0.4, 'whoosh_s'], [2.75, 'whoosh']],
  build(c, s) {
    const ch = B.chaos;
    D(c, 'blob', { width: 1200, height: 700, left: CX - 610, top: CY - 340 });
    s.plane = D(c, 'abs', { left: 0, top: 0, width: W, height: H, transformOrigin: '50% 60%' });
    const FX = lv(1250, CX), FY = lv(480, CY + 260);
    s.cards = [];
    for (let r = 0; r < lv(6, 10); r++) for (let k = 0; k < lv(9, 6); k++) {
      const x = lv(-60, -150) + k * 240, y = -160 + r * 230, n = r * 9 + k, on = (n * 7) % 3 !== 0;
      const e = D(s.plane, 'abs', { left: x, top: y, width: 200, height: 190, borderRadius: '26px', padding: '18px',
        background: on ? '#fff' : 'rgba(255,255,255,.55)', boxShadow: on ? '0 20px 40px -14px rgba(30,50,110,.3)' : 'inset 0 0 0 2px #E3E8F3' });
      let bd = null;
      if (on) {
        const sr = ch.sources[n % ch.sources.length];
        e.innerHTML = `<div class="glyph" style="width:46px;height:46px;font-size:22px;border-radius:12px;background:${sr[1]}">${sr[0]}</div><div style="font-size:17px;font-weight:600;margin-top:14px;line-height:1.2">${ch.messages[n % ch.messages.length]}</div>`;
        if (n % 3 === 1) bd = D(e, 'abs badge', { right: -10, top: -10 }, String((n * 13) % 40 + 3));
      }
      s.cards.push({ e, bd, d: .08 + Math.hypot(x + 100 - FX, y + 95 - FY) * .00055 + hash(n) * .12 });
    }
    s.wash = V ? D(c, 'abs', { left: -200, top: 380, width: W + 400, height: 800, background: 'radial-gradient(ellipse 50% 50% at 50% 50%,#fff 45%,rgba(255,255,255,.95) 60%,rgba(255,255,255,0) 100%)', filter: 'blur(20px)' })
      : D(c, 'abs', { left: -200, top: 0, width: 1300, height: 1080, background: 'linear-gradient(90deg,#fff 0%,rgba(255,255,255,.97) 55%,rgba(255,255,255,0) 100%)', filter: 'blur(20px)' });
    s.lx = lv(520, CX);
    s.l1 = D(c, 'ctr head', { left: s.lx, top: lv(478, 717), fontSize: '124px' }, ch.l1);
    s.l2 = D(c, 'ctr head acc', { left: s.lx, top: lv(604, 843), fontSize: '124px' }, ch.l2);
  },
  update(t, s) {
    s.plane.style.transform = `perspective(1800px) rotateX(18deg) rotateZ(-6deg) scale(${(1.15 + t * .03).toFixed(4)}) translateX(${(-t * 30).toFixed(1)}px)`;
    for (const k of s.cards) {
      const p = P(t, k.d, k.d + .4);
      k.e.style.opacity = C(p * 3).toFixed(3); k.e.style.transform = `scale(${L(.5, 1, bo(p)).toFixed(3)}) translateY(${((1 - eo(p)) * 40).toFixed(1)}px)`;
      if (k.bd) k.bd.style.transform = `scale(${bo(P(t, k.d + .45, k.d + .7)).toFixed(3)})`;
    }
    S(s.wash, { o: eo(P(t, .2, .6)) });
    for (const [e, a] of [[s.l1, .3], [s.l2, .44]]) {
      const fx = tt => L(W - s.lx + 300, 0, eo(P(tt, a, a + .42)));
      S(e, { x: fx(t), o: C((t - a) * 6), bx: Math.min(60, vel(fx, t) * .35) });
    }
  } });

/* ===== pain: the problem as a number, then desaturate + dip to black ===== */
shot('pain', { hero: 1.6, len: 3.0, tin: 'zoom', bg: '#000',
  sfx: [[0.1, 'ticks10'], [0.45, 'pops4'], [1.2, 'stamp'], [2.1, 'down']],
  build(c, s) {
    const pn = B.pain;
    s.inner = D(c, 'abs', { inset: 0, background: '#fff' });
    D(s.inner, 'blob', { width: 900, height: 600, left: CX - 460, top: CY - 290 });
    const pos = lv([[260, 200], [1480, 180], [230, 780], [1520, 800], [840, 880], [1100, 130]], [[90, 330], [600, 250], [70, 1420], [560, 1520], [330, 1700], [640, 520]]);
    s.bub = pn.complaints.slice(0, 6).map((q, i) => D(s.inner, 'abs row', { left: pos[i][0], top: pos[i][1], gap: '10px' }, `${av(person(i), 58, i)}<span class="pill" style="font-size:19px;padding:9px 15px">${q}</span>`));
    s.big = D(s.inner, 'ctr head', { left: CX, top: lv(500, CY - 60), fontSize: lv(250, 230) + 'px', textAlign: 'center', lineHeight: lv(1.02, .95) }, `<span class="num">0</span>${V ? '\n' : ' '}<span style="font-weight:500">${pn.unit}</span>`);
    s.num = s.big.querySelector('.num');
    s.pill = D(s.inner, 'ctr badge', { left: lv(1230, CX + 170), top: lv(655, CY + 210), fontSize: '40px', padding: '12px 30px', boxShadow: '0 20px 40px -10px rgba(255,77,79,.6)' }, pn.pill);
    s.dim = D(c, 'abs', { inset: 0, background: 'radial-gradient(ellipse at 50% 50%,rgba(6,12,34,.55),rgba(2,4,12,1))', opacity: 0 });
  },
  update(t, s, c) {
    S(c, { s: L(1, 1.06, t / 3) });
    s.num.textContent = Math.round(B.pain.value * eo(P(t, .1, 1.15))).toLocaleString('en-US');
    S(s.big, { o: C(t * 8), b: (1 - eo(P(t, 0, .3))) * 20 });
    const q = P(t, 1.2, 1.45);
    S(s.pill, { s: L(2.4, 1, bo(q)), r: L(-22, -6, eo(q)), o: C(q * 4) });
    s.bub.forEach((e, i) => { const d = .45 + i * .17, k = P(t, d, d + .35); S(e, { s: L(.4, 1, bo(k)), o: C(k * 4), x: Math.sin(t * 1.3 + i) * 10, y: Math.cos(t * 1.1 + i * 2) * 8 }); });
    const g = P(t, 2.0, 3.0);
    s.inner.style.filter = `grayscale(${eio(C(g * 1.6)).toFixed(2)})`;
    s.dim.style.opacity = eio(g).toFixed(3);
  } });

/* ===== turn: dark starfield, a light flare draws a ring that becomes the app icon, white flash out ===== */
shot('turn', { hero: 2.1, len: 2.5, bg: '#000',
  sfx: [[0.0, 'boom'], [0.45, 'shimmer'], [0.5, 'riser']],
  build(c, s) {
    s.sky = D(c, 'abs', { inset: 0, background: 'radial-gradient(ellipse at 50% 50%,var(--night1) 0%,var(--night2) 55%,#020611 100%)' });
    s.stars = []; for (let i = 0; i < 170; i++) { const z = (i % 5) / 3 + 1; s.stars.push({ e: D(c, 'abs', { left: (i * 137.5) % W, top: (i * 91.7 * lv(1, 1.9)) % H, width: z, height: z, borderRadius: '50%', background: '#fff' }), k: i }); }
    s.halo = D(c, 'ctr', { left: CX, top: CY, width: 700, height: 700, borderRadius: '50%', background: 'radial-gradient(circle,rgba(var(--acc2RGB),.45) 0%,rgba(var(--accRGB),0) 65%)' });
    c.insertAdjacentHTML('beforeend', `<svg class="abs" style="left:0;top:0" width="${W}" height="${H}"><defs>
      <filter id="rglow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="12" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
      <circle class="ring" cx="${CX}" cy="${CY}" r="120" fill="none" style="stroke:var(--acc4)" stroke-width="24" stroke-linecap="round" filter="url(#rglow)"/></svg>`);
    s.ring = c.querySelector('.ring');
    s.icon = D(c, 'ctr', { left: CX, top: CY }, iconHTML(230));
    s.fl = D(c, 'abs', { left: 0, top: 0, width: 0, height: 0 });
    s.fh = D(s.fl, 'ctr', { left: 0, top: 0, width: 900, height: 3, background: 'linear-gradient(90deg,transparent,rgba(220,232,255,.95),transparent)' });
    s.fv = D(s.fl, 'ctr', { left: 0, top: 0, width: 3, height: 240, background: 'linear-gradient(0deg,transparent,rgba(220,232,255,.95),transparent)' });
    s.fc = D(s.fl, 'ctr', { left: 0, top: 0, width: 80, height: 80, borderRadius: '50%', background: 'radial-gradient(circle,#fff 0%,rgba(var(--acc2RGB),.85) 25%,rgba(var(--accRGB),0) 70%)' });
  },
  update(t, s, c) {
    s.sky.style.opacity = eo(P(t, 0, .5)).toFixed(3);
    S(c, { s: L(1.06, 1, eo(P(t, 0, 2.6))) });
    for (const st of s.stars) st.e.style.opacity = (P(t, .1, .7) * (.25 + .45 * (.5 + .5 * Math.sin(t * (1.5 + hash(st.k) * 3) + st.k)))).toFixed(3);
    const R = 120, CIRC = 2 * Math.PI * R, dp = eio(P(t, .55, 1.6)), rot = -200 + 150 * eo(P(t, .55, 2.0));
    s.ring.setAttribute('stroke-dasharray', `${(CIRC * dp).toFixed(1)} 2000`);
    s.ring.setAttribute('transform', `rotate(${rot.toFixed(2)} ${CX} ${CY})`);
    const m = P(t, 1.55, 2.0);
    s.ring.style.opacity = (dp > 0 ? 1 - eo(m) : 0).toFixed(3);
    s.ring.setAttribute('r', (R * L(1, 1.3, eo(m))).toFixed(1));
    const ang = (rot + dp * 360) * Math.PI / 180, corner = eio(P(t, 1.6, 2.0));
    const hx = L(CX + R * Math.cos(ang), CX + 95, corner), hy = L(CY + R * Math.sin(ang), CY - 95, corner);
    const pre = eo(P(t, .3, .55)), pulse = .85 + .15 * Math.sin(t * 9);
    s.fl.style.transform = `translate(${hx.toFixed(1)}px,${hy.toFixed(1)}px)`;
    s.fl.style.opacity = (pre * (1 - .35 * P(t, 2.1, 2.5))).toFixed(3);
    S(s.fh, { s: L(.2, 1, pre) * pulse }); S(s.fv, { s: L(.2, 1, pre) * pulse }); S(s.fc, { s: pulse });
    const ip = P(t, 1.6, 2.05);
    S(s.icon, { s: L(.45, 1, bo(ip)), o: C(ip * 3), b: (1 - eo(ip)) * 10 });
    S(s.halo, { o: eo(P(t, .5, 1.8)) * .9, s: L(.6, 1.1, eo(P(t, .5, 2.4))) });
    flash(Math.pow(P(t, 2.15, 2.5), 2));
  } });

/* ===== brand: icon lands, slides left, wordmark types on, channel pills rise ===== */
shot('brand', { hero: 1.9, len: 2.5, bg: '#fff', tout: 'up',
  sfx: [[0.0, 'hit'], [0.7, 'type6'], [1.4, 'pops3'], [2.3, 'whoosh']],
  build(c, s) {
    D(c, 'blob', { width: 1100, height: 520, left: CX - 550, top: lv(-330, CY - 700), opacity: .9 });
    const fs = 170, wmW = B.product.length * fs * .52, total = 150 + 34 + wmW;
    s.ix = V ? CX : CX - total / 2 + 75;                 // vertical: icon stacked above a centred wordmark
    s.icon = D(c, 'ctr', { left: s.ix, top: lv(500, CY - 190) }, iconHTML(150));
    s.wm = V ? typed(c, 'ctr head', { left: CX, top: CY + 10, fontSize: fs + 'px', fontWeight: 700, letterSpacing: '-.06em' }, [{ t: B.product }])
      : typed(c, 'abs head', { left: s.ix + 75 + 34, top: 500, fontSize: fs + 'px', fontWeight: 700, letterSpacing: '-.06em', transform: 'translateY(-50%)' }, [{ t: B.product }]);
    s.wm.cur.style.background = 'var(--ink)';
    s.pills = D(c, 'ctr row', { left: CX, top: lv(668, CY + 190), gap: '16px' }, B.channels.map(x => `<span class="pill" style="font-size:18px">${glyphHTML(x[0], x[1])}${x[2]}</span>`).join(''));
    s.pl = [...s.pills.children];
    if (V) s.pills.style.scale = '1.45';
  },
  update(t, s, c) {
    flash(1 - eo(P(t, 0, .4)));
    S(c, { s: L(1, 1.05, t / 2.5) });
    const sl = eio(P(t, .5, .9));
    S(s.icon, { x: L(CX - s.ix, 0, sl), y: V ? L(190, 0, sl) : 0, s: L(1.5, 1, eo(P(t, 0, .45))) });
    s.wm.el.style.opacity = sl > .2 ? 1 : 0;
    typeP(s.wm, P(t, .65, 1.25), t);
    s.pl.forEach((e, i) => { const k = P(t, 1.35 + i * .12, 1.7 + i * .12); S(e, { y: (1 - eo(k)) * 40, o: k * 2, b: (1 - eo(k)) * 8 }); });
  } });

/* ===== laptop: benefit headline types on, 3D laptop swings in with the UI, a hand clicks the action ===== */
shot('laptop', { hero: 3.4, len: 5.0, tin: 'up',
  sfx: [[0.1, 'type14'], [0.45, 'whoosh'], [1.0, 'pops5'], [2.0, 'whoosh_s'], [3.0, 'click']],
  build(c, s) {
    const ib = B.inbox;
    s.rays = D(c, 'rays', { height: H, opacity: .55 });
    s.h1 = typed(c, 'abs head', { left: lv(110, 90), top: lv(330, 330), fontSize: '104px' }, [{ t: ib.l1 }], false);
    s.h2 = typed(c, 'abs head acc', { left: lv(110, 90), top: lv(436, 436), fontSize: '104px' }, [{ t: ib.l2 }]);
    s.lap = D(c, 'abs', { left: lv(880, 60), top: lv(120, 760), width: 960, height: 860, perspective: '2200px' });
    s.scr = D(s.lap, 'abs', { left: 40, top: 40, width: 880, height: 560, transformOrigin: '50% 100%' });
    const bez = D(s.scr, 'abs', { inset: 0, borderRadius: '28px', background: '#1a1c22', padding: '18px', boxShadow: '0 60px 120px -30px rgba(20,40,110,.55)' });
    const app = D(bez, '', { width: '100%', height: '100%', borderRadius: '12px', background: '#fff', overflow: 'hidden', display: 'flex', position: 'relative' });
    s.base = D(s.lap, 'abs', { left: -20, top: 600, width: 1000, height: 46, transformOrigin: '50% 0', borderRadius: '0 0 30px 30px', background: 'linear-gradient(180deg,#d9dde6,#aeb4c2)', boxShadow: '0 40px 60px -20px rgba(20,40,110,.4)' });
    s.rows = [];
    if (ib.screenshot) {
      app.innerHTML = `<img src="${ib.screenshot}" style="width:100%;height:100%;object-fit:cover;object-position:top left">`;
      s.res = D(app, 'abs', { left: (ib.click[0] * 100) + '%', top: (ib.click[1] * 100) + '%', width: 34, height: 34, margin: '-17px 0 0 -17px', borderRadius: '50%', boxShadow: '0 0 0 4px var(--acc), 0 0 0 14px rgba(var(--accRGB),.25)' });
    } else {
      D(app, '', { width: 170, background: '#F6F8FC', padding: '18px 14px' }, ib.nav.map((x, i) => `<div style="font-size:14px;font-weight:600;padding:9px 10px;border-radius:8px;${i == 0 ? 'background:var(--tint);color:var(--acc)' : 'color:#6B7180'}">${x}</div>`).join(''));
      const main = D(app, '', { flex: 1, padding: '20px 22px' }, `<div style="font-size:20px;font-weight:700;margin-bottom:12px">${ib.title} <span class="badge" style="font-size:12px;padding:2px 8px;background:var(--acc)">${ib.badge}</span></div>`);
      s.rows = ib.items.slice(0, 5).map((it, i) => { const cl = ib.tags[it[1]] || ['var(--tint)', 'var(--acc)'];
        return D(main, 'row', { padding: '11px 12px', marginBottom: '8px', borderRadius: '12px', background: '#fff', boxShadow: 'inset 0 0 0 1px #EDF0F6' },
          `${av(person(i), 34, i)}<div style="flex:1;font-size:15px;font-weight:600">${it[0]}</div><span class="tag" style="background:${cl[0]};color:${cl[1]}">${it[1]}</span>`); });
      s.res = document.createElement('span'); s.res.className = 'tag'; s.res.style.cssText = 'background:var(--acc);color:#fff;display:inline-block'; s.res.textContent = ib.action;
      s.rows[0].appendChild(s.res);
    }
    s.hand = D(c, 'abs', { left: 0, top: 0, width: 110, height: 130, filter: 'drop-shadow(0 18px 18px rgba(20,40,110,.45))' },
      `<svg width="110" height="130" viewBox="0 0 22 26"><defs><linearGradient id="hg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" style="stop-color:var(--acc2)"/><stop offset="1" style="stop-color:var(--acc3)"/></linearGradient></defs><path d="M7 1.5c1 0 1.8.8 1.8 1.8v7.2l.6-.1c.9-.1 1.7.4 2 1.2.6-.3 1.4-.3 2 .1.5-.3 1.3-.3 1.9.1.9.6 1.5 1.6 1.5 2.7V19c0 3.3-2.7 6-6 6H9.6c-1.7 0-3.3-.8-4.3-2.1L1.6 18c-.6-.8-.5-1.9.3-2.5.8-.6 1.9-.5 2.5.3l.8 1V3.3C5.2 2.3 6 1.5 7 1.5z" fill="url(#hg)" stroke="#fff" stroke-width="1"/></svg>`);
    s.hand.style.transformOrigin = '35px 8px';
    s.rip = D(c, 'ctr', { left: 0, top: 0, width: 80, height: 80, borderRadius: '50%', border: '4px solid rgba(var(--accRGB),.7)' });
  },
  measure(s, sc) { // locate the click target with the laptop in its final pose; s.focus feeds the next shot's circle reveal
    sc.update(4.0, s, sc.cam, sc, true);
    const r = s.res.getBoundingClientRect(), sr = stage.getBoundingClientRect();
    s.tx = r.left - sr.left + r.width * .45; s.ty = r.top - sr.top + r.height * .55;
    s.focus = { x: CX + (s.tx - CX) * 1.07, y: CY + (s.ty - CY) * 1.07 };
  },
  update(t, s, c, sc, noCam) {
    S(c, { s: noCam ? 1 : L(1, 1.07, eio(C(t / sc.vd))) });
    S(s.rays, { o: .55 * eo(P(t, 0, .6)) });
    typeP(s.h1, P(t, .15, .6), t, false); typeP(s.h2, P(t, .6, 1.0), t);
    const lp = P(t, .35, 1.25), lx = tt => L(760, 0, eo(P(tt, .35, 1.25)));
    s.lap.style.transform = `translateX(${lx(t).toFixed(1)}px) translateY(${(Math.sin(t * 1.2) * 6).toFixed(1)}px)`;
    s.lap.style.opacity = C(lp * 4).toFixed(3);
    s.lap.style.filter = vel(lx, t) > 3 ? `blur(${Math.min(14, vel(lx, t) * .12).toFixed(1)}px)` : 'none';
    const ry = L(-60, lv(-24, -16), eo(lp)) + Math.sin(t * .8) * 1.5;
    s.scr.style.transform = `rotateY(${ry.toFixed(2)}deg) rotateX(8deg) rotateZ(2deg)`;
    s.base.style.transform = `rotateY(${ry.toFixed(2)}deg) rotateX(62deg)`;
    s.rows.forEach((e, i) => { const k = P(t, 1.0 + i * .1, 1.35 + i * .1); e.style.opacity = k.toFixed(3); e.style.transform = `translateY(${((1 - eo(k)) * 18).toFixed(1)}px)`; });
    const clicked = t >= 3.02, rp = P(t, 3.02, 3.25);
    if (s.rows.length) {
      s.rows[0].style.background = clicked ? 'var(--tint)' : '#fff';
      s.rows[0].style.boxShadow = clicked ? 'inset 0 0 0 2px var(--acc)' : 'inset 0 0 0 1px #EDF0F6';
    }
    s.res.style.transform = `scale(${(clicked || noCam ? L(.6, 1, bo(noCam ? 1 : rp)) : .001).toFixed(3)})`; s.res.style.opacity = clicked || noCam ? 1 : 0;
    if (noCam || s.tx == null) return;
    const hp = eio(P(t, 1.9, 2.9)), tipX = s.tx - 35, tipY = s.ty - 8;
    const press = t > 2.9 && t < 3.2 ? 1 - .12 * Math.sin(P(t, 2.9, 3.2) * Math.PI) : 1;
    S(s.hand, { x: L(tipX + 420, tipX, hp) - Math.sin(hp * Math.PI) * 60, y: L(tipY + 520, tipY, hp), s: press, o: P(t, 1.85, 2.05), r: L(18, 0, hp) });
    const ri = P(t, 3.0, 3.55);
    s.rip.style.left = s.tx + 'px'; s.rip.style.top = s.ty + 'px';
    S(s.rip, { s: L(.2, 1.8, eo(ri)), o: ri > 0 ? 1 - ri : 0 });
  } });

/* ===== circle: accent circle grows from the previous shot's focus point; items fly into sorted columns ===== */
shot('circle', { hero: 3.0, len: 4.0, under: 0.75, tout: 'zoom', bg: 'transparent',
  sfx: [[0.0, 'hit_s'], [0.02, 'whoosh'], [1.25, 'pops9'], [3.7, 'whoosh']],
  build(c, s) {
    const so = B.sort;
    s.blue = D(c, 'abs', { inset: 0, background: 'radial-gradient(ellipse at 50% 30%,var(--acc2) 0%,var(--acc) 45%,var(--acc3) 100%)' });
    s.pat = D(s.blue, 'abs', { left: -300, top: -40, width: W + 700, color: 'rgba(255,255,255,.07)', fontWeight: 600, fontSize: '64px', letterSpacing: '-.03em', lineHeight: 1.15, whiteSpace: 'nowrap' });
    let p = ''; for (let i = 0; i < lv(10, 18); i++) p += Array(10).fill(so.pattern[i % so.pattern.length]).join(' · ') + '<br>';
    s.pat.innerHTML = p;
    s.h1 = D(s.blue, 'ctr head', { left: CX, top: lv(250, 420), fontSize: '104px', color: '#fff' }, so.l1);
    s.h2 = D(s.blue, 'ctr head', { left: CX, top: lv(360, 530), fontSize: '104px', color: 'var(--acc4)' }, so.l2);
    const xs = lv([560, 960, 1360], [CX - 336, CX, CX + 336]), cw = lv(340, 320), chw = lv(300, 290), ctop = lv(480, 690);
    s.cols = so.columns.slice(0, 3).map((n, i) => {
      const e = D(s.blue, 'abs', { left: xs[i] - cw / 2, top: ctop, width: cw, height: lv(500, 640), borderRadius: '26px', background: 'rgba(255,255,255,.12)', boxShadow: 'inset 0 0 0 1.5px rgba(255,255,255,.35)', padding: '20px' },
        `<div class="row" style="justify-content:space-between;color:#fff;font-weight:600;font-size:24px">${n}<span class="cnt num" style="background:rgba(255,255,255,.22);border-radius:999px;padding:2px 12px;font-size:18px">0</span></div>`);
      return { e, cnt: e.querySelector('.cnt') };
    });
    const slot = [0, 0, 0];
    s.chips = so.chips.slice(0, 9).map(([txt, ci], i) => {
      const k = slot[ci]++, a = hash(i + 3) * Math.PI * 2;
      const e = D(s.blue, 'abs row', { left: xs[ci] - chw / 2, top: ctop + 80 + k * 96, width: chw, height: 80, borderRadius: '18px', background: '#fff', padding: '0 16px', gap: '12px', boxShadow: '0 18px 36px -14px rgba(0,20,80,.5)' },
        `${av(person(i), 40, i)}<div style="font-size:17px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${txt}</div>`);
      return { e, ci, d: 1.15 + i * .14, fx: Math.cos(a) * 1100, fy: Math.sin(a) * 700 - 200, r0: (hash(i) - .5) * 50 };
    });
    s.ring = D(c, 'ctr', { left: 0, top: 0, width: 100, height: 100, borderRadius: '50%', boxShadow: '0 0 0 14px rgba(var(--accRGB),.18), 0 0 0 36px rgba(var(--accRGB),.08)' });
  },
  update(t, s, c, sc) {
    const pv = scenes[sc.i - 1], f = (pv && pv.st.focus) || { x: CX, y: CY };
    const R = 2300 * eio(P(t, 0, .7));
    s.blue.style.clipPath = `circle(${R.toFixed(1)}px at ${f.x.toFixed(1)}px ${f.y.toFixed(1)}px)`;
    s.ring.style.left = f.x + 'px'; s.ring.style.top = f.y + 'px';
    S(s.ring, { s: R / 50, o: R > 1 && t < .7 ? 1 - P(t, .4, .7) : 0 });
    S(c, { s: L(1, 1.04, t / 4) });
    s.pat.style.transform = `translateX(${(-t * 40).toFixed(1)}px)`;
    blurIn(s.h1, t, .35, .8, { y: 30 }); blurIn(s.h2, t, .5, .95, { y: 30 });
    s.cols.forEach((k, i) => { const q = P(t, .8 + i * .1, 1.2 + i * .1); S(k.e, { y: (1 - eo(q)) * 120, o: q * 2 }); });
    const cnt = [0, 0, 0];
    for (const k of s.chips) {
      const q = P(t, k.d, k.d + .5);
      const fx = tt => L(k.fx, 0, eio(P(tt, k.d, k.d + .5))), fy = tt => L(k.fy, 0, eio(P(tt, k.d, k.d + .5)));
      S(k.e, { x: fx(t), y: fy(t), r: L(k.r0, 0, eo(q)), s: L(.7, 1, eio(q)), o: C(q * 5), bx: Math.min(40, vel(fx, t) * .2), by: Math.min(40, vel(fy, t) * .2) });
      if (q >= 1) cnt[k.ci]++;
    }
    s.cols.forEach((k, i) => k.cnt.textContent = cnt[i]);
  } });

/* ===== fanout: a message types and sends; lines draw out to each channel, which ticks ===== */
shot('fanout', { hero: 3.3, len: 4.0, tin: 'zoom', tout: 'whip',
  sfx: [[0.15, 'type10'], [0.9, 'type26'], [2.15, 'click'], [2.3, 'swoop'], [2.6, 'pops3'], [3.8, 'whoosh']],
  build(c, s) {
    const rp = B.reply;
    D(c, 'blob', { width: 900, height: 600, left: -250, top: H - 480 }); D(c, 'blob', { width: 800, height: 600, left: W - 570, top: -250, opacity: .7 });
    const cardY = lv(520, 1000);
    s.h1 = typed(c, 'ctr head', { left: CX, top: lv(175, 640), fontSize: lv(96, 92) + 'px' }, [{ t: rp.l1 }], false);
    s.h2 = typed(c, 'ctr head acc', { left: CX, top: lv(275, 740), fontSize: lv(96, 92) + 'px' }, [{ t: rp.l2 }]);
    s.card = D(c, 'ctr card row', { left: CX, top: cardY, width: lv(1000, 960), height: 140, padding: '0 34px', gap: '22px', borderRadius: '32px' });
    s.card.innerHTML = av(rp.avatar, 70, 4) + '<div class="ttxt" style="flex:1;font-size:30px;font-weight:500"></div>';
    s.msg = typed(s.card.querySelector('.ttxt'), '', {}, [{ t: rp.message }]);
    s.send = D(s.card, '', { width: 76, height: 76, borderRadius: '50%', background: 'var(--acc)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '34px', fontWeight: 700, boxShadow: '0 14px 30px -8px rgba(var(--accRGB),.6)', flex: 'none' }, '↑');
    const ch = B.channels.slice(0, 3), gap = lv(440, 330), xs = ch.map((_, i) => CX + (i - (ch.length - 1) / 2) * gap), ys = ch.map((_, i) => lv(880, 1380) + ((i === 1 && ch.length === 3) ? 20 : 0));
    c.insertAdjacentHTML('beforeend', `<svg class="abs" style="left:0;top:0;overflow:visible" width="${W}" height="${H}">${ch.map((n, i) => `<path class="lk" d="M${CX} ${cardY + 72} C ${CX} ${cardY + 200}, ${xs[i]} ${cardY + 180}, ${xs[i]} ${ys[i] - 52}" fill="none" style="stroke:var(--acc)" stroke-width="4" stroke-linecap="round" pathLength="1" stroke-dasharray="0 1"/>`).join('')}</svg>`);
    s.links = [...c.querySelectorAll('.lk')];
    s.nodes = ch.map((n, i) => {
      const e = D(c, 'ctr card row', { left: xs[i], top: ys[i], padding: '16px 26px 16px 16px', borderRadius: '22px', gap: '14px' }, `<div class="glyph" style="background:${n[1]}">${n[0]}</div><div style="font-size:26px;font-weight:600">${n[2]}</div>`);
      const ck = D(e, 'abs', { right: -14, top: -14, width: 40, height: 40, borderRadius: '50%', background: '#19B36B', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', fontWeight: 800, border: '3px solid #fff' }, '✓');
      return { e, ck };
    });
  },
  update(t, s, c) {
    S(c, { s: L(1, 1.04, t / 4) });
    typeP(s.h1, P(t, .1, .5), t, false); typeP(s.h2, P(t, .5, 1.0), t, t < 1.6);
    const cp = P(t, .3, .75); S(s.card, { y: (1 - eo(cp)) * 80, o: cp * 2, s: L(.94, 1, eo(cp)) });
    typeP(s.msg, P(t, .9, 2.0), t, t <= 2.3);
    S(s.send, { s: 1 - .16 * Math.sin(P(t, 2.15, 2.35) * Math.PI), o: 1 });
    s.links.forEach((l, i) => { const k = eio(P(t, 2.35 + i * .08, 2.8 + i * .08)); l.setAttribute('stroke-dasharray', `${k.toFixed(3)} 1`); l.style.opacity = k > 0 ? 1 : 0; });
    s.nodes.forEach((n, i) => {
      const a = P(t, .7 + i * .1, 1.05 + i * .1), hit = P(t, 2.75 + i * .1, 3.0 + i * .1);
      S(n.e, { y: (1 - eo(a)) * 60, o: a * .5 + hit * .5, s: 1 + .06 * Math.sin(hit * Math.PI) });
      S(n.ck, { s: bo(hit), o: hit > 0 ? 1 : 0 });
    });
  } });

/* ===== dashboard: dashboard rises on an accent dome, numbers count up, side cards fan out ===== */
shot('dashboard', { hero: 2.6, len: 4.0, tin: 'whip', tout: 'up',
  sfx: [[0.4, 'whoosh_s'], [0.7, 'ticks12'], [1.0, 'pops3'], [1.9, 'pop'], [3.82, 'whoosh']],
  build(c, s) {
    const pr = B.proof;
    s.dome = D(c, 'abs', { left: CX - 1260, top: lv(640, 1260), width: 2520, height: 1400, borderRadius: '50%', background: 'radial-gradient(ellipse at 50% 0%,var(--acc2) 0%,var(--acc) 30%,var(--acc3) 70%)', boxShadow: '0 -40px 120px rgba(var(--accRGB),.45)' });
    s.h = D(c, 'ctr head', { left: CX, top: lv(118, 330), fontSize: lv(84, 96) + 'px', textAlign: 'center' }, `${V ? pr.pre.trim() + '\n' : pr.pre}<span class="acc">${pr.accent}</span>`);
    s.mainP = { x: CX, y: lv(495, 860) }; s.p1 = { x: lv(350, CX - 230), y: lv(420, 1330) }; s.p2 = { x: lv(1570, CX + 230), y: lv(370, 1380) };
    s.side1 = D(c, 'ctr card', { left: s.p1.x, top: s.p1.y, width: 300, padding: '24px' }, `<div style="color:var(--mut);font-size:16px;font-weight:600">${pr.left.label}</div><div class="num v" style="font-size:60px;font-weight:700;letter-spacing:-.04em">0</div><div class="row" style="gap:0">${[0, 1, 2, 3].map(i => `<div style="margin-left:${i ? -12 : 0}px">${av(i === 3 ? '+9' : person(i), 40, i)}</div>`).join('')}</div>`);
    s.side2 = D(c, 'ctr card', { left: s.p2.x, top: s.p2.y, width: 300, padding: '24px' }, `<div style="color:var(--mut);font-size:16px;font-weight:600">${pr.right.label}</div><div style="font-size:60px;font-weight:700;letter-spacing:-.04em"><span class="num v">0.0</span> <span style="font-size:30px;color:#FFB020">★★★★★</span></div>`);
    s.main = D(c, 'ctr card', { left: s.mainP.x, top: s.mainP.y, width: lv(800, 900), height: 470, padding: '34px' },
      `<div class="row" style="justify-content:space-between"><b style="font-size:22px">${pr.panel}</b><span class="tag" style="background:var(--tint);color:var(--acc)">${pr.period}</span></div>
       <div class="row" style="margin-top:26px;gap:60px"><div><div style="color:var(--mut);font-size:17px;font-weight:600">${pr.m1.label}</div><div class="num r" style="font-size:72px;font-weight:700;letter-spacing:-.04em">0</div></div>
       <div><div style="color:var(--mut);font-size:17px;font-weight:600">${pr.m2.label}</div><div style="font-size:72px;font-weight:700;letter-spacing:-.04em"><span class="num m">0</span><span style="font-size:36px;color:var(--mut)">${pr.m2.unit}</span></div></div></div>
       <div class="row bars" style="align-items:flex-end;gap:22px;height:170px;margin-top:22px"></div>`);
    const n = pr.bars.length;
    s.bars = pr.bars.map((h, i) => D(s.main.querySelector('.bars'), '', { flex: 1, height: h, borderRadius: '10px 10px 4px 4px', background: i >= n - 2 ? 'linear-gradient(180deg,var(--acc2),var(--acc))' : 'var(--tint)', transformOrigin: '50% 100%' }));
    s.r = s.main.querySelector('.r'); s.m = s.main.querySelector('.m'); s.v1 = s.side1.querySelector('.v'); s.v2 = s.side2.querySelector('.v');
    s.quote = D(c, 'ctr pill', { left: lv(1450, CX), top: lv(735, 1560) }, `${av(person(1), 36, 1)}${pr.quote}`);
  },
  update(t, s, c) {
    const pr = B.proof;
    S(c, { s: L(1, 1.05, t / 4) });
    S(s.dome, { y: (1 - eo(P(t, 0, .8))) * 500 });
    blurIn(s.h, t, .1, .55, { y: -20 });
    const mp = P(t, .25, .85); S(s.main, { y: (1 - eo(mp)) * 260 + Math.sin(t * 1.4) * 5, s: L(.85, 1, eo(mp)), o: mp * 2, b: (1 - eo(mp)) * 10 });
    const k = eo(P(t, .7, 2.0));
    s.r.textContent = Math.round(pr.m1.to * k).toLocaleString('en-US');
    s.m.textContent = Math.round(L(pr.m2.from, pr.m2.to, k));
    s.bars.forEach((b, i) => b.style.transform = `scaleY(${bo(P(t, .8 + i * .07, 1.2 + i * .07)).toFixed(3)})`);
    const f1 = bo(P(t, 1.0, 1.45)), f2 = bo(P(t, 1.1, 1.55));
    S(s.side1, { x: L(s.mainP.x - s.p1.x, 0, f1), y: L(s.mainP.y - s.p1.y, 0, f1) + Math.sin(t * 1.7) * 6, r: L(0, -4, f1), o: P(t, 1.0, 1.15) });
    S(s.side2, { x: L(s.mainP.x - s.p2.x, 0, f2), y: L(s.mainP.y - s.p2.y, 0, f2) + Math.cos(t * 1.5) * 6, r: L(0, 4, f2), o: P(t, 1.1, 1.25) });
    s.v1.textContent = Math.round(pr.left.to * eo(P(t, 1.2, 2.2))) + (pr.left.suffix || '');
    s.v2.textContent = (pr.right.to * eo(P(t, 1.3, 2.3))).toFixed(1);
    const q = P(t, 1.9, 2.2); S(s.quote, { s: bo(q), o: q * 3 });
  } });

/* ===== social: "Trusted by N+" count-up, logo marquee, rating ticks up ===== */
shot('social', { hero: 2.0, len: 3.0, tin: 'up', tout: 'fade',
  sfx: [[0.2, 'ticks10'], [1.0, 'pop'], [1.9, 'riser'], [2.8, 'whoosh']],
  build(c, s) {
    const so = B.social;
    D(c, 'blob', { width: 1200, height: 500, left: CX - 600, top: lv(-260, 300), opacity: .8 });
    s.h1 = D(c, 'ctr head', { left: CX, top: lv(330, 700), fontSize: '104px' }, so.l1);
    s.h2 = D(c, 'ctr head acc', { left: CX, top: lv(440, 810), fontSize: '104px' }, `<span class="num n">${so.from}</span>${so.suffix}`);
    s.n = s.h2.querySelector('.n');
    const wrap = D(c, 'abs', { left: 0, top: lv(600, 960), width: W, height: 120, WebkitMaskImage: lv('linear-gradient(90deg,transparent 10%,#000 30%,#000 70%,transparent 90%)', 'linear-gradient(90deg,transparent 0%,#000 18%,#000 82%,transparent 100%)') });
    s.strip = D(wrap, 'abs row', { left: 0, top: 30, gap: '90px' });
    const sty = ['font-weight:800;letter-spacing:-.03em', 'font-weight:500;font-style:italic', 'font-weight:700;letter-spacing:.12em;font-size:30px', 'font-weight:600', 'font-weight:800', 'font-weight:400;letter-spacing:-.02em', 'font-weight:800;letter-spacing:.2em;font-size:28px', 'font-weight:700;font-style:italic'];
    const one = so.logos.map((l, i) => /\.(png|jpe?g|webp|svg)$/i.test(l) ? `<img src="${l}" style="height:44px;opacity:.55;filter:grayscale(1)">` : `<span style="font-size:40px;color:#9AA0AE;white-space:nowrap;${sty[i % sty.length]}">${l}</span>`).join('');
    s.strip.innerHTML = one + one + one;
    s.line = D(c, 'abs', { left: lv(560, 190), top: lv(590, 950), width: 4, height: 140, borderRadius: '2px', background: 'var(--acc)', boxShadow: '0 0 20px rgba(var(--accRGB),.7)' });
    s.rate = D(c, 'ctr card row', { left: CX, top: lv(860, 1200), padding: '16px 28px', borderRadius: '20px', gap: '14px' }, `<span style="font-size:44px;font-weight:700;letter-spacing:-.03em" class="num rv">${so.rating.from}</span><span style="color:#FFB020;font-size:28px">★★★★★</span><span style="color:var(--mut);font-size:18px;font-weight:600">${so.rating.note}</span>`);
    s.rv = s.rate.querySelector('.rv');
  },
  update(t, s, c) {
    const so = B.social;
    S(c, { s: L(1, 1.04, t / 3) });
    blurIn(s.h1, t, .05, .45, { y: 20 }); blurIn(s.h2, t, .18, .6, { y: 20 });
    s.n.textContent = Math.round(L(so.from, so.to, eo(P(t, .2, 1.4)))).toLocaleString('en-US');
    s.strip.style.transform = `translateX(${(-200 - t * 160).toFixed(1)}px)`;
    s.strip.style.opacity = P(t, .3, .7).toFixed(3);
    S(s.line, { o: P(t, .4, .6) });
    const rp = P(t, .9, 1.3); S(s.rate, { y: (1 - eo(rp)) * 60, o: rp * 2 });
    s.rv.textContent = L(so.rating.from, so.rating.to, eo(P(t, 1.0, 1.9))).toFixed(1);
  } });

/* ===== reel: slot-machine number rolls to the answer ("02 minutes to set up") ===== */
shot('reel', { hero: 1.9, len: 2.5, tin: 'fade', tout: 'fade',
  sfx: [[0.1, 'reel'], [0.9, 'type10']],
  build(c, s) {
    const su = B.setup, step = su.to < su.from ? -1 : 1, list = [];
    for (let n = su.from; step < 0 ? n >= su.to : n <= su.to; n += step) list.push(n);
    s.count = list.length - 1;
    D(c, 'blob', { width: 900, height: 600, left: lv(1200, CX - 300), top: lv(600, CY + 300), opacity: .8 });
    D(c, 'ctr', { left: lv(1230, CX + 420), top: CY, width: 1400, height: 1400, borderRadius: '50%', border: '2px solid #E3E8F3' });
    s.dot = D(c, 'ctr', { left: lv(560, 120), top: CY, width: 14, height: 14, borderRadius: '50%', background: 'var(--acc)', boxShadow: '0 0 0 10px rgba(var(--accRGB),.15)' });
    s.items = list.map(n => D(c, 'ctr head num', { left: lv(760, CX - 190), top: CY, fontSize: '240px', fontWeight: 700 }, String(n).padStart(2, '0')));
    s.t1 = typed(c, 'abs head', { left: lv(960, CX - 20), top: CY - 95, fontSize: lv(84, 76) + 'px' }, [{ t: su.l1 }], false);
    s.t2 = typed(c, 'abs head acc', { left: lv(960, CX - 20), top: CY - 5, fontSize: lv(84, 76) + 'px' }, [{ t: su.l2 }]);
  },
  update(t, s, c) {
    S(c, { s: L(1, 1.04, t / 2.5) });
    const pos = tt => s.count * eo(P(tt, .1, 1.3)), p = pos(t), v = vel(pos, t);
    s.items.forEach((e, i) => {
      const d = i - p, ad = Math.abs(d);
      S(e, { x: -ad * ad * 26, y: d * 190, s: 1 - Math.min(ad, 2.5) * .28, o: C(1 - ad * .62) * P(t, 0, .2), by: Math.min(30, v * 10) });
      e.style.color = ad < .5 ? 'var(--ink)' : '#B9BFCC';
    });
    typeP(s.t1, P(t, .9, 1.25), t, false); typeP(s.t2, P(t, 1.25, 1.7), t);
    S(s.dot, { s: bo(P(t, 1.2, 1.5)), o: P(t, 1.2, 1.3) });
  } });

/* ===== cta: icon pops, wordmark types, tagline + buttons + URL, light-equalizer glow ===== */
shot('cta', { hero: 2.6, len: 4.0, bg: '#fff', tin: 'zoom',
  sfx: [[0.0, 'hit'], [0.4, 'type6'], [1.0, 'whoosh_s'], [1.4, 'pops2']],
  build(c, s) {
    const ct = B.cta;
    s.eq = D(c, 'abs', { left: 0, top: lv(540, H - 760), width: W, height: lv(600, 760), filter: 'blur(22px)', WebkitMaskImage: 'radial-gradient(ellipse 52% 100% at 50% 100%,#000 30%,transparent 75%)' });
    s.nb = Math.ceil(W / 48); s.bars = []; for (let i = 0; i < s.nb; i++) s.bars.push(D(s.eq, 'abs', { left: 20 + i * 48, bottom: 0, width: 28, height: 300, background: 'linear-gradient(0deg,var(--acc),rgba(var(--acc2RGB),.4))', transformOrigin: '50% 100%' }));
    const fs = 140, wmW = B.product.length * fs * .52, total = 120 + 30 + wmW, ix = CX - total / 2 + 60, rowY = lv(380, CY - 300);
    s.icon = D(c, 'ctr', { left: ix, top: rowY }, iconHTML(120));
    s.wm = typed(c, 'abs head', { left: ix + 60 + 30, top: rowY, fontSize: fs + 'px', fontWeight: 700, letterSpacing: '-.06em', transform: 'translateY(-50%)' }, [{ t: B.product }]);
    s.wm.cur.style.background = 'var(--ink)';
    s.tag = D(c, 'ctr head', { left: CX, top: lv(522, CY - 100), fontSize: lv(56, 66) + 'px', fontWeight: 500, textAlign: 'center' }, `${V ? ct.tagline[0].trim() + '\n' : ct.tagline[0]}<span class="acc">${ct.tagline[1] || ''}</span>`);
    s.btns = D(c, 'ctr row', { left: CX, top: lv(642, CY + 90), gap: '20px' }, `<span class="pill" style="background:var(--acc);color:#fff;padding:18px 34px;font-size:24px;font-weight:600">${ct.primary}</span>` + (ct.secondary ? `<span class="pill" style="padding:18px 34px;font-size:24px">${ct.secondary}</span>` : ''));
    s.bl = [...s.btns.children];
    if (V) s.btns.style.scale = '1.3';
    s.url = D(c, 'ctr', { left: CX, top: lv(735, CY + 190), color: 'var(--mut)', fontSize: '22px', fontWeight: 500 }, B.url);
  },
  update(t, s, c) {
    S(c, { s: L(1.04, 1, eo(P(t, 0, 3))) });
    const lvl = eo(P(t, 0, .8));
    s.bars.forEach((b, i) => { const d = Math.abs(i - (s.nb - 1) / 2) / (s.nb / 2), h = (1 - d * .8) * (.55 + .45 * Math.abs(Math.sin(t * 4.2 + i * .7) * Math.cos(t * 2.1 + i * .3))); b.style.transform = `scaleY(${(h * lvl).toFixed(3)})`; });
    const ip = P(t, .1, .5); S(s.icon, { s: L(.3, 1, bo(ip)), o: ip * 3, r: L(-30, 0, eo(ip)) });
    typeP(s.wm, P(t, .4, .9), t, t < 1.4);
    blurIn(s.tag, t, 1.0, 1.4, { y: 24 });
    s.bl.forEach((e, i) => { const a = 1.35 + i * .15, k = P(t, a, a + .35); S(e, { y: (1 - eo(k)) * 40, o: k * 2, s: L(.9, 1, bo(k)) }); });
    blurIn(s.url, t, 1.85, 2.2, { y: 12, blur: 10 });
  } });

/* ===== colorize: a grey wall of faces; a toggle flips on and faces light up with channel badges ===== */
shot('colorize', { hero: 2.6, len: 3.2, tin: 'up', tout: 'whip',
  sfx: [[0.05, 'pops6'], [0.3, 'type12'], [1.2, 'click'], [1.45, 'pops8'], [1.9, 'pops6'], [2.25, 'pop'], [2.95, 'whoosh']],
  build(c, s) {
    const cz = B.colorize, ch = B.channels;
    s.grid = D(c, 'abs', { left: 0, top: 0, width: W, height: H + 200 });
    s.faces = [];
    const RW = Math.ceil(H / 132) + 2, CW = Math.ceil(W / 138) + 1;
    for (let r = 0; r < RW; r++) for (let k = 0; k < CW; k++) {
      const x = -30 + k * 138 + (r % 2) * 69, y = -40 + r * 132, i = r * CW + k;
      const w = D(s.grid, 'abs', { left: x, top: y, width: 100, height: 100 }, av(person(i), 100, i));
      const dx = x + 50 - CX, dy = y + 50 - CY, d = Math.hypot(dx, dy * lv(1.6, .8));
      const centre = Math.abs(dx) < lv(560, 470) && Math.abs(dy) < lv(230, 300);               // keep the middle clear for the copy
      const lit = !centre && hash(i * 3.7) < .32;
      let bd = null;
      if (lit) { const g = ch[i % ch.length]; bd = D(w, 'abs', { right: -4, bottom: -4 }, glyphHTML(g[0], g[1], 34)); }
      s.faces.push({ w, bd, lit, d0: .02 + d * .00045, d1: 1.35 + d * .0009 + hash(i) * .35 });
    }
    s.wash = D(c, 'ctr', { left: CX, top: lv(560, CY), width: lv(1500, 1120), height: lv(720, 900), borderRadius: '50%', background: 'radial-gradient(ellipse at 50% 50%,rgba(255,255,255,.97) 35%,rgba(255,255,255,0) 70%)' });
    s.h1 = typed(c, 'ctr head', { left: CX, top: lv(410, CY - 180), fontSize: '96px' }, [{ t: cz.l1 }], false);
    s.h2 = typed(c, 'ctr head acc', { left: CX, top: lv(505, CY - 85), fontSize: '96px' }, [{ t: cz.l2 }]);
    s.tog = D(c, 'ctr card row', { left: CX, top: lv(650, CY + 70), padding: '14px 18px 14px 22px', borderRadius: '999px', gap: '16px' },
      `${iconHTML(40)}<span style="font-size:24px;font-weight:600;white-space:nowrap">${cz.toggle}</span><span class="sw" style="position:relative;width:74px;height:42px;border-radius:999px;background:#D9DEE8;display:block"><span class="kn" style="position:absolute;left:4px;top:4px;width:34px;height:34px;border-radius:50%;background:#fff;box-shadow:0 3px 8px rgba(0,0,0,.25);display:block"></span></span>`);
    s.sw = s.tog.querySelector('.sw'); s.kn = s.tog.querySelector('.kn');
    s.pill = D(c, 'ctr pill', { left: CX, top: lv(745, CY + 170), fontSize: '20px', fontWeight: 600, color: 'var(--acc)' }, `<span style="width:10px;height:10px;border-radius:50%;background:#19B36B;display:inline-block"></span>${cz.pill}`);
  },
  update(t, s, c) {
    S(c, { s: L(1.08, 1, eo(P(t, 0, 3.2))) });
    s.grid.style.transform = `translateY(${(-t * 14).toFixed(1)}px)`;
    for (const f of s.faces) {
      const a = P(t, f.d0, f.d0 + .35), on = f.lit ? P(t, f.d1, f.d1 + .3) : 0;
      f.w.style.opacity = (C(a * 3) * (.5 + .5 * on)).toFixed(3);
      f.w.style.filter = `grayscale(${(1 - on).toFixed(2)})`;
      f.w.style.transform = `scale(${(L(.6, 1, bo(a)) * (1 + .18 * Math.sin(on * Math.PI))).toFixed(3)})`;
      if (f.bd) f.bd.style.transform = `scale(${bo(P(t, f.d1 + .12, f.d1 + .4)).toFixed(3)})`;
    }
    S(s.wash, { o: eo(P(t, .1, .5)) });
    typeP(s.h1, P(t, .3, .7), t, false); typeP(s.h2, P(t, .7, 1.05), t, t < 1.3);
    const tp = P(t, .55, .9); S(s.tog, { y: (1 - eo(tp)) * 50, o: tp * 2, s: L(.9, 1, bo(tp)) });
    const k = eio(P(t, 1.15, 1.4));
    s.kn.style.transform = `translateX(${(k * 32).toFixed(1)}px)`;
    s.sw.style.background = k > .5 ? 'var(--acc)' : '#D9DEE8';
    const q = P(t, 2.2, 2.5); S(s.pill, { y: (1 - eo(q)) * 30, o: q * 2, s: L(.8, 1, bo(q)) });
  } });

/* ===== morph: an accent card with a headline morphs into a folder, then into a UI panel; a hand approves ===== */
shot('morph', { hero: 3.4, len: 4.0, tin: 'zoom', tout: 'up',
  sfx: [[0.0, 'pop'], [0.9, 'whoosh_s'], [1.3, 'swoop'], [1.6, 'pops6'], [2.0, 'whoosh_s'], [2.95, 'click'], [3.02, 'pop'], [3.78, 'whoosh']],
  build(c, s) {
    const m = B.morph;
    D(c, 'blob', { width: 1100, height: 700, left: CX - 550, top: CY - 340 });
    s.tab = D(c, 'abs', { borderRadius: '22px 22px 0 0' });
    s.card = D(c, 'abs', { overflow: 'hidden', boxShadow: '0 40px 90px -20px rgba(var(--accRGB),.45)' });
    s.white = D(s.card, 'abs', { inset: 0, background: '#fff' });
    s.fill = D(s.card, 'abs', { inset: 0, background: 'linear-gradient(150deg,var(--acc2),var(--acc) 55%,var(--acc3))' });
    s.h = D(s.card, 'ctr head', { left: '50%', top: '50%', fontSize: '92px', color: '#fff', textAlign: 'center' }, `${m.l1}\n<span style="color:var(--acc4)">${m.l2}</span>`);
    s.hdr = D(s.card, 'abs row', { left: 0, top: 0, right: 0, height: 76, padding: '0 30px', background: 'var(--acc)', color: '#fff', fontSize: '24px', fontWeight: 600, justifyContent: 'space-between' },
      `<span class="row" style="gap:12px">${iconHTML(36)}${m.title}</span><span class="row" style="gap:8px">${['All', 'Mine', 'Done'].map((x, i) => `<span style="font-size:15px;padding:6px 12px;border-radius:999px;background:rgba(255,255,255,${i ? .18 : .95});color:${i ? '#fff' : 'var(--acc)'}">${x}</span>`).join('')}</span>`);
    s.tiles = []; for (let i = 0; i < 6; i++) s.tiles.push(D(s.card, 'abs', { left: lv(34, 50) + (i % 3) * lv(228, 292), top: 110 + Math.floor(i / 3) * 250, width: 206, height: 228, borderRadius: '16px', background: '#fff', boxShadow: 'inset 0 0 0 1.5px #E6EAF2', padding: '12px', width: lv(206, 270) + 'px' },
      `<div style="height:120px;border-radius:10px;background:linear-gradient(135deg,var(--tint),rgba(var(--acc2RGB),${.15 + (i % 3) * .12}))"></div><div class="ln" style="width:70%;margin-top:14px"></div><div class="ln" style="width:45%;margin-top:10px"></div><div class="row" style="margin-top:12px;gap:0">${av(person(i), 28, i)}${av(person(i + 2), 28, i + 2)}</div>`));
    s.panel = D(s.card, 'abs', { top: 100, width: 340, borderRadius: '20px', background: '#F7F9FD', boxShadow: 'inset 0 0 0 1.5px #E6EAF2', padding: '24px' },
      `<div style="font-size:26px;font-weight:700;letter-spacing:-.02em">${m.panelTitle}</div>` + m.meta.map(r => `<div class="row" style="justify-content:space-between;margin-top:16px;font-size:18px"><span style="color:var(--mut);font-weight:500">${r[0]}</span><b>${r[1]}</b></div>`).join('') +
      `<div class="btn" style="margin-top:34px;height:60px;border-radius:16px;background:var(--ink);color:#fff;font-size:22px;font-weight:600;display:flex;align-items:center;justify-content:center"></div>`);
    s.btn = s.panel.querySelector('.btn'); s.btn.textContent = m.button;
    s.hand = mkHand(c);
    s.rip = D(c, 'ctr', { left: 0, top: 0, width: 80, height: 80, borderRadius: '50%', border: '4px solid rgba(var(--accRGB),.7)' });
  },
  layout(t, s) { // returns the card box for time t (the morph keyframes)
    const a = eio(P(t, .9, 1.3)), b = eio(P(t, 1.3, 1.75));
    const w = L(L(560, lv(1000, 860), a), lv(1100, 960), b), h = L(L(560, lv(600, 700), a), lv(640, 1180), b);
    return { w, h, x: CX - w / 2, y: lv(585, CY + 40) - h / 2, r: L(L(90, 34, a), 30, b), a, b };
  },
  measure(s, sc) { sc.update(3.6, s, sc.cam, sc, true); const p = centerOf(s.btn); s.tx = p.x; s.ty = p.y; },
  update(t, s, c, sc, noCam) {
    S(c, { s: noCam ? 1 : L(1, 1.05, t / 4) });
    const k = sc.layout(t, s), pop = bo(P(t, 0, .35));
    Object.assign(s.card.style, { left: k.x + 'px', top: k.y + 'px', width: k.w + 'px', height: k.h + 'px', borderRadius: k.r + 'px', transform: `scale(${L(.6, 1, pop).toFixed(3)})`, opacity: C(t * 6).toFixed(3) });
    s.fill.style.opacity = (1 - k.b).toFixed(3);
    s.fill.style.filter = `brightness(${L(1, 1.12, k.a).toFixed(3)})`;
    blurIn(s.h, t, .1, .5, { y: 20 });
    if (t > .85) S(s.h, { o: 1 - P(t, .85, 1.1), b: P(t, .85, 1.1) * 16, s: L(1, .9, P(t, .85, 1.1)) });
    // folder tab grows from the card's top-left, then widens into the header bar
    const ta = P(t, .95, 1.2);
    const tw = L(300, k.w, k.b), th = L(64, 0, k.b);
    Object.assign(s.tab.style, { left: (k.x + L(46, 0, k.b)) + 'px', top: (k.y - th + 2) + 'px', width: tw + 'px', height: th + 'px', background: 'var(--acc2)', opacity: (ta * (1 - k.b)).toFixed(3) });
    s.hdr.style.opacity = P(t, 1.45, 1.75).toFixed(3);
    s.h.style.display = t > 1.2 ? 'none' : 'block';
    s.tiles.forEach((e, i) => { const q = P(t, 1.6 + i * .06, 1.9 + i * .06); S(e, { y: (1 - eo(q)) * 40, o: q * 2, s: L(.9, 1, eo(q)) }); });
    const pp = eo(P(t, 2.0, 2.4));
    if (V) Object.assign(s.panel.style, { left: '34px', width: (k.w - 68) + 'px', top: (620 + (1 - pp) * 600) + 'px', height: (k.h - 650) + 'px' });
    else { s.panel.style.left = (k.w - 24 - 340 + (1 - pp) * 420) + 'px'; s.panel.style.height = (k.h - 124) + 'px'; }
    s.panel.style.opacity = C(pp * 3).toFixed(3);
    const done = t >= 2.98 || noCam;
    s.btn.textContent = done && !noCam ? B.morph.done : B.morph.button;
    s.btn.style.background = done && !noCam ? '#19B36B' : 'var(--ink)';
    s.btn.style.transform = `scale(${(done && !noCam ? L(.9, 1, bo(P(t, 2.98, 3.2))) : 1).toFixed(3)})`;
    if (noCam || s.tx == null) return;
    moveHand(s.hand, t, s.tx, s.ty, 2.3, 2.95);
    const ri = P(t, 2.95, 3.5); s.rip.style.left = s.tx + 'px'; s.rip.style.top = s.ty + 'px'; S(s.rip, { s: L(.2, 1.8, eo(ri)), o: ri > 0 ? 1 - ri : 0 });
  } });

/* ===== rackfocus: laptop whips in, a request types and sends, camera pushes onto the button as the screen falls out of focus ===== */
shot('rackfocus', { hero: 2.7, len: 3.0, tout: 'fade',
  sfx: [[0.0, 'whoosh'], [0.5, 'type16'], [1.0, 'whoosh_s'], [1.55, 'click'], [1.6, 'pop'], [1.7, 'swoop'], [2.78, 'whoosh']],
  build(c, s) {
    const rk = B.rack, ib = B.inbox;
    s.rays = D(c, 'rays', { height: H, opacity: .5 });
    if (V && rk.l1) { s.h1 = typed(c, 'ctr head', { left: CX, top: 380, fontSize: '100px' }, [{ t: rk.l1 }], false); s.h2 = typed(c, 'ctr head acc', { left: CX, top: 485, fontSize: '100px' }, [{ t: rk.l2 || '' }]); }
    s.lap = D(c, 'abs', { left: CX - 600, top: lv(130, 760), width: 1200, height: 860, perspective: '2400px' });
    s.scr = D(s.lap, 'abs', { left: 50, top: 0, width: 1100, height: 690, transformOrigin: '50% 100%' });
    const bez = D(s.scr, 'abs', { inset: 0, borderRadius: '32px', background: '#1a1c22', padding: '20px', boxShadow: '0 70px 130px -30px rgba(20,40,110,.55)' });
    const app = D(bez, '', { width: '100%', height: '100%', borderRadius: '14px', background: '#fff', overflow: 'hidden', position: 'relative' });
    s.base = D(s.lap, 'abs', { left: -10, top: 690, width: 1220, height: 50, transformOrigin: '50% 0', borderRadius: '0 0 34px 34px', background: 'linear-gradient(180deg,#d9dde6,#aeb4c2)' });
    s.soft = D(app, 'abs', { inset: 0 });                         // everything that goes out of focus
    if (rk.screenshot) s.soft.innerHTML = `<img src="${rk.screenshot}" style="width:100%;height:100%;object-fit:cover;object-position:top left">`;
    else {
      D(s.soft, 'abs', { left: 0, top: 0, bottom: 0, width: 190, background: '#F6F8FC', padding: '22px 14px' }, ib.nav.map((x, i) => `<div style="font-size:15px;font-weight:600;padding:10px 12px;border-radius:8px;${i == 1 ? 'background:var(--tint);color:var(--acc)' : 'color:#6B7180'}">${x}</div>`).join(''));
      D(s.soft, 'abs', { left: 220, top: 130, right: 30 }, ib.items.slice(0, 5).map((it, i) => `<div class="row" style="padding:13px 14px;margin-bottom:9px;border-radius:12px;box-shadow:inset 0 0 0 1px #EDF0F6">${av(person(i), 36, i)}<div style="flex:1;font-size:17px;font-weight:600">${it[0]}</div><div class="ln" style="width:90px"></div></div>`).join(''));
    }
    s.bar = D(s.soft, 'abs row', { left: 220, top: 34, right: 230, height: 70, borderRadius: '16px', background: '#fff', boxShadow: '0 10px 30px -10px rgba(30,50,110,.3), inset 0 0 0 1.5px #E3E8F3', padding: '0 20px', fontSize: '22px', fontWeight: 500 });
    s.req = typed(s.bar, '', {}, [{ t: rk.request }]);
    s.btn = D(app, 'abs', { right: 30, top: 34, width: 186, height: 70, borderRadius: '16px', background: 'var(--acc)', color: '#fff', fontSize: '21px', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 14px 30px -10px rgba(var(--accRGB),.7)' });
    s.btn.textContent = rk.button;
    s.fg = D(c, 'ctr pill', { left: lv(600, CX), top: lv(930, 1640), fontSize: '40px', padding: '24px 40px' }, `${av(person(2), 70, 2)}${rk.request}`); // out-of-focus foreground element
    s.hand = mkHand(c);
  },
  measure(s, sc) { sc.update(1.5, s, sc.cam, sc, true); const p = centerOf(s.btn); s.bx = p.x; s.by = p.y; s.focus = { x: s.bx + (CX - s.bx) * .6, y: s.by + (CY - s.by) * .6 }; },
  update(t, s, c, sc, noCam) {
    const push = noCam ? 0 : eio(P(t, 1.65, 2.6));
    if (!noCam && s.bx != null) { c.style.transformOrigin = `${s.bx}px ${s.by}px`; S(c, { s: L(1, 2.0, push), x: (CX - s.bx) * .6 * push, y: (CY - s.by) * .6 * push }); }
    else S(c, {});
    S(s.rays, { o: .5 * eo(P(t, 0, .4)) });
    const lx = tt => L(W * .7, 0, eo(P(tt, 0, .55)));
    const ry = L(-50, -10, eo(P(t, 0, .7))) + Math.sin(t * 1.1);
    S(s.lap, { x: lx(t), bx: Math.min(80, vel(lx, t) * .4), o: C(t * 8), s: lv(1, .86) });
    if (s.h1) { typeP(s.h1, P(t, .35, .7), t, false); typeP(s.h2, P(t, .7, 1.05), t, t < 1.4); s.h1.el.style.opacity = s.h2.el.style.opacity = (1 - P(t, 1.6, 1.85)).toFixed(3); }
    s.scr.style.transform = `rotateY(${ry.toFixed(2)}deg) rotateX(7deg)`;
    s.base.style.transform = `rotateY(${ry.toFixed(2)}deg) rotateX(64deg)`;
    typeP(s.req, P(t, .5, 1.35), t, t < 1.55);
    const sent = t >= 1.57 && !noCam;
    s.btn.textContent = sent ? B.rack.done : B.rack.button;
    s.btn.style.background = sent ? '#19B36B' : 'var(--acc)';
    s.btn.style.transform = `scale(${(t > 1.5 && t < 1.75 ? 1 - .1 * Math.sin(P(t, 1.5, 1.75) * Math.PI) : 1).toFixed(3)})`;
    s.btn.style.boxShadow = sent ? `0 0 0 ${(push * 14).toFixed(1)}px rgba(25,179,107,.18), 0 14px 30px -10px rgba(25,179,107,.6)` : '0 14px 30px -10px rgba(var(--accRGB),.7)';
    s.soft.style.filter = push > .01 ? `blur(${(push * 7).toFixed(2)}px)` : 'none';                  // depth of field: background falls away
    s.base.style.filter = push > .01 ? `blur(${(push * 10).toFixed(2)}px)` : 'none';
    const fp = P(t, 1.7, 3.0); S(s.fg, { x: L(-200, 900, fp), o: fp > 0 ? Math.min(1, fp * 4) * .9 : 0, b: 26, s: 1.6 });    // foreground blur sells the depth
    if (noCam || s.bx == null) return;
    moveHand(s.hand, t, s.bx - 20, s.by + 10, .95, 1.5);
    if (t > 1.9) s.hand.style.opacity = (1 - P(t, 1.9, 2.2)).toFixed(3);
  } });

/* ===== dive: a laptop rises, the camera flies into its screen until the screen IS the frame (no cut), then the headline lands ===== */
shot('dive', { hero: 2.9, len: 3.2, tin: 'fade', tout: 'whip',
  sfx: [[0.0, 'whoosh_s'], [0.55, 'shimmer'], [0.95, 'whoosh'], [1.85, 'hit_s'], [2.0, 'whoosh_s'], [2.98, 'whoosh']],
  build(c, s) {
    const dv = B.dive, SW = lv(880, 440), SH = SW * H / W, sc0 = SW / W, BZ = lv(22, 18);   // 16:9 laptop, or 9:16 phone
    s.k = W / SW; s.r0 = lv(12, 46);
    D(c, 'blob', { width: 1100, height: 600, left: CX - 550, top: CY + 60 });
    s.lap = D(c, 'abs', { left: CX - SW / 2 - BZ, top: CY - SH / 2 - BZ, width: SW + 2 * BZ, height: SH + 120 });
    s.bez = D(s.lap, 'abs', { left: 0, top: 0, width: SW + 2 * BZ, height: SH + 2 * BZ, borderRadius: lv(30, 64) + 'px', background: '#1a1c22', boxShadow: '0 60px 120px -30px rgba(20,40,110,.55)' });
    if (!V) s.base = D(s.lap, 'abs', { left: -60, top: SH + 44, width: SW + 164, height: 30, borderRadius: '0 0 26px 26px', background: 'linear-gradient(180deg,#d9dde6,#aeb4c2)' });
    s.scrn = D(c, 'abs', { left: CX - SW / 2, top: CY - SH / 2, width: SW, height: SH, overflow: 'hidden', borderRadius: s.r0 + 'px' });
    s.world = D(s.scrn, 'abs', { left: 0, top: 0, width: W, height: H, transformOrigin: '0 0', transform: `scale(${sc0})` });   // authored at full-frame size
    if (V) s.island = D(c, 'ctr', { left: CX, top: CY - SH / 2 + 26, width: 120, height: 34, borderRadius: '999px', background: '#0b0c10' });
    s.bg = D(s.world, 'abs', { inset: 0, background: dv.screenshot ? `url('${dv.screenshot}') top left/cover` : 'radial-gradient(ellipse at 30% 20%,var(--acc2) 0%,var(--acc) 45%,var(--acc3) 100%)' });
    s.tintL = D(s.world, 'abs', { inset: 0, background: 'linear-gradient(180deg,rgba(var(--accRGB),.55),rgba(var(--accRGB),.8))', opacity: 0 });
    const pos = lv([[330, 260], [1600, 300], [420, 820], [1520, 830]], [[270, 380], [800, 470], [290, 1450], [790, 1560]]);
    s.cards = B.channels.concat(B.channels).slice(0, 4).map((g, i) => D(s.world, 'ctr card row', { left: pos[i][0], top: pos[i][1], padding: '20px 30px 20px 20px', borderRadius: '26px', gap: '16px' }, `<div class="glyph" style="width:74px;height:74px;font-size:34px;background:${g[1]}">${g[0]}</div><div style="font-size:32px;font-weight:600">${g[2]}</div>`));
    s.glass = D(s.world, 'ctr', { left: CX, top: CY, width: lv(1180, 960), height: lv(380, 520), borderRadius: '44px', background: 'rgba(255,255,255,.14)', backdropFilter: 'blur(22px)', boxShadow: 'inset 0 0 0 2px rgba(255,255,255,.4), 0 40px 80px -30px rgba(0,0,40,.4)' });
    s.h1 = D(s.world, 'ctr head', { left: CX, top: CY - lv(52, 58), fontSize: lv(112, 96) + 'px', color: '#fff' }, dv.l1);
    s.h2 = D(s.world, 'ctr head', { left: CX, top: CY + lv(60, 50), fontSize: lv(112, 96) + 'px', color: 'var(--acc4)' }, dv.l2);
    const gx = [CX - lv(400, 480), CX + lv(400, 480)], gy = [CY - lv(360, 260), CY + lv(360, 260)];
    const line = (dir, a, b) => `linear-gradient(${dir},transparent ${a - 1}px,rgba(255,255,255,.28) ${a - 1}px ${a + 1}px,transparent ${a + 1}px ${b - 1}px,rgba(255,255,255,.28) ${b - 1}px ${b + 1}px,transparent ${b + 1}px)`;
    s.grid = D(s.world, 'abs', { inset: 0, background: `${line('90deg', gx[0], gx[1])},${line('180deg', gy[0], gy[1])}`, opacity: 0 });
  },
  update(t, s, c) {
    const rise = eo(P(t, 0, .6)), dive = eio(P(t, .95, 1.9));
    S(c, { s: L(1, s.k, dive) * L(.9, 1, rise), y: (1 - rise) * 160 });
    s.lap.style.opacity = C(rise * 2).toFixed(3); s.scrn.style.opacity = C(rise * 2).toFixed(3);
    s.lap.style.filter = dive > .01 ? `blur(${(dive * 8).toFixed(1)}px)` : 'none';
    s.scrn.style.borderRadius = L(s.r0, 0, P(t, 1.6, 1.9)) + 'px';
    if (s.island) s.island.style.opacity = (C(rise * 2) * (1 - P(t, 1.3, 1.6))).toFixed(3);
    s.cards.forEach((e, i) => { const a = P(t, .4 + i * .1, .75 + i * .1), out = eio(P(t, 1.9, 2.5)), dx = (i % 2 ? 1 : -1) * 260 * out, dy = (i < 2 ? -1 : 1) * 120 * out;
      S(e, { x: dx * lv(1, .5), y: dy * lv(1, 2.5) + Math.sin(t * 1.6 + i) * 10 + (1 - eo(a)) * 60, o: C(a * 2), s: L(.8, 1, bo(a)), r: (i % 2 ? 3 : -3) * out }); });
    const settle = P(t, 1.9, 2.4);
    if (B.dive.screenshot) { s.bg.style.filter = `blur(${(eo(settle) * 14).toFixed(1)}px)`; s.tintL.style.opacity = (eo(settle) * .9).toFixed(3); }
    S(s.glass, { o: eo(settle), s: L(.92, 1, eo(settle)) });
    s.grid.style.opacity = (eo(settle) * .8).toFixed(3);
    blurIn(s.h1, t, 2.0, 2.4, { y: 26 }); blurIn(s.h2, t, 2.15, 2.55, { y: 26 });
  } });
````

## `template/render.cjs`

````js
// Renders index.html frame-exact in headless Chromium.
//   node render.cjs                → out/cues.json, out/frames/*.png, out/video_silent.mp4
//   node render.cjs --still 1,5.5  → out/still_1.00.png ...
//   node render.cjs --board        → out/board.png (one annotated still per shot, for approval)
//   node render.cjs --cues         → out/cues.json only (needed by audio.py)
//   add --format 9:16 to any of these for the vertical (1080x1920) version
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const { execFileSync } = require('child_process');

const args = process.argv.slice(2);
const get = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
const WORKERS = +get('--workers', 4);
const outDir = path.join(__dirname, 'out'), framesDir = path.join(outDir, 'frames');
const FORMAT = get('--format', '');
const url = 'file://' + path.join(__dirname, 'index.html') + '?render=1' + (FORMAT ? '&fmt=' + encodeURIComponent(FORMAT) : '');

async function openPage(browser, W, H) {
  const page = await browser.newPage({ viewport: { width: W || 1920, height: H || 1080 }, deviceScaleFactor: 1 });
  page.on('pageerror', e => console.error('PAGE ERROR', e.message));
  page.on('console', m => { if (m.type() === 'error') console.error('CONSOLE', m.text()); });
  await page.goto(url);
  await page.waitForFunction('window.READY === true', null, { timeout: 30000 });
  return page;
}
const shoot = (page, file) => page.locator('#stage').screenshot({ path: file });

(async () => {
  fs.mkdirSync(framesDir, { recursive: true });
  const browser = await chromium.launch();
  const page0 = await openPage(browser);
  const cues = await page0.evaluate(() => window.exportCues());
  await page0.setViewportSize({ width: cues.W, height: cues.H });
  fs.writeFileSync(path.join(outDir, 'cues.json'), JSON.stringify(cues, null, 1));
  const { FPS, DUR } = cues, TOTAL = Math.round(FPS * DUR), TAG = cues.FMT === '9:16' ? '_9x16' : '';
  console.log(`timeline: ${cues.scenes.length} shots, ${DUR.toFixed(2)} s, ${TOTAL} frames, ${cues.W}x${cues.H}`);
  if (args.includes('--cues')) { await browser.close(); return; }

  const stills = get('--still', null);
  if (stills) {
    for (const t of stills.split(',').map(Number)) {
      await page0.evaluate(t => window.renderAt(t), t);
      await shoot(page0, path.join(outDir, `still${TAG}_${t.toFixed(2)}.png`));
    }
    await browser.close(); return;
  }

  if (args.includes('--board')) { // the "hero" moment of each shot: late enough that its content has landed
    const cells = [];
    for (const [i, s] of cues.scenes.entries()) {
      const d = s.b - s.a, t = s.a + Math.min(s.hero != null ? s.hero / s.k : d * .7, d - .05);
      await page0.evaluate(t => window.renderAt(t), t);
      const buf = await page0.locator('#stage').screenshot({ type: 'jpeg', quality: 88 });
      cells.push({ i, id: s.id, a: s.a, d, img: 'data:image/jpeg;base64,' + buf.toString('base64') });
    }
    const bp = await browser.newPage({ viewport: { width: 2400, height: 1000 }, deviceScaleFactor: 1 });
    const font = 'file://' + path.join(__dirname, 'fonts', 'Inter-600.ttf');
    await bp.setContent(`<html><head><style>@font-face{font-family:I;src:url(${font})}body{margin:0;background:#F3F5FA;font-family:I,sans-serif;color:#0B0D12}
      #b{width:2400px;padding:50px 60px;box-sizing:border-box}h1{margin:0 0 30px;font-size:40px;letter-spacing:-.03em}
      .g{display:grid;grid-template-columns:repeat(${cues.W < cues.H ? 8 : 4},1fr);gap:34px 28px}img{width:100%;border-radius:14px;display:block;box-shadow:0 18px 40px -18px rgba(30,50,110,.4)}
      .m{display:flex;gap:10px;align-items:center;margin-top:12px;font-size:19px}.n{background:#0B0D12;color:#fff;border-radius:7px;padding:2px 9px}.t{color:#6B7180}</style></head>
      <body><div id="b"><h1>Storyboard · ${cues.scenes.length} shots · ${DUR.toFixed(1)} s · ${cues.W}×${cues.H}</h1><div class="g">${cells.map(c =>
        `<div><img src="${c.img}"><div class="m"><span class="n">${String(c.i + 1).padStart(2, '0')}</span><b>${c.id}</b><span class="t">${c.a.toFixed(1)} s · ${c.d.toFixed(1)} s</span></div></div>`).join('')}</div></div></body></html>`);
    await bp.evaluate(() => document.fonts.ready);
    await bp.locator('#b').screenshot({ path: path.join(outDir, `board${TAG}.png`) });
    console.log(`wrote out/board${TAG}.png`);
    await browser.close(); return;
  }

  for (const f of fs.readdirSync(framesDir)) fs.unlinkSync(path.join(framesDir, f));
  const pages = [page0, ...await Promise.all(Array.from({ length: WORKERS - 1 }, () => openPage(browser, cues.W, cues.H)))];
  let next = 0, done = 0; const t0 = Date.now();
  await Promise.all(pages.map(async page => {
    while (next < TOTAL) {
      const f = next++;
      await page.evaluate(t => window.renderAt(t), f / FPS);
      await shoot(page, path.join(framesDir, `f${String(f).padStart(4, '0')}.png`));
      if (++done % 150 === 0) console.log(`${done}/${TOTAL} frames · ${((Date.now() - t0) / 1000).toFixed(0)}s`);
    }
  }));
  await browser.close();
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', String(FPS), '-i', path.join(framesDir, 'f%04d.png'),
    '-c:v', 'libx264', '-preset', 'slow', '-crf', '16', '-pix_fmt', 'yuv420p', path.join(outDir, `video_silent${TAG}.mp4`)], { stdio: 'inherit' });
  console.log(`wrote out/video_silent${TAG}.mp4`);
})();
````

## `template/audio.py`

````python
"""Soundtrack for the launch film, synthesized with numpy only.

Reads out/cues.json (written by `node render.cjs` or `node render.cjs --cues`) and writes:
  out/music.wav  the synthesized bed: tense intro -> break at the 'turn' shot -> full groove from
                 the reveal -> outro from the 'cta' shot, sidechained to the kick
  out/sfx.wav    every shot's sound cues (whooshes on cuts, pops, typing, clicks, risers, hits)
  out/audio.wav  music + sfx (build.sh swaps in assets/music.* instead of the synth bed if present)

SFX kinds: whoosh whoosh_s pop popsN tick ticksN typeN click stamp down boom shimmer riser
           hit hit_s swoop swell reel(N)   (N = count; spacing scales with the shot's speed)
"""
import json, os, wave
import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
CU = json.load(open(os.path.join(HERE, 'out', 'cues.json')))
SR, DUR, BEAT = 44100, CU['DUR'], 60 / CU['BPM']
BAR = 4 * BEAT
M = CU['markers']
T_TURN = M['turn'] if M['turn'] is not None else None
T_DROP = M['drop'] or 0.0
T_CTA = M['cta']
N = int(DUR * SR) + SR
rng = np.random.default_rng(7)

def t_(d): return np.arange(max(1, int(d * SR))) / SR
def midi(n): return 440 * 2 ** ((n - 69) / 12)
def add(buf, x, at, g=1.0):
    i = int(at * SR)
    if i >= len(buf) or i < 0: return
    n = min(len(x), len(buf) - i); buf[i:i + n] += x[:n] * g
def filt(x, lo=None, hi=None):
    X = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1 / SR); m = np.ones_like(f)
    if lo: m *= 1 / (1 + (lo / np.maximum(f, 1)) ** 4)
    if hi: m *= 1 / (1 + (f / hi) ** 4)
    return np.fft.irfft(X * m, len(x))
def sweep_noise(d, f0, f1, chunks=24):
    n = int(d * SR); x = rng.standard_normal(n + 1024); out = np.zeros(n); edges = np.linspace(0, n, chunks + 1).astype(int)
    for k in range(chunks):
        a, b = edges[k], edges[k + 1]; fc = f0 * (f1 / f0) ** (k / max(1, chunks - 1))
        seg = filt(x[a:b + 1024], fc * .5, fc * 2); out[a:b] = seg[512:512 + b - a]
    return out
def osc(freq, d):
    n = int(d * SR); f = np.full(n, freq) if np.ndim(freq) == 0 else freq[:n]
    return np.sin(2 * np.pi * np.cumsum(f) / SR)

# ---------------- instruments ----------------
def kick(big=1.0):
    t = t_(.45); f = 45 + 95 * np.exp(-t / .035)
    return osc(f, .45) * np.exp(-t / (.22 * big)) + .3 * rng.standard_normal(len(t)) * np.exp(-t / .004)
def clap():
    t = t_(.3); n = filt(rng.standard_normal(len(t)), 900, 5000); env = np.zeros(len(t))
    for d in (0, .011, .022): env += np.exp(-np.maximum(t - d, 0) / .012) * (t >= d)
    return n * (env * .6 + np.exp(-t / .12) * .5)
def hat(open_=False):
    t = t_(.2); return filt(rng.standard_normal(len(t)), 7000) * np.exp(-t / (.07 if open_ else .022))
def pad_note(n, d):
    t = t_(d); x = np.zeros(len(t))
    for det in (-.0012, .0012, 0):
        for h in range(1, 9): x += np.sin(2 * np.pi * midi(n) * (1 + det) * h * t + h) / h ** 1.4
    return x * np.minimum(1, t / .35) * np.minimum(1, (d - t) / .5) / 6
def pluck(n):
    t = t_(.5); f = midi(n)
    return (np.sin(2 * np.pi * f * t) + .35 * np.sin(4 * np.pi * f * t) + .12 * np.sin(6 * np.pi * f * t)) * np.exp(-t / .16) * np.minimum(1, t / .003)
def bass_note(n, d):
    t = t_(d); f = midi(n); x = np.sin(2 * np.pi * f * t) + .25 * np.sin(4 * np.pi * f * t)
    return x * np.minimum(1, t / .01) * np.exp(-t / .5) * np.minimum(1, (d - t) / .03)

# ---------------- music ----------------
drums, bass, pads, plk = (np.zeros(N) for _ in range(4)); kicks = []
A_CH = [[57, 60, 64], [53, 57, 60]]                                    # Am  F   (problem: tense)
C_CH = [[53, 57, 60, 64], [55, 59, 62, 67], [57, 60, 64, 67], [48, 55, 60, 64]]  # Fmaj7 G Am7 C (solution: lift)
C_RT = [41, 43, 45, 36]
if T_TURN is not None:                                                  # A: intro until the turn
    for b in range(int(np.ceil(T_TURN / BAR))):
        add(pads, filt(sum(pad_note(n, BAR + .2) for n in A_CH[b % 2]), None, 900), b * BAR, .9)
        add(bass, bass_note(33 if b % 2 == 0 else 29, BAR - .1), b * BAR, .8)
    for k in range(int(T_TURN / BEAT) + 1):
        tt = k * BEAT
        if k % 2 == 0: add(drums, kick(.8), tt, .75); kicks.append(tt)
        add(drums, hat(), tt + BEAT / 2, .10); add(drums, hat(), tt, .05)
    add(pads, filt(sum(pad_note(n, T_DROP - T_TURN + .2) for n in [69, 72, 76]), 300, 3000), T_TURN - .05, .45)  # B: break
b = 0                                                                    # C: groove from the reveal to the CTA
while T_DROP + b * BAR < T_CTA - .05:
    t0 = T_DROP + b * BAR; ch = C_CH[b % 4]
    add(pads, filt(sum(pad_note(n, min(BAR, T_CTA - t0) + .15) for n in ch), None, 2600), t0, .8)
    for e in range(8):
        te = t0 + e * BEAT / 2
        if te >= T_CTA - .05: break
        add(bass, bass_note(C_RT[b % 4] + (12 if e % 4 == 3 else 0), BEAT / 2 * .9), te, .9)
        add(plk, pluck(ch[(e * 3) % len(ch)] + 12 + (12 if e in (3, 6) else 0)), te, .55)
    for q in range(4):
        tt = t0 + q * BEAT
        if tt >= T_CTA - .05: break
        add(drums, kick(), tt, 1.0); kicks.append(tt)
        if q % 2 == 1: add(drums, clap(), tt, .45)
        for s in range(4): add(drums, hat(open_=(s == 2)), tt + s * BEAT / 4, .16 if s == 2 else .07)
    b += 1
add(pads, filt(sum(pad_note(n, DUR - T_CTA + .5) for n in [48, 55, 60, 64, 71]), None, 2400), T_CTA, .9)  # D: outro
add(bass, bass_note(36, DUR - T_CTA + .3), T_CTA, .9)
for e, n in enumerate([76, 72, 79, 76, 84, 79]): add(plk, pluck(n), T_CTA + e * BEAT / 2, .45 * (1 - e / 8))
kicks.append(T_CTA)
tt = np.arange(N) / SR; duck = np.ones(N)
for k in kicks:
    i = int(k * SR); seg = tt[i:i + SR // 2] - k; duck[i:i + len(seg)] = np.minimum(duck[i:i + len(seg)], 1 - .55 * np.exp(-seg / .11))
music = drums * .55 + (bass * .32 + pads * .24 + plk * .13) * duck
tonal_wet = pads * .24 * duck + plk * .13

# ---------------- SFX ----------------
sfx = np.zeros(N)
def whoosh(d=.4):
    x = sweep_noise(d, 300, 3500); t = t_(d)[:len(x)]; return x * np.sin(np.pi * (t / d) ** .7) ** 2
def pop(f=650):
    t = t_(.12); return osc(f * (1 + .6 * (1 - np.exp(-t / .02))), .12) * np.exp(-t / .045) * np.minimum(1, t / .002)
def tick(): t = t_(.03); return filt(rng.standard_normal(len(t)), 2500, 9000) * np.exp(-t / .006)
def key(): t = t_(.04); return filt(rng.standard_normal(len(t)), 1800, 6500) * np.exp(-t / .008)
def click():
    t = t_(.08); return filt(rng.standard_normal(len(t)), 1500, 7000) * np.exp(-t / .007) + .6 * np.sin(2 * np.pi * 160 * t) * np.exp(-t / .03)
def boom():
    t = t_(2.0); return np.sin(2 * np.pi * (38 + 40 * np.exp(-t / .08)) * t) * np.exp(-t / .7) + .25 * filt(rng.standard_normal(len(t)), None, 400) * np.exp(-t / .5)
def riser(d):
    d = max(.3, d); x = sweep_noise(d, 250, 7000, 40); t = t_(d)[:len(x)]
    return (x * .8 + osc(200 * (6 ** (t / d)), d)[:len(x)] * .18) * (t / d) ** 2.2
def hit(big=1.0):
    t = t_(2.2); crash = filt(rng.standard_normal(len(t)), 3000) * np.exp(-t / (.9 * big))
    k = np.zeros(len(t)); kk = kick(1.6); k[:len(kk)] = kk
    return k * 1.2 + crash * .5 + np.sin(2 * np.pi * 45 * t) * np.exp(-t / .6) * .8
def shimmer():
    t = t_(1.8); x = sum(np.sin(2 * np.pi * f * t + p) * (.6 + .4 * np.sin(2 * np.pi * r * t)) for f, p, r in [(2093, 0, 5), (2637, 1, 7), (3136, 2, 6), (4186, 3, 9)])
    return x * np.sin(np.pi * t / 1.8) ** 2 / 4
def down():
    t = t_(1.0); return osc(700 * (0.11 ** t), 1.0) * np.sin(np.pi * t) * .5 + sweep_noise(1.0, 3000, 200)[:len(t)] * np.sin(np.pi * t) * .5
def stamp():
    t = t_(.3); return np.sin(2 * np.pi * (70 + 80 * np.exp(-t / .02)) * t) * np.exp(-t / .1) + filt(rng.standard_normal(len(t)), 800, 5000) * np.exp(-t / .03) * .6
def swoop():
    t = t_(.35); return osc(300 * 4 ** (t / .35), .35) * np.sin(np.pi * t / .35) * .6
def swell():
    t = t_(.7); return sweep_noise(.7, 600, 4000)[:len(t)] * (t / .7) ** 2 * np.exp(-np.maximum(t - .6, 0) / .03)

hits = sorted(a for a, kd, _ in CU['sfx'] if kd == 'hit') + [DUR]
for at, kind, k in CU['sfx']:
    base = ''.join(c for c in kind if not c.isdigit()); cnt = int(''.join(c for c in kind if c.isdigit()) or 8)
    if kind == 'whoosh': add(sfx, whoosh(.42), at, .55)
    elif kind == 'whoosh_s': add(sfx, whoosh(.3), at, .3)
    elif base == 'pops': [add(sfx, pop(520 + 260 * rng.random()), at + i * .075 / k, .22) for i in range(cnt)]
    elif kind == 'pop': add(sfx, pop(700), at, .3)
    elif kind == 'tick': add(sfx, tick(), at, .5)
    elif base == 'ticks': [add(sfx, tick(), at + i * (.06 + .012 * i) / k, .3) for i in range(cnt)]
    elif base == 'type': [add(sfx, key(), at + (i * .045 + rng.random() * .012) / k, .16) for i in range(cnt)]
    elif kind == 'click': add(sfx, click(), at, .55)
    elif kind == 'stamp': add(sfx, stamp(), at, .6)
    elif kind == 'down': add(sfx, down(), at, .35)
    elif kind == 'boom': add(sfx, boom(), at, .9)
    elif kind == 'shimmer': add(sfx, shimmer(), at, .35)
    elif kind == 'riser': add(sfx, riser(min(h for h in hits if h > at) - at), at, .45)   # always lands on the next hit
    elif kind == 'hit': add(sfx, hit(), at, .8)
    elif kind == 'hit_s': add(sfx, hit(.4), at, .35)
    elif kind == 'swoop': add(sfx, swoop(), at, .3)
    elif kind == 'swell': add(sfx, swell(), at, .3)
    elif base == 'reel':  # ticks where an eased reel (pos = n * expoOut) crosses each number
        for j in range(1, cnt + 1): add(sfx, tick(), at + 1.2 * (-np.log2(1 - j / (cnt + 1e-4)) / 10) / k, .45)
    else: print('unknown sfx kind:', kind)

# ---------------- reverb + master ----------------
def reverb(x, seed):
    r = np.random.default_rng(seed); it = t_(1.8); ir = filt(r.standard_normal(len(it)), 200, 6000) * np.exp(-it / .42)
    n = 1 << int(np.ceil(np.log2(len(x) + len(ir))))
    y = np.fft.irfft(np.fft.rfft(x, n) * np.fft.rfft(ir, n), n)[:len(x)]
    return y / (np.abs(y).max() + 1e-9) * (np.abs(x).max() + 1e-9)
def master(st):
    st = st[:int(DUR * SR)].copy(); fl = int(.8 * SR)
    st[-fl:] *= (np.linspace(1, 0, fl) ** 1.5)[:, None]
    return np.tanh(st / (np.abs(st).max() + 1e-9) * 1.6) / np.tanh(1.6) * .9
def write(name, st):
    with wave.open(os.path.join(HERE, 'out', name), 'wb') as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((st * 32767).astype('<i2').tobytes())
wl, wr = reverb(tonal_wet + sfx * .6, 1), reverb(tonal_wet + sfx * .6, 2)
write('audio.wav', master(np.stack([music + sfx + .22 * wl, music + sfx + .22 * wr], 1)))
write('music.wav', master(np.stack([music + .22 * reverb(tonal_wet, 1), music + .22 * reverb(tonal_wet, 2)], 1)))
write('sfx.wav', master(np.stack([sfx + .2 * reverb(sfx, 3), sfx + .2 * reverb(sfx, 4)], 1)) * .8)
print(f'wrote out/audio.wav, music.wav, sfx.wav ({DUR:.2f} s, {len(CU["sfx"])} cues)')
````

## `template/build.sh`

````bash
#!/usr/bin/env bash
# Full build: frames -> sound -> final MP4 -> QA contact sheet.
#   ./build.sh            render everything
#   ./build.sh --audio    redo sound + mux only (after a cues/timing change that kept the frames)
#   FORMAT=9:16 ./build.sh   vertical 1080x1920 version (-> out/<NAME>_9x16.mp4); FORMAT=both renders both
# Uses assets/music.(wav|mp3|m4a) as the music bed if present (SFX stay synthesized).
set -euo pipefail
cd "$(dirname "$0")"
if [[ "${FORMAT:-}" == "both" ]]; then FORMAT=16:9 "$0" "$@"; FORMAT=9:16 exec "$0" "$@"; fi
FORMAT="${FORMAT:-16:9}"
TAG=""; [[ "$FORMAT" == "9:16" ]] && TAG="_9x16"
NAME="${NAME:-launch}${TAG}"
if [[ "${1:-}" != "--audio" ]]; then node render.cjs --format "$FORMAT"; else node render.cjs --cues --format "$FORMAT"; fi
python3 audio.py
MUSIC=$(ls assets/music.* 2>/dev/null | head -1 || true)
DUR=$(python3 -c "import json;print(json.load(open('out/cues.json'))['DUR'])")
if [[ -n "$MUSIC" ]]; then
  echo "using music bed: $MUSIC"
  ffmpeg -y -loglevel error -i "$MUSIC" -i out/sfx.wav -filter_complex \
    "[0:a]atrim=0:${DUR},afade=t=out:st=$(python3 -c "print(max(0,${DUR}-1.2))"):d=1.2,volume=0.8[m];[m][1:a]amix=inputs=2:duration=longest:normalize=0[a]" \
    -map "[a]" -ar 44100 out/mix.wav
  AUDIO=out/mix.wav
else
  AUDIO=out/audio.wav
fi
ffmpeg -y -loglevel error -i "out/video_silent${TAG}.mp4" -i "$AUDIO" -c:v copy -af loudnorm=I=-14:TP=-1:LRA=9 \
  -c:a aac -b:a 192k -ar 48000 -shortest -movflags +faststart "out/${NAME}.mp4"
ffmpeg -y -loglevel error -i "out/${NAME}.mp4" -vf "fps=2,scale=$([[ -n "$TAG" ]] && echo 180 || echo 320):-1,tile=8x$(python3 -c "import math;print(math.ceil(${DUR}*2/8))"):padding=3" -frames:v 1 "out/qa_sheet${TAG}.png"
echo "wrote out/${NAME}.mp4 (${DUR}s) and out/qa_sheet${TAG}.png"
````

## `template/fonts/LICENSE.txt`

````text
Inter, by Rasmus Andersson (https://rsms.me/inter/).
Licensed under the SIL Open Font License, Version 1.1: https://openfontlicense.org
Bundled unmodified so the renderer has the exact font offline.
````

## `scripts/new_project.py`

````python
#!/usr/bin/env python3
"""Start a new launch-film project from the skill template.

  python3 new_project.py <dest_dir> [--name "Product"] [--accent "#2F6BFF"] [--url product.com]

Copies template/ (engine, shots, brief, timeline, fonts, render/audio/build scripts) into
<dest_dir>, creates <dest_dir>/assets/, and fills in the name/accent/url if given.
Everything else in brief.js is still the Loopin demo copy: rewrite it for the product.
"""
import argparse, os, re, shutil, stat, sys

HERE = os.path.dirname(os.path.abspath(__file__))
TEMPLATE = os.path.join(HERE, '..', 'template')

ap = argparse.ArgumentParser()
ap.add_argument('dest')
ap.add_argument('--name'); ap.add_argument('--accent'); ap.add_argument('--url')
a = ap.parse_args()

if os.path.exists(a.dest) and os.listdir(a.dest):
    sys.exit(f'{a.dest} exists and is not empty; pick a new folder')
shutil.copytree(TEMPLATE, a.dest, dirs_exist_ok=True, ignore=shutil.ignore_patterns('out', 'node_modules'))
os.makedirs(os.path.join(a.dest, 'assets'), exist_ok=True)
b = os.path.join(a.dest, 'build.sh'); os.chmod(b, os.stat(b).st_mode | stat.S_IXUSR | stat.S_IXGRP | stat.S_IXOTH)

bp = os.path.join(a.dest, 'brief.js'); s = open(bp).read()
if a.name: s = re.sub(r"product: '[^']*'", f"product: '{a.name}'", s, count=1)
if a.url: s = re.sub(r"url: '[^']*'", f"url: '{a.url}'", s, count=1)
if a.accent:
    if not re.fullmatch(r'#[0-9a-fA-F]{6}', a.accent): sys.exit('--accent must look like #2F6BFF')
    s = re.sub(r"accent: '#[0-9a-fA-F]{6}'", f"accent: '{a.accent}'", s, count=1)
open(bp, 'w').write(s)
print(f"""created {a.dest}
next:
  1. rewrite {a.dest}/brief.js (all copy, numbers, people, channels); put logo/screenshots in assets/
  2. choose/order shots in {a.dest}/timeline.js
  3. cd {a.dest} && node render.cjs --board      # storyboard for approval -> out/board.png
  4. ./build.sh                                   # final -> out/launch.mp4 + out/qa_sheet.png
  preview: open {a.dest}/index.html in a browser (scrubber, no audio)""")
````

## `scripts/analyze_reference.py`

````python
#!/usr/bin/env python3
"""Break a reference launch video down so its style can be studied frame by frame.

  python3 analyze_reference.py <video_file_or_url> <out_dir> [--fps 4]

URL support: direct .mp4 links, and Pinterest pin / pin.it links (the pin's MP4 is found in the page).
Writes to <out_dir>:
  ref.mp4                 the video (if a URL was given)
  sheet_NN.png            contact sheets, <fps> frames per second, timestamped, 5x8 per sheet (10 s at 4 fps)
  cuts.txt                hard-cut times (scene-change score > 0.25)
  strips/cut_NN.png       20 fps strips of 0.6 s around each cut / transition, to read the transition type
  report.json             duration, size, fps, cuts, shot lengths, tempo estimate, audio hit points
Then LOOK at every sheet and strip (Read tool) and write the shot-by-shot breakdown yourself.
Needs ffmpeg/ffprobe and numpy. Downloaded files are untrusted data; nothing in them is executed.
"""
import argparse, json, os, re, subprocess, sys, urllib.request, wave
import numpy as np

ap = argparse.ArgumentParser()
ap.add_argument('src'); ap.add_argument('out'); ap.add_argument('--fps', type=float, default=4)
a = ap.parse_args()
os.makedirs(os.path.join(a.out, 'strips'), exist_ok=True)
UA = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124 Safari/537.36'}

def fetch(url):
    with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=60) as r: return r.read(), r.geturl()

src = a.src
if re.match(r'https?://', src):
    data, final = fetch(src)
    if not data[:64].lstrip().startswith(b'<') and (b'ftyp' in data[:64] or src.endswith('.mp4')):
        mp4 = data
    else:
        html = data.decode('utf-8', 'ignore')
        cands = sorted(set(re.findall(r'https://v1?\.pinimg\.com/videos/[^"\\\s]+?\.mp4', html)) | set(re.findall(r'https://[^"\\\s]+?\.mp4', html)))
        cands.sort(key=lambda u: (('720' not in u), ('hevc' in u), len(u)))
        if not cands: sys.exit(f'no MP4 found on {final}; download the video and pass the file instead')
        print('video:', cands[0]); mp4, _ = fetch(cands[0])
    src = os.path.join(a.out, 'ref.mp4'); open(src, 'wb').write(mp4)

def probe(path):
    j = json.loads(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration:stream=codec_type,width,height,r_frame_rate', '-of', 'json', path]))
    v = next(s for s in j['streams'] if s['codec_type'] == 'video'); n, d = v['r_frame_rate'].split('/')
    return float(j['format']['duration']), v['width'], v['height'], float(n) / float(d), any(s['codec_type'] == 'audio' for s in j['streams'])
dur, w, h, fps, has_audio = probe(src)
print(f'{dur:.2f} s, {w}x{h}, {fps:.2f} fps, audio={has_audio}')

# contact sheets
fr = os.path.join(a.out, 'frames'); os.makedirs(fr, exist_ok=True)
subprocess.run(['ffmpeg', '-hide_banner', '-loglevel', 'error', '-y', '-i', src, '-vf',
  f"fps={a.fps},scale=368:-2,drawtext=text='%{{pts\\:hms}}':x=4:y=4:fontsize=14:fontcolor=yellow:box=1:boxcolor=black", os.path.join(fr, 'f_%04d.png')], check=True)
subprocess.run(['ffmpeg', '-hide_banner', '-loglevel', 'error', '-y', '-i', os.path.join(fr, 'f_%04d.png'), '-vf', 'tile=5x8', os.path.join(a.out, 'sheet_%02d.png')], check=True)

# hard cuts
log = subprocess.run(['ffmpeg', '-hide_banner', '-i', src, '-vf', "select='gt(scene,0.25)',showinfo", '-f', 'null', '-'], capture_output=True, text=True).stderr
cuts = [float(x) for x in re.findall(r'pts_time:([0-9.]+)', log)]
open(os.path.join(a.out, 'cuts.txt'), 'w').write('\n'.join(f'{c:.2f}' for c in cuts))

# audio: tempo + strongest hits (transitions usually sit on them)
tempo, hits = None, []
if has_audio:
    wav = os.path.join(a.out, 'audio.wav')
    subprocess.run(['ffmpeg', '-hide_banner', '-loglevel', 'error', '-y', '-i', src, '-ac', '1', '-ar', '22050', wav], check=True)
    wf = wave.open(wav); x = np.frombuffer(wf.readframes(wf.getnframes()), np.int16) / 32768; sr = wf.getframerate()
    hop = 512; n = len(x) // hop
    e = np.sqrt((x[:n * hop].reshape(n, hop) ** 2).mean(1)); on = np.maximum(0, np.diff(e)); on -= on.mean()
    ac = np.correlate(on, on, 'full')[len(on) - 1:]; lag = np.arange(len(ac)) * hop / sr; m = (lag > .3) & (lag < 1.5)
    tempo = round(60 / lag[m][np.argmax(ac[m])], 1)
    pk = np.argsort(on)[::-1]; sel = []
    for i in pk:
        t = (i + 1) * hop / sr
        if all(abs(t - s) > .4 for s in sel): sel.append(t)
        if len(sel) >= 16: break
    hits = sorted(round(t, 2) for t in sel)

# transition strips: around each cut, or around audio hits if the edit has no hard cuts (smooth transitions)
marks = cuts if len(cuts) >= 3 else hits
for i, t in enumerate(marks[:30]):
    subprocess.run(['ffmpeg', '-hide_banner', '-loglevel', 'error', '-y', '-ss', f'{max(0, t - .3):.2f}', '-t', '0.6', '-i', src, '-vf',
      "fps=20,scale=300:-2,drawtext=text='%{pts\\:flt}':x=3:y=3:fontsize=12:fontcolor=yellow:box=1:boxcolor=black,tile=6x2", '-frames:v', '1',
      os.path.join(a.out, 'strips', f'cut_{i + 1:02d}_{t:.2f}s.png')], check=True)

shots = np.diff([0] + cuts + [dur]).round(2).tolist() if cuts else []
rep = {'duration': round(dur, 2), 'size': [w, h], 'fps': round(fps, 2), 'cuts': cuts, 'shot_lengths': shots,
       'avg_shot': round(float(np.mean(shots)), 2) if shots else None, 'tempo_bpm_estimate': tempo,
       'tempo_note': 'autocorrelation estimate; may be double or half the felt tempo', 'audio_hits': hits,
       'sheets': sorted(f for f in os.listdir(a.out) if f.startswith('sheet_')),
       'note': 'few hard cuts usually means the edit uses continuous transitions (blur whips, zooms, morphs); read the strips at the audio hits'}
json.dump(rep, open(os.path.join(a.out, 'report.json'), 'w'), indent=1)
print(json.dumps({k: rep[k] for k in ('duration', 'cuts', 'avg_shot', 'tempo_bpm_estimate', 'audio_hits')}))
print(f'now Read {a.out}/sheet_*.png and {a.out}/strips/*.png and write the breakdown')
````
