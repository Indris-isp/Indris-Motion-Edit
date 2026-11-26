# Editing Pattern v3: "Idea Worlds" Podcast Edit

**Source:** the 4 new clips added to the Drive `Pattern` folder on 2026-11-26. The older clips in that folder (Catherine, red light, alcohol gene, vision board, nautical) and in the `Podcats` folder were already analysed in `docs/editing-pattern-v2-storytelling.md` and `docs/editing-style-breakdown.md`. This document cross-references them where they add to the answer.

**Method:**
- Word-level transcripts: faster-whisper `medium.en` (`transcripts/P*_words.json`).
- Cut points: ffmpeg scene detection, threshold 0.2.
- Visual check: every clip at 2 fps (`sheets/contact_*.jpg`), and every transition at 10 fps (`sheets/P*_transitions_10fps.jpg`).
- One reference frame per camera angle (`sheets/P*_camera_angles.jpg`).
- The shot-by-shot table for all 4 clips, with words, on-screen text, keyword styling and transition type, is in **`shots.csv`**.

| # | Clip | Format | Length | Visual changes | Avg beat | Face vs graphic |
|---|---|---|---|---|---|---|
| **P1** | "Problem-solving brain": the real client podcast edit | 1080×1920, 30 fps | 29.4 s | 11 | **2.7 s** | 61% face / 39% full-screen 3D graphic |
| P2 | "Aussie creators": two-speaker podcast (shown in a Raw-vs-Final frame) | 720×1280, 60 fps | 23.0 s | 9 | 2.6 s | 49% / 51% |
| P3 | "UAE property": solo presenter (shown in a Before/After macOS frame) | 720×1280, 30 fps | 15.3 s | 7 | 2.2 s | 83% face (with heavy overlays) / 17% |
| P4 | "Every week in 2025": solo creator (shown in a Before/After frame) | 720×1280, 30 fps | 22.5 s | 10 | 2.2 s | 25% / 75% |

P2–P4 are portfolio showcases. The **Final/After** panel is the edit itself, and that is what's analysed below. The B&W **Raw/Before** panel shows the client's source, which tells us what the editor added.

---

## 0. Transcripts (word-timed; `|` = cut or visual change)

### P1: Problem-solving brain (one voice, no interviewer audio)
```
00.00  I've got a mind that likes to solve problems.                         ← HOOK (identity line)
01.87 | I'm just trying to give it good problems to solve.
03.77 | I think lots of people have a problem-solving brain,                 ← widen to "people"
06.10 | but only some people have great problems that they're going to solve with it.   ← CONTRAST ("but")
09.30 | It's | very difficult to worry about the future when you feel like you're moving yourself toward it.  ← INSIGHT
12.70 | That problem-solving brain thing is interesting, because I wonder how many people
        churning themselves up inside                                        ← TURN (reflection → dark side)
17.47 | because they have a brain that likes to solve problems,
19.50 | but they don't have any good problems to solve.                      ← restates the thesis
21.57 | So they pay attention to politics or porn or their ex or a
25.47 | situation that's outside of their control in some foreign country that they can't get access to.  ← LIST → hard stop
```

### P2: Aussie creators (Speaker A = hair bun, Speaker B = black cap)
```
00.00  A: I think the biggest challenge for Aussie creators is finding community,   ← HOOK (audience callout + "biggest")
03.80 |A: because if you think about it, like, you and I have been doing this
05.60 |   for four or five years                                                   ← number
07.95 |   and so far there's been no spaces for us to connect with anyone.
11.80 |B: It's really frustrating, because like                                    ← 2nd voice = emotion/agreement
13.45 |   where do you go to collaborate with other creators,
16.30 |   and also when you have questions, like, who do you ask?
19.20 |A: And I think tall poppy syndrome is really big here in Australia.         ← PUNCHLINE (named diagnosis)
```

