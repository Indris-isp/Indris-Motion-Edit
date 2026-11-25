# Design System: scenes, colours, fonts, textures, layouts

## 1. What the Figma board says (designer's own notes)
The board (`Z55tmJ5L4ZxoAcDlBNEVn0`, Page 1) is split into four labelled columns of reference screenshots (taken from the videos), plus a "References" column holding all of them:

| Column | Designer's note (verbatim intent) |
|---|---|
| **A-Roll Captions** | "In the A-roll the captions have **2 styles, Medium and Bold** font combinations, and also an animation **highlighting the important words**." |
| **B-Roll Captions** | "B-rolls are **sourced online and some are AI generated**. Captions are a **combination of Medium and Bold in Inter**. The designs are placed by **design principles**." |
| **Animation** | "Animations are done on a **gradient background**, and on a **natural background with multiple elements**. Most images are **AI generated: all images generated separately and combined in a single frame to animate**." |
| **Image (elements) animation** | "**All elements are generated in AI**, combined in a single frame and animated. Backgrounds are **plain and gradient**. Elements placed by design principles." |

These are the four scene families below.

## 2. Scene types (the full catalogue)

### A-roll (speaker on screen)
| ID | Scene | Layout | Seen in |
|---|---|---|---|
| A1 | **MCU + word caption** | Speaker centred, 2–4 words of white Inter Medium at chest/mic height, keyword in Inter Bold 2–3× size with accent colour | V05, V06, V07 |
| A2 | **MCU + giant keyword glow** | One word 40–60% of frame width, glowing (outer glow 20–40 px), placed top third or beside head | V01 ("GROWTH", "FRAME") |
| A3 | **Wide 2-shot + headline in headroom** | Both speakers small at bottom, big number or word fills the empty wall above | V01 ("$14,000,000", "SALES REPS", "PRICING") |
| A4 | **Text-behind-subject** | Headline on a layer *under* the rotoscoped person (depth) | V04 ("JACK MASON", "UNIVERSITY", "I'M 23") |
| A5 | **Stacked tag list** | Accent-coloured box tags appear one per spoken item, stacked left | V04 (SALES TEAM / PAID MARKETING / OPERATIONS / HR) |
| A6 | **Pill / label boxes** | Keyword inside rounded dark or accent pill, under the caption | V06 ("Mitochondria", "Stimulate Elastin", "Skin Cancer") |
| A7 | **Lower-third name tag** | Name + role, small, bottom-left, first 2 s only | V05, V06, V02 |
| A8 | **Title banner** | Question headline in a solid box at the top for the first ~3 s | V06 |
| A9 | **Profile / moody angle** | 2nd cam side profile with coloured practical light (orange/teal) | V04 |

### B-roll (illustrative, full-screen)
| ID | Scene | Notes | Seen in |
|---|---|---|---|
| B1 | **Literal lifestyle/stock B-roll** | What the speaker names (party, phone hands, eating, bedroom). Often desaturated or B&W for "proof" footage | V01, V02, V06, V07 |
| B2 | **AI cinematic scene** | Generated photoreal moment that acts out the "you" scenario (3am apartment with a clock, guy in the kitchen, sunny "Heyyy!") | V07 |
| B3 | **3D science render** | Brain, DNA, mitochondria, cell under a microscope. Centred, soft studio light, slow rotation | V06, V07 |
| B4 | **Macro face + callout** | Close-up skin with dot + leader line + small label text (diagram style) | V06 |
| B5 | **Proof screen-recording** | Instagram profile, content grid, Zoom call. Scroll or zoom-blur push | V04 |
| B6 | **Social-proof photo** | Graduation, stage talk, client photo with headline behind subject | V04 |

### Designed metaphor scenes (gradient or natural background with multiple AI elements)
| ID | Scene | Elements | Seen in |
|---|---|---|---|
| C1 | **Newspaper reveal** | Person holding a paper, number blurs in above, 3D white headline below | V05 |
| C2 | **Retro office / CRT** | CRT monitor covered in sticky notes, headline on screen | V05 |
| C3 | **Landmark + rising 3D text** | B&W building (Chevron) with 3D coloured text rising behind | V05 |
| C4 | **Ribbons on black** | 3D coloured bands with text printed along them | V05 |
| C5 | **Paper on cutting mat** | Notebook or paper on a green grid mat, sticker/handwritten text, hand writing | V05, V08 |
| C6 | **Black text card** | Pure black, white sans + one red word | V05 |
| C7 | **Gallery frame** | Gold frame on red velvet, faceless portrait, red stamp word ("EXPOSE"), app icons below | V05 |
| C8 | **Surreal sky collage** | Pocket watch or object floating in clouds over grass, roses, smoke | V08, V10 |
| C9 | **Classical-art remix** | Renaissance painting or statue (Napoleon, archer statue, cherubs) + modern text + red ribbon | V10 |
| C10 | **Vintage paper collage** | Parchment/map background, photo cards in a grid, red script word | V10 |
| C11 | **Retro-PC / XP-grass world** | Old PC on green hills, wooden-sign headline | V08 |
| C12 | **Hypnotic spiral** | Orange/white spiral, cut-out person centred, sticker caption | V08 |
| C13 | **Metallic gradient card** | Gold metallic gradient + anatomical illustration + serif headline | V02 |
| C14 | **Paper burst / comic** | Paper on wood desk with red comic explosion | V03 |
| C15 | **Collage of famous faces** | B&W torn-paper cut-outs | V03 |

