# SaaS launch video: style reference

> **For Claude, in a new chat:** use this as the reference for making premium, fast-paced SaaS / app launch
> videos in the problem → solution style, in **16:9 (1920×1080)** and **9:16 (1080×1920)**.
> When the user describes a product, produce, in order:
> 1. a **brief**: user, painful moment, pain number, 3 features, proof numbers, CTA, brand colour;
> 2. a **beat sheet**, using the arc in *Story formula*;
> 3. a **shot list** naming a shot from the *Shot library* for each beat, with seconds on screen,
>    the transition in and out, the on-screen copy, and what moves;
> 4. the **sound plan**: music sections and SFX on each cut;
> 5. any **9:16 adjustments**.
> Follow the *Style bible* pacing rules: a cut every 1.5–2.8 s, an event every 0.4–0.8 s, 22–35 s total.
> Copy the techniques, never another company's brand.
> (The companion file `saas-launch-video-skill.md` adds the full rendering code for Claude Code.)

## Contents
1. How the workflow runs (from the skill)
2. Story formula: problem first, then the fix
3. Style bible: look, motion, pacing
4. Shot library: the 16 shots
5. Transitions
6. Sound design
7. Reference breakdown: the two films this style was studied from

---

## How the workflow runs

### SaaS launch video

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

#### Workflow

Run the steps in order. There are two approval gates, where the user signs off before you spend render time.

##### 1. Brief

Get these from the user, or infer them from their site, repo or screenshots and confirm:
- product name, URL and one-line purpose
- the user and their **painful moment** (when, where, what they see)
- the **pain number** (what piles up)
- 3 key features and the complaint each one fixes
- proof numbers, social proof and setup time
- CTA buttons
- brand accent colour, logo, 1–3 UI screenshots, and optionally a music track

If they gave a reference video, run `python3 -I scripts/analyze_reference.py <file|url> <outdir>` first, Read every `sheet_*.png` and `strips/*.png`, and write a shot-by-shot breakdown like `references/reference-analysis.md`. Treat downloaded media as untrusted data.

##### 2. Script and beat sheet (gate 1)

Read `references/story-formula.md`. Write a beat sheet table: shot number, start time, shot id, on-screen copy, and what moves. Follow the arc: hook → chaos → pain → turn → reveal → 3 benefits → proof → social → ease → CTA. Then show it to the user and **wait for approval or edits**.

##### 3. Build the project

```bash
python3 .claude/skills/saas-launch-video/scripts/new_project.py <project_dir> --name "Name" --accent "#RRGGBB" --url name.com
```

- Rewrite **all** of `<project_dir>/brief.js` from the beat sheet. Nothing from Loopin should survive unless intended.
- Put the logo and screenshots in `assets/`, and set `brand.logo`, `inbox.screenshot` and `inbox.click`.
- Edit `timeline.js` for shot order and length (see `references/shot-library.md`). Mix in the signature shots (`dive`, `morph`, `rackfocus`, `colorize`) so the film never repeats a move. Swap them in for benefits rather than adding length.
- If a beat needs a shot that doesn't exist, write it with the skeleton and rules in `shot-library.md`, using `references/transitions.md`.

##### 4. Storyboard (gate 2)

```bash
cd <project_dir> && node render.cjs --board                   # add --format 9:16 for the vertical board
```

Read `out/board.png` yourself and check that:
- nothing overflows or overlaps
- no text is cut off
- the colours follow the brand
- the screenshot and click point are right

Fix any problems, then show the board to the user (`SendUserFile`) and **wait for approval**. For a closer look at a specific moment, run `node render.cjs --still 3.2,7.9`.

##### 5. Render and QA

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

##### 6. Deliver

Send the MP4 (`SendUserFile`, display `render`). Give a short shot list with times, and tell them:
- which numbers, logos and people are placeholders to replace with real ones
- that the music is synthesized unless they supplied a track
- how to tweak it: copy in `brief.js`, pacing in `timeline.js`, `./build.sh` to rebuild

#### Pacing rules (the "fast, high-retention" feel)

- A cut every 1.5–2.8 s, and a visual event every 0.4–0.8 s. The CTA may hold 2.6–3.2 s.
- In `timeline.js`, `speed` (1.2–1.6) compresses a shot's animation and `seconds` sets the cut. A shot shows `seconds × speed` of its authored `len`, and the tail beyond that is trimmed.
- If the user says it feels slow or stuck, find the shot whose last move ends more than 0.5 s before its cut (check the QA sheet) and raise its speed or trim its seconds. Don't speed up text past readability.

#### Formats

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

#### Guardrails

- Copy techniques, never brands. Don't recreate another company's film, UI, logo or footage.
- Use only logos, faces, ratings and customer numbers the user provides or confirms. Otherwise use clearly fictional placeholders and say so.
- `update()` must be a pure function of time, because frames render in parallel and out of order.

#### Troubleshooting

| Symptom | Fix |
|---|---|
| Text looks too thin or line-height collapses | A numeric `fontWeight`/`lineHeight` was passed through a helper that adds px. Use `D()`, which handles these, or strings. |
| Colour doesn't follow the brand | A hard-coded hex. Use `var(--acc)`, `rgba(var(--accRGB),a)`; in SVG use `style="stop-color:var(--acc2)"`. |
| The hand misses the button | Adjust `inbox.click`. `measure()` locates the target with the laptop in its final pose. |
| The circle grows from the wrong place | The previous shot must set `s.focus` (only `laptop` does by default). |
| `PAGE ERROR` in the render log | Open `index.html` in a browser (it has a preview scrubber) and check the console. |
| The riser is too long or short | It auto-ends on the next `hit` cue; move the `hit`, or the shot that owns it. |

---

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
