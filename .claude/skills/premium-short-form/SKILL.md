---
name: premium-short-form
description: Re-create the "premium short-form" podcast / talking-head edit style (cinematic captions, AI-composited B-roll scenes, kinetic typography, 1–3s pacing, comment-keyword CTA). Use whenever the user asks to clip, edit, script, storyboard, or plan a reel/short/TikTok from a podcast or voice-over "in my style", "premium style", "pattern v1/v2/v3", "idea worlds", or references the Frame War / Pierre / Jack / Catherine / red-light / problem-solving-brain reference edits. Produces a clip selection, a timed edit decision list (EDL), scene-by-scene design + animation specs, AI image prompts, and (when footage is available) ffmpeg-rendered cuts.
---

# Premium Short-Form Edit

Learned from 10 reference edits (V01–V10) and the designer's Figma board. These references cover:
- Podcast clips: V01 Pierre, V04 Jack, V05 creator, V06 red light, V07 alcohol
- Before/after showcases: V02 sleep, V07
- Monitor POV: V03
- Pure motion-graphic voice-overs: V08, V09, V10 ("Frame War")

Supporting files (read them when you need the detail):
- `references/transcripts-word-level.md`: word-timed transcripts of all 10.
- `references/video-breakdowns.md`: frame-by-frame/shot-by-shot tables per video.
- `references/design-system.md`: colours, fonts, textures, layouts, and the Figma scene types.
- `references/animation-system.md`: text/object/camera/transition logic, and how it maps to the script.
- `docs/pattern-v3/breakdown.md` (repo root): **Pattern v3 "Idea Worlds"** (P1–P4, Nov 2026). Covers hook choice, story skeleton, face-vs-graphic rule, transition placement, interviewer handling, camera-angle logic. The shot table is in `docs/pattern-v3/shots.csv`.

## The core idea (one sentence)
**Every spoken idea gets its own designed visual, cut on the word, at 1–3 s per beat. The speaker carries emotion, the visuals carry meaning, and the captions point to the one word that matters.**

## Workflow (follow in order)

### 1. Ingest
- Download the footage (Drive: `https://drive.usercontent.google.com/download?id=<ID>&export=download&confirm=t`).
- Extract 16 kHz mono wav with ffmpeg.
- Transcribe with faster-whisper (`word_timestamps=True`). Pass a numpy array from soundfile, because the PyAV path breaks here. Set `HF_HUB_DISABLE_XET=1`.
- Run scene detection: `ffmpeg -vf "select='gt(scene,0.25)',showinfo"`.

### 2. Select the clip (40–60 s, or 10–15 s for a VO motion piece)
Score candidate windows. Pick the one with the highest total:
- +3 for an opening line that has a **number/result** or a **"surprising fact about you"** ($14M, $120,000 in 3 days, 8% of people…).
- +2 for a relatable "you…" scenario ("you wake up and…", "that guy at 3am").
- +2 for a single self-contained argument with a quotable closing/thesis line.
- +2 for an emotional turn or confession.
- +1 for each concrete noun or metaphor that can be visualised.
- −3 if it needs earlier context, or if the window starts or ends mid-word.

Trim the ends to word boundaries (use word timestamps, plus a 0.2 s audio fade-out).

### 3. Shape the script (the hook → story arc)
1. **Hook (0–3 s):** the number/result line. If it sits later in the talk, move it to the front (V01 opens on the host repeating "$14 million…, you said?"). Optionally, add a **title-banner question** for the first 3 s (V06: "Why Your Skin Ages Faster Than You Think?").
2. **Reaction / contrast (3–8 s):** a host reaction ("Holy f\*ck", "Wow") or a contrast ("You're only 22").
3. **Bridge (one line):** one host question, OR none in the guest-only mode.
4. **Body (3–5 one-liners, 3–6 s each):** principle → analogy → "you" scenario → science/why.
5. **Turn (~65–75%):** a personal or emotional beat.
6. **Close:** the thesis line OR a mid-sentence cliffhanger ("it really started changing when—"), then a **comment-keyword CTA**.

**Cut:** greetings, filler, pause tails, host question tails, anything after the punchline, and anything that can't be visualised.
**Keep:** numbers, swearing (flagged red), host one-word reactions (as audio only in mode B), laughter before the CTA.

