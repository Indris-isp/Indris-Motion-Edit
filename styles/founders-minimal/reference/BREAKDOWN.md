# Founders Minimal: reference breakdown

Source: Founders Houze reel "Who cares if you get embarrassed" (uploaded MP4), 1276×718, 30 fps, 20.47 s, 614 frames.
Every frame was extracted and measured. `frame_metrics.txt` has one row per frame (caption-band coverage, caption-mask change, full-frame change, mean luma, caption bounding box). Caption in/out frames below were found from single-frame spikes in the caption mask, then checked by eye on the boundary strips in `frames/`.

Figma board (`figma/`): 9 annotated screenshots, grouped by the board into **Bold** (listening, impossible, embarrassed, stack) and **Regular/Medium** (if you're, you're focusing, anything in life., intro). The board's notes:
- *"Important words are in bold … placing the important and attention-grabbing words in one line … in some places they place two lines but in normal style like medium or regular."*
- *"They use normal style like regular or medium style fonts in normal space, like talking."*

## Full transcript (as spoken)

> If you're listening, you're focusing, you step out of your comfort zone, you can achieve anything in life. I was nothing about three years ago. I'm here now. So, I think if you're listening, you're focusing, you just step out of your comfort zone a little bit. Who cares if you're getting embarrassed, you know? Anything can be impossible.

59 words in 18.1 s of speech, shown as 23 captions (2.6 words per caption, 1.27 captions per second).

### A. Word-by-word transcript (Whisper small.en, word timestamps)

| # | Word | Start (s) | End (s) | Frame in | Caption # | Shown on screen? |
|---|---|---|---|---|---|---|
| 0 | If | 0.00 | 0.26 | 0 | 1 | yes |
| 1 | you're | 0.26 | 0.44 | 8 | 1 | yes |
| 2 | listening, | 0.44 | 0.86 | 13 | 2 | yes |
| 3 | you're | 1.14 | 1.18 | 34 | 3 | yes |
| 4 | focusing, | 1.18 | 1.50 | 35 | 3 | yes |
| 5 | you | 1.82 | 1.82 | 55 | 4 | yes |
| 6 | step | 1.82 | 1.94 | 55 | 4 | yes |
| 7 | out | 1.94 | 2.14 | 58 | 4 | yes |
| 8 | of | 2.14 | 2.22 | 64 | 5 | **dropped** |
| 9 | your | 2.22 | 2.26 | 67 | 5 | yes |
| 10 | comfort | 2.26 | 2.48 | 68 | 5 | yes |
| 11 | zone, | 2.48 | 2.70 | 74 | 5 | yes |
| 12 | you | 2.86 | 2.86 | 86 | 6 | yes |
| 13 | can | 2.86 | 2.98 | 86 | 6 | yes |
| 14 | achieve | 2.98 | 3.28 | 89 | 6 | yes |
| 15 | anything | 3.28 | 4.62 | 98 | 7 | yes |
| 16 | in | 4.62 | 4.90 | 139 | 7 | yes |
| 17 | life. | 4.90 | 5.08 | 147 | 7 | yes |
| 18 | I | 5.30 | 5.48 | 159 | 8 | yes |
| 19 | was | 5.48 | 5.68 | 164 | 8 | yes |
| 20 | nothing | 5.68 | 6.32 | 170 | 8 | yes |
| 21 | about | 6.32 | 6.68 | 190 | 9 | yes |
| 22 | three | 6.68 | 6.92 | 200 | 9 | yes |
| 23 | years | 6.92 | 7.14 | 208 | 10 | yes |
| 24 | ago. | 7.14 | 7.38 | 214 | 10 | yes |
| 25 | I'm | 7.74 | 7.94 | 232 | 11 | yes |
| 26 | here | 7.94 | 8.90 | 238 | 11 | yes |
| 27 | now. | 8.90 | 9.08 | 267 | 11 | yes |
| 28 | So, | 9.32 | 9.32 | 280 | 12 | yes |
| 29 | I | 9.78 | 9.94 | 293 | 12 | yes |
| 30 | think | 9.94 | 10.14 | 298 | 12 | yes |
| 31 | if | 10.14 | 10.62 | 304 | 13 | yes |
| 32 | you're | 10.62 | 10.78 | 319 | 13 | yes |
| 33 | listening, | 10.78 | 11.02 | 323 | 14 | yes |
| 34 | you're | 11.24 | 11.42 | 337 | 15 | yes |
| 35 | focusing, | 11.42 | 11.84 | 343 | 15 | yes |
| 36 | you | 12.62 | 12.96 | 379 | 16 | yes |
| 37 | just | 12.96 | 13.14 | 389 | 16 | yes |
| 38 | step | 13.14 | 13.34 | 394 | 16 | yes |
| 39 | out | 13.34 | 13.54 | 400 | 17 | yes |
| 40 | of | 13.54 | 13.60 | 406 | 17 | **dropped** |
| 41 | your | 13.60 | 13.66 | 408 | 17 | yes |
| 42 | comfort | 13.66 | 13.80 | 410 | 17 | yes |
| 43 | zone | 13.80 | 14.00 | 414 | 17 | yes |
| 44 | a | 14.00 | 14.12 | 420 | 18 | yes |
| 45 | little | 14.12 | 14.26 | 424 | 18 | yes |
| 46 | bit. | 14.26 | 14.44 | 428 | 18 | yes |
| 47 | Who | 14.50 | 14.60 | 435 | 19 | yes |
| 48 | cares | 14.60 | 14.90 | 438 | 19 | yes |
| 49 | if | 14.90 | 15.10 | 447 | 20 | yes |
| 50 | you're | 15.10 | 15.22 | 453 | 20 | yes |
| 51 | getting | 15.22 | 15.30 | 457 | 20 | yes |
| 52 | embarrassed, | 15.30 | 15.60 | 459 | 21 | yes |
| 53 | you | 15.78 | 15.78 | 473 | 21 | **dropped** |
| 54 | know? | 15.78 | 15.94 | 473 | 21 | **dropped** |
| 55 | Anything | 16.86 | 17.18 | 506 | 23 | yes |
| 56 | can | 17.18 | 17.50 | 515 | 23 | yes |
| 57 | be | 17.50 | 17.68 | 525 | 23 | yes |
| 58 | impossible. | 17.68 | 18.08 | 530 | 24 | yes |

