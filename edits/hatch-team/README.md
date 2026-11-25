# "How to Build a Real Estate Team That Actually Produces": premium vertical clip

**Source:** Hatch Coaching / Real Estate Live, about 184 s, a single camera at 1920×1080 and 29.97 fps ([Drive](https://drive.google.com/file/d/13GDHNE-FjS8Okubp4mY8mzYfS3jpH5Yf/view)).

**Output:** `out/hatch_team_premium_1080x1920.mp4`, a 1080×1920 clip at 29.97 fps, **45.7 s** long, normalised to −14 LUFS.

The edit follows the house style in `.claude/skills/premium-short-form` (mode B, visual storytelling), and it keeps the client's choices from the Vice City v4/v5 edits:

- rise-in captions
- the letter effect on three keywords only
- no added SFX
- no end card

| File | What's in it |
|---|---|
| `analysis/transcript.md` | The full **word-by-word transcript**: 571 words with start/end times and confidence, in a readable version and as a word table. |
| `words.json` | The same words as data (the indices that `edit.py` uses). |
| `analysis/breakdown.md` | The **frame-by-frame breakdown**: the camera, burned-in graphics, behaviour events, the virtual angles, the angle map of the clip, and a per-second table. |
| `analysis/frames.csv` | One row per source frame (5,515 rows) with face, landmarks, yaw, motion, gesture, cut score, luma and audio. |
| `analysis/analyze_frames.py` | The script that produced `frames.csv`. |
| `edit.py` | The cut, virtual camera, caption removal, grade, captions and audio. |
| `scenes.html`, `scenes.js`, `scenes.cjs` | The designed scenes and overlays (rendered with headless Chromium). |

## 1. Why this clip

I scored candidate windows with the skill's rubric. The talk has three parts:

1. **0–77 s:** the thesis. It's abstract (ego, "dastardly dream", wartime/peacetime) and includes a stumble at 55–57 s.
2. **78–147 s:** the Matt story. It has concrete proof (a Connecticut team, great money, high per-agent productivity), an open loop ("what's the secret?" / "the most boring conversation"), and a vivid scenario: 25 people text you "are you alive? are you still in real estate?" It also has a list (show up, conversations, database) and a quotable thesis: "This is the blueprint. It's not a suggestion."
3. **149–178 s:** a recap. It's a weaker restatement of the thesis.

| Rubric item | The story window (78–147 s) |
|---|---|
| +3 number / surprising fact | "Teams exist because the leader has **ego**": I moved this hook to the front (from 0–7.6 s) |
| +2 relatable "you" scenario | Miss a meeting → 25 texts: "are you alive?" |
| +2 self-contained argument + quotable close | Ego → blueprint → three simple rules → "It's not a suggestion." |
| +1 per concrete noun | Connecticut, money, meeting, 25 people, texts, conversations, database |
| −3 needs earlier context | No, because the thesis line (44–50 s) is cut in as the bridge |

So the clip is the **story**, with the **best opening line moved to the front as the hook** and **one thesis line as the bridge**, closing on the thesis.

## 2. The shaped script (45.7 s)

| Beat | Output (s) | Line | Picture |
|---|---|---|---|
| Hook | 0.0–6.6 | "Real estate teams in their purest form, exist because the leader has **ego**." | Rack-focus opener with a title banner ("Why do real estate teams actually *exist?*"), then a CU punch-in on "ego" during his real lean-in |
| Bridge | 6.6–12.6 | "For a real estate team to function well, that ego has to be transformed into a **blueprint**." | MCU, then the designed blueprint scene: EGO breaks apart, "blueprint" assembles, an org chart draws on |
| Proof | 12.6–18.8 | "I have a buddy named Matt… runs this incredible team out of **Connecticut**, makes **great money**, high per-agent **productivity**." | MCU, then WIDE with three tags stacking in the headroom |
| Open loop | 18.8–23.4 | "What's the **secret** to your success?" / "Erik, this is going to be the most **boring** conversation that you've had." | CU → MCU → ECU; the colour drains to grey on "boring" |
| Rule 1 | 23.4–31.4 | "Number one, everybody agrees to **show up**. And if somebody is **not** there, every 25 people on the team text that person: *hey, are you alive? are you still in real estate?*" | WIDE + "RULE #1", then CU, then the phone scene: 25 texts count up and the two quotes land as highlighted bubbles |
| Rules 2–3 | 31.4–38.3 | "That's a **blueprint**." / "Everybody has X conversations per week… add friends to their database." | MCU, then WIDE, then the "The blueprint" board: rules 02 and 03 slide in and are checked on the spoken word |
| Turn | 38.3–42.0 | "They're just doing simple things **on repeat**." | MCU → CU with a follow pan through his head turn |
| Close | 42.0–45.7 | "This is **the blueprint.** It's **not** a suggestion. You have to do **this**." | A callback to the completed board with the stamp, then ECU → CU, and a 0.4 s fade |

These were cut:

- "in my experience"
- "I think that"
- "He's like" (before "number one")
- "Like, what do you mean? Hey, everybody shows up for every meeting", which repeats rule 1
- "right? That's a plan that everybody adheres to"
- the duplicate "they agree… X conversations"
- "that's really about it"
- the "if they don't… six figures" run
- the "It's a," stumble
- every pause longer than 0.4 s

The full cut list, with source in/out points, is printed by `python3 edit.py --plan`. The angle map is in `analysis/breakdown.md` §5.

## 3. Look

- **Captions:** the house animation. Run-in words in Inter Medium rise in. One amber Instrument Serif Italic keyword per beat, and red for "not". Only *ego*, *boring* and *repeat* assemble letter by letter. Captions sit at about 73 % of the height, and 110 px lower in WIDE shots so they clear his chin. The source's burned-in captions are inpainted per frame in all three colours (white, grey and orange).
- **Accent:** amber `#F7BA68` is the only accent. It ties to the REL orange in the footage.
- **Grade:** the house warm film curve, a gamma lift for the webcam, saturation ×1.06, halation, a vignette, film grain, and a soft lower scrim for the captions.
- **Scenes:** blueprint-grid world (blueprint, board, final) and a warm dark world (texts). They're built only from type, line drawing and a generic chat UI; there's no stock footage. Mixkit, the stock source used for Vice City, blocks automated access from this environment.
- **Audio:** the original voice only. Cuts are joined sample-exactly with 8 ms raised-cosine joins. Then a high-pass, a presence boost, gentle compression, −14 LUFS and a 0.4 s end fade.

## 4. Rebuild

The source isn't committed (it's 41 MB). Download it from Drive to `src/hatch_team.mp4`, or point `HATCH_SRC` at it.

```bash
cd edits/hatch-team
```

```bash
python3 edit.py --plan
```

```bash
node scenes.cjs
```

```bash
python3 edit.py
```

`python3 edit.py --still 5.5,30.0` writes quick stills. For a faster render, run `--range 0:456`, `--range 456:912` and `--range 912:1368` in parallel, then `python3 edit.py --mux`.

**To change the edit:**
- **Cut:** edit `SEGMENTS`, which holds word-index ranges from `analysis/transcript.md`.
- **Angles:** edit `SHOTS`, which lists a word, an angle and a push-in amount; add a shot to `FOLLOW` to make it pan with the face.
- **Captions:** edit `CHUNKS`.
- **Scenes:** edit the cue words in `scene_plan()`.

**Open item:** the transcript has Matt's surname as "Miali". That's Whisper's spelling, so the captions never show the surname. Confirm the spelling before adding it.
