# "Real world vs Vice City" — premium vertical re-edit

`src/real_world__vice_city.mp4` (960×720, 4:3, 23 s talking head) → `out/vice_city_premium_1080x1920.mp4` (1080×1920, 24 fps, 18.1 s, −14 LUFS).

```bash
cd edits/vice-city
```

```bash
python3 edit.py
```

Quick frames: `python3 edit.py --still 5.5,12.1` writes `out/still_*.png` (output times). Needs only ffmpeg, numpy and Pillow; fonts come from `video/fonts/`.

## What the edit does

Times are source times; after the jump cut, the output runs about 1.1 s earlier.

| Time | Line | Picture |
|---|---|---|
| 0.0 | "you enjoy the real world" | Speaker, zoom-settle open |
| 1.5 → 2.6 | (pause) | Dead air removed (jump cut, audio crossfade) |
| 2.6 | "it's nice out here" | Speaker, wide |
| 4.2 – 8.8 | "feels good" / "beautiful scenes" / "fresh air" / "birds chirping" | Stock B-roll: sun through trees, aerial canyon (on the music drop), woman breathing, bird singing |
| 8.8 | "makes you feel alive" | Speaker close-up |
| 10.6 | "too many people are inside f*cking" | B-roll: gamer in a dark room; grade turns cold |
| 12.0 | "GTA" | Speaker punch-in with flash / RGB split / shake (visual only) |
| 13.2 | "living a fake reality" | B-roll: man in a VR headset |
| 14.6 | "instead of actually living their life" | Speaker; grade warms back; B-roll of friends on "their life" |
| 16.8 | "…put on this earth to live" | Speaker; aerial B-roll on "this earth"; ends on "to live" with a short fade |

- **Captions:** the original burned-in captions are inpainted away per frame (`remove_captions`). The new captions come from `words.json` (timings read off the original captions). They use Inter Medium run-in words, one gold Instrument Serif Italic keyword per beat, and red for "f*cking" / "fake reality". The animation matches the client's reference: each word fades in from blur to sharp; keywords assemble letter by letter in random order; the block slowly grows while on screen, then blurs and fades out. Tune it with `WORD_IN`, `LETTER_SPREAD`, `EXIT_T` and related settings in `edit.py`.
- **B-roll:** Mixkit free-license clips trimmed to 9:16 in `src/broll/` (credits in `src/broll/CREDITS.md`). Shots are set in `SHOTS`.
- **Look:** a warm teal/gold film curve (cold and desaturated for the GTA / fake-reality lines), halation, a soft vignette and grain. The speaker footage gets a gamma lift (`A_ROLL_LIFT`), and a soft lower scrim keeps the captions legible.
- **Audio:** the original voice + music only (no added SFX), with light EQ and compression, normalized to −14 LUFS and faded out at the end.
