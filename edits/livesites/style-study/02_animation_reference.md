# Reference 2: the animation reel ("unofficial Claude animation")

- **File:** 1916×1080 (16:9), 30 fps, 12.86 s, 385 frames.
- **Audio:** music and sound design only, with **no voice-over**. Whisper returned a short hallucinated line ("There's a gun out there…") for the intro riser, so ignore it. There is no spoken transcript.
- **Contact sheets:** `sheets/anim_01.jpg` … `anim_05.jpg` (10 fps, every 3rd frame). `sheets/anim_t1.jpg` (f87–113) and `anim_t2.jpg` (f189–215) show every single frame of the two key transitions.
- **Per-frame data:** `data/animation_ref_frames.csv`.

## 1. The music drives every cut

From the audio onsets there is a kick every **16.7 frames (0.556 s) = 108 BPM**, starting at 3.07 s. Before that, 0–3.07 s is a riser/build with one soft hit at 0.83 s.

**Every visual event lands on a beat:**

| beat | t (s) | frame | visual event |
|---|---|---|---|
| intro | 0.00–3.03 | f0–91 | Logo build (riser, no kick) |
| 1 | 3.07 | f92 | **1-frame white flash**, then cut to the UI world |
| 2 | 3.62 | f109 | **1-frame white flash** (camera still pulling back) |
| 3 | 4.18 | f125 | Pull-back settles on the full UI |
| 4 | 4.73 | f142 | **Blur/whip zoom** into the input box, and typing starts |
| 5 | 5.29 | f159 | "Build a finance SaaS" finishes typing |
| 6 | 5.85 | f175 | Camera tracks right to the send button, which **lights up orange** |
| 7 | 6.40 | f192 | Button glow peaks (the "press") |
| 8 | 6.96 | f209 | **Hard cut to white**: the arrow becomes a 3D orange cursor flying up |
| 9 | 7.51 | f225 | Soft vertical light curtains fade in, and the cursor drags in the first dashboard |
| 10 | 8.07 | f242 | Dashboards fan in from left and right (paper-curl) |
| 11 | 8.63 | f259 | Full stack of 3 dashboards |
| 12 | 9.18 | f275 | **Cut to the 3D laptop**, which spins fast with motion blur |
| 13 | 9.74 | f292 | Laptop settles at 3/4. "Unlock Your" writes on. |
| 14 | 10.29 | f309 | "Full Potential." writes on |
| 15 | 10.85 | f325 | **Cut to white + coral horizon arc**, "Build" blurs in |
| 16 | 11.40 | f342 | **Background inverts white → black** (sunrise to eclipse), and "Claude" (serif) types in |
| 17 | 11.96 | f359 | Starburst icon pops after the wordmark and spins |
| 18 | 12.52 | f376 | Hold / glow breathe to the end |

## 2. Frame-by-frame breakdown

