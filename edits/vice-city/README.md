# "Real world vs Vice City" — premium vertical re-edit

Follows the house style in `.claude/skills/premium-short-form` (mode B, visual storytelling).

`src/real_world__vice_city.mp4` (960×720, 4:3, 23 s talking head) → `out/vice_city_premium_1080x1920.mp4` (1080×1920, 24 fps, 21.8 s, −14 LUFS).

```bash
cd edits/vice-city
```

```bash
python3 edit.py
```

Quick frames: `python3 edit.py --still 5.5,12.1` writes `out/still_*.png`. Needs only ffmpeg, numpy and Pillow; fonts come from `video/fonts/`.

## What the edit does

| Time | Line | Treatment |
|---|---|---|
| 0.0 | "you enjoy the real world" | Zoom-settle open (134 % → 114 %), warm grade |
| 1.5 → 2.6 | (pause) | Dead air removed: jump cut hidden by a punch-out, audio crossfade |
| 2.6 | "it's nice out here, feels good" | Wide, slow push |
| 5.2 | "beautiful scenes" / "fresh air" / "birds chirping" | On the music drop: white Polaroid card over a blurred background (flash + whoosh), and each noun gets its own crop of the scenery |
| 8.8 | "makes you feel alive" | Punch-in close-up |
| 10.6 | "too many people are inside f*cking…" | Grade turns cold and desaturated |
| 12.1 | "GTA" | 146 % punch, shake, RGB split, flash, sub impact |
| 13.2 | "living a fake reality" | RGB split on "fake" |
| 14.7 | "instead of actually living their life" | Grade warms back up |
| 16.9 | "…put on this earth to live" | Slow push from wide |
| 19.2 | (music tail, was black) | Blurred freeze + "ON THIS EARTH / *to live.*" on the beat, then the CTA pill `Comment "LIVE" if you agree`, fade out |

- **Captions:** the original burned-in captions are inpainted away per frame (`remove_captions`). New captions come from `words.json` (word timings read off the original captions). Run-in words are Inter Medium and pop 3 frames early. One giant keyword per beat is set in gold Instrument Serif Italic and animates 0→112→100 %, white→gold, with a glow. Swear and negative words are red ("f*cking", "fake reality"); the audio is unchanged. Change this in `CHUNKS` / `DISPLAY`. Times in the table are source times; after the jump cut, the output runs about 1.1 s earlier.
- **Look:** a teal-shadow / golden-highlight film curve with lifted blacks, warm halation, vignette and animated film grain (`WARM` / `COLD` in `grade`).
- **Audio:** the original voice + music, light presence EQ and compression, synthesized whooshes and impacts, loudness-normalized to −14 LUFS.
- **Shots and hits:** `SHOTS` (zoom keyframes per shot) and `HITS` (flash / RGB split / shake) at the top of `edit.py`.
