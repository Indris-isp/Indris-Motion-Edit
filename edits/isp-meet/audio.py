"""Soundtrack: SFX from the client's library only (no synthesized or third-party sounds), placed from a cue sheet.
Optional music: put the client-approved track at audio/src/music.(wav|mp3|m4a); it is placed so its ending lands
on the last frame. Without it the mix is SFX only.

  1. Download the library WAVs into audio/src/sfx/ (file names and Drive IDs:
     .claude/skills/premium-short-form/references/sound-design.md)
  2. python3 audio.py   ->  out/audio.wav (48 kHz stereo)
Needs numpy and ffmpeg.
"""
import glob, os, subprocess, wave
import numpy as np

SR, DUR = 48000, 10.8
CUTS = [1.8, 2.55, 3.75, 4.9, 7.15, 8.4]           # scene cuts in motion.js (SEG)
SWITCH = [5.46, 6.02, 6.58]                        # platform colour switches in scene 5
SFX_DIR = 'audio/src/sfx'
N = int(DUR * SR)

def load(path):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', path, '-f', 'f32le', '-ac', '2', '-ar', str(SR), '-'],
                         capture_output=True, check=True).stdout
    return np.frombuffer(raw, '<f4').reshape(-1, 2).astype(np.float64)

def peak_at(x):
    """time (s) of the loudest moment, on a 10 ms smoothed envelope"""
    e = np.convolve(np.abs(x).mean(1), np.ones(480) / 480, 'same')
    return int(np.argmax(e))

mix = np.zeros((N, 2))
def cue(name, t, db, align='start', maxlen=None, fade=.25):
    """align='start': the file starts on t (hits, pops, clicks); align='peak': its loudest moment lands on t (whooshes)."""
    x = load(os.path.join(SFX_DIR, name))
    x = x / (np.abs(x).max() + 1e-9)
    if maxlen:
        n = int(maxlen * SR)
        if len(x) > n:
            x = x[:n].copy(); f = int(fade * SR); x[-f:] *= np.linspace(1, 0, f)[:, None]
    i = int(t * SR) - (peak_at(x) if align == 'peak' else 0)
    if i < 0: x = x[-i:]; i = 0
    n = min(len(x), N - i)
    mix[i:i + n] += x[:n] * 10 ** (db / 20)

# ---------------- cue sheet (dB relative to each file's own peak) ----------------
# 1  Meet — letters pop in, then fly together
cue('2364_hard-pop-click.wav', 0.62, -21)                                     # e
cue('3005_explainer-video-pops-whoosh-light-pop.wav', 0.74, -21)              # e
cue('2364_hard-pop-click.wav', 0.86, -23)                                     # t
cue('2605_quick-air-woosh.wav', 1.24, -17, 'peak')                            # letters converge into "Meet"
# 2  ISP logo — glitch cut, logo impact, tile pops out of the mark
cue('2951_digital-glitch-break.wav', CUTS[0], -15, 'peak')
cue('2900_movie-logo-intro-impact.wav', 1.82, -10, maxlen=1.9)                # logo reveal (low hit 1)
cue('2354_message-pop-alert.wav', 2.44, -19)                                  # green tile appears
# 3  orbit
cue('3060_sparkle-hybrid-transition.wav', CUTS[1], -14, 'peak')
cue('2605_quick-air-woosh.wav', 2.74, -20, 'peak')                            # platforms fly out
cue('1464_quick-swoosh-accent.wav', 3.1, -21, 'peak')                         # step round
cue('1461_short-wind-swoosh.wav', 3.42, -22, 'peak')                          # step round
# 4  Let's make your video better
cue('1462_quick-swoosh.wav', CUTS[2], -14, 'peak')                            # flash to light
for k, w in enumerate((3.8, 3.93, 4.05, 4.17)):
    cue('1109_select-click.wav', w, -24 + (k % 2))                            # words
cue('2364_hard-pop-click.wav', 4.31, -18)                                     # "better"
# 5  platforms
cue('2919_movie-trailer-whoosh-hit.wav', CUTS[3], -12, 'peak', maxlen=1.6)    # cut to colour (low hit 2)
for k, w in enumerate(SWITCH):
    cue('2301_quick-bass-switch.wav', w, -17)                                 # colour switch
    cue('3005_explainer-video-pops-whoosh-light-pop.wav', w + .02, -21)       # new platform pops
# 6  ISP Agency ✓ / All in one place, less pressure
cue('1461_short-wind-swoosh.wav', CUTS[4], -14, 'peak')
cue('1120_modern-click-box-check.wav', 7.2, -15)                              # ✓ tag
cue('1109_select-click.wav', 7.24, -24)
cue('1109_select-click.wav', 7.7, -24)
# 7  Video is ready
cue('2633_sweeping-sparkle-presentation-intro.wav', CUTS[5] - .04, -14, maxlen=1.6)
cue('2299_short-bass-hit.wav', CUTS[5] + .02, -13)                            # ready (low hit 3)
for k, w in enumerate((8.46, 8.56, 8.66, 8.78)):                              # confetti
    cue(('3005_explainer-video-pops-whoosh-light-pop.wav', '2364_hard-pop-click.wav')[k % 2], w, -21 - k)

# ---------------- optional music bed ----------------
music = sorted(glob.glob('audio/src/music.*'))
if music:
    m = load(music[0]); m = m / (np.abs(m).max() + 1e-9)
    m = m[-N:] if len(m) >= N else np.pad(m, ((N - len(m), 0), (0, 0)))        # ending lands on the last frame
    f = int(.4 * SR); m[:f] *= np.linspace(0, 1, f)[:, None]
    mix += m * 10 ** (-6 / 20)

f = int(.3 * SR); mix[-f:] *= np.linspace(1, 0, f)[:, None]
os.makedirs('out', exist_ok=True)
tmp = 'out/_premaster.wav'
with wave.open(tmp, 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((np.clip(mix * (.89 / (np.abs(mix).max() + 1e-9)), -1, 1) * 32767).astype('<i2').tobytes())
if music:   # full mix: -14 LUFS, -1 dBTP
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', tmp, '-af', 'loudnorm=I=-14:TP=-1:LRA=11', '-ar', str(SR), 'out/audio.wav'], check=True)
else:       # SFX only: peak-normalise to -1 dBFS (pushing sparse SFX to -14 LUFS would over-compress them)
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', tmp, '-c', 'copy', 'out/audio.wav'], check=True)
os.remove(tmp)
print('wrote out/audio.wav', '(SFX + music)' if music else '(SFX only, no music track in audio/src/)')
