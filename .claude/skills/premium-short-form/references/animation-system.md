# Animation System: text, objects, camera, transitions

Timings are at 30 fps (f = frames). Values marked **measured** come from 10 fps frame strips of the references (`docs/references-data/sheets/anim_*.jpg`). The others are working defaults that match what the strips show. The animation ↔ script logic (when and why) is in `script-timing-psychology.md`.

## 0. Smoothness (client standard, 2026-11-26)
- **Ease everything:**
  - camera: ease-in-out cubic;
  - entrances: ease-out cubic, or a light back-overshoot (s ≈ 1.2) for keyword slams;
  - linear only for slow constant drift (a 103–106% push across a beat).
- **Durations:**
  - text entrances 0.24–0.35 s (word-by-word fade + de-blur + 6–28 px rise, leading the word by 3 frames);
  - object entrances 0.3–0.6 s;
  - camera moves 0.6–1.0 s;
  - let each landing settle for at least 0.4 s before the next move.
- **Motion blur** scales with speed:
  - CSS blur on fast entrances;
  - a directional smear on whips (2 frames before the cut, 3 after, kernels about 70/120/150/90/40 px).
- **One camera move at a time.** In-world continuity (tilt or glide to the next line) beats cutting to a new card. A pan from one card to another read as "AI" to the client.
- **No jitter:**
  - seeded randomness;
  - deterministic physics (closed-form arcs, solved landing times);
  - a dead-zone face-tracking camera (calm operator).
- **Check:** 10 fps strips of every move before the final render, looking for pops, flicker, stalls and double moves.

## 1. Text animation
| Animation | Spec | Reference (measured) |
|---|---|---|
| **Word-by-word reveal** | Each word fades + de-blurs in on its own onset (opacity 0→100, blur 8→0 px, scale 90→100%, 3–5 f). Words not yet spoken can sit dimmed at 30% | V12, V13, V06 |
| **One-word swap** | A single uppercase word replaces the previous one on each word or word pair, hard-cut, with no transition | V04 |
| **Keyword hit** | Scale 0→112→100% over 8–10 f (overshoot); colour flips white→accent; glow 0→100% | V01 "HOLY F\*CK", V13 "frustrating" |
| **Hero script word** | The script word draws in or fades up with a warm glow under the white line, 6–10 f, then holds for the phrase | V12 "Problems" |
| **Highlight sweep** | An accent box or marker wipes left→right behind the word, 6–8 f | V03 red box "insecurities", green marker on the cream card |
| **Letter scatter → slam** | The sentence words drift apart and **dissolve letter by letter** (~0.3 s), then the keyword **slams in** at full size with a glow and a graphic line | **V01 "BEING ABLE TO IDENTIFY" → "CONSTRAINT": scatter 0.3 s, slam 1 f** |
| **Letter assemble** | Letters arrive in random order with gaps and fill in, 10–14 f | **V05 "blind spots": 0.4 s from first letter to full word** |
| **Blur-to-sharp reveal** | Gaussian blur 40→0 + tracking 30→0, 10–15 f | V06 "impact your skin", V05 "MY GOAL" |
| **Count-up (rolling)** | Digits roll with vertical motion blur from a small value to the spoken number | **V01: $1.05M → $14,000,000 in 0.4 s, a 0.2 s dim, then the final number re-lands with a glow pulse. V04: $725/M → $100,000/M over ~1.3 s, landing on "100K"** |
| **Count-up (typed)** | Digits type in left→right, each with a blur-in | **V05: "$" → "$120,000" in 0.6 s, then the 3D sub-headline types after the number lands** |
| **Live counter widget** | A number ticks continuously inside a glass widget while the speaker talks | V14 "thousands… every month" |
| **Stack build** | Lines, tags or pills drop in one per spoken item, 4 f stagger | V04 tags, V06 pills, V14 checklist, V15 tool list |
| **Typewriter / handwriting** | Write-on stroke, 1–2 f per character | V08 handwriting on paper, V12 graphic text |
| **Text behind the subject** | The text appears on a layer under the masked person; it pops on (1 f) or slides up from behind | **V04 "I'M 23" pops on hard in 1 f** |
| **Line draw-on with text** | A thin line draws in from the left, then the text fades up beside it | V02 "ADDICTED", V06 "Feel Yourself" |
| **Exit** | Hard cut out (most common), or a 3–4 f fade/scale-down when the next word replaces it | all |

Caption timing: a caption line lives exactly as long as its phrase. Swap on the next phrase; never hold old words over new audio. The one exception is at a speaker handoff (V13), where the last word may linger ~0.3 s over the new face.

## 2. Object animation (AI elements composited in one frame)
- **Every element is on its own layer.**
  - Hero object: slow scale 100→104% plus a slight rotation (±2°) over the shot.
  - Secondary elements: drift 10–30 px in opposite directions (parallax).
- **Entrance:** pop-in with overshoot (stickers, icons, pills, app icons); slide in from the frame edge with motion blur (hands, papers, money, a TV frame lowered from the top in V11); rise from the bottom (V08 "CATCH UP" sign, V05 AI app icons).
- **Meaningful motion:** the object does what the sentence says.
  - Two puzzle pieces drift together and **lock on "great problems"** (V12).
  - Bars **rise on "four" and "five"** (V13).
  - A chat bubble **flashes red on "connect"** (V13).
  - A blemish **grows** on "impact your skin" (V06).
  - Avatars **float apart** on "where do you go to collaborate" (V13).
  - A line chart **draws upward** on "new strategy" (V15).
  - Call cards **stack up** on "hiring" (V15).
