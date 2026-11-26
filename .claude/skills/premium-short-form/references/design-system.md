# Design System: scenes, colours, fonts, textures, layouts

Built from the designer's Figma board and 15 reference videos (V01–V15, see `video-breakdowns.md`).

## 1. What the Figma board says (designer's own notes)
The board (`Z55tmJ5L4ZxoAcDlBNEVn0`, Page 1) has five labelled columns of reference screenshots taken from the videos. Four of them carry the designer's notes; the fifth, "References", holds all the screenshots. These notes are recorded from a read of the board on 2026-11-25. A re-read on 2026-11-26 was blocked by the Figma MCP Starter-plan call limit. If the board has new frames since then, re-read it and add them here.

| Column | Designer's note (verbatim intent) | Scene family below |
|---|---|---|
| **A-Roll Captions** | "In the A-roll the captions have **2 styles, Medium and Bold** font combinations, and also an animation **highlighting the important words**." | A |
| **B-Roll Captions** | "B-rolls are **sourced online and some are AI generated**. Captions are a **combination of Medium and Bold in Inter**. The designs are placed by **design principles**." | B |
| **Animation** | "Animations are done on a **gradient background**, and on a **natural background with multiple elements**. Most images are **AI generated: all images generated separately and combined in a single frame to animate**." | C, D |
| **Image (elements) animation** | "**All elements are generated in AI**, combined in a single frame and animated. Backgrounds are **plain and gradient**. Elements placed by design principles." | C, D |

Two rules follow from the notes and hold in all 15 videos:
1. **Captions are always a Medium + Bold pair.** Small set-up words are Medium; the one important word is Bold (or a display face) and is animated or highlighted.
2. **Every designed scene is a composite of separately generated elements** (subject, prop, background, text) on a **plain/gradient** or **natural** background, so each layer can move on its own. Never animate one flat generated image.

## 2. Scene types (the full catalogue)

