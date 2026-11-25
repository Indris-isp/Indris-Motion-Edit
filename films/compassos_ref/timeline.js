/* REF timeline (generic, fast cut): every brand fills window.REFT in ref_brand.js. Authored lengths / F = seconds on screen. */
(function () {
  const T = window.REFT, F = T.speed || 1.75, row = (id, auth, p) => [id, +(auth / F).toFixed(2), F, p];
  window.TIMELINE = { FPS: 30, BPM: 96, STYLE: 'airy', FORMAT: '16:9', shots: [
    row('logoBloom', 4.2, {}),
    row('lineToPill', 4.97, { line: T.line, pill: T.pill }),
    row('glassCards', 5.4, { pill: T.pill, cardA: T.a, cardB: T.b, photo: T.photo, photoBox: T.photoBox, done: T.done }),
    row('tiltScreen', 5.28, { tin: 'dissolve', component: 'screen1', words: T.tilt }),
    row('orbit', 5.75, { tin: 'dissolve', text: T.orbit, items: T.orbitItems }),
    row('ringWord', 3.22, { text: T.ring }),
    row('printStage', 5.4, { text: T.ring, object: T.object, objBox: T.objBox, cards: T.cards }),
    row('network', 4.84, { tin: 'dissolve', words: T.net }),
    row('finalScreen', 5.06, { tin: 'dissolve', title: T.final, component: 'screen2' }),
    row('endMark', 3.6, { tin: 'dissolve', line: T.end }),
  ] };
})();
