/* TIMELINE: TeamBuildr launch film, ~40 s.
 * Each row: [shotId, secondsOnScreen, speed, overrides?]. seconds × speed ≈ the shot's authored len.
 * Pacing is deliberately a notch calmer than the template (cuts every 2.2–4.4 s, speed ~1.05–1.18)
 * so every UI beat is readable: premium and fast, but explanatory.
 */
window.TIMELINE = {
  FPS: 60, BPM: 112,
  FORMAT: '16:9',
  shots: [
    ['hook',      2.2, 1.1],
    ['chaos',     2.6, 1.15],
    ['pain',      2.8, 1.07],
    ['turn',      2.4, 1.04],
    ['brand',     2.4, 1.04],
    ['laptop',    4.4, 1.13],
    ['fanout',    3.5, 1.14],
    ['colorize',  3.0, 1.07],
    ['morph',     3.6, 1.11],
    ['circle',    3.4, 1.18],
    ['dashboard', 3.6, 1.11],
    ['social',    2.8, 1.07],
    ['cta',       3.8, 1.05],
  ],
};
