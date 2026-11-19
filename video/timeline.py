"""Builds the master timeline from the voiceover clip durations and the script's pauses.
Every scene boundary, animation cue and VO placement is derived from here,
so a new voice (or a re-recorded line) re-times the whole video automatically.
Pauses come from the <break time> tags in the script (out/vo/breaks.json, written by vo.py).
Run after vo.py:  python3 timeline.py  -> timeline.js (for the page) + out/timeline.json
"""
import json

D = json.load(open('out/vo/durations.json'))
B = json.load(open('out/vo/breaks.json'))
vo, S, cue = [], [], {}
t, carry = 0.0, .15   # carry: the half of the previous line's pause that falls inside this scene

def scene(keys, lead=0, mind=1.4, tail=0):
    """Lines play back to back with their scripted pauses. The cut sits in the middle of the
    pause after the last line, so the pause is the same length as in the script."""
    global t, carry
    st = t; a = st + carry + lead
    for k in keys:
        vo.append((k, round(a, 3))); cue[k] = round(a - st, 3)
        e = a + D[k]; a = e + B[k]
    half = max(.12, B[keys[-1]] / 2)
    end = max(st + mind, e + half + tail)
    S.append([round(st, 3), round(end, 3)])
    t, carry = end, half

scene(['hook1'], mind=1.5)                    # 1  calendar: posting every day
scene(['hook2'], mind=1.9)                    # 2  phone: 0 views
scene(['p1', 'p2', 'p3'], lead=.25, tail=.2)  # 3  three pains (hexagons)
scene(['meet'], mind=2.1)                     # 4  logo reveal
scene(['s1', 's2', 's3'], lead=.05)           # 5  three services
scene(['team'], mind=1.5)                     # 6  all in one team
scene(['turn'], lead=.05, tail=.45)           # 7  raw → polished
scene(['you1'], mind=1.3)                     # 8  REC
scene(['you2'], mind=1.8)                     # 9  checklist
scene(['cta1'], mind=2.6)                     # 10 booking card
scene(['cta2'], lead=.45, tail=1.5)           # 11 outro

DUR = round(t, 3)
out = {'DUR': DUR, 'scenes': S, 'cue': cue, 'd': D, 'vo': vo, 'frames': int(round(DUR * 30))}
json.dump(out, open('out/timeline.json', 'w'), indent=1)
open('timeline.js', 'w').write('window.TL = ' + json.dumps(out) + ';\n')
print(f'duration {DUR}s, {out["frames"]} frames')
for i, (a, b) in enumerate(S): print(f'  scene {i+1:2d}  {a:6.2f} – {b:6.2f}  ({b - a:.2f}s)')
