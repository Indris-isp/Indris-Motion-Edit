# SignWell launch video — storyboard

30.0 s · 1920 × 1080 · 60 fps · 1800 frames

| # | Scene | Role | Time | Frames | Length |
|---|---|---|---|---|---|
| 1 | Still waiting | hook | 0:00–0:04 | 0–240 | 240 |
| 2 | The paper loop | problem | 0:04–0:10 | 240–600 | 360 |
| 3 | Place it, send it | fix | 0:10–0:19 | 600–1140 | 540 |
| 4 | Signed | payoff | 0:19–0:25 | 1140–1500 | 360 |
| 5 | Logo + CTA | logo | 0:25–0:30 | 1500–1800 | 300 |
| | | | | **Total** | **1800** |

---

**Scene 1 · Still waiting (hook)** — 0:00–0:04, frames 0–240
- On screen: deep navy background. Email notification cards stack in the center: "Contract attached", "Just following up", "Re: Re: Any update?", "Re: Re: Re: Signed yet?". Counter top-right: "Waiting · 0 → 6 days". Kinetic headline below the stack: "Still waiting on a signature?"
- Motion: cards drop with overshoot, staggered 18 frames, each one pushes the stack down. Counter counts up over ~1 s, starting at frame 40. Headline word by word from frame 120, 4-frame offset. Holds ≥ 1.5 s.
- Camera: slow push-in 100% → 106%.

**Scene 2 · The paper loop (problem)** — 0:04–0:10, frames 240–600
- On screen: four step tiles in a row: Print, Sign, Scan, Email. A document card travels tile to tile; each tile lights up as it lands. A return arrow loops from Email back to Print. Text: "Print. Sign. Scan. Repeat."
- Motion: document moves on arcs between tiles and settles with overshoot. Tiles light up with a 1 → 0.96 → 1 press. The return arrow draws itself at the end. Text word by word.
- Camera: easy-ease pan left → right following the document (≥ 0.8 s per move), then ease back to center for the loop.

**Scene 3 · Place it, send it (fix)** — 0:10–0:19, frames 600–1140
- On screen: SignWell editor (vector UI). Document page on the left, field palette in the sidebar. Cursor drags a "Signature" field from the palette onto the signature line, then a "Date" field. Recipient chip "Jordan Lee". Cursor clicks Send. Text: "Place it. Send it."
- Motion: window enters with spring. Cursor travels on arcs, press on pick-up and drop. Fields snap in with overshoot. Send button press, then a toast: "Sent to Jordan Lee".
- Camera: zoom into the signature line during the drag (≈ 130%), ease back to 100% for Send.

**Scene 4 · Signed (payoff)** — 0:19–0:25, frames 1140–1500
- On screen: phone slides in beside the editor. The client's signature draws itself in the field and "Finish" is pressed. Status pill on the desktop flips Sent → Viewed → Signed (green check). Counter: "Time to signed · 6 days → 4 min". Text: "Signed. Before lunch."
- Motion: signature stroke drawn over ~1 s. Pill changes with a press on each state. Counter counts down over ~1 s, ease-out. Hold the signed state ≥ 1.5 s.
- Camera: pull back to show phone and desktop together.

**Scene 5 · Logo + CTA (logo)** — 0:25–0:30, frames 1500–1800
- On screen: opens on the client's signature from scene 4 (match cut), now white on brand blue. It settles under the SignWell wordmark as the letters build. Tagline: "Electronic signatures made easy." CTA button: "Start free · signwell.com".
- Motion: signature eases down into place over 0.8 s (ease-out), wordmark letters offset 2 frames, tagline and CTA follow with offset. Slow drift to the end.
- Camera: gentle push-in.

---

## Transitions and effects (rev 2)

Scene order and lengths are unchanged. These layer on top.

| Cut | Frame | Type | How |
|---|---|---|---|
| — | 10, 28, 46, 64 | Glitch hits | Small RGB-split stutter on each email card landing. |
| 1 → 2 | 240 | **Block glitch transition** | 26-frame hit peaking on the cut: RGB channel split, displaced horizontal slices, inverted and colored data blocks, scanlines. Hides the cut completely. |
| — | 502 | Glitch hit | Punctuates "Repeat." |
| 2 → 3 | 558–654 | **Match cut** | The paper document accelerates into the lens (ease-in, 0.7 s) until it fills the frame, and scene 3 opens on the SignWell page at the same size, then eases out (0.9 s) to reveal the editor. A light glitch at 600 seals it. Paper becomes product. |
| 3 → 4 | 1140 | **Smooth cut** | Continuity cut: the editor holds the exact same state across the cut, then the camera pulls back as the phone whips in with motion blur. |
| — | 1012, 1290 | Glitch hits | On Send and on Signed. |
| 4 → 5 | 1458–1554 | **Match cut** | Camera pushes into the client's signature on the phone (ease-in); it turns white as the phone fades and the background turns brand blue. Scene 5 opens on the same stroke at the same size, which eases down to become the line under the wordmark. Glitch hit at 1500. |

Motion: every camera move is ease-in-out; the two match cuts pair an ease-in before the cut with an ease-out after it, so speed carries through the cut without a bump. Headline words rise out of a mask with a short RGB stutter, and one key word per headline takes an accent color. A slow-moving grid sits behind everything so nothing stops.

## Rev 3 — review notes applied

| Time | Note | Change |
|---|---|---|
| 0:01.3 | Add a digital pop | Bit-crushed rising pop at frame 76. |
| 0:02.1 | Digital bubble SFX for the text | One soft digital bubble per headline word, pitch rising word to word. |
| 0:08.2 | Zoom and follow the element, faster pacing | Scene 2 camera zooms to 138% and locks onto the document as it hops tile to tile (in-out cubic), then eases out to reveal the loop. |
| 0:08.4 | Remove glitch | Glitch hit on "Repeat." removed. |
| 0:09.8 | Remove SFX, out-cubic curve | Match-cut push now uses an out-cubic curve; scene 3 opens from rest with in-out cubic. Whoosh removed. |
| 0:10.4, 0:12.5 + whole video | Remove marker SFX | Every whoosh (filtered-noise swell) removed from the soundtrack. |
| 0:16.9 | Remove glitch effect | Glitch hit on Send removed. |
| 0:17.4 | Light digital notification | Two-note soft digital chime on the "Sent" toast. |
| 0:19.8 | Ease: fast then slow | Pull-back and phone entrance use out-quint, no overshoot. |
| 0:20.5 | Digital handwriting SFX | Granular stylus-on-glass texture following the signature stroke. |
| 0:22.0, 0:26.6 | Remove cling SFX | Bell chimes on Signed and on the logo removed, plus the CTA ting. |