### P3: UAE property (solo)
```
00.00  The UAE attracts thousands | of international investors every month,        ← HOOK (stat + place)
03.20 | and while the opportunity | is exceptional, the process must be structured, ← CONTRAST ("while")
06.60 | especially for buyers abroad.                                              ← WHO it's for
08.05 | A successful remote purchase requires clear documentation, verified reports,
        transparent market data                                                    ← LIST (built item by item)
13.80 | and reliable oversight.                                                    ← last list item = end
```

### P4: Every week in 2025 (solo)
```
00.00  It feels like | every new week in 2025 | is a new life.                     ← HOOK (feeling + now)
06.00 | Like we're starting from scratch.
07.40 | There is this new AI tool that we're integrating,                          ← LIST item 1
10.00 | there is this new strategy,                                                ← item 2
12.00 | and we're hiring more people                                               ← item 3
13.80 | to help us with all of that.
15.00 | So I've been creating content for 10 years, but I've never experienced anything
20.00 | like this, like 2025.                                                      ← CALLBACK to the hook
```

---

## 1. How the hook is chosen and shaped

**What the four hooks have in common:**

| | Hook line | Length | Type | Who it names |
|---|---|---|---|---|
| P1 | "I've got a mind that likes to solve problems." | 1.7 s | **Identity line.** The viewer checks it against themselves ("do I?") | "I" → becomes "people" by 3.8 s |
| P2 | "The biggest challenge for Aussie creators is finding community." | 2.9 s | **Superlative + audience callout** | "Aussie creators" |
| P3 | "The UAE attracts thousands of international investors every month." | 3.2 s | **Stat + place** | "international investors" |
| P4 | "Every new week in 2025 is a new life." | 4.8 s | **Feeling + right now** | "we" (creators/teams) |

**Selection rules seen in all four:**
1. **The first spoken word is on frame 0.** There is no title card, greeting, host question, logo or music lead-in.
2. **The hook is one complete sentence that makes sense on its own**, 1.7–4.8 s long. The editor starts the clip at a sentence start, never mid-thought, even if the source clearly continues from an earlier question.
3. **It names a group the viewer belongs to** within 4 s: problem-solvers, Aussie creators, investors, 2025 creators. That's how the viewer self-selects.
4. **It sets up a contrast that pays off later.** P1: "a mind that likes problems" → "but only some have *great* problems". P3: "opportunity" → "while… must be structured". P4: "new life" → "never experienced anything like 2025".
5. **The hook is not the most shocking line.** It's the line that *opens a question*, and the strongest line is saved for the ending (see §2).

**How the hook is shaped visually:**
- **Open on the face, then go to the first visual within 0.5–1.9 s.** All four clips open on the speaker. The first graphic arrives at 1.87 s (P1), 1.10 s (P2), 1.50 s (P3 glitch punch-in), and 0.50 s (P4). The face establishes the human, and the first designed visual lands on the *second* phrase.
- **The hook's keyword gets the hero caption treatment straight away:** "*Problems*" in gold script (P1), "**biggest**" in orange bold (P2), "International Investors" in big white (P3), and "**2025**" in huge outlined numerals (P4).
- **P1 opens on its most cinematic angle:** a side profile with warm bokeh, the speaker looking off-camera and a slow push-in. It feels like a documentary, not a podcast.
- **The hook's number is made physical:** P3's "thousands… every month" becomes a live ticking counter in a glass widget, and P4's "2025" fills the frame.

---

## 2. How the story plays out

The four clips share one skeleton:

```
HOOK (a claim or feeling, 1 sentence)
 → WIDEN  (from "I" to "people" / "us")
 → CONTRAST WORD  ("but" / "while" / "so")
 → LIST OF 3–4 CONCRETE ITEMS  (each item = its own visual beat)
 → PAYOFF = the strongest line, ending on its last word (often a callback to the hook)
```

