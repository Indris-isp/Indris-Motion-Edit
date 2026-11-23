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
  FPS: 30, BPM: 124,
  STYLE: "midnight",        // Midnight Gradient: see styles.js / references/styles.md
  FORMAT: "16:9",          // or '9:16'. Override per render with FORMAT=9:16 ./build.sh (or FORMAT=both)
  // shotsVertical: [...],  // optional: a different (shorter) shot list for 9:16 only
  shots: [
    ["kinetic", 1.8, 1.3, {"big": "6:00", "small": "am", "label": "WEIGHT ROOM · MONDAY", "glow": "hi"}],
    ["scribbles", 2.6, 1.25, {"surface": "whiteboard", "items": [{"t": "SQUAT 5×5", "x": 0.06, "y": 0.08, "size": 76}, {"t": "???", "x": 0.55, "y": 0.08, "size": 76, "color": "red", "circle": true}, {"t": "GROUP B → BENCH?", "x": 0.4, "y": 0.38, "size": 60}, {"t": "Jake 225", "x": 0.07, "y": 0.6, "size": 60, "strike": true}, {"t": "235? 245??", "x": 0.31, "y": 0.6, "size": 60}, {"t": "RPE ??", "x": 0.72, "y": 0.72, "size": 56, "color": "red"}], "strokes": [{"d": "M330 150 q50 -60 100 0 t90 10"}, {"d": "M90 500 C 190 450, 270 560, 370 480"}], "smear": true, "caption": ["40 athletes.", "One whiteboard."]}],
    ["crowd", 2.2, 1.3, {"count": 40, "questions": ["what weight?", "Group B?", "which RPE?", "am I squatting?", "lost the sheet", "skip today?"], "center": ["40 ?", "questions before the first rep"]}],
    ["strokesLogo", 2.0, 1.2, {"word": "TEAMBUILDR"}],
    ["inline", 2.6, 1.3, {"before": "Program", "component": "workout", "after": "in", "line2": "minutes.", "button": "+ Add exercise"}],
    ["podium", 2.4, 1.3, {"headline": ["Make every rep", "compete."], "entries": [{"place": 2, "value": "205", "name": "Charlie C."}, {"place": 1, "value": "210", "name": "Rocky B."}, {"place": 3, "value": "190", "name": "Jordan T."}]}],
    ["monitorWords", 2.2, 1.25, {"component": "maxreport", "items": ["Program", "Track", "Compete"]}],
    ["chartSet", 2.6, 1.3, {"headline": ["See every", "max."], "pill": "Max Report · Deadlift", "bars": [{"value": "405", "label": "TEAM AVG"}, {"value": "365", "label": "ATHLETE"}], "slider": {"label": "Session RPE", "value": 0.7, "display": "7.5"}}],
    ["dotNumber", 2.2, 1.3, {"value": "5,500+", "caption": ["coaches, teams & facilities ·", "since 2012"]}],
    ["flood", 3.0, 1.15, {"button": "Start Free Trial"}],
  ],
};
