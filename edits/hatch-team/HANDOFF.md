# Handoff: Hatch Coaching "real estate team" clip

Use this to continue the work in another session, such as the Claude desktop app, a local Claude Code session or a new cloud session. Everything is on the branch **`Main---Branch`** of `Indris-isp/Indris-Motion-Edit`. To pick it up:

```bash
git clone https://github.com/Indris-isp/Indris-Motion-Edit.git
```

```bash
cd Indris-Motion-Edit && git checkout Main---Branch
```

Then tell Claude: *"Read edits/hatch-team/HANDOFF.md and continue the Hatch clip."*

## What exists

| Item | Where |
|---|---|
| Source video (184 s, 1920×1080, single camera) | Google Drive `13GDHNE-FjS8Okubp4mY8mzYfS3jpH5Yf` (not in git). Save it as `edits/hatch-team/src/hatch_team.mp4`. |
| Word-by-word transcript (571 words) | `analysis/transcript.md`, `words.json` |
| Frame-by-frame analysis + camera-angle map | `analysis/breakdown.md`, `analysis/frames.csv`, `analysis/face_track.json` |
| Edit (cut, virtual angles, grade, captions, audio) | `edit.py` (see the header for its modes) |
| Designed scenes / overlays | `scenes.html`, `scenes.js`, rendered by `scenes.cjs` |
| Cut check (edge levels + re-transcription) | `verify_cut.py` |
| Rough cut v2 (approved cut base, review strip) | `out/hatch_team_ROUGH_CUT_v2.mp4` |
| v1 full render (superseded) | `out/hatch_team_premium_1080x1920.mp4` |
| Palette board | `palette/palette_board.png` |
| Palette picker (artifact) | https://claude.ai/artifact/6SMwnQtX3ePU4EXTDx1Dr5 (source `palette/picker.html`) |
| Plan page (artifact) | https://claude.ai/artifact/FTBbLgVEqhk1YnyMaJEV5W (source `plan_ui/`, data from `plan_ui/build.py`) |
| Local AI image tools | `tools/gen.py`, `tools/gen_batch.py`, `tools/gen_jobs.json` (Segmind Vega + VegaRT, Apache-2.0) |

## Decisions so far

1. **Clip:** the Matt story (78–147 s), with the hook "Real estate teams… exist because the leader has ego" moved to the front, a thesis bridge (44–51 s), and the close "This is the blueprint. It's not a suggestion. You have to do this." It runs 50.5 s.
2. **Rough cut v2:** every cut edge is snapped to the real audio. Four joins are hand-tested (`EDGE_IN` / `EDGE_OUT` in `edit.py`). "in my experience" and "So," stay in, because that speech is connected. The question starts on "Hey,". The end is a silent frozen tail. The client planned on top of this cut; the explicit "Approve" button wasn't pressed.
3. **Palette D (chosen):** accent `#F05B33` (REL brand orange), negative `#D7263D`, secondary `#8C7F74`, text `#F7F2EC`, scene ground `#171310`, cards `#25201B`, base `#0E0C0B`.
4. **Burned-in captions** in the source are inpainted every frame, and the "REAL ESTATE LIVE" logo sting covers his face for 0–5 s of the source.
5. **House style:** `.claude/skills/premium-short-form`. The Vice City v4/v5 client notes also apply: rise-in captions, a letter effect on three keywords only, no SFX, no end card.

## Client plan per beat (from the plan page database)

| Beat | Pick | Client note | Status |
|---|---|---|---|
| 1 Hook | C | An image of a team in conversation; the caption sits **behind the subjects** (rotoscoped), with a light slide zoom | AI image being generated (`b1_team`); text-behind composite to build |
| 2 Bridge | B | Speaker + captions | Done |
| 3 Ego → blueprint | C | Orange gradient; a long list of options slides downward and lands on "blueprint"; animated elements (ref: golden gradient + objects at the edges) | **Done**: `reel` scene |
| 4 Proof | B | Speaker + captions (no tags) | Done |
| 5 Open loop | C | Full image of the speaker on the right, the question on the left | **Done**: `secret` scene, Erik cut out of his own footage with MODNet |
| 6 Most boring | A | Punch-in + colour drain | Done |
| 7 Rule #1 | C | High-quality B-roll with people + caption (ref: people in a room, run-in + bold caps) | AI images `b7_meeting`, `b7_empty`; to build |
| 8 25 texts | C | Several people on screen in different places, texting | AI images `b8_p1..4` (cut out); to build |
| 9 That's a blueprint | A | Medium → wide | Done |
| 10 Rules 2–3 | C | B-roll + captions | AI images `b10_call`, `b10_crm`; to build |
| 11 On repeat | B | Close-up with captions | Done |
| 12 Close | A | Callback stamp + final line | Done |

The reference images the client uploaded are stored in the plan page's assets. They can be read with the Artifact tool (`read`, `path` = asset id); the ids are listed in its `beats/*` documents.

## Next steps

1. Build beats 1, 7, 8 and 10 from the generated images: matte the people (MODNet), add Ken Burns motion and captions.
2. Render a preview of the full edit, check it, and show it to the client for approval.
3. Then do the final render: `python3 edit.py` (or in parallel with `--range`, then `--mux`).

## Environment notes

- **Machine-only files:** the source video and the models (`models/modnet.onnx`, from Hugging Face `Xenova/modnet`; Segmind Vega from `segmind/Segmind-Vega` + `segmind/Segmind-VegaRT`) are on the machine only. Re-download them on a new machine.
- **Libraries:** Python needs `faster-whisper`, `opencv`, `numpy`, `pillow`, `onnxruntime`, `torch`, `diffusers`, `transformers`, `peft`. Node needs `playwright`.
- **Hugging Face downloads:** set `HF_HUB_DISABLE_XET=1`, because the Xet transfer host can be blocked.
- **Using your browser on desktop:** Claude in Chrome lets the work use your logged-in browser (for example ChatGPT for images or video), which a cloud session can't reach.
