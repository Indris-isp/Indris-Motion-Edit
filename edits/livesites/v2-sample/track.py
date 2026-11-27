"""Smooth the per-frame face track (face_track.json, YuNet) into a camera track (track.json).
Reference R8 (Ravan.ai ad) keeps the face dead-centre horizontally (cx 0.50) at all times and moves smoothly:
a dead zone ignores small head moves, then a wide gaussian smooths what is left, so the crop glides instead of jittering."""
import json, numpy as np
r = json.load(open('face_track.json'))
cx = np.array([x['cx'] for x in r]); cy = np.array([x['cy'] for x in r])
def deadzone(v, dz):
    out = v.copy(); cur = v[0]
    for i, x in enumerate(v):
        if abs(x - cur) > dz: cur = x - np.sign(x - cur) * dz
        out[i] = cur
    return out
def gauss(v, sig):
    k = np.exp(-0.5 * (np.arange(-3 * sig, 3 * sig + 1) / sig) ** 2); k /= k.sum()
    p = np.pad(v, 3 * sig, mode='edge'); return np.convolve(p, k, 'valid')
sx = gauss(deadzone(cx, 0.025), 9); sy = gauss(deadzone(cy, 0.02), 9)
json.dump([{'cx': round(float(a), 4), 'cy': round(float(b), 4)} for a, b in zip(sx, sy)], open('track.json', 'w'))
print('frames', len(sx), 'cx range', sx.min().round(3), sx.max().round(3), 'max step px', (np.abs(np.diff(sx)) * 1080).max().round(2))
open('track.js', 'w').write('window.TRACK=' + open('track.json').read() + ';')