| Beat | P1 | P2 | P3 | P4 |
|---|---|---|---|---|
| Hook | "I've got a mind that likes to solve problems" | "biggest challenge… finding community" | "UAE attracts thousands…" | "every new week in 2025 is a new life" |
| Widen | "lots of people have a problem-solving brain" | "you and I… four or five years" | "international investors every month" | "we're starting from scratch" |
| Contrast | "**but** only some have great problems" | "no spaces… to connect" → 2nd speaker: "really frustrating" | "**while** the opportunity is exceptional, the process must be structured" | — |
| Insight / turn | "difficult to worry about the future when you're moving toward it" → "I wonder how many people are churning themselves up inside" | "where do you go… who do you ask?" | "especially for buyers abroad" | — |
| List (3–4) | politics · porn · their ex · a foreign country | collaborate · questions | documentation · reports · market data · oversight | AI tool · strategy · hiring |
| Payoff | "…that they can't get access to." (hard stop) | "tall poppy syndrome is really big here in Australia." | "…and reliable oversight." | "never experienced anything like this, **like 2025**." (callback) |

**Story rules:**
- **The ending is the punchline, and nothing follows it.** None of the four has an outro, a CTA card, a "follow for more" line, or a reaction after the last word. This differs from v1 (Pierre/Jack), which ended on a comment-keyword CTA. The last word is held for only ~0.2–0.4 s, which makes the clip loop well.
- **The clips argue a point; they don't tell a chronological story.** No "first this happened, then that". Each clip is one idea that gets more specific as it goes: abstract → concrete.
- **The clip doesn't resolve the solution.** P1 never says "so find a good problem". The viewer finishes the thought, which drives comments and saves.
- **The callback:** P4 ends on "2025", the hook's own word, and P1's middle repeats the hook ("a brain that likes to solve problems") before the turn. Repeating the hook's words near the end makes the clip feel complete.

---

## 3. How the speaker explains their point

**Delivery (what the editor picks *for*):**
- **P1:** the speaker never looks into the lens. They look off to the interviewer and think out loud: a head scratch at "interesting" (12.9 s), open-hand gestures on "churning themselves up inside", and a lean in on the list. The editor keeps the thinking gestures because they read as honesty.
- **P2:** two friends finishing each other's point. A gives the facts, B gives the feeling ("It's really frustrating"), and A comes back with the diagnosis.
- **P3/P4:** presenter-style delivery to camera at a steady ~2.6–2.7 words per second, slower than P1's 4.3 words per second.

**The main rule: the face shows feelings and opinions, the graphic shows things and numbers.**

| Goes on the **face** | Goes on a **full-screen graphic** |
|---|---|
| Identity and opinion: "I've got a mind…", "I think the biggest challenge…" | Abstract nouns: problems → lightbulb, brain → 3D brain, community → orbiting avatars |
| Emotion words: "frustrating", "difficult to worry", "churning themselves up", "starting from scratch" | Numbers: "4 or 5 years" → rising bars, "10 years" → channel grid + "10 YEARS", "2025" |
| **The punchline** (always on the face, in a tighter shot) | Lists of things: AI tools, a strategy chart, incoming calls for "hiring" |
| Judgement lists that carry emotion (P1: politics, porn, ex) | Processes: "the process must be structured" → UI sliders |

So the speaker *explains* while the graphic *illustrates* the noun they just said, and the face comes back whenever they *feel* or *conclude* something.

