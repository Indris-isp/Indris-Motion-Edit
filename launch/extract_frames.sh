#!/usr/bin/env bash
# Extracts 30 fps, 1280x720 background frames from the nature clips (run fetch_nature.sh first).
set -e; cd "$(dirname "$0")/assets"
for c in valley_clouds field_bluesky sunset_hills wheat_sunset clouds garden_sunset meadow_tree; do
  mkdir -p frames/$c; rm -f frames/$c/*.jpg
  if [ $c = sunset_hills ]; then vf="scale=2600:-1,crop=1920:1080:680:(ih-1080)/2+420,scale=1280:720"; else vf="scale=1280:720:force_original_aspect_ratio=increase,crop=1280:720"; fi
  ffmpeg -nostdin -v error -ss 1 -i nature/$c.mp4 -t 7.5 -vf "fps=30,$vf" -q:v 4 frames/$c/%04d.jpg
  echo "$c $(ls frames/$c | wc -l)"
done
