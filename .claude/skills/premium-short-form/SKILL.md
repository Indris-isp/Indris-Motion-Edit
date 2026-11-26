---
name: premium-short-form
description: The client's "premium editing style" (premium short-form). Re-create the podcast / talking-head edit style (cinematic captions, AI-composited B-roll and 3D "idea world" scenes, kinetic typography, 1–3s pacing, comment-keyword CTA or loopable hard stop). Use whenever the user asks to clip, edit, script, storyboard, or plan a reel/short/TikTok from a podcast or voice-over "in my style", "premium editing style", "premium style", "pattern v1/v2/v3", "idea worlds", "before/after" or "raw vs final" showcase, or references the Frame War / Pierre / Jack / Catherine / red-light / problem-solving-brain reference edits. Produces a clip selection, a timed edit decision list (EDL), scene-by-scene design + animation specs, AI image prompts, and (when footage is available) ffmpeg-rendered cuts.
---

# Premium Short-Form Edit

Learned from **15 reference videos (V01–V15)** and the designer's **Figma board**:
- **Podcast clips:** V01 Pierre, V04 Jack, V05 Catherine, V06 red light, V07 alcohol gene, V12 problem-solving brain, V13 Aussie creators.
- **Presenter clips:** V14 UAE property, V15 every week in 2025.
- **Packaging / portfolio formats:** V02 before/after, V03 monitor POV, V07/V13 raw vs final, V14 macOS window, V15 before/after.
- **Motion-graphic voice-overs:** the Frame War contest. V09 is the voting board; V08, V11 and V10 are entries 1–3, three style interpretations of one script.

Supporting files (read them when you need the detail):
- `references/transcripts-word-level.md`: word-timed `medium.en` transcripts of all 15, with speaker turns.
- `references/video-breakdowns.md`: frame-by-frame / shot-by-shot tables for all 15 (time · words · scene ID · text + animation · transition).
- `references/design-system.md`: the Figma board notes, the **scene-type catalogue** (A–E, 50+ IDs), measured colour palettes, fonts, textures, layout.
- `references/animation-system.md`: text, object, camera and transition mechanics, with measured durations.
- `references/script-timing-psychology.md`: measured pacing, where cuts land, hook types, story skeletons, host usage, the word → visual map, and why each choice works.
- `references/sound-design.md`: measured SFX and music rules (a sound on 86% of cuts, whoosh peaks on the cut, low hits on big reveals, about 1.7 foley/pop transients per second, music bed level, mastering) and **the client's SFX library**, file by file.
- Raw data: `docs/references-data/` (word JSON, stats, palettes, contact sheets). Long-form write-ups: `docs/editing-style-breakdown.md` (v1), `docs/editing-pattern-v2-storytelling.md` (v2), `docs/pattern-v3/breakdown.md` (v3).

## The core idea (one sentence)
**Every spoken idea gets its own designed visual, cut on the phrase or the keyword, at 1–3 s per beat. The speaker's face carries emotion, opinion and the punchline; the visuals carry nouns, numbers and metaphors; the captions point to the one word that matters, in one accent colour taken from the footage.**

## Start here (do not improvise the style)
This style was built over many client review rounds. A fresh session that only reads the rules and invents its own visuals produces what the client called "a generic AI copy". Always:
1. **Look before you design.** Open the reference contact sheets in `docs/references-data/sheets/` (`sheet_V12_1.jpg` puzzle/bulb world, `sheet_V08_1.jpg` cutting mat, `sheet_V05_*`, `sheet_V06_*`, `sheet_V13_*`) and `docs/pattern-v3/sheets/`. Match their framing, density, type sizes and materials, not a generic motion-graphics look.
2. **Reuse the production kit** in `edits/income-first/` instead of writing a new pipeline. It is the only pipeline the client has reviewed:
   | Need | Reuse |
   |---|---|
   | Face-tracked 9:16 raw cut (smooth dead-zone camera, face centred, never out of bounds) | `edits/income-first/raw_cut.py` |
   | Word timings, energy-snapped cuts | `edits/income-first/edit.py` (`src_to_out`, waveform snapping) |
   | Beat plan → scenes → final video (A-roll grade, B-roll crops, roto text behind people, whips, grain, vignette) | `edits/income-first/v2/build.py` (`prep` / `plan` / `compose`) |
   | Caption styles (run-in + keyword pair, word-by-word reveal, boxed serif, glow uppercase) | `edits/income-first/v2/scenes.js` (`line`, `reveal`, `chunkVis`, the `cap_*` scenes) |
   | 3D idea worlds with depth of field, soft shadows, real materials | `edits/income-first/v2/scenes3.js` (`makeStudio`, `jigsaw`, `canvasTex`, the `puzzle_v12` / `mat` / `lottery3d` scenes) and `scenes2.js` (phone + coin rain) |
   | Headless render of scenes (Playwright + three.js r149, vendored) | `edits/income-first/v2/scenes.cjs`, `vendor/three.min.js` |
   | SFX + music mix, ducking, −14 LUFS | `edits/income-first/v2/audio/mix.py`, with cues swapped to the client's SFX library (see `references/sound-design.md`) |
   Copy the v2 folder to `edits/<new-clip>/`, then replace the plan, words and scenes. Keep the helpers, the compositor and the look.
