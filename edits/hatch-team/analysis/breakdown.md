# Frame-by-frame breakdown and camera angles

Every one of the source's **5,515 frames** (184.07 s at 29.97 fps) was analysed by `analyze_frames.py`, and the raw per-frame data is in `frames.csv`. The script measured these things for each frame:

- **Face:** box, eye, nose and mouth landmarks, roll and yaw, from the YuNet face detector.
- **Head motion:** how far the face centre moved since the previous frame.
- **Global motion energy:** the mean absolute difference from the previous frame.
- **Gesture energy:** motion in the zone where his right hand rises.
- **Cut score:** 1 minus the HSV-histogram correlation with the previous frame.
- **Luma and audio:** frame brightness and audio RMS in dBFS.

`face_track.json` is the face centre and eye line, smoothed: a 1 s rolling median, then a 0.5 s mean. It drives the virtual camera.

## 1. What the camera does: one locked angle

| Check | Result |
|---|---|
| Hard cuts (cut score > 0.3) | **One**, at **178.71 s**: the stream cuts to its bright outro card (luma 87 → 127). The last frame (184.0 s) is black. |
| Camera moves | None. The background never shifts, and global motion stays under 0.9 for 95 % of frames: only he moves. |
| Face detected | 97.1 % of frames. The misses are all on the outro card, from 178.71 s onward. |
| Face position | Centre x **1010 ± 23 px**, y **587 ± 15 px**. Box 253 × 367 px. Eye line y ≈ 555 px, chin y ≈ 770 px. |
| Framing | He sits dead centre with about 37 % headroom. He's chest-up at the bottom, with a Shure mic on a boom arm in front of his chin. |

**Conclusion:** the whole talk is one locked-off webcam angle. Every angle change in the clip is a **virtual camera**, meaning a 9:16 crop of this frame.

## 2. What's burned into the picture (and how the edit handles it)

| Element | Where | When | Handling |
|---|---|---|---|
| Stream border (orange-red) | 16 px top/bottom, 28 px sides | always | Crops stay inside y 18–1062, x 30–1890 |
| "REAL ESTATE LIVE" logo sting | over his mouth / chin | **0.1 – 5.0 s** | The hook plays over a rack-focus opener; the real footage comes into focus once the logo is gone |
| Burned-in captions (white spoken / **grey upcoming** / orange keyword) | y 838–937, x 539–1469 | the whole talk | Inpainted every frame (`remove_captions`); new captions replace them |
| Red lower-third "What makes a real estate team actually function well?" | bottom-left | first frames | Outside every crop |
| "REL" logo, "LIVE Stream" badge, "@RealErikHatch" | corners | always / start | Outside every crop |
| Outro card | full frame | 178.71 s → | Not used |

## 3. Behaviour events (from the per-frame data)

