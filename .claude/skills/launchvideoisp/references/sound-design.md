# Sound design

Half of "premium" is sound. Every visual arrival gets a sound, and the music changes mood at the turn.

## Music bed (`audio.py`, synthesized, `TIMELINE.BPM`, default 128)

| Section | When | Content |
|---|---|---|
| A: tension | 0 → start of `turn` | Am/F pad filtered dark, half-time kick, ticking hats, low bass pulses |
| B: break | `turn` | Kick drops out. Sub boom, a high shimmer pad, and a riser into the reveal. |
| C: groove | reveal (shot after `turn`) → `cta` | Fmaj7–G–Am7–C, four-on-the-floor kick, claps on 2 and 4, 16th hats, 8th-note bass and plucks, pad and bass ducked by the kick |
| D: outro | `cta` → end | A big hit, a sustained C chord, a falling pluck motif, and a fade-out over the last 0.8 s |

The synthesized bed is decent but not studio quality. For client work, ask for a licensed track and drop it in `assets/music.wav|mp3|m4a`. `build.sh` mixes it with the synthesized SFX, trims it to length, fades it out and loudness-normalizes to −14 LUFS. Pick tracks around 100–130 BPM with a clear drop. If needed, move the `turn` shot so the reveal lands on the drop.

## SFX kinds (per-shot `sfx: [[authoredTime, kind]]`)

| Kind | Sound | Use on |
|---|---|---|
| `whoosh` / `whoosh_s` | Band-swept noise, 0.42 s / 0.3 s | Every whip, zoom or up cut (place at `len − 0.2`, so it sticks to the cut); `_s` for element flights |
| `pop`, `popsN` | Pitched blip; N of them at 75 ms spacing | Badges, pills and staggered cards |
| `tick`, `ticksN` | Short click; N decelerating | Digit roll, count-ups |
| `typeN` | N keyboard clicks | Typing headlines and messages (N ≈ characters ÷ 2) |
| `click` | Mouse click with a low thump | Hand or button presses |
| `stamp` | Thump with a noise burst | The red pain pill |
| `down` | Falling tone with filtered noise | Dip to black |
| `boom` | Sub drop | Start of the dark turn |
| `shimmer` | Bell cluster | Light flare drawing |
| `riser` | Rising noise and tone, **auto-length up to the next `hit`** | Before the reveal and before the CTA |
| `hit` / `hit_s` | Kick with crash and sub / a smaller one | The reveal, the CTA, the circle reveal |
| `swoop` | Rising sine | Something sent or launched |
| `swell` | Soft noise swell | The very first frame |
| `reel` / `reelN` | Ticks where the reel crosses each number | Slot reel |

Timing rules:
- Cues are written in the shot's *authored* time and are rescaled by the shot's speed.
- Cues within 0.3 s of the authored `len` stick to the cut, even when the shot is trimmed.
- Cues that fall inside a trimmed tail are dropped.

## Mix targets

- Final output is −14 LUFS integrated with −1 dBTP (done in `build.sh`).
- Typing and ticks sit quietly under the music. Hits and whooshes are the loudest events.
- Check with `ffmpeg -i out/launch.mp4 -af ebur128 -f null -`.
