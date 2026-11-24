### Creative moves

A **move** is a scene built around one visual idea. A film is a concept told through 8–11 moves. Each timeline row is `[move, seconds, speed, { params }]`. Components (`component: 'key'`) come from `brief.js → kit` (see `ui-kit.md`). Every move follows the brand tokens and has a 9:16 layout.

#### Story moves (`shots_creative.js`)

| Move | Beat | Params | The viewer sees |
|---|---|---|---|
| `kinetic` | Hook / any big line | `big`, `small`, `label`, `glow: 'hi'\|'acc'` | A huge line (a time, a word) focus-pulls in over an atmospheric glow (sunrise / horizon), with a light line sweep |
| `scribbles` | Problem as an illustration | `surface: 'whiteboard'\|'paper'\|'sticky'`, `items: [{t, x, y, size, color, rot, strike, circle}]`, `strokes: [{d, color, w}]` (SVG paths in 0–1000 space), `smear`, `caption: [a, b]` | A drawn board / note writes itself, with circled question marks, crossed-out numbers and an eraser smear; a caption pill pops |
| `crowd` | Problem at scale | `count`, `names`, `questions: [..6]`, `center: [big, small]` | A grid of people (brand-tinted avatars) pops in; their questions bubble up; a counter card lands in the middle |
| `dial` | Problem as a metric | `headline: [l1, l2, …]`, `value`, `from`, `unit`, `label`, `accent` | A gauge sweeps from 100 down to a bad value beside a headline |
| `funnel` | Problem as a bottleneck | `headline: [a, b]`, `gate`, `count`, `pass` | Thousands of dots crowd a narrow gate; only a few get through |
| `strokesLogo` | Turn | `word`, `colors` (uses `brand.markSvg` / `icon`) | Coloured strokes (the problem's marks) fly in from the edges and converge; the brand mark forms where they meet, wordmark below |
| `inline` | Benefit as a sentence | `before`, `component`, `after`, `line2`, `button` | "Program [their card] in minutes.": the rebuilt component flies into the gap in the sentence and comes alive |
| `componentHero` | Hero product moment | `headline: [a, b]`, `accent`, `component` | One rebuilt component, big, rising in 3D: titles type, toggles switch, numbers count |
| `podium` | Ranking / competition | `headline: [a, accentWord]`, `entries: [{place, value, name}]` | Leaderboard entries become 3D podium blocks in the highlight colour; medals drop, numbers count |
| `chartSet` | Data | `headline`, `pill`, `bars: [{value, label, color}]`, `slider: {label, value, display}` | Their chart becomes the set: giant bars rise from the floor; a hand drags their rebuilt slider |
| `fan` | Distribution / reach | `headline: [a, accent]`, `card` (kit key or spec), `subjects: [..]`, `count`, `stat` (kit key) | Cards (emails, notifications) fly out into a fan; a stat tile counts up |
| `dotNumber` | Proof | `value`, `caption: [a, b]` | Hundreds of dots fly in and assemble into the number |
| `statLine` | Proof | `value`, `valueShort` (9:16), `caption`, `bold`, `chip`, `color` | The real number counts up over a growth line drawn in their chart colour |
| `flood` | CTA | `button`, `fill` | Their primary button is clicked; its colour floods the frame; logo, tagline, their buttons, URL |

#### Reference-film moves

| Move | From | Params |
|---|---|---|
| `monitorWords` | Ref C | `component`, `items: [3–4 words]`: a monitor shows a rebuilt component; ✦ keywords pop around it |
| `splitWords` | Ref C | `left`, `right`, `component`: "Word [screen] word." |
| `frameCard` → `uiBuild` | Ref C | `component`, then `brief.build.{title, label, baseComponent, dragComponent}`: frame-in-frame → line → card that builds itself while a hand drags a piece in |
| `turnInk` / `turnGlow` / `logoReveal` | editorial / Ref C / Ref A | `brief.launch.pill`, logo, icon |
| `hook`, `chaos`, `pain`, `turn`, `circle`, `fanout`, `colorize`, `morph`, `rackfocus`, `dive`, `reel`, `social` | Refs A/B | read their sections of `brief.js` (see `shot-library.md`) |

`uiHero` / `uiFeature` show real screenshots. Use them **at most once**, only if the user asks for a "real product" moment, and never as the hero of the film.

#### Choosing moves for a concept

- **Problem (2–3 scenes):** make the pain *visible*. Pick `scribbles` (manual / messy work), `crowd` (too many people or requests), `dial` (a metric going wrong), `funnel` (a bottleneck or gatekeeper), or the classic `chaos` / `pain`.
- **Turn (1):** `strokesLogo` when the problem has marks or lines that can become the logo; `turnInk` for monochrome brands; `turnGlow` for gradient brands.
- **Solution (3–5):** each benefit gets a different picture. `inline` (speed / ease), `componentHero` (the core workflow), `podium` (competition / ranking), `chartSet` (insight), `fan` (reach), and the Ref C moves for tech or AI products.
- **Proof (1):** `dotNumber` (a count of people or customers), `statLine` (growth or money).
- **CTA (1):** `flood`.
- Alternate light and dark scenes and calm and busy ones. Never use the same move twice in a row.

#### Writing a move

When a concept needs a picture none of these give, write a new move in `shots_creative.js`:

```js
shot('myMove', { hero: 2.2, len: 3.0, bg: 'dark', tin: 'zoom', tout: 'whip',
  sfx: [[0.1, 'swoop'], [0.8, 'pops4'], [2.85, 'whoosh']],
  build(c, s, sc) {                       // sc = the timeline row's params
    s.h = D(c, 'ctr head', { left: CX, top: lv(150, 300), fontSize: lv(110, 100) + 'px' }, kesc(sc.headline));
    s.comp = renderComponent(c, sc.component, { x: CX - 300, y: lv(400, 700), w: 600 });
  },
  update(t, s, c) {                        // pure function of t
    S(c, { s: L(1, 1.04, t / 3) });
    blurIn(s.h, t, 0, .4, { y: -16 });
    revealParts(s.comp, t, .5); animateComponent(s.comp, t, .5);
  } });
```

Rules:
- Use brand variables (`--acc`, `--hi`, `--ink`, `--dark`, `--font`, `--radius`, `--b1-bg`) and `bg: 'light' | 'dark' | 'accent'`.
- Use `lv()` for 9:16, and `fitFs()` for long copy.
- Particles go on a `<canvas>` redrawn from `t`.
- Add `sfx` for every arrival.
- Add the move to the tables above.
