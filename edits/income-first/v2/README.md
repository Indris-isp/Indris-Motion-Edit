# "Find income first" v2: built from the client's plan

The plan came from the planning page (https://claude.ai/artifact/GdLQYHvF6VDgZBNwcuebMS):
- 14 annotated lines with 17 reference images;
- palette **A, Studio Cyan** (accent `#5FD8F5`, base `#0F1113`, text `#F2EEE8`, negative `#FF5446`);
- cut after the 37th second, so the video ends on "…Don't do that to your families." (speech ends 37.925 s).

**Output:** `out/income_first_v2_1080x1920.mp4`, 1080×1920, 23.976 fps, 38.2 s, −14.5 LUFS. Not in git (83 MB); rebuild with the steps below.

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

`prep` crops and re-times the B-roll, runs the MODNet person matte and computes the villa sky mask. `scenes.cjs` renders the designed scenes and caption overlays (Playwright). `compose` writes the final video. `python3 build.py --still 2.0,17.9` writes single frames.

The A-roll is the face-tracked raw cut (`../out/income_first_RAW_1080x1920.mp4`), so the raw cut's timeline is the output timeline.

## Plan → build

| Line | Time (s) | Client note | Built |
|---|---|---|---|
| 1 | 0.00–3.06 | Caption appears and zooms out, designs like the refs (V13 "questions ???", "Aussie creators" orbit) | Host A-roll with **"message"** landing big and zooming out over giant outlined **???**. Then the host **irises into a circle** in an orbit card ("people who are / *watching this*"), with 7 viewer avatars orbiting him |
| 2 | 3.06–5.17 | Famous movie B-roll, caption in a roto effect (Jack Mason ref) | Clapperboard B-roll, then a red-carpet actor with giant **ACTING?** *behind* him (MODNet matte) |
| 3 | 5.17–8.19 | Caption in the middle, then slides slightly left (30,000ft ref) | "so my / *advice* / to anybody" centred, then it slides left; punch-in on "*play this game*" |
| 4 | 8.19–13.19 | Money 3D element, design like the ref (metallic card) | "is find something" on the A-roll, then a brushed metallic cyan card with a moving sheen, **"Income / *first.*"**, and a rotating 3D stack of (generic) banknotes. Bills fly off on "income" |
| 5 | 13.19–17.33 | Puzzle joins on a smooth curve, bulb = idea (V12 ref) | Two glossy cyan puzzle pieces travel on curves and lock on "find a **way**". The bulb pops and glows; the camera tilts to **CHECKS ROLLING IN** |
| 6 | 17.33–18.57 | Replace the element with a house, text "get into real estate" (Chevron ref) | B&W villa under a drawn grey sky; **GET INTO / REAL ESTATE** rises out from behind the roof (sky mask) |
| 7 | 18.57–19.96 | Replace the text (CRT + sticky notes ref) | A retro beige CRT on a desk, a cyan stock chart drawing up, **THE STOCK MARKET**, and 6 sticky notes (Index funds, Dividends, Buy & hold, Long term, Portfolio, Compound) |
| 8 | 19.96–22.38 | An offer letter for a full-time job (cutting-mat ref) | **OFFER LETTER** on a green cutting mat; "*Full-time*" is highlighted and a **HIRED** stamp lands on "job" |
| 9 | 22.38–26.61 | Caption ("that brings the money in"), then zoom out to the A-roll and place the caption | The camera pans to a paper card ("that brings / the money in") and a **MONEY IN** sticker slaps on. The card then shrinks away to reveal the A-roll: **THEN / PURSUE THIS** (wide uppercase + glow) |
| 10 | 26.61–31.61 | Caption in the A-roll | Run-in captions, punch-ins 1.0 → 1.18 → 1.40; "*starving*" (red) "*actors*" |
| 11 | 31.61–34.39 | Caption; replace the money with a lottery ticket and buying in a store | Shop-counter B-roll (card payment), a designed lottery ticket slides onto the counter, "*lottery ticket*" |
| 12 | 34.39–34.95 | Caption in the A-roll in bold | **YEAH.** (Inter ExtraBold) |
| 13 | 34.95–36.69 | Caption in the A-roll (red-light ref) | "so / [*don't do that*] / to yourselves": serif italic in a red box that sweeps open |
| 14 | 36.69–38.17 | Family members in this kind of design (skin-slowdown ref) | Family B-roll (autumn park), editorial serif "DON'T DO THAT TO / *your families*" with a ghost "FAMILY" and a cyan circle drawing on; fades out |

Short white flashes mark the cuts into the designed beats (9.70, 13.19, 17.33, 18.57, 19.96, 31.61, 36.69). There is no music, SFX or end card, as in the earlier client notes.

## Assets

- **B-roll (Mixkit Free License):**
  - #46353 clapperboard
  - #23000 red carpet
  - #47286 villa
  - #15914 paying at a shop counter
  - #33729 family in the park

  The source downloads are in `src/raw_*.mp4`; the crops in `src/<name>.mp4` are rebuilt by `prep`.
- **Person matte:** MODNet (Apache-2.0), from Hugging Face `Xenova/modnet` → `models/modnet.onnx`. Not in git; download it again to rebuild.
- **Everything else is drawn in code** (`scenes.js`): the orbit card, money stack, puzzle and bulb, CRT, offer letter, ticket and type. Fonts are from Google Fonts: Anton, Instrument Serif, Inter, Montserrat, Permanent Marker, Playfair Display.
