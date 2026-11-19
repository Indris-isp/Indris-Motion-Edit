"""Square version: sound design built from the user's Mixkit SFX library, placed from out/cues.json.
Usage: python3 audio.py  ->  out/audio.wav (48 kHz stereo)

The SFX files are not in git (the Mixkit licence doesn't allow sharing the raw files). Put them in
logo-reveal-square/sfx/<category>/<name>.wav, the same layout as the shared Drive folder
(boom, click, glitch, hit, pop, swish, typing, whoosh).

Approach, following the reference edit: few sounds, heavy low end on the key moments, silence in between.
Each sample is placed so its measured peak (PEAK below) lands exactly on the cue it belongs to."""
import json, subprocess, wave
import numpy as np

C = json.load(open('out/cues.json')); Q = C['CUES']
SR = 48000; N = int((C['DUR'] + 0.2) * SR)
mix = np.zeros((N, 2))

def load(name):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', f'sfx/{name}', '-ac', '2', '-ar', str(SR), '-f', 'f32le', '-'],
                         capture_output=True, check=True).stdout
    return np.frombuffer(raw, np.float32).reshape(-1, 2).astype(np.float64)

# where each sample's main hit is (seconds from the start of the file), measured from the files
PEAK = {
    'whoosh/2605_quick-air-woosh.wav': 0.24, 'boom/2299_short-bass-hit.wav': 0.08,
    'hit/3005_explainer-video-pops-whoosh-light-pop.wav': 0.02, 'pop/2364_hard-pop-click.wav': 0.04,
    'pop/2365_electric-pop.wav': 0.09, 'whoosh/1464_quick-swoosh-accent.wav': 0.11,
    'click/1120_modern-click-box-check.wav': 0.10, 'boom/2295_pulsating-bass-transition.wav': 0.24,
    'hit/2919_movie-trailer-whoosh-hit.wav': 3.16, 'boom/563_drum-deep-impact.wav': 0.16,
    'typing/2534_keyboard-key-presses.wav': 0.01, 'glitch/2951_digital-glitch-break.wav': 0.01,
    'swish/2633_sweeping-sparkle-presentation-intro.wav': 0.91,
}
cache = {}
def place(name, at, gain=1.0, pan=0.0, fade_out_at=None, fade=0.12):
    """Put sample `name` so its peak lands at time `at` (s). Optional fade-out ending at `fade_out_at`."""
    x = cache.setdefault(name, load(name)).copy()
    start = at - PEAK[name]
    if fade_out_at is not None:
        n_keep = int((fade_out_at - start) * SR); n_keep = max(0, min(len(x), n_keep))
        f = int(fade * SR); x = x[:n_keep]
        if n_keep > 0: x[max(0, n_keep - f):] *= np.linspace(1, 0, min(f, n_keep))[:, None]
    g = np.array([np.sqrt(1 - pan), np.sqrt(1 + pan)]) * gain
    i = int(round(start * SR)); a = max(0, -i); i = max(0, i); n = min(len(x) - a, N - i)
    if n > 0: mix[i:i + n] += x[a:a + n] * g

# --- 1. square drops in the middle and bounces right, dropping circles ---
place('whoosh/2605_quick-air-woosh.wav', Q['land1'] - 0.12, 0.45)
place('boom/2299_short-bass-hit.wav', Q['land1'], 0.50)
place('hit/3005_explainer-video-pops-whoosh-light-pop.wav', Q['land1'] + 0.03, 0.45, -0.3)     # circle tossed out
place('pop/2364_hard-pop-click.wav', Q['land1'] + 0.62, 0.30, -0.6)                            # it lands in its slot
place('boom/2299_short-bass-hit.wav', Q['land2'], 0.38, 0.2)
place('hit/3005_explainer-video-pops-whoosh-light-pop.wav', Q['land2'] + 0.03, 0.40, 0.1)
place('boom/2299_short-bass-hit.wav', Q['land3'], 0.28, 0.4)
place('pop/2364_hard-pop-click.wav', Q['land3'] + 0.01, 0.22, 0.0)
place('pop/2365_electric-pop.wav', Q['land3'] + 0.12, 0.30, 0.5)                               # square rounds into a circle

# --- 2. each shape spins fast and forms: swoosh + deep bass hit, soft click as it locks ---
for i, f0 in enumerate(Q['form']):
    pan = [-0.45, 0.0, 0.45][i]
    place('whoosh/1464_quick-swoosh-accent.wav', f0 + 0.06, 0.55, pan)
    place('boom/2299_short-bass-hit.wav', f0 + 0.03, 0.46, pan * 0.3)
    place('click/1120_modern-click-box-check.wav', f0 + 0.58, 0.45, pan)

# --- 3. fast spin into the logo: pulsating bass build, whoosh-hit into the reveal ---
reveal = Q['word']
place('boom/2295_pulsating-bass-transition.wav', Q['asm0'] + 0.05, 0.55, 0, fade_out_at=reveal + 0.02, fade=0.15)
place('hit/2919_movie-trailer-whoosh-hit.wav', reveal, 0.75)
place('boom/563_drum-deep-impact.wav', reveal, 1.25)

# --- 4. brand name counting in, subline, final sparkle ---
place('typing/2534_keyboard-key-presses.wav', reveal + 0.05, 0.32, -0.15)
place('glitch/2951_digital-glitch-break.wav', reveal + 0.02, 0.18, 0.15)
place('typing/2534_keyboard-key-presses.wav', Q['sub'] + 0.02, 0.18, 0.15)
end = Q['sub'] + Q['subStep'] * 22 + Q['subDur']
place('swish/2633_sweeping-sparkle-presentation-intro.wav', end, 0.30, 0.1)

# --- master: gentle soft-clip, peak-normalize, short fade at the very end ---
peak = np.abs(mix).max()
mix = np.tanh(mix / peak * 1.25) / np.tanh(1.25)
mix *= 0.89 / np.abs(mix).max()
mix = mix[:int(C['DUR'] * SR)]
mix[-int(0.25 * SR):] *= np.linspace(1, 0, int(0.25 * SR))[:, None]
with wave.open('out/audio.wav', 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((mix * 32767).astype('<i2').tobytes())
print('wrote out/audio.wav')
