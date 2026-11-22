/* Timeline.
 * "authored" = scene start times the animations and SFX were written against (seconds).
 * "dur"      = how long each scene really lasts on screen; "speed" plays the authored
 *              animation that many times faster (so dur*speed of authored time is shown).
 * SFX times are in authored time; cues within 0.3 s of a scene's end stick to the cut.
 */
window.CUES = {
  "FPS": 30,
  "BPM": 128,
  "authored": [0.0, 2.5, 5.5, 8.5, 11.0, 13.5, 18.5, 22.5, 26.5, 30.5, 33.5, 36.0, 40.0],
  "dur":   [1.6,  2.0,  2.2,  2.0,  1.7,  2.7,  2.6,  2.6,  2.4,  1.9,  1.7,  3.0],
  "speed": [1.35, 1.3,  1.35, 1.25, 1.3,  1.55, 1.35, 1.35, 1.4,  1.3,  1.25, 1.2],
  "sfx": [
    [0.02, "swell"], [1.0, "tick"], [1.35, "pop"], [1.3, "whoosh_s"], [2.32, "whoosh"],
    [2.62, "pops6"], [2.78, "whoosh_s"], [2.9, "whoosh_s"], [5.25, "whoosh"],
    [5.6, "ticks10"], [6.7, "stamp"], [5.95, "pops4"], [7.6, "down"],
    [8.5, "boom"], [8.95, "shimmer"], [9.0, "riser"], [11.0, "hit"],
    [11.7, "type6"], [12.4, "pops3"], [13.3, "whoosh"],
    [13.6, "type14"], [13.95, "whoosh"], [14.5, "pops5"], [15.5, "whoosh_s"], [16.5, "click"],
    [18.5, "hit_s"], [18.52, "whoosh"], [19.75, "pops9"], [22.2, "whoosh"],
    [22.65, "type10"], [23.4, "type26"], [24.65, "click"], [24.8, "swoop"], [25.1, "pops3"],
    [26.3, "whoosh"], [26.9, "whoosh_s"], [27.2, "ticks12"], [27.5, "pops3"], [28.4, "pop"],
    [30.32, "whoosh"], [30.7, "ticks10"], [31.5, "pop"],
    [33.3, "whoosh"], [33.6, "reel8"], [34.4, "type10"],
    [35.0, "riser"], [36.0, "hit"], [36.4, "type6"], [37.0, "whoosh_s"], [37.4, "pops2"]
  ]
};
(function (c) {
  c.starts = [0]; c.dur.forEach(d => c.starts.push(+(c.starts[c.starts.length - 1] + d).toFixed(4)));
  c.DUR = c.starts[c.starts.length - 1];
})(window.CUES);
