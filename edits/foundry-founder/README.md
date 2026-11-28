# Foundry founder video (landing page, 1920x1080, max 2:30)

Storyboard v1: `storyboard/index.html` (published as an artifact).

- `words.json`: word timings of the original voiceover (faster-whisper small.en).
- `retime.py`: cuts the false start (src 83.3–101.3 s, "restart this one") and caps pauses at 0.62 s.
  Writes `words_retimed.json`. The voiceover ends at 142.6 s, plus a 6.9 s logo end card = 149.5 s.
- `stills.html` + `shot.cjs`: mock-up stills (1920x1080). They expect source frames in `src/`,
  extracted with ffmpeg from the client's flyover and test video (not committed).

Still missing from the client: AI-twin base video, Clip PNGs, rough cut, logo SVG,
1080p+ flyover master, Spanish UI screens, partner-logo approval.
