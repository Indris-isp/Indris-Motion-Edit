# "Find income first": premium vertical clip from the How They Started episode

**Source:** the full 58:12 multi-camera episode (Drive file `1dqFfnBb7s12Ahg14_69HrajskcNgOF8d`, 1280×720, 23.976 fps). The repo keeps only what this clip uses:
- `src/excerpt_3080-3156.mp4` + `src/excerpt_audio.flac`: source 51:20–52:36, frame-exact. The episode's own camera cuts land at the same source times in the excerpt, to the millisecond.
- `src/host_react_3202.mp4`: source 53:22–53:26. This is the side-by-side two-shot, used for one host-reaction cutaway.
- `src/broll/`: 5 Mixkit clips (see `src/broll/CREDITS.md`).

**Output:** `out/income_first_1080x1920.mp4`, 1080×1920, 23.976 fps, 50.8 s, −14 LUFS.

To render the clip:

```bash
cd edits/income-first
```

```bash
python3 edit.py
```

To check a few frames quickly, run `python3 edit.py --still 1.0,12.0,33.9`, which writes `out/still_*.png` (times are output seconds). The script needs only ffmpeg, numpy and Pillow. It uses the same render engine and look as `edits/gambling`.

Built with the `premium-short-form` skill, **mode B (visual storytelling)**.

## 1. Analysis of the full episode

| File | What it is |
|---|---|
| `../gambling/analysis/shots_full.csv` | A shot-by-shot breakdown of the whole episode: 461 cuts, each classified by camera angle (HOST, G_FRONT, G_FRONT_CU, G_SIDE, G_SIDE_CU, SPLIT, INSERT). Reference frames for each angle are in `../gambling/analysis/camera_angles.jpg`. |
| `../gambling/analysis/transcript_full.md` / `transcript_words.json` | Word-timed transcript of the whole episode (`small.en`), with each line tagged by the angle on screen. |
| `analysis/transcript_full_medium.md` / `.json` | The whole episode re-transcribed with `medium.en`, as the skill specifies. |
| `analysis/window_words_medium.json` | The clip window (51:20–52:36) transcribed with `medium.en`, word by word. |
| `words_src.json` | The words the captions use: the window words inside the kept segments, with three Whisper timing errors fixed by hand ("If" moved to 51:44.86; "from" and "especially" dropped because their audio is cut). |

**Important:** the source is the *finished* episode, not the separate camera feeds. At any moment only the angle the episode's editor chose exists. So "multiple angles" means two things:
- choosing a window where the episode itself cuts between cameras;
- adding virtual angles on top: punch-ins, reframes, cards, and a host cutaway taken from the episode's two-shot.

## 2. Clip selection

Every interviewer question in the episode was scored with the skill's rubric (`script-timing-psychology.md` §3, `SKILL.md` step 2). The six strongest:

| Candidate | Source | Angles in the window (episode) | Score | Verdict |
|---|---|---|---|---|
| **"What advice would you give people who want to get into acting?" → "Find something that brings you income first… This industry is not going to take care of you."** | 51:24–52:29 | HOST 12 s · G_FRONT 36 s · G_SIDE 18 s (6 cuts) | **16** | **Chosen.** A contrarian answer in the first 3 s (+3). A "you" scenario (+2). A list of three: real estate / stock market / full-time job (+2). A metaphor: starving actor → lottery ticket. An emotional turn: "I've seen actors make their families suffer" (+2). A hard conclusion that stands on its own (+2). 5+ visual nouns (+5). |
| "Eight years and over 100 IMDb credits. What do you owe that to?" | 54:51–56:28 | HOST 23 s · G_FRONT 63 s · G_SIDE_CU 13 s | 14 | A number hook and a great thesis ("nobody's going to know what you can do unless you show them"). But it's 97 s with a rambling middle, 63 s of it on one angle, and it's already the episode's cold open. |
| "What would you say your superpower is?" | 43:08–43:49 | G_FRONT, G_SIDE_CU, SPLIT, HOST | 12 | Tight and quotable ("the worst thing that can happen is they say no"), but the ending ("pretty cool") is soft. **Next best**; it would make a good 40 s clip. |
| "There's a lot of no's in between the yeses…" (acting is like gambling) | 25:15–26:22 | 5 angles | 16 | Already cut as `edits/gambling`. |
| "They light you on fire. What are you thinking?" | 22:35–23:49 | 4 angles | 12 | Very visual, but a process description; the close is weak ("I wanna do it again"). |
| "How you took your discipline from military into acting" | 24:12–25:13 | G_FRONT, G_SIDE, HOST | 10 | Solid, but no hook line or payoff. |

