# Style library

A **style** is the motion language of a film. It's learned from a reference video and painted with the client's brand tokens. Set it with `STYLE` in `timeline.js`, or preview with `index.html?style=midnight`. `new_project.py --style X` also writes that style's default shot list.

| Style | Learned from | Looks like | Default device | Turn | Suits |
|---|---|---|---|---|---|
| **airy** (Airy Light) | Ref A, the office-booking film | White to pale gradient, soft accent blobs, white cards, star-field turn, equalizer-glow CTA | laptop | `turn` (dark star field, ring → icon) | Friendly B2B, colourful brands |
| **editorial** (Editorial Contrast) | Black/white brands (e.g. Ghost) | Ink on paper, grain, heavy tight headlines, hard black/white cuts, flat screenshots, no blobs | none (flat) | `turnInk` (cut to ink, logo + launch pill + light line) | Monochrome, content and creator brands |
| **midnight** (Midnight Gradient) | Ref C, the no-code agent film | Deep brand-gradient dark scenes alternating with lavender/tint light scenes, glass cards, ✦ keyword words, monitor | monitor | `turnGlow` (mark glows, streak, white flash) | Brands with a vivid gradient or dark UI |
| **cinematic** (Cinematic Device) | Ref B, the Mac assistant teaser | Calm grey, thin type, words one by one, device dives into the content | laptop | `turnInk` | Apple-like, consumer, AI assistants |

Each style defines:
- `bg.light` / `bg.dark` / `bg.accent`: CSS using brand variables (`--bg`, `--bg2`, `--dark`, `--night1/2`, `--gradA/B`, `--acc*`, `--tint`)
- `device`, `card` (solid / glass / outline), `texture` (blobs / grain / rays / none)
- `head` weight and tracking (the brand's `headWeight` overrides)
- `turn`, `bpm`
- the default `shots`

The style's `shots` list is only a starting point. The concept decides the scene list (`concepts.md`, `creative-moves.md`).

Shots ask for a scene **kind** (`bg: 'light' | 'dark' | 'accent'`), so the same shot renders differently per style.

## Choosing

1. Start from the **brand**:
   - a monochrome site with a black primary button → editorial
   - a vivid gradient, or mostly dark sections → midnight
   - light, colourful, friendly → airy
   - minimal grey or consumer → cinematic

   `make_brief.py` suggests one.
2. Then the **user's reference** decides between close options, or creates a new style.
3. Never force a style's colours onto a brand. The style only supplies structure; colours always come from `brand`.

## Learning a new style from a reference

1. `python3 -I scripts/analyze_reference.py <file|url> <out>`, then Read every sheet and strip.
2. Write the shot-by-shot breakdown into `reference-analysis.md` (time, beat, what's on screen, transition).
3. List its signature moves and map each to an existing shot, or write a new one in `shots_brand.js`. Use the skeleton in `shot-library.md`: use `bg` kinds, `device()`, brand variables and `lv()` for 9:16.
4. Add an entry to `window.STYLES` in `styles.js` with bg / device / card / texture / head / turn / bpm / shots, and add a row to the table above.
5. Render a board in **two different brands** to prove the style follows the brand (it should look different in each).

### Ref C → midnight, as an example

| Ref C move | Shot |
|---|---|
| Dashboard rises and tilts up out of the frame | `uiHero` with `device: 'monitor'` |
| ✦ keywords pop in around the monitor | `monitorWords` |
| "Smart [monitor] Agents" | `splitWords` |
| Monitor shrinks into a glass frame, squashes to a line, opens into a white card | `frameCard` |
| "Create Agent" card builds itself; a file is dragged in and snaps | `uiBuild` |
| Midnight blue-violet ↔ lavender scenes | `bg.dark` / `bg.light` of midnight |