### 4. Choose a mode
| Mode | When to use | Pace | Host | Visual share |
|---|---|---|---|---|
| **A: Hype podcast** (V01, V04) | Business/status stories, two cameras | cut every 1.0–1.3 s | ~30% (intro, hype, one question) | 25% B-roll |
| **B: Visual storytelling** (V05, V06, V07, V02) | Education, science, advice | cut every 2–3 s | 0–5% (audio reactions only) | 40–50% designed visuals |
| **C: Motion-graphic VO** (V08–V10, V03) | Quotes, VO, a single-camera intro | new scene per sentence (1.5–2.5 s) | none | 90–100% composited scenes |
| **D: Idea worlds (pattern v3)** (P1–P4) | One idea/opinion, guest-only, multi-cam or solo | visual change every 2.2–2.7 s | none (one 0.3 s room cutaway at most) | 25–75% 3D "idea worlds" (more when there are fewer camera angles) |

**Mode D rules (full detail in `docs/pattern-v3/breakdown.md`):**
- Hook = one self-contained sentence on frame 0 that names the viewer's group; open on the face, first graphic at 0.5–1.9 s.
- Skeleton: hook → widen ("I" → "people") → contrast word ("but"/"while") → list of 3–4 concrete items → punchline. Hard stop on the last word, with no CTA.
- **Face = feelings, opinions, the punchline. Full-screen graphic = nouns, numbers, list items, processes.**
- Each idea gets one 3D world (cream background + one accent colour). Follow-up sentences on the same idea stay in that world, and the camera moves to the new text while the previous line stays visible.
- Cut only on a sentence start or a contrast word. Use stylised transitions into graphics and hard cuts back to the face. Hide audio joins with an angle change.
- Never repeat an angle back-to-back. Tighten the shot size toward the punchline. After a long graphic run, re-enter with a 0.2–0.3 s room-wide shot.
- Two speakers: cut to the new speaker on their first word, and cut back during the pause before the original speaker resumes. The second voice is for the emotional middle, never the opening or the close.
- Remove every pause within a turn; keep a breath only at speaker handoffs.

Default to **B** unless the user names another mode.

### 5. Build the EDL (beat sheet)
Make one row per beat. A beat is a phrase of 2–6 words or one idea:
```
| # | in–out (s) | words spoken | layer | scene type (design-system §Scene types) | caption (keyword in CAPS) | animation in / hold / out | camera | transition | psychology |
```
Rules:
- **Visualise:** each noun, stat, metaphor or list gets a visual. Emotion and "I" statements go on the speaker.
- **Shot length:** never hold one picture longer than 3.5 s without a change (a new shot, a punch-in or a new text element).
- **Cut on the stressed syllable** of the keyword, or 2–4 frames before it.
- **Speaker angles** rotate WIDE → MCU → punch-in (110–120%) → profile/moody. A punch-in on the same angle hides every jump-cut.
- **Transitions only at topic changes:** glitch (A), Polaroid/white-frame zoom (B), blur or whip, or a push into a screen-within-a-screen (C). Everything else is a hard cut.
- **Ending:** a CTA card ("Comment 'KEYWORD' for the full episode" or "Comment '3' to vote").

### 6. Design every scene
Use the specs in `references/design-system.md`:
- One accent colour per video.
- Inter Medium + Bold caption pairs. Display fonts only for graphic headlines.
- Grain/paper textures, and text placed behind subjects for depth.

For each AI scene, write a separate prompt per element (subject, prop, background). Composite them in one frame and animate the layers separately. Never generate one flat image.

### 7. Animate
Follow `references/animation-system.md`. The defaults:
- **Captions:** word-by-word pop. Each word moves 6–12 frames ahead of its audio.
- **Keyword:** scale 0 → 110 → 100% over 8–10 frames, plus a colour/glow highlight.
- **Objects:** slow drift/rotate (2–5% over the shot), and parallax between layers.
- **Camera:** a constant push-in of 103–108% on every still. Never leave a still static.
- **Numbers:** a count-up over 0.6–1.0 s, landing on the spoken number.

### 8. Deliver
Output four things:
1. The chosen in/out points with the reason.
2. The shaped transcript.
3. The full EDL table.
4. The scene design + AI prompt list.

When footage is available, also render the raw cut with ffmpeg: hard cuts at the EDL timestamps, `-c:v libx264 -crf 18`, AAC 192k. Save it to the scratchpad and send it with SendUserFile.

State clearly what still has to be done in an NLE/AE (captions, composites, motion), unless the user asked for a full render.

## Quick checklist before handing off
- [ ] The hook number is spoken AND shown full-screen within 2 s.
- [ ] No picture holds longer than 3.5 s.
- [ ] One accent colour is used, and every keyword is highlighted.
- [ ] Every metaphor, number and list has its own visual.
- [ ] Transitions appear only at topic changes.
- [ ] The video ends on a thesis line or cliffhanger, followed by a comment-keyword CTA.
- [ ] Safe zones respected (9:16): captions between 55–75% of frame height, nothing important in the top 12% or bottom 18%.
