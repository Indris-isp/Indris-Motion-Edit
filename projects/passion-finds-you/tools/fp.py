import sys, glob, wave, numpy as np, os
REF, WAVDIR = sys.argv[1], sys.argv[2]
SR, N, HOP = 22050, 2048, 512
def load(p):
    w = wave.open(p); a = np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(np.float32) / 32768; return a
# mel filterbank
def mel(f): return 2595 * np.log10(1 + f / 700)
def imel(m): return 700 * (10 ** (m / 2595) - 1)
fr = np.fft.rfftfreq(N, 1 / SR); pts = imel(np.linspace(mel(40), mel(8000), 50))
FB = np.zeros((48, len(fr)), np.float32)
for i in range(48):
    l, c, r = pts[i], pts[i + 1], pts[i + 2]
    FB[i] = np.clip(np.minimum((fr - l) / (c - l), (r - fr) / (r - c)), 0, None)
win = np.hanning(N).astype(np.float32)
def feats(a):
    n = 1 + (len(a) - N) // HOP
    idx = np.arange(N)[None, :] + HOP * np.arange(n)[:, None]
    S = np.abs(np.fft.rfft(a[idx] * win, axis=1)) ** 2
    M = np.log(S @ FB.T + 1e-8)
    M -= M.mean(1, keepdims=True)                       # per-frame normalisation (loudness-independent)
    M /= (np.linalg.norm(M, axis=1, keepdims=True) + 1e-8)
    return M
ref = load(REF); R = feats(ref); fps = SR / HOP
def seg(t0, t1): return R[int(t0 * fps): int(t1 * fps)]
Q1, Q2 = seg(18.50, 19.95), seg(15.97, 16.85)
def best(F, Q):
    L = len(Q)
    if len(F) <= L: return -1, 0
    # score(t) = mean_i F[t+i].Q[i], computed band-wise with FFT correlation
    T = len(F) - L + 1; nfft = 1 << int(np.ceil(np.log2(len(F) + L)))
    acc = np.zeros(T)
    FF = np.fft.rfft(F, nfft, axis=0); QQ = np.fft.rfft(Q[::-1], nfft, axis=0)
    c = np.fft.irfft(FF * QQ, nfft, axis=0).sum(1)
    acc = c[L - 1: L - 1 + T] / L
    k = int(np.argmax(acc)); return float(acc[k]), k / fps
rows = []
for p in sorted(glob.glob(WAVDIR + "/*.wav")):
    a = load(p)
    if len(a) < SR * 5: continue
    F = feats(a)
    s1, o1 = best(F, Q1); s2, o2 = best(F, Q2)
    rows.append((s1 + s2, s1, o1, s2, o2, os.path.basename(p)[:-4]))
rows.sort(reverse=True)
print("rank  sum   endcard(score@t)    breath(score@t)    gap   track")
for i, (t, s1, o1, s2, o2, n) in enumerate(rows[:15]):
    print(f"{i+1:3d}  {t:.3f}  {s1:.3f}@{o1:7.2f}s   {s2:.3f}@{o2:7.2f}s  {o1-o2:6.2f}  {n}")
print("median sum", np.median([r[0] for r in rows]))
