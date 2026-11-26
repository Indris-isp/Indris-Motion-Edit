# Sound design (measured from the reference edits)

Measured on 2026-11-26 with `edits/income-first/v2/audio/sfx_analysis.py` over 14 of the 15 reference videos. V09 is music only. The raw per-cut numbers are in `edits/income-first/v2/audio/sfx_analysis.json`.

## What the references do
| Measure | Value |
|---|---|
| Visual cuts with a sound on them | **184 / 213 (86%)** |
| Whoosh (a 3–10 kHz air sweep peaking on the cut) | 152 cuts (71%). Every video uses them. |
| Low hit (a 25–120 Hz thump on the frame of the cut) | 64 cuts (30%), mostly on big reveals: a keyword landing, a new world |
| Riser into a cut | 22 (10%), before the biggest reveals only |
| Small transients off the cuts (pops, clicks, foley) | median **1.7 per second** (1.3–3.3) |
| Music bed under the voice | always present. It is about 7–24 dB under the voice in word gaps (median about 11) and dips further under speech. |

## Rules
1. **A sound on every designed cut.** The whoosh peaks *on* the cut frame. Align the loudest moment of the file, not its start.
2. **A low hit on the 3–5 biggest reveals**, such as a keyword slam, a new 3D world or a punch-in on the emotional word. More than that and they stop landing.
3. **Foley for what is on screen.** Coins clink when they land, paper slides, labels slap, terminals beep, printers print, a neon sign hums. This is most of the "1.7 per second".
4. **A pop or click when a keyword reveals.** Keep it quiet: it sits 16–20 dB under the voice.
5. **Music:** an instrumental with a steady pulse that fits the topic (money or ambition: the Succession main title; tension: Black Vertigo). Place it so that a musical ending lands on the last frame, by working backwards from the track's final hit. Keep it about 15 dB under the voice in gaps and duck it 6 dB more under words.
6. **Master** to −14 LUFS integrated, true peak −1 dBTP.

## Sources
- **SFX:** the Mixkit free sound effects (Mixkit Free License). Download from `https://assets.mixkit.co/active_storage/sfx/<id>/<id>-preview.mp3`. These ids work well:
  - whooshes: 1492, 1490, 1481, 1468, 174, 166, 3115, 1464
  - low hits: 772, 2919, 2180
  - pops: 3005, 2364, 2356
  - clicks: 1120, 2568, 1133
  - coins: 1993, 2003, 1939, 3183
  - paper: 1530, 2380, 2384, 2383
  - slap: 2182
  - printer: 1371
  - keypad: 2841
  - lock or snap: 2858
  - bell: 931
  - neon hum: 910
- **Music:** the client's Drive folder "BGM / Premium bg song".

The worked example is `edits/income-first/v2/audio/mix.py`. It has the cue sheet, alignment, ducking and loudness steps.
