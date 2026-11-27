---
name: livesites-motion-style
description: Edit style for the Livesites client (AI brochure ads, VSL, vertical demo). It combines a creator-tutorial caption system (small lowercase 1–3-word hard-swap captions whose placement depends on the layout: by the face, on the split-screen seam, under the graphic) with a premium beat-synced UI/3D motion language (write-on text, white flash and match-on-action cuts, dark-UI → white-result → black-brand worlds). Use whenever the user asks to plan, storyboard, caption, animate or edit a Livesites video, or mentions the "Turn Claude into a content machine" caption reference or the "unofficial Claude animation" reference.
---

# Livesites motion style

**Brand first:** read `edits/livesites/brand/BRAND.md`. Use Geist captions, Paper/Mist/Ink/Night colours and the Iris→Orchid→Bloom live gradient as the only accent (≈4 %). Motion is calm glass with no bounce, and the star sparkles once. Where the references conflict with the brand, the brand wins.

**Client decisions (Nov 2026):**
- 9:16 deliverables.
- Brand colour in place of the reference colours.
- The scan sweep stays, in the live gradient.
- The CTA is an animation of a cursor going to the client's Instagram profile and tapping the link in the bio.
- The user supplies the music.

The full analysis is in `edits/livesites/style-study/` (read `01_caption_reference.md` for the caption log and shot list, `02_animation_reference.md` for the frame-by-frame animation breakdown, and `03_applying_to_livesites.md` for the script mapping).

## Structure (from the caption reel)
Hook with a result + a title lockup + visual proof → problem shown live → "But" cut to the face → the fix, explained with designed graphics → **proof** = the real product UI scrolling → a short lifestyle montage → CTA, ending on the same framing as frame 0 (loop).

## Layouts (shares of runtime in the reference)
| layout | share | description |
|---|---|---|
| SPLIT | 35 % | Graphic on top, face below. Both halves become B-roll in the montage. |
| B-WHITE | 29 % | Designed graphics on #F8F7F4 |
| A-FULL | 18 % | Talking head |
| UI-DARK | 15 % | The real product UI |
| B-FULL | 4 % | Lifestyle |

Average shot 2.3 s, with 0.4–1.0 s in the montage. The face is on screen ~45 % of the time: on the problem, the turn ("But"), "let me show you", the personal beats and the CTA.

## Captions
- Inter Bold, **lowercase**, white, ~54 px @1080w, tracking −2 %. **Hard swap with no animation**, 1–3 words split on speech units (mean 0.42 s, 1.8 words). No keyword colour.
- Placement by layout:

| layout | placement | box |
|---|---|---|
| A-FULL | Negative space beside the head at eye level (y≈37 %); in the hook, on the chest by the raised hand (y≈54 %) | None |
| SPLIT | Centred **on the seam** | Dark translucent pill, rgba(30,30,30,.6), r≈12 |
| B-WHITE | **Under the graphic**, following its bottom edge | Light-grey pill (#B5B5B5) |
| UI-DARK | Just above the UI's bottom input bar (y≈73 %) | Dark pill |

- CTA section: **one word per chunk**. Don't caption the keyword the lockup shows.
- **Title lockups** (heavy grotesk, silver white→#9A9A9A vertical gradient, drop shadow, small kicker above + sub-line below) **only** for: the hook result, the product name and the CTA keyword.

## Graphics choice
- Show every concrete noun or claim. A list becomes chips that pop **on their word**.
- "The AI reads/watches" → a scan sweep across the media. "Searching" → a radar sweep. (The reference uses green; ask the client, default to the brand colour.)
- Explainer = a clean off-white canvas. Proof = the raw real UI with a highlight box landing on the key word.
- Put graphics where the speaker's hand points.

## Motion (from the animation reel)
- Music-led: **cut every section change on a kick** (the reference is 108 BPM, a 0.556 s grid). Small moves happen between beats.
- Hide cuts with a **1-frame white flash**, a **match-on-action** (the send arrow flies out of the UI and continues as a 3D cursor), or a **white↔black invert** (3 frames).
- The world logic: **dark UI + orange rim-light = AI thinking** → **white world = result** → **black + glowing horizon arc = brand end card**.
- Text **writes on** per letter or word with blur → sharp; it never pops. Serif for the brand and greeting, sans for actions and taglines.
- The camera always moves: dolly-out reveals, whip-zoom into the focus, lateral tracks along UI elements, slow push-ins.
- Outputs become **3D objects**: paper-curl cards fanning in, a spinning laptop. Motion blur and echo trails on every fast move.
- Logo intro: shape morph (sliver → star → burst → logo) with echo trails, then the wordmark, then a strobe flicker, then a white flash on the drop. Logo outro: the icon pops after the wordmark and spins slowly.
- One accent colour (the Livesites brand colour) on black / white / cream.
