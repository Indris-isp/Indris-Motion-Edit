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
  FPS: 30, BPM: 112,
  STYLE: "editorial",        // Editorial Contrast: see styles.js / references/styles.md
  FORMAT: "16:9",          // or '9:16'. Override per render with FORMAT=9:16 ./build.sh (or FORMAT=both)
  // shotsVertical: [...],  // optional: a different (shorter) shot list for 9:16 only
  shots: [
    ["dial", 2.4, 1.3, {"headline": ["The algorithm", "decides who", "sees you."], "value": 2, "label": "REACH THIS WEEK"}],
    ["funnel", 2.4, 1.25, {"headline": ["Your audience.", "Rented."], "gate": "FEED"}],
    ["turnInk", 1.8, 1.2],
    ["componentHero", 3.0, 1.25, {"headline": ["Write it", "once."], "accent": false, "component": "editor"}],
    ["fan", 2.8, 1.25, {"headline": ["Land in every", "inbox."], "card": "email", "subjects": ["Issue #142: what changed", "Issue #143: the deep dive", "Issue #144: readers asked", "Issue #145: behind the scenes"], "stat": "members"}],
    ["statLine", 2.6, 1.25, {"value": "$100,000,000+", "valueShort": "$100M+", "caption": "earned each year by publications on Ghost, with", "bold": "0% payment fees.", "chip": "MRR +24%", "color": "#ff5fa8"}],
    ["flood", 3.0, 1.15, {"button": "Get Started — free"}],
  ],
};
