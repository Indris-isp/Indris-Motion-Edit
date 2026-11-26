"""Sound design for "Find income first" v2.2: voice + music bed + SFX, built from the reference analysis
(audio/sfx_analysis.json): in the 14 reference edits 85% of visual cuts carry a sound (whoosh on ~70% of cuts,
a low hit on ~30%, usually the big reveals), there are 1.3-3.3 smaller transients per second (pops on keyword
reveals, UI clicks, foley that matches what is on screen), and a music bed sits well under the voice.

    python3 audio/mix.py <voice.wav> <out.wav>

Inputs (not in git, see README): audio/src/bgm.wav (the client's track) and audio/src/sfx/<mixkit id>.mp3.
The voice is the face-tracked raw cut's audio, already trimmed to the edit.
"""
import os, subprocess, sys, numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
SR = 48000

# Music: "Succession" main title (client's Premium bg song folder). The theme's final hit lands on the last frame.
BGM = os.path.join(HERE, 'src/bgm.wav')
BGM_END = 77.39                 # last musical frame of the track (s)
BED_DB = -15.0                  # music RMS relative to the voice speech RMS before ducking (refs: bed 7-24 dB under, median ~11)
DUCK_DB = 6.0                   # extra dip while words are spoken

# Cue sheet (output seconds). align='peak' puts the loudest moment of the sound on the cue (whooshes land on the cut);
# align='start' starts it on the cue (hits, pops, foley). gain in dB relative to the voice's speech RMS.
W, S = 'peak', 'start'
CUES = [
    # hook: "and what MESSAGE would you give" -> orbit card
    (0.00, '772', S, -12), (0.50, '1464', W, -17), (0.56, '2364', S, -18),
    (1.36, '1492', W, -13), (2.55, '2356', S, -20),
    # clapper -> red carpet "ACTING?" (behind the actor) with camera flashes
    (3.06, '174', W, -14), (3.06, '1133', S, -20), (3.98, '2919', W, -12), (4.30, '1133', S, -22), (4.72, '1133', S, -23),
    # A-roll: "so my ADVICE", punch-in on "play this game"
    (5.17, '166', W, -18), (5.55, '3005', S, -17), (6.95, '772', S, -14), (6.95, '3115', W, -19), (8.19, '1464', W, -19),
    # 3D phone + coin rain, "Income first."
    (9.70, '1490', W, -12), (10.40, '1993', S, -14), (10.55, '2003', S, -16), (10.95, '1939', S, -17), (11.30, '3183', S, -18),
    (11.55, '2356', S, -17), (11.80, '1993', S, -19), (12.11, '2364', S, -16), (12.30, '2003', S, -20),
    # puzzle: pieces glide, lock on "way" + the bulb lights; tilt down; cheques slide in
    (13.19, '1481', W, -14), (13.35, '1471', S, -24), (14.86, '2858', S, -13), (14.90, '931', S, -21),
    (15.20, '166', W, -19), (16.00, '2380', S, -17), (16.13, '2384', S, -19), (16.27, '2380', S, -18), (16.40, '1530', S, -21),
    # real estate (low hit as the words rise), stock market CRT
    (17.33, '1492', W, -13), (17.40, '772', S, -15), (18.57, '174', W, -15), (18.62, '2568', S, -18), (19.25, '2841', S, -22),
    # cutting mat: paper slides in, highlighter, "Money in" label slaps on
    (19.96, '1468', W, -15), (20.02, '1530', S, -14), (21.38, '2383', S, -22), (22.42, '2383', S, -23), (23.74, '2182', S, -12), (23.74, '772', S, -18),
    # back to the A-roll: THEN / PURSUE THIS
    (24.95, '1490', W, -14), (25.55, '2180', S, -16),
    # punch-ins to "starving actors"
    (28.35, '3115', W, -20), (29.71, '772', S, -14), (29.71, '1464', W, -19),
    # lottery counter: neon hum, cash slides, keypad, PAID, ticket prints, flies to camera
    (31.61, '1492', W, -13), (31.61, '910', S, -30), (31.70, '1530', S, -16), (32.25, '2841', S, -20), (32.59, '1120', S, -15),
    (32.69, '1371', S, -18), (33.23, '166', W, -17), (33.65, '2364', S, -16),
    # YEAH. / "don't do that" box / family
    (34.39, '772', S, -13), (34.39, '3115', W, -18), (35.39, '1464', W, -19), (36.69, '1481', W, -14),
]
CUT_FADE = {'910': (31.61, 34.39)}          # sounds trimmed to a window (neon hum only under the lottery scene)


