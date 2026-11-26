# "Find income first" v2.2: built from the client's plan

The plan came from the planning page (https://claude.ai/artifact/GdLQYHvF6VDgZBNwcuebMS):
- 14 annotated lines with 17 reference images;
- palette **A, Studio Cyan** (accent `#5FD8F5`, base `#0F1113`, text `#F2EEE8`, negative `#FF5446`);
- cut after the 37th second, so the video ends on "…Don't do that to your families." (speech ends 37.925 s).

**Output:** `out/income_first_v2_1080x1920.mp4`, 1080×1920, 23.976 fps, 38.2 s, −14 LUFS (voice + music + SFX). Not in git; rebuild with the steps below.

To rebuild, run these from `edits/income-first/v2`:

```bash
python3 build.py prep
```

```bash
python3 build.py plan
```

```bash
node scenes.cjs
```

```bash
python3 build.py compose
```

`prep` crops and re-times the B-roll, runs the MODNet person matte and computes the villa sky mask. `scenes.cjs` renders the designed scenes and caption overlays (Playwright + three.js in headless Chromium). `compose` writes the final video and runs the sound mix (`audio/mix.py`). `python3 build.py --still 2.0,17.9` writes single frames.

The A-roll is the face-tracked raw cut (`../out/income_first_RAW_1080x1920.mp4`), so the raw cut's timeline is the output timeline.

## v2.2 changes (client notes round 3)

The notes asked for four things: find the mistakes and fix them, make the edit more premium and engaging, add SFX and the best BGM from the client's folder, and stop using frames that look sloppy.

- **0:13–0:17 puzzle, 0:20–0:25 offer letter, 0:31–0:34 lottery** were rebuilt as lit 3D sets (`scenes3.js`). Each has:
  - real depth of field (a 64-tap circle-of-confusion blur from a depth pass);
  - soft VSM shadows, physical materials and props;
  - bigger type.
  The scenes themselves:
  - **Puzzle:** a warm studio table. A real bulb lights on "way" as the glossy pieces lock. The camera then tilts down to cheques sliding in for "checks rolling in".
  - **Offer letter:** a desk seen from above, with a cutting mat (ruler marks), keyboard, mouse, coffee, pen and a sticky note. The tri-folded letter slides in, the words write on with a highlighter, and a "Money in" label slaps on.
  - **Lottery:** a night-time store counter. A neon sign and shelves sit in soft focus. Cash is pushed across, the terminal flashes PAID, and the ticket prints and flies to camera.
- **0:25:** the card zoom-out back to the A-roll looked cheap, so it is now a whip cut. There is also a whip into "YEAH." (0:34).
- **Captions:** the run-in captions are bigger (60 px, from 54).
- **Sound:** `audio/sfx_analysis.py` measured the 14 reference edits. 86% of cuts carry a sound: whooshes on 71% of cuts and low hits on 30% (the big reveals), plus about 1.7 small pops and foley sounds per second, over a music bed. The summary is in `.claude/skills/premium-short-form/references/sound-design.md`.
  - `audio/mix.py` places 70 cues to that pattern: whoosh peaks on the cuts, low hits on reveals, and coins, paper, label slap, keypad, printer and neon hum foley.
  - **Music:** the *Succession* main title from the client's "Premium bg song" folder, a money-and-ambition theme, timed so its final hit lands on the last frame. It sits about 15 dB under the voice in pauses and 21 dB under it during speech, and the mix is mastered to −14 LUFS.
- **Rebuilding the audio** needs `audio/src/bgm.wav` (the client's track) and `audio/src/sfx/<id>.mp3` (Mixkit ids listed in `audio/mix.py`). Neither is in git.
- **The client's Figma picks** (node 9-22) could not be read: the Figma MCP Starter-plan limit blocked it. The redesign follows the premium reference frames from the Drive folder instead (V12 puzzle world, V08 cutting mat).

## Plan → build

| Line | Time (s) | Client note | Built |
|---|---|---|---|
| 1 | 0.00–3.06 | Caption appears and zooms out, designs like the refs (V13 "questions ???", "Aussie creators" orbit) | Host A-roll with **"message"** landing big and zooming out over giant outlined **???**. Then the host **irises into a circle** in an orbit card ("people who are / *watching this*"), with 7 viewer avatars orbiting him |
| 2 | 3.06–5.17 | Famous movie B-roll, caption in a roto effect (Jack Mason ref) | Clapperboard B-roll, then a red-carpet actor with giant **ACTING?** *behind* him (MODNet matte) |
| 3 | 5.17–8.19 | Caption in the middle, then slides slightly left (30,000ft ref) | "so my / *advice* / to anybody" centred, then it slides left; punch-in on "*play this game*" |
| 4 | 8.19–13.19 | Money 3D element (client's Pinterest coin-rain ref at 0:10) | "is find something" on the A-roll. Then a 3D phone flies in, the balance counts up and cyan coins burst and rain into a pile, with **"Income / *first.*"** |
| 5 | 13.19–17.33 | Puzzle joins on a smooth curve, bulb = idea (V12 ref) | A warm 3D studio table. Glossy jigsaw pieces glide in and lock on "find a **way**" as a real bulb lights. The camera tilts down to cheques sliding in: **CHECKS / ROLLING IN** |
| 6 | 17.33–18.57 | Replace the element with a house, text "get into real estate" (Chevron ref) | B&W villa under a drawn grey sky; **GET INTO / REAL ESTATE** rises out from behind the roof (sky mask) |
| 7 | 18.57–19.96 | Replace the text (CRT + sticky notes ref) | A retro beige CRT on a desk, a cyan stock chart drawing up, **THE STOCK MARKET**, and 6 sticky notes (Index funds, Dividends, Buy & hold, Long term, Portfolio, Compound) |
| 8 | 19.96–22.38 | An offer letter for a full-time job (cutting-mat ref) | A 3D desk from above (cutting mat, keyboard, mouse, coffee, pen, sticky note). A tri-folded offer letter slides in, and "you find a / **full-time job**" writes on with a highlighter |
| 9 | 22.38–26.61 | Caption ("that brings the money in"), then back to the A-roll and place the caption | The camera glides down the same letter to "that brings / **the money in**" and a dark **Money in** label slaps on. A whip cut returns to the A-roll: **THEN / PURSUE THIS** |
| 10 | 26.61–31.61 | Caption in the A-roll | Run-in captions, punch-ins 1.0 → 1.18 → 1.40; "*starving*" (red) "*actors*" |
| 11 | 31.61–34.39 | A person buying a lottery ticket in a store | A 3D night-time store counter. Cash is pushed across, the terminal flashes **PAID ✓**, and the ticket prints and flies to camera: "*lottery ticket*" |
| 12 | 34.39–34.95 | Caption in the A-roll in bold | **YEAH.** (Inter ExtraBold) |
| 13 | 34.95–36.69 | Caption in the A-roll (red-light ref) | "so / [*don't do that*] / to yourselves": serif italic in a red box that sweeps open |
| 14 | 36.69–38.17 | Family members in this kind of design (skin-slowdown ref) | Family B-roll (autumn park), editorial serif "DON'T DO THAT TO / *your families*" with a ghost "FAMILY" and a cyan circle drawing on; fades out |

Directional whips mark the cuts into and out of the designed beats (1.36, 3.06, 9.70, 13.19, 17.33, 18.57, 19.96, 24.95, 31.61, 34.39, 36.69). There is no end card.

## Assets

- **B-roll and SFX (Mixkit Free License):**
  - #46353 clapperboard
  - #23000 red carpet
  - #47286 villa
  - #33729 family in the park

  The source downloads are in `src/raw_*.mp4`; the crops in `src/<name>.mp4` are rebuilt by `prep`.
- **Person matte:** MODNet (Apache-2.0), from Hugging Face `Xenova/modnet` → `models/modnet.onnx`. Not in git; download it again to rebuild.
- **Everything else is drawn in code** (`scenes.js`, `scenes2.js`, `scenes3.js`, three.js r149 vendored in `vendor/`): the orbit card, phone and coins, puzzle set, CRT, desk and letter, store counter, ticket and type. Fonts are from Google Fonts: Anton, Instrument Serif, Inter, Montserrat, Permanent Marker, Playfair Display.
