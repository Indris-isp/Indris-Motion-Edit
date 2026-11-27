# Livesites: VSL opening sample (10.6 s, 9:16)

- **Source:** Drive "V2 - cample 10 sec.mp4" (1080×1920, 29.97 fps, Kirti at the desk) → `src/v2_sample.mp4`.
- **Word timings:** `words.json` (faster-whisper medium.en).
- **Style:** `.claude/skills/livesites-motion-style` + `edits/livesites/brand/BRAND.md`.

## Beat plan
| beat | time | layout | spoken | visual |
|---|---|---|---|---|
| B1 | 0.00–3.16 | A-roll wide, slow push 100→104 % | Most developers send PDF brochures to every inquiry. | The lockup "Most developers send / **PDF** / brochures to every inquiry" glides in. A PDF card glides in beside her on "PDF", then copies cascade on "every inquiry". This echoes the brand's "static layers" concept. |
| B2 | 3.16–6.46 | SPLIT: Paper top with the phone, A-roll punch-in ×1.4 below | The buyer opens it, has a question, and there's nobody to answer. | The PDF arrives in the chat and opens (a static page). The buyer's question bubble rises, typing dots appear and vanish, then "Sent 11:48 PM · no reply" and "last seen 6:02 PM". |
| B3 | 6.46–9.52 | Full graphic on Paper | By the time your sales representative calls the next day, | "11:48 PM" rolls with motion blur to "10:30 AM / NEXT DAY", a timeline fills, then the "Calling the buyer…" card slides up |
| B4 | 9.52–10.56 | A-roll punch-in ×1.3 | the interest is gone. | A "Buyer interest" meter in the live gradient drains to grey (live → static). Slight desaturation. |

## Captions
Geist Semibold 54 px, lowercase, hard swaps on the word:
- **A-roll:** Ink text with no box, in the wall's negative space (beside the head in the wide shot, above the head in the punch-in). The footage is bright, so the reference's white captions become Ink.
- **Split:** a dark Ink pill on the seam.
- **Graphic:** a light pill under the graphic.

## Build
```
ffmpeg -i src/v2_sample.mp4 -q:v 2 <frames>/f%05d.jpg
node render.cjs <frames> <out> stills 0.45,1.6,...      # approval stills
python3 board.py <out> out/stills_board_v1.jpg
node render.cjs <frames> <out> all                      # every frame, after approval
```
Music is still to come from the user. After that, snap the beat changes to the kicks.
