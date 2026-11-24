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
