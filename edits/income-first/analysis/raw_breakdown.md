# Frame-by-frame breakdown: raw cut

The per-frame data is in `analysis/raw_frames.csv`: 1,219 rows, one per output frame at 23.976 fps. Each row has:
- output time, source time and source frame;
- the kept segment and the camera shot;
- the angle and the speaker;
- the word being spoken and the audio level;
- YuNet face box, confidence and nose position;
- the smoothed track, the crop x;
- the nose position in the 1080×1920 frame and the face's margins to the crop edges.

Re-run it with `python3 raw_cut.py --model face_detection_yunet_2023mar.onnx` (the model is from Hugging Face `opencv/face_detection_yunet`).

## Tracking result

- Face found in **100%** of frames.
- The crop is the full source height (405×720 → 1080×1920), so the face keeps its natural size. The nose is never lower than **38%** of the frame height (upper half).
- Nose distance from the centre line: median **47 px**, 95th percentile **98 px**, max 152 px (of 1080).
- The face box never comes closer than **61 px** to a frame edge, and the crop never leaves the source picture.
- **Smoothness:** the camera holds completely still 58% of the time.
  - The largest move between two frames is 1.7 source px (≈4.5 output px).
  - Moves ease in and out (speed and acceleration are capped), so there are no jumps or whips.
  - The track resets at each of the episode's camera cuts.
- The episode cuts to the interviewer 0.3 s before the guest's last word ends, so the guest's last frame is held through the tail. The same fix is applied in `edit.py`.

## Shots

| Shot | Out (s) | Source | Angle | On screen | Words | Nose offset median / max (px) | Camera travel (out px) |
|---|---|---|---|---|---|---|---|
| 1 | 0.00–5.04 | 51:24.3 | HOST | Interviewer (Brandon) | And what message would you give people who are watching this and who want to get into acti… | 18 / 116 | 33 |
| 2 | 5.00–13.14 | 51:35.5 | G_FRONT | Guest | So my advice to anybody who wants to play this game is find something that brings you inco… | 51 / 104 | 78 |
| 3 | 13.20–24.94 | 51:44.8 | G_SIDE | Guest | If you can find a way to have those checks rolling in you get into real estate, you get in… | 44 / 143 | 82 |
| 4 | 25.00–34.84 | 51:59.4 | G_FRONT | Guest | pursue this. Because if you are going to be what I call one of those starving actors, I me… | 51 / 93 | 99 |
| 5 | 34.80–37.54 | 52:09.8 | G_SIDE | Guest | So don't do that to yourselves. Don't do that to your families, | 10 / 93 | 0 |
| 6 | 37.50–50.84 | 52:12.5 | G_FRONT | Guest | families, I've seen actors make their families suffer, pursuing their dream, we'll call it… | 47 / 152 | 109 |

Angles: **HOST** is the interviewer against the brick wall. **G_FRONT** is the guest straight on (bookshelf, blue backlight). **G_SIDE** is the guest at a 3/4 angle (city-window monitor, warm plant light).

## Kept segments (source seconds)

| # | Source in → out | Length |
|---|---|---|
| 1 | 3084.300 → 3089.285 | 4.98 s |
| 2 | 3095.450 → 3100.930 | 5.48 s |
| 3 | 3101.050 → 3103.750 | 2.70 s |
| 4 | 3104.830 → 3105.925 | 1.10 s |
| 5 | 3106.045 → 3107.200 | 1.15 s |
| 6 | 3107.320 → 3109.190 | 1.87 s |
| 7 | 3110.130 → 3112.800 | 2.67 s |
| 8 | 3113.595 → 3114.485 | 0.89 s |
| 9 | 3114.605 → 3115.870 | 1.26 s |
| 10 | 3116.410 → 3119.125 | 2.72 s |
| 11 | 3119.245 → 3120.850 | 1.61 s |
| 12 | 3121.000 → 3125.710 | 4.71 s |
| 13 | 3125.830 → 3128.985 | 3.16 s |
| 14 | 3129.105 → 3129.575 | 0.47 s |
| 15 | 3129.695 → 3132.855 | 3.16 s |
| 16 | 3133.940 → 3134.935 | 0.99 s |
| 17 | 3135.055 → 3137.085 | 2.03 s |
| 18 | 3137.205 → 3139.100 | 1.89 s |
| 19 | 3139.220 → 3141.250 | 2.03 s |
| 20 | 3142.580 → 3143.720 | 1.14 s |
| 21 | 3144.620 → 3149.450 | 4.83 s |
