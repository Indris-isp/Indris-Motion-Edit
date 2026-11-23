#!/usr/bin/env python3
"""Start a new launch-film project from the skill template.

  python3 new_project.py <dest_dir> [--url https://client.com] [--brand <captured_brand_dir>]
                         [--style airy|editorial|midnight|cinematic] [--format 16:9|9:16]
                         [--name "Product"] [--accent "#2F6BFF"]

--url     captures the brand from the live site (scripts/capture_brand.cjs) into <dest>/brand/
--brand   uses an existing capture folder instead (copied into <dest>/brand/)
Either way it then runs make_brief.py, so brief.js starts with THEIR colours, fonts, logo, buttons and copy.
--style   writes that style's default shot list into timeline.js (default: make_brief's suggestion, else airy)
Without --url/--brand you get the Loopin demo brief (fictional) to edit by hand.
"""
import argparse, json, os, re, shutil, stat, subprocess, sys

HERE = os.path.dirname(os.path.abspath(__file__))
TEMPLATE = os.path.join(HERE, '..', 'template')
ap = argparse.ArgumentParser()
ap.add_argument('dest'); ap.add_argument('--url'); ap.add_argument('--brand'); ap.add_argument('--style')
ap.add_argument('--format', default='16:9'); ap.add_argument('--name'); ap.add_argument('--accent')
a = ap.parse_args()

if os.path.exists(a.dest) and os.listdir(a.dest): sys.exit(f'{a.dest} exists and is not empty; pick a new folder')
shutil.copytree(TEMPLATE, a.dest, dirs_exist_ok=True, ignore=shutil.ignore_patterns('out', 'node_modules', '_*'))
os.makedirs(os.path.join(a.dest, 'assets'), exist_ok=True)
b = os.path.join(a.dest, 'build.sh'); os.chmod(b, os.stat(b).st_mode | stat.S_IXUSR | stat.S_IXGRP | stat.S_IXOTH)

suggested = None
if a.url or a.brand:
    bdir = os.path.join(a.dest, 'brand')
    if a.brand: shutil.copytree(a.brand, bdir, dirs_exist_ok=True)
    else:
        r = subprocess.run(['node', os.path.join(HERE, 'capture_brand.cjs'), a.url, bdir])
        if r.returncode == 3: sys.exit('capture blocked: ask the user for screenshots, logo and brand guide (see SKILL.md "When capture is blocked")')
        if r.returncode: sys.exit('capture failed')
    out = subprocess.run([sys.executable, os.path.join(HERE, 'make_brief.py'), a.dest], capture_output=True, text=True)
    print(out.stdout.strip()); m = re.search(r'style suggestion: (\w+)', out.stdout); suggested = m and m.group(1)

bp = os.path.join(a.dest, 'brief.js'); s = open(bp).read()
if a.name: s = re.sub(r"product: ['\"][^'\"]*['\"]", f"product: {json.dumps(a.name)}", s, count=1)
if a.accent:
    if not re.fullmatch(r'#[0-9a-fA-F]{6}', a.accent): sys.exit('--accent must look like #2F6BFF')
    s = re.sub(r"accent: ['\"]#[0-9a-fA-F]{6}['\"]", f"accent: '{a.accent}'", s, count=1)
open(bp, 'w').write(s)

style = a.style or suggested or 'airy'
shots = json.loads(subprocess.check_output(['node', '-e', f"global.window={{}};require({json.dumps(os.path.abspath(os.path.join(a.dest, 'styles.js')))});console.log(JSON.stringify(window.STYLES[{json.dumps(style)}]))"]))
if a.url or a.brand or a.style:
    rows = ',\n'.join('    ' + json.dumps(r) for r in shots['shots'])
    tl = os.path.join(a.dest, 'timeline.js'); t = open(tl).read()
    t = re.sub(r"window\.TIMELINE = \{.*", f"""window.TIMELINE = {{
  FPS: 30, BPM: {shots['bpm']},
  STYLE: {json.dumps(style)},        // {shots['name']}: see styles.js / references/styles.md
  FORMAT: {json.dumps(a.format)},          // or '9:16'. Override per render with FORMAT=9:16 ./build.sh (or FORMAT=both)
  // shotsVertical: [...],  // optional: a different (shorter) shot list for 9:16 only
  shots: [
{rows},
  ],
}};
""", t, flags=re.S)
    open(tl, 'w').write(t)
print(f"""created {a.dest}  (style: {style})
next:
  1. Read {a.dest}/brand/kit.png and brand/captured.md; fix colour roles / fonts / logo in brief.js
  2. pick real screens from brand/ui/, cut layers: python3 {HERE}/layers.py grid <img> → crop
  3. write the copy (their real lines first), set hero/features/words/split/build/stat/cta
  4. cd {a.dest} && node render.cjs --board      (and --format 9:16)
  5. ./build.sh  (FORMAT=both for 16:9 + 9:16)""")