| Event | Source time (s) | Rule |
|---|---|---|
| silence | 4.20 – 4.64 | audio < -45 dBFS |
| silence | 5.64 – 6.07 | audio < -45 dBFS |
| lean-in | 6.11 – 6.81 | face width > 266px (p95) |
| lean-in | 7.01 – 7.64 | face width > 266px (p95) |
| silence | 7.94 – 8.84 | audio < -45 dBFS |
| lean-in | 10.71 – 11.58 | face width > 266px (p95) |
| silence | 11.21 – 11.78 | audio < -45 dBFS |
| silence | 19.99 – 21.19 | audio < -45 dBFS |
| silence | 27.36 – 28.06 | audio < -45 dBFS |
| silence | 29.13 – 29.56 | audio < -45 dBFS |
| silence | 32.13 – 32.80 | audio < -45 dBFS |
| silence | 42.48 – 43.54 | audio < -45 dBFS |
| silence | 45.75 – 46.35 | audio < -45 dBFS |
| silence | 48.11 – 48.65 | audio < -45 dBFS |
| silence | 50.75 – 51.99 | audio < -45 dBFS |
| silence | 55.12 – 55.49 | audio < -45 dBFS |
| silence | 63.66 – 64.83 | audio < -45 dBFS |
| gesture burst | 67.67 – 67.93 | hand motion in gesture zone > 3.5 (p95) |
| silence | 70.84 – 71.47 | audio < -45 dBFS |
| silence | 74.44 – 74.84 | audio < -45 dBFS |
| silence | 77.11 – 78.71 | audio < -45 dBFS |
| silence | 89.16 – 89.96 | audio < -45 dBFS |
| silence | 96.30 – 96.66 | audio < -45 dBFS |
| silence | 100.93 – 102.24 | audio < -45 dBFS |
| silence | 111.18 – 111.75 | audio < -45 dBFS |
| silence | 114.01 – 114.58 | audio < -45 dBFS |
| silence | 117.18 – 117.95 | audio < -45 dBFS |
| silence | 124.19 – 124.79 | audio < -45 dBFS |
| silence | 126.66 – 127.39 | audio < -45 dBFS |
| gesture burst | 127.69 – 127.93 | hand motion in gesture zone > 3.5 (p95) |
| silence | 128.53 – 129.26 | audio < -45 dBFS |
| silence | 131.23 – 131.66 | audio < -45 dBFS |
| head turn | 131.33 – 132.27 | yaw > 0.3 (looks off to his left) |
| silence | 132.87 – 133.33 | audio < -45 dBFS |
| silence | 135.54 – 136.14 | audio < -45 dBFS |
| head turn | 137.57 – 138.10 | yaw > 0.3 (looks off to his left) |
| lean-in | 137.67 – 138.67 | face width > 266px (p95) |
| silence | 143.34 – 144.31 | audio < -45 dBFS |
| silence | 148.48 – 149.52 | audio < -45 dBFS |
| silence | 153.75 – 154.72 | audio < -45 dBFS |
| silence | 155.52 – 156.19 | audio < -45 dBFS |
| silence | 158.86 – 159.36 | audio < -45 dBFS |
| silence | 160.49 – 161.73 | audio < -45 dBFS |
| silence | 164.93 – 165.77 | audio < -45 dBFS |
| silence | 168.84 – 170.24 | audio < -45 dBFS |
| hard cut | 178.71 – 178.71 | histogram correlation drop; end of the talk, stream cuts to the outro card |
How these drove the edit:
- The **lean-in at 6.1–7.6 s** ("the leader has **ego**") is his strongest physical emphasis in the opening. The edit punches in to CU exactly there.
- The **head turn at 131.3–132.3 s** ("simple things on **repeat**") moves his face 160 px right. That shot is a CU with a follow pan instead of a locked crop.
- The **silences** are where the jump cuts go: every pause over 0.40 s inside a kept sentence is cut down to about 0.16 s.
- The **gesture bursts** are kept inside WIDE or MCU shots, so his hand isn't cropped at the edge of a tight shot.

## 4. The virtual camera angles

The usable band is above the stream's bottom border, and the burned captions are inpainted. Because the eye line sits at y 555, a tighter crop puts the eyes higher in the frame.

| Angle | Crop (source px) | Upscale to 1080×1920 | Eye line in frame | What it shows | Used for |
|---|---|---|---|---|---|
| **WIDE** | 585 × 1040 | 1.85× | 50 % | Room, painting, mic; lots of headroom | Set-ups, lists, graphics in the headroom (tags, "#1") |
| **MCU** | 495 × 880 | 2.2× | 42 % | Chest-up | Default talking shot, bridges |
| **CU** | 416 × 740 | 2.6× | 37 % | Face + shoulders | Punch-ins on stressed words, hiding jump cuts |
| **ECU** | 366 × 650 | 3.0× | 36 % | Face only | The two hardest beats: "the most **boring**", "it's **not** a suggestion" |

Every shot also has a slow push-in of 3–5 % over its length, so no frame is static. Framing is locked to the **median face position over the shot**, like a real camera. The one follow-pan shot is the exception. Captions drop 110 px in WIDE shots so they sit below his chin.

## 5. Where the camera angles are (the clip's angle map)

