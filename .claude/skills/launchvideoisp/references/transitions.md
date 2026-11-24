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
