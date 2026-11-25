# "Acting is like gambling": premium vertical clip from the How They Started episode

**Source:** the full 58:12 multi-camera episode (Drive file `1dqFfnBb7s12Ahg14_69HrajskcNgOF8d`, 1280×720, 23.976 fps). Only the 67 s excerpt this clip uses is kept in the repo: `src/excerpt_1515-1582.mp4` + `src/excerpt_audio.flac`, source 25:15–26:22.

**Output:** `out/gambling_premium_1080x1920.mp4`, 1080×1920, 23.976 fps, 53.6 s, −14 LUFS.

```bash
cd edits/gambling
```

```bash
python3 edit.py
```

To check a few frames quickly, run `python3 edit.py --still 1.0,22.9`, which writes `out/still_*.png` (times are output seconds). The script only needs ffmpeg, numpy and Pillow. The fonts come from `video/fonts/`.

## 1. Analysis of the full episode

| File | What it is |
|---|---|
| `analysis/transcript_words.json` | A word-by-word transcript of the whole episode (10,459 words, each with start and end in seconds). Made with faster-whisper `small.en` and `word_timestamps`. |
| `analysis/transcript_full.md` | The same transcript as readable lines. Each line is tagged with the camera angle on screen at that moment, so you can tell who is speaking. |
| `analysis/shots_full.csv` | A shot-by-shot breakdown of the whole episode: 461 cuts (ffmpeg scene detection at full frame rate), with each shot classified by camera angle (k-means on frames sampled at 2 fps, checked by eye). |
| `analysis/camera_angles.jpg` | One reference frame for each angle. |
| `words_src.json` | The clip window re-transcribed with `medium.en`, which gives tighter word timing. These are the words the captions use. |

**Camera angles in the episode** (share of runtime):

| Angle | What it is | Shots | Time |
|---|---|---|---|
| `HOST` | Interviewer, brick wall, medium shot | 86 | 10.4 min |
| `G_FRONT` | Guest, straight-on medium shot (bookshelf, plant) | 168 | 24.2 min |
| `G_FRONT_CU` | Guest, straight-on close-up | 22 | 4.1 min |
| `G_SIDE` | Guest, blue-lit 3/4 side angle (city-window monitor) | 101 | 12.6 min |
| `G_SIDE_CU` | Guest, side angle close-up | 24 | 2.9 min |
| `SPLIT` | Side-by-side two-shot (guest left, host right) | 53 | 3.7 min |
| `INSERT` | Intro graphics / show posters (cold open only) | 7 | 0.2 min |

The median shot is 6.6 s long. The episode edit often holds one shot for 10–13 s, so the vertical clip adds punch-ins inside those holds. No picture in the clip holds longer than about 3.8 s.

## 2. Clip selection

The candidates were scored with the skill's rubric:

| Candidate | Source | Verdict |
|---|---|---|
| **"I want to relate it to gambling"** | 25:15–26:21 | **Chosen.** It opens on a host question and moves through a surprising metaphor, the chase for the high, rejection and thick skin, then lands on a quotable thesis with a number ("99% no's… that 1% is the rush everybody's searching for"). It needs no earlier context, it's universal ("you" language), and it covers 5 camera angles in the source. Every image in it can be shown on screen: chips, jackpot, roulette, rush. |
| "8 years, over 100 IMDb credits" | 54:56–56:28 | It has a number hook in the question and a strong close ("show them what you can do"), but it runs 92 s with a rambling middle (Facebook pages, casting sites). It's also already used in the episode's cold open. |
| "They light you on fire" | 22:35–23:49 | Very visual, but the close ("I wanna do it again") is weaker. |
| "Find income first / lottery ticket" | 51:24–52:24 | Strong contrarian advice, but it's mostly one angle. |

## 3. The shaped transcript (output 0:00–0:53.6)

