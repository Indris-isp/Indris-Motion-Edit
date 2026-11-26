# Music-bed profile: sub-100 Hz pulse (tempo, regularity, kick density), spectral balance and dynamics.
import sys, wave, numpy as np
def load(p, t0=0, t1=None):
    w = wave.open(p); sr = w.getframerate(); a = np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(np.float32) / 32768
    return a[int(t0 * sr): int(t1 * sr) if t1 else None], sr
def lowband_env(a, sr, fc=100, hop=256):
    # crude low-pass via FFT mask in blocks
    n = 1 << int(np.ceil(np.log2(len(a)))); A = np.fft.rfft(a, n); f = np.fft.rfftfreq(n, 1 / sr)
    lo = np.fft.irfft(A * (f < fc), n)[:len(a)]
    e = np.sqrt(np.convolve(lo ** 2, np.ones(hop) / hop, "same")[::hop]); return e, sr / hop
def pulse(a, sr):
    e, fps = lowband_env(a, sr)
    d = np.maximum(0, np.diff(np.log(e + 1e-5))); d -= d.mean()
    ac = np.correlate(d, d, "full")[len(d) - 1:]; ac /= ac[0] + 1e-9
    lags = np.arange(len(ac)) / fps; m = (lags > 60 / 160) & (lags < 60 / 60)
    k = np.argmax(ac[m]); bpm = 60 / lags[m][k]; strength = ac[m][k]
    # half/double-time folding to 70-140
    while bpm < 70: bpm *= 2
    while bpm > 140: bpm /= 2
    return bpm, strength
def balance(a, sr):
    n = 1 << 15; segs = [a[i:i + n] for i in range(0, len(a) - n, n)] or [a]
    P = sum(np.abs(np.fft.rfft(s * np.hanning(len(s)))) ** 2 for s in segs); f = np.fft.rfftfreq(len(segs[0]), 1 / sr)
    tot = P.sum(); share = lambda lo, hi: P[(f >= lo) & (f < hi)].sum() / tot
    cen = (P * f).sum() / tot
    return share(20, 120), share(120, 400), share(400, 1500), share(1500, 5000), share(5000, 11000), cen
if __name__ == "__main__":
    a, sr = load(sys.argv[1], *[float(x) for x in sys.argv[2:4]]) if len(sys.argv) > 3 else load(sys.argv[1])
    print("pulse bpm/strength", [round(x, 2) for x in pulse(a, sr)])
    print("balance sub/low/mid/hi/air/centroid", [round(x, 3) for x in balance(a, sr)])
