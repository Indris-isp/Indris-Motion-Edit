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

SR, DUR = 48000, 19.0
CUTS = [2.5, 5.0, 8.0, 10.0, 13.0, 15.5]          # must match SC in motion.js
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
# 1  Meet / ISP Agency
cue('2900_movie-logo-intro-impact.wav', 0.00, -9, maxlen=2.4)                 # opening slam (low hit 1)
cue('2633_sweeping-sparkle-presentation-intro.wav', 1.00, -16, maxlen=1.5)    # oval sweeps around the name
# 2  brand logos
cue('1462_quick-swoosh.wav', CUTS[0], -13, 'peak')
for k, i in enumerate((0, 2, 4)):                                             # cards landing
    cue('3005_explainer-video-pops-whoosh-light-pop.wav', 2.5 + .2 + i * .1 + .12, -20 + k)
# 3  ISP centre + orbit
cue('3060_sparkle-hybrid-transition.wav', CUTS[1], -13, 'peak')
cue('2896_movie-intro-impact.wav', 5.02, -12, maxlen=2.0)                     # logo disc reveal (low hit 2)
cue('2605_quick-air-woosh.wav', 5.55, -18, 'peak')                            # icons fly out
cue('2354_message-pop-alert.wav', 5.62, -22)
cue('2354_message-pop-alert.wav', 5.98, -24)
# 4  Let's make your video better
cue('1461_short-wind-swoosh.wav', CUTS[2], -13, 'peak')
cue('2919_movie-trailer-whoosh-hit.wav', 8.85, -11, 'peak', maxlen=2.0)       # "better." lands (low hit 3)
cue('1464_quick-swoosh-accent.wav', 9.15, -20, 'peak')                        # underline
# 5  platform pairs
cue('2605_quick-air-woosh.wav', CUTS[3], -14, 'peak')
cue('2364_hard-pop-click.wav', 10.17, -20)                                    # Instagram
cue('2364_hard-pop-click.wav', 10.29, -22)                                    # YouTube
cue('1464_quick-swoosh-accent.wav', 11.5, -15, 'peak')                        # swap
cue('2364_hard-pop-click.wav', 11.73, -20)                                    # Facebook
cue('2364_hard-pop-click.wav', 11.85, -22)                                    # TikTok
# 6  all in one place
cue('1462_quick-swoosh.wav', CUTS[4], -13, 'peak')
cue('2605_quick-air-woosh.wav', 13.75, -19, 'peak')                           # icons fly into the box
cue('2354_message-pop-alert.wav', 13.85, -21)
cue('3005_explainer-video-pops-whoosh-light-pop.wav', 14.45, -18)             # "less pressure."
# 7  video is ready
cue('2633_sweeping-sparkle-presentation-intro.wav', CUTS[5] - .05, -15, maxlen=1.4)
cue('2534_keyboard-key-presses.wav', 15.98, -24, maxlen=1.35, fade=.3)        # "Editing…"
cue('1120_modern-click-box-check.wav', 17.40, -12)                            # check mark
cue('2299_short-bass-hit.wav', 17.40, -13)                                    # done (low hit 4)
cue('3005_explainer-video-pops-whoosh-light-pop.wav', 17.62, -20)             # "Video is ready."

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
