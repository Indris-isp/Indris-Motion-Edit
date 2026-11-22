/* TIMELINE: RB2B launch film, 16:9. Rows: [shotId, secondsOnScreen, speed, overrides?]
 * New shots for this film: journey (comet-trail visitor path) and unmask (scan-and-decode identity reveal).
 */
window.TIMELINE = {
  FPS: 30, BPM: 128, W: 1920, H: 1080,
  shots: [
    ['hook',      1.6, 1.35],
    ['journey',   2.3, 1.35],
    ['chaos',     1.9, 1.35],
    ['pain',      2.1, 1.35],
    ['turn',      1.9, 1.3],
    ['brand',     1.6, 1.35],
    ['unmask',    2.7, 1.3],
    ['laptop',    2.6, 1.55, { tin: 'whip' }],
    ['circle',    2.4, 1.4],
    ['fanout',    2.4, 1.4],
    ['morph',     2.6, 1.45, { tin: 'whip' }],
    ['dashboard', 2.3, 1.45, { tin: 'up' }],
    ['social',    1.8, 1.35],
    ['reel',      1.6, 1.3],
    ['cta',       3.0, 1.2],
  ],
};