### Packaging frames (portfolio / series formats, optional)
- **Before/After:** orange textured backdrop, small B&W "BEFORE" panel, big "AFTER" panel (V02).
- **Raw vs Final:** white backdrop with soft shadow, "● Raw" small, "● Final Video" big, "DM for Work @handle" (V07).
- **Monitor POV:** edit shown on a desk monitor in a red-lit room, "POV: We edit your podcast intro 🔥" (V03).
- **Frame War:** dark charcoal with gold light streaks, giant "FRAME WAR" (white/gold), "$250 TOP 3 FINALIST", 3 entries side by side, "swipe to check edits & vote" / "Comment '3' to vote · Three edits. One winner. Your vote decides." (V09, V10).

## 3. Colour
Rule: **one neutral base + one accent per video + red for negative/swear words.** Grade the A-roll to match the base.

| Video | Base / grade | Accent | Extra |
|---|---|---|---|
| V01 Pierre | cool grey studio `#6e6f72` / `#5d5d63`, B&W B-roll | electric blue glow `#2f5bff`-ish | red `F*CK` |
| V02 Sleep | orange frame `#b46731` / `#d79447` | gold serif `#d9a44a` | metallic gold cards |
| V03 POV | deep red room `#830007` / `#3c0004` | red block `#e0001a` | yellow `#ffd400` closing, green laser |
| V04 Jack | warm wood/lamp `#67534a` / `#9f8872` | orange `#ff6a13` | teal side light |
| V05 Creator | warm beige set `#a9a69d` | lime/olive green `#9bc43a` | red `CAN'T`, `EXPOSE` |
| V06 Red light | champagne beige `#b49678` / `#cab5a0` | maroon/cocoa `#6d2f2a` | cream serif, pill boxes |
| V07 Alcohol | navy curtain `#11131c` | gold/cream serif `#e8d3a0` | white all-caps sans |
| V08–V10 Frame War | charcoal `#151a1a` / `#1a2422` | gold `#c9a227` / neon yellow `#e6ff3a` | dark red ribbon `#7a0a0a` |

Background types: (1) **flat or soft gradient** (cream→beige, charcoal→black, orange vignette); (2) **natural scene** (sky, grass, room) with layered AI elements.

## 4. Typography
| Role | Font | Weight / size (1080×1920) | Notes |
|---|---|---|---|
| Caption, normal words | **Inter** | Medium 500, 44–56 px | white, 2–4 words per line, tracking 0 |
| Caption, keyword | **Inter** | Bold/Black 700–900, 110–160 px | accent colour or glow; may sit on its own line |
| Elegant keyword (mode B) | Serif display (Playfair Display / Instrument Serif / Cormorant, italic) | 90–140 px | beauty, science, premium topics |
| Graphic headline | Heavy grotesk (Inter Black, Anton, Archivo Black) or 3D extruded | 120–220 px, ALL CAPS | newspaper, landmark, "PRE-SALES IN THREE DAYS" |
| Script / handwritten | brush script (yellow/red) | 100–160 px | Frame War, "Time doesn't wait" |
| Labels / pills | Inter SemiBold | 28–36 px | inside rounded rectangles, radius = height/2 |
| Small "set-up" words | Inter Regular | 30–36 px, 60–80% opacity | the run-in words above a giant keyword ("that's when we smacked" → "$xxx,xxx") |

Hierarchy pattern: **small run-in words → giant keyword → small trailing words** (e.g. "Everyone in the space / KNOWS YOU", "we hit our / 30s").

## 5. Textures and finishing
- Film grain 3–6%, a slight vignette.
- Paper (parchment, notebook, newsprint), torn edges, halftone dots, sticker cut-out white borders.
- Outer glow on keywords (mode A); soft drop shadows on cards/frames (long shadow at 30–45°).
- Depth of field: background blur on composites, sharp hero element.
- A white Polaroid border for picture-in-frame transitions.

## 6. Layout principles (the "design principle" in the notes)
- Rule of thirds: the hero element sits on a third; text balances it on the opposite third.
- **Depth stack** (back → front): background → back text → subject → front text/stickers → grain.
- 9:16 safe zone: keep text within 8–92% width and 12–80% height. Captions at 55–75% height (chest level).
- Negative space: the headline goes in empty wall space (headroom on wides).
- One focal point per frame: if a visual is busy, keep the caption small; if it's simple, make the text big.
