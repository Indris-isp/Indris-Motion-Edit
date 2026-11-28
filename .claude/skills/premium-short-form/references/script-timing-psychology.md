# Animation ↔ script: timing and psychology

How the visuals are timed against the words, and why. Measured on V01–V15. The raw data is in `docs/references-data/stats.json`: cut times, cut-to-word offsets and word timings.

## 1. Measured pacing
| Video | Mode | Length | Visual changes | Avg beat | Median shot | Longest hold | Words/s | Share not on the speaker's face (approx.) |
|---|---|---|---|---|---|---|---|---|
| V01 Pierre | A | 43.8 s | 26 | 1.62 s | 1.50 s | 5.2 s (CTA) | 4.42 | 11% B-roll (+ text on ~70% of shots) |
| V04 Jack | A | 58.4 s | 43 | 1.33 s | 1.28 s | 5.4 s (host list) | 4.59 | 45% |
| V02 Sleep | B | 31.7 s | 11 | 2.64 s | 2.25 s | 7.4 s (recap) | 4.24 | 32% |
| V05 Creator | B | 34.4 s | 15 | 2.15 s | 2.12 s | 4.8 s (thesis) | 3.75 | 42% |
| V06 Red light | B | 56.0 s | 20 | 2.67 s | 2.33 s | 5.2 s (thesis) | 3.73 | 42% |
| V07 Alcohol | B | 40.4 s | 27 | 1.44 s | 1.40 s | 4.0 s | 3.84 | 43% |
| V03 POV | C | 40.5 s | 18 | 2.13 s | 2.00 s | 4.1 s | 4.22 | 22% full cards (+ text on every shot) |
| V08 Entry 1 | C | 10.6 s | 6 | 1.51 s | 1.37 s | 3.2 s | 3.41 | 100% |
| V10 Entry 3 | C | 10.6 s | 5 | 1.76 s | 1.53 s | 3.1 s | 3.04 | 100% |
| V11 Entry 2 | C | 10.6 s | 9 | 1.06 s | 1.00 s | 1.9 s | 3.07 | 100% |
| V12 Brain | D | 29.4 s | 10 | 2.67 s | 2.33 s | 4.8 s | 4.27 | 39% |
| V13 Aussie | D | 23.0 s | 8 | 2.55 s | 2.70 s | 3.9 s | 3.50 | 51% |
| V14 UAE | D | 15.3 s | 6 | 2.19 s | 1.52 s | 5.8 s (list) | 2.57 | 17% (+ overlays on every face shot) |
| V15 2025 | D | 22.5 s | 9 | 2.25 s | 1.90 s | 5.0 s (proof) | 2.72 | 75% |

**What this means:**
- **Beat length by mode:**
  - A: **1.3–1.6 s**
  - B: **2.1–2.7 s** (1.4 s when the story is a fast "you" narrative, as in V07)
  - C: **1.0–1.8 s**
  - D: **2.2–2.7 s**
- **Nothing holds longer than ~5.8 s.** Holds over 4 s happen only for (a) the thesis/close, (b) a CTA card, (c) a list that is *building* on screen, or (d) a recap (V02 at 7.4 s is the only outlier, and it sits at the end).
- **Speech is dense.** Podcast clips run at **3.5–4.6 words/s**; normal conversation is ~2.5–3. Pauses within a speaker's turn are removed. Presenter-to-camera clips (V14, V15) keep a natural 2.6–2.7 words/s, and VO pieces run at ~3.0–3.4.
- **About 40–50% of the runtime is not the speaker's face** in modes B and D. The fewer camera angles the source has, the higher this goes (V15: one camera → 75%).

## 2. Where the cuts land (measured)
On the five videos with frame-accurate cut detection (V01, V04, V05, V06, V12; 112 cuts inside speech):

| Cut lands within … of a **phrase start** (after punctuation or a ≥0.12 s gap) | References | Random cut times |
|---|---|---|
| ±0.10 s | 25% | 10% |
| ±0.15 s | 44% | 16% |
| ±0.25 s | **63%** | 26% |

The median cut-to-nearest-word offset is −0.02 s.

