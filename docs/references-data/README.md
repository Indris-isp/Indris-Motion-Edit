# Reference data for the premium-short-form skill

The raw measurements behind `.claude/skills/premium-short-form/references/`.

| Path | What it is |
|---|---|
| `transcripts/V01–V15_words.json` | faster-whisper `medium.en` segments with per-word `s`/`e` times (V09 is music only) |
| `stats.json` | Per video: length, the cut/visual-change times used, shot-length stats, words/s |
| `palettes.json` | 7-cluster k-means palette per video (40 frames each) + the most saturated "accent" cluster |
| `sheets/sheet_VNN_*.jpg` | 2 fps contact sheets with timestamps, every video |
| `sheets/anim_*.jpg` | 10 fps strips of key animations (count-ups, letter scatter, glitch, Polaroid, light leak, background swap…) |
| `sheets/frame_war_all_slides.jpg` | The 4 Frame War carousel slides at 1 fps (board, entries 1–3) |

## Video IDs → Drive files
| ID | Drive folder / file |
|---|---|
| V01 | Podcats / "Just sat down with @pierree…" |
| V02 | Podcats / "From Klickpin.com- Refresh these budget-friendly self-love quote tips…" (Bryan Johnson sleep before/after) |
| V03 | Podcats / "POV_ We edit your podcast intro…" |
| V04 | Podcats / "Comment "Jack" for access to the full video podcast…" |
| V05 | Pattern / "The best podcast clips don't just make a conversation look good… Catherine Goetze…" |
| V06 | Pattern / "Storytelling edit on a conversation about red light therapy…" |
| V07 | Pattern / "From Klickpin.com- Timeless vision board ideas…" (alcohol gene, raw vs final) |
| V08 | Pattern / "…nautical decor tips… (1).mp4" (Frame War entry 1) |
| V09 | Pattern / "…nautical decor tips….mp4" (Frame War voting board) |
| V10 | Pattern / "…nautical decor tips… (3).mp4" (Frame War entry 3) |
| V11 | Pattern / "…nautical decor tips… (2).mp4" (Frame War entry 2) |
| V12 | Pattern / "Recent podcast edit for a client…" |
| V13 | Pattern / "3012b3a90bb35c8b72ac2666a92815d4_720w.mp4" |
| V14 | Pattern / "From Klickpin.com- Need fresh inspiration… herb garden ideas…" |
| V15 | Pattern / "From Klickpin.com- Timeless fall outfit ideas…" |