**How each explanation builds** (the speaker's logic, which the edit preserves):
1. Say it about yourself ("I've got a mind…", "you and I…").
2. Generalise it ("lots of people…", "Aussie creators…").
3. Split the group ("but only some…").
4. Make it concrete with examples (the list).
5. Stop on the most vivid example.

---

## 4. What's cut, what's kept, and where transitions go

**Cut (evidence from the audio and frames):**
- **Every pause inside a speaker's turn.** P1 has no gap longer than 0.2 s between words, at 4.3 words per second; normal speech is about 2.5–3. Either every breath was removed or the audio was slightly sped up. P3 and P4 keep gaps of ≤ 0.42 s, so they're tighter than raw but not crushed.
- **The interviewer's question and any preamble.** P1 starts on the guest's answer. The interviewer exists only as a 0.27 s room cutaway (their suited hand and a drink can on the desk at 9.30 s).
- **Everything after the punchline:** no "yeah", no laugh, no follow-up.
- **Probably a join at P1 12.70 s.** "That problem-solving brain thing is interesting…" reads like a reflection on the earlier lines, which suggests two moments were joined. The editor **hides the join with an angle change** (front medium → 3/4 from the other side), right on the first word "That".

**Kept on purpose:**
- **Conversational connectors and some fillers:** "like" (P2 ×3, P4 ×3), "so", "because", "and". These keep the voice sounding like speech, not a script.
- **A pause at the speaker handoff:** the 0.5 s gap before A's last line in P2 is the only real pause kept in any clip. Handoffs get air; sentences from the same speaker don't.
- **Profanity in the audio, censored in the caption** ("porn" → `p**n`).
- **Thinking gestures and off-camera eyelines** (P1).

**Where transitions are placed:** every visual change lands **on the first syllable of a new sentence or on a contrast word**, never mid-phrase:

| Clip | Cut times → the word it lands on |
|---|---|
| P1 | 1.87 "I'm" · 3.77 "I think" · 6.10 **"But"** · 9.30 "It's" · 12.70 "That" · 17.47 "because" · 19.50 **"but"** · 21.57 **"So"** · 25.47 "situation" (punch-in mid-list) |
| P2 | 1.10 "Aussie" · 3.80 "because" · 5.60 "four" · 7.95 "so far" · 11.80 B's first word "It's" · 13.45 "where" · 16.30 "and also" · 19.20 (silence before "And") |
| P3 | 1.50 "international" · 3.20 **"and while"** · 4.05 "opportunity is" · 6.60 **"especially"** · 8.05 "A successful" · 13.80 "and reliable" |
| P4 | 0.50 "every" · 4.40 "a new life" · 6.00 "Like we're" · 7.40 "There is" · 10.00 "there is" · 12.00 "and we're hiring" · 13.80 "to help" · 15.00 "So I've" · 20.00 "like this" |

**Transition types (from the 10 fps strips):**

| Transition | Where | Use |
|---|---|---|
| **Hard cut** | the majority; almost every *return to the face* | Graphic → face, speaker change, angle change |
| **In-world camera move**: whip-tilt or push with motion blur *inside the same 3D scene* | P1 3.77, P1 19.50 | The next sentence about the *same idea* stays in the same world, and the camera moves to new text. The previous line stays visible at the top, which keeps the thread. |
| **Blur whip between worlds** | P1 6.10 (bulb → puzzle) | A new idea, still in the graphic part |
| **Iris/circle mask:** the face shrinks into an avatar circle | P2 1.10 | The speaker becomes part of the "community" graphic |
| **Vertical-stripe glitch wipe** | P2 3.80, 5.60, 13.45 | Into and out of graphic cards |
| **1-frame RGB-invert glitch flash + punch-in** | P3 1.50, 13.80 | Opens and closes the clip like bookends |
| **UI click-through:** an app icon pops up, a cursor clicks it, and it expands into a full-screen UI | P3 3.6–4.05 | "Opportunity" → the product UI |
| **Defocus / rack blur** | P3 8.05 | Into the long list section |
| **Scroll-out** (the card content scrolls up and away) | P4 9.8 | Between list items |

**Pattern:** stylised transitions take you *into* a graphic world, and a hard cut brings you *back to the face*.

---

## 5. When the interviewer speaks and when the guest speaks

**In these four clips the interviewer is never heard.** The patterns:

- **P1 (guest-only mode):** 100% guest audio. The interviewer appears once, visually: the 0.27 s room-wide cutaway at 9.30 s, which shows the interviewer's side of the desk. It acts as a **re-entry shot** that puts you back in the room after 7.4 s of graphics, before cutting to the guest's face.
- **P2 (two-voice mode):** **A opens (0–11.6 s) → B joins for the emotional middle (11.8–18.6 s) → A returns for the punchline (19.2–23 s).**
  - The **cut to B lands on B's first word** (11.80 s vs "It's" at 11.84 s), so the viewer sees the new speaker as they start.
  - The **cut back to A lands in the pause before A speaks** (19.2 s; "And" starts at 19.46 s). B's last caption ("ask?") stays on for ~0.3 s over A, which smooths the handoff.
  - The second voice is never used to open or close. Its job is to agree and add emotion.
- **P3 and P4:** solo talking heads with no second voice.

**Interviewer rules across all the reference sets** (combining this set with v1/v2):

| Where the host speaks | Example | Rule |
|---|---|---|
| At the very start, as the setup | v1 Pierre: "$14 million in pasture, you said?" | Only if the host's line *is* the hook (a number or claim) |
| As a one-word reaction, audio only | v2 alcohol clip: "Oh yeah." 16.8 s, "Yeah." 36.2 s | Kept because it confirms the guest's point. Never cut to the host's face for it |
| As the last word | v2 alcohol clip: "Wow." at 39.8 s ends the clip | Only when the reaction *is* the payoff |
| Asking the question | v1 Pierre: one question at 10.8 s | At most one, kept short. **v3 removes it entirely** |
| Mid-explanation | — | **Never.** The guest's explanation is never interrupted |

---

## 6. Camera changes: how often, which angle, and why

### P1: 6 angles in 29 s (`sheets/P1_camera_angles.jpg`)

| Angle | Shot | When | Why this angle here |
|---|---|---|---|
| **A** | Side-profile CU, warm amber bokeh, looking off, slow push-in | 0.00–1.87 (hook) | The most cinematic frame opens the clip, so it reads as a "film", not a podcast |
| **B** | Room wide: shelves, candle, interviewer's hand | 9.30–9.57 (0.27 s) | A re-entry shot that re-establishes the room after the graphics |
| **C** | Front medium with mic, purple window background | 9.57–12.70 | Calm insight line → a calm, neutral frame |
| **D** | 3/4 medium from the *opposite* side | 12.70–17.47 | A new thought ("That… is interesting") gets a new side. It also hides a probable edit join |
| **E** | Front CU, orange/teal bokeh | 21.57–25.47 | The list starts → closer, more intense |
| **F** | Tighter CU (punch-in) | 25.47–29.37 | The climax ("outside of their control… access") → tightest frame |

- **The same angle is never used twice**, and the face never holds more than 4.8 s.
- **The face angle changes every ~3 s of face time** (1.87 / 0.27 / 3.13 / 4.77 / 3.90 / 3.90 s).
- **Shot size tightens toward the end:** CU → wide → medium → medium → CU → tight CU. The framing gets closer as the emotional intensity rises, and the punchline is always in the tightest shot.
- **The sides alternate:** profile from one side (A), then front (C), then the opposite 3/4 (D), then front again (E/F). That keeps the eyeline lively.

### P2: one camera per speaker (`sheets/P2_camera_angles.jpg`)
An angle change happens only when the speaker changes. Variety comes from the graphics instead (51% of the runtime).

### P3: 2 cameras (front and side) plus digital punch-ins (`sheets/P3_camera_angles.jpg`)
The **side angle is used for the contrast sentences** ("and while…", "especially for buyers abroad"). The **front angle is used for statements and the list**. Punch-ins with a glitch flash mark the start and the end.

### P4: one camera
The camera never changes. **75% of the runtime is graphics** to make up for it.

### The rule linking angles and graphics
| Clip | Camera angles available | Share of full-screen graphics |
|---|---|---|
| P1 | 6 | 39% |
| P3 | 2 + punch-ins | 17% (but overlays on almost every face shot) |
| P2 | 1 per speaker | 51% |
| P4 | 1 | 75% |

**The fewer angles the source has, the more of the runtime goes to graphics.** Aim for a visual change every ~2.2–2.7 s either way.

### How a clip is assembled (the editor's order, reconstructed)
1. Pick a self-contained span: a sentence-start hook, a contrast, a list, and a punchline. Trim it to the last word.
2. Strip the pauses inside each speaker's turn. Keep a breath only at speaker handoffs.
3. Tag every sentence as **FACE** (feeling, opinion, punchline) or **GRAPHIC** (noun, number, list item, process).
4. Make each GRAPHIC idea one **3D "world"**: a bulb, a puzzle, a brain, a calendar field, a glass UI card. Follow-up sentences about the same idea stay in that world with a camera move rather than a cut.
5. Give every FACE beat a different angle. Tighten toward the punchline, and use a 0.2–0.3 s room-wide shot to re-enter the room after a long graphic run.
6. Put each cut on a sentence start or a contrast word ("but", "while", "so", "especially").
7. Add captions (below), then end on the last word with no outro.

---

## 7. Captions and graphic design (for rebuilding)

**Speaker shots (P1 is the reference):**
- Small white sans (Inter/SF style, ~42 px at 1080 w), centred at ~68–72% of the frame height, sitting **over the chest/mic**, not at the bottom edge.
- Chunks of 2–4 words, revealed **word by word**: each word fades and blurs in on its timestamp, and later words start out dimmed.
- **One hero keyword per chunk**, 2.5–3× larger, overlapping the white line beneath it:
  - P1: gold serif *script* italic with a warm glow ("Problems", "Brain", "Churning", "Control", "Access").
  - P2: orange heavy sans plus a script secondary word ("biggest" / *challenge*).
  - P3: neon purple heavy sans plus glass "pill" tags for list items.
  - P4: script or neon cyan ("*Life*", "*Scratch*", "*like 2025*").

**Graphic worlds:**
- P1: cream paper background, soft shadows, orange 3D objects (bulb, puzzle pieces, brain, curved ribbon road). Text is dark grey sans typed word by word, with the hero noun as **big orange 3D-extruded bold** ("Problem's", "Brain"). The camera is always slightly tilted or drifting, never static.
- P2: peach-to-orange gradient cards, memoji avatars, bars, chat bubbles. A **red flash** shows failure ("no spaces… connect").
- P3: black with neon purple, glassmorphism UI widgets, sliders, an app icon with a cursor.
- P4: periwinkle glass cards, AI-tool logos with check marks, a line chart, iOS call notifications, a restyled screenshot of the creator's real YouTube grid as proof.

**One accent colour per clip, taken from the footage:** P1 warm amber → gold/orange, P3 dark suit studio → neon purple, P4 cool backdrop → periwinkle.

**Don't copy the reference typos:** "Problem's", "Becuae", "dont", "Controll", "Verifyed", "contents".

**Portfolio frame (P2–P4):** a B&W "Raw file / Before" panel (small, left, behind) and a colour "Final Video / After" panel (large, right, in front) on a gradient that matches the clip's accent. P3 also adds a macOS window bar and a tool dock (Ae · Pr · IG · YT · TikTok). Use this to showcase your own edits.

---

## 8. v3 compared with the earlier patterns

| | v1 (Pierre/Jack) | v2 (Catherine/red light) | **v3 (this set)** |
|---|---|---|---|
| Host | Opens, reacts, asks | Audio reactions only | **Removed** (visible once as a cutaway) |
| Graphics | Text + some B-roll | Literal B-roll per noun | **3D "idea worlds" with camera moves inside them** |
| Beat length | ~1–1.3 s | ~2–3 s | **~2.2–2.7 s** |
| Camera | 2 angles | 1–2 angles | **Up to 6 angles, tightening toward the punchline** |
| Ending | Comment-keyword CTA | Thesis line | **Hard stop on the last word (loopable)** |
| Caption hero | Bold/red | Elegant | **Gold script on the face / orange 3D in the graphics** |