- **About 2 in 3 cuts land on the start of a phrase or sentence**, which is 2.4× more often than chance. These are the "new thought = new picture" cuts.
- **The other ~1 in 3 land on a keyword inside the phrase.** These are punch-ins and B-roll inserts timed to the noun ("…come from **sales reps**", "…you will **strike oil**", "…dopamine **surge**").
- Cuts are not placed between syllables at random. When in doubt, cut **0–2 frames before the first word of the phrase**, so the eye arrives with the ear.
- **Speaker handoffs** (V13): cut *on* the new speaker's first word, and cut *back* during the pause before the original speaker resumes.

## 3. Hooks: what the first 3 seconds do
| Hook type | Line | Visual on frame 0–2 s | Videos |
|---|---|---|---|
| **Number / result** | "$14 million in the past year?", "$120,000 in pre-sales in three days", "About 8% of people…", "thousands of investors every month" | The number **on screen, counting up**, within 2 s | V01, V05, V07, V14 |
| **Curiosity question → surprising answer** | "What's the 30,000 ft view on perfect sleep?", "What's the one thing that would impact your skin the most?" | Elegant serif keyword; V06 adds a title banner question | V02, V06 |
| **Identity / introduction** | "Today we are here with Jack Mason…", "I've got a mind that likes to solve problems" | Name giant behind a silhouette (V04); cinematic profile CU + gold script word (V12) | V04, V12 |
| **Hard truth / aphorism** | "When you're broke, it's like arithmetic", "Time doesn't wait for you to catch up" | Big stacked type / a surreal object (pocket watch) | V03, V08, V10, V11 |
| **Audience callout + superlative** | "The biggest challenge for Aussie creators…" | Keyword + a speaker → avatar iris within 1.1 s | V13 |
| **Feeling + right now** | "Every new week in 2025 is a new life" | Huge "2025" | V15 |

**Rules:**
- The first word is spoken on **frame 0**: no logo, no greeting, no music lead-in.
- The hook line is a **complete sentence of 1.6–5 s**.
- The **first designed visual arrives by 0.5–2.4 s**. All 15 videos have a visual change or a keyword hit inside the first 2.4 s.
- **Open on the face** in podcast clips: the human first, the visual second.

## 4. Story skeletons
| Mode | Skeleton | Example |
|---|---|---|
| A: hype | Hook number (host) → host reaction → status proof (B-roll) → **one** host question → 3–5 guest one-liners, each with a giant keyword → CTA | V01, V04 |
| B: visual story | Hook stat/question → why (science) → **"you" scenario** (AI scene) → second voice for credibility → thesis close | V06, V07, V05 |
| C: VO motion graphics | 4–5 aphorisms, one surreal scene each → a sting line ("someone else takes your spot") | V08–V11 |
| D: idea worlds | Hook claim → widen ("I" → "people") → contrast word ("but"/"while") → list of 3–4 concrete items → punchline / callback | V12–V15 |

Shared mechanics:
- **The strongest line is the last line.** Endings are a thesis (V05, V06), a punchline (V12, V13), a callback to the hook (V07's "8%" returns mid-clip; V15's "2025"), a cliffhanger cut mid-sentence (V04: "It really started changing when—"), or a host reaction (V07: "Wow.").
- **CTA when the goal is the full episode or engagement:** "Comment "PIERRE" for full episode" (V01), "COMMENT "JACK"…" with a thumbnail card (V04), "Comment "1/2/3" to vote" (Frame War). Clips without a CTA (V12–V15) end hard on the last word, which makes them loop.
- **Lists of 3–4** appear in almost every clip. Each item gets its own visual unit: a tag, pill, card or shot.

## 5. Interviewer / host usage
| Use | When | Example |
|---|---|---|
| Host says the hook | Only if the host's line *is* the number/claim | V01 "$14 million…, you said?" |
| Host reaction (face) | The first frame of the reaction word; it tells the viewer how impressed to be | V01 "Holy f\*ck" |
| One host question | Bridges into the answer; topic-change glitch before it | V01 at 10.7 s |
| Host reaction (audio only or final shot) | Confirms the point; can end the clip | V07 "Wow." |
| Host carries a list | Only on the host's own line | V04 sales team / paid marketing / ops / HR |
| Host removed entirely | Mode D; at most a 0.2–0.3 s room cutaway | V12 |
| **Never** | Interrupting the guest's explanation mid-thought | — |

