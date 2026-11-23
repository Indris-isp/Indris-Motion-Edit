#!/bin/bash
# new_story.sh <project_dir>: copy the engine into a story project (keeps brand/, assets/, beats.js, timeline.js, brief.js, film.css, film.json)
set -e; T="$(cd "$(dirname "$0")/../template" && pwd)"; P="$1"; mkdir -p "$P/fonts"
for f in index.html engine.js shots.js shots_brand.js shots_story.js story.css styles.js render.cjs audio.py build.sh; do cp "$T/$f" "$P/"; done
cp "$T"/fonts/* "$P/fonts/"
for f in beats.js timeline.js brief.js film.css; do [ -f "$P/$f" ] || cp "$T/$f" "$P/"; done
echo "story project ready: $P"
