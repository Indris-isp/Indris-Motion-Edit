#!/usr/bin/env python3
"""Turn a captured brand (brand/brand.json from capture_brand.cjs) into a starting brief.js.

  python3 make_brief.py <project_dir>            # reads <project_dir>/brand/brand.json, rewrites <project_dir>/brief.js top block

What it fills: product, url, brand tokens (colours by role, fonts, display/body, head weight, radius,
buttons, logo, icon), hero.l1/l2 from their H1, hero.eyebrow, launch.pill, stat (their first real stat +
its context), cta button labels, and a suggested STYLE. It also writes brand/captured.md listing every
captured line, stat and UI piece so the script can reuse their real words.
It cannot judge taste: Claude must check the result against brand/kit.png and fix roles that look wrong
(e.g. an accent that is really a one-off illustration colour).
"""
import colorsys, json, os, re, sys

proj = sys.argv[1] if len(sys.argv) > 1 else '.'
bj = os.path.join(proj, 'brand', 'brand.json')
d = json.load(open(bj))

def rgb(h): h = h.lstrip('#'); return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))
def lum(h): r, g, b = rgb(h); return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255
def sat(h): r, g, b = rgb(h); mx, mn = max(r, g, b), min(r, g, b); return 0 if mx == 0 else (mx - mn) / mx
def hue(h): r, g, b = rgb(h); return colorsys.rgb_to_hsv(r / 255, g / 255, b / 255)[0]
def hexes(s): return ['#%02x%02x%02x' % tuple(int(float(x)) for x in m.split(',')[:3]) for m in re.findall(r'rgba?\(([^)]+)\)', s)]
def js(v): return json.dumps(v, ensure_ascii=False)

C = d['colors']
bgs = [h for h, _ in C['backgrounds']]
txt = [h for h, _ in C['text']]
btn = [h for h, _ in C['buttons']]
bg = bgs[0] if bgs else '#ffffff'
light_site = lum(bg) > .5
inks = [h for h in txt if (lum(h) < .35 if light_site else lum(h) > .7)]
ink = inks[0] if inks else ('#0B0D12' if light_site else '#ffffff')
darks = [h for h in bgs + txt if lum(h) < .16]
dark = darks[0] if darks else '#0B0D12'
cands = [h for h in btn + C['accents'] if sat(h) > .35 and .08 < lum(h) < .93]
B = d.get('buttons', [])
def vivid(h): return sat(h) > .45 and lum(h) < .85
# the primary CTA is the strongest brand signal: a saturated/gradient button, else a solid dark one
CTA = re.compile(r'get started|start|try|sign ?up|book|request|download|join|create|get .*free|demo', re.I)
def filled(b): return (b.get('image') and len(hexes(b['image'])) > 0) or (b.get('bg') and (vivid(b['bg']) or lum(b['bg']) < .25))
ranked = sorted([b for b in B if filled(b)], key=lambda b: (not CTA.search(b['text']), b.get('y', 0)))   # real CTA verbs first, then top of page
prim = ranked[0] if ranked else None
grad = None
if prim and prim.get('image'):
    hs = [h for h in hexes(prim['image']) if vivid(h)]
    if len(hs) >= 2: grad = hs[:2]
if not grad:
    for g in C['gradients']:
        hs = [h for h in hexes(g) if vivid(h)]
        if len(hs) >= 2: grad = hs[:2]; break
pbg = (hexes(prim['image'])[0] if prim and prim.get('image') else prim.get('bg')) if prim else None
mono = bool(pbg) and sat(pbg) < .25 and lum(pbg) < .25          # black/neutral primary button = monochrome brand
def huedist(a, b): x = abs(hue(a) - hue(b)); return min(x, 1 - x)
if mono:
    accent = pbg
    hi = next((h for h in cands if sat(h) > .5 and lum(h) > .4), None)
else:
    accent = pbg if pbg and vivid(pbg) else grad[0] if grad else (cands[0] if cands else '#2F6BFF')
    hi = next((h for h in cands if huedist(h, accent) > .08 and sat(h) > .5), None)
muted = next((h for h in txt if .3 < lum(h) < .7), '#8A90A0')
bg2 = next((h for h in bgs[1:] if abs(lum(h) - lum(bg)) < .12), bg)

colors = {'accent': accent, 'bg': bg, 'bg2': bg2, 'ink': ink, 'dark': dark, 'muted': muted}
if hi: colors['highlight'] = hi
if grad: colors['gradient'] = grad
if not light_site: colors.update({'bg': '#ffffff', 'bg2': '#f4f6fa', 'ink': '#0B0D12', 'dark': bg})

fonts = d.get('fonts', [])
fam = [f['family'] for f in fonts if f['family'].lower() not in ('arial', 'helvetica', 'sans-serif', 'system-ui', '-apple-system', 'times new roman')]
display = max((f for f in fonts if f['family'] in fam[:3]), key=lambda f: f.get('largestSize', 0), default={'family': 'Inter'})['family'] if fam else 'Inter'
body = fam[0] if fam else 'Inter'
dw = [int(w) for f in fonts if f['family'] == display for w in f.get('weights', []) if str(w).isdigit()]
head_weight = max([w for w in dw if w >= 600] or [700])
ff = [{'family': f['family'], 'src': 'brand/' + f['file'], 'weight': f['weight']} for f in d.get('fontFiles', [])]

radii = [int(float(r[0].split('px')[0])) for r in d.get('radius', []) if r[0].endswith('px') and ' ' not in r[0] and 4 <= float(r[0][:-2]) <= 40]
radius = radii[0] if radii else 16

