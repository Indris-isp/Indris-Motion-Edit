# "At 15, she charged her own dad interest": premium vertical clip from the Talk About It episode with Toya Simone

**Source:** the full 47:12 episode (Drive file `1yO6GsFf0sDL7B1vzwFWKxOwka8DyxnJD`, 1920×1080, 23.976 fps, three cameras). Only the 124 s excerpt this clip uses is kept in the repo: `src/excerpt_725-849.mp4` + `src/excerpt_audio.flac`, source 12:05–14:09.

**Output:** `out/dad_interest_premium_1080x1920.mp4`, 1080×1920, 23.976 fps, 61.6 s, −14 LUFS.

```bash
cd edits/dad-interest
```

```bash
python3 edit.py
```

To check a few frames quickly, run `python3 edit.py --still 1.0,22.9`, which writes `out/still_*.png` (times are output seconds). To render faster, run 4 parts in parallel with `python3 edit.py --range 0:370` (then `370:740`, `740:1110`, `1110:1478`), then join them with `python3 edit.py --mux`. The script only needs ffmpeg, numpy and Pillow. The fonts come from `video/fonts/`.

## 1. Analysis of the full episode

| File | What it is |
|---|---|
| `analysis/transcript_words.json` | A word-by-word transcript of the whole episode (7,614 words, each with start and end in seconds). Made with faster-whisper `small.en` and `word_timestamps`. |
| `analysis/transcript_full.md` | The same transcript as readable lines. Each line is tagged with the camera on screen at that moment (k-means on 1 fps thumbnails). |
| `analysis/scene_cuts.txt` | The 234 camera switches in the episode (ffmpeg scene detection). |
| `words_src.json` | The clip window re-transcribed with `medium.en`, which gives tighter word timing. These are the words the captions use. |

The episode has three cameras: **GUEST** (Toya, yellow jacket, grey couch: 60% of the runtime), **HOST** (red curtain: 16%) and **WIDE** (two-shot with the show logo: 4%). The rest is mixed or transitional. There is only one guest angle, so the clip builds its MCU and CU as punch-ins (110–150%) on that camera.

## 2. Clip selection

The candidates were scored with the skill's rubric:

| Candidate | Source | Verdict |
|---|---|---|
| **"I charged my dad interest"** | 12:07–14:06 | **Chosen.** It has a number hook ("I'm gonna give you $20, but you gotta pay me back with $5 interest") and a funny, relatable family scene (a 15-year-old counting her savings while her dad asks for $20). It has a punchline ("he didn't give me back my interest… come on"), a big host laugh, and a thesis close ("that was my first business, but I didn't know it was called entrepreneurship"). Every noun can be shown: allowance, books, the middle of the month, a loan book, $20, $5. It needs no earlier context. |
| "The 85-cent raise" | 23:06–24:11 | A relatable rant with numbers (85 cents, 25% tax, the MetroCard up 10 cents, rent up $50). But the maths gets muddled and the ending is "this is some bs", so there's no clean thesis. |
| "Men apply with two missing qualifications" | 40:44–41:50 | A strong contrarian hook ("men have more audacity"), but it's a generalisation about gender with no story beat. |
| "Free textbooks, no value" | 3:43–5:50 | A good story (a classmate throws the free maths book), but it runs over 2 minutes and the thesis ("there's always value in education") is soft. |

## 3. The shaped transcript (output 0:00–1:01.6)

The hook is moved to the front, followed by the host's reaction. Then the story plays from the start.

