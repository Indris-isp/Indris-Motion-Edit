"""Builds the master timeline from the voiceover clip durations.
Every scene boundary, animation cue, SFX and VO placement is derived from here,
so a new voice (or a re-recorded line) re-times the whole video automatically.
Run after vo.py:  python3 timeline.py  -> timeline.js (for the page) + out/timeline.json
"""
import json

D = json.load(open('out/vo/durations.json'))
vo = []           # (key, absolute start)
S = []            # scene [start, end]
cue = {}
t = 0.0

def say(key, at):
    vo.append((key, round(at, 3))); return at + D[key]

def scene(dur):
    global t
    S.append([round(t, 3), round(t + dur, 3)]); t += dur

# 1 HOOK
e = say('hook', t + .15); scene(max(1.5, e + .15 - t))
# 2 WHY pt.1 (watch)
st = t; e = say('why1', st + .08); scene(max(1.5, e + .1 - st))
cue['s2_conf'] = round(D['why1'] - .55, 3)          # "confused" is the last word
# 3 WHY pt.2 (crowd)
st = t; e = say('why2', st + .05); scene(max(1.4, e + .15 - st))
# 4 PROBLEM
st = t; e = say('prob', st + .05); scene(max(1.5, e + .15 - st))
# 5 COUNTER
st = t; e = say('count', st + .1); scene(max(1.0, e + .05 - st))
# 6 PAIN x3 — one clip every 1.25 s
st = t; starts = [st + .7 + i * 1.3 for i in range(3)]   # each hexagon builds ~0.9 s before its line
for i, a in enumerate(starts): e = say(f'pain{i+1}', a)
cue['s6_hex'] = [round(a - st - .9, 3) for a in starts]
scene(e + .4 - st)
# 7 ONE-WORD BEATS
st = t; starts = [st + .05 + i * .62 for i in range(3)]
for i, a in enumerate(starts): e = say(f'beat{i+1}', a)
cue['s7_words'] = [round(a - st - .05, 3) for a in starts]
scene(max(2.0, e + .2 - st))
# 8 CONTRAST
st = t; e = say('contrast', st + .1); scene(max(1.1, e + .1 - st))
# 9 BENEFITS
st = t; a = st + .3; pills = []
for k in ('b1', 'b2', 'b3', 'b4', 'b5', 'b6'):
    pills.append(round(a, 3)); e = say(k, a); a = e + .16
cue['s9_pills'] = pills
scene(e + .3 - st)
# 10 PUNCHLINE
st = t; e = say('set', st + .15)
cue['s10_set'] = [.15, round(D['set'] * .8 / 25, 4)]      # start, per-char
p = e + .3; cue['s10_punch'] = round(p - st, 3)
e = say('punch', p)
scene(e + .8 - st)
# 11 OUTRO
st = t; cue['s11_cta'] = .6
e = say('cta', st + .6); scene(max(2.2, e + .5 - st))

DUR = round(t, 3)
out = {'DUR': DUR, 'scenes': S, 'cue': cue, 'vo': vo, 'frames': int(round(DUR * 30))}
json.dump(out, open('out/timeline.json', 'w'), indent=1)
open('timeline.js', 'w').write('window.TL = ' + json.dumps(out) + ';\n')
print(f'duration {DUR}s, {out["frames"]} frames')
for i, (a, b) in enumerate(S): print(f'  scene {i+1:2d}  {a:6.2f} – {b:6.2f}')
