#!/usr/bin/env bash
# Full build: frames -> sound -> final MP4 -> QA contact sheet.
#   ./build.sh            render everything
#   ./build.sh --audio    redo sound + mux only (after a cues/timing change that kept the frames)
# Uses assets/music.(wav|mp3|m4a) as the music bed if present (SFX stay synthesized).
set -euo pipefail
cd "$(dirname "$0")"
NAME="${NAME:-launch}"
if [[ "${1:-}" != "--audio" ]]; then node render.cjs; else node render.cjs --cues; fi
python3 audio.py
MUSIC=$(ls assets/music.* 2>/dev/null | head -1 || true)
DUR=$(python3 -c "import json;print(json.load(open('out/cues.json'))['DUR'])")
if [[ -n "$MUSIC" ]]; then
  echo "using music bed: $MUSIC"
  ffmpeg -y -loglevel error -i "$MUSIC" -i out/sfx.wav -filter_complex \
    "[0:a]atrim=0:${DUR},afade=t=out:st=$(python3 -c "print(max(0,${DUR}-1.2))"):d=1.2,volume=0.8[m];[m][1:a]amix=inputs=2:duration=longest:normalize=0[a]" \
    -map "[a]" -ar 44100 out/mix.wav
  AUDIO=out/mix.wav
else
  AUDIO=out/audio.wav
fi
ffmpeg -y -loglevel error -i out/video_silent.mp4 -i "$AUDIO" -c:v copy -af loudnorm=I=-14:TP=-1:LRA=9 \
  -c:a aac -b:a 192k -ar 48000 -shortest -movflags +faststart "out/${NAME}.mp4"
ffmpeg -y -loglevel error -i "out/${NAME}.mp4" -vf "fps=2,scale=320:-1,tile=8x$(python3 -c "import math;print(math.ceil(${DUR}*2/8))"):padding=3" -frames:v 1 out/qa_sheet.png
echo "wrote out/${NAME}.mp4 (${DUR}s) and out/qa_sheet.png"