3. **Show stills first** (§7b), then render.

## Client standards (non-negotiable, from the client's review of the "income first" edit, 2026-11-26)
1. **Premium, clean and neat design.** Every frame must look finished: one clear subject, a full frame, real depth and materials, generous margins and nothing cluttered, cropped, washed out or empty. See §6 and the premium rules in `references/design-system.md` §0.
2. **Smooth animation.** Every move is eased, motion-blurred when fast, and continuous. Nothing pops, jitters, snaps or stalls by accident. See §7 and `references/animation-system.md` §0.
3. **Stills before video.** Before rendering any video (the first cut *and* every revision), send stills of every designed beat for approval, then **stop and wait**. See §7b.
4. **SFX only from the client's library** (Drive folder `1ogoXwqB9I2h5VPQdyBIO9XPVuKtQFC1J`). Never use Claude's own picks, Mixkit previews or synthesized sounds; the client judged them sloppy. See `references/sound-design.md`.

## Workflow (follow in order)

### 1. Ingest
- Download the footage (Drive: `https://drive.usercontent.google.com/download?id=<ID>&export=download&confirm=t`). File IDs are case-sensitive: copy them exactly from the Drive listing. A tiny HTML file means the ID was wrong.
- Extract 16 kHz mono wav with ffmpeg.
- Transcribe with faster-whisper `medium.en` (`word_timestamps=True`, `beam_size=5`). Pass a numpy array from soundfile, because the PyAV path breaks here. Set `HF_HUB_DISABLE_XET=1`. `small.en` is faster but its word timing is looser.
- Run scene detection: `ffmpeg -vf "select='gt(scene,0.2)',showinfo"`. Framed or packaged edits need a visual check, because the detector only sees the outer frame.
- Make 2 fps contact sheets (`fps=2,scale=…,drawtext=%{pts\:flt},tile=…`) and look at them before you decide anything.

### 2. Select the clip (15–60 s; 10–15 s for a VO motion piece)
Score candidate windows and pick the one with the highest total:
- +3 for an opening line that has a **number/result**, a **curiosity question with a surprising answer**, or a **group callout** ("the biggest challenge for Aussie creators…").
- +2 for a relatable "you…" scenario.
- +2 for a single self-contained argument that ends on a quotable thesis or punchline.
- +2 for a contrast word ("but", "while") followed by a list of 3–4 concrete items.
- +2 for an emotional turn or confession.
- +1 for each concrete noun, number or metaphor that can be visualised.
- −3 if it needs earlier context, or if the window starts or ends mid-word.

Start on the first word of a sentence, at frame 0. End on the last word (+0.2 s audio tail).

### 3. Shape the script
1. **Hook (0–3 s):** one complete sentence. Pick the type from `script-timing-psychology.md` §3: number, question → surprising answer, identity, hard truth, audience callout, or feeling + now. If the strongest number sits later, move it to the front (V01 opens on the host repeating "$14 million…, you said?").
2. **Widen / set up (3–8 s):** a host reaction or contrast (mode A), or widen from "I" to "people" (modes B/D).
3. **Body:** 3–5 one-liners, or a contrast word + a list of 3–4 items (one visual unit each).
4. **Turn (~65–75%):** a personal, emotional or second-voice beat.
5. **Close:** the strongest line. Choose one:
   - a thesis line;
   - a callback to the hook;
   - a mid-sentence cliffhanger ("it really started changing when—");
   - a host reaction ("Wow.");
   - a hard stop that loops.

   Add a **comment-keyword CTA** only when the clip promotes an episode or a vote.

**Snap every cut to the waveform, not to Whisper.** Whisper word ends run long across pauses. Measure 10 ms RMS and cut at a dip of about −40 dB or lower. Compress pauses over 0.3 s down to 0.12 s. Then **re-transcribe the cut audio**: this catches clipped words and leftover "uh"s (see `edits/income-first`).

