# Animation System: text, objects, camera, transitions, and how they map to the script

Timings are at 30 fps (frames = f).

## 1. Text animation
| Animation | Spec | Used for |
|---|---|---|
| **Word-by-word pop** | Each word appears 2–4 f before it's spoken; scale 80→100%, opacity 0→100, 4–6 f, ease-out | All A-roll captions |
| **Keyword hit** | Scale 0→112→100% over 8–10 f (overshoot), colour flips white→accent, glow 0→100% | The 1 key word per phrase |
| **Highlight sweep** | Accent box/marker wipes left→right behind the word, 6–8 f | Figma "highlighting important words" (V03 red box, V07) |
| **Letter scatter / assemble** | Letters fly in from random offsets with blur and settle, 10–14 f | "assum ptions", "BEING ABLE TO IDENTIFY" (V01, V05) |
| **Blur-to-sharp reveal** | Gaussian blur 40→0 + tracking 30→0, 10–15 f | Big numbers, headlines ("$120,000") |
| **Count-up** | Number rolls from ~0/smaller to the spoken value over 18–30 f, lands on the syllable | $48,830→$100,000, $14,000,000 |
| **Stack build** | Lines/tags drop in one per spoken item, 4 f stagger, each pushes the others | Lists (V04 tags, V06 "WE LOSE 8% OF THAT MITOCHONDRIAL function") |
| **Typewriter / handwriting** | Write-on stroke, 1–2 f per char | Script fonts, paper scenes (V08, V10) |
| **Text-behind reveal** | Text slides up from behind a masked subject | A4 scenes |
| **Exit** | Hard cut out (most common), or a quick 3–4 f fade/scale-down when the next word replaces it | — |

Caption timing: a caption line lives exactly as long as its phrase. Swap on the next phrase; never hold old words over new audio.

## 2. Object animation (AI elements composited in one frame)
- Every element is on its own layer. **Hero object:** slow scale 100→104% plus a slight rotation (±2°) over the shot. **Secondary elements:** drift 10–30 px in opposite directions (parallax).
- **Entrance:** pop-in with overshoot (stickers, icons, pills), or slide in from the frame edge with motion blur (hands, papers, money).
- **Loops:** floating bob (pocket watch, birds, cherubs) at ±8 px, 1.5 s sine; spinning spiral; flickering lamps/glow.
- **Ribbon/line draw-on:** a red ribbon or leader line trim-path 0→100% over 10–20 f (V10, the V06 callout).
- **Masks/reveals:** a torn-paper wipe, a building or person mask revealing rising 3D text (V05 Chevron).
- **Count & icons:** person icons pop in a row with a 3 f stagger (V01 team).

## 3. Camera movement
- **Constant push-in** on every still or composite: 100→106% over the shot (linear or slow ease-in). Never leave a frame static.
- **Punch-in cut** on the A-roll: jump 100→115–120% on the same angle to hide jump-cuts and stress a word.
- **Push-through / pull-out between worlds** (mode C): zoom into a screen or paper until it fills the frame, then that becomes the next scene; or pull back to reveal the scene is inside a monitor/tablet (V08).
- **Zoom-blur push** on screen recordings: 100→130% with radial blur over 8–12 f (V04 content grid).
- **Handheld micro-shake:** optional ±3 px on lifestyle B-roll for realism.
- **Rack-focus feel:** blur the background layer when text enters.

## 4. Transitions (used only at topic changes)
| Transition | Spec | Mode |
|---|---|---|
| Hard cut | default, on the stressed syllable | all |
| Glitch / RGB-split flash | 2–4 f, chromatic offset + noise | A (V01 at 26.4 s) |
| Polaroid/white-frame zoom | The current shot shrinks into a white-bordered photo, then the next one scales up out of it, 10–12 f | B (V02) |
| Blur-out / blur-in | Gaussian 0→60→0 across the cut, 6–8 f each side | A/B (V04) |
| White flash / light leak | 4–6 f overexposure | C (V10 between scenes) |
| Whip/motion-blur slide | Directional blur, 6 f | C |
| Match push | Push-in on A ends at the same scale and direction the push-in on B starts | C |

## 5. Animation ↔ script (timing and psychology)

### Timing rules
- **Picture changes on the stressed syllable** of the keyword (or 2–4 f before it, so the eye arrives as the ear does).
- **Hook number:** spoken and shown together within the first 2 s (the "eye reward").
- **Lists:** one visual unit per item, in sync with each item spoken.
- **Reaction beat:** the host reaction shot cuts in on the first frame of the reaction word.
- **Cadence:** mode A ~1.0–1.3 s per shot, mode B ~2–3 s, mode C one scene per sentence (~1.5–2.5 s). Vary it: two quick beats, then one longer hold at the emotional line.
- **Silence/breath:** cut it out or cover it with B-roll; never show dead air on the speaker.
- **Ending:** hold the final speaker line 0.5–1 s longer, then the CTA card for 2–5 s.

### Visual psychology (why each choice works)
| Script moment | Visual choice | Psychological effect |
|---|---|---|
| Big number / result | Giant glowing number, count-up | Instant status signal; the brain registers magnitude before meaning |
| Status claim about the guest | Lifestyle/proof B-roll (car, stage, Instagram) | Social proof; the claim becomes believable |
| Host reaction | Cut to the host's face | Borrowed emotion: tells the viewer how impressed to be |
| "You…" scenario | AI scene acting it out (3am kitchen, mirror) | Self-identification: "that's me" keeps them watching |
| Abstract science term | 3D render (brain, mitochondria) | Makes the invisible concrete; perceived authority |
| Metaphor | Literal designed metaphor (oil = Chevron, fire = burning paper) | Dual coding: the word plus the image is remembered |
| List | Stacked tags / counted items | Chunking; feels structured and complete |
| Negative / swear word | Red | Threat/urgency colour; emphasis |
| Emotional confession | Stay on the speaker MCU, slower cut, less text | Intimacy; letting the face carry it builds trust |
| Topic change | Transition effect | Signals "new chapter", resets attention |
| Ending | Cliffhanger or thesis + comment keyword | Open loop (Zeigarnik) + low-friction action → comments boost reach |
| Constant motion | Push-ins, drift, cut every 1–3 s | Pattern interrupt; prevents scroll-away |
| One accent colour | Consistent highlight | The viewer learns "this colour = the important word" |