### B. Caption timeline (frame-accurate, 30 fps)

| # | Frames | In → Out (s) | Hold (s) | On screen | Spoken | Lead (s) | Tier | Notes |
|---|---|---|---|---|---|---|---|---|
| 1 | 0–12 | 0.00 → 0.43 | 0.43 | **If you're** | If you're | +0.00 | standard |  |
| 2 | 13–27 | 0.43 → 0.93 | 0.50 | **listening,** | listening, | -0.01 | hero |  |
| 3 | 28–47 | 0.93 → 1.60 | 0.67 | **you're focusing,** | you're focusing, | -0.21 | standard |  |
| 4 | 48–61 | 1.60 → 2.07 | 0.47 | **you step out** | you step out | -0.22 | standard |  |
| 5 | 62–80 | 2.07 → 2.70 | 0.63 | **your comfort zone,** | of your comfort zone, | -0.07 | standard | spoken 'of' dropped |
| 6 | 81–128 | 2.70 → 4.30 | 1.60 | **you can achieve** | you can achieve | -0.16 | standard |  |
| 7 | 129–158 | 4.30 → 5.30 | 1.00 | **anything in life.** | anything in life. | +1.02 | italic |  |
| 8 | 159–191 | 5.30 → 6.40 | 1.10 | **I was nothing** | I was nothing | +0.00 | standard |  |
| 9 | 192–208 | 6.40 → 6.97 | 0.57 | **about three** | about three | +0.08 | standard |  |
| 10 | 209–227 | 6.97 → 7.60 | 0.63 | **years ago.** | years ago. | +0.05 | standard |  |
| 11 | 228–271 | 7.60 → 9.07 | 1.47 | **I'm here now** | I'm here now. | -0.14 | standard |  |
| 12 | 272–313 | 9.07 → 10.47 | 1.40 | **so I think** | So, I think | -0.25 | standard | carries across the cut at f284 |
| 13 | 314–324 | 10.47 → 10.83 | 0.37 | **if you're** | if you're | +0.33 | standard | lands on a blue patch of the sky texture |
| 14 | 325–336 | 10.83 → 11.23 | 0.40 | **if you're / listening,** | listening, | +0.05 | stack | line 1 stays, hero line 2 is added underneath (build) |
| 15 | 337–385 | 11.23 → 12.87 | 1.63 | **you're focusing,** | you're focusing, | -0.01 | italic | carries across the cut at f366 |
| 16 | 386–399 | 12.87 → 13.33 | 0.47 | **you just step** | you just step | +0.25 | standard |  |
| 17 | 400–417 | 13.33 → 13.93 | 0.60 | **out your comfort zone** | out of your comfort zone | -0.01 | standard | spoken 'of' dropped; caption change lands on the cut at f400 |
| 18 | 418–430 | 13.93 → 14.37 | 0.43 | **a little bit.** | a little bit. | -0.07 | standard |  |
| 19 | 431–447 | 14.37 → 14.93 | 0.57 | **Who cares** | Who cares | -0.13 | standard |  |
| 20 | 448–461 | 14.93 → 15.40 | 0.47 | **if you're getting** | if you're getting | +0.03 | standard |  |
| 21 | 462–478 | 15.40 → 15.97 | 0.57 | **embarrassed?** | embarrassed, you know? | +0.10 | emphasis | ', you know?' cut and turned into '?'; fade-out f472–f479 |
| 22 | 479–508 | 15.97 → 16.97 | 1.00 | *(none)* | — | — | breath | 1.0 s of clean footage before the final line |
| 23 | 509–529 | 16.97 → 17.67 | 0.70 | **Anything can be** | Anything can be | +0.11 | standard |  |
| 24 | 530–552 | 17.67 → 18.43 | 0.77 | **impossible** | impossible. | -0.01 | hero_max |  |
| end | 554–613 | 18.47 → 20.47 | 2.00 | **FOUNDERS HOUZE** (end card) | — | — | end_card | hard cut in at f554; fade out f600–f613 |