**Working from a finished multi-cam episode** (not separate camera feeds): only the angle the episode's editor chose exists at each moment.
- Pick a window where the episode itself cuts between cameras (check `shots_full.csv`).
- Align every shot start to those camera cuts, so a reframe always matches the angle on screen.
- Measure face centres on the window's own frames.
- Add virtual angles: punch-ins at 1.25–1.55×, cards, and a **host reaction cutaway**. Take the host's half of an episode two-shot recorded while the guest was talking (so the host isn't speaking).

**Cut:** greetings, host question tails, every pause inside a speaker's turn (podcast clips run at 3.5–4.6 words/s), anything after the punchline, and anything that can't be visualised.
**Keep:** numbers, swearing (censored with \*, flagged red), one-word host reactions, connectors like "so / because / like" (they keep it sounding spoken), and a breath at speaker handoffs.

### 4. Choose a mode
| Mode | When to use | Beat | Host | Not on the face |
|---|---|---|---|---|
| **A: Hype podcast** (V01, V04) | Business/status stories, 2+ cameras | 1.3–1.6 s | ~30%: hook, reaction, one question | 10–45% B-roll/screens; giant text on most shots |
| **B: Visual storytelling** (V02, V05, V06, V07) | Education, science, advice | 2.1–2.7 s (1.4 s for fast "you" stories) | 0–5%: audio reaction or the last word | 30–45% designed visuals, renders, AI "you" scenes |
| **C: Motion-graphic VO** (V03, V08, V10, V11) | Quotes, VO, a single-camera intro | 1.0–1.8 s (one scene per sentence) | none | 90–100% composited scenes |
| **D: Idea worlds** (V12–V15) | One idea/opinion, guest-only or solo presenter | 2.2–2.7 s | none (at most a 0.3 s room cutaway) | 25–75%, more when there are fewer camera angles |

Default to **B** for education/science and **D** for opinion/insight clips, unless the user names a mode. Wrap any mode in a **packaging frame** (design-system E1–E7) only when the user wants a portfolio, showcase or contest post.

**Mode D rules** (full detail in `docs/pattern-v3/breakdown.md`):
- **Face = feelings, opinions, the punchline. Full-screen graphic = nouns, numbers, list items, processes.**
- Each idea gets one 3D world (cream + one accent). Follow-up sentences on the same idea stay in that world, and the camera moves to the new text while the previous line stays visible.
- Never repeat an angle back-to-back. Tighten the shot size toward the punchline.
- Two speakers: cut to the new speaker on their first word, and cut back in the pause before the original speaker resumes. The second voice is for the emotional middle.

### 5. Build the EDL (beat sheet)
Make one row per beat. A beat is a phrase of 2–6 words or one idea:
```
| # | in–out (s) | words spoken | FACE / GRAPHIC | scene ID (design-system §2) | caption: run-in / KEYWORD / trailing | animation in / hold / out | camera | transition | why (psychology) |
```
Rules (measured, see `script-timing-psychology.md` §2 and §8):
- **Cut placement:** about 2 in 3 cuts go 0–2 f before a **phrase start**; about 1 in 3 go on the **stressed keyword** (punch-in or B-roll insert on the noun).
- **Hold:** never longer than ~5 s, unless it's the thesis, a CTA card, a recap, or a list building on screen.
- **Visualise:** every number, noun, metaphor, "you" scenario and list item gets a visual (word → visual map, §6). Emotions and "I" statements stay on the speaker.
- **Angles:** rotate wide → MCU → punch-in (110–120%) → profile/gelled. A punch-in on the same angle hides every jump cut. After a long graphic run, re-enter with a 0.2–0.3 s room-wide shot.
- **Transitions only at topic changes** (no more than one per 5–8 s): glitch, white flash, light leak, Polaroid, whip, iris, or a push-through. Go **into** graphics with a transition, and **back to the face** with a hard cut.

### 6. Design every scene
Use `references/design-system.md`:
- **One accent colour per video, taken from the footage** (wardrobe, practical lights, brand), plus red for negatives.
- **Captions are always a Medium + Bold pair** (the Figma rule): Inter Medium for run-ins, Inter Bold or a display face (serif italic, gold script, glow extended, 3D extruded) for the one keyword.
- Grain/paper textures, glass for UI, and text placed behind subjects for depth.
- **Premium, clean, neat** (client standard 1). Check every scene against these before showing stills:
  - **One focal subject** that fills 60–85% of the frame width. No dead empty areas, no exposed canvas or set edges, no stray props competing with the subject.
  - **Depth:** a soft foreground or background, a sharp subject, soft contact shadows, and real materials (paper grain, glossy plastic, brushed metal, glass). Flat CSS boxes and clip-art shapes read as cheap.
  - **Type:** run-ins are at least 60 px on a 1080-wide frame and the keyword is 150–200 px. Use no more than two sizes plus the keyword, keep 64 px side margins, and never let text touch or cross an edge.
  - **Colour:** palette only (base, text, one accent, red for negatives). Nothing blown out or washed out. In three.js, ACES divides the exposure by 0.6, so use `toneMappingExposure` ≈ 0.55–0.65 and keep hemisphere/env light low.
  - **No "AI look":** no glow on everything, no generic floating cards, no shrinking-card transitions, no random pans to a second card. Stay in one world per idea, as in the references.
  - Props must support the line and match the references' realism (the V08 desk with keyboard, mouse and coffee; the V12 bulb and pieces).

