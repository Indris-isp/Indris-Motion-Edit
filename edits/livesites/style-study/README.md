# Livesites: style study (caption reel + animation reel)

The client wants the **captions** of reference 1 and the **animation** of reference 2. The client's scripts are in the Google Doc "Livesites Scripts": Ad Script #1 and #2, the VSL, the long vertical demo, and the demo questions.

| file | what's in it |
|---|---|
| `01_caption_reference.md` | Caption reel (42.6 s, 9:16): the clean transcript, the **word-by-word transcript** (179 words, timed, corrected), a **frame-accurate shot list** (17 shots), the **caption log** (all 101 on-screen chunks, with timing and placement), the caption rules, and the B-roll/graphics rules |
| `02_animation_reference.md` | Animation reel (12.9 s, 16:9): the **beat grid** (108 BPM, where every cut lands), the **frame-by-frame breakdown** (f0–385), and the animation rules |
| `03_applying_to_livesites.md` | How each reference beat maps onto Livesites Script #1, plus the caption spec and motion spec to build with |
| `sheets/` | Timestamped contact sheets (caption reel at 5 fps; animation reel at 10 fps, plus every frame of the 2 key transitions) and full-res caption-placement examples |
| `data/` | Per-frame metrics CSVs (luma / saturation / motion / cut score), the raw Whisper word JSON, and the scripts that made them |

The rules are also saved as the project skill `.claude/skills/livesites-motion-style/`, so future edits apply them automatically.

The reference videos themselves are not committed (they're third-party Instagram downloads). Re-upload them if a new session needs to re-run the analysis:
```
python3 data/metrics.py <video> out.csv <w> <h> <fps>
```