def btn_style(b):
    o = {'radius': int(float(b['radius'].split('px')[0])) if b.get('radius', '').split('px')[0].replace('.', '').isdigit() else 8}
    if b.get('image'): o['bg'] = b['image']
    elif b.get('bg'): o['bg'] = b['bg']
    else: o['bg'] = 'transparent'
    if b.get('color'): o['color'] = b['color']
    if b.get('border'): o['border'] = b['border'].replace(b['border'].split(' solid ')[-1], 'currentColor') if not b.get('bg') else b['border']
    return o
sec = next((b for b in B if b is not prim and b.get('border') and not b.get('bg')), None)
buttons = {'weight': 600}
if prim: buttons['primary'] = btn_style(prim)
if sec: buttons['secondary'] = btn_style(sec); buttons['secondary']['color'] = 'inherit'

title = d.get('title', '')
product = re.split(r'\s[|:–—-]\s|:\s', title)[0].strip() or title
url = re.sub(r'^https?://(www\.)?', '', d.get('url', '')).strip('/')
logo = d.get('logo') or {}
fav = next((f for f in os.listdir(os.path.join(proj, 'brand')) if f.startswith('favicon.') and not f.endswith('.ico')), None)

h1 = (d['copy'].get('h1') or [product])[0]
def split2(s):
    w = s.split(); best = (1e9, s, '')
    for i in range(1, len(w)):
        a, b = ' '.join(w[:i]), ' '.join(w[i:]); best = min(best, (abs(len(a) - len(b)), a, b))
    return best[1], best[2]
l1, l2 = split2(h1) if len(h1) > 18 else (h1, '')
eyebrow = next((e for e in d['copy'].get('eyebrow', []) if 6 < len(e) < 48), '')
launch = next((e for e in d['copy'].get('eyebrow', []) if re.search(r'launch|new|introducing|announc|\d+\.\d', e, re.I)), '')
stats = d['copy'].get('stats', [])
stat = stats[0] if stats else None
btn_text = [b['text'] for b in B]
cta_p = prim['text'] if prim else (btn_text[0] if btn_text else 'Get started')
cta_s = sec['text'] if sec else ''

dark_ratio = sum(a for h, a in C['backgrounds'] if lum(h) < .2) / max(1, sum(a for _, a in C['backgrounds']))
style = 'editorial' if mono else 'midnight' if (dark_ratio > .45 or grad) else 'airy'

brand = {'colors': colors, 'radius': radius, 'buttons': buttons}
if ff: brand.update({'fonts': ff})
brand.update({'display': display, 'body': body, 'headWeight': head_weight})
if logo.get('file'): brand['logo'] = 'brand/' + logo['file']
brand['icon'] = 'brand/' + fav if fav else None

top = f'''/* BRIEF for {product} — generated by make_brief.py from brand/brand.json ({d.get('url')}).
 * CHECK against brand/kit.png: colour roles, fonts, logo. Real copy is listed in brand/captured.md.
 * Suggested style: {style}  (set STYLE in timeline.js)
 */
window.BRIEF = {{
  product: {js(product)},
  url: {js(url)},
  brand: {json.dumps(brand, ensure_ascii=False, indent=2).replace(chr(10), chr(10) + '  ')},
  launch: {{ pill: {js(launch)} }},
  hero: {{
    eyebrow: {js(eyebrow)},
    l1: {js(l1)}, l2: {js(l2)},
    screen: null,      // pick from brand/ui/ (or crop brand/hero.png with scripts/layers.py)
    layers: [],
  }},
  features: [          // from their H2/H3s — attach a brand/ui image to each
{chr(10).join(f"    {{ label: {js(h)}, l1: '', l2: '', image: null }}," for h in (d['copy'].get('h2') or [])[:3])}
  ],
  words: {{ screen: null, items: [] }},
  split: {{ left: '', right: '', screen: null }},
  build: {{ title: '', label: '', base: null, drag: null }},
  stat: {js({'value': stat['value'], 'caption': '', 'bold': ''} if stat else {'value': '', 'caption': ''})},   // context: {js(stat['context'] if stat else '')}
'''
p = os.path.join(proj, 'brief.js'); s = open(p).read()
cut = s.index('  people: [')
open(p, 'w').write(top + '\n' + s[cut:].replace("cta: { tagline: ['Close the loop ', 'on every client.'], primary: 'Start free →', secondary: 'Book a demo' }",
                                                f"cta: {{ tagline: [{js(l1 + ' ')}, {js(l2)}], primary: {js(cta_p)}, secondary: {js(cta_s)} }}"))

md = [f'# Captured from {d.get("url")}', '', f'**Title:** {title}', f'**Description:** {d.get("description", "")}', '', '## Headlines (use their words)']
md += [f'- H1: {x}' for x in d['copy'].get('h1', [])] + [f'- H2: {x}' for x in d['copy'].get('h2', [])] + [f'- H3: {x}' for x in d['copy'].get('h3', [])]
md += ['', '## Stats (with context — only use with the meaning shown)'] + [f'- **{s_["value"]}** — …{s_["context"]}…' for s_ in stats]
md += ['', '## Buttons'] + [f'- {b["text"]}  (bg {b.get("image") or b.get("bg")}, radius {b.get("radius")})' for b in B[:12]]
md += ['', '## Eyebrows / pills'] + [f'- {x}' for x in d['copy'].get('eyebrow', [])]
md += ['', '## UI pieces'] + [f'- brand/{u["file"]} — {u["w"]}×{u["h"]} — {u["alt"]}' for u in d.get('ui', [])]
open(os.path.join(proj, 'brand', 'captured.md'), 'w').write('\n'.join(md) + '\n')
print(f'brief.js written for {product} · style suggestion: {style} · accent {accent} · display font {display} · logo {brand.get("logo")}')
print('next: Read brand/kit.png + brand/captured.md, fix colour roles, pick screens/layers, write the copy.')
