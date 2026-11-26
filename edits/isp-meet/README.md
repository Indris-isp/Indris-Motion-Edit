# Meet ISP Agency (7-scene promo)

A 19-second vertical promo: 1080×1920 at 30 fps. It has a synthesized 120 BPM music bed, and every scene cut lands on a beat. It uses the same house style as `video/`: white gradient stage, orange accent, Inter with Instrument Serif italic, and the ISP oval mark.

| # | Time | Scene |
|---|---|---|
| 1 | 0.0–2.5 s | **Meet** / **ISP Agency**; an orange oval draws around the name |
| 2 | 2.5–5.0 s | Brand logo wall: cards pop in under "Brands we've worked with" |
| 3 | 5.0–8.0 s | ISP logo in the centre, with 10 platform icons flying out into two orbit rings |
| 4 | 8.0–10.0 s | "Let's make your video *better.*" |
| 5 | 10.0–13.0 s | Instagram & YouTube, then a swap to Facebook & TikTok (app-icon tiles) |
| 6 | 13.0–15.5 s | Heading **ISP Agency**; the 4 icons fly into one box: "All in one place, *less pressure.*" |
| 7 | 15.5–19.0 s | ISP logo, a video player with the progress bar filling to 100%, a check mark, then "Video is *ready.*" |

Output: `out/isp_meet_1080x1920.mp4`

## Your brand logos (scene 2)

1. Put the logo files in `logos/brands/`. Transparent PNGs or SVGs work best.
2. List them in `brands.js`, for example `window.BRANDS = ['logos/brands/acme.png', ...]`. Up to 6 use a 2×3 grid; 7–9 use a 3-column grid.
3. Re-render. Until you list logos, scene 2 shows neutral "LOGO" placeholder cards.

## Rebuild

```bash
python3 audio.py
```

```bash
node render.cjs
```

`audio.py` needs `pip install numpy scipy`. `render.cjs` uses Playwright's Chromium and ffmpeg, and takes about 2 minutes. For quick stills, run `node render.cjs --still 1,6.5,17.8`. For a live preview with a scrubber, open `index.html` in a browser.

## Editing

- **Timing:** `SC` at the top of `motion.js`. Keep `CUTS` in `audio.py` in sync so the whooshes still hit the cuts.
- **Copy:** each scene's `build()` holds its text.
- **Sound:** `SFX = False` in `audio.py` gives music only. To use your own track, replace `out/audio.wav` and run `node render.cjs` again.
- **Logo:** `logo()` in `motion.js` is the vector recreation of the ISP mark. Replace it with the official SVG if you have one.
- **Platform icons:** `icons.js` holds the glyph paths from Simple Icons v13 (CC0).
