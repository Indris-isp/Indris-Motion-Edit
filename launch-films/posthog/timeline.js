/* Problem (hook, chaos, pain) → turn → reveal → solution 1, 2, 3 → recap (monitor) → proof → CTA.
 * Rows: [shotId, secondsOnScreen, speed, overrides?]. See the skill's references/shot-library.md. */
window.TIMELINE = {
  FPS: 30, BPM: 128, W: 1920, H: 1080,
  shots: [
    ['hook',      1.6, 1.35],
    ['chaos',     2.0, 1.3],
    ['pain',      2.2, 1.35],
    ['turn',      2.0, 1.25],
    ['brand',     1.7, 1.3],
    ['laptop',    2.7, 1.55],
    ['circle',    2.6, 1.35],
    ['morph',     2.8, 1.35],
    ['monitor',   2.8, 1.45],
    ['dashboard', 2.4, 1.4],
    ['cta',       3.0, 1.2],
  ],
};