> **GUEST (13:04):** I'm gonna give you **$20**, but you gotta pay me back with **$5 interest**.
> **HOST:** Wow, I like that.
> **GUEST (12:07):** When I was 15, ~~[that was the age I migrated to America, as I said]~~ my dad, he would give me ~~[pause]~~ allowance. ~~[because]~~ I wasn't into shopping ~~[or anything that was girly at the time]~~, I would just buy books. Therefore I saved most of my money. When my friends and my family, they ran out of money ~~[pause]~~ in the middle of the month, they came to me for money. Guess what I did? ~~[host: "You gave it to them?"]~~ Yeah, I gave it to them, but they had to pay interest. *(host laughs)* ~~[I remember my dad, he's the one that gave me allowance.]~~ I remember my dad, ~~[he was going to work and he came,]~~ he knocked on my room door. He said, "Latoya, I need $20." ~~[So]~~ I went in my drawer and I started counting all my money. He said, "Wait, you still have all those money?" ~~[I said yes… — this is the hook, already played]~~ ~~[host: "Wow, I like that"]~~ So I gave him $20. The next time he got paid, he's giving me allowance, I said, "Daddy, remember you owe me $20 and plus $5 for interest." And he gave me my allowance and the $20, but he didn't give me back my interest. I'm like, come on. ~~[the brother and the friends at school, 26 s]~~ So that was my first entrepreneurial business, but I didn't know it was called entrepreneurship.

There are 15 kept segments (`SEGMENTS`). Every join was checked by re-transcribing the joined audio with `medium.en` until it read word-perfect. Joins on a pause get a 10 ms fade. The host laugh gets an 80 ms tail and the final word a 150 ms tail.

## 4. EDL (output seconds; source time in brackets)

| # | Out | Source | Words | Picture | Caption / graphic | Move / hit |
|---|---|---|---|---|---|---|
| 1 | 0.00 | 13:04.2 | I'm gonna give you $20 | GUEST in a 4:5 card under the title "At 15, she charged her own dad *interest*" | Giant white **$20** counts up and lands on "20" | Card pops in, zoom settles 110→100%, flash on "20" |
| 2 | 1.85 | 13:06.0 | but you gotta pay me back with $5 **interest** | Card, punch-in to 128% | Giant gold **+$5**; **INTEREST** assembles letter by letter | Flash + shake on "$5" |
| 3 | 4.45 | 13:09.6 | Wow, I like that | HOST | **THAT** | Push 100→106% |
| 4 | 6.15 | 12:07.2 | When I was 15 | GUEST wide | Giant gold **15** counts up | Flash on "15" |
| 5 | 7.64 | 12:12.4 | my dad, he would give me | GUEST, 132% | **DAD** | Punch-in |
| 6 | 9.23 | 12:15.1 | allowance / I wasn't into shopping / I would just buy books | Blurred plate of the guest + stacked tags (scene A5) | Gold **ALLOWANCE** pill, dark **SHOPPING** pill struck through in red, gold **BOOKS** pill | Pills pop one per word |
| 7 | 12.77 | 12:24.1 | therefore I saved most of my money | GUEST wide | **SAVED** | |
| 8 | 14.99 | 12:26.3 | when my friends and my family | GUEST, 134% | **FRIENDS**, **FAMILY** | |
| 9 | 18.11 | 12:29.4 | they ran out of money / in the middle of the month | Designed **calendar** card on the gold-bokeh ground | **OUT**, **MIDDLE** | Days 1–14 cross out in red, and a hand-drawn red circle lands on the **15th** on "middle" |
| 10 | 21.71 | 12:33.3 | they came to me for money | GUEST | **MONEY** | |
| 11 | 23.89 | 12:35.5 | guess what I did? | GUEST, 144% | **DID?** | Punch-in |
| 12 | 25.61 | 12:39.3 | Yeah, I gave it to them | GUEST wide | | |
| 13 | 26.79 | 12:40.5 | but they had to pay interest | The **loan book** opens: "Loans: who owes me" | Handwritten "Friends & family **+ interest**", with a gold tick | Writes on |
| 14 | 28.57 | 12:42.3 | (host laughs) | HOST laughing | | Push 100→107% |
| 15 | 29.55 | 12:49.4 | I remember my dad | GUEST | | |
| 16 | 30.50 | 12:52.3 | he knocked on my room door | GUEST, 126% | **KNOCKED**, **DOOR** | Knock-knock: two shakes on "knocked" and "door" |
| 17 | 32.27 | 12:54.1 | he said Latoya, I need $20 | GUEST wide | **LATOYA**, giant white **$20** | Flash on "20" |
| 18 | 34.49 | 12:57.0 | I went in my drawer | GUEST, 132% | **DRAWER** | |
| 19 | 36.78 | 12:59.3 | and I started counting all my money | GUEST, 104% | **COUNTING** | |
| 20 | 38.52 | 13:01.0 | he said wait, you still have all those money? | GUEST, 146% | **WAIT**, **MONEY?** | Flash + RGB split on the punch-in |
| 21 | 40.65 | 13:11.6 | so I gave him $20 | GUEST, 110% | **$20** | |
| 22 | 41.81 | 13:12.7 | the next time he got paid | GUEST wide | **PAID** | |
| 23 | 43.75 | 13:14.7 | he's giving me allowance | GUEST, 130% | | |
| 24 | 45.31 | 13:16.2 | I said daddy, remember you owe me $20 and plus $5 for interest | **Loan book**, stage 2 | **DADDY**, **$20**, **$5**, **INTEREST**; "Dad  $20  + $5" is written on as she says each number | Writes on |
| 25 | 49.66 | 13:21.1 | and he gave me my allowance and the $20 | GUEST wide | **$20** | |
| 26 | 52.58 | 13:24.0 | but he didn't give me back my interest | **Loan book**, stage 3 | **DIDN'T**, **INTEREST** (red) | $20 gets a tick. "+ $5" is struck through in red with an ✗ (RGB split). Grade turns cold |
| 27 | 54.48 | 13:25.9 | I'm like, come on | GUEST, 142% | **COME ON** (red) | Shake |
| 28 | 55.74 | 13:59.7 | so that was my first entrepreneurial business | **Loan book**, stage 4 | **FIRST**, **BUSINESS** | A gold **FIRST BUSINESS · EST. AGE 15** stamp slams in (flash + shake + RGB). Grade warms back |
| 29 | 58.94 | 14:02.9 | but I didn't know it was called | GUEST wide | | |
| 30 | 60.50 | 14:04.5 | entrepreneurship | GUEST, 130% | **ENTREPRENEURSHIP** assembles letter by letter | Flash; 0.35 s fade |

