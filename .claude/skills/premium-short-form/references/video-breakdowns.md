# Frame-by-frame breakdowns: 15 reference videos

**How these were made:**
- Every video was checked at 2 fps (contact sheets in `docs/references-data/sheets/`).
- Every transition and animation was checked at 10 fps (`anim_*.jpg`, `V12–V15 transitions`).
- Cut times come from ffmpeg scene detection (threshold 0.2) on full-frame videos (V01, V04–V06, V12). The framed formats (V02, V03, V07–V11, V13–V15) were logged by eye, because scene detection only sees the frame around the edit.
- Words come from the `medium.en` transcripts in `transcripts-word-level.md`.
- Scene IDs (A1, B3, C5, D2, E4…) refer to `design-system.md`.

| ID | Video | Drive folder | Format | Length | Visual changes | Avg beat | Mode |
|---|---|---|---|---|---|---|---|
| V01 | Pierre ($14M at 22) | Podcats | 16:9, 24 fps | 43.8 s | 26 | 1.6 s | A hype |
| V02 | Sleep / Bryan Johnson | Podcats ("self-love quote") | 9:16 in before/after frame | 31.7 s | 11 | 2.6 s | B |
| V03 | POV: we edit your podcast intro | Podcats | 9:16, monitor POV | 40.5 s | 18 | 2.1 s | C |
| V04 | Jack Mason | Podcats | 16:9, 25 fps | 58.4 s | 43 | 1.3 s | A cinematic |
| V05 | Catherine Goetze: creator advantage | Pattern | 9:16, 30 fps | 34.4 s | 15 | 2.2 s | B |
| V06 | Red light / skin (Dermalux) | Pattern | 9:16, 30 fps | 56.0 s | 20 | 2.7 s | B |
| V07 | Alcohol gene (raw vs final) | Pattern ("vision board") | 9:16 in frame | 40.4 s | 27 | 1.4 s | B |
| V08 | Frame War entry 1 @ranvindra | Pattern ("nautical (1)") | 3:4 carousel | 10.6 s | 6 | 1.5 s | C |
| V09 | Frame War voting board | Pattern ("nautical") | 3:4 carousel | 10.6 s | — | — | packaging |
| V10 | Frame War entry 3 @rohan | Pattern ("nautical (3)") | 3:4 carousel | 10.6 s | 5 | 1.8 s | C |
| V11 | Frame War entry 2 @after.vision_ | Pattern ("nautical (2)") | 3:4 carousel | 10.6 s | 9 | 1.1 s | C |
| V12 | Problem-solving brain | Pattern | 9:16, 30 fps | 29.4 s | 10 | 2.7 s | D |
| V13 | Aussie creators (raw vs final) | Pattern | 9:16 in frame | 23.0 s | 8 | 2.6 s | D |
| V14 | UAE property (before/after) | Pattern | 9:16 in macOS frame | 15.3 s | 6 | 2.2 s | D |
| V15 | Every week in 2025 (before/after) | Pattern | 9:16 in frame | 22.5 s | 9 | 2.3 s | D |

Measured pacing and timing for all 15 is in `script-timing-psychology.md`.

---

