#!/usr/bin/env python3
"""Start a new launch-film project from the skill template.

  python3 new_project.py <dest_dir> [--name "Product"] [--accent "#2F6BFF"] [--url product.com]

Copies template/ (engine, shots, brief, timeline, fonts, render/audio/build scripts) into
<dest_dir>, creates <dest_dir>/assets/, and fills in the name/accent/url if given.
Everything else in brief.js is still the Loopin demo copy: rewrite it for the product.
"""
import argparse, os, re, shutil, stat, sys

HERE = os.path.dirname(os.path.abspath(__file__))
TEMPLATE = os.path.join(HERE, '..', 'template')

ap = argparse.ArgumentParser()
ap.add_argument('dest')
ap.add_argument('--name'); ap.add_argument('--accent'); ap.add_argument('--url')
a = ap.parse_args()

if os.path.exists(a.dest) and os.listdir(a.dest):
    sys.exit(f'{a.dest} exists and is not empty; pick a new folder')
shutil.copytree(TEMPLATE, a.dest, dirs_exist_ok=True, ignore=shutil.ignore_patterns('out', 'node_modules'))
os.makedirs(os.path.join(a.dest, 'assets'), exist_ok=True)
b = os.path.join(a.dest, 'build.sh'); os.chmod(b, os.stat(b).st_mode | stat.S_IXUSR | stat.S_IXGRP | stat.S_IXOTH)

bp = os.path.join(a.dest, 'brief.js'); s = open(bp).read()
if a.name: s = re.sub(r"product: '[^']*'", f"product: '{a.name}'", s, count=1)
if a.url: s = re.sub(r"url: '[^']*'", f"url: '{a.url}'", s, count=1)
if a.accent:
    if not re.fullmatch(r'#[0-9a-fA-F]{6}', a.accent): sys.exit('--accent must look like #2F6BFF')
    s = re.sub(r"accent: '#[0-9a-fA-F]{6}'", f"accent: '{a.accent}'", s, count=1)
open(bp, 'w').write(s)
print(f"""created {a.dest}
next:
  1. rewrite {a.dest}/brief.js (all copy, numbers, people, channels); put logo/screenshots in assets/
  2. choose/order shots in {a.dest}/timeline.js
  3. cd {a.dest} && node render.cjs --board      # storyboard for approval -> out/board.png
  4. ./build.sh                                   # final -> out/launch.mp4 + out/qa_sheet.png
  preview: open {a.dest}/index.html in a browser (scrubber, no audio)""")
