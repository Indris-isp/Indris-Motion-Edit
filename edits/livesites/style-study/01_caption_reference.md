# Reference 1: the caption reel ("Turn Claude into a content machine")

- **File:** 1080×1920, 25 fps, 42.60 s, 1065 frames. Talking head plus screen recordings and designed B-roll.
- **Format:** an educational tool demo. Hook → problem → "I built a fix" → how it works (3 steps) → personal use → comment-keyword CTA.
- **Contact sheets:** `sheets/cap_01.jpg` … `cap_09.jpg` (5 fps, timestamped). `sheets/capz_all.jpg` shows single-frame strips of the caption swaps and transitions. `sheets/caption_layouts.jpg` and `sheets/caption_aroll_placement.jpg` are full-res examples of every caption position.
- **Per-frame data:** `data/caption_ref_frames.csv` has luma, saturation, motion and a histogram cut score for each of the 1065 frames.

---

## 1. Clean transcript (by sentence)

| time | line | beat |
|---|---|---|
| 0.00–3.66 | Here's how you can use Claude to break down why a video got views like this… instead of this. | **HOOK**: before/after promise, with visual proof (low-view vs high-view thumbnails) |
| 3.82–8.72 | Normally, if you ask Claude why a video went viral, it gives you a super confident answer without actually having watched it. | **PROBLEM**: shown live in the Claude UI |
| 8.80–13.50 | It literally only reads the transcript, so it misses what's on the screen, the pacing and the psychology behind it. | **WHY**: three missing things, each one becomes a chip |
| 13.64–15.64 | But I built a skill to fix that. | **TURN**: a hard cut back to his face on "But" |
| 15.76–18.46 | It's called the Video Breakdown. Let me show you how to use it. Super simple. | **NAME**: a product title lockup |
| 18.58–24.50 | You paste in a video, and it watches the whole thing frame by frame. It checks how many more views it got than the creator normally gets. | **STEPS 1–2**: designed UI B-roll |
| 24.66–30.84 | Then it maps out every beat, names the psychology behind each one, and hands you a template that you can apply to your next video. | **STEP 3 = PROOF**: the real output, scrolling |
| 31.04–39.08 | Personally, I use this on my own content or creators I get inspiration from. Not to copy them, but to understand why certain pieces of content work, so I can improve mine going forward. | **AUTHENTICITY**: a lifestyle B-roll montage |
| 39.30–42.32 | You can build this yourself, or just comment "Breakdown" and I'll send you over mine. | **CTA**: comment keyword |

## 2. Word-by-word transcript (Whisper small.en, corrected against the burned-in captions)

Timing comes from Whisper and is good to about ±0.04 s. Where Whisper misheard a word, the column "Whisper heard" shows what it wrote, and the correction is taken from the on-screen caption.

