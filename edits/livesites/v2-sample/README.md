# Livesites: VSL opening sample (10.6 s, 9:16)

> **v2 (current): `scenes3d.html`.** The client rejected the v1 look ("don't use this kind of thing": the big title and flat cards over the talking head), and asked for premium motion like the Claude/Apple reference.
>
> In v2:
> - The A-roll is **clean, with captions only**.
> - Every graphic is a **full-screen, lit three.js world**: a Night background, Orchid used as rim light and glow, a perspective grid floor, 1-frame white flash cuts, and constant camera drift.
>   - **Brochure world** (1.10–3.16): a 3D brochure glides in, then copies peel off, curl and fly out "to every inquiry".
>   - **3D phone world** (3.16–6.46, split over the A-roll): the PDF lands in the chat and opens. The question floats out of the screen in 3D. No reply comes, and the purple light dies.
>   - **Night → morning** (6.46–9.52): a planet horizon in the brand gradient rises while the time rolls from 11:48 PM to 10:30 AM. The sky turns to Paper, and a glass call card slides up.
>
> Board: `out/stills_board_v2.jpg`. v1 (`scenes.html`, `out/stills_board_v1.jpg`) is kept for reference only.


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