Output time is time in the 9:16 clip, and source time is time in the original video. Every jump cut lands on an angle change. The designed scenes cover the rest.

| Output (s) | Source (s) | Angle | Words |
|---|---|---|---|
| 0.00–2.90 | 0.00–2.87 | **WIDE** | Real estate teams in their purest form, |
| 2.90–5.00 | 4.01–6.08 | **MCU** | exist because |
| 5.00–6.64 | 6.11–7.71 | **CU** | the leader has ego. |
| 6.64–8.44 | 43.76–45.53 | **MCU** | for a real estate team to function well, |
| 8.44–12.61 | 46.98–51.12 | **scene: blueprint** | that ego has to be transformed into a blueprint. |
| 12.61–13.88 | 79.98–81.21 | **MCU** | I have a buddy named Matt Miali and he |
| 13.88–18.75 | 81.25–86.09 | **WIDE** | runs this incredible team out of Connecticut, makes great money, high per agent productivity. |
| 18.75–20.15 | 92.77–94.14 | **CU** | what's the secret to your success? |
| 20.15–21.29 | 94.17–95.27 | **MCU** | And he's like, Eric, this is going to be |
| 21.29–22.09 | 95.31–96.07 | **ECU** | the most boring |
| 22.09–23.42 | 97.25–98.55 | **CU** | conversation that you've had. |
| 23.42–25.46 | 99.01–101.01 | **WIDE** | number one, everybody agrees to show up. |
| 25.46–26.46 | 104.81–105.78 | **CU** | And if somebody is not there, |
| 26.46–31.40 | 105.81–110.72 | **scene: texts** | every 25 people on the team text that person to say, Hey, are you alive? Are you still in real estate? |
| 31.40–32.23 | 114.31–115.11 | **MCU** | That's a blueprint, |
| 32.23–34.10 | 117.51–119.35 | **WIDE** | And then everybody has |
| 34.10–38.34 | 119.38–126.40 | **scene: board** | X number of conversations per week, / And then they're going to add friends to their database. |
| 38.34–39.14 | 128.97–129.74 | **MCU** | They're just doing |
| 39.14–42.04 | 129.77–132.64 | **CU** (follow pan) | simple things on repeat. |
| 42.04–43.34 | 142.31–143.58 | **scene: final** | This is the blueprint. |
| 43.34–44.64 | 143.95–145.22 | **ECU** | It's not a suggestion. |
| 44.64–45.65 | 145.80–146.77 | **CU** | you have to do this. |
In the first 3.94 s the WIDE angle is shown fully blurred over the logo sting, using clean footage from 60 s on. It comes into focus over 0.45 s.

## 6. Per-second table (whole source)

`face` is the mean face centre (x, y) and `size` is the face box width, both in source px. `yaw` is negative when he looks to his right. `head` is the mean per-frame head movement in px, and `gesture` is the hand-zone motion energy.