The chosen clip meets the brief: it **opens on the interviewer's question** and **ends on the guest's conclusion** ("This industry is not going to take care of you in that way."). The host's "100%" after it is not used.

## 3. The shaped transcript (output 0:00–0:50.8)

> **HOST:** And what message would you give people who are watching this and who want to get into acting? ~~[producing, putting together their own feature film, what kind of advice would you give them about getting into it?]~~
> **GUEST:** So my advice to anybody who wants to play this game is find something that brings you **income first**. ~~[uh]~~ If you can find a way to have those checks rolling in ~~[from whatever it is,]~~ you get into real estate, you get in the stock market, ~~[whatever it is,]~~ you find a full-time job, ~~[whatever,]~~ that brings the money in, then pursue this. Because if you are going to be what I call one of those starving actors, I mean, you're better off buying a lottery ticket. *(host, audio only: "Yeah.")* So don't do that to yourselves. Don't do that to your families. ~~[especially if you've got families.]~~ I've seen actors make their families suffer, pursuing their dream, we'll call it. No, don't do that. **This industry is not going to take care of you in that way.**

- **Hook:** the interviewer's question is trimmed to 5.0 s. It ends at a real pause after "acting" (−51 dB), so it sounds like a finished question. A Whisper pass over the cut audio punctuates it "…get into acting?".
- **Segments:** 21 kept segments (`SEGMENTS` in `edit.py`). Every cut is snapped to an energy dip measured from the waveform, not to Whisper's word times, which run long across pauses. Every pause over 0.3 s inside the answer is cut down to 0.12 s, and each cut gets a 10 ms fade.
- **QA:** the rendered cut was re-transcribed with `medium.en` and reads as one continuous answer. This pass caught a clipped "you" at 51:50.1 and an "uh" at 51:44.3, and both were fixed.

## 4. EDL (output seconds; source time; layout; zoom over the shot; words)

