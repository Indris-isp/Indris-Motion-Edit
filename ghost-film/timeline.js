/* TIMELINE: which shots, in what order, how long, how fast.
 * Each row: [shotId, secondsOnScreen, speed, overrides?]
 *   secondsOnScreen: real time the shot is visible (cut point = pacing).
 *   speed: plays the shot's authored animation this many times faster.
 *          The shot shows secondsOnScreen*speed of its authored length (see shots.js `len`);
 *          if that is less than `len`, the tail hold is trimmed.
 *   overrides: e.g. { tin: 'whip', tout: 'fade' } to change the transitions.
 * Shots: hook chaos pain turn brand laptop circle fanout dashboard social reel cta,
 *        plus colorize morph rackfocus dive (see references/shot-library.md). For example,
 *        swap a benefit for ['dive', 2.5, 1.25] or ['morph', 2.8, 1.35] to vary the moves.
 * Pacing rules: 1.5-2.8 s per shot, CTA 2.5-3.5 s, total 22-35 s. A shot whose last move ends
 * more than 0.6 s before its cut will feel stuck: raise speed or lower seconds.
 */
window.TIMELINE = {
  FPS: 30, BPM: 128, W: 1920, H: 1080,
  shots: [
    ['hook',      1.6, 1.35],   // 9:00 → 9:01 am · "Seen by 6% of your followers"
    ['chaos',     2.0, 1.3],    // Five tools. / Zero control.
    ['pain',      2.2, 1.35],   // 94% unseen · "6% reach"
    ['turn',      2.0, 1.25],   // starfield, ring → Ghost orb, white flash
    ['brand',     1.7, 1.3],    // orb + "ghost" · Website / Newsletter / Members
    ['laptop',    2.7, 1.55],   // Every post, / every inbox. · real Ghost editor, hand clicks Publish
    ['colorize',  2.8, 1.25],   // Paid members. / 0% fees. · grey readers light up
    ['morph',     2.8, 1.4],    // One place, / no duct tape. · card → folder → Ghost panel
    ['dashboard', 2.4, 1.4],    // Keep 100% of your revenue
    ['social',    1.9, 1.3],    // Last week, / 20,425 new publications · $100M+
    ['reel',      1.7, 1.25],   // 10 → 0 · % platform / fees.
    ['cta',       3.0, 1.2],    // ghost · Turn your audience into a business.
  ],
};