| # | start | end | frame @25 | word (corrected) | Whisper heard | conf |
|---|---|---|---|---|---|---|
| 1 | 0.00 | 0.18 | f0 | Here's |  | 0.84 |
| 2 | 0.18 | 0.28 | f4 | how |  | 0.94 |
| 3 | 0.28 | 0.40 | f7 | you |  | 0.97 |
| 4 | 0.40 | 0.56 | f10 | can |  | 0.98 |
| 5 | 0.56 | 0.74 | f14 | use |  | 0.99 |
| 6 | 0.74 | 0.92 | f18 | Claude | claw  | 0.23 |
| 7 | 0.92 | 1.08 | f23 | to |  | 0.96 |
| 8 | 1.08 | 1.26 | f27 | break |  | 0.67 |
| 9 | 1.26 | 1.44 | f32 | down |  | 0.92 |
| 10 | 1.44 | 1.62 | f36 | why |  | 0.2 |
| 11 | 1.62 | 1.88 | f40 | video |  | 0.57 |
| 12 | 1.88 | 2.04 | f47 | got |  | 0.65 |
| 13 | 2.04 | 2.20 | f51 | views |  | 0.98 |
| 14 | 2.20 | 2.40 | f55 | like |  | 0.98 |
| 15 | 2.40 | 2.70 | f60 | this |  | 0.99 |
| 16 | 2.70 | 3.24 | f68 | instead |  | 0.79 |
| 17 | 3.24 | 3.38 | f81 | of |  | 0.99 |
| 18 | 3.38 | 3.66 | f84 | this. |  | 0.99 |
| 19 | 3.82 | 3.96 | f96 | Normally |  | 0.95 |
| 20 | 3.96 | 4.14 | f99 | if |  | 0.7 |
| 21 | 4.14 | 4.26 | f103 | you | your  | 0.77 |
| 22 | 4.26 | 4.52 | f106 | ask Claude | article  | 0.73 |
| 23 | 4.52 | 4.92 | f113 | why |  | 0.71 |
| 24 | 4.92 | 5.20 | f123 | video |  | 0.9 |
| 25 | 5.20 | 5.42 | f130 | went |  | 0.47 |
| 26 | 5.42 | 5.76 | f136 | viral |  | 1.0 |
| 27 | 5.76 | 6.00 | f144 | it gives | give  | 0.37 |
| 28 | 6.00 | 6.12 | f150 | you |  | 0.99 |
| 29 | 6.12 | 6.24 | f153 | a |  | 0.96 |
| 30 | 6.24 | 6.48 | f156 | super |  | 0.99 |
| 31 | 6.48 | 6.90 | f162 | confident |  | 0.98 |
| 32 | 6.90 | 7.24 | f172 | answer |  | 0.98 |
| 33 | 7.24 | 7.58 | f181 | without |  | 0.99 |
| 34 | 7.58 | 7.90 | f190 | actually |  | 0.93 |
| 35 | 7.90 | 8.10 | f198 | having |  | 0.98 |
| 36 | 8.10 | 8.42 | f202 | watched |  | 0.97 |
| 37 | 8.42 | 8.72 | f210 | it. |  | 0.98 |
| 38 | 8.80 | 8.86 | f220 | It |  | 0.85 |
| 39 | 8.86 | 9.02 | f222 | literally |  | 0.92 |
| 40 | 9.02 | 9.30 | f226 | only |  | 0.99 |
| 41 | 9.30 | 9.56 | f233 | reads |  | 0.98 |
| 42 | 9.56 | 9.70 | f239 | the |  | 0.85 |
| 43 | 9.70 | 10.06 | f242 | transcript, |  | 0.93 |
| 44 | 10.24 | 10.34 | f256 | so |  | 0.98 |
| 45 | 10.34 | 10.44 | f258 | it |  | 0.8 |
| 46 | 10.44 | 10.64 | f261 | misses |  | 0.99 |
| 47 | 10.64 | 11.04 | f266 | what's |  | 0.98 |
| 48 | 11.04 | 11.14 | f276 | on |  | 1.0 |
| 49 | 11.14 | 11.26 | f278 | the |  | 1.0 |
| 50 | 11.26 | 11.56 | f282 | screen, |  | 1.0 |
| 51 | 11.74 | 11.78 | f294 | the |  | 0.99 |
| 52 | 11.78 | 12.10 | f294 | pacing |  | 1.0 |
| 53 | 12.10 | 12.40 | f302 | and |  | 0.69 |
| 54 | 12.40 | 12.86 | f310 | psychology |  | 0.99 |
| 55 | 12.86 | 13.28 | f322 | behind |  | 1.0 |
| 56 | 13.28 | 13.50 | f332 | it. |  | 0.99 |
| 57 | 13.64 | 13.88 | f341 | But |  | 0.98 |
| 58 | 13.88 | 14.26 | f347 | I |  | 0.83 |
| 59 | 14.26 | 14.48 | f356 | built |  | 0.94 |
| 60 | 14.48 | 14.64 | f362 | a |  | 0.96 |
| 61 | 14.64 | 14.90 | f366 | skill |  | 0.97 |
| 62 | 14.90 | 15.14 | f372 | to |  | 1.0 |
| 63 | 15.14 | 15.34 | f378 | fix |  | 1.0 |
| 64 | 15.34 | 15.64 | f384 | that. |  | 0.69 |
| 65 | 15.76 | 15.88 | f394 | It's |  | 0.98 |
| 66 | 15.88 | 16.04 | f397 | called |  | 0.99 |
| 67 | 16.04 | 16.16 | f401 | the |  | 0.93 |
| 68 | 16.16 | 16.36 | f404 | video |  | 0.91 |
| 69 | 16.36 | 16.72 | f409 | breakdown. |  | 0.9 |
| 70 | 16.92 | 16.96 | f423 | Let |  | 0.99 |
| 71 | 16.96 | 17.04 | f424 | me |  | 1.0 |
| 72 | 17.04 | 17.20 | f426 | show |  | 1.0 |
| 73 | 17.20 | 17.28 | f430 | you |  | 1.0 |
| 74 | 17.28 | 17.40 | f432 | how |  | 1.0 |
| 75 | 17.40 | 17.50 | f435 | to |  | 0.98 |
| 76 | 17.50 | 17.64 | f438 | use |  | 1.0 |
| 77 | 17.64 | 17.80 | f441 | it. |  | 0.96 |
| 78 | 17.94 | 18.06 | f449 | Super |  | 0.56 |
| 79 | 18.06 | 18.46 | f451 | simple. |  | 0.99 |
| 80 | 18.58 | 18.60 | f464 | You |  | 0.96 |
| 81 | 18.60 | 18.80 | f465 | paste |  | 0.98 |
| 82 | 18.80 | 18.98 | f470 | in |  | 0.96 |
| 83 | 18.98 | 19.08 | f474 | a |  | 0.95 |
| 84 | 19.08 | 19.36 | f477 | video |  | 1.0 |
| 85 | 19.36 | 19.72 | f484 | and |  | 0.97 |
| 86 | 19.72 | 19.82 | f493 | it |  | 0.92 |
| 87 | 19.82 | 20.14 | f496 | watches |  | 0.98 |
| 88 | 20.14 | 20.34 | f504 | the |  | 1.0 |
| 89 | 20.34 | 20.54 | f508 | whole |  | 1.0 |
| 90 | 20.54 | 20.76 | f514 | thing |  | 1.0 |
| 91 | 20.76 | 21.04 | f519 | frame |  | 0.88 |
| 92 | 21.04 | 21.24 | f526 | by |  | 0.98 |
| 93 | 21.24 | 21.58 | f531 | frame. |  | 1.0 |
| 94 | 21.70 | 21.78 | f542 | It |  | 1.0 |
| 95 | 21.78 | 21.98 | f544 | checks |  | 0.99 |
| 96 | 21.98 | 22.22 | f550 | how |  | 1.0 |
| 97 | 22.22 | 22.36 | f556 | many |  | 1.0 |
| 98 | 22.36 | 22.56 | f559 | more |  | 1.0 |
| 99 | 22.56 | 22.86 | f564 | views |  | 0.99 |
| 100 | 22.86 | 23.00 | f572 | it |  | 0.52 |
| 101 | 23.00 | 23.16 | f575 | got |  | 0.98 |
| 102 | 23.16 | 23.44 | f579 | than |  | 0.37 |
| 103 | 23.44 | 23.58 | f586 | the |  | 0.97 |
| 104 | 23.58 | 23.80 | f590 | creator |  | 0.76 |
| 105 | 23.80 | 24.20 | f595 | normally |  | 0.99 |
| 106 | 24.20 | 24.50 | f605 | gets. |  | 0.94 |
| 107 | 24.66 | 24.80 | f616 | Then |  | 0.99 |
| 108 | 24.80 | 24.90 | f620 | it |  | 0.96 |
| 109 | 24.90 | 25.10 | f622 | maps |  | 0.99 |
| 110 | 25.10 | 25.28 | f628 | out |  | 0.99 |
| 111 | 25.28 | 25.56 | f632 | every |  | 0.99 |
| 112 | 25.56 | 25.78 | f639 | beat, |  | 0.78 |
| 113 | 25.92 | 26.12 | f648 | names |  | 0.98 |
| 114 | 26.12 | 26.26 | f653 | the |  | 0.66 |
| 115 | 26.26 | 26.72 | f656 | psychology |  | 1.0 |
| 116 | 26.72 | 27.18 | f668 | behind |  | 1.0 |
| 117 | 27.18 | 27.44 | f680 | each |  | 0.99 |
| 118 | 27.44 | 27.72 | f686 | one |  | 1.0 |
| 119 | 27.72 | 27.92 | f693 | and |  | 0.84 |
| 120 | 27.92 | 28.22 | f698 | hands |  | 0.71 |
| 121 | 28.22 | 28.40 | f706 | you |  | 0.94 |
| 122 | 28.40 | 28.60 | f710 | a |  | 0.99 |
| 123 | 28.60 | 28.96 | f715 | template |  | 1.0 |
| 124 | 28.96 | 29.26 | f724 | that |  | 1.0 |
| 125 | 29.26 | 29.42 | f732 | you |  | 1.0 |
| 126 | 29.42 | 29.58 | f736 | can |  | 1.0 |
| 127 | 29.58 | 29.94 | f740 | apply. |  | 1.0 |
| 128 | 29.94 | 30.18 | f748 | To |  | 0.0 |
| 129 | 30.18 | 30.26 | f754 | your |  | 0.71 |
| 130 | 30.26 | 30.50 | f756 | next |  | 0.99 |
| 131 | 30.50 | 30.84 | f762 | video. |  | 0.99 |
| 132 | 31.04 | 31.20 | f776 | Personally, |  | 0.92 |
| 133 | 31.32 | 31.34 | f783 | I |  | 0.98 |
| 134 | 31.34 | 31.52 | f784 | use |  | 0.98 |
| 135 | 31.52 | 31.64 | f788 | this |  | 0.99 |
| 136 | 31.64 | 31.78 | f791 | on |  | 0.98 |
| 137 | 31.78 | 31.92 | f794 | my |  | 1.0 |
| 138 | 31.92 | 32.10 | f798 | own |  | 0.99 |
| 139 | 32.10 | 32.48 | f802 | content |  | 0.99 |
| 140 | 32.48 | 32.70 | f812 | or |  | 0.86 |
| 141 | 32.70 | 32.96 | f818 | creators | create as | 0.47 |
| 142 | 33.14 | 33.26 | f828 | I |  | 0.99 |
| 143 | 33.26 | 33.40 | f832 | get |  | 0.99 |
| 144 | 33.40 | 33.90 | f835 | inspiration |  | 0.98 |
| 145 | 33.90 | 34.28 | f848 | from |  | 0.89 |
| 146 | 34.28 | 34.46 | f857 | not |  | 0.35 |
| 147 | 34.46 | 34.62 | f862 | to |  | 0.99 |
| 148 | 34.62 | 34.84 | f865 | copy |  | 0.99 |
| 149 | 34.84 | 35.08 | f871 | them, |  | 1.0 |
| 150 | 35.08 | 35.28 | f877 | but |  | 0.93 |
| 151 | 35.28 | 35.44 | f882 | to |  | 0.99 |
| 152 | 35.44 | 35.84 | f886 | understand |  | 0.98 |
| 153 | 35.84 | 36.26 | f896 | why |  | 0.93 |
| 154 | 36.26 | 36.62 | f906 | certain |  | 0.93 |
| 155 | 36.62 | 36.86 | f915 | pieces |  | 0.63 |
| 156 | 36.86 | 37.08 | f922 | of |  | 0.97 |
| 157 | 37.08 | 37.30 | f927 | content |  | 0.99 |
| 158 | 37.30 | 37.58 | f932 | works. |  | 0.55 |
| 159 | 37.60 | 37.84 | f940 | so I | I  | 0.84 |
| 160 | 37.84 | 37.98 | f946 | can |  | 1.0 |
| 161 | 37.98 | 38.32 | f949 | improve |  | 1.0 |
| 162 | 38.32 | 38.56 | f958 | mine | my  | 0.55 |
| 163 | 38.56 | 38.80 | f964 | going |  | 0.25 |
| 164 | 38.80 | 39.08 | f970 | forward. |  | 0.94 |
| 165 | 39.30 | 39.36 | f982 | You |  | 0.99 |
| 166 | 39.36 | 39.48 | f984 | can |  | 1.0 |
| 167 | 39.48 | 39.62 | f987 | build |  | 0.56 |
| 168 | 39.62 | 39.80 | f990 | this |  | 0.98 |
| 169 | 39.80 | 40.18 | f995 | yourself |  | 1.0 |
| 170 | 40.18 | 40.34 | f1004 | or |  | 0.51 |
| 171 | 40.34 | 40.50 | f1009 | just |  | 1.0 |
| 172 | 40.50 | 40.66 | f1012 | comment | come | 0.8 |
| 173 | 40.66 | 40.82 | f1016 | "Breakdown" | and break down | 0.87 |
| 174 | 41.30 | 41.48 | f1032 | and |  | 0.82 |
| 175 | 41.48 | 41.62 | f1037 | I'll |  | 0.99 |
| 176 | 41.62 | 41.76 | f1040 | send |  | 1.0 |
| 177 | 41.76 | 41.92 | f1044 | you |  | 1.0 |
| 178 | 41.92 | 42.08 | f1048 | over |  | 0.97 |
| 179 | 42.08 | 42.32 | f1052 | mine. |  | 0.9 |

