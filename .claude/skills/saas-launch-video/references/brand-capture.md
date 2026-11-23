# Brand capture: matching the client's brand

> Screenshots captured here are **reference material**: study them to rebuild the UI as kit components (`ui-kit.md`) and to pick colours, fonts and copy. They are not scene content. Pasting them into mockups makes the film look like the website, not like a launch film.

The film has to look like it came from the client's own design team. All of that comes from their site or brand guide, never from the template.

## What `capture_brand.cjs` collects

| Output | Contents | How to use it |
|---|---|---|
| `kit.png` | One-page review sheet: logo, hero, colour swatches (by area / text / buttons / accents), gradients, fonts with samples, buttons rendered in their real style, radius and shadow, copy, UI pieces | **Read it first.** Compare `brief.js → brand` against it. |
| `brand.json` | All raw data: colours ranked by area and use, fonts (family, weights, largest size, tracking), `fontFaces` and downloaded `fontFiles`, radius, shadows, every button's bg / gradient / colour / radius / border, logo, copy (h1/h2/h3/nav/eyebrows/stats with context), UI pieces | Ground truth for any role you need to fix. |
| `captured.md` | Every headline, stat (with the sentence around it), button, pill and UI piece, as text | Copy source. Use their exact words. |
| `hero.png`, `page.png`, `pages/*.png` | 2× screenshots of the first screen, the full page and extra pages (`--pages /features,/pricing`) | Cut product screens and layers from these. |
| `ui/*.png` | Element screenshots of big images (product shots, illustrations) and card-like components (testimonials, forms, feature cards) | Feature images, layers, social proof. |
| `fonts/*` | Their webfont files, when the host serves them | Wired into `brand.fonts`. |
| `logo.*`, `favicon.*` | The logo, including SVG wrappers that point at a raster image; the favicon for the square mark | `brand.logo`, `brand.icon`. |

## Fixing roles in `brief.js → brand`

`make_brief.py` guesses the roles. You decide.

- **`accent`**: the colour of their **primary call-to-action** ("Start free trial", "Get started"). On a monochrome brand that's black or ink. That's correct, and the film becomes editorial.
- **`highlight`**: the second colour that pops (a launch pill, a product orange, a neon). Used for stat underlines, badges and the launch pill.
- **`gradient`**: only if their buttons or hero actually use one. Midnight and cinematic backgrounds use it.
- **`bg` / `bg2` / `surface` / `ink` / `dark` / `muted`**: from the page. `dark` is their darkest section colour, which becomes the dark-scene background.
- **Ignore** colours that only appear in photos, illustrations, customer logos or a single decorative blob.
- **Fonts**: `display` is the family of their biggest headline, and `body` the running text. `headWeight` is the weight of their H1 (look at the sample in `kit.png`). Set `headTracking` if their headlines are visibly tight or wide.
- **`radius`**: their card radius. **`buttons`**: copy primary and secondary from the "Buttons as styled" row. Keep the radius exact (a 4 px button must not become a pill).
- **`logo`**: a wordmark. Set `logoOnDark` if they have a white version; otherwise inversion is used (fine for one-colour logos, wrong for multi-colour ones, where you should use `icon` on dark).
- **`icon`**: the square mark (favicon or app icon). Used by `turnGlow`, the classic `brand` and `turn` shots, and the CTA fallback.

## Real UI → layers

1. Pick screens: `brand/ui/*` (look at the filenames and alt text in `captured.md`), crops from `hero.png` and `pages/*`, or the user's own screenshots (best quality).
2. `python3 scripts/layers.py grid brand/hero.png` → Read `hero_grid.png` → note percent boxes.
3. `python3 scripts/layers.py crop brand/hero.png X Y W H brand/layers/dashboard.png --round 24`
4. Layers that lift off a screen are boxes **in that cropped screen's coordinates**: `at: [x, y, w]` as fractions of the screen crop. Convert with `(pageX − screenX) / screenW`. Use `scale` 1.05–1.35, bigger for small toasts.
5. Prefer marketing images that are mostly UI. If an image has marketing text beside the UI, crop to the UI part.

## When the site can't be captured

- **Bot checks** (Vercel / Cloudflare checkpoint, captcha) → exit code 3.
- **Hosts refused by the cloud network** → `connect_rejected` in the proxy log: ask the user to allow the domain in the environment's network settings.

In either case, ask for screenshots, logo, brand guide and copy, and build `brand/` by hand. A brand guide PDF: Read it and transcribe colours, fonts and logo rules into `brief.js → brand`. It overrides anything captured from the site.

## Self-check before the board

- [ ] No Loopin copy, no mock skeleton, no default blue left (unless it is their colour).
- [ ] Headlines in their display font and weight; buttons identical to their site.
- [ ] Logo correct on light and dark scenes.
- [ ] Every product screen is theirs; every number is theirs, with its real meaning.