### A. A-roll (speaker on screen)
| ID | Scene | Layout | Seen in |
|---|---|---|---|
| A1 | **MCU + Medium/Bold caption** | Speaker centred. 2–4 words of white Inter Medium at chest/mic height (55–72% of frame height); the keyword in Inter Bold at 2–3× the size, in the accent colour | V05, V06, V07, V12, V13 |
| A2 | **MCU + giant glowing keyword** | One word at 40–60% of frame width, outer glow 20–40 px, placed in the top third or beside the head | V01 ("GROWTH", "FRAME") |
| A3 | **Wide 2-shot + headline in the headroom** | Both people small at the bottom; a big number or word fills the empty wall above | V01 ("$14,000,000", "SALES REPS", "PRICING") |
| A4 | **Text behind the subject** | The headline sits on a layer *under* the rotoscoped person (depth) | V03 ("ENTREPRENEURSHIP"), V04 ("JACK MASON", "I'M 23", "UNIVERSITY", "THAT WAY") |
| A5 | **Stacked tag list** | Accent-coloured box tags, one per spoken item, stacked left | V04 (SALES TEAM / PAID MARKETING / OPERATIONS / HR) |
| A6 | **Pill / label boxes** | Keyword inside a rounded dark or accent pill under the caption, optionally with an icon | V06 ("Mitochondria", "Skin Cancer", "Signs Of Aging") |
| A7 | **Lower-third name tag** | Name + role, small, bottom-left, first 2–4 s only | V02, V05, V06 |
| A8 | **Title banner** | Question headline in a solid box at the top for the first ~2.5 s | V06 ("Why Your Skin Ages Faster Than You Think?") |
| A9 | **Gelled profile angle** | A second camera at side profile with coloured practical light (orange/teal) | V04 |
| A10 | **Script hero word** | Small white sans line + one large gold *script* word with a warm glow, overlapping the line | V12 ("Problems", "Brain", "Control") |
| A11 | **Editorial serif keyword** | High-contrast serif (italic or condensed) keyword under a small sans run-in | V02 ("30,000ft", "Wind down"), V06, V07 ("GENETIC PREDISPOSITION") |
| A12 | **Letter-assemble word** | Keyword builds from scattered letters | V01 ("CONSTRAINT" exit), V05 ("blind spots", "entrepreneur"), V06 ("someone's") |
| A13 | **Count-up number** | Big number rolls to the spoken value | V01 ($14,000,000), V04 ($100,000/M), V05 ($120,000) |
| A14 | **One-word-at-a-time caption** | A single uppercase word replaces the last one on every syllable group | V04 |
| A15 | **Glass widget over the speaker** | A glassmorphism card (counter, progress bar, checklist pills) floats over the A-roll | V14 |
| A16 | **Room-wide re-entry cutaway** | 0.2–0.3 s wide of the set (interviewer's hand, props) after a long graphic run | V12 |

### B. B-roll (illustrative, full-screen)
| ID | Scene | Notes | Seen in |
|---|---|---|---|
| B1 | **Literal lifestyle/stock B-roll** | What the speaker names (party, phone in hands, eating). Often **desaturated or B&W** for "proof"/memory footage | V01, V02, V06, V07 |
| B2 | **AI cinematic "you" scene** | A generated photoreal moment acting out the scenario (3 am apartment with a clock, guy in the kitchen, sunny "Heyyy!", woman at a mirror) | V06, V07 |
| B3 | **3D science render** | Brain, DNA, mitochondria. Centred, soft studio light, slow rotation or push into the surface | V06, V07 |
| B4 | **Macro face + callout** | Close-up skin with dot + leader line + label text (diagram style) | V06 |
| B5 | **Proof screen recording** | Instagram profile, content grid, Zoom call. Scroll or zoom-blur push | V04 |
| B6 | **Social-proof photo** | Graduation, stage talk, client photo, with the headline behind the subject | V04 |
| B7 | **AI portrait that changes** | A generated face whose skin or expression changes over the shot (blemish grows) | V06 |

### C. Designed metaphor scenes (AI collage, natural or textured background)
| ID | Scene | Elements | Seen in |
|---|---|---|---|
| C1 | **Newspaper reveal** | Person holding a paper, number blurs in above, 3D white headline below | V05 |
| C2 | **Retro office / CRT** | CRT monitor covered in sticky notes, headline on the screen | V05 |
| C3 | **Landmark + rising 3D text** | B&W building (Chevron) with 3D coloured text rising behind | V05 |
| C4 | **Ribbons on black** | 3D coloured bands sweeping in, with text printed along them | V05 |
| C5 | **Paper on a cutting mat** | Notebook/paper on a green grid mat, sticker or handwritten text, a hand writing | V05, V08 |
| C6 | **Black text card** | Pure black, white sans + one red or gold word | V03, V05 |
| C7 | **Gallery frame** | Gold frame on red velvet, faceless portrait, red stamp word, app icons below | V05 |
| C8 | **Surreal sky collage** | Pocket watch or object floating in clouds over grass/roses/mist | V08, V10 |
| C9 | **Classical-art remix** | Renaissance painting or statue (Napoleon, archer, cherubs) + modern text + red ribbon | V10 |
| C10 | **Vintage paper collage** | Parchment/map background, photo cards in a grid, red script word | V10 |
| C11 | **Retro PC on XP hills** | Old PC on green hills, wooden-sign headline | V08 |
| C12 | **Hypnotic spiral** | Orange/white spiral, cut-out person centred, sticker caption | V08 |
| C13 | **Metallic gradient card** | Gold metallic gradient + anatomical illustration + serif headline | V02 |
| C14 | **Paper burst / comic** | Paper on a wood desk with a red/yellow comic explosion | V03 |
| C15 | **Collage of famous faces** | B&W torn-paper cut-outs | V03 |
| C16 | **Background swap, constant subject** | The same cut-out subject (running businessman) stays put while the world behind swaps (beach → desert → city) | V11 ("consistency") |
| C17 | **Vintage prop held by a hand** | Beige paper world; a real hand lowers or places an object (TV frame, banknote stack); engraved serif caps | V11 |
| C18 | **Object on white** | A single prop (CRT, clock) on a white sweep, text on or above it, then a zoom out to reveal more text | V11 |

### D. Idea worlds and UI graphics (pattern v3)
| ID | Scene | Elements | Seen in |
|---|---|---|---|
| D1 | **3D idea world on cream** | Cream paper background, soft shadow, one orange 3D object (lightbulb, puzzle pieces, brain + curved road). The camera tilts and drifts *inside* the world between sentences | V12 |
| D2 | **Gradient infographic card** | Peach→orange gradient card; memoji avatars, rising bars, chat bubbles, error flash | V13 |
| D3 | **Glass UI card** | Frosted white or black glass panel: app list with ticks, sliders, line chart, incoming-call notifications | V14, V15 |
| D4 | **Dreamy landscape + widget** | AI landscape (misty flower field, green hill + sky) with a glass widget or 3D device in it | V15 |
| D5 | **Iris-to-avatar** | The speaker's face shrinks into a circle avatar and becomes part of a diagram (an orbit of other avatars) | V13 |
| D6 | **Restyled proof screenshot** | The client's real screenshot (YouTube grid) on a clean card with a huge number over it | V15 |

### E. Packaging frames (portfolio / series formats, optional)
| ID | Format | Layout | Seen in |
|---|---|---|---|
| E1 | **Before/After, orange** | Orange textured backdrop, small B&W "BEFORE" panel behind on the left, big colour "AFTER" panel | V02 |
| E2 | **Raw vs Final, white** | White soft-shadow backdrop, "● Raw" small, "● Final Video" big, "DM for Work @handle" | V07 |
| E3 | **Monitor POV** | The edit on a desk monitor in a red-lit room, "POV: We edit your podcast intro 🔥" | V03 |
| E4 | **Frame War board** | Charcoal + gold light streaks, giant "FRAME WAR" (white/gold), "voting is open / $250 / TOP 3 FINALIST", 3 entries side by side, "swipe to check edits & vote" | V09 |
| E4b | **Frame War entry slide** | Ghost "FRAME WAR" behind; number badge; @handle pill; the 3:4 card; "Comment "N" to vote →" | V08, V10, V11 |
| E5 | **Raw file vs Final Video, peach** | Peach→orange gradient, B&W raw panel, orange pill labels | V13 |
| E6 | **macOS window + tool dock** | Night-street photo background, "Before" panel, the "After" panel inside a macOS window titled "Your best video ever.mp4", dock icons Ae · Pr · IG · YT · TikTok | V14 |
| E7 | **Before/After, periwinkle** | Periwinkle gradient, "● Before" (red dot) and "● After" (green dot) | V15 |

Packaging rule: the raw/before panel is always **B&W and smaller, behind**; the final panel is **colour, larger, in front, with a soft drop shadow**. The backdrop takes the edit's accent colour.

## 3. Colour
Rule: **one neutral base + one accent per video + red for negative/swear words.** Grade the A-roll to match the base. **Take the accent from the footage itself**: the guest's wardrobe (V05's green shirt → green), the set's practical lights (V12's amber bokeh → gold), or the brand (V06 Dermalux → maroon).