---

## 3. Shot list (frame-accurate, from the histogram cut score)

Layout codes:
- **A-FULL**: talking head, full frame.
- **SPLIT**: a 50/50 vertical split, B-roll on top and A-roll or B-roll below.
- **B-WHITE**: a designed graphic on an off-white (#F8F7F4) canvas, full frame.
- **UI-DARK**: a full-frame Claude screen recording (#262624).
- **B-FULL**: lifestyle B-roll, full frame.

| # | frames | time (s) | dur | layout | top / main visual | bottom | animation inside the shot | why it's there |
|---|---|---|---|---|---|---|---|---|
| 1 | f0–92 | 0.00–3.72 | 3.72 | A-FULL (wide) | Speaker, warm tungsten room. **Title lockup** "Turn / **Claude** / into a content machine" (silver gradient, top 8–25%). | – | f4–6: the title fades and de-blurs in (3 frames). f4–6: the Claude app tile **pops in next to his raised hand**, and he "touches" it with his index finger (0.6–1.4 s). f40–43: the tile breaks into sparkles and a row of 3 reel thumbnails with **low** view counts ("why video got views like this"). 2.8 s: a sparkle swap to thumbnails with **high** counts (97K / 222K / 290K) on "instead of this". | The hook proves the promise visually. The graphic sits where his hand points, so the gesture and the graphic read as one action. |
| 2 | f93–217 | 3.72–8.72 | 5.00 | SPLIT | Claude UI: the prompt "Why did this video gone viral? + IG link" types in (3.72–5.88). Then Claude's confident answer streams (5.88–8.72). | A-roll MCU (a punch-in of the same take) | Typing and streaming text: real screen-recording speed | You *see* the problem while hearing it, and his face stays on screen for trust. |
| 3 | f218–258 | 8.72–10.36 | 1.64 | B-WHITE | A 3×3 grid of reels on a cream card | – | f219–226: a **green scan band sweeps top→bottom** (8 frames). As it passes, the thumbnails become yellow transcript lines. | "It only reads the transcript", made literal: the video is turned into text. |
| 4 | f259–337 | 10.36–13.52 | 3.16 | B-WHITE | An iPhone mockup with a blurred reel playing. A green scan flash at entry. | – | Chips pop onto the phone **on the spoken word**: "What's on the screen" (10.6), "The pacing" (11.8), "Psychology behind it" (12.4). The phone re-frames smaller at 11.2 to make room. | A list of 3 becomes 3 stacked chips, one per word. |
| 5 | f338–353 | 13.52–14.16 | 0.64 | A-FULL (MCU) | Speaker, hands together | – | – | **"But"**: a pattern interrupt. Cutting back to his face marks the turn. |
| 6 | f354–392 | 14.16–15.72 | 1.56 | SPLIT | A 3D blue folder with docs + a yellow gear (a "skill" icon) | A-roll, pointing at the lens | Gentle float | "I built a skill": the object for "skill". |
| 7 | f393–425 | 15.72–17.04 | 1.32 | B-WHITE | Claude tile + a phone scrolling a reel feed. At 16.0 the **title lockup "The Video breakdown"** appears (same lockup style as the hook). | – | f393–399: a green flood/scan wipe brings the phone in | The product name gets the same title treatment as the hook. That is branding. |
| 8 | f426–461 | 17.04–18.48 | 1.44 | SPLIT | The Claude tile + phone, cropped by the seam | A-roll | – | "Let me show you": a quick check-in on his face before the demo. |
| 9a | f462–492 | 18.48–19.72 | 1.24 | B-WHITE | A clean Claude prompt box mock. "Why did this video go viral? + link" types in. | – | Typing. The box slides up and fades. | Step 1: "you paste in a video". |
| 9b | f493–496 | 19.72–19.84 | 0.16 | B-WHITE | Empty canvas (a dip to the background) | – | – | A breath before the next step |
| 9c | f497–539 | 19.84–21.60 | 1.76 | B-WHITE | A phone playing a creator reel, with the Claude tab on top | – | Fades in with a green scan running down the screen | Step 2: "it watches the whole thing frame by frame" |
| 9d | f540–577 | 21.60–23.12 | 1.52 | B-WHITE | The same phone, now blurred, with a "Views" chip | – | The blur, then the chip pops | "It checks how many more views" |
| 9e | f578–615 | 23.12–24.64 | 1.52 | B-WHITE | A **tilted 3D card**: a 3×3 grid of the creator's reels with view counts. Drop shadow. | – | Slight perspective drift | "…than the creator normally gets": the baseline |
| 10 | f616–772 | 24.64–30.92 | 6.28 | UI-DARK | The real Claude output: the "Beat map" table, scrolling slowly | – | Auto-scroll. **A yellow highlight box** lands on the template block (28.0–29.4) on the word "template". | Proof: the real deliverable. The longest hold in the video, and it's allowed because the screen keeps moving. |
| 11 | f773–857 | 30.92–34.32 | 3.40 | SPLIT | Claude tile in the centre, reel thumbnails orbiting, a magnifier, and a **rotating green radar sweep** | A-roll | Orbit and sweep loop | "Creators I get inspiration from": research, shown as a radar |
| 12 | f858–879 | 34.32–35.20 | 0.88 | SPLIT (B/B) | ECU: the screen reflected in orange glasses | Hands typing on a mechanical keyboard | – | Lifestyle montage starts. The pace speeds up. |
| 13 | f880–899 | 35.20–36.00 | 0.80 | SPLIT (B/B) | Over-the-shoulder at the monitor, dark | ECU eye | – | " |
| 14 | f900–942 | 36.00–37.72 | 1.72 | SPLIT (B/B) | Hand writing with a pen, warm lamp | Rear shot: a guy in a cap at a white monitor | – | " |
| 15 | f943–969 | 37.72–38.80 | 1.08 | B-FULL | High-angle wide: at the desk in a chair, handheld | – | Camera drift | "so I can improve" |
| 16 | f970–980 | 38.80–39.24 | 0.44 | B-FULL | Dark side-lit shot, orange glasses | – | – | "forward" |
| 17 | f981–1065 | 39.24–42.60 | 3.36 | A-FULL (wide = shot 1 framing) | Speaker. A 3D folder "Setup Guide / Skill.md" floats at top centre (39.4–40.3). Then the **"Breakdown" CTA lockup** with quotes, in the same silver title style (40.4→end). | – | The folder pops in and out. The keyword lockup fades in. | CTA. The video ends on the same framing as the hook, which closes the loop. |

**Time by layout:**

| layout | time | share |
|---|---|---|
| SPLIT | 14.8 s | 35 % |
| B-WHITE designed graphics | 12.3 s | 29 % |
| A-FULL | 7.7 s | 18 % |
| UI-DARK | 6.3 s | 15 % |
| B-FULL lifestyle | 1.5 s | 4 % |

His face is on screen (full or split) for about 45 % of the runtime. The average shot is 2.3 s. The montage (34.3–39.2) drops to 0.4–1.0 s per shot.

---

## 4. Caption log: every on-screen caption

There are 101 caption chunks. **Mean length 0.42 s, median 0.38 s, mean 1.8 words.** By word count: 39 one-word chunks, 47 two-word, 13 three-word and 2 four-word. Start times are from the word timing and were checked against the 5 fps sheets (±0.1 s).

| # | in (s) | frame @25 | dur (s) | on-screen caption | words | layout | caption placement |
|---|---|---|---|---|---|---|---|
| 1 | 0.00 | f0 | 0.18 | **Here's** | 1 | A-FULL | plain white, no pill; on chest / beside raised hand, y≈54% |
| 2 | 0.18 | f4 | 0.22 | **how you** | 2 | A-FULL | plain white, no pill; on chest / beside raised hand, y≈54% |
| 3 | 0.40 | f10 | 0.34 | **can use** | 2 | A-FULL | plain white, no pill; on chest / beside raised hand, y≈54% |
| 4 | 0.74 | f18 | 0.18 | **Claude** | 1 | A-FULL | plain white, no pill; on chest / beside raised hand, y≈54% |
| 5 | 0.92 | f23 | 0.52 | **to break down** | 3 | A-FULL | plain white, no pill; on chest / beside raised hand, y≈54% |
| 6 | 1.44 | f36 | 0.44 | **why video** | 2 | A-FULL | plain white, no pill; on chest / beside raised hand, y≈54% |
| 7 | 1.88 | f47 | 0.32 | **got views** | 2 | A-FULL | plain white, no pill; on chest / beside raised hand, y≈54% |
| 8 | 2.20 | f55 | 0.50 | **like this** | 2 | A-FULL | plain white, no pill; on chest / beside raised hand, y≈54% |
| 9 | 2.70 | f68 | 1.12 | **instead of this** | 3 | A-FULL | plain white, no pill; on chest / beside raised hand, y≈54% |
| 10 | 3.82 | f96 | 0.14 | **normally** | 1 | SPLIT | dark pill, centred on the seam, y≈50% |
| 11 | 3.96 | f99 | 0.34 | **if you ask** | 3 | SPLIT | dark pill, centred on the seam, y≈50% |
| 12 | 4.30 | f108 | 0.22 | **Claude** | 1 | SPLIT | dark pill, centred on the seam, y≈50% |
| 13 | 4.52 | f113 | 0.68 | **why video** | 2 | SPLIT | dark pill, centred on the seam, y≈50% |
| 14 | 5.20 | f130 | 0.56 | **went viral** | 2 | SPLIT | dark pill, centred on the seam, y≈50% |
| 15 | 5.76 | f144 | 0.36 | **it gives you** | 3 | SPLIT | dark pill, centred on the seam, y≈50% |
| 16 | 6.12 | f153 | 0.36 | **a super** | 2 | SPLIT | dark pill, centred on the seam, y≈50% |
| 17 | 6.48 | f162 | 0.42 | **confident** | 1 | SPLIT | dark pill, centred on the seam, y≈50% |
| 18 | 6.90 | f172 | 0.34 | **answer** | 1 | SPLIT | dark pill, centred on the seam, y≈50% |
| 19 | 7.24 | f181 | 0.34 | **without** | 1 | SPLIT | dark pill, centred on the seam, y≈50% |
| 20 | 7.58 | f190 | 0.32 | **actually** | 1 | SPLIT | dark pill, centred on the seam, y≈50% |
| 21 | 7.90 | f198 | 0.20 | **having** | 1 | SPLIT | dark pill, centred on the seam, y≈50% |
| 22 | 8.10 | f202 | 0.70 | **watched it** | 2 | SPLIT | dark pill, centred on the seam, y≈50% |
| 23 | 8.80 | f220 | 0.22 | **it literally** | 2 | B-WHITE | grey pill, under the graphic, y≈75% |
| 24 | 9.02 | f226 | 0.54 | **only reads** | 2 | B-WHITE | grey pill, under the graphic, y≈75% |
| 25 | 9.56 | f239 | 0.68 | **the transcript** | 2 | B-WHITE | grey pill, under the graphic, y≈75% |
| 26 | 10.24 | f256 | 0.40 | **so it misses** | 3 | B-WHITE | grey pill, under the graphic, y≈75% |
| 27 | 10.64 | f266 | 0.50 | **what's on** | 2 | B-WHITE | grey pill, under the graphic, y≈75% |
| 28 | 11.14 | f278 | 0.60 | **the screen** | 2 | B-WHITE | grey pill, under the graphic, y≈75% |
| 29 | 11.74 | f294 | 0.36 | **the pacing** | 2 | B-WHITE | grey pill, under the graphic, y≈75% |
| 30 | 12.10 | f302 | 0.30 | **and** | 1 | B-WHITE | grey pill, under the graphic, y≈75% |
| 31 | 12.40 | f310 | 0.46 | **psychology** | 1 | B-WHITE | grey pill, under the graphic, y≈75% |
| 32 | 12.86 | f322 | 0.78 | **behind it** | 2 | B-WHITE | grey pill, under the graphic, y≈75% |
| 33 | 13.64 | f341 | 0.24 | **but** | 1 | A-FULL | plain white, left of the face at eye level, y≈37% |
| 34 | 13.88 | f347 | 0.60 | **I built** | 2 | A-FULL | plain white, left of the face at eye level, y≈37% |
| 35 | 14.48 | f362 | 0.42 | **a skill** | 2 | SPLIT | pill on the seam |
| 36 | 14.90 | f372 | 0.86 | **to fix that** | 3 | SPLIT | pill on the seam |
| 37 | 15.76 | f394 | 0.28 | **it's called** | 2 | B-WHITE | dark pill ON the phone screen, y≈60% |
| 38 | 16.04 | f401 | 0.32 | **the video** | 2 | B-WHITE | dark pill ON the phone screen, y≈60% |
| 39 | 16.36 | f409 | 0.56 | **breakdown** | 1 | B-WHITE | dark pill ON the phone screen, y≈60% |
| 40 | 16.92 | f423 | 0.12 | **let me** | 2 | B-WHITE | dark pill ON the phone screen, y≈60% |
| 41 | 17.04 | f426 | 0.24 | **show you** | 2 | SPLIT | pill on the seam |
| 42 | 17.28 | f432 | 0.66 | **how to use it** | 4 | SPLIT | pill on the seam |
| 43 | 17.94 | f449 | 0.64 | **it's super simple** | 3 | SPLIT | pill on the seam |
| 44 | 18.58 | f464 | 0.22 | **you paste** | 2 | B-WHITE | grey pill, follows the bottom edge of the graphic |
| 45 | 18.80 | f470 | 0.56 | **in a video** | 3 | B-WHITE | grey pill, follows the bottom edge of the graphic |
| 46 | 19.36 | f484 | 0.36 | **and** | 1 | B-WHITE | grey pill, follows the bottom edge of the graphic |
| 47 | 19.72 | f493 | 0.42 | **it watches** | 2 | B-WHITE | grey pill, follows the bottom edge of the graphic |
| 48 | 20.14 | f504 | 0.62 | **the whole thing** | 3 | B-WHITE | grey pill, follows the bottom edge of the graphic |
| 49 | 20.76 | f519 | 0.94 | **frame by frame** | 3 | B-WHITE | grey pill, follows the bottom edge of the graphic |
| 50 | 21.70 | f542 | 0.28 | **it checks** | 2 | B-WHITE | grey pill, follows the bottom edge of the graphic |
| 51 | 21.98 | f550 | 0.24 | **how** | 1 | B-WHITE | grey pill, follows the bottom edge of the graphic |
| 52 | 22.22 | f556 | 0.64 | **many more views** | 3 | B-WHITE | grey pill, follows the bottom edge of the graphic |
| 53 | 22.86 | f572 | 0.30 | **it got** | 2 | B-WHITE | grey pill, follows the bottom edge of the graphic |
| 54 | 23.16 | f579 | 0.42 | **than the** | 2 | B-WHITE | grey pill, follows the bottom edge of the graphic |
| 55 | 23.58 | f590 | 0.22 | **creator** | 1 | B-WHITE | grey pill, follows the bottom edge of the graphic |
| 56 | 23.80 | f595 | 0.86 | **normally gets** | 2 | B-WHITE | grey pill, follows the bottom edge of the graphic |
| 57 | 24.66 | f616 | 0.24 | **then it** | 2 | UI-DARK | dark pill, sits just above the Claude input bar, y≈73% |
| 58 | 24.90 | f622 | 0.38 | **maps out** | 2 | UI-DARK | dark pill, sits just above the Claude input bar, y≈73% |
| 59 | 25.28 | f632 | 0.64 | **every beat** | 2 | UI-DARK | dark pill, sits just above the Claude input bar, y≈73% |
| 60 | 25.92 | f648 | 0.20 | **names** | 1 | UI-DARK | dark pill, sits just above the Claude input bar, y≈73% |
| 61 | 26.12 | f653 | 0.60 | **a psychology** | 2 | UI-DARK | dark pill, sits just above the Claude input bar, y≈73% |
| 62 | 26.72 | f668 | 0.46 | **behind** | 1 | UI-DARK | dark pill, sits just above the Claude input bar, y≈73% |
| 63 | 27.18 | f680 | 0.54 | **each one** | 2 | UI-DARK | dark pill, sits just above the Claude input bar, y≈73% |
| 64 | 27.72 | f693 | 0.50 | **and hands** | 2 | UI-DARK | dark pill, sits just above the Claude input bar, y≈73% |
| 65 | 28.22 | f706 | 0.38 | **you a** | 2 | UI-DARK | dark pill, sits just above the Claude input bar, y≈73% |
| 66 | 28.60 | f715 | 0.66 | **template that** | 2 | UI-DARK | dark pill, sits just above the Claude input bar, y≈73% |
| 67 | 29.26 | f732 | 0.68 | **you can apply** | 3 | UI-DARK | dark pill, sits just above the Claude input bar, y≈73% |
| 68 | 29.94 | f748 | 0.32 | **to your** | 2 | UI-DARK | dark pill, sits just above the Claude input bar, y≈73% |
| 69 | 30.26 | f756 | 0.78 | **next video** | 2 | UI-DARK | dark pill, sits just above the Claude input bar, y≈73% |
| 70 | 31.04 | f776 | 0.28 | **personally** | 1 | SPLIT | pill on the seam |
| 71 | 31.32 | f783 | 0.46 | **I use this on** | 4 | SPLIT | pill on the seam |
| 72 | 31.78 | f794 | 0.32 | **my own** | 2 | SPLIT | pill on the seam |
| 73 | 32.10 | f802 | 0.38 | **content** | 1 | SPLIT | pill on the seam |
| 74 | 32.48 | f812 | 0.66 | **or creators** | 2 | SPLIT | pill on the seam |
| 75 | 33.14 | f828 | 0.26 | **I get** | 2 | SPLIT | pill on the seam |
| 76 | 33.40 | f835 | 0.50 | **inspiration** | 1 | SPLIT | pill on the seam |
| 77 | 33.90 | f848 | 0.38 | **from** | 1 | SPLIT | pill on the seam |
| 78 | 34.28 | f857 | 0.34 | **not to** | 2 | SPLIT | pill on the seam |
| 79 | 34.62 | f865 | 0.46 | **copy them** | 2 | SPLIT | pill on the seam |
| 80 | 35.08 | f877 | 0.20 | **but** | 1 | SPLIT | pill on the seam |
| 81 | 35.28 | f882 | 0.56 | **to understand** | 2 | SPLIT | pill on the seam |
| 82 | 35.84 | f896 | 0.42 | **why** | 1 | SPLIT | pill on the seam |
| 83 | 36.26 | f906 | 0.36 | **certain** | 1 | SPLIT | pill on the seam |
| 84 | 36.62 | f915 | 0.46 | **pieces of** | 2 | SPLIT | pill on the seam |
| 85 | 37.08 | f927 | 0.52 | **content works** | 2 | SPLIT | pill on the seam |
| 86 | 37.60 | f940 | 0.38 | **so I can** | 3 | SPLIT | pill on the seam |
| 87 | 37.98 | f949 | 0.34 | **improve** | 1 | B-FULL | plain white, centre, y≈50% |
| 88 | 38.32 | f958 | 0.48 | **mine going** | 2 | B-FULL | plain white, centre, y≈50% |
| 89 | 38.80 | f970 | 0.44 | **forward** | 1 | B-FULL | plain white, centre, y≈50% |
| 90 | 39.24 | f981 | 0.16 | **you** | 1 | A-FULL | plain white, ONE word at a time, left of the head, y≈37% |
| 91 | 39.40 | f985 | 0.16 | **can** | 1 | A-FULL | plain white, ONE word at a time, left of the head, y≈37% |
| 92 | 39.56 | f989 | 0.20 | **build** | 1 | A-FULL | plain white, ONE word at a time, left of the head, y≈37% |
| 93 | 39.76 | f994 | 0.42 | **yourself** | 1 | A-FULL | plain white, ONE word at a time, left of the head, y≈37% |
| 94 | 40.18 | f1004 | 0.16 | **or** | 1 | A-FULL | plain white, ONE word at a time, left of the head, y≈37% |
| 95 | 40.34 | f1009 | 0.16 | **just** | 1 | A-FULL | plain white, ONE word at a time, left of the head, y≈37% |
| 96 | 40.50 | f1012 | 0.80 | **comment** | 1 | A-FULL | plain white, ONE word at a time, left of the head, y≈37% |
| 97 | 41.30 | f1032 | 0.32 | **and** | 1 | A-FULL | plain white, ONE word at a time, left of the head, y≈37% |
| 98 | 41.62 | f1040 | 0.14 | **send** | 1 | A-FULL | plain white, ONE word at a time, left of the head, y≈37% |
| 99 | 41.76 | f1044 | 0.16 | **you** | 1 | A-FULL | plain white, ONE word at a time, left of the head, y≈37% |
| 100 | 41.92 | f1048 | 0.16 | **over** | 1 | A-FULL | plain white, ONE word at a time, left of the head, y≈37% |
| 101 | 42.08 | f1052 | 0.52 | **mine** | 1 | A-FULL | plain white, ONE word at a time, left of the head, y≈37% |

---

## 5. The caption system: rules learned

### 5.1 Type
- **Font:** a neo-grotesk, bold (Inter Bold / SF Pro Display Bold), tracking −2 %, **all lowercase** except "I" and proper nouns ("Claude").
- **Size:** about 54 px on a 1080 canvas (cap height ≈ 38 px). That is small and quiet. The captions are a reading aid, not the show. The *graphics* are the show.
- **Colour:** always white (#FFFFFF). There is no keyword colour and no emphasis styling. Emphasis comes from the *graphics*, never from the caption.
- **Animation:** none. Chunks **hard-swap** on the word (see `capz_all.jpg` f0–11 and f37–48). A chunk appears on the first frame its first word is spoken. Chunks butt against each other, so there is no blank gap between words, except at sentence pauses longer than about 0.15 s.
- **Chunking:** 1–3 words, split on **natural speech units** ("to break down", "the whole thing", "frame by frame"). Never break inside a unit. Articles stick to their noun ("a skill", "the screen").
- **Editorial liberty:** the caption is allowed to differ from the audio. It says "it's super simple" where he says "super simple", and "a psychology" where he says "the psychology". On the CTA it **drops the keyword itself** ("Breakdown"), because the big title lockup carries that word.

### 5.2 Placement depends on what's behind the caption. This is the key pattern.
| what's on screen | caption placement | background box |
|---|---|---|
| **A-FULL** (talking head) | In the speaker's **negative space**. In the hook it's on the chest beside his raised hand (y≈54 %). After the hook it moves **beside the head, at eye level** (y≈37 %, x≈25–30 %), so the eye reads face → word with no travel. | **None.** Plain white with a very soft shadow. The dark shirt and room give the contrast. |
| **SPLIT** (B-roll top / A-roll bottom) | **Exactly on the seam**, centred horizontally. | A **dark translucent pill** (≈ rgba(30,30,30,0.6), radius ≈ 12 px, padding ≈ 14×6 px). The pill "stitches" the two halves together. |
| **B-WHITE** (designed graphic on off-white) | **Directly under the graphic.** The pill follows the graphic's bottom edge as the graphic moves or resizes (y 55–92 %). Exception: when the graphic is a phone feed, the caption sits **on** the phone screen. | A **light-grey pill** (≈ #B5B5B5 / rgba(0,0,0,0.25)) with white text. Low contrast on purpose, so it doesn't compete with the graphic. |
| **UI-DARK** (full-screen app recording) | Bottom third, **just above the app's own input bar** (y≈73 %). It looks like part of the UI. | A dark pill (#3A3A38) that matches the UI chrome |
| **B-FULL** (lifestyle) | Centre of frame | None |

**Rule of thumb:** a caption never covers the speaker's face, never covers the graphic that is explaining the line, and always sits where the eye already is: by the face, on the seam, or under the object.

### 5.3 Caption rhythm vs the edit
- The caption changes about **2.4× per second**. The picture changes about every 2.3 s. So there are roughly 5–6 caption swaps per shot. The captions carry the pace even during long holds (the UI-DARK scroll is 6.3 s).
- **The CTA switches to one word per chunk** (39.24 → end, every word alone). The faster swap rate tells you "this is the important bit, listen".
- **Title lockups are separate from captions.** There are 3 of them: the hook "Turn Claude into a content machine", the product name "The Video breakdown", and the CTA keyword "Breakdown". All three share one style: a huge heavy grotesk, a **silver vertical gradient** (white → #9A9A9A) and a soft drop shadow, with a small kicker word above ("Turn", "The") and a sub-line below ("into a content machine", "breakdown"). Lockups appear only on the hook, the product name and the CTA keyword.

---

## 6. How the B-roll and motion graphics are chosen

1. **Every noun or claim that can be shown, is shown.** "video got views like this" → low-view thumbnails. "skill" → folder icon. "frame by frame" → a phone with a scan. "views" → a views chip. "template" → a highlight box on the real template.
2. **Lists become stacked chips.** "what's on the screen, the pacing and the psychology" → 3 chips, each popping on its word.
3. **Abstract "AI is analysing" = a green scan.** A light band sweeps over the media every time Claude "reads" or "watches" something (shots 3, 4, 7, 9c), and a rotating radar sweep is used for "searching" (shot 11). This is the reel's one recurring motion motif.
4. **Two graphic worlds, never mixed in a frame:**
   - a clean **off-white canvas** for the explainer graphics (concept);
   - a **dark real UI** for the proof (the actual product working).
   The explainer is clean. The proof is raw and real.
5. **Face back on the beats that need trust or a turn:** "Normally…" (problem), "But" (turn), "Let me show you", "Personally" and the CTA. The face is off-screen during pure mechanism explanation.
6. **Split screen is the default bridge.** When a line is half concept, half personal, the graphic goes on top and the face below. In the montage, both halves become B-roll to raise the energy.
7. **Lifestyle montage = the emotional/authentic section.** Real-life ECU shots (eye, glasses reflection, hands on keys, pen) cut fast, at 0.4–1.0 s. It's the only place the video isn't "explaining".
8. **Loop:** the video ends on the same wide framing as frame 0, so a replay feels seamless.
