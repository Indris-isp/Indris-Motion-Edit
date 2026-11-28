# Foundry founder video (landing page, 1920x1080, max 2:30)

- Storyboard v1: `storyboard/index.html`, published at https://claude.ai/artifact/WTDVQWNPPK3EzhwgWxYU7b
- First-cut preview: `out/foundry_founder_preview_v1_1080p.mp4` (149.5 s, 30 fps)

## Build

Inputs go in `src/` (not committed): `vo.m4a` (founder voice), `flyover.mp4`, `eric_test.mp4`.

```bash
python3 build_audio.py        # out/vo_retimed.wav: false start removed, pauses capped, joins snapped to the waveform
python3 tr.py out/check.f32 out/check_words.json   # re-transcribe the cut (after ffmpeg -> 16 kHz f32le)
python3 build_timeline.py     # timeline.json: caption lines and word times, spelled as in the script
python3 -c "import json;open('timeline.js','w').write('window.TL='+json.dumps(json.load(open('timeline.json')))+';')"
ffmpeg -i src/flyover.mp4 -q:v 3 frames/fly/f%05d.jpg
ffmpeg -t 70 -i src/eric_test.mp4 -r 30 -q:v 3 frames/eric/f%05d.jpg
node render.cjs stills 12,38.4,82     # check frames
node render.cjs all                   # out/frames/f00000.jpg ... (4485 frames)
ffmpeg -framerate 30 -i out/frames/f%05d.jpg -i out/vo_retimed.wav -c:v libx264 -crf 17 -preset slow -pix_fmt yuv420p -c:a aac -b:a 192k -af apad -t 149.5 out/foundry_founder_preview_v1_1080p.mp4
```

`foundry.html` is the whole edit: every scene is timed from the voiceover's word times (`T('word', after)`), so a re-recorded voiceover only needs `build_audio.py` → `build_timeline.py` again.

## Placeholders in the preview

- **Eric:** real test footage stands in for the AI twin (tagged on screen). Swap `frames/eric` for the twin.
- **Clip:** a placeholder badge. Swap in the client's PNGs (`#clip`).
- **Music:** none yet. It comes from a licensed library track, ducked under the voice.
- **Partner names** (Stripe, QuickBooks, Google, Facebook) are set as text, not logos, until the client approves logo use.

Still needed from the client: the AI-twin base video, Clip PNGs, the rough cut, the logo SVG, the flyover in 1080p or higher, Spanish UI screens, and the music choice.