## V01: Pierre (mode A: hype podcast, two-shot studio)
Grey seamless studio, two cameras (a wide 2-shot plus an MCU of each person), and B&W lifestyle B-roll. The accent is **electric-blue glow** (#2f5bff-ish), with **red glow reserved for profanity and the key concept**.

| t (s) | Words | Shot / scene | Text + animation | Cut / transition |
|---|---|---|---|---|
| 0.00–1.62 | HOST: "$14 million in the past year, you said?" | Wide 2-shot (A3) | **Count-up**: blurred rolling digits $1,055,553 → $14,000,000 in 0.4 s. The digits dim for 0.2 s, then the final number lands with a white glow pulse (A14) | Opens on frame 0 |
| 1.62–3.46 | GUEST: "That's when we smacked our first million dollar month." | Guest MCU | Small white run-in, then a blue glow count-up "$1,000,000" with a small "a month" | Cut on "That's" |
| 3.46–4.04 | HOST: "Holy fuck." | Host MCU (reverse) | Blue glow italic "HOLY F\*CK" (censored) | Cut on "Holy" |
| 4.04–5.54 | HOST: "You're only 22 years old." | B&W lifestyle B-roll ×3 (shirtless, car selfie, G-Wagon) (B1) | Blue glow "22yo" | 3 cuts in 1.5 s |
| 5.54–7.54 | "Obviously everyone in this space knows you…" | Wide | "Everyone in the space" run-in → blue "KNOWS" | — |
| 7.54–10.67 | "People will say, oh yeah, he blew up, but like, bro, you gotta manage the volume." | B&W vlog/selfie B-roll ×6 (~0.5 s each) | "you gotta manage the" → blue glow "VOLUME" | Rapid cuts |
| 10.67–10.79 | — | **Glitch frame** (RGB split + invert, 2–3 frames) | — | Topic change → host question |
| 10.79–12.71 | HOST: "What did that growth curve kind of look like for you?" | Host MCU punch-in | Blue glow "GROWTH" beside the head (A2) | — |
| 12.71–14.21 | GUEST: "The number one skill you can acquire" | Guest MCU | Blue "#1 SKILL" with bracket lines drawn around it | Cut on the answer's first word |
| 14.21–16.38 | "is being able to identify the constraint" | Wide | Words spaced across the headroom "BEING · ABLE · TO · IDENTIFY". The letters **scatter out** (0.3 s) and red glow **"CONSTRAINT"** slams in with a red zig-zag line | — |
| 16.38–19.21 | "and say, fuck everything else. I'm only attacking this thing until it's solved." | Guest MCU 3/4 | Red "F\*CK" + white glow "EVERYTHING ELSE" | — |
| 19.21–19.33 | — | Glitch frame | — | New topic (team) |
| 19.33–20.38 | "When building a team," | Wide | 5 white person icons pop in one by one, and the middle one highlights | — |
| 20.38–22.79 | "you have to set frame right away with what you want out of them." | Guest MCU | Small "SET" + blue "FRAME", then a small run-in | — |
| 22.79–26.38 | "Majority of the problems come from sales reps." | Wide | "the majority of" → white "PROBLEMS" → letters fly in → giant blue glow **"SALES REPS"** filling the headroom | 2 cuts |
| 26.38–27.71 | "They're so hungry for commission. And so I didn't have my phone, bro." | Guest front MCU (**new angle**) | — | Angle change hides the join |
| 27.71–30.42 | "My team was running completely fine without me." | Wide | "My team was running" → blue "COMPLETELY FINE" | — |
| 30.42–32.58 | "And that was the craziest feeling ever." | Guest MCU | White glow "THE CRAZIEST FEELING" + blue "ever" | — |
| 32.58–34.54 | "A lot of times it's like pricing stuff." | Wide (host hand on chin) | "A · LOT · OF · TIMES" spaced → giant blue **"PRICING"** | — |
| 34.54–35.96 | "People are charging too little." | Guest MCU | "People are charging" → blue "TOO LITTLE" | — |
| 35.96–38.54 | HOST: "What's like some tweaks you've made for some people that have like fucking ripped?" | Wide | No text (breathing room) | — |
| 38.54–43.8 | (laughter) | Wide, darker B&W-ish grade | CTA: "comment **"PIERRE"** for full episode": blue glow, typed in letter by letter | Hold 5.3 s to the end |

## V02: Sleep / Bryan Johnson (mode B, before/after packaging E1)
Orange textured backdrop. A small B&W "BEFORE" panel sits on the left, a big colour "AFTER" panel on the right. Captions are **gold serif italic** (Playfair-style) plus small Inter, with **orange bold for times**.

| t | Words | Scene | Text + animation |
|---|---|---|---|
| 0–3.0 | HOST: "What's the 30,000 foot view on how to get perfect sleep?" | Host MCU, warm studio | "What's the" → gold serif italic **"30,000ft"** + "view on". At 2.0 s "How to get *Perfect Sleep*" appears top left |
| 3.0–5.0 | GUEST: "Lower your resting heart rate before bed." | Guest profile MCU + lower third "Bryan Johnson / Health and wellness" (A7) | "Lower Your / *Resting Heart Rate* / Before bed" |
| 5.0–9.0 | "It's the highest value biomarker you can track on a daily basis." | **Metallic gold gradient + anatomical heart illustration** (C13) with a light sweep | Dark serif type-on "It's the / Highest Value / Biomarker / You can track on a daily basis" |
| 9.0–10.0 | "timing of food is really important" | **Polaroid transition**: a white border grows in from the edges, then the framed photo shrinks | "Timing of *FOOD*" |
| 10.0–11.5 | "So if your bedtime is 10 p.m.," | Dark B-roll silhouette | "If your bed time is" + orange **"10 PM"** |
| 11.5–13.5 | "you want to have your final meal at 6 p.m." | Dark B-roll of a woman eating | "Have your final meal" + orange **"6PM"** |
| 13.5–16.0 | "60 minutes before bed, screens off" | Guest front MCU | Gold glow italic **"60mins"** + "Screens off" |
| 16.0–18.5 | "that's very hard because we're all addicted to our phones" | Halftone B&W phone-in-hands B-roll | A thin line draws in from the left, then "We're all *ADDICTED* / to our phones" |
| 18.5–22.0 | "You want to have a 60 minute wind down" | Guest, 2 framings | Gold glow "*Wind down*" |
| 22.0–24.3 | "So when screens are off, you just need to kind of be with yourself" | Guest profile → Polaroid frame | "You just need to / **Be with yourself**" |
| 24.3–31.7 | "final caffeine around noon… food, light, wind-down routine, screens off. Those are the real big ones." | Guest MCU, **no graphics** | — (the recap is left clean: a 7.4 s hold, the longest of any reference) |

## V03: POV: we edit your podcast intro (mode C, monitor POV packaging E3)
The edit plays on a desk monitor in a red-lit room, with a fixed caption at the top: "POV: We edit your podcast intro 🔥". The screen shows one guest, one camera, and heavy kinetic type. Colours are **red block + white**, with **yellow** for one keyword and a **green laser** accent.

| t | Words | Screen content | Text + animation |
|---|---|---|---|
| 0–0.8 | "When you're broke," | Guest MCU | Stacked "WHEN YOU'RE **BROKE**" (white + red block) |
| 0.8–1.8 | "it's like arithmetic," | Wide 2-shot + "HOUSE" show logo | Red block word |
| 1.8–4.2 | "you would have to figure out how to stretch a penny into a dollar, right?" | Wide | "figure / out how to / **stretch**" (red); paper-cutout pennies and a dollar bill pop in (3.5–4.2) |
| 4.2–7.5 | "Entrepreneurship will expose every insecurity" | Guest MCU | Giant red-block **"ENTREPRENEURSHIP" behind the subject** (A4); "will · expose · every insecurity" words step in below |
| 7.5–9.4 | "you may have about yourself, and you will have to work through" | Guest | "YOU MAY HAVE" + red label "about yourself"; "work through" |
| 9.4–10.4 | "every single one of those." | Cream paper card | Green highlighter sweep behind "every single one of those" |
| 10.9–12.9 | "Your ceiling for success will be based upon" | Black card | "for **SUCCESS**" (red) + a green laser streak drawing across |
| 12.9–16.2 | "if you avoid those insecurities or if you run into them." | Guest | Red box **highlight sweep** on "insecurities" |
| 16.2–17.8 | "As an owner of a company, you're just a firefighter." | Guest | Yellow "a company"; red "firefighter" |
| 17.8–20.0 | "When it makes it to your desk, it is a fire." | Paper note on a wood desk + **red/yellow comic explosion** (C14) | Typed note |
| 20.0–26.4 | "Because if you have the right systems in place and the right operational infrastructure in place, it really won't ever make it to you." | Guest | Yellow "right", red "systems", red "infrastructure"; stacked left "IT / REALLY / WON'T", then "MAKE / IT / TO / YOU." |
| 26.4–30.0 | "As an entrepreneur, you're always anxious…" | Torn-paper B&W collage of famous founders (C15) | Red bar "you're always anxious" |
| 30.0–33.9 | "And that never goes away. I don't care how much money you make" | Guest | "that never goes", red "HOW MUCH **money**" |
| 33.9–36.4 | "we lost a big chunk of our business. Launched it, failed, but I walked away with" | Guest | "launched it" → red box **"failed"** → stacked "BUT I WALKED AWAY WITH LIKE" |
| 36.4–40.5 | "three theories on what would make up a good business." | Guest + **3 glowing white pills** appearing one per theory | "WHAT WOULD MAKE UP A GOOD" + yellow **"BUSINESS"** |

## V04: Jack Mason (mode A: cinematic, 2 people, warm studio)
There are 5 angles: host MCU (glasses), guest MCU (red hair), a wide set, an **orange-gelled profile** and a **teal-gelled profile** (A9). There's lots of B-roll and screen recordings.
- **Captions:** one word at a time, uppercase tight grotesk, white.
- **Keywords:** giant, and usually **behind the subject** (A4).
- **Accent:** orange.

| t | Words | Shot / scene | Text + animation |
|---|---|---|---|
| 0–0.84 | HOST: "Today, we are here with" | Host MCU (warm living room) | "TODAY" → "TODAY WE ARE / **HERE WITH**" (big, behind the head) |
| 0.84–1.68 | "Jack Mason," | Guest **backlit silhouette**, orange rim light | Giant **"JACK MASON"** behind the subject |
| 1.68–4.52 | "aka the longevity penguin." | Instagram profile screen recording (B5); light → dark, zoom | — |
| 4.52–6.08 | "We're going to dive deeper into" | Host MCU | "WE'RE GONNA DIVE" + big **"DEEPER"** |
| 6.08–6.84 | "running a business" | Wide set | "RUNNING A / **BUSINESS**" in the headroom |
| 6.84–7.68 | "at a pretty young age." | Silhouette B-roll at a window | "AT A PRETTY / YOUNG AGE" (wide-tracked) |
| 7.68–8.84 | GUEST: "23, like you said." | Guest MCU | Giant **"I'M 23"** behind the head; "LIKE · YOU · SAID" single words |
| 8.84–10.68 | "I graduated university last year" | Graduation photo (B6) | "I GRADUATED / **UNIVERSITY**" behind both people; "LAST" |
| 10.68–12.40 | "with high level entrepreneurs," | B-roll ×3 (laptop, meeting, handshake) | "WORKING" / "LEVEL" / "ENTREPRENEURS" (one word per shot) |
| 12.40–13.48 | "helping them grow their personal brand" | Zoom-call screen recordings on white | Orange heading "HELPING THEM GROW THEIR / **PERSONAL BRAND**" |
| 13.48–14.88 | "to ultimately grow their business." | Guest MCU | "ULTIMATELY GROW / **THEIR BUSINESS**" behind the subject |
| 14.88–16.52 | "And I scaled that to 100K a month." | White overexposure flash → stage-talk B-roll | Orange **count-up "$725/M → $100,000/M"** (digits roll for ~1.3 s); "I SCALED THAT TO" |
| 16.52–18.20 | "I wish more founders realized" | Guest MCU | "I WISH MORE" + orange **"FOUNDERS"** + "REALISE" |
| 18.20–19.88 | "that they think, oh, I can just outsource it" | Stage B-roll with a "The $500K/Year Personal Brand" slide | "THEY THINK" / "OH I" / "JUST" / "OUTSOURCE IT" |
| 19.88–21.40 | "or hand it off to someone else." | **Orange-gel profile** | Orange "HAND" / "TO" / "ELSE" |
| 21.40–22.60 | "And it's like, you need to be on camera." | Guest MCU | "YOU" → big **"CAMERA"** |
| 22.60–24.04 | "You need to be sharing your insights." | **Teal-gel profile** | Teal "YOU NEED TO BE SHARING / **YOUR INSIGHTS**" |
| 24.04–27.08 | "You can't just have a script handed to you once a week" | Paper "SCRIPT" document on off-white; lines write on; slides/wipes off to the guest | Document graphic, then "YOU" / "A WEEK" |
| 27.08–29.68 | "and just talk like that's not going to build the type of personal brand that you want to." | Guest MCU | "LIKE" / "GONNA" / "TYPE" / "**PERSONAL BRAND**" / "YOU WANT TO" |
| 29.68–37.0 | HOST (on screen): "This is just another part of the company… just like your sales team, paid marketing, operations, HR." | Host MCU | Single words, then orange **stacked tags** (A5): SALES TEAM → PAID MARKETING → OPERATIONS → HUMAN RESOURCE, one per spoken item |
| 37.0–41.88 | "If you want to be out there on social media, you need to have a full-on department" | Instagram profile → content grid → **zoom-blur push** through the thumbnails | — |
| 41.88–43.20 | GUEST: "I talk to so many people" | Guest MCU | "I TALK" / "SO MANY" / "PEOPLE" |
| 43.20–44.24 | "and they tell me, I want to be an entrepreneur" | Workshop B-roll (audience) | "I WANNA BE AN / **ENTREPRENEUR**" behind the speaker, then a **white overexposure flash** |
| 44.24–45.36 | "Like, I want to build my own thing," | Teal profile → orange profile | "WANNA" / orange "MY OWN THING" |
| 45.36–46.64 | "but they're just too scared to start." | Guest MCU | "JUST" / "TOO SCARED" |
| 46.64–49.28 | "The worst case scenario, if you try it and if you fail," | B-roll of the guest at a laptop in a café (2 framings) | "THE **WORST** / CASE / **SCENARIO**" behind; "IF YOU TRY IT / IF YOU FAIL" |
| 49.28–50.76 | "you'll be right back where you are now." | Guest MCU | "YOU'LL · BE · RIGHT" → big **"WHERE"** + "NOW" |
| 50.76–52.44 | "When you think about it that way, there's really no risk" | Guest MCU | "WHEN YOU THINK ABOUT IT" + giant **"THAT WAY"** behind; "THERE'S REALLY NO RISK" |
| 52.44–54.08 | "to get to the point where I am now." | Teal wide | "TO GET" / "THE POINT" / "I AM" (behind) |
| 54.08–55.76 | "It really started changing when—" | Guest MCU | "IT" / "STARTED" / "WHEN" → **cliffhanger cut mid-sentence** |
| 55.80–58.4 | — | **CTA card** on white: episode thumbnail (two faces, growth chart, "PERSONAL BRAND $100K / MONTH") | "COMMENT "JACK" FOR THE FULL EPISODE" |

## V05: Catherine Goetze: creator advantage (mode B, single guest, no host audio)
One guest on a sofa, with an MCU and a wide armchair angle. Every metaphor gets a **designed AI scene**.
- **Accent:** olive/lime green, taken from her green shirt.
- **Hard negatives:** red.
- **Captions:** small Inter Medium + big Inter Bold keyword. Some words **assemble letter by letter**.

| t | Words | Scene | Text + animation |
|---|---|---|---|
| 0–2.07 | "We posted that first video" | Guest MCU + lower third "Catherine Goetze (CatGPT) / Educator and content creator" (A7) | "We posted that" + big white **"first video"** |
| 2.07–4.53 | "and did $120,000 in pre-sales in three days." | **Newspaper reveal** (C1): a woman holds a "TECH & INNOVATION NEWS" paper in front of a library | **"$120,000" types digit by digit with a blur-in** (0.6 s); then 3D white extruded "PRE-SALES / IN THREE / DAYS" types in bottom left |
| 4.53–7.67 | "And sometimes you have to assume it's gonna work." | Guest MCU (eyes widen on "work") | Big "sometimes"; "it's gonna **work**" |
| 7.67–9.97 | "And if it works, you need to be prepared for what that looks like." | **Retro CRT + sticky notes** (C2), back of a person at the desk | On the CRT: "YOU NEED TO BE / **PREPARED** / FOR WHAT THAT LOOKS LIKE" (yellow "looks like") |
| 9.97–12.13 | "It's easy to go into it and be like, what are the odds?" | Wide armchair angle | Green "easy" / "to go into it" / "like" / "**odds?**" scattered around her |
| 12.13–13.70 | "But sometimes you will strike oil." | **B&W Chevron station with rising 3D green text** (C3) | "SOMETIMES / YOU WILL / STRIKE OIL" rises in line by line |
| 13.70–14.67 | "In those questions," | Guest MCU | "In those" + big "questions" |
| 14.67–17.10 | "you learn what you don't even know." | **3D ribbons on black** (C4): red, orange, lime | Each ribbon sweeps in carrying "YOU LEARN" / "WHAT YOU DON'T" / "EVEN KNOW" |
| 17.10–21.63 | "My goal is not to get you to produce something that I already know how to do." | Guest MCU | Green "My goal" + small run-in; "something" big |
| 21.63–22.30 | "My goal" | Black card (C6) | White "MY" + gold "GOAL" (blur-in) |
| 22.30–23.50 | "is to get you to produce something that" | **Paper on a green cutting mat** (C5) | Sticker-style white text with a dark green outline stacks in |
| 23.50–25.23 | "I literally can't do." | Black card | White "I LITERALLY" + red **"CAN'T DO"** |
| 25.23–27.53 | "Show me my blind spots. Show me my assumptions." | Guest MCU | **Letter-assemble**: "blind spots" and "assumptions" build from scattered letters (0.4 s) |
| 27.53–29.57 | "You're asking it to expose." | **Gold frame on red velvet, faceless portrait** (C7) + AI app icons (ChatGPT / Claude / Perplexity) rising at the bottom | "YOU'RE ASKING IT TO" on the face → red stamp **"EXPOSE"** |
| 29.57–34.4 | "Being a creator is the most unfair advantage that you can possibly have as an entrepreneur." | Guest MCU, holds 4.8 s | "creator" / "advantage" / "possibly" / letter-assembled "entrepreneur" — **thesis close, no CTA** |

## V06: Red light / skin ageing (mode B, 3 speakers, brand content)
Beige/champagne room with soft window light.
- **Accent:** maroon/rose.
- **Type:** high-contrast condensed serif (Bodoni/Playfair-style) for keywords and Inter for run-ins. Some keywords sit in **maroon pills**.
- **Supporting visuals:** AI portraits, 3D science renders and a macro face with a diagram callout.

| t | Words | Scene | Text + animation |
|---|---|---|---|
| 0–2.37 | MAIN: "If someone said to me, what is the one thing" | Main speaker MCU + **title banner** (A8) "Why Your Skin Ages / Faster Than You Think?" (white serif on a maroon box, top, first ~2.4 s) | "If someone / said to"; "what is the / *one thing*" in a maroon highlight box |
| 2.37–5.27 | "that would impact your skin the most?" | AI woman profile on beige; a blemish **grows on the cheek** over the shot | Small "that would" → big maroon condensed serif **"impact your skin"** + "the most?" |
| 5.27–6.83 | "For me, it is not enough sleep." | Main speaker | "For me" / "it is not" / serif "**enough sleep**" in a blurred box |
| 6.83–8.97 | "By the time we hit our 30s," | AI woman on a sofa by the window | "BY THE TIME" + big maroon serif "**we hit our 30s**"; ghost serif "SKIN SLOWDOWN" behind |
| 8.97–12.67 | "we lose 8% of that mitochondrial function" | **3D golden mitochondria render** (B3), light sweep; brand "Dermalux" top; lower third "Louise Taylor / Co-founder" (A7) | Left-aligned type-on "WE LOSE 8% OF THAT" → bold "**MITOCHON-DRIAL** function" |
| 12.67–17.23 | "every decade. So everything is slower, we heal slower." | Main speaker (enters with a rack-focus blur) | "Every decade" (underline) / "So everything / **is slower**" / "we heal / **slower**" |
| 17.23–18.57 | "Now when you wake up" | Dim AI bedroom morning, silhouette | "NOW WHEN YOU / **WAKE UP**" gold serif |
| 18.57–21.53 | "and the skin doesn't kind of go back the way it did." | **Macro face with acne + callout** (B4): dot + leader line + label | "**Energy decline:** and your skin doesn't kind of go back the way it did" types into the label |
| 21.53–25.47 | "You can't remember someone's name in the middle of the day and you get that brain fog." | Main speaker | Letter-assembled serif "**someone's**" + maroon pill "name"; serif italic "*in the middle of the day*" + star icon; "and you get that **! BRAIN FOG !**" |
| 25.47–27.67 | "You just don't feel yourself anymore." | AI woman at a mirror touching her face | "You just don't / **Feel Yourself** / anymore" (rose), with a thin line drawn |
| 27.67–28.73 | "All of this is" | Main speaker | "All of this is" |
| 28.73–30.93 | "because we now have a mitochondrial dysfunction" | Macro skin texture | Serif caps "MITOCHONDRIAL **DYSFUNCTION**" with giant ghost letters behind |
| 30.93–34.80 | "and it targets something called the mitochondria. If we want to stimulate collagen and elastin," | Main speaker | Maroon pill "**Mitochondria**"; "If we want to / **STIMULATE COLLAGEN**" + pill "Stimulate Elastin" |
| 34.80–37.13 | "we can trigger the fibroblast cell," | Microscope image on a **3D tilted card with a long cast shadow** on white | "we can trigger the" + serif in a dark pill "**Fibroblast Cell**" |
| 37.13–42.30 | "for example, the opportunity to be able to produce collagen and elastin. So we can create that trigger with light." | Main speaker | "**able to produce**" / "collagen and" + "elastin" tag / "create that **trigger**" / "with light" |
| 42.30–43.93 | "UV light we know does damage" | Sun through clouds | Serif "UV light we know / **does damage**" |
| 43.93–47.80 | 2ND SPEAKER: "because you can get skin cancer and signs of aging… it can also have beneficial effects." | 2nd speaker MCU | Stacked **pill tags with icons** (A6): "Skin Cancer" / "Signs Of Aging"; serif "**beneficial** EFFECTS" |
| 47.80–48.90 | 3RD SPEAKER: "But if I'm feeling tired," | 3rd speaker MCU | Serif "*feeling tired*" |
| 48.90–51.07 | "have a quick power nap under the red light" | Clinic B-roll: client under a red LED panel | "have a quick / **power nap** / under the red light" |
| 51.07–51.87 | "and I'm like, ready to go." | 3rd speaker | "ready to go" |
| 51.87–56.0 | MAIN: "So that is the power of red light and why everyone's talking about it at the moment, because it is for everybody." | Main speaker | "That is the power of / red"; "and why / **everyone's talking**" + "?" icon; "because it is / **for everybody**" — **thesis close** |

## V07: Alcohol gene variant (mode B, raw vs final packaging E2)
White soft-shadow backdrop with a small "● Raw" panel, a big "● Final Video" panel and "DM for Work @vizentrix".
- **Captions:** wide-tracked uppercase sans (Montserrat-style), with **gold serif glow** for key terms.
- **Transitions:** **light-leak flashes**.
- **B-roll:** AI scenes that act out each "you" moment.

| t | Words | Scene | Text + animation |
|---|---|---|---|
| 0–1.4 | GUEST: "About 8% of people" | Guest MCU (navy curtain) | "ABOUT" → gold glow **"8%" / "OF PEOPLE"** |
| 1.4–3.0 | "have a gene variant" | **DNA helix render** (B3) | "GENE VARIANT" fades up |
| 3.0–6.0 | "that when they drink they don't feel the same" | Guest | "WHEN THEY **DRINK**" (gold); "THEY DON'T FEEL" |
| 6.0–6.4 | — | **Pink/orange light-leak flash** | — |
| 6.4–8.0 | "sedative type quality to alcohol." | AI apartment party, people standing | "TO ALCOHOL" |
| 8.0–10.5 | "When you drink, the first thing that happens for everybody" | Guest (punch-in) | "WHEN YOU DRINK" / gold "EVERYBODY" |
| 10.5–11.0 | — | Yellow/orange light-leak | — |
| 11.0–13.4 | "is your prefrontal cortex. This is like the part of your brain right behind your forehead." | **Brain render** on white (B3) → push-in to the brain surface | "PREFRONTAL CORTEX"; gold serif "YOUR FOREHEAD" |
| 13.4–15.5 | "It's the part that sets context" | Guest | "IT'S THE PART THAT / **SETS CONTEXT**" |
| 15.5–17.0 | "like what's appropriate in different places." | AI crowd → **red-tinted flash** of the same shot | "like what's appropriate / IN DIFFERENT PLACES" |
| 17.0–18.5 | "It inhibits you." | Guest | "IT INHIBITS YOU" |
| 18.5–20.0 | "Everybody gets a little more talkative" | AI bar scene (B2) | "everybody gets a / **LITTLE MORE TALKATIVE**" |
| 20.0–22.0 | "but then you drink more and people are starting" | Guest | "BUT THEN YOU / DRINK MORE / AND PEOPLE / ARE STARTING" |
| 22.0–23.0 | "to pass out on the couch" | AI room, people passed out on sofas | "TO PASS OUT / ON THE COUCH" |
| 23.0–24.0 | "and people are slurring their words." | Guest | "and people are slurring / **THEIR WORDS**" |
| 24.0–24.5 | — | Yellow light-leak | — |
| 24.5–25.5 | "About 8% of people" | Guest | Gold "8%" (**callback to the hook**) |
| 25.5–27.0 | "get a dopamine surge" | **Glowing brain with an energy beam** | "**DOPAMINE SURGE**" |
| 27.0–29.0 | "and an energy increase from alcohol" | AI lounge, a man standing and energised | "FROM ALCOHOL" (gold serif) |
| 29.0–31.0 | "with increasing alcohol intake." | Guest (red flash at 30.5) | "with increasing / **ALCOHOL INTAKE**" |
| 31.0–33.0 | "So you're in your 20s and there's that guy and he's still" | Guest | "YOUR TWENTIES" / "AND THERE'S A GUY" |
| 33.0–34.0 | "awake at like three in the morning" | AI night apartment over a city, clock "3:07 AM" | "still awake at like / 3AM IN THE" |
| 34.0–35.0 | "he's in the kitchen" | AI kitchen, man at the cupboard | "HE'S IN THE KITCHEN" |
| 35.0–37.0 | "and you see him the next morning" | Guest | "AND YOU SEE HIM THE / **NEXT MORNING**" (gold) |
| 37.0–38.0 | "and he's like, hey, let's go run it." | AI sunny suburb, guy in a tank top | "**Heyyy!**" / "LET'S GO" |
| 38.0–39.5 | "That's a genetic predisposition." | Guest | Gold serif glow "*that's a* **GENETIC PREDISPOSITION**" |
| 39.5–40.4 | HOST: "Wow." | Host MCU (cap) | — (**the host reaction ends the clip**) |

## V08: Frame War entry 1 @ranvindra (mode C, AI-collage VO)
Carousel slide 2. On every Frame War slide the card sits on a dark charcoal background with gold light streaks and a giant ghost "FRAME WAR". It has a number badge, an @handle pill, and "Comment "1" to vote →" underneath. The VO is identical across entries 1–3.

| t | VO | Scene | Text + animation |
|---|---|---|---|
| 0–1.4 | "Time doesn't wait for you to catch up." | **Pocket watch on a chain over a grass field, blue sky** (C8) | Green 3D letters with a dark outline "TIME / DOESN'T WAIT / FOR YOU" type in; a hand raises a green sign "CATCH UP" from the bottom |
| 1.4–3.6 | "Money follows whoever shows up first." | Fast whip/blur → man in white throwing banknotes from a tall window; the notes fly toward camera | Serif "WHOEVER / SHOWS / UP FIRST" inside the window frame |
| 3.6–7.4 | "That's why consistency is the only edge you have." | Blur → **overhead green cutting mat + paper** (C5); a hand writes | Handwritten serif "consistency / is the only / edge / you have"; green sticker "Edit like" slaps on at 6.5 |
| 7.4–8.4 | "Edit like it's your last shot." | Zoom out → **retro PC on green XP hills** (C11) | Wooden-sign slab serif "IT'S YOUR / LAST SHOT" |
| 8.4–9.2 | "Tomorrow," | Tablet on the cutting mat showing a cut-out person | — |
| 9.2–10.6 | "someone else takes your spot." | **Hypnotic orange/white spiral** with a cut-out man centred (C12) | Yellow sticker "someone / else / takes / your spot" |

## V09: Frame War voting board (packaging E4, carousel slide 1)
- **Layout:** dark charcoal background with gold light streaks. Giant **"FRAME / WAR"** (white "FRAME", gold "WAR", heavy grotesk), then "voting is **open**", "**$250**", "TOP 3 **FINALIST**", then three 9:16 cards side by side playing entries 1–3 **in sync**, and "**swipe** to check edits & vote →".
- **Audio:** music only.
- **Purpose:** one VO script, three style interpretations. It works as a direct A/B test of scene design and as engagement bait ("Comment "1/2/3" to vote · Three edits. One winner. Your vote decides.").

## V10: Frame War entry 3 @rohan (mode C, classical / dreamy remix)
| t | VO | Scene | Text + animation |
|---|---|---|---|
| 0–2.0 | "Time doesn't wait for you to catch up." | Pocket watch floating in clouds over pink roses and mist (C8) | Yellow-green neon **script** "Time doesn't / wait for you" + "Catch up"; red ribbon swoosh |
| 2.0–3.0 | "Money follows" | **Napoleon crossing the Alps** painting remix (C9), yellow sky | Script "Money / follows" |
| 3.0–4.4 | "whoever shows up first." | Napoleon close-up, star burst | Script "Whoever / Shows up first!"; the red ribbon crosses the frame |
| 4.4–7.5 | "That's why consistency is the only edge you have." | **Vintage parchment with compass lines + photo-card grid** (C10): blacksmith, gears | "that's why" + red script **"Consistency"** + "is the only edge you have" |
| 7.5–9.0 | "Edit like it's your last shot." | Classical archer statue on a balcony | Yellow sticker text |
| 9.0–10.6 | "Tomorrow, someone else…" | Doves/cherubs in blue sky, statue base | Yellow script "someone else"; red ribbon (cuts off mid-sentence) |

## V11: Frame War entry 2 @after.vision_ (mode C, vintage props on paper)
Beige/sepia paper world with real-object props held by hands, and engraved serif caps.

| t | VO | Scene | Text + animation |
|---|---|---|---|
| 0–0.9 | "Time doesn't wait for you" | Vintage clock face on beige paper | Engraved serif "**TIME** / doesn't wait for you" (gold/white) |
| 0.9–2.4 | "to catch up." | Sky with clouds; a hand lowers a **vintage TV frame** into shot | "CATCH UP" on the TV screen |
| 2.4–4.3 | "Money follows whoever shows up first." | A hand places a banknote cube on a stack on a side table; banknote piles at the bottom | Serif caps "SHOWS UP / **FIRST**" |
| 4.3–5.4 | "That's why consistency" | Beach: a suited man **running with a briefcase** under a spotlight beam; sign "CONSISTENCY" | — |
| 5.4–7.4 | "is the only edge you have." | **Same running man; the background swaps** beach → desert → city skyline (C16) | The subject stays fixed while the world changes, which visualises "consistency" |
| 7.4–9.3 | "Edit like it's your last shot." | White room, **old CRT computer** "EDIT LIKE" on screen → zoom out | "LAST SHOT" above the CRT |
| 9.3–10.6 | "Tomorrow, someone else…" | White card | Small serif caps "TOMORROW" → "someone else" + small hands/photo cut-out |

## V12: Problem-solving brain (mode D: idea worlds, client podcast edit)
Full analysis in `docs/pattern-v3/breakdown.md`, with the shot table in `docs/pattern-v3/shots.csv`. Summary:

| t | Words | Shot / scene | Text + animation |
|---|---|---|---|
| 0–1.87 | "I've got a mind that likes to solve problems." | Side-profile CU, warm amber bokeh, slow push-in | Small white "i've got a / that likes to solve" + gold **script** "*Problems*" with a warm glow |
| 1.87–3.77 | "I'm just trying to give it good problems to solve." | **3D lightbulb world on cream** (D1) | Dark grey sans typed word by word; **orange 3D extruded "Problem's"** |
| 3.77–6.10 | "I think lots of people have a problem-solving brain," | Same world; **the camera whip-tilts up** with motion blur | The previous line stays at the top; the new line types below |
| 6.10–9.30 | "but only some people have great problems that they're going to solve with it." | Blur whip → **two 3D puzzle pieces drift together and lock** on "great problems" | "But only some people / have great / Problem's / That they are going to solve with it" |
| 9.30–9.57 | "It's very" | **Room-wide cutaway** (interviewer's hand + drink can) | Re-entry shot after the graphics |
| 9.57–12.70 | "difficult to worry about the future when you feel like you're moving yourself toward it." | Front medium with mic, purple window bg | Plain white chunks |
| 12.70–17.47 | "That problem-solving brain thing is interesting because I wonder how many people churning themselves up inside because" | 3/4 medium from the other side (head scratch) | Gold script "*Brain*", "*Churning*" |
| 17.47–21.57 | "they have a brain that likes to solve problems, but they don't have any good problems to solve." | **3D brain + orange curved road** (D1); camera push on "but" | Orange 3D "Brain"; "But they don't have any good problem to solve" |
| 21.57–25.47 | "So they pay attention to politics or porn or their ex or a" | Front CU | "politics or p\*\*n" (censored) |
| 25.47–29.37 | "situation that's outside of their control in some foreign country that they can't get access to." | **Tighter CU punch-in** | Gold script "*Control*", "*Access*" — **hard stop on the last word** |

## V13: Aussie creators (mode D, raw vs final packaging E5, two speakers)
Peach→orange gradient background, a B&W "Raw file" panel and a big "Final Video" panel with orange pill labels. Speaker A wears a hair bun; speaker B wears a black cap.

| t | Words | Scene | Text + animation |
|---|---|---|---|
| 0–1.10 | A: "I think the biggest challenge" | A 3/4 CU | Orange bold "**biggest**" + script "*challenge*" |
| 1.10–3.80 | "for Aussie creators is finding community" | **Iris**: the face shrinks into a circle avatar (D5); title "Aussie creators / is finding community"; memoji avatars **orbit** her | Title types in |
| 3.80–5.60 | "because if you think about it, like, you and I" | A CU (vertical-stripe glitch wipe in) | Small white single words |
| 5.60–7.95 | "have been doing this for four or five years" | Gradient card (D2) | Orange **bars rise on "four" and "five"** ("4 years" / "5 years") |
| 7.95–11.80 | "and so far there's been no spaces for us to connect with anyone." | Chat-bubble notification with a memoji slides up | **Red error flash** on "connect" |
| 11.80–13.45 | B: "It's really frustrating, because like" | B CU (hard cut on her first word) | Orange "**frustrating**" |
| 13.45–16.30 | "where do you go to collaborate with other creators," | Black card; avatars float apart with orange glow trails | — (an isolation metaphor) |
| 16.30–19.20 | "and also when you have questions, like, who do you ask?" | B CU | Orange "**questions**" + ??? icons |
| 19.20–23.0 | A: "And I think tall poppy syndrome is really big here in Australia." | A frontal CU (cut in the pause before she speaks) | Orange "**poppy syndrome**" → "in Australia" — **ends on the punchline** |

## V14: UAE property (mode D, before/after packaging E6: macOS window + tool dock)
Night-street blue background with a small "Before" panel. The "After" panel sits inside a **macOS window** (traffic lights + "Your best video ever.mp4"), over a dock of Ae · Pr · IG · YT · TikTok icons.
- **Accent:** **neon purple**, with glassmorphism UI.

| t | Words | Scene | Text + animation |
|---|---|---|---|
| 0–1.50 | "The UAE attracts thousands" | Front medium, dark luxury studio | "The UAE Attracts" + a **glass widget** "United Arab Emirates" with a ticking counter and progress bar (A15) |
| 1.50–3.20 | "of international investors every month," | **1-frame RGB-invert glitch** + punch-in | Big white "International / Investors"; "Every Month" |
| 3.20–4.05 | "and while the opportunity" | Side 3/4 angle | A house **app icon pops up and a cursor clicks it** |
| 4.05–6.60 | "is exceptional, the process must be structured," | The icon **expands into a full-screen UI** (D3): "Overseas Property Buying", neon sliders | "Investment Opportunity → **Exceptional**", "Buying process → **Structured**" |
| 6.60–8.05 | "especially for buyers abroad." | Whip-pan → side angle | Neon purple "**Buyers**" + tag "Abroad ✕" |
| 8.05–13.80 | "A successful remote purchase requires clear documentation, verified reports, transparent market data" | Defocus → front medium | Neon "**Successful**" + "A Remote Purchase"; **checklist pills build one per item** |
| 13.80–15.3 | "and reliable oversight." | Glitch + tight CU | Small eye-icon tag "Reliable Oversight" |

## V15: Every week in 2025 (mode D, before/after packaging E7, solo creator)
Periwinkle gradient with "● Before" (red dot) and "● After" (green dot) labels. Graphics take up **75%** of the runtime: one camera, so the graphics carry the variety.

| t | Words | Scene | Text + animation |
|---|---|---|---|
| 0–0.50 | "It feels like" | Front medium (smiling) | — |
| 0.50–4.40 | "every new week in 2025" | **Misty flower field + tree** with a glass weekly calendar widget "July 01" (D4) | "every new week" → huge outlined **"2025"** lands on "2025" |
| 4.40–6.00 | "is a new life." | **3D laptop on a green hill under a blue sky** (D4) | "is a new" + script "*Life*" |
| 6.00–7.40 | "Like we're starting from scratch." | Front medium | "Starting / from the *Scratch*" |
| 7.40–10.00 | "There is this new AI tool that we're integrating," | White glass card (D3): **a list of AI tool logos builds** (ChatGPT, Gemini, Claude, Midjourney) with ticks, then scrolls up and away | — |
| 10.00–12.00 | "there is this new strategy," | Glass frame; **a line chart draws upward** | — |
| 12.00–13.80 | "and we're hiring more people" | **Incoming-call cards stack** ("Unknown", accept/decline) | — |
| 13.80–15.00 | "to help us with all of that." | Front medium | Small white |
| 15.00–20.00 | "So I've been creating content for 10 years, but I've never experienced anything" | **Her real YouTube channel grid, restyled** on a card (D6) | Type-on "I've been creating contents" + huge lavender "**10 YEARS**" on "10" |
| 20.00–22.5 | "like this, like 2025." | Front medium | Neon cyan script "*like 2025*" — **callback to the hook** |