> **HOST:** There's a lot of no's in between the yeses, what's that experience been like over the years?
> **GUEST:** I want to relate it to gambling. ~~[host: "Okay."]~~ That constant search for that feeling of high. You're searching for that high, because when you get a big win, when you nail and book that production, that role, it releases all these endorphins and you're like, *yeah!* And then you do the job, it's over, you're like, ah, now you got to chase it again. And you're just constantly chasing that high. ~~[host: "Mm-hmm." / "So,"]~~ And it's frustrating, it really is, and you have to be somebody who is consistent, ~~[pause]~~ determined, ~~[pause]~~ persistent, because this is an industry that is ~~[pause]~~ full of rejection. ~~[host: "Oh yeah."]~~ And if you don't have thick skin, if you can't take it, this is not the industry for you. ~~[because you're right that]~~ You're gonna get 99% no's, and then that 1% one is like the rush that everybody's searching for.

The clip starts at "there's a lot of no's", which drops the preamble "And now you getting into acting and going through the audition process and obviously". That way the first words on screen are already the hook. There are 9 kept segments (`SEGMENTS`), and every cut was snapped to a silence in the waveform. Each cut gets a 10 ms fade.

## 4. EDL (output seconds; source time in brackets)

| # | Out | Source | Words | Angle / layout | Caption (keyword) | Move / hit |
|---|---|---|---|---|---|---|
| 1 | 0.00 | 25:19.6 | there's a lot of no's / in between the yeses | HOST in a 4:5 card under the title "Why acting is like *gambling*" | **NO'S** (red), **YESES** | Card pops in, zoom settles 112→100% |
| 2 | 3.78 | 25:23.4 | what's that experience been like over the years? | HOST card, punched in | **EXPERIENCE**, **YEARS** | Punch-in 130% |
| 3 | 6.99 | 25:26.6 | I want to relate it to | G_FRONT | | Push 102→107% |
| 4 | 8.08 | 25:27.7 | gambling / that constant search | B-roll, full-bleed: all-in on chips | **GAMBLING** (letters assemble), **CONSTANT SEARCH** | Flash on the cut. The host's "Okay" is removed under the B-roll |
| 5 | 9.84 | 25:30.7 | for that feeling of high | G_FRONT_CU | **HIGH** | |
| 6 | 11.80 | 25:32.7 | you're searching for that high | SPLIT restacked: guest over host | **HIGH** | Shows the host listening |
| 7 | 13.80 | 25:34.7 | because when you get a | G_FRONT | | |
| 8 | 15.36 | 25:36.2 | big win | B-roll card: jackpot celebration | **BIG WIN** | Card pop + flash |
| 9 | 16.36 | 25:37.2 | when you nail and book that production | G_FRONT, tight | **NAIL**, **PRODUCTION** | Punch-in 132% |
| 10 | 19.44 | 25:40.3 | that role | G_FRONT, wide | **ROLE** | |
| 11 | 20.60 | 25:41.5 | it releases all these like endorphins and you're like | G_SIDE | **ENDORPHINS** | |
| 12 | 22.69 | 25:43.6 | YEAH! | G_SIDE wide, 1:1 card (both fists in frame) | **YEAH!** (oversized pop) | Flash + RGB split + shake |
| 13 | 23.94 | 25:44.8 | and then you do the job, it's over, you're like ah | G_SIDE, tight | **THE JOB**, **OVER** | Punch-in 126% |
| 14 | 26.89 | 25:47.8 | now you got to chase it again | G_FRONT | **CHASE IT AGAIN** | |
| 15 | 28.64 | 25:49.5 | and you're just constantly chasing that high | B-roll card: roulette spinning | **CHASING THAT HIGH** | Card pop |
| 16 | 30.64 | 25:53.1 | and it's frustrating, it really is | G_FRONT, close | **FRUSTRATING** (red) | Grade turns cold |
| 17 | 32.14 | 25:54.6 | and you have to be somebody | G_FRONT | | |
| 18 | 33.63 | 25:56.1 | who is consistent | G_SIDE | Gold pill: CONSISTENT | Pills stack one per word |
| 19 | 36.38 | 25:59.8 | determined | G_SIDE, 122% | Pill: DETERMINED | Jump cut hidden by the punch-in |
| 20 | 37.22 | 26:01.0 | persistent | G_SIDE, 144% | Pill: PERSISTENT | Tighter again |
| 21 | 38.02 | 26:02.4 | because this is an industry that is | G_SIDE | **INDUSTRY** | |
| 22 | 40.64 | 26:05.4 | full of rejection | G_SIDE, tight | **REJECTION** (red) | RGB glitch on "rejection" |
| 23 | 41.94 | 26:07.4 | and if you don't have thick skin, if you can't take it | G_FRONT | **THICK SKIN**, **CAN'T** (red) | |
| 24 | 44.53 | 26:10.0 | this is not the industry for you | G_FRONT, tight | **FOR YOU** | Punch-in 134% |
| 25 | 46.86 | 26:14.0 | you're gonna get 99% no's | G_FRONT | Giant **99%** count-up, **NO'S** (red) | Count lands on "99" |
| 26 | 49.68 | 26:16.9 | and then that 1% | G_FRONT, tight | Giant gold **1%** | Flash; grade warms back |
| 27 | 50.63 | 26:17.8 | one is like the rush | B-roll card: golden chips falling | **THE RUSH** (letters assemble) | Card pop |
| 28 | 52.33 | 26:19.5 | that everybody's searching for. | G_FRONT, 120% | **SEARCHING FOR** | Holds on the guest's conclusion; 0.3 s fade |

**Angle mix:** 5 source angles (HOST, G_FRONT, G_FRONT_CU, G_SIDE, SPLIT). Each is also used at 2–3 framings (wide / punch-in / card), plus 4 B-roll beats. That's 28 shots in 53.6 s, about 1.9 s per shot.

## 5. Look

- **Captions:** the same system as `edits/vice-city`. Words are Inter Medium and rise in (they start low and blurred, then slide up, fade in and sharpen). One keyword per beat is set in large gold Instrument Serif Italic, and negative words (no's, frustrating, rejection, can't) are red. "Gambling" and "rush" assemble letter by letter. The list "consistent / determined / persistent" is shown as stacked gold pills (scene A5). The numbers are a giant Inter ExtraBold count-up: white 99%, then gold 1%.
- **Title banner (A8):** "Why acting is like *gambling*" is on screen for the host's whole question.
- **Grade:** a warm teal/gold film curve, halation, vignette, grain and a caption scrim. It cools and desaturates over the frustration and rejection beats, then warms back on "1%" (the payoff).
- **Audio:** only the original dialogue. Light EQ and compression, −14 LUFS, and no music or SFX, to match the client's last notes on the vice-city edit.
- **No end card / CTA**, following the vice-city v4 feedback. To add one, append a "Comment 'RUSH' for the full episode" card after the final line.