def load(path, mono=False):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', path, '-ac', '1' if mono else '2', '-ar', str(SR), '-f', 'f32le', '-'],
                         capture_output=True, check=True).stdout
    a = np.frombuffer(raw, np.float32)
    return a if mono else a.reshape(-1, 2)


def rms_env(x, win=0.05):
    m = x.mean(1) if x.ndim == 2 else x
    w = int(win * SR); e = np.sqrt(np.convolve(m * m, np.ones(w) / w, 'same'))
    return e


def main(voice_path, out_path):
    v = load(voice_path); n = len(v)
    env = rms_env(v, 0.03)
    speech = env > 10 ** (-38 / 20) * np.abs(v).max() / 0.5
    speech_rms = float(np.sqrt((v.mean(1)[speech] ** 2).mean()))
    ref = lambda db: speech_rms * 10 ** (db / 20)
    mix = v.copy()
    # music bed, ducked under speech with smooth attack/release
    if os.path.exists(BGM):
        b = load(BGM); start = int((BGM_END - n / SR) * SR)
        b = b[start:start + n]; b = np.pad(b, ((0, n - len(b)), (0, 0)))
        b = b * (ref(BED_DB) / (np.sqrt((b ** 2).mean()) + 1e-9))
        s = speech.astype(np.float32); k = int(0.25 * SR)
        s = np.convolve(s, np.hanning(k) / np.hanning(k).sum(), 'same')               # ~120 ms attack / release
        duck = 10 ** (-DUCK_DB * np.clip(s * 1.4, 0, 1) / 20)
        fade = np.clip(np.arange(n) / (0.12 * SR), 0, 1)                               # tiny fade-in so the first beat is clean
        mix += b * (duck * fade)[:, None]
    # SFX
    cache = {}
    for t, sid, align, db in CUES:
        if sid not in cache:
            x = load(os.path.join(HERE, f'src/sfx/{sid}.mp3'))
            cache[sid] = (x / (np.sqrt((x ** 2).mean(1)[rms_env(x, 0.03) > rms_env(x, 0.03).max() * 0.25].mean()) + 1e-9), int(rms_env(x, 0.04).argmax()))
        x, pk = cache[sid]
        i0 = int(t * SR) - (pk if align == W else 0)
        if sid in CUT_FADE:
            a, b2 = CUT_FADE[sid]; L = int((b2 - a) * SR); x = x[:L] * np.clip(np.minimum(np.arange(len(x[:L])), len(x[:L]) - np.arange(len(x[:L]))) / (0.15 * SR), 0, 1)[:, None]
        j0, j1 = max(0, i0), min(n, i0 + len(x))
        if j1 > j0: mix[j0:j1] += x[j0 - i0:j1 - i0] * ref(db)
    # gentle bus limiter (soft clip) before loudness normalisation
    mix = np.tanh(mix / 0.9) * 0.9
    tmp = out_path + '.raw.wav'
    import soundfile as sf
    sf.write(tmp, mix, SR, subtype='FLOAT')
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', tmp, '-af', 'loudnorm=I=-14:TP=-1.0:LRA=9', '-ar', str(SR), out_path], check=True)
    os.remove(tmp)
    print('mixed', out_path)


if __name__ == '__main__':
    main(*sys.argv[1:3])
