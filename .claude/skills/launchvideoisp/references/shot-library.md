# Shot library (`template/shots.js`)

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

## Brand shots (`template/shots_brand.js`)

> Creative moves (`creative-moves.md`) are the default for client films. `uiHero` and `uiFeature` show real screenshots: use them at most once, and only if the user asks for a literal product moment. The turns (`turnInk`, `turnGlow`, `logoReveal`), `statBig`, `ctaBrand` and the Ref C moves (now with `component:`) are fine to use.

These are built around the client's real material, and they adapt to the style: device, card, background kind.

| id | Beat | Brief fields | len | Transitions | What moves |
|---|---|---|---|---|---|
| `turnInk` | Turn (editorial / cinematic) | `launch.pill`, logo | 2.4 | ends on a hit | Hard cut to their dark; logo focus-pulls in (inverted or `logoOnDark`); a highlight light line sweeps; the launch pill pops |
| `turnGlow` | Turn (midnight) | `icon`, logo | 2.4 | white flash out | Brand mark glows in on the dark gradient, a light streak crosses, the logo blurs in under it, flash to light |
| `logoReveal` | Reveal | logo, `hero.eyebrow` | 2.4 | out: up | Their logo wipes in (mask + blur), eyebrow pill rises |
| `uiHero` | Hero | `hero.l1/l2/eyebrow/screen/layers` | 4.0 | — | Their H1 types on (auto-fits long lines), their real screen rises in the style's device and tilts up, layers lift off it one by one |
| `uiFeature` | Feature | `features[i]` (`label`, `l1`, `l2`, `image`, `click`) | 3.6 | whip / whip | Uppercase label + headline beside their feature image sliding in with motion blur; optional hand click. `{feature: i, flip: true}` |
| `monitorWords` | Ref C | `words.screen/items` | 3.0 | zoom / zoom | Monitor with their screen rises; ✦ keywords pop in around it |
| `splitWords` | Ref C | `split.left/right/screen` | 2.6 | out: zoom | "Word [screen] word.": words slide out from behind the device (stacked in 9:16) |
| `frameCard` | Ref C transition | `words.screen`, `build.title` | 2.6 | — | Dark scene shrinks into a glass frame, squashes to a line, the line opens into a glass card with the title |
| `uiBuild` | Ref C | `build.title/label/base/drag` | 3.6 | out: up | The card fills with their UI; a hand drags a second real piece in, it snaps with an outline, ✓ |
| `statBig` | Proof | `stat.value/valueShort/caption/bold` | 3.0 | zoom / fade | Their real number counts up (keeps $, +, %, commas); highlight underline draws; caption focus-pulls |
| `ctaBrand` | CTA | logo, `cta.tagline/primary/secondary`, `url` | 4.0 | in: zoom | Logo, tagline, **their buttons** (`brand.buttons`), URL; per-style glow (airy equalizer, midnight gradient, editorial none) |

Helpers for new brand shots: `device(parent, kind, {x, y, w, h, src})` returns `{el, screen}`; `screenOverlay(dev)` + `mkLayers()` + `liftLayers()`; `logoHTML(h, onDark)`; `markHTML(s)`; `btnHTML(label, 1|2, size)`; `parseStat`/`fmtStat`; `skeletonHTML()` (template only).

## Using screenshots instead of the mock UI

- Put a 16:10 screenshot in `assets/` and set `BRIEF.inbox.screenshot = 'assets/app.png'`.
- Set `BRIEF.inbox.click = [x, y]` (fractions of the image) to the button the hand should press. A ring marks the click.
- The circle shot then grows from that point.

## Reordering and reusing

- The order and count are free. Shots can repeat with overrides, e.g. `['laptop', 2.6, 1.5, { tin: 'whip' }]`. Note that a repeated shot shows the same brief copy; to show different copy, add a variant shot (below).
- `circle` should follow a shot that sets `s.focus` (`laptop` or `rackfocus`). Otherwise it grows from the centre.
- `dive` and `morph` are the smoothest transitions in the set: use `dive` right after `brand` ("now look inside"), or between benefits; `morph` turns a headline card into the product, which suits any feature that is a panel or object.
- `turn` should be followed by `brand`, because `brand` fades out the white flash the turn leaves behind.
- The music follows the shots: the intro runs until `turn`, the groove starts at the shot after it, and the outro starts at `cta`. Without a `turn` shot the groove plays from the start.

## Writing a new shot (or a variant with different copy)

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
- Use brand variables (`--ink`, `--onDark`, `--bgLight`, `--bgDark`, `--bgAccent`, `--hi`, `--radius`, `var(--font)`) and `bg: 'light'|'dark'|'accent'`, never fixed colours, so shots follow every brand and style.
- Shared helpers: `mkHand(c)` + `moveHand(h, t, x, y, t0, t1)` for a hand that travels and presses, `centerOf(el)` for a target's stage position (call it in `measure()`), and `iconHTML`/`glyphHTML`/`av` for the icon, glyphs and avatars.
- Pass numbers in `D()` styles only for px properties. `fontWeight`/`lineHeight`/`opacity`/`zIndex`/`flex` stay unitless (the helper handles them). Write font sizes as strings like `'104px'`.
- Use CSS variables (`var(--acc)`, `rgba(var(--accRGB),.5)`) instead of hex, so the theme follows the brief. In SVG, put colours in `style="stroke:var(--acc)"`, not in attributes.
- Put new copy in `brief.js` under a new key, not inline.
- Add `sfx` for every arrival: whoosh on cuts, pops on staggers, type on typing, click on clicks.
