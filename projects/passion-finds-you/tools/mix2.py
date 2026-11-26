import sys, wave, numpy as np, json
D = sys.argv[1]; OUT = sys.argv[2]
SR = 48000
def rd(p):
    w = wave.open(p); a = np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(np.float32) / 32768
    return a.reshape(-1, w.getnchannels())
v = rd(f"{D}/voice.wav"); m = rd(f"{D}/music_seg_eq.wav")
n = len(v); off = int(0.4 * SR)                         # seg starts at 79.6 s; the picked window starts at 80.0 s
m = m[off:off + n]; m = np.pad(m, ((0, n - len(m)), (0, 0)))
db = lambda x: 20 * np.log10(x + 1e-9)
def env(x, win):                                         # RMS envelope, per-sample (block-hold)
    k = int(win * SR); e = np.sqrt(np.convolve((x ** 2).mean(1), np.ones(k) / k, "same")); return e
ve = env(v, 0.02)
speech_rms = np.sqrt(np.mean(v[ve > 10 ** ((db(np.max(ve)) - 30) / 20)] ** 2))
active = (db(ve) > db(speech_rms) - 18).astype(np.float32)
# smooth the duck gate: fast attack (60 ms), slow release (450 ms)
g = np.zeros(n, np.float32); a_up = 1 - np.exp(-1 / (0.06 * SR)); a_dn = 1 - np.exp(-1 / (0.45 * SR)); s = 0.0
for i in range(0, n, 48):                               # 1 ms steps
    t = active[i]; s += (a_up if t > s else a_dn) * 48 * (t - s); s = min(1, max(0, s)); g[i:i + 48] = s
duck_db = -3.0 * g
# tame the track's own 13 dB swell to about half, so it grows like the reference (~6-7 dB)
me = env(m, 2.0); me_db = db(me); flat = -0.5 * (me_db - np.median(me_db))
# base level: averaged bed 13 dB under speech
bed_rms = np.sqrt(np.mean(m ** 2)); base = db(speech_rms) - 10 - db(bed_rms)
gain_db = base + flat + duck_db
gain = 10 ** (gain_db / 20)
fade_in = np.clip(np.arange(n) / (0.25 * SR), 0, 1); fade_out = np.clip((n - np.arange(n)) / (0.5 * SR), 0, 1)
mus = m * (gain * fade_in * fade_out)[:, None]
mix = v + mus
peak = np.max(np.abs(mix)); mix = mix / max(1.0, peak / 0.95)
w = wave.open(OUT, "wb"); w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((mix * 32767).astype(np.int16).tobytes()); w.close()
# report bed vs speech, like the reference measurement
def seg_db(x, a, b): return db(np.sqrt(np.mean(x[int(a * SR):int(b * SR)] ** 2)))
print(json.dumps({"speech_rms_db": round(float(db(speech_rms)), 1),
  "bed_under_speech_first_5s_db": round(float(seg_db(mus, 0.5, 5) - db(speech_rms)), 1),
  "bed_under_speech_last_5s_db": round(float(seg_db(mus, 21, 26) - db(speech_rms)), 1),
  "bed_rise_db": round(float(seg_db(mus, 21, 26) - seg_db(mus, 0.5, 5)), 1),
  "peak_before_norm": round(float(peak), 3)}))