Measured with k-means on 40 frames per video (`docs/references-data/palettes.json`). The accent is the most saturated cluster, checked by eye.

| Video | Base / grade (measured) | Accent | Extra |
|---|---|---|---|
| V01 Pierre | cool grey studio `#6f7073` / `#5c5a60`, B&W B-roll | electric blue glow `#3955b4` (renders as `#2f5bff` glow) | red glow for F\*CK / CONSTRAINT |
| V02 Sleep | orange frame `#ce5418`, dark studio `#0f0f0d` | gold serif `#d9a44a` | orange bold for times (10 PM, 6PM); metallic gold card |
| V03 POV | near-black `#0e070a` + red room `#c5020c` | red block `#e0001a` | yellow `#ffd400` closing word, green laser `#39e65a` |
| V04 Jack | dark warm `#1a1618` / `#3a393a`, lamp amber `#aa8265` | orange `#ff6a13` | teal gel profile |
| V05 Creator | dark library `#272219`, cream `#ebedf1` | olive/lime green `#9bc43a` (her shirt) | red CAN'T / EXPOSE; gold "GOAL" |
| V06 Red light | champagne beige `#b08d6d` / `#c1a995` | maroon/cocoa `#6d2f2a` | cream serif, rose pills |
| V07 Alcohol | navy curtain `#0f121e`, white frame `#e6e5e3` | gold/cream serif `#e8d3a0` | warm light leaks `#e8a370` |
| V08 Entry 1 | sky + grass `#5d7952` / `#50789d` | green 3D type `#6cc24a` | orange/white spiral |
| V10 Entry 3 | pastel sky `#96bdd4`, parchment `#e0cba1` | neon yellow script `#e6ff3a` | dark red ribbon `#7a0a0a` |
| V11 Entry 2 | sepia paper `#a59c91` / `#b9bab5` | engraved gold/white | sky blue `#759ca7` |
| V12 Brain | cream `#cebfb8`, studio dark `#110e12` / `#302732` | gold/amber `#b86e3e` (script glow, 3D orange) | — |
| V13 Aussie | peach `#fac8a4` | orange `#f86506` | red error flash |
| V14 UAE | dark suit studio `#352828` / `#0f0a0b`, night blue `#133a68` | neon purple `#ca4ddf` | glass white |
| V15 2025 | glass white `#e1e2e4` | periwinkle `#92a8f6` / `#b1bff7` | neon cyan script |
| Frame War board | charcoal `#151a1a` / `#1a2422` | gold `#c9a227` | white |

Background types:
1. **Flat or soft gradient**: cream → beige, charcoal → black, orange vignette, peach → orange, periwinkle.
2. **Natural scene**: sky, grass, room, landscape, with layered AI elements.
3. **Textured surface**: parchment, cutting mat, wood desk, velvet.

