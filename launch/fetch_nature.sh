#!/usr/bin/env bash
# Downloads the Mixkit nature clips used as backgrounds (Mixkit Stock Video Free License: free for commercial use, no attribution needed).
# id:name pairs. The clips are not committed (see .gitignore); run this to restore them.
set -e
cd "$(dirname "$0")/assets/nature"
for p in 45342:blossom 4132:alps 2408:sky_clouds 4070:valley_clouds 7853:green_field 46318:field_bluesky 3980:sunset_hills 17764:wheat_sunset 51102:clouds 4205:garden_sunset 4075:meadow_tree; do
  id=${p%%:*}; name=${p#*:}
  [ -s "$name.mp4" ] || curl -sfL --max-time 300 -o "$name.mp4" "https://assets.mixkit.co/videos/$id/$id-1080.mp4" || curl -sfL --max-time 300 -o "$name.mp4" "https://assets.mixkit.co/videos/$id/$id-720.mp4"
  echo "$name $(ffprobe -v error -select_streams v -show_entries stream=width,height -show_entries format=duration -of csv=p=0 "$name.mp4" | tr '\n' ' ')"
done
