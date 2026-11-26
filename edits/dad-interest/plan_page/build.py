"""Builds the planning page's media: script.json (one row per beat), a proposal still per beat, palette mock-ups and the raw cut."""
import json, os, subprocess, sys
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
sys.argv = ['edit.py']
import importlib.util
def load(accent=None):
    if accent: os.environ['DI_ACCENT'] = accent
    else: os.environ.pop('DI_ACCENT', None)
    spec = importlib.util.spec_from_file_location('edit', os.path.join(ROOT, 'edit.py'))
    m = importlib.util.module_from_spec(spec); spec.loader.exec_module(m); return m
from PIL import Image

e = load()
# beats = the shots, with the words they cover, the proposal and the alternatives
DESIGN = {  # shot source start -> (scene label, proposal, alternatives)
    784.15: ('Hook card', 'Speaker in a rounded card under the title "At 15, she charged her own dad interest". Giant white $20 counts up and lands on "20".', ['Full-screen speaker + giant $20', 'Title only, no number']),
    786.00: ('Hook punch-in', 'Punch-in inside the card. Gold "+$5" slams in on "$5"; INTEREST assembles letter by letter.', ['Cut to the loan book early', 'Speaker only']),
    789.56: ('Host reaction', 'Host on camera: "Wow, I like that". Gold keyword THAT.', ['Audio only over the guest', 'Cut it']),
    727.17: ('Giant number', 'Guest wide. Gold 15 counts up on "15".', ['Text behind her: "AGE 15"', 'Speaker + captions']),
    732.36: ('Punch-in', 'Guest MCU, keyword DAD.', ['Old-photo card of a dad and daughter (AI)', 'Speaker + captions']),
    735.14: ('Tags on the desk', 'Walnut desk: gold ALLOWANCE tag, SHOPPING tag struck in red, gold BOOKS tag.', ['Stack of books + cash (3D/AI scene)', 'Speaker + tags over her']),
    744.08: ('Speaker', 'Guest wide, keyword SAVED.', ['Piggy bank / savings jar scene (AI)', 'Count-up of savings']),
    746.30: ('Punch-in', 'Guest MCU, keywords FRIENDS, FAMILY.', ['Group of friends B-roll (AI)', 'Speaker + captions']),
    749.42: ('Calendar on the desk', 'Calendar: days 1 to 14 cross out in red, the 15th gets a hand-drawn red circle on "middle".', ['Empty wallet scene (AI)', 'Speaker + captions']),
    753.28: ('Speaker', 'Guest, keyword MONEY.', ['Hands reaching for cash (AI)', 'Speaker + captions']),
    755.46: ('Punch-in', 'Guest CU: "guess what I DID?"', ['Freeze-frame + question mark', 'Speaker wide']),
    759.30: ('Speaker', 'Guest wide: "Yeah, I gave it to them".', ['Speaker + captions only', 'Straight to the loan book']),
    760.48: ('Loan book 1', 'Loan book opens on the desk: "Friends & family + interest" writes on, gold tick.', ['Receipt printing "+ interest"', 'Speaker + captions']),
    762.26: ('Host laugh', 'Host laughing (his own camera).', ['Keep on the guest', 'Cut the laugh']),
    769.42: ('Speaker', 'Guest wide: "I remember my dad".', ['Speaker + captions', 'Old-photo card']),
    772.31: ('Knock', 'Guest punch-in; two shakes on "knocked" and "door".', ['Bedroom door scene (AI) with knock shakes', 'Speaker + captions']),
    774.08: ('Giant number', 'Guest wide, giant white $20 on "20".', ['Text behind her: "I NEED $20"', 'Speaker + captions']),
    776.97: ('Punch-in', 'Guest MCU, keyword DRAWER.', ['Drawer opening with saved cash (AI)', 'Speaker + captions']),
    779.26: ('Speaker', 'Guest, keyword COUNTING.', ['Hands counting bills (AI) with a count-up', 'Speaker + captions']),
    781.00: ('Punch-in', 'Guest CU: "he said WAIT, you still have all those MONEY?"', ['Split screen: dad / her', 'Speaker wide']),
    791.58: ('Speaker', 'Guest: "So I gave him $20".', ['$20 bill sliding across the desk', 'Speaker + captions']),
    792.74: ('Speaker', 'Guest wide, keyword PAID.', ['Payday calendar / pay stub', 'Speaker + captions']),
    794.68: ('Punch-in', 'Guest MCU: "he\'s giving me allowance".', ['Speaker + captions', 'Loan book early']),
    796.24: ('Loan book 2', 'Loan book: "Dad  $20  + $5" written on as she says each number.', ['Invoice / IOU note to "Daddy"', 'Speaker + giant numbers']),
    801.12: ('Speaker', 'Guest wide: "and he gave me my allowance and the $20".', ['Speaker + captions', 'Loan book: $20 tick']),
    804.04: ('Loan book 3', 'Loan book: $20 ticked, "+ $5" struck in red with an X; colour turns cold.', ['Speaker CU + red INTEREST', 'Receipt torn up']),
    805.94: ('Punch-in', 'Guest CU: "I\'m like COME ON" in red, shake.', ['Host reaction', 'Speaker wide']),
    839.72: ('Loan book 4', 'Gold FIRST BUSINESS · EST. AGE 15 stamp slams onto the loan book.', ['Business card with her name (AI)', 'Speaker + giant FIRST BUSINESS']),
    842.92: ('Speaker', 'Guest wide: "but I didn\'t know it was called".', ['Speaker + captions', 'Dictionary definition card']),
    844.48: ('Ending', 'Guest CU, ENTREPRENEURSHIP assembles letter by letter; 0.35 s fade.', ['Loop back to the hook', 'Add CTA: Comment "INTEREST"']),
}
rows = []
outs = [o for o, s in e.SHOTS_OUT] + [e.DUR]
for k, (o, s) in enumerate(e.SHOTS_OUT):
    o1 = outs[k + 1]
    ws = [(round(a, 2), w) for a, b, w in e.WORDS if o - 0.02 <= (a + b) / 2 < o1]
    label, prop, alts = DESIGN[s[0]]
    sid = f'b{k + 1:02d}'
    angle = s[1] if s[1] not in ('full',) else (s[2] if isinstance(s[2], str) else s[2]['angle'])
    rows.append(dict(id=sid, t0=round(o, 2), t1=round(o1, 2), src=round(s[0], 2), scene=label, angle=str(angle),
                     speaker='Host' if 'HOST' in str(s[2]) else 'Guest', words=ws, proposal=prop, alts=alts))
    t = min(o1 - 0.05, o + max(0.6, (o1 - o) * 0.7))
    e.render_frame(int(round(t * e.FPS))).resize((360, 640), Image.LANCZOS).save(os.path.join(HERE, f'thumbs/{sid}.jpg'), quality=86)
json.dump(rows, open(os.path.join(HERE, 'script.json'), 'w'))
print(len(rows), 'beats')

PALS = [('A', '#F3D6A0'), ('B', '#E6E24C'), ('C', '#E8A15A')]
for pid, acc in PALS:
    m = load(acc)
    ims = [m.render_frame(int(round(m.src_to_out(ts) * m.FPS))).resize((270, 480), Image.LANCZOS) for ts in (785.2, 797.0, 845.1)]
    sheet = Image.new('RGB', (810, 480)); [sheet.paste(im, (i * 270, 0)) for i, im in enumerate(ims)]
    sheet.save(os.path.join(HERE, f'mock_{pid}.jpg'), quality=86)
print('mocks done')
