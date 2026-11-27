# Round 3 references: animation, smoothness and face tracking

The client sent 7 references (Drive folder "Referece") plus 1 face-tracking reference. All were analysed frame by frame: 2 fps contact sheets, every-frame strips on the key moves, per-frame cut and motion metrics, and YuNet face tracking on R8. All were transcribed word by word with faster-whisper: medium.en for the English ones, medium multilingual for R8 (Hinglish) and R4 (Uzbek).

Files:
- `refs-round3/sheets/`: contact sheets and key-frame comparisons
- `refs-round3/transcripts/`: word-level JSON transcripts
- `refs-round3/R8_face.json`: face position every 0.2 s

| # | file | format | what it is | transcript |
|---|---|---|---|---|
| R1 | IOMI ("Driftwood…" pin) | 16:9, 67 s, music only | Fintech product launch film: dark UI, one green accent, a four-point star | none (music) |
| R2 | "Polished breakfast…" pin | 9:16, 37.8 s | Creator talking head + kinetic-type worlds (outreach advice) | ✔ |
| R3 | "Mountain cabin…" pin | 9:16, 31.4 s | **Before/After** showcase: a lilac "After" world with UI cards, cut-outs, neon type | ✔ |
| R4 | "Old money outfit…" pin | 9:16, 58 s, Uzbek | Talking head + giant red condensed type behind the subject, bracket captions, pixel transitions | ✔ (Uzbek) |
| R5 | "Garden wedding…" pin | 9:16, 18.2 s | **Before/After** (PSG): yellow bold captions, 3D money, black type cards, list cards | ✔ |
| R6 | "Bridal shower…" pin | 16:9 rotated 90°, 40 s | Greenpeace "break up with plastic": a story told **entirely through a messaging/dating app**, camera tracking through the UI | ✔ |
| R7 | "Street style…" pin | 9:16, 50.5 s | "How does Bluetooth work?": flat motion-design explainer, 3 colour worlds | ✔ |
| R8 | Ravan.ai "Agni" ad (face reference) | 9:16, 94 s, Hinglish | Real-estate AI calling agent. **Split: AI orb on top, the presenter on a call below.** Face-tracked A-roll | ✔ |

---

## 1. Design: what they chose, and why