- **Constant subject, changing world:** keep the cut-out subject fixed and swap the background behind it (beach → desert → city) to show persistence. **V11: 3 backgrounds in 3.1 s.**
- **Loops:** floating bob (pocket watch, birds, cherubs) at ±8 px on a 1.5 s sine; spinning spiral; flickering lamps/glow; orbiting avatars (V13).
- **Ribbon or line draw-on:** a red ribbon or leader line trims on 0→100% over 10–20 f (V10, the V06 callout).
- **Masks and reveals:**
  - A torn-paper wipe.
  - A building mask revealing rising 3D text (V05 Chevron).
  - A UI **click-through**: an app icon pops up, a cursor clicks it, and the icon expands into a full-screen UI (V14, ~0.45 s).
- **Count and icons:** person icons pop in a row with a 3 f stagger, then one highlights (V01 team).

## 3. Camera movement
- **Constant push-in** on every still or composite: 100→106% over the shot (linear or a slow ease-in). Never leave a frame static.
- **Punch-in cut** on the A-roll: jump 100→115–120% on the same angle to hide jump cuts and stress a word. V12 punches in for the climax; V14 punches in with a glitch frame.
- **In-world camera move (D1):** for the next sentence about the *same* idea, don't cut. Whip-tilt or push the virtual camera inside the 3D world, with motion blur, to frame the new text, and leave the previous line visible at the top. **V12: tilt-up at 3.77 s and push at 19.50 s, ~0.3 s each.**
- **Push-through / pull-out between worlds (mode C):** zoom into a screen or paper until it fills the frame and becomes the next scene; or pull back to reveal the scene sits inside a monitor or tablet (V08, V11 CRT zoom-out).
- **Zoom-blur push** on screen recordings: 100→130% with radial blur over 8–12 f (V04 content grid).
- **Rack-focus feel:** blur the background layer when text enters, or bring the A-roll in from a blur (V06 at 12.5 s).
- **Handheld micro-shake** (optional): ±3 px on lifestyle B-roll for realism.

## 4. Transitions (used only at topic changes; hard cut everywhere else)
| Transition | Spec | Seen in |
|---|---|---|
| **Hard cut** | The default: on a phrase start or the stressed keyword. Almost every return to the face is a hard cut | all |
| **Glitch / RGB-invert flash** | 2–4 f of chromatic offset + invert + noise | **V01 at 10.67 s and 19.21 s** (before each new host question/topic), V14 at 1.50 s and 13.80 s (bookends) |
| **White overexposure flash** | 2–4 f blown-out white, then the cut | V04 at 14.9 s and 44.2 s |
| **Light-leak flash** | 3–6 f warm pink/orange/yellow leak over the cut | **V07 at 6.0 s, 10.5 s and 24.0 s** (face → AI B-roll) |
| **Colour-tint flash** | The same shot flashes red for 3–5 f | V07 at 16.5 s ("in different places"), V13 red error |
| **Polaroid / white frame** | A white border grows in from the edges (~0.5 s), the framed shot shrinks, and the next shot scales up | **V02 at 9.0 s and 23.0 s** |
| **Blur-out / blur-in** | Gaussian 0→60→0 across the cut, 6–8 f each side | V04, V14 at 8.05 s (defocus) |
| **Whip / motion-blur slide** | Directional blur, 4–6 f | V08 at 1.4 s, V12 at 6.10 s, V14 at 6.60 s |
| **Iris to avatar** | The face shrinks into a circle that becomes a diagram element, ~0.4 s | V13 at 1.10 s |
| **Vertical-stripe glitch wipe** | Thin vertical bars sweep the old shot away, 4–6 f | V13 at 3.80 s, 5.60 s and 13.45 s |
| **UI click-through** | Icon → cursor click → expands to full screen | V14 at 3.6–4.05 s |
| **Scroll-out** | The card content scrolls up and off, and the next content scrolls in | V15 at 9.8 s |
| **Match push** | The push-in on shot A ends at the same scale and direction the push-in on shot B starts | mode C |

**Direction rule:** use stylised transitions to go **into** a graphic or a new world, and a **hard cut back to the face**. A transition always marks a new chapter, so never use more than one per 5–8 s.

## 5. Per-mode motion defaults
| | A: hype podcast | B: visual storytelling | C: motion-graphic VO | D: idea worlds |
|---|---|---|---|---|
| Caption style | One word or 2–4 words, glow keyword | Medium/Bold pair, serif keyword | Sticker / script / slab in the scene | Medium/Bold pair + gold script hero; 3D word in the graphics |
| Keyword animation | Slam + glow, letter scatter | Blur-to-sharp, letter assemble | Type-on, sticker pop | Fade-up glow (face), typed + 3D extrude (world) |
| Object motion | Icons pop | Slow drift on renders, callout draw-on | Floating loops, background swaps | Meaningful motion (pieces lock, bars rise) |
| Camera | Punch-ins, zoom-blur on screens | Push-in on renders | Push-through between worlds | In-world tilts and pushes |
| Transitions | Glitch, white flash | Polaroid, light leak | Whip, push-through | Whip/iris/stripe in, hard cut out |