Lead = caption-in time minus the first spoken word's start (negative = the caption arrives before the word). The +1.02 on #7 and the +0.33 on #13 are Whisper artefacts: it stretched "anything" and "if" across the pauses before them. By eye, both captions land on the word.

### C. Frame-by-frame event log

| Frame | Time | Event |
|---|---|---|
| 0 | 0.00 | Black frame. "If you're" is **already on screen** at centre, and the watermark is at the bottom. VO starts on this frame. |
| 1–24 | 0.03–0.80 | **Letterbox open.** The picture is revealed from a 28 px centre strip to the full frame by two black bars moving apart at a constant ≈15.4 px per frame per side (2.15% of the height per frame). The curve is **linear** (no ease) and takes 24 frames. |
| 13 | 0.43 | Hard cut to **"listening,"** (hero). The bars are only 56% open, so the hero lands mid-reveal. |
| 28 | 0.93 | Hard cut to "you're focusing,". From here on, every change is a 0-frame cut. |
| 48, 62, 81 | 1.60, 2.07, 2.70 | "you step out", "your comfort zone,", "you can achieve". |
| 129 | 4.30 | **"anything in life."** in *italic*: the end of the first sentence. |
| 159, 192, 209, 228 | 5.30–7.60 | "I was nothing", "about three", "years ago.", "I'm here now" (the story beat, all standard). |
| 272 | 9.07 | "so I think". |
| 284 | 9.47 | **Shot cut** (speaker → audience woman). The caption **carries across** the cut, and the fill reads bluer over the brighter shot. |
| 314 | 10.47 | "if you're" (texture lands on a blue patch). |
| 325 | 10.83 | **Build:** "if you're" stays and **"listening,"** (hero) is added underneath as a 2-line stack. |
| 337 | 11.23 | *"you're focusing,"* in italic: the second time the line appears, a softer delivery. |
| 366 | 12.20 | Shot cut back to the speaker. The caption carries across. |
| 386 | 12.87 | "you just step". |
| 400 | 13.33 | Shot cut (→ audience man) **on the same frame** as the caption change: "out your comfort zone". |
| 418, 431, 448 | 13.93–14.93 | "a little bit.", "Who cares", "if you're getting". |
| 462 | 15.40 | **"embarrassed?"** at emphasis size (1.36× standard). |
| 464 | 15.47 | Shot cut back to the speaker, 2 frames after the caption change. |
| 472–479 | 15.73–15.97 | **The only caption fade in the edit:** "embarrassed?" goes to 0 over 8 frames, linear. |
| 479–508 | 15.97–16.97 | **1.0 s with no caption.** "you know?" is spoken but not shown (a breath before the payoff). |
| 509 | 16.97 | "Anything can be". |
| 530 | 17.67 | **"impossible"**: hero-max, the heaviest weight in the edit. |
| 554 | 18.47 | **Hard cut to black end card**: "FOUNDERS HOUZE" centred and larger. The small watermark disappears. |
| 554–599 | 18.47–20.00 | The end card holds for 1.53 s. |
| 600–613 | 20.00–20.43 | The end card fades to black over 14 frames, linear. |

