# Founders Minimal: caption style guide

A clean, premium, minimal talking-head style: **still, centred, depth-layered captions that cut exactly on the words, with a sky-white fill and one giant word per idea.** The footage is left alone, and the type does all the work.

The evidence behind every rule (word-by-word transcript, frame log, measurements) is in [`reference/BREAKDOWN.md`](reference/BREAKDOWN.md). The machine-readable timeline is in [`reference/captions.json`](reference/captions.json). The working preset is [`preset/caption-style.css`](preset/caption-style.css), previewed by [`preset/demo.html`](preset/demo.html). [`reference/recreation_vs_reference.jpg`](reference/recreation_vs_reference.jpg) shows the preset next to the reference.

---

## 1. Script → captions (placement rules)

1. **Clean the script first.** Drop filler ("of", "like", "you know", "um"). Where cutting a tag makes a sentence a question, rewrite the punctuation ("embarrassed, you know?" → "embarrassed?").
2. **Chunk into spoken phrases of 1–3 words** (4 maximum). Break where the speaker breathes and between phrases, never inside a noun or verb phrase.
   - ✅ `you step out` / `your comfort zone,`
   - ❌ `you step out your` / `comfort zone,`
3. **Pick the tier for each chunk** (see §3). Default is *standard*.
4. **Timing:**
   - A caption **cuts in on the first syllable** of its chunk. Arriving up to 0.25 s early in a pause is fine; arriving late is never fine.
   - It **holds until the next caption replaces it**, so there is no empty screen while the person is talking.
   - Typical hold is 0.4–0.7 s; let a dramatic pause stretch a hold to 1.0–1.6 s.
5. **Ignore picture cuts.** A caption carries over shot changes. Only line a cut up with a caption change if they already fall within a couple of frames of each other.
6. **Give one breath.** After the emotional peak (usually a question), fade the caption and leave ~1 s of clean footage before the closing line.
7. **Text formatting:**
   - Lowercase, except a sentence start and "I".
   - Keep commas, full stops and question marks: they make the captions read like speech.
   - No emoji, no ALL CAPS.

## 2. Composition

| Layer (bottom → top) | Spec |
|---|---|
| Footage | Full-bleed, untouched. No added zoom, shake or LUT swings. A warm, slightly crushed grade suits it. |
| Captions | Centred horizontally. The x-height centre sits at **50% of the frame height**, which should fall on the speaker's neck or chest, just under the chin. |
| **Subject matte** | The speaker (and the mic, if there is one) is cut out and placed **above** the captions, so the body and tie slice through the letters. Let the text ghost through the matte at ~20%. This one layer is what makes the style look premium. |
| Watermark | Brand name in a thin geometric caps face (Montserrat/Gotham Regular). Cap height 2.1% H, ~16% W wide, bottom centre at 94% H, 90% white, on every frame. |
| End card | Hard cut to pure black with the same wordmark centred (cap height 5.4% H, ~40% W). Hold 1.5 s, then fade to black over 14 frames (linear). |

### Caption fill
- A **cloud-sky texture** clipped to the glyphs: mostly white (#f6fafd), with ~20% of the area in ice/sky blue (#bfdff4 → #78b8e6).
- Each line also gets a soft ice-blue haze on its outer left and right edges.
- The texture is fixed in frame space rather than per word, so some lines read pure white and some read blue. That variation is intended.
- Separation: a 0-offset soft dark halo at ≈1% H blur and 25% opacity. No stroke, no box, no hard drop shadow.

## 3. Type scale (font-size as a fraction of frame height H)

Family: **SF Pro Display** (original look), or **Inter Display** (free; this is what the preset uses). Tracking is tight on every tier.

| Tier | When to use it | Weight | Size | Tracking |
|---|---|---|---|---|
| **standard** | Default for every phrase | Bold 700 | 0.107 H | −0.03 em |
| **italic** | The end of a thought, or a softer, intimate repeat ("anything in life.", the second "you're focusing,") | SemiBold Italic 600 | 0.108 H | −0.035 em |
| **emphasis** | The emotional peak question or line, one word, right before the breath | Bold 700 | 0.146 H | −0.035 em |
| **hero** | The keyword of an idea, always alone on its line | ExtraBold 800 | 0.223 H | −0.045 em |
| **hero_max** | The final payoff word of the video | Black 900 | 0.196 H | −0.04 em |
| **stack** | A lead-in (standard) with the hero cut in underneath (≈ 0.25 H, ~12% bigger than a solo hero), lines almost touching | 700 / 800 | — | — |

How often to use each tier:
- **One hero per idea**, about every 7–10 s; a 20 s video gets 2–3.
- 1–2 italic lines per video.
- 1 emphasis line per video.
- Everything else is standard.

## 4. Animation

- **Captions cut in and out with no transition (0 frames).** No pop, bounce, scale, slide, blur, typewriter or karaoke highlight. Each caption is completely static while it is up.
- **Stack build:** show the lead-in alone, then cut the hero in underneath on its first syllable while the lead-in stays.
- **The one fade:** the emphasis line before the breath fades out over 8 frames (linear), starting just after its word ends.
- **Opening (letterbox open):**
  - Start on black with the first caption already on screen.
  - Two black bars part from the centre line at a **constant speed** and reach the full frame in **24 frames** (linear, no easing).
  - The second caption can land while the bars are still opening.
- **Ending:** hard cut to the black end card, hold, then a 14-frame linear fade.
- The premium feel comes from **stillness, exact sync, a big jump in type scale and the depth layer**, so resist adding motion.

## 5. Vertical 9:16 adaptation (my extrapolation; the reference is 16:9)

- Set `--H` to **1000 px** on a 1080×1920 canvas. At that value:
  - standard is 107 px ("you can achieve" ≈ 70% of the width);
  - hero is 223 px ("listening," ≈ 81% of the width).
- Keep a hero under 88% of the width. If a hero word is longer, reduce its size rather than wrapping it.
- Vertical position: x-height centre at about **55% of the height**, so the caption still lands under the chin of a centred talking head.
- Watermark at 94% of the height; check that it clears the platform UI.

## 6. Production recipe

1. **Transcribe** with word timestamps (`tools/tx.py`, using faster-whisper).
2. **Clean, chunk and assign tiers** using §1 and §3. Write the result as a `captions.json` like the reference one.
3. **Build a subject matte** per frame (Robust Video Matting, rembg, or a roto tool) and composite it above the caption layer at ~80% opacity.
4. **Render** the captions with `preset/caption-style.css`. Every frame is a function of time: the caption whose `[in, out)` contains the frame is drawn, and nothing else.
5. **Add** the letterbox open, the watermark, the end card and the fades from §4.
6. **QA:**
   - every caption appears on or just before its first syllable;
   - no caption shows a dropped filler word;
   - no hero sits next to other words on its line, except in a stack;
   - no animation slipped in.

## 7. How to prompt me

> Edit this video in **Founders Minimal** style. Watermark: `<BRAND>`. Format: 9:16.

You can override any default, for example:
- "heroes: *freedom*, *now*"
- "no italic"
- "end card says X"
- "keep the filler words"
- "no letterbox intro"

## Don'ts

- Lower-third placement, caption boxes, strokes, coloured highlight words, or emoji.
- Word-by-word pop-in or karaoke.
- More than one hero on screen, or a hero with other words on its line (except in a stack).
- Captions that arrive after the word.
- Adding zooms or shakes to the footage.