| frames | time (s) | what happens on screen | motion technique | why it's playing |
|---|---|---|---|---|
| f0–2 | 0.00–0.07 | Pure black | – | A clean start, so the eye goes to the centre |
| f3–14 | 0.10–0.47 | A thin cream sliver appears, then grows into a **pie-slice / fan** shape that rotates open like a folding fan | Shape-layer rotation + scale, ease-out | **Origin story**: the logo is "assembled" in front of you |
| f15–29 | 0.50–0.97 | Fan becomes an irregular polygon, which becomes a **5-point star**. Warm **orange swoosh glow** arc behind (soft, out of focus). | Path morph. **Echo/trail copies** (3–4 ghost duplicates at lower opacity) give motion blur. | A morph builds anticipation: "what is it becoming?" |
| f30–47 | 1.00–1.57 | The star wobbles and rotates. White hot core, with a glow edge in the echo trails. | Rotation + echo + glow | Energy builds with the riser |
| f48–56 | 1.60–1.87 | The star compresses into a small blurry multi-point burst | Scale down + blur. This is a **squash before stretch**. | The anticipation dip before the reveal |
| f57–66 | 1.90–2.20 | It **explodes into the 12-ray Claude starburst**. Colour shifts cream → peach. | Scale overshoot + blur release | The **reveal** |
| f67–75 | 2.23–2.50 | Starburst settles; colour → coral **#D97757** | Colour grade over time, ease settle | The brand colour lands last, so you remember it |
| f76–86 | 2.53–2.87 | The **"Claude" wordmark** fades in under the icon (serif, cream). The icon dims slightly. | Opacity fade, slight blur-in | Name after symbol |
| f87–91 | 2.90–3.03 | Icon and wordmark **flicker bright/dim every frame** | Opacity strobe (1-frame alternation) | Charges up for the drop |
| **f92** | **3.07** | **Full white frame (1 frame)** | Flash cut | **Beat drop.** It hides the scene change. |
| f93–108 | 3.10–3.60 | New world: dark UI with a perspective **grid floor**. Close-up of a glowing mini-starburst. "**Welcome, yowerse**" (serif) **types on letter by letter with a blur-in**, while the camera **pulls back and tilts**. The prompt box "How can I help you today?" **rises from the bottom** with an orange rim-light. | Camera dolly-out + tilt, per-character blur reveal, rising box | The product UI is introduced as a *place* |
| **f109** | **3.63** | **Full white frame (1 frame)** | Flash | Accents beat 2 and resets the eye |
| f110–141 | 3.67–4.70 | The pull-back continues and **settles to a centred wide** of greeting + input box (Fable 5, mic, waveform icons visible). A slow drift. | Ease-out dolly | A breath, so the viewer can read the UI |
| f142–147 | 4.73–4.90 | **Whip/blur zoom** into the input box, where "B…" starts typing | Directional motion blur, scale up | Beat 4. Focus moves to the action. |
| f148–171 | 4.93–5.70 | **"Build a finance SaaS"** types on (~1 char per 2 frames). The camera is very close and slowly drifts right. | Typewriter + slow track | Shows the user's intent: *what we're building* |
| f172–180 | 5.73–6.00 | The camera **tracks right along the box** to the controls (Fable 5 High · mic · waveform · **send button**). The send button turns orange. | Horizontal track, ease-in-out | It leads the eye to the "go" moment |
| f181–194 | 6.03–6.47 | Close-up on the send button. It **glows brighter and warmer** (orange → amber, bloom). | Glow ramp + slight scale | Anticipation of the click |
| f195–208 | 6.50–6.93 | The UI **dims/fades out**. The **↑ arrow detaches from the button and flies up** out of frame, and the button fades. | Opacity fade on the UI, position on the arrow (accelerating) | **Object continuity**: the arrow carries the action into the next scene |
| **f209** | **6.97** | **Hard cut to a white world.** The arrow is now a **3D orange paper-plane cursor** rising from the bottom with a soft glow. | Match-on-action cut (the arrow keeps flying) | The beat drop. Dark (input) → light (output) shows the transformation. |
| f210–228 | 7.00–7.60 | The cursor flies an S-curve. Soft **vertical peach light curtains** fade in behind (7.4+). | Path animation, glow | It sets the stage for the result |
| f229–241 | 7.63–8.03 | The cursor **drags in a finance dashboard card**, which **unfolds/uncurls like paper** in 3D into the centre | 3D card bend + rotation + scale | The result is "delivered" by the cursor |
| f242–260 | 8.07–8.67 | More dashboard variants fly in from the left (green dark theme) and right (purple), with paper-curl, into a **fanned stack**. The cursor zips between them. | Staggered 3D fly-ins | **Abundance**: "it can build many versions" |
| f261–274 | 8.70–9.13 | The stack holds and the cursor taps the purple card | Hold + small cursor move | A read moment |
| **f275–285** | **9.17–9.50** | **Cut to a grey studio: a 3D laptop** whose screen faces the camera, then it **spins fast** (back, lid, side) with motion blur | 3D object rotation, heavy motion blur | Beat 12. The result is now a *real product on a device*. |
| f286–291 | 9.53–9.70 | The laptop settles at a 3/4 angle with the dashboard on screen | Ease-out rotation | A premium product shot |
| f292–324 | 9.73–10.80 | Text "**Unlock Your**" (left) and "**Full Potential.**" (right) write on word by word with blur, around the laptop. Slow push-in. | Per-word blur/opacity reveal, dolly-in | The benefit/tagline. Small, elegant type with lots of air. |
| f325–338 | 10.83–11.27 | **Cut to white with a coral horizon arc** (a planet curve with a gradient glow) at the bottom. "**Build**" blurs in (sans bold), then "**with**". | Blur-to-sharp text, gradient arc | The end-line build starts |
| **f339–341** | **11.30–11.37** | **The background inverts white → black.** The arc becomes a glowing sunrise/eclipse rim. | 3-frame luminance invert/crossfade | Beat 16. The *drop* of the end card. |
| f342–358 | 11.40–11.93 | "**Claude**" (**serif**, cream) **types/slides in** after "Build with", with blur | Per-letter blur reveal | A sans + serif pairing: "Build with" = action, "Claude" = brand |
| f359–385 | 11.97–12.83 | The **starburst icon pops after the wordmark** and rotates slowly. The glow breathes, and the horizon arc drifts down. | Scale pop + rotation + glow | **Logo sign-off.** The video ends on the same symbol it started with (loop). |

## 3. Animation system: rules learned

1. **Cut on the beat, always.** Every scene change and every major reveal is on a kick (108 BPM, a 0.556 s grid). Small moves (typing, drift) live *between* beats.
2. **Hide cuts with 1-frame white flashes** (f92, f109), or with a **match-on-action** (the send arrow flies out of the UI and continues as the 3D cursor in the next world).
3. **Story = input → action → output → product → brand.** Logo → UI greeting → type the prompt → press send → results fly in → result on a device → tagline → end card.
4. **The camera is always moving.** Dolly-out reveals, whip-zoom into the focus, lateral tracks along UI elements, slow push-ins on holds. Nothing is ever static for more than ~0.5 s.
5. **Text never pops. It *writes on*** (per letter or per word), with blur → sharp and opacity 0 → 1, and ease-out.
6. **Lighting = emotion.** Dark UI world with an orange rim-light (the "thinking" phase). A flip to a bright white world (the "result" phase). The end flips back to black with a glowing horizon (the "brand" moment).
7. **3D integration.** The UI is flat but sits in 3D space (perspective grid floor, tilt). The outputs become **3D objects**: paper-curl cards, a rotating laptop, a 3D cursor.
8. **One accent colour (coral #D97757 → amber glow).** Everything else is black, white, cream or grey.
9. **Type pairing:** a **serif** for the brand and greeting ("Welcome…", "Claude"); a **sans bold/medium** for actions and taglines ("Build with", "Unlock Your Full Potential").
10. **Motion blur and echo trails** on every fast move. That is what makes it feel "fluid" and expensive.

## 4. How it combines with the caption reel

The caption reel tells us *what* to show and *where captions go*. The animation reel tells us *how the designed parts should move*. In practice:
- Every **B-WHITE** graphic and **UI** moment from the caption reel gets the animation reel's motion language: write-on text, camera drift, 3D cards, blur on moves, an orange glow.
- **Transitions between sections** use the white flash, the match-on-action, or the white↔black invert. A plain hard cut is used *inside* a section.
- The **brand intro and end card** use the logo-build and horizon-arc end card from the animation reel.
