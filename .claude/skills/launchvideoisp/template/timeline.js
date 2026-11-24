/* TIMELINE: which shots, in what order, how long, how fast.
 * Each row: [shotId, secondsOnScreen, speed, overrides?]
 *   secondsOnScreen: real time the shot is visible (cut point = pacing).
 *   speed: plays the shot's authored animation this many times faster.
 *          The shot shows secondsOnScreen*speed of its authored length (see shots.js `len`);
 *          if that is less than `len`, the tail hold is trimmed.
 *   overrides: e.g. { tin: 'whip', tout: 'fade' } to change the transitions.
 * Moves: creative (kinetic scribbles crowd dial funnel strokesLogo inline componentHero podium chartSet fan
 *        dotNumber statLine flood), Ref C (monitorWords splitWords frameCard uiBuild), turns (turn turnInk
 *        turnGlow logoReveal) and classic moves. 4th element = the move's params. See references/creative-moves.md.
 * Story: Problem -> Cause -> Solution -> Proof -> CTA. Pacing: 2-4 s per shot, CTA 3-4 s, total 30-40 s. A shot whose last move ends
 * more than 0.6 s before its cut will feel stuck: raise speed or lower seconds.
 */
window.TIMELINE = {
  FPS: 30, BPM: 128,
  STYLE: 'airy',           // airy | editorial | midnight | cinematic (styles.js)
  FORMAT: '16:9',          // or '9:16'. Override per render with FORMAT=9:16 ./build.sh (or FORMAT=both)
  // shotsVertical: [...],  // optional: a different (shorter) shot list for 9:16 only
  shots: [
    ["kinetic", 1.8, 1.3, {"big": "9:14", "small": "am", "label": "CLIENT FEEDBACK · MONDAY", "glow": "acc"}],
    ["crowd", 2.2, 1.3, {"count": 40, "questions": ["is this final?", "logo bigger?", "where's v2?", "see my comments", "urgent!!", "can we revert?"], "center": ["127", "unread comments"]}],
    ["turn", 2.0, 1.25],
    ["inline", 2.6, 1.3, {"before": "Every", "component": "inbox", "after": "in", "line2": "one inbox.", "button": "Resolve ✓"}],
    ["componentHero", 2.8, 1.25, {"headline": ["Reply once.", "Everyone sees it."], "component": "reply"}],
    ["fan", 2.6, 1.25, {"headline": ["Every client,", "in the loop."], "card": "email", "stat": "resolved"}],
    ["dotNumber", 2.2, 1.3, {"value": "12,480", "caption": ["comments resolved ·", "this week"]}],
    ["flood", 3.0, 1.15, {"button": "Start free →"}],
  ],
};