| s | face | size | yaw | head | gesture | dBFS | words starting in this second |
|---|---|---|---|---|---|---|---|
| 0 | 1000, 570 | 260 | +0.03 | 5.3 | 1.65 | -48 | Real estate teams |
| 1 | 994, 517 | 248 | +0.07 | 2.2 | 1.13 | -38 | in their purest |
| 2 | 993, 576 | 259 | +0.02 | 3.7 | 2.40 | -26 | form, in |
| 3 | 1033, 583 | 267 | +0.11 | 3.8 | 1.60 | -30 | my experience, |
| 4 | 992, 576 | 264 | +0.14 | 4.9 | 1.51 | -45 | exist because |
| 5 | 940, 590 | 267 | +0.18 | 5.0 | 0.61 | -43 |  |
| 6 | 959, 588 | 268 | +0.03 | 3.0 | 0.59 | -30 | the leader has |
| 7 | 986, 590 | 268 | -0.02 | 1.3 | 0.23 | -34 | ego. |
| 8 | 992, 591 | 266 | -0.01 | 1.1 | 0.27 | -73 | It's |
| 9 | 987, 561 | 261 | +0.02 | 3.4 | 0.44 | -30 | maybe not |
| 10 | 971, 533 | 267 | +0.02 | 1.7 | 0.25 | -25 | the reason why |
| 11 | 953, 551 | 268 | +0.07 | 2.6 | 0.28 | -45 | they |
| 12 | 935, 581 | 260 | +0.06 | 2.0 | 0.14 | -26 | were started, |
| 13 | 939, 584 | 266 | +0.01 | 1.2 | 0.09 | -34 | but the reason |
| 14 | 941, 578 | 265 | -0.00 | 2.1 | 0.20 | -27 | why they |
| 15 | 987, 562 | 252 | -0.01 | 2.8 | 0.60 | -33 | go the |
| 16 | 1014, 578 | 258 | +0.02 | 2.2 | 0.75 | -28 | way which they want. |
| 17 | 1033, 581 | 258 | -0.06 | 2.6 | 1.06 | -28 | And I, as a person with |
| 18 | 1010, 578 | 256 | +0.02 | 3.0 | 0.83 | -28 | a healthy ego, certainly |
| 19 | 1010, 584 | 258 | -0.08 | 3.1 | 1.29 | -33 | can smell my own. |
| 20 | 1019, 583 | 250 | -0.05 | 2.3 | 0.85 | -76 | And |
| 21 | 1026, 583 | 243 | -0.06 | 1.7 | 0.71 | -34 | so if |
| 22 | 1039, 575 | 239 | -0.12 | 1.6 | 0.45 | -28 | you're looking at this with |
| 23 | 1040, 582 | 249 | -0.07 | 1.3 | 1.09 | -40 | clear eyes, |
| 24 | 1038, 585 | 245 | -0.06 | 1.1 | 0.69 | -28 | what |
| 25 | 1034, 587 | 245 | -0.05 | 1.1 | 0.36 | -26 | makes a real estate team |
| 26 | 1035, 581 | 242 | -0.09 | 1.4 | 0.36 | -31 | actually function well, |
| 27 | 1041, 580 | 244 | +0.06 | 2.4 | 1.89 | -56 | well, that |
| 28 | 1010, 577 | 249 | +0.21 | 2.4 | 0.79 | -26 | ego has |
| 29 | 1000, 579 | 245 | +0.20 | 1.0 | 0.33 | -49 | to be |
| 30 | 1006, 578 | 246 | +0.15 | 1.7 | 0.32 | -30 | turned into |
| 31 | 1010, 586 | 248 | +0.09 | 1.7 | 2.31 | -34 | help, |
| 32 | 1012, 588 | 251 | +0.03 | 1.3 | 1.53 | -61 | right? |
| 33 | 999, 577 | 250 | -0.07 | 2.6 | 2.83 | -41 | It is, it |
| 34 | 997, 573 | 253 | -0.06 | 2.5 | 2.04 | -26 | is a dastardly |
| 35 | 1004, 583 | 252 | -0.07 | 2.1 | 1.91 | -24 | dream to say like, |
| 36 | 1008, 589 | 251 | +0.01 | 2.1 | 0.46 | -28 | I'm going to open |
| 37 | 1026, 588 | 254 | +0.13 | 2.6 | 1.31 | -28 | up this team and people are |
| 38 | 1010, 589 | 252 | -0.01 | 1.6 | 1.32 | -25 | going to follow me as a leader. |
| 39 | 1031, 588 | 250 | +0.03 | 4.1 | 2.45 | -24 | Like you have to have ego. |
| 40 | 1018, 588 | 252 | -0.09 | 2.1 | 2.11 | -31 | You have to understand |
| 41 | 1014, 591 | 249 | -0.12 | 1.8 | 0.55 | -29 | that you're great at |
| 42 | 1015, 585 | 253 | -0.10 | 1.7 | 0.40 | -58 | that. |
| 43 | 1021, 589 | 257 | -0.07 | 0.8 | 0.35 | -55 | And so for |
| 44 | 1017, 581 | 254 | -0.00 | 1.6 | 0.35 | -25 | a real estate team to function |
| 45 | 1014, 584 | 250 | -0.02 | 2.1 | 0.54 | -37 | well, I |
| 46 | 1003, 600 | 255 | -0.03 | 1.4 | 1.11 | -42 | think that that |
| 47 | 999, 605 | 257 | -0.03 | 1.3 | 0.48 | -28 | ego has |
| 48 | 1000, 603 | 255 | -0.03 | 1.4 | 0.29 | -57 | to |
| 49 | 1026, 579 | 254 | -0.15 | 2.7 | 1.71 | -30 | be transformed into a |
| 50 | 1037, 591 | 259 | -0.20 | 1.9 | 0.43 | -44 | blueprint. |
| 51 | 1036, 592 | 261 | -0.13 | 2.0 | 0.44 | -78 | And |
| 52 | 1028, 563 | 252 | +0.06 | 3.0 | 2.72 | -27 | this is reflective now |
| 53 | 999, 557 | 245 | +0.02 | 3.2 | 1.02 | -27 | more than it is |
| 54 | 995, 577 | 252 | -0.03 | 1.8 | 0.35 | -30 | ever before. |
| 55 | 999, 578 | 249 | +0.05 | 2.0 | 0.52 | -40 | It is reflective |
| 56 | 1007, 581 | 252 | +0.13 | 2.0 | 0.95 | -28 | now, but |
| 57 | 1011, 583 | 256 | +0.12 | 2.9 | 0.55 | -33 | it is reflective now more than it is ever before. Because this is |
| 58 | 1028, 586 | 253 | +0.14 | 2.9 | 1.01 | -26 | wartime. This is |
| 59 | 1026, 589 | 256 | +0.01 | 2.4 | 0.62 | -26 | not peacetime. This is |
| 60 | 1028, 595 | 256 | -0.00 | 1.4 | 0.47 | -34 | wartime and |
| 61 | 1027, 595 | 254 | -0.02 | 1.4 | 1.14 | -28 | a blueprint and |
| 62 | 1024, 591 | 252 | -0.02 | 2.8 | 1.32 | -29 | directives are necessary. |
| 63 | 1024, 589 | 252 | -0.01 | 1.6 | 0.34 | -46 |  |
| 64 | 1038, 584 | 259 | +0.22 | 2.4 | 1.15 | -69 | If somebody |
| 65 | 1019, 590 | 256 | +0.16 | 2.7 | 0.73 | -23 | has |
| 66 | 1003, 590 | 255 | +0.05 | 2.2 | 0.82 | -42 | the audacious |
| 67 | 1016, 541 | 253 | -0.01 | 3.7 | 2.43 | -36 | ego |
| 68 | 1021, 585 | 251 | -0.07 | 1.6 | 2.47 | -34 | to |
| 69 | 1027, 592 | 256 | -0.06 | 2.1 | 1.65 | -24 | jump into leading a real |
| 70 | 1028, 593 | 257 | -0.07 | 1.5 | 0.44 | -36 | estate team, the |
| 71 | 1028, 588 | 255 | -0.05 | 1.6 | 1.52 | -47 | only way |
| 72 | 1040, 590 | 252 | +0.04 | 5.0 | 2.10 | -27 | I can count |
| 73 | 1064, 610 | 256 | +0.04 | 4.0 | 1.60 | -29 | on its success today |
| 74 | 1021, 612 | 259 | -0.03 | 1.0 | 0.56 | -42 | is if |
| 75 | 1030, 611 | 251 | +0.05 | 2.8 | 1.76 | -25 | there is a clear blueprint |
| 76 | 1019, 601 | 251 | +0.06 | 1.5 | 0.66 | -30 | for success. |
| 77 | 1017, 606 | 251 | +0.05 | 1.1 | 0.27 | -77 |  |
| 78 | 1014, 607 | 253 | +0.05 | 1.3 | 1.34 | -67 | Everybody shows |
| 79 | 1007, 611 | 254 | +0.01 | 1.3 | 0.85 | -25 | up. I have a, I |
| 80 | 1019, 580 | 252 | +0.19 | 5.3 | 2.10 | -27 | have a buddy named Matt Miali and |
| 81 | 1039, 590 | 250 | +0.15 | 3.4 | 1.76 | -33 | he runs this incredible |
| 82 | 1004, 590 | 250 | -0.04 | 2.8 | 3.22 | -30 | team out of Connecticut, |
| 83 | 1026, 586 | 256 | -0.04 | 3.2 | 2.53 | -37 | makes great |
| 84 | 1009, 582 | 252 | -0.03 | 1.9 | 1.90 | -24 | money, high per |
| 85 | 1014, 584 | 252 | +0.04 | 3.4 | 1.77 | -26 | agent productivity. |
| 86 | 1017, 585 | 252 | +0.05 | 2.1 | 1.81 | -27 | He has a team |
| 87 | 1008, 562 | 242 | -0.03 | 2.4 | 1.52 | -34 | that most people should be |
| 88 | 1036, 550 | 249 | -0.10 | 3.2 | 2.08 | -39 | envious of. |
| 89 | 1030, 588 | 254 | -0.12 | 1.2 | 0.75 | -64 | And I |
| 90 | 1013, 584 | 257 | +0.11 | 2.4 | 2.40 | -21 | brought him into my mastermind |
| 91 | 1001, 596 | 254 | +0.04 | 1.4 | 0.36 | -27 | recently. |
| 92 | 997, 595 | 257 | -0.11 | 2.4 | 0.46 | -30 | And I'm like, Hey, what's |
| 93 | 1006, 593 | 257 | +0.01 | 2.4 | 0.90 | -29 | the secret to your success? |
| 94 | 1022, 593 | 251 | -0.06 | 1.8 | 0.70 | -32 | And he's like, Eric, this is |
| 95 | 1043, 592 | 254 | +0.12 | 3.2 | 0.86 | -27 | going to be the most boring |
| 96 | 1012, 580 | 250 | +0.05 | 2.3 | 0.51 | -44 |  |
| 97 | 1005, 589 | 250 | -0.01 | 1.7 | 0.38 | -39 | conversation that |
| 98 | 1005, 595 | 254 | -0.04 | 1.8 | 0.34 | -32 | you've had. He's like, |
| 99 | 1004, 598 | 256 | -0.10 | 2.1 | 2.16 | -33 | number one, everybody agrees |
| 100 | 1006, 593 | 259 | -0.02 | 2.3 | 1.87 | -28 | to show up. |
| 101 | 1007, 595 | 260 | -0.06 | 1.1 | 0.31 | -79 | Like, |
| 102 | 1007, 600 | 259 | -0.05 | 1.4 | 0.31 | -41 | what do you mean? It's like, Hey, |
| 103 | 1003, 597 | 253 | -0.05 | 1.8 | 0.37 | -32 | everybody shows up |
| 104 | 1006, 594 | 252 | -0.07 | 1.9 | 0.21 | -27 | for every meeting. And if |
| 105 | 1009, 584 | 256 | +0.05 | 1.5 | 0.30 | -27 | somebody is not there, every |
| 106 | 1009, 580 | 251 | +0.06 | 1.8 | 0.46 | -29 | 25 people |
| 107 | 1005, 587 | 252 | -0.05 | 2.1 | 0.47 | -39 | on the team text |
| 108 | 1005, 591 | 257 | -0.09 | 1.9 | 0.39 | -24 | that person to say, Hey, |
| 109 | 1007, 604 | 258 | -0.05 | 1.6 | 0.30 | -18 | are you alive? Are you still |
| 110 | 1011, 602 | 257 | -0.05 | 1.2 | 0.21 | -25 | in real estate? Like |
| 111 | 1011, 608 | 258 | -0.05 | 1.1 | 0.44 | -49 | they just have |
| 112 | 1012, 599 | 252 | -0.02 | 2.2 | 1.76 | -23 | this accountability where everybody |
| 113 | 1016, 595 | 251 | -0.01 | 1.5 | 0.47 | -27 | shows up. |
| 114 | 1024, 590 | 257 | -0.00 | 1.7 | 0.43 | -57 | That's a blueprint, |
| 115 | 1018, 589 | 255 | -0.03 | 2.3 | 0.64 | -41 | right? That's a plan |
| 116 | 1016, 595 | 249 | -0.03 | 2.6 | 1.77 | -26 | that everybody adheres to. |
| 117 | 1022, 593 | 253 | +0.01 | 2.8 | 1.89 | -53 | And then |
| 118 | 1007, 591 | 255 | +0.00 | 1.7 | 1.02 | -23 | everybody has |
| 119 | 1011, 594 | 259 | +0.01 | 1.2 | 0.24 | -21 | X |
| 120 | 1009, 591 | 255 | -0.03 | 1.7 | 0.41 | -29 | number of conversations per |
| 121 | 1013, 598 | 256 | -0.03 | 1.1 | 0.36 | -39 | week, right? |
| 122 | 1009, 609 | 251 | -0.04 | 1.6 | 1.94 | -28 | They agree that they're going to have X |
| 123 | 1018, 594 | 256 | -0.00 | 3.1 | 2.37 | -31 | number of conversations per week. |
| 124 | 1004, 600 | 255 | -0.08 | 1.4 | 0.37 | -48 | And then they're |
| 125 | 1010, 599 | 257 | -0.00 | 1.7 | 0.39 | -25 | going to add friends to their |
| 126 | 1006, 602 | 256 | -0.01 | 1.3 | 0.27 | -46 | database. |
| 127 | 1017, 609 | 259 | -0.02 | 3.6 | 2.20 | -47 | And that's really about |
| 128 | 1005, 601 | 265 | -0.01 | 1.9 | 0.84 | -47 | it. |
| 129 | 1011, 601 | 261 | -0.03 | 1.7 | 1.21 | -37 | They're just doing simple |
| 130 | 1017, 588 | 261 | +0.01 | 1.7 | 1.01 | -33 | things |
| 131 | 1105, 591 | 253 | +0.37 | 6.5 | 2.18 | -51 | on |
| 132 | 1053, 595 | 256 | +0.15 | 7.8 | 2.38 | -34 | repeat. |
| 133 | 999, 602 | 256 | -0.02 | 1.6 | 1.01 | -40 | And if they don't, |
| 134 | 998, 603 | 256 | -0.04 | 1.1 | 0.29 | -30 | then they get some attention. |
| 135 | 1000, 609 | 258 | -0.02 | 0.8 | 0.21 | -52 | And |
| 136 | 1000, 607 | 259 | -0.10 | 1.1 | 0.34 | -36 | then they're told, |
| 137 | 1015, 601 | 264 | -0.24 | 2.8 | 1.57 | -29 | Hey, this is what you're worth. |
| 138 | 1060, 590 | 268 | -0.20 | 2.0 | 0.91 | -33 | And this is what it takes to be on |
| 139 | 1064, 595 | 255 | -0.05 | 1.6 | 0.82 | -38 | the team. And this |
| 140 | 1054, 598 | 259 | -0.08 | 2.0 | 0.60 | -26 | is how you make your six figures. |
| 141 | 1056, 595 | 259 | -0.08 | 2.6 | 0.70 | -30 | And this is what you need |
| 142 | 1020, 581 | 249 | +0.01 | 3.1 | 2.10 | -29 | to do. This is the blueprint. |
| 143 | 1019, 581 | 253 | +0.06 | 1.9 | 1.48 | -66 |  |
| 144 | 1009, 596 | 255 | -0.04 | 2.1 | 0.43 | -42 | It's not a suggestion. |
| 145 | 1002, 608 | 252 | +0.02 | 1.6 | 0.40 | -26 | It's a, you |
| 146 | 1009, 602 | 255 | +0.05 | 1.9 | 0.34 | -27 | have to do this. And they |
| 147 | 1003, 587 | 250 | +0.03 | 3.3 | 1.89 | -30 | didn't overcomplicate the blueprint. |
| 148 | 1007, 584 | 253 | +0.06 | 1.5 | 0.56 | -59 |  |
| 149 | 1008, 586 | 247 | -0.04 | 1.3 | 0.50 | -51 | So to the question |
| 150 | 1016, 589 | 252 | +0.01 | 1.7 | 0.51 | -24 | again, of |
| 151 | 1022, 590 | 256 | +0.03 | 2.7 | 0.54 | -24 | what makes a real estate |
| 152 | 1014, 589 | 251 | +0.04 | 2.0 | 0.39 | -32 | team actually function |
| 153 | 1011, 587 | 251 | +0.03 | 1.8 | 0.48 | -44 | well |
| 154 | 1004, 597 | 248 | +0.01 | 1.4 | 1.75 | -65 | is it takes |
| 155 | 1000, 604 | 241 | -0.05 | 0.8 | 0.40 | -53 | an egotistical |
| 156 | 1002, 594 | 243 | -0.04 | 1.6 | 0.79 | -34 | agent |
| 157 | 1001, 576 | 241 | +0.03 | 2.4 | 0.33 | -36 | to start |
| 158 | 1009, 587 | 250 | -0.01 | 1.9 | 0.41 | -39 | the team, believing |
| 159 | 1010, 586 | 246 | +0.01 | 1.5 | 0.34 | -46 | that they |
| 160 | 1017, 581 | 250 | +0.09 | 1.6 | 0.41 | -52 | can help. |
| 161 | 1009, 583 | 246 | +0.08 | 1.3 | 0.35 | -61 | And then |
| 162 | 995, 556 | 244 | -0.01 | 1.9 | 0.35 | -26 | instead of them |
| 163 | 991, 554 | 246 | -0.06 | 1.7 | 1.67 | -29 | saying, just watch me and |
| 164 | 988, 562 | 243 | -0.11 | 2.2 | 1.01 | -29 | do what I do, |
| 165 | 989, 568 | 247 | -0.05 | 0.6 | 0.51 | -66 | which |
| 166 | 991, 573 | 247 | -0.05 | 2.1 | 2.04 | -25 | is how I started my |
| 167 | 1014, 582 | 248 | +0.05 | 2.7 | 1.51 | -27 | real estate team, and it didn't |
| 168 | 1021, 580 | 251 | +0.01 | 1.6 | 0.59 | -35 | work out well. instead |
| 169 | 1021, 581 | 249 | +0.03 | 1.9 | 0.29 | -68 |  |
| 170 | 1014, 578 | 245 | +0.02 | 1.9 | 1.78 | -36 | of saying, watch |
| 171 | 999, 589 | 249 | -0.08 | 2.3 | 1.02 | -22 | me and do what I do, you |
| 172 | 1002, 585 | 247 | +0.04 | 2.5 | 1.46 | -26 | instead have an exact |
| 173 | 1009, 585 | 247 | +0.15 | 2.8 | 1.05 | -31 | blueprint for |
| 174 | 1002, 590 | 245 | +0.09 | 2.7 | 1.45 | -32 | agents to follow |
| 175 | 1004, 590 | 248 | +0.08 | 3.1 | 0.34 | -35 | every day. And |
| 176 | 1008, 594 | 251 | +0.04 | 2.3 | 2.13 | -27 | that's how I think |
| 177 | 1010, 590 | 238 | -0.03 | 1.4 | 0.35 | -31 | a real estate team is successful. |
| 178 | 1007, 595 | 237 | -0.06 | 1.4 | 1.27 | -69 |  |
| 179 | — | — | — | — | 0.76 | -120 | (outro card) |
| 180 | — | — | — | — | 0.10 | -120 | (outro card) |
| 181 | — | — | — | — | 0.00 | -120 | (outro card) |
| 182 | — | — | — | — | 0.00 | -120 | (outro card) |
| 183 | — | — | — | — | 4.24 | -120 | (outro card) |