| # | Out | Source | Layout / angle | Zoom | Words |
|---|---|---|---|---|---|
| 1 | 0.00 | 51:24.3 | HOST in a card under the title "The acting advice / *nobody wants to hear*" | 1.12→1.03 (settle) | And what **message** would you give people |
| 2 | 1.76 | 51:26.1 | HOST card, punched in | 1.26→1.30 | who are watching this |
| 3 | 3.09 | 51:27.4 | HOST full-screen | 1.10→1.16 | and who want to get into **acting**? |
| 4 | 4.98 | 51:35.4 | G_FRONT | 1.00→1.05 | So my **advice** to anybody who wants to **play this game** |
| 5 | 8.19 | 51:38.7 | G_FRONT punch-in (hides the pause cut) | 1.26→1.31 | is find something that brings you |
| 6 | 11.53 | 51:42.1 | G_FRONT tight + flash | 1.52→1.57 | **INCOME FIRST** (letters assemble) |
| 7 | 13.16 | 51:44.8 | G_SIDE (the episode's own cut) | 1.00→1.06 | If you can find a way to have those |
| 8 | 16.27 | 51:48.2 | B-roll card: money counter | 1.00→1.05 | **checks rolling in** |
| 9 | 17.28 | 51:50.1 | B-roll card: house-key handover | 1.00→1.06 | you get into **real estate** |
| 10 | 18.57 | 51:51.4 | B-roll card: stock chart (rising) | 1.00→1.07 | you get in the **stock market** |
| 11 | 19.95 | 51:53.6 | Full-bleed vertical B-roll: hands typing | 1.00→1.08 | you find a **full-time job** |
| 12 | 22.11 | 51:56.4 | G_SIDE punch-in | 1.30→1.35 | that brings the **money** in, then |
| 13 | 24.95 | 51:59.4 | G_FRONT (the episode's cut) | 1.06→1.09 | **pursue** this |
| 14 | 26.43 | 52:01.0 | G_FRONT | 1.00→1.05 | Because if you are going to be what I call one of those |
| 15 | 29.71 | 52:04.3 | B-roll card: empty wallet | 1.00→1.07 | **starving** (red) **actors** |
| 16 | 31.14 | 52:05.8 | G_FRONT punch-in | 1.30→1.36 | I mean, you're better off buying a |
| 17 | 33.65 | 52:08.3 | **Designed lottery ticket** over the blurred guest; pop + flash + shake | 1.00→1.04 | **lottery ticket** (letters assemble) + host "Yeah." |
| 18 | 34.82 | 52:09.8 | G_SIDE (the episode's cut) | 1.00→1.04 | So **don't** (red) do that to yourselves |
| 19 | 36.69 | 52:11.6 | G_SIDE punch-in | 1.30→1.33 | Don't do that to your |
| 20 | 37.53 | 52:12.5 | G_FRONT tight (the episode's cut, 0.4 s) | 1.40→1.42 | **families** |
| 21 | 37.92 | 52:13.9 | G_FRONT; the grade turns cold | 1.00→1.05 | I've seen actors make their |
| 22 | 40.95 | 52:17.2 | G_FRONT tightest; RGB hit | 1.50→1.56 | families **suffer** (red) |
| 23 | 42.84 | 52:19.2 | **HOST reaction cutaway** (two-shot, 53:23) | 1.06→1.12 | pursuing their **dream**, we'll call it |
| 24 | 44.88 | 52:22.6 | G_FRONT | 1.14→1.17 | No, **don't** (red) do that |
| 25 | 46.01 | 52:24.6 | G_FRONT; the grade warms back | 1.00→1.06 | This **industry** is not going to |
| 26 | 48.36 | 52:27.0 | G_FRONT punch-in, held to the end | 1.32→1.40 | **take care of you** in that way |

**Angle mix:**
- 3 recorded angles (HOST, G_FRONT, G_SIDE).
- Each angle at 2–4 framings: wide, punch-in, tight, card.
- A 4th angle: the host reaction cutaway from the episode's two-shot.
- 5 B-roll beats and 1 designed graphic.
- 26 shots in 50.8 s, about 2.0 s per shot; the longest hold is 3.3 s.
- Every shot start is aligned to the episode's own camera cuts, so a reframe always matches the angle on screen.
- Interviewer on screen: 0–5.0 s (the question) and 42.8–44.9 s (the reaction).

## 5. Look

- **Captions:** the same system as `edits/gambling`.
  - Run-in words are Inter Medium and rise in.
  - One keyword per beat is set in large gold Instrument Serif Italic.
  - Negatives (starving, don't, suffer) are red.
  - "income" and "lottery" assemble letter by letter.
- **Title banner (A8):** "The acting advice / *nobody wants to hear*" is on screen while the host is in the card (0–3.05 s). It ends at the full-screen punch-in so it never sits over his face.
- **Lottery ticket:** drawn in code (`make_ticket()`), because Mixkit has no lottery footage. It has cream paper with a gold rim, a perforated stub ("No. 0451"), number balls and a silver "SCRATCH HERE" panel. It pops in tilted and drifts.
- **Grade:** a warm teal/gold film curve, halation, vignette, grain and a caption scrim. It turns cold and desaturated for "I've seen actors make their families suffer… don't do that", then warms back for the conclusion.
- **Framing:** the face centres were measured on this window's frames (G_FRONT 715/190, G_SIDE 665/195, HOST 650/190, host two-shot 945/200), so punch-ins up to 1.57× keep the whole face in frame.
- **Audio:** original dialogue only. Light EQ and compression, −14 LUFS, and no music, SFX or CTA card, following the client's notes on the earlier edits.