No digital zoom, shake, speed ramp or transition is applied to the footage (I checked scale shot by shot with a best-fit zoom search). All motion in the picture is the original camera.

## 1. Where captions sit relative to the script

- **Chunking:** each caption is a spoken phrase of 1–3 words (4 at most). Chunks break where the speaker breathes and at syntactic joints, never inside a noun phrase: `you step out | your comfort zone,`, `I was nothing | about three | years ago.`
- **Sync:** each caption hard-cuts in on the first syllable of its chunk (median lead 0.00 s; observed −0.25 to +0.10 s). It **holds until the next chunk replaces it**, so while the person talks the screen is never empty and pauses are absorbed by the caption already up.
- **Hold times:** median 0.60 s, shortest 0.37 s, longest 1.63 s. The long holds sit on dramatic pauses ("you can achieve …", "I'm here now", italic "you're focusing,").
- **Copy edits:** filler is removed ("of" ×2, "you know?") and punctuation is rewritten for punch ("embarrassed, you know?" → "embarrassed?"). Speech punctuation stays visible: commas, full stops, question mark.
- **Case:** lowercase by default. Capitalise only a sentence start ("If you're", "Who cares", "Anything can be") and "I".
- **Cuts vs captions:** captions are tied to speech, not picture. They carry over shot cuts (f284, f366, f464). A cut and a caption change coincide only when the cut already falls on a chunk boundary (f400).
- **Silence:** one deliberate empty beat (1.0 s) after the emotional question, before the closing line.

## 2. Design composition

| Element | Spec (measured on the 718 px-high frame) |
|---|---|
| Footage | Full-bleed and untouched; warm amber/black grade; no overlays, no vignette added |
| Caption position | Centred horizontally (x = 50%). The x-height centre sits at **50% of the frame height**, which is the speaker's neck and chest just under the chin. Not a lower third. |
| Depth | The **speaker is in front of the text**: the neck, shirt, tie and mic cut through the letters ("you ca|n achieve", "impo|ss|ible"). A faint ghost of the text stays visible through the subject. |
| Standard type | Bold grotesk (SF Pro Display / Inter Display Bold), tight tracking, ≈0.107 × H font size; "you can achieve" is 541 px wide (42% W) |
| Italic | Same family, SemiBold Italic, ≈0.108 × H |
| Emphasis | Bold, ≈0.146 × H (1.36× standard): "embarrassed?" is 662 px (52% W) |
| Hero | ExtraBold, ≈0.223 × H (2.1× standard): "listening," is 627 px (49% W) |
| Hero-max | Black, ≈0.196 × H: "impossible" is 691 px (54% W) |
| Stack | Small line (standard size) on the centre, hero line directly below with almost no gap (≈ −0.2 em). The hero in a stack is ~12% bigger than a solo hero (703 px). |
| Fill | **Cloud-sky texture:** mostly cloud-white with ice/sky-blue wisps (#bfdff4 → #78b8e6), plus a soft blue haze on each word's outer edges. The texture is fixed to the frame, so where a caption sits decides how blue it reads (the audience shots read bluer). |
| Shadow | Barely there: a soft 0-offset dark halo for separation, no hard drop shadow, no stroke, no box |
| Watermark | "FOUNDERS HOUZE" in a thin geometric caps face (Gotham/Montserrat-like); cap height 2.1% H, width 16% W; bottom centre with its top at 94% H; ~90% white; on every frame except the end card |
| End card | Pure black, the same wordmark centred, cap height 5.4% H, width 40% W, 100% white |

## 3. Caption animation logic

- **In and out are hard cuts (0 frames).** No pop, scale, slide, blur, typewriter or per-word highlight. A caption is perfectly still for its whole hold.
- The premium feel comes from **stillness, exact sync and the type-scale contrast**, not from motion.
- Only four things move in the whole edit:
  1. the 24-frame linear letterbox open;
  2. the stack *build*, where line 2 is cut in under line 1;
  3. the 8-frame linear fade on the final question before the silent beat;
  4. the end card's 14-frame linear fade to black.
- Rhythm: in the run of standard lines there is a change every ~0.5 s. Long holds (1.0–1.6 s) give the important lines room, and a hero arrives about every 7–10 s ("listening," 0.4 s, "listening," again 10.8 s, "impossible" 17.7 s).
