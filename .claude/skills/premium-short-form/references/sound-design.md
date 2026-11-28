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

## Sources (client rule: use only the client's library)
The client heard the v2.2 mix, built from Mixkit MP3 previews that Claude picked, and called it sloppy. **Use only the client's SFX library**, the WAV masters in Drive folder **`1ogoXwqB9I2h5VPQdyBIO9XPVuKtQFC1J`** (link: https://drive.google.com/drive/folders/1ogoXwqB9I2h5VPQdyBIO9XPVuKtQFC1J). Don't use other libraries, previews or synthesized sounds. If a beat needs a sound the library lacks, leave it dry and say so, or ask the client for one.

Download each file with `https://drive.usercontent.google.com/download?id=<ID>&export=download&confirm=t` (IDs are case-sensitive). Everything lives in the subfolder `2_free_soundalikes_mixkit/`.

| Folder | File | Drive ID | Use it for |
|---|---|---|---|
| whoosh | 1461_short-wind-swoosh.wav | `10bXdjFNzMHGmQAizxdkIBqhjwX7Gr6Xj` | soft cuts back to the A-roll |
| whoosh | 1462_quick-swoosh.wav | `1gXDW1-GTBn5BW4vxCZ4-90mqePszbL16` | whip cuts, punch-ins |
| whoosh | 1464_quick-swoosh-accent.wav | `1SJRlSWDWt-Glorsi5LIe4awBLXzZXgm2` | caption or box sweeps, small accents |
| whoosh | 2605_quick-air-woosh.wav | `1dNMeJq2qBMxwOXl4QSfYng7MqSonZ6a9` | objects flying in (phone, ticket, paper) |
| swish | 2633_sweeping-sparkle-presentation-intro.wav | `1xORaF8n6rR_ffCf0uKrkXT64Bdlo03am` | entering a new idea world, a reveal with shine |
| swish | 3060_sparkle-hybrid-transition.wav | `1glj8dP_92rITeQnWF37pa78SZHG2d3vE` | a premium transition into a designed scene (coins, a bulb lighting) |
| hit | 2919_movie-trailer-whoosh-hit.wav | `1ro1l5YyX13VlaRSxnwhA7LKkz-sgqSFT` | the biggest reveal (giant keyword, roto text) |
| hit | 2900_movie-logo-intro-impact.wav | `12utxaSqcI22MFierI8aPbmEnrA2Zb3J5` | the hook's opening slam |
| hit | 2896_movie-intro-impact.wav | `1j22RpNRyepc_a7tljMHzspe8ySJfyQjz` | a big title or world reveal |
| hit | 3005_explainer-video-pops-whoosh-light-pop.wav | `100K9zhC4hBiEvHBcIpWtXAQky29A-nrD` | light keyword pops |
| boom | 563_drum-deep-impact.wav | `19VAYS8ji1qe05V0wsh7BnYKCCtUPpyIB` | a heavy emotional beat ("YEAH.", a hard truth) |
| boom | 2299_short-bass-hit.wav | `1hbp0_VxxD23HX_mTfagcg4Pf6WQ3WgNP` | punch-ins, label slaps, keyword slams |
| boom | 2301_quick-bass-switch.wav | `1_UrO8uXLqzMJkbxYteNCSAtYZwKcd_cm` | a switch of scene or mood |
| boom | 3144_undertone-bass-item.wav | `1568PTBjqyzypw_7xo0fuPEWJtqyQX_3J` | a sub undertone under a reveal |
| boom | 2295_pulsating-bass-transition.wav | `1nn0skbHIi-qoFVBr0BUp2pcw1gYRnEqz` | a riser or swell into the biggest reveal |
| pop | 2354_message-pop-alert.wav | `1nQmRgH52XG_V_BO0V5tKIu6tb4Hddq5H` | UI pop-ups, notifications, chips |
| pop | 2364_hard-pop-click.wav | `1aEq8Tf2pXzxoxEBJDXo1a67yN0QbKif5` | a keyword landing, a sticker on |
| pop | 2365_electric-pop.wav | `1MMMaG1tJlgr3dbsmYJ-c9BwTco1RpEuO` | neon or screen elements, a bulb lighting |
| click | 1109_select-click.wav | `1JiYSzfjLNHPQjFIAc97rKU3S6o2QblqI` | list items, selections |
| click | 1120_modern-click-box-check.wav | `1i865db14kbUYiAAbIWQGuodE2biqOrS_` | ticks, "PAID ✓", confirmations |
| click | 2585_on-or-off-light-switch-tap.wav | `1jEzwSuQmPqkRDWY6ydc-vkuIVXAvja9H` | a light or bulb switching on, a screen waking |
| glitch | 1040_glitch-data-noise.wav | `1mYE5Lf40gjNHsLThlkNhaTYode8wynwf` | glitch transitions, data or tech scenes |
| glitch | 2948_tech-device-glitch.wav | `1sHeGP0ZbiGIkFFv2fizlgtwtovPRKAZV` | a device or screen glitch |
| glitch | 2951_digital-glitch-break.wav | `1KwfxQgZmvhiLFLPXt0xMJKwX_FeAcMtZ` | a glitch cut |
| glitch | 3066_arcade-glitch-touch.wav | `12zpQ93zyihlV3Anlbp4hBVdVj7i9WIsw` | a light glitch accent |
| typing | 1390_hard-typing.wav | `1M2ZPfEpDJCKOQI9N-PIHKhW8nvmlPPcW` | typed text, a terminal or CRT |
| typing | 2534_keyboard-key-presses.wav | `1KkeKHyP8C82ZSeRZEZGs5gD1lQvPElwD` | keypad or keyboard presses (a payment terminal) |

## How to place them
- Download the library once into `audio/src/sfx/` (not in git) and keep the WAVs at full quality.
- Align whoosh and swish peaks to the cut frame, and start hits, booms, pops and clicks on the frame of the event.
- Choose by role from the table, and vary the whooshes so the same file never plays twice in a row.
- Keep SFX under the voice: whooshes about 13–18 dB under the speech RMS, pops and clicks 16–20 dB under, booms and hits 12–15 dB under. A boom never masks a stressed word.
- After mixing, listen at the cuts in context (render 1 s windows around each cue) before delivering.

The worked example is `edits/income-first/v2/audio/mix.py` (cue sheet, peak alignment, ducking, loudness). Its v2.2 cues use Mixkit previews, so swap them for this library before reusing it.
