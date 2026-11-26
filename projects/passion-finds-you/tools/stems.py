# Voice + ducked music stems; default mix = voice + music. Writes stems scaled so the mix is -14 LUFS.
import sys, wave, numpy as np, json, subprocess
D = sys.argv[1]; SR = 48000; BASE_UNDER = float(sys.argv[2]) if len(sys.argv) > 2 else 10.0
def rd(p):
    w = wave.open(p); a = np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(np.float32) / 32768; return a.reshape(-1, w.getnchannels())
def wr(p, a):
    w = wave.open(p, "wb"); w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((np.clip(a, -1, 1) * 32767).astype(np.int16).tobytes()); w.close()
db = lambda x: 20 * np.log10(x + 1e-9)
v = rd(f"{D}/voice.wav"); m = rd(f"{D}/music_seg_eq.wav"); n = len(v)
off = int(0.4 * SR); m = m[off:off + n]; m = np.pad(m, ((0, n - len(m)), (0, 0)))   # seg starts 9.6 s; window starts 10.0 s
env = lambda x, w: np.sqrt(np.convolve((x ** 2).mean(1), np.ones(int(w * SR)) / int(w * SR), "same"))
ve = env(v, 0.02); speech = np.sqrt(np.mean(v[ve > np.max(ve) * 10 ** (-30 / 20)] ** 2))
act = (db(ve) > db(speech) - 18).astype(np.float32)
g = np.zeros(n, np.float32); s = 0.0; au = 1 - np.exp(-48 / (0.06 * SR)); ad = 1 - np.exp(-48 / (0.45 * SR))
for i in range(0, n, 48): t = act[i]; s += (au if t > s else ad) * (t - s); g[i:i + 48] = s
me = db(env(m, 2.0)); flat = -0.25 * (me - np.median(me))          # keep most of this track's gentle 8 dB build
base = db(speech) - BASE_UNDER - db(np.sqrt(np.mean(m ** 2)))
gain = 10 ** ((base + flat - 3.0 * g) / 20)
fi = np.clip(np.arange(n) / (0.25 * SR), 0, 1); fo = np.clip((n - np.arange(n)) / (0.6 * SR), 0, 1)
mus = m * (gain * fi * fo)[:, None]
mix = v + mus
wr(f"{D}/_mix_raw.wav", mix)
out = subprocess.run(["ffmpeg", "-v", "info", "-i", f"{D}/_mix_raw.wav", "-af", "ebur128", "-f", "null", "-"], capture_output=True, text=True).stderr
I = float([l for l in out.splitlines() if l.strip().startswith("I:")][-1].split()[1])
k = 10 ** ((-14.0 - I) / 20)
peak = np.max(np.abs(mix * k))
if peak > 0.84: k *= 0.84 / peak                                     # keep true peak around -1.5 dBFS
wr(f"{D}/voice_stem.wav", v * k); wr(f"{D}/music_stem.wav", mus * k); wr(f"{D}/mix.wav", mix * k)
def seg(x, a, b): return db(np.sqrt(np.mean(x[int(a * SR):int(b * SR)] ** 2)))
print(json.dumps({"integrated_before": I, "gain_db": round(float(db(k)), 2), "peak_dbfs": round(float(db(peak if peak <= 0.84 else 0.84)), 1),
  "bed_vs_speech_start_db": round(float(seg(mus, 0.5, 5) - db(speech)), 1), "bed_vs_speech_end_db": round(float(seg(mus, 21, 26) - db(speech)), 1)}))
