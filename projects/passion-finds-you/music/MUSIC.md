# Background music (v8)

**Track:** Ludwig Göransson, "Can You Hear The Music" (Oppenheimer), from the "Premium bg song" Drive folder (your pick).
**Section:** 0:10.0–0:36.4 of the file, placed from 0:00 to 0:26.4.

The whole track is one long crescendo. 0:10–0:36 is the best voice bed: still sparse, a smooth 8 dB rise, no sudden hits
(steepest 0.1 s step 2.8 dB), and already bass-weighted (51% of energy below 120 Hz).

## Mix (default, 0 dB on the review page faders)
- -3 dB at 2.5 kHz to leave room for the voice; no bass boost needed.
- Bed about 18 dB under speech at the start, rising to about 12 dB under by "jump into the water" (75% of the track's own build kept).
- Ducked 3 dB while she speaks (60 ms attack, 450 ms release). 0.25 s fade-in, 0.6 s fade-out.
- Mix -15.8 LUFS, true peak -1.5 dBFS (peak-limited by the loudest syllables; stems stay linear so the faders stay exact).

## Adjusting the level
The review page has Music and Voice faders that play live with the video. "Save mix" stores the levels in the page;
the final render applies them as gains on `music_stem` and `voice_stem` (tools/stems.py output).