For each AI scene, write a separate prompt per element (subject, prop, background). Composite them in one frame and animate the layers separately. **Never animate one flat generated image** (the Figma rule).

### 7. Animate
Follow `references/animation-system.md`. The defaults:
- **Captions:** word-by-word fade/de-blur on each word's onset. **Keyword:** overshoot scale + colour/glow (A), blur-to-sharp or letter-assemble (B), gold script fade-up (D).
- **Numbers:** a count-up that lands on the spoken number (rolling 0.4–1.3 s, or typed 0.6 s).
- **Objects:** do what the sentence says (pieces lock, bars rise, the chart draws, a bubble flashes red), plus a slow drift/parallax.
- **Camera:** a constant push-in of 103–106% on every still; in-world tilts and pushes for continuing ideas; zoom-blur pushes on screen recordings.
- **Smooth** (client standard 2):
  - Every move is eased: ease-in-out cubic for the camera, ease-out cubic or a light back-overshoot for entrances. Use linear only for slow constant drift.
  - Entrances take 0.25–0.6 s and camera moves 0.6–1.0 s. Let each landing settle for at least 0.4 s before the next move starts.
  - Fast moves get motion blur scaled to their speed. A whip smears 2 frames before the cut and 3 after.
  - Never run two competing camera moves at once, and never leave a frame fully static.
  - Everything is deterministic: seeded randomness, no per-frame noise in positions, and face tracking through the dead-zone camera.
  - Render at the delivery frame rate (23.976). Check 10 fps strips of every move for jumps, flicker and pops before the final render.

### 7b. Stills approval gate (before any video render)
1. Render **2–3 stills per designed beat** (entrance, keyword moment, end state) and one per A-roll caption style, at full resolution.
2. Tile them into a labelled board: the beat number, timestamp, spoken words and scene ID under each still.
3. Send the board with SendUserFile. List what each beat will do in motion, and the SFX planned for it.
4. **Stop and wait for approval.** Do not render the full video until the user says to go ahead.
5. If they give notes, change only those beats and send their new stills.

This applies to revisions too. When a scene is redesigned, its stills go out first.

### 8. Deliver
Output four things:
1. The chosen in/out points with the reason (rubric score).
2. The shaped transcript.
3. The full EDL table.
4. The scene design + AI prompt list (with palette hexes and fonts).

When footage is available, also render the raw cut with ffmpeg: hard cuts at the EDL timestamps, `-c:v libx264 -crf 18`, AAC 192k. Save it to the scratchpad and send it with SendUserFile.

State clearly what still has to be done in an NLE/AE (captions, composites, motion), unless the user asked for a full render.

**Sound** (full render): SFX from the client's library only, placed to the measured pattern in `references/sound-design.md`. Music from the client's BGM folder. Master to −14 LUFS.

## Quick checklist before handing off
- [ ] The first word is on frame 0; a visual change or keyword hit lands by 2.4 s.
- [ ] The hook number is spoken AND shown together (a count-up lands on the syllable).
- [ ] Beat length matches the mode; no picture holds longer than ~5 s (except a thesis, CTA, recap or building list).
- [ ] Most cuts sit on phrase starts; the rest on stressed keywords.
- [ ] Face = emotion/opinion/punchline; graphics = nouns/numbers/lists/metaphors.
- [ ] One accent colour from the footage; every keyword highlighted; captions in a Medium + Bold pair.
- [ ] Every AI scene is a layered composite, and every still moves.
- [ ] Transitions appear only at topic changes; returns to the face are hard cuts.
- [ ] The strongest line is last: thesis, callback, cliffhanger, host reaction or loopable hard stop (+ a comment-keyword CTA if promoting).
- [ ] Safe zones respected (9:16): captions at 55–75% of frame height; nothing important in the top 12% or bottom 18%.
- [ ] Premium and clean: one focal subject, full frame, real depth and materials, no crops, overlaps, washed-out tones or empty areas.
- [ ] Smooth: every move eased; fast moves blurred; no pops, jitter or stalls (checked on 10 fps strips).
- [ ] Stills were approved before the video render.
- [ ] Every SFX comes from the client's library (no Mixkit previews, no own picks), and the music comes from the client's BGM folder.