| ref | design system | why it works for its content |
|---|---|---|
| R1 | Near-black (#111), **one accent** (green), soft green floor glow, Inter-like sans, a **four-point sparkle star** that flies in and "writes" words, real product UI tilted in 3D perspective | A premium launch needs the *product* to be the hero. The dark ground makes the UI glow, and one accent tells you "this is the brand". The star is the brand's spark: it introduces every new idea. **It is the closest match to Livesites**, which also uses dark grounds, one accent gradient and a four-point star as the brand device. |
| R2 | Dark "space" worlds with HUD lines, a cream paper world, blue chat bubbles, bold condensed keyword ("ONE MORE", "MESSAGE") | It switches between *world* (the problem, stylised) and *face* (the advice, trust). The chat bubbles make "the same message" literal. |
| R3 | **Lilac/white gradient world** (very close to Livesites Paper + Mist + Orchid), glass calendar card, giant faint outline numbers behind ("2025", "10 YEARS"), handwritten circle annotation, tilted YouTube-grid card, cut-out person with a dashed-path label, neon "2025" in front of her | A calm, premium, airy world for a reflective story. Every noun gets a clean UI object: a calendar for "every week", AI-tool rows for "new AI tool", hire chips for "hiring", a YouTube grid for "10 years of content". The client already sees this as premium, and it **matches the Livesites light palette**. |
| R4 | Black, one red, giant condensed red type **behind** the subject (roto), small two-line captions beside the head, `[word]` bracket captions, B&W cut-aways, pixelate transitions | High-drama psychology talk. The size contrast (huge red word vs tiny caption) makes the keyword hit like a headline. |
| R5 | Raw vs edit; the edit has yellow-gold bold captions, 3D money props, black type slates, name tags, list cards | A loud money/hustle register. Shows what "packaging" adds to a plain talking head. |
| R6 | Flat illustration, a phone UI as the stage, cyan + teal on dark/white | **A story told as a chat thread**: notification → open → typing → the chat bubble *is* the plot. The camera literally travels through the phone. |
| R7 | Flat 2D, one colour world per step (blue = devices, lilac = pairing, red = handshake), tiny labels, objects on soft shadows | An explainer: one idea per world, a colour change = a step change, nothing on screen that isn't explained. |
| R8 | Talking head in a warm office. **Top panel: pure black, an animated fire orb (the AI), an orange pill title "AGNI AI ON A CLIENT CALL", a small orange status tag under the orb ("Ultra low latency", "Object Handling", "Language Proficiency"), a karaoke caption line.** Bottom: the presenter on the phone. | It shows an *invisible* product (a voice call) by giving the AI a body (the orb) and narrating its skills with the tag. **The split lets you watch the human and the AI at the same time.** |

**Common principles**
1. One stage and one accent colour per world. The accent marks *the thing that matters* (the keyword, the active state, the brand).
2. **Real UI is the hero.** Product interfaces are shown large, clean and tilted in 3D, never as flat screenshots.
3. Nouns become objects: every concrete thing said gets its own designed object.
4. Generous negative space. The object is centred with labels above and below (R8, R1, R3).
5. Type hierarchy: one big word, small supporting text. Mono and small caps for status and labels (R1, R8 tags, Livesites Geist Mono).

## 2. Why there is an animation, when it starts, and how long it plays

| ref | where the animation starts and ends | length | why there |
|---|---|---|---|
| R1 | Continuous. A new idea every 1.5–3 s, chained by camera moves (11 hard cuts in 67 s, average 5.6 s per "shot", because the camera *travels* instead of cutting) | whole film | A launch film: the animation *is* the content |
| R2 | 0–6.4 s hook world; 8–11 s; 11–14 s chat world; 16–17.9 s | 1.5–3.5 s blocks | On the **problem** lines (abstract claims); the face returns for advice and the CTA |
| R3 | The After world opens on the first noun and returns on every new noun: 0.5–4 s calendar, 5.5–13 s tools and hires, 15–18 s grid, 22–30 s cut-outs | 2–8 s blocks | Every time she names a *thing* or a *time* |
| R4 | Giant type on emotional keywords (0.5–2.5, 6–7, 8.5–9.5, 31.5–33.5, 36–37, 39.5–40 s), each held 1–2 s | 1–2 s | Punctuates the beat and emotion, not the explanation |
| R6 | Whole film | 40 s | A narrative ad |
| R7 | Whole film, one world per sentence (4–6 s each) | 50 s | An explainer |
| R8 | **13.3–49.3 s: one long 36 s split while the AI call plays.** Short overlays (0.5–1.5 s) on numbers and names elsewhere | 36 s | The call *is* the proof. Words alone can't show "sounds like a human", so the animation runs exactly as long as the demo |

**Rule:** animation starts on the first word that names something you can't *see* in the A-roll (a product, a process, a number, a time). It lasts exactly as long as that idea is spoken (R8: the whole call; R3: the noun phrase), then the face returns for the human/CTA beats.

**How they choose what to animate:** the *mechanism* (how something works) becomes a world; *results and numbers* become 1–2 s overlays on the face; *emotion and the CTA* stay on the face.

## 3. How elements are manipulated to act and react

| technique | seen in | how |
|---|---|---|
| **Zoom-out → drag into a split** | R8 12.3–14.6 s | Measured. (1) 12.3–13.3 s: a digital zoom-out from a close-up to the wide (≈1.6× → 1.0×, ease-out, 1.0 s) as she picks up the phone. (2) **14.23–14.53 s (frames 7–16, ~10 frames): the whole video slides down into the bottom half**, ease in-out with a touch of motion blur. The black top stage, with the orb already in it, rides down with it as if it had been sitting above the frame. (3) 14.6–14.8 s: the pill title slides down into place. 14.8 s on: the karaoke caption starts. |
| Karaoke caption | R8, R2 | The whole phrase is laid out. Spoken words turn white, upcoming words are grey (~30 %), and **keywords switch to the accent colour** ("hamare", "Sector 79", "3BHK", "2 crore"). |
| Status tag reacts to the moment | R8 | The small pill under the orb changes with what the AI is doing ("Ultra low latency" → "Object Handling" → "Language Proficiency") |
| Audio-reactive object | R8 orb | A particle ring flares when the AI speaks, so it feels alive |
| **Camera tracking through a UI** | R6, R1 | The camera flies close along the interface: notification → open → the typing field → the bubble. R6 rotates the phone in 3D, then pushes into the input field ("This isn't wo|"). |
| Typing with a caret | R1 (prompt box), R6, Claude ref | Character by character with a blinking caret. Send = a button lights up in the accent colour. |
| Star "writes" the text | R1 | The sparkle star flies along a curve and the word fades in along its trail. One star, once per idea. |
| Tilted UI with camera drift | R1, R3 | Cards at 10–25° perspective, slow drift, shallow depth. Rows stack in with a stagger. |
| World swap by colour | R7 | A whole-frame colour change marks a new step |
| White flash / pixelate / light-leak transitions | R1 ("instantly" white), R4 (pixelate), R2 (light leaks) | Only on section changes |
| Cut-out subject on a designed world | R3, R4 | Person roto'd onto lilac (R3) or onto black with giant type behind (R4) |
| End card | R1 ("Join Early Access."), R2 (video shrinks into a card + "2025"), R8 (Ravan.ai logo on cream) | Brand + action, short |

## 4. Face tracking (R8): measured rules

Measured from YuNet face detection every 0.2 s over 94 s (`refs-round3/R8_face.json`):

| state | face centre x | face centre y (of full frame) | face height (of frame) |
|---|---|---|---|
| Medium (default) | **0.50 ± 0.02, always** | 0.40–0.43 | 0.16–0.18 |
| Punch-in (emphasis) | 0.50 | 0.31–0.35 | 0.20–0.23 |
| Split, bottom panel | 0.50 | **0.65** (locked for 36 s) | 0.16 |
| Graphic beside her (language list) | **0.34** (moved left to make room) | 0.39 | 0.23 |

So:
- The crop keeps the face dead centre horizontally.
- Framing alternates between medium and punch-in every 2–5 s, on emphasis words.
- The face only moves off-centre when a graphic needs the space.
- In the split, the face is locked at 65 % of the frame height.
- There is no visible jitter: the tracking is heavily smoothed.

Applied to Kirti: her face drifts from x 0.40 to 0.55, so `v2-sample/track.py` builds a dead-zone + gaussian-smoothed track (max 2.6 px/frame), and every A-roll layout centres it to R8's numbers.

## 5. Transcripts (word by word)

The full timings are in `refs-round3/transcripts/*.json`. Clean text:
- **R2:** "If you are still doing outreach as a video editor, you're falling behind. In 2025, a cold outreach is dead. And let me tell you why. Thousands of video editors are sending the same message. I'm a professional video editor with three years of experience. You get the point. And if you are doing the same, you are just one more. What you should do instead is posting content on social media. It builds social proof and gives the client a real reason to trust you. Now I get it, posting content can be frustrating, especially if you don't know what the hell to post. That's why I created a free document that shows you exactly what kind of content to post. Comment 2025 and I'll send it to you."
- **R3:** "It feels like every new week in 2025 is a new life, like we're starting from scratch. There is this new AI tool that we're integrating, there's this new strategy, and we're hiring more people to help us with all of that. So I've been creating content for 10 years, but I've never experienced anything like this, like 2025. I try to switch off for Saturday and Sunday to be with my family. Sunday night, I open my feed, I start preparing for the next week, and it just blows my mind."
- **R5:** "Nobody believes me when I tell them that they could be making $10,000 a month selling AI websites. Let me be clear with you, in the last 1 year I've made $1.4 million selling AI websites to local businesses such as roofing, HVAC and plumbing companies."
- **R6:** "Everything used to be great. You've been there since my first birthday. We grew up together. I loved spending time with you. But I've seen right through you. And now you won't leave. You're like this constant weight on my shoulders and I've met someone who just makes me want to keep coming back for more. This isn't working. It's not me. It's plastic. Visit greenpeace.org.uk to learn how you too can break up with single-use plastics."
- **R7:** "How does Bluetooth work? Bluetooth lets your devices talk to each other (your phone, headphones, smartwatches) all using short-range radio waves. Let's say you're pairing headphones to your phone. First, your phone sends out a Bluetooth signal, searching for nearby devices. Your headphones, already set to pairing mode, respond with their own signal and a unique identifier code. Once they recognize each other, they exchange a special encryption key to create a secure, private connection. Then they start something called frequency hopping, where they rapidly switch between 79 different radio channels set aside for Bluetooth, and oscillate between them 1,600 times per second to avoid interference with other Bluetooth devices. It's kind of like two people speaking Spanish in a room where everyone else is speaking French. And there's no need to worry about Wi-Fi device interference, since Bluetooth is on its own frequency, 2.4 gigahertz. Quick, secure and seamless: that's how Bluetooth works."
- **R8:** "Rs 120 crores worth of properties sold every month. They did not hire more tele-callers. They plunged into Agni's real estate workflow. An AI sales agent that sounds exactly like a human. *[call]* Ma'am, aapne kal humare Sector 79 project ke liye enquiry ki thi? / Haan. / Perfect. Aapne 3 BHK aur budget 2 crore ke andar mention kiya tha. To maine already aapke liye 3 best options shortlist kar diye hain. / Haan, kaunse? / Tower A mein park-facing unit hai. Tower C mein corner unit hai, thoda premium. Aur ek ready-to-move option bhi hai agar possession jaldi chahiye. / Pehle kaunsa compare karein? / Ready wala. / Perfect ma'am. Main payment plan explain karti hoon aur uske baad weekend ka site visit slot book kar deti hoon. / Thank you. *[end call]* An AI sales agent built for real Indian conversations. No robotic scripts, no translated English. Actual human-like conversations in Hinglish, Hindi, Tamil, Marathi, Gujarati and other dialects your buyers speak every day. 120-plus crores of properties sold through Agni's real estate workflow. 1 lakh-plus calls processed daily. 2,100-plus businesses already on it: Danube Properties, Emperium, M3M, Sobha. Your competitors have probably already heard about it. So don't wait. Click on the link below, start your free trial today and avail 10 free credit points."
- **R1:** music only, with no speech. The on-screen copy: "Imagine seeing everything you own instantly. For most people that's not the case. IOMI brings everything together. Track every asset you own, effortlessly. Your wealth, beautifully organized. See how your finances truly move. Manage personal and business assets in one view. Track all your alternatives and physical assets. AI that guides your next financial move. Secure, read-only connections. Your data stays private. Ask anything about your wealth. Turn clarity into confident financial progress. The way it should be. One app. One system. IOMI. Join Early Access. iomifinance.com"
- **R4:** Uzbek (word-timed in `R4_words.json`). The gist, in English: "You're not a perfectionist, you're just afraid to start, and because of that fear you wait a long time… Why? Psychologists say perfectionism isn't high standards, it's an escape mechanism from failure. You don't start because you're afraid you won't reach the ideal result… People are learning, failing, trying again. And you? You keep waiting for the IDEAL MOMENT that never comes. Choose: the long, hard way or start now." The giant red words land on the emotional peaks ("PERFEKSIONIST", "QO'RQASIZ", "NIMAGA?", "YO'Q", "O'RGANYAPTI", "IDEAL MOMENT").

## 6. What this means for Livesites (applied in `v2-sample/scene1.html`)
- **Structure:** follow R8. The face sets up the problem, then a zoom-out and drag into a split, with a stage on top showing the product story while she keeps talking below. The face is locked at 65 %.
- **Stage:**
  - Night background (R8's black, in Livesites' Night) with a soft Orchid floor glow (R1).
  - The **pill title** uses the live gradient (R8's orange pill becomes Livesites' gradient), with Geist Mono caps. It turns Mist with Ink text when the moment is "dead" (no reply).
  - A **status tag** under the object (R8) in Geist Mono, as the brand guide specifies for live states.
  - A **karaoke caption** with keywords in Orchid (R8).
- **Object:**
  - A 3D phone with a mail app (R6's chat-as-story, R1's real-UI-as-hero).
  - The camera tracks through the UI: the attachment, the send button, the sent list, the inbox, the reply field (R6, R1).
  - Typing with a caret, and the send button lighting up (R1, Claude ref).
- **Light as meaning:** Orchid is "live". When nobody answers, the Orchid rim light and glow drain away and the screen locks. This is the brand rule "Orchid works like light" turned into a story beat.