## 4. Typography
Fonts identified by eye. Free equivalents are listed first; use them unless the client has a brand font.

| Role | Font (free equivalent) | Weight / size at 1080×1920 | Notes / where |
|---|---|---|---|
| Caption, normal words | **Inter** Medium | 500, 40–56 px | White, 2–4 words per line, tracking 0. All A-roll |
| Caption, keyword | **Inter** Bold/Black | 700–900, 110–160 px | Accent colour or glow; may sit on its own line |
| One-word-at-a-time caption | **Inter Tight** ExtraBold, ALL CAPS | 800, 70–90 px (giant words 250–400 px) | Tracking −2%. V04 |
| Glowing extended keyword | **Archivo Expanded** Bold Italic (or Druk Wide) | 800, 150–260 px | Outer glow in the accent. V01 |
| Editorial serif keyword | **Playfair Display** Italic / **Bodoni Moda** condensed / **Instrument Serif** | 90–160 px | Beauty, science, premium topics. V02, V06, V07 |
| Script hero word | **Pinyon Script** / **Great Vibes** / **Alex Brush** | 120–180 px | Gold gradient + warm outer glow. V10 (neon yellow), V12 (gold), V15 (neon cyan) |
| Graphic headline | Heavy grotesk (**Anton**, **Archivo Black**, Inter Black) or 3D extruded | 120–220 px, ALL CAPS | "PRE-SALES IN THREE DAYS", "ENTREPRENEURSHIP", "FRAME WAR" |
| 3D object word | **Poppins** ExtraBold, orange, extruded with a soft drop shadow | 140–200 px | V12 idea worlds ("Problem's", "Brain") |
| Neon UI keyword | **Clash Display** / **Poppins Black** | 120–160 px | Neon purple with outer glow. V14 |
| Engraved serif caps | **Cinzel** / **Cormorant SC** | 60–120 px | Vintage prop scenes. V11 |
| Slab sign headline | **Roboto Slab** Black | 100–140 px | Wooden sign on XP hills. V08 |
| Handwritten / sticker | Brush script or bold sans with a white sticker outline | 100–160 px | Frame War, the cutting-mat scenes |
| Labels / pills | **Inter** SemiBold | 28–36 px | Inside rounded rectangles, radius = height / 2 |
| Small set-up words | **Inter** Regular | 30–36 px, 60–80% opacity | The run-in words above a giant keyword |

Hierarchy pattern: **small run-in words → giant keyword → small trailing words**. Examples: "Everyone in the space / KNOWS", "we hit our / 30s", "That problem-solving / *Brain* / thing is".

Font pairing per mode:

| Mode | Normal words | Keyword | Graphics |
|---|---|---|---|
| A (hype) | Inter Medium | Extended italic glow or tight grotesk caps | Big grotesk headlines |
| B (story) | Inter Medium | Editorial serif or Inter Bold | Serif on renders |
| C (motion graphics) | — | Script / sticker / slab | Collage |
| D (idea worlds) | Inter Medium | Gold script on the face | 3D orange sans or neon UI sans in the graphics |

## 5. Textures and finishing
- Film grain 3–6%, a slight vignette.
- Paper (parchment, notebook, newsprint), torn edges, halftone dots, sticker cut-out white borders.
- Outer glow on keywords (modes A and D); soft drop shadows on cards and frames (long shadow at 30–45°, as on the V06 fibroblast card).
- Glassmorphism for UI: 20–40 px background blur, 1 px white stroke at 30%, inner light (V14, V15).
- Depth of field: background blur on composites, a sharp hero element.
- A white Polaroid border for picture-in-frame transitions (V02).
- B&W/desaturated grade for lifestyle "proof" B-roll (V01) and for every raw/before panel.

## 6. Layout principles (the "design principle" in the notes)
- **Rule of thirds:** the hero element sits on a third; text balances it on the opposite third.
- **Depth stack** (back → front): background → back text → subject → front text/stickers → grain.
- **9:16 safe zone:** keep text within 8–92% of the width and 12–80% of the height. Captions sit at 55–75% height (chest level, over the mic).
- **Negative space:** the headline goes in empty wall space (headroom on wides, the sky in landscapes).
- **One focal point per frame:** if a visual is busy, keep the caption small; if it's simple, make the text big.
- **Continuity inside a world (D1):** when the camera moves within the same scene, the previous line stays visible at the top edge, so the thought reads as one thread.
- **Lists build in place:** stacked tags (A5), pills (A6), checklist pills (A15) and tool lists (D3) all build downward, one item per spoken item.