## 6. Word → visual mapping (what gets visualised)
| Script element | Visual treatment | Examples |
|---|---|---|
| Number, money, %, time | Giant count-up or typed number; orange/accent; held until the next phrase | $14,000,000, $120,000, $100,000/M, 8%, 10 PM, 6PM, 60mins, 2025, 10 YEARS, 4/5 years |
| Proper noun / name / brand | Giant text behind the subject; lower third; logo | JACK MASON, Catherine Goetze, Dermalux |
| Abstract science term | 3D render + serif label | mitochondria, prefrontal cortex, gene variant, fibroblast |
| Metaphor | The literal metaphor, designed | strike oil → Chevron; fire → comic burst; problems → lightbulb; consistency → running man across worlds |
| "You…" scenario | AI photoreal scene acting it out | 3 am kitchen, waking up, mirror, party |
| Status / proof claim | Real proof footage (Instagram, stage, YouTube grid, graduation) | V01, V04, V15 |
| List item | One tag / pill / card / icon per item, stacked | sales team…, Skin Cancer / Signs Of Aging, AI tools |
| Process / requirement | UI: sliders, checklists, app click-through | V14 |
| Emotion / opinion / "I think" | Stay on the face; caption only, keyword in the accent | "frustrating", "craziest feeling", "too scared" |
| Profanity / negative | Red, censored with \* | F\*CK, CAN'T DO, failed, p\*\*n |
| Punchline / thesis | The tightest face shot, minimal text, held | V05 "unfair advantage", V12 "access to" |

## 7. Visual psychology (why each choice works)
| Script moment | Visual choice | Psychological effect |
|---|---|---|
| Big number / result | Giant glowing number, count-up | Instant status signal: the brain registers magnitude before meaning, and the rolling motion holds the eye until it lands |
| Status claim about the guest | Lifestyle/proof B-roll (car, stage, Instagram) | Social proof: the claim becomes believable |
| Host reaction | Cut to the host's face | Borrowed emotion: tells the viewer how impressed to be |
| "You…" scenario | AI scene acting it out | Self-identification: "that's me" keeps them watching |
| Abstract science term | 3D render | Makes the invisible concrete; perceived authority |
| Metaphor | A literal designed metaphor | Dual coding: word + image is remembered better than either alone |
| Same idea continues | Camera moves *inside* the same world (no cut) | Continuity: the viewer feels one thought building rather than a list of fragments |
| New idea | New world / new angle / transition | Event boundary: resets attention and marks a "new chapter" |
| List | Stacked tags / counted items | Chunking: feels structured and complete; the viewer waits for the list to finish |
| Negative / swear word | Red | Threat/urgency colour; emphasis |
| Emotion, opinion, punchline | Stay on the face, slower cut, less text | Intimacy and trust: the face carries feeling better than any graphic |
| Constant motion | Push-ins, drift, a change every 1–3 s | Pattern interrupt; prevents the scroll-away |
| One accent colour (from the footage) | Consistent highlight | The viewer learns "this colour = the important word", and the frame feels designed rather than decorated |
| Before/After or Raw/Final packaging | B&W raw beside the colour final | Contrast effect: the edit's value is shown, not claimed (a portfolio format) |
| Ending | Cliffhanger, thesis + comment keyword, or a hard stop | Open loop (Zeigarnik) and a low-friction action → comments and loops boost reach |

## 8. Timing rules (checklist)
1. The first word on frame 0; the first visual change or keyword hit by 2.4 s.
2. Cut 0–2 f before a phrase start (about 2 in 3 cuts), or on the stressed keyword (about 1 in 3).
3. Beat length: A 1.3–1.6 s · B 2.1–2.7 s · C 1.0–1.8 s · D 2.2–2.7 s. Vary it: two quick beats, then one longer hold at the emotional line.
4. No hold over ~5 s unless it's the thesis, a CTA, a recap or a list building on screen.
5. A number is spoken AND shown at the same time; a count-up lands on the number's syllable.
6. One visual unit per list item, synced to each item.
7. Remove pauses within a speaker's turn; keep a breath only at speaker handoffs.
8. A transition only at a topic change (no more than one per 5–8 s); a hard cut back to the face.
9. The strongest line goes last. End with a CTA (A/B when promoting an episode), or a hard stop that loops (D).