There are 30 shots in 61.6 s, about 2.1 s per shot. No picture holds longer than about 3.6 s without a new element.

## 5. Look

- **Captions:** the same system as `edits/gambling` and `edits/vice-city`. Words are Inter Medium and rise in (they start low and blurred, then slide up, fade in and sharpen). One gold Instrument Serif Italic keyword per beat, red for "didn't / interest / come on". "Interest" (hook) and "entrepreneurship" (close) assemble letter by letter. Numbers that are shown as giant counters, and words that are shown as tags, are left out of the caption line.
- **Title banner (A8):** "At 15, she charged her own dad *interest*" is on screen for the whole hook.
- **Designed scenes:** these are all drawn in `edit.py`, with no stock footage or AI images. A paper texture sits on a warm charcoal ground with a gold glow and drifting bokeh. The **loan book** is the running visual motif: it appears four times and grows with the story (friends → dad's $20 + $5 → the $5 struck out → the "first business" stamp). The **calendar** crosses out days to the 15th. The **tags** are on a blurred plate of the guest.
- **Grade:** a warm teal/gold film curve, halation, vignette, grain and a caption scrim. It turns cold on "he didn't give me back my interest / come on" and warms back for the payoff.
- **Audio:** only the original dialogue. Light EQ and compression, −14 LUFS, and no music or SFX, to match the client's notes on the vice-city edit.
- **No end card / CTA**, following the vice-city v4 feedback. To add one, append a "Comment 'INTEREST' for the full episode" card after the final word.
