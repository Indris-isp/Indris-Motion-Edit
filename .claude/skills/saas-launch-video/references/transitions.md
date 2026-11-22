# Transitions

The reference cuts almost never look like a plain cut. Each one below is either built into the engine or has a recipe here.

## Built in (`tin` / `tout` on a shot, or a timeline override)

| Name | How | Feels like | Use between |
|---|---|---|---|
| `whip` | ±700–800 px horizontal slide with 60–70 px directional blur, 0.24–0.3 s | Energy, "next!" | Problem beats; benefit → proof |
| `up` | Vertical version of the whip | A lift, progress | Brand → first benefit; proof → social |
| `zoom` | Out: scale to 1.6 with blur and fade. In: from 0.82 with blur. | Diving in, focus | Chaos → pain (zoom *into* the problem); into a CTA |
| `fade` | Opacity plus blur plus a slight scale | Calm, a breath | Social → reel → cta |

## Built into specific shots

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

## Recipes not yet built (add as shots when a brief needs them)

- **Shape morph** (ref A 27 s): animate one card's `width/height/border-radius/background` from a solid accent square → folder → UI panel, then cross-fade the UI content in at the end.
- **Rack focus** (ref A 33 s): two layers, one sharp and one blurred, swapping blur values over 0.4 s while the camera scales 1 → 1.15.
- **Colour-ize wall** (ref A 16 s): a grid of avatars with `filter: grayscale(1)`. Flip random ones to grayscale(0) with a small pop, staggered after a toggle animates on.
- **Device dive** (ref B): scale a laptop or phone until its screen fills the frame (scale about 3.2 centred on the screen), then cut to a full-frame version of the screen content. It reads as one continuous move.
- **Glass card world** (ref B): full-bleed photo background, the product in a rounded `backdrop-filter: blur()` card, thin 1 px white grid lines, and words placed around the card.
- **Comet message** (ref A 3.5 s): a pill moving along a path with 3–4 trailing copies at decreasing opacity and increasing blur.

## Choosing transitions

- Inside the problem section use hard, fast moves (whip, zoom). Use a **dark turn** between problem and solution, so the contrast is the "relief" moment. Use smoother moves (up, circle, fade) in the solution and proof sections.
- Never use the same transition three times in a row.
- Every transition gets a sound (whoosh, or a hit for big reveals): see `sound-design.md`.
