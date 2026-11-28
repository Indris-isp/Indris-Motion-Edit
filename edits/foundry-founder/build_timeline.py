"""Caption/sync timeline from the re-transcribed retimed VO, spelled as in the approved script."""
import json, re
w = json.load(open('out/check_words.json'))
FIX = {('market', 'is'): ['mark', 'it'], ('send', 'a', 'payment'): ['set', 'a', 'payment'], ('earn', 'two.'): ['earn', 'too.'],
       ('Hi,',): ['Hey,']}
words = [dict(t=x['w'], s=x['s'], e=x['e']) for x in w]
for i in range(len(words)):
    for k, v in FIX.items():
        if all(i + j < len(words) and words[i + j]['t'].strip('.,').lower() == k[j].strip('.,').lower() for j in range(len(k))):
            if k == ('Hi,',): continue  # he says "Hi": captions follow the audio here
            for j, r in enumerate(v): words[i + j]['t'] = r
merged = []
for x in words:
    if merged and x['t'][:1] in '-%.' and x['t'] not in '...':
        merged[-1]['t'] += x['t']; merged[-1]['e'] = x['e']
    else: merged.append(x)
words = merged
for x in words:
    x['t'] = x['t'].replace('ericatfoundryconnects.com,', 'eric@foundryconnects.com,').replace('Clipp', 'Clip')
KEY = re.compile(r"^(\$|\d|Foundry|Clip|theirs|Spanish|Apple|Google|Stripe|QuickBooks|paid|free|Connections|cash|Pro\b|pro\.|inside|eric@|headaches|done|protected|easy|directly|reviews|busy)", re.I)
FUNC = set('your in the a an and i\'ll to of for my with on is you me so or from can our we it that\'s'.split())
chunks, cur = [], []
for i, x in enumerate(words):
    cur.append(x)
    txt = ' '.join(y['t'] for y in cur)
    nxt = words[i + 1] if i + 1 < len(words) else None
    end_punct = x['t'][-1] in '.?!'
    soft = x['t'][-1] in ',' and len(cur) >= 3
    gap = nxt and nxt['s'] - x['e'] > 0.45
    weak = x['t'].lower().strip(',') in FUNC
    if not nxt or end_punct or gap or (soft and len(txt) >= 14) or (len(txt) >= 30 and not weak) or len(txt) >= 38:
        chunks.append(cur); cur = []
# fold one-word orphans back into the previous line of the same sentence
fixed = []
for c in chunks:
    p = fixed[-1] if fixed else None
    if p and len(c) == 1 and p[-1]['t'][-1] not in '.?!' and c[0]['s'] - p[-1]['e'] < 0.45 and len(' '.join(y['t'] for y in p + c)) <= 42:
        p.extend(c)
    else: fixed.append(c)
chunks = fixed
out = []
for c in chunks:
    ks = [i for i, y in enumerate(c) if KEY.match(y['t'])]
    nums = [i for i, y in enumerate(c) if y['t'][:1] in '$0123456789']
    plain = [i for i, y in enumerate(c) if y['t'].lower().strip(',.?!') not in FUNC] or list(range(len(c)))
    k = nums[0] if nums else ks[-1] if ks else max(plain, key=lambda i: len(c[i]['t']))
    out.append({'s': c[0]['s'], 'e': c[-1]['e'], 'k': k, 'w': [[y['t'], round(y['s'], 2)] for y in c]})
json.dump({'words': [[x['t'], round(x['s'], 2), round(x['e'], 2)] for x in words], 'chunks': out}, open('timeline.json', 'w'))
print(len(out), 'chunks'); print(max(len(' '.join(y[0] for y in c['w'])) for c in out), 'max chars')
for c in out[:0]: print(' '.join(('*' + y[0] + '*') if i == c['k'] else y[0] for i, y in enumerate(c['w'])))
