"""Builds the plan page data from the live edit: plan.json (12 beats, word-timed transcript, shots, options),
option mockups (thumbs/) and the preview video. Run from edits/hatch-team after `edit.py --plan`, the A/B
mockup stills (out/mockA, out/mockB) and `edit.py --rough-clean`.
"""
import importlib.util, json, os, shutil, sys
from PIL import Image
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(HERE)
spec = importlib.util.spec_from_file_location('ed', os.path.join(ROOT, 'edit.py'))
ed = importlib.util.module_from_spec(spec); sys.argv = ['edit.py']; spec.loader.exec_module(ed)

# (id, name, first word, last word, mockup time, A title, A description, B description)
BEATS = [
 ('b1', 'Hook', 0, 15, 2.2, 'Rack-focus opener + title banner',
  'The stream logo covers his face for 5 s, so the hook plays over the room, blurred, with the banner "Why do real estate teams actually exist?". Focus pulls onto him at "exist because", then a close-up punch-in on "the leader has EGO" (his real lean-in).',
  'No banner: the blur still has to cover the logo, then the same punch-in on "ego". Quieter open.'),
 ('b2', 'Bridge', 122, 130, 9.4, 'Medium close-up + captions',
  'Chest-up shot. "function" is the keyword.', 'Same shot, same captions.'),
 ('b3', 'Ego → blueprint', 134, 142, 14.3, 'Designed scene: EGO breaks into a blueprint',
  'Full-screen scene: giant EGO, it shatters on "transformed", the word "blueprint" assembles letter by letter and a team org chart draws on (leader → three agents).',
  'Stay on the speaker with captions; "blueprint" lands as the keyword.'),
 ('b4', 'Proof: Matt\'s team', 226, 248, 19.6, 'Wide shot + three tags',
  '"I have a buddy named Matt" on a medium shot, then wide: Connecticut / Great money / High per-agent productivity tags stack in the headroom on each word.',
  'Wide shot with captions only.'),
 ('b5', 'Open loop', 271, 286, 22.0, 'Close-up question, cut on "Erik"',
  'Close-up on "Hey, what\'s the SECRET to your success?", then medium on "And he\'s like, Erik, this is going to be".',
  'One medium shot, captions only.'),
 ('b6', 'The most boring', 287, 293, 25.6, 'Tight punch-in, colour drains to grey',
  'Extreme close-up on "the most BORING", the picture fades to near-grey for the line, then back to colour on "conversation that you\'ve had".',
  'Same punch-in, no colour change.'),
 ('b7', 'Rule #1: show up', 296, 322, 27.9, 'Wide + "RULE #1" in the headroom',
  'Wide shot with a big "#1" above his head for "Number one, everybody agrees to SHOW UP", then a close-up on "And if somebody is NOT there" ("not" in crimson).',
  'Wide shot then close-up, captions only.'),
 ('b8', '25 texts', 323, 343, 33.5, 'Designed scene: the phone fills up',
  '"miss one meeting and 25 texts": the counter runs 0 → 25 as he says it, teammates\' texts stack up in a group chat, and "Hey, are you alive?" / "Are you still in real estate?" land as highlighted bubbles on his words.',
  'Stay on the speaker; captions carry the quotes.'),
 ('b9', 'That\'s a blueprint', 354, 368, 36.6, 'Medium, then wide',
  '"That\'s a BLUEPRINT" on a medium shot, then wide for "And then EVERYBODY has".', 'Same shots, captions only.'),
 ('b10', 'Rules 2 and 3', 369, 398, 41.6, 'Designed scene: "The blueprint" checklist',
  'Board titled "Matt\'s team · The blueprint". Rule 1 is already ticked; "X conversations every week" slides in and ticks on "week"; "Add friends to the database" slides in and ticks on "database".',
  'Stay on the speaker with captions.'),
 ('b11', 'On repeat', 404, 410, 45.0, 'Close-up that pans with his head turn',
  'Medium on "They\'re just doing", close-up on "simple things ON REPEAT". He turns his head here, so the camera pans with him; "repeat" assembles letter by letter.',
  'Locked close-up, captions only.'),
 ('b12', 'Close', 458, 472, 47.2, 'Callback stamp, then the final line',
  '"This is THE BLUEPRINT." stamps over the finished checklist, then extreme close-up on "It\'s NOT a suggestion" and close-up on "You have to do THIS." Ends on a short held frame and fade.',
  'Speaker only for the whole close.'),
]

def clean(w):
    w = {'Eric,': 'Erik,', 'Miali': 'Miali(?)'}.get(w, w); return w

beats = []
for bid, name, a, b, tm, at, ad, bd in BEATS:
    words = [dict(w=clean(ed.WORDS[i]['w']), t=round(ed.out_time(i), 3)) for i in range(a, b + 1)
             if any(c['i0'] <= i <= c['i1'] for c in ed.TL)]
    start = (ed.anchor_frame(a)) / ed.FPS
    beats.append(dict(id=bid, name=name, start=round(start, 3), script=' '.join(x['w'] for x in words), words=words, mock=tm,
                      A=dict(title=at, desc=ad), B=dict(title='Speaker + captions only', desc=bd)))
for i, bt in enumerate(beats):
    bt['end'] = beats[i + 1]['start'] if i + 1 < len(beats) else round(ed.DUR, 3)
    bt['shots'] = [dict(t0=round(max(s['f0'] / ed.FPS, bt['start']), 2), t1=round(min(s['f1'] / ed.FPS, bt['end']), 2),
                        view=s['view'].replace('scene:', 'scene · '), follow=bool(s.get('follow')))
                   for s in ed.SHOT_LIST if s['f1'] / ed.FPS > bt['start'] + .01 and s['f0'] / ed.FPS < bt['end'] - .01]
os.makedirs(os.path.join(HERE, 'thumbs'), exist_ok=True)
for bt in beats:
    for k, d in (('A', 'mockA'), ('B', 'mockB')):
        src = os.path.join(ROOT, 'out', d, f"still_{bt['mock']:05.2f}.png")
        if not os.path.exists(src):
            cands = sorted(os.listdir(os.path.join(ROOT, 'out', d)), key=lambda f: abs(float(f[6:-4]) - bt['mock']))
            src = os.path.join(ROOT, 'out', d, cands[0])
        Image.open(src).convert('RGB').resize((270, 480), Image.LANCZOS).save(os.path.join(HERE, 'thumbs', f"{bt['id']}{k}.jpg"), quality=82)
shutil.copy(os.path.join(ROOT, 'out', 'hatch_team_rough_preview.mp4'), os.path.join(HERE, 'preview.mp4'))
json.dump(dict(title='Hatch Coaching · real estate team clip', duration=round(ed.DUR, 3), version='rough cut v2',
               palette=dict(name='D · Brand orange, warm neutrals', accent='#F05B33', negative='#D7263D', lines='#8C7F74',
                            text='#F7F2EC', ground='#171310', surface='#25201B', base='#0E0C0B'),
               beats=beats), open(os.path.join(HERE, 'plan.json'), 'w'), indent=1)
print(len(beats), 'beats', ed.DUR)
for bt in beats: print(bt['id'], bt['start'], bt['end'], bt['name'], '|', bt['script'][:70])
