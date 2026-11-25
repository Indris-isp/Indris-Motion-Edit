# "Real world vs Vice City" — premium vertical re-edit

`src/real_world__vice_city.mp4` (960×720, 4:3, 23 s talking head) → `out/vice_city_premium_1080x1920.mp4` (1080×1920, 24 fps, −14 LUFS).

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
| 2.8 | "it's nice out here, feels good" | Cut wide, slow push |
| 5.2 | "beautiful scenes, fresh air, birds chirping" | On the music drop: framed rounded card over blurred background, flash + whoosh |
| 8.8 | "makes you feel alive" | Punch-in close-up |
| 10.6 | "too many people are inside f*cking…" | Grade turns cold and desaturated |
| 12.1 | "GTA" | 146 % punch, shake, RGB split, flash, sub impact |
| 13.2 | "living a fake reality" | RGB split on "fake" |
| 14.7 | "instead of actually living their life" | Grade warms back up |
| 16.9 | "…put on this earth to live" | Slow push from wide |
| 19.2 | (music tail, was black) | Blurred freeze + "ON THIS EARTH / *to live.*" end card on the beat, fade out |

- **Captions:** the original burned-in captions are inpainted away per frame (`remove_captions`). New word-by-word pop captions come from `words.json` (word timings read off the original captions), in Inter ExtraBold with key words in gold Instrument Serif Italic. The swear word is shown as "f*cking"; the audio is unchanged. Edit `DISPLAY` / `KEYS` / `CHUNKS` to change this.
- **Look:** a teal-shadow / golden-highlight film curve with lifted blacks, warm halation, vignette and animated film grain (`WARM` / `COLD` in `grade`).
- **Audio:** the original voice + music, light presence EQ and compression, synthesized whooshes and impacts, loudness-normalized to −14 LUFS.
- **Shots and hits:** `SHOTS` (zoom keyframes per shot) and `HITS` (flash / RGB split / shake) at the top of `edit.py`.
