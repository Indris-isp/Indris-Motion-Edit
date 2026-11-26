// Dad-interest scenes, built on the client-reviewed kit (scenes3.js: makeStudio with depth of field, canvasTex, noiseCanvas,
// gradientBg; scenes2.js: roundedRect, mulberry). Two worlds for the money story, as in the references:
//   * the warm studio table (V12 puzzle/bulb world): bills for the hook, allowance -> books
//   * the desk from above (V08 cutting mat): the calendar, then the loan book that grows with the story
// plus text behind the speaker (V04 "I'M 23") and the house captions over the A-roll.
const GOLD = '#F2C35B', GOLD_MID = '#C8952C', GOLD_DK = '#8A5F14', INK = '#2b2620', RED = '#D93A2B';

// ------------------------------------------------------------------ shared
const grey = { font: '500 62px Poppins, Inter, sans-serif', color: '#5a534b', textShadow: '0 2px 10px rgba(255,250,240,.6)' };
const extGold = (size) => ({ font: `800 ${size}px/1 Poppins, sans-serif`, color: GOLD, letterSpacing: '-3px',
  textShadow: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => `0 ${i}px 0 ${i < 6 ? GOLD_MID : GOLD_DK}`).join(',') + ', 0 26px 30px rgba(70,50,30,.30)' });
const layer = () => el('div', { position: 'absolute', left: '0', top: '0', width: '1080px', height: '1920px' });

function billTex(value) {
  const tint = value === 5 ? ['#e3dccb', '#6d5a3a', '#8b6b3e'] : ['#d6e3d0', '#4f7a5a', '#3e6a4a'];
  return canvasTex(800, 340, (g, w, h) => {
    g.fillStyle = tint[0]; g.fillRect(0, 0, w, h);
    g.globalAlpha = 0.08; g.drawImage(noiseCanvas(200, 85, 1, value), 0, 0, w, h); g.globalAlpha = 1;
    g.strokeStyle = tint[1] + '59'; g.lineWidth = 1.2;
    for (let k = 0; k < 26; k++) { g.beginPath(); for (let x = 0; x <= w; x += 6) g.lineTo(x, h / 2 + Math.sin(x / 38 + k * 0.5) * (40 + k * 4)); g.stroke(); }
    g.strokeStyle = tint[1]; g.lineWidth = 10; g.strokeRect(14, 14, w - 28, h - 28);
    g.fillStyle = '#efece2'; g.beginPath(); g.ellipse(w / 2, h / 2, 95, 115, 0, 0, 7); g.fill(); g.strokeStyle = tint[1]; g.lineWidth = 6; g.stroke();
    g.fillStyle = tint[1] + 'aa'; g.beginPath(); g.arc(w / 2, h / 2 - 20, 40, 0, 7); g.fill(); g.beginPath(); g.ellipse(w / 2, h / 2 + 70, 70, 45, 0, Math.PI, 0); g.fill();
    g.fillStyle = tint[2]; g.font = '800 84px Inter'; g.fillText(String(value), 40, 104); g.fillText(String(value), w - (value === 5 ? 90 : 140), h - 40);
    g.font = '600 26px Inter'; g.fillText(value === 5 ? 'FIVE DOLLARS' : 'TWENTY DOLLARS', 40, h - 44);
    g.fillStyle = '#a2443a'; g.font = '600 24px monospace'; g.fillText(value === 5 ? 'E 22180451 A' : 'B 04518823 C', w - 240, 70);
  });
}
function billMesh(value, sc) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.01, 1.1), new THREE.MeshStandardMaterial({ map: billTex(value).t, roughness: 0.85 }));
  m.castShadow = m.receiveShadow = true; sc.add(m); return m;
}

// warm studio table (V12 world): warm paper-beige table, soft fog, key light with soft VSM shadows
function studioTable({ focus = 13, aperture = 50, maxR = 30 } = {}) {
  const st = makeStudio({ dof: window.NODOF ? null : { focus, aperture, maxR, bgCoc: 18 }, exposure: 0.64 });
  const sc = new THREE.Scene(); sc.environment = st.envMap;
  sc.background = gradientBg([[0, '#f1e4d1'], [0.6, '#dfcab0'], [1, '#c2a888']]);
  sc.fog = new THREE.Fog(0xdecab2, 22, 46);
  sc.add(new THREE.HemisphereLight(0xffdcb0, 0xa8784a, 0.40));
  const key = new THREE.DirectionalLight(0xffe9cc, 1.15); key.position.set(-6, 12, -3); key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048); Object.assign(key.shadow.camera, { left: -12, right: 12, top: 14, bottom: -14, near: 1, far: 40 });
  key.shadow.radius = 14; key.shadow.blurSamples = 20; key.shadow.bias = -0.0005; sc.add(key);
  const table = new THREE.Mesh(new THREE.PlaneGeometry(80, 80), new THREE.MeshStandardMaterial({ color: 0xe0a86e, roughness: 0.9 }));
  table.rotation.x = -Math.PI / 2; table.receiveShadow = true; sc.add(table);
  const cam = new THREE.PerspectiveCamera(30, 1080 / 1920, 0.1, 100);
  return { st, sc, cam };
}

// desk from above (V08 world): self-healing cutting mat with ruler marks, keyboard, mouse, coffee, pen, sticky note
function matDesk() {
  const st = makeStudio({ dof: window.NODOF ? null : { focus: 12, aperture: 10, maxR: 16 } });
  const sc = new THREE.Scene(); sc.environment = st.envMap; sc.background = new THREE.Color(0x26754a);
  const cam = new THREE.PerspectiveCamera(36, 1080 / 1920, 0.1, 100); cam.up.set(0, 0, -1);
  sc.add(new THREE.HemisphereLight(0xffffff, 0x41604c, 0.3));
  const key = new THREE.DirectionalLight(0xfff4e6, 1.0); key.position.set(-5, 14, -6); key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048); Object.assign(key.shadow.camera, { left: -10, right: 10, top: 12, bottom: -12, near: 1, far: 40 });
  key.shadow.radius = 10; key.shadow.blurSamples = 20; key.shadow.bias = -0.0004; sc.add(key);
  const matTex = canvasTex(2048, 3072, (g, w, h) => {
    g.fillStyle = '#2f8d52'; g.fillRect(0, 0, w, h);
    g.globalAlpha = 0.07; g.drawImage(noiseCanvas(512, 768, 1, 9), 0, 0, w, h); g.globalAlpha = 1;
    const cell = 64;
    for (let i = 0; i * cell < Math.max(w, h); i++) {
      const major = i % 5 === 0; g.strokeStyle = major ? 'rgba(235,255,240,.42)' : 'rgba(235,255,240,.18)'; g.lineWidth = major ? 3 : 1.5;
      g.beginPath(); g.moveTo(i * cell, 0); g.lineTo(i * cell, h); g.stroke(); g.beginPath(); g.moveTo(0, i * cell); g.lineTo(w, i * cell); g.stroke();
    }
    g.strokeStyle = 'rgba(235,255,240,.22)'; g.lineWidth = 2;
    for (let k = 1; k <= 6; k++) { g.beginPath(); g.moveTo(0, h - k * 320); g.lineTo(k * 320, h); g.stroke(); }
    g.fillStyle = 'rgba(235,255,240,.7)'; g.font = '600 26px Inter';
    for (let i = 1; i * cell * 5 < w; i++) g.fillText(String(i * 5), i * cell * 5 + 6, 34);
    for (let i = 1; i * cell * 5 < h; i++) g.fillText(String(i * 5), 8, i * cell * 5 - 8);
  });
  const matM = new THREE.Mesh(new THREE.PlaneGeometry(14, 21), new THREE.MeshStandardMaterial({ map: matTex.t, roughness: 0.85 }));
  matM.rotation.x = -Math.PI / 2; matM.receiveShadow = true; sc.add(matM);
  const white = new THREE.MeshStandardMaterial({ color: 0xf1f0ec, roughness: 0.45 }), dark = new THREE.MeshStandardMaterial({ color: 0x1b1f22, roughness: 0.4, metalness: 0.2 });
  const add = (geo, m, p, r = [0, 0, 0]) => { const x = new THREE.Mesh(geo, m); x.position.set(...p); x.rotation.set(...r); x.castShadow = x.receiveShadow = true; sc.add(x); return x; };
  const kb = new THREE.Group(); kb.position.set(-3.9, 0, -6.3); kb.rotation.y = 0.16; sc.add(kb);
  const kbBody = new THREE.Mesh(new THREE.ExtrudeGeometry(roundedRect(6.4, 2.3, 0.25), { depth: 0.22, bevelEnabled: true, bevelSize: 0.05, bevelThickness: 0.05, bevelSegments: 3 }), white);
  kbBody.rotation.x = -Math.PI / 2; kbBody.castShadow = kbBody.receiveShadow = true; kb.add(kbBody);
  const keys = new THREE.InstancedMesh(new THREE.BoxGeometry(0.34, 0.12, 0.34), new THREE.MeshStandardMaterial({ color: 0xfafaf8, roughness: 0.5 }), 75); const mm = new THREE.Matrix4(); let n = 0;
  for (let r = 0; r < 5; r++) for (let c = 0; c < 15; c++) { mm.makeTranslation(-2.95 + c * 0.42 + (r % 2) * 0.1, 0.33, -0.86 + r * 0.42); keys.setMatrixAt(n++, mm); }
  keys.castShadow = true; kb.add(keys);
  add(new THREE.SphereGeometry(1, 40, 24).scale(0.58, 0.32, 0.92), white, [2.75, 0.05, 4.6], [0, -0.25, 0]);
  add(new THREE.CylinderGeometry(0.62, 0.55, 1.1, 48), white, [2.75, 0.55, -5.4]);
  add(new THREE.CylinderGeometry(0.54, 0.54, 0.02, 48), new THREE.MeshStandardMaterial({ color: 0x3a2516, roughness: 0.15 }), [2.75, 1.06, -5.4]);
  add(new THREE.TorusGeometry(0.34, 0.08, 16, 32, Math.PI), white, [3.37, 0.55, -5.4], [0, Math.PI / 2, -Math.PI / 2]);
  const pen = new THREE.Group(); pen.position.set(2.75, 0.08, 1.4); pen.rotation.y = 0.55; sc.add(pen);
  const penBody = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.075, 2.8, 24), dark); penBody.rotation.z = Math.PI / 2; penBody.castShadow = true; pen.add(penBody);
  const tip = new THREE.Mesh(new THREE.ConeGeometry(0.075, 0.3, 24), new THREE.MeshStandardMaterial({ color: 0xc9cdd1, metalness: 1, roughness: 0.3 })); tip.rotation.z = Math.PI / 2; tip.position.x = 1.55; pen.add(tip);
  const clip = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.03, 0.05), new THREE.MeshStandardMaterial({ color: GOLD, roughness: 0.3, metalness: 0.6 })); clip.position.set(-0.9, 0.08, 0); pen.add(clip);
  return { st, sc, cam, add };
}

// paper sheet with a slight curl (tri-fold optional), drawn by a canvas that is redrawn every frame
function paperSheet(sc, PW, PH, draw, { fold = false } = {}) {
  const tex = canvasTex(1200, Math.round(1200 * PH / PW), draw);
  const pg = new THREE.PlaneGeometry(PW, PH, 48, 68); pg.rotateX(-Math.PI / 2);
  const pp = pg.attributes.position;
  for (let i = 0; i < pp.count; i++) {
    const x = pp.getX(i) / PW + 0.5, z = pp.getZ(i) / PH + 0.5;
    const crease = fold ? 0.055 * Math.abs(Math.sin(Math.PI * 3 * z)) : 0.02 * Math.sin(Math.PI * z);
    pp.setY(i, crease + 0.5 * Math.pow(Math.max(0, x + z - 1.62), 2) * 9);
  }
  pg.computeVertexNormals();
  const m = new THREE.Mesh(pg, new THREE.MeshStandardMaterial({ map: tex.t, roughness: 0.92, side: THREE.DoubleSide }));
  m.castShadow = m.receiveShadow = true;
  const g = new THREE.Group(); g.add(m); sc.add(g);
  return { g, tex };
}

// a sticker label that slaps onto the sheet (dark sticker, serif text) or a red rubber-stamp style label
function labelMesh(parent, text, { w = 3.2, h = 1.0, bg = '#15191b', fg = GOLD, font = '700 170px "Playfair Display"', sub = null } = {}) {
  const lab = canvasTex(960, Math.round(960 * h / w), (g, cw, ch) => {
    g.fillStyle = bg; g.fillRect(0, 0, cw, ch); g.globalAlpha = 0.08; g.drawImage(noiseCanvas(240, 80, 1, 5), 0, 0, cw, ch); g.globalAlpha = 1;
    g.fillStyle = fg; g.font = font; g.textAlign = 'center'; g.textBaseline = 'middle'; g.shadowColor = fg + '88'; g.shadowBlur = 16;
    g.fillText(text, cw / 2, sub ? ch * 0.44 : ch / 2 + 6);
    if (sub) { g.shadowBlur = 0; g.font = '700 40px Inter'; g.globalAlpha = 0.85; g.fillText(sub, cw / 2, ch * 0.8); }
  });
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, 0.03, h), [0, 0, 1, 0, 0, 0].map(k => k ? new THREE.MeshStandardMaterial({ map: lab.t, roughness: 0.5 }) : new THREE.MeshStandardMaterial({ color: bg })));
  m.castShadow = true; parent.add(m); return m;
}

// handwriting on a canvas: written left to right (clip reveal), optional highlighter swipe behind it
function writeOn(g, txt, x, y, font, color, u, hl = null, hu = 0) {
  if (u <= 0) return;
  g.font = font; const w = g.measureText(txt).width;
  const size = parseFloat(font.match(/(\d+)px/)[1]);
  if (hl && hu > 0) {
    g.save(); g.globalCompositeOperation = 'multiply'; g.fillStyle = hl; const r = mulberry(Math.round(y));
    const xe = x - 14 + (w + 28) * eo(hu);
    g.beginPath(); g.moveTo(x - 14, y - size * 0.62);
    for (let xx = x - 14; xx <= xe; xx += 40) g.lineTo(xx, y - size * 0.62 + (r() - 0.5) * 8);
    g.lineTo(xe, y + size * 0.14); for (let xx = xe; xx >= x - 14; xx -= 40) g.lineTo(xx, y + size * 0.14 + (r() - 0.5) * 8);
    g.closePath(); g.fill(); g.restore();
  }
  g.save(); g.beginPath(); g.rect(x - 10, y - size * 1.2, (w + 20) * clamp(u), size * 1.7); g.clip();
  g.fillStyle = color; g.fillText(txt, x, y); g.restore();
}

Object.assign(SCENES, {
  // ------------------------------------------------------------------ hook 1.85-4.45  "but you gotta pay me back with $5 INTEREST"
  // studio table: the $20 she lends slides across to dad, then the $5 interest drops on top. V12 type: grey run-ins + gold extruded keyword.
  deal() {
    const { st, sc, cam } = studioTable({ focus: 13, aperture: 50 });
    const b20 = billMesh(20, sc), b5 = billMesh(5, sc);
    const coins = [];
    const coinM = new THREE.MeshStandardMaterial({ color: 0xd9b25a, metalness: 1, roughness: 0.32 });
    for (let i = 0; i < 5; i++) { const c = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.36, 0.07, 48), coinM); c.castShadow = c.receiveShadow = true; sc.add(c); coins.push(c); }
    const T = layer();
    const p1 = el('div', { position: 'absolute', inset: '0' }, T);
    const r1 = line(p1, 250, [{ w: 'you', t: tw('you'), css: grey }, { w: 'gotta', t: tw('gotta'), css: grey }]);
    const r2 = line(p1, 330, [{ w: 'pay', t: tw('pay'), css: grey }, { w: 'me', t: tw('me'), css: grey }, { w: 'back', t: tw('back'), css: grey }, { w: 'with', t: tw('with'), css: grey }]);
    const k1 = el('div', Object.assign({ position: 'absolute', left: '0', width: '1080px', top: '430px', textAlign: 'center' }, extGold(250)), T, '+$5');
    const k2 = el('div', Object.assign({ position: 'absolute', left: '0', width: '1080px', top: '1380px', textAlign: 'center' }, extGold(190)), T, 'interest');
    const t5 = tw('5'), tI = tw('interest');
    return t => {
      cam.position.set(lerp(0.3, -0.15, t / DUR), lerp(8.6, 7.9, t / DUR), 5.0); cam.lookAt(0.15, 0, 0.75);
      st.dofU && (st.dofU.focus.value = cam.position.distanceTo(new THREE.Vector3(0.15, 0, 0.75)));
      const u = eo((t + 0.25) / 0.7);
      b20.position.set(lerp(6.5, -0.2, u), 0.02 + 0.5 * (1 - u) * (1 - u), lerp(1.8, 0.9, u)); b20.rotation.set(0, lerp(-0.6, -0.08, u), 0);
      const v = eo((t - (t5 - 0.22)) / 0.36), bounce = 0.12 * Math.sin(Math.PI * clamp((t - t5 + 0.22 - 0.36) / 0.18));
      b5.visible = v > 0; b5.position.set(lerp(-4.5, 0.25, v), 0.05 + 2.4 * (1 - v) * (1 - v) + Math.max(0, bounce), lerp(-2.2, 0.45, v)); b5.rotation.set(0, lerp(0.9, 0.22, v), 0);
      coins.forEach((c, i) => {
        const k = eo((t - (tI - 0.15) - i * 0.07) / 0.4);
        c.visible = k > 0; c.position.set(1.05 + 0.08 * i * Math.cos(i), 0.04 + 0.075 * i + 3 * (1 - k) * (1 - k), 1.35 + 0.05 * Math.sin(i * 2)); c.rotation.set(0.15 * (1 - k), 0, 0.1 * (1 - k));
      });
      st.render(sc, cam);
      r1(t); r2(t);
      const a = (t - (t5 - LEAD)) / 0.3; k1.style.opacity = clamp(a * 2); k1.style.transform = `scale(${lerp(1.35, 1, eo(a))})`; k1.style.filter = `blur(${10 * (1 - eo(a))}px)`;
      const b = (t - (tI - LEAD)) / 0.3; k2.style.opacity = clamp(b * 2); k2.style.transform = `translateY(${40 * (1 - eo(b))}px)`; k2.style.filter = `blur(${10 * (1 - eo(b))}px)`;
    };
  },

  // ------------------------------------------------------------------ 9.23-12.77  "ALLOWANCE / I wasn't into shopping / I would just buy BOOKS"
  // studio table: her allowance (bills) on the table; on "buy" the bills slide away and a stack of hardcover books drops in.
  books() {
    const { st, sc, cam } = studioTable({ focus: 12.5, aperture: 46 });
    cam.fov = 40; cam.updateProjectionMatrix();
    const bills = [billMesh(20, sc), billMesh(5, sc), billMesh(20, sc)];
    const covers = [0x23463a, 0x7a2430, 0x1f2f4f, 0xb88a2e, 0x4a3a2c];
    const pages = canvasTex(256, 64, (g, w, h) => { g.fillStyle = '#f3ead6'; g.fillRect(0, 0, w, h); g.strokeStyle = 'rgba(120,100,70,.25)'; for (let y = 2; y < h; y += 3) { g.beginPath(); g.moveTo(0, y); g.lineTo(w, y); g.stroke(); } });
    const pageM = new THREE.MeshStandardMaterial({ map: pages.t, roughness: 0.9 });
    const books = covers.map((c, i) => {
      const cm = new THREE.MeshPhysicalMaterial({ color: c, roughness: 0.55, clearcoat: 0.25 });
      const spine = canvasTex(512, 96, (g, w, h) => {
        g.fillStyle = '#' + c.toString(16).padStart(6, '0'); g.fillRect(0, 0, w, h);
        g.fillStyle = 'rgba(242,195,91,.9)'; g.fillRect(24, 14, 3, h - 28); g.fillRect(w - 27, 14, 3, h - 28);
        g.font = 'italic 40px "Playfair Display"'; g.textAlign = 'center'; g.fillText(['Rich Dad', 'The Law', 'Thinking', 'Money', 'Grit'][i], w / 2, h / 2 + 14);
      });
      const sm = new THREE.MeshPhysicalMaterial({ map: spine.t, roughness: 0.55, clearcoat: 0.25 });
      const wB = 3.6 - i * 0.18, hB = 0.42 + (i % 2) * 0.08, dB = 2.5 - i * 0.12;
      const m = new THREE.Mesh(new THREE.BoxGeometry(wB, hB, dB), [pageM, cm, cm, cm, sm, pageM]);
      m.castShadow = m.receiveShadow = true; sc.add(m);
      return [m, hB];
    });
    const T = layer();
    const c1 = el('div', { position: 'absolute', inset: '0' }, T), c2 = el('div', { position: 'absolute', inset: '0' }, T), c3 = el('div', { position: 'absolute', inset: '0' }, T);
    const kA = el('div', Object.assign({ position: 'absolute', left: '0', width: '1080px', top: '300px', textAlign: 'center' }, extGold(176)), c1, 'allowance');
    const r2 = line(c2, 290, [{ w: 'I', t: tw('i'), css: grey }, { w: "wasn't", t: tw("wasn't"), css: grey }, { w: 'into', t: tw('into'), css: grey }]);
    const shop = el('div', { position: 'absolute', left: '0', width: '1080px', top: '380px', textAlign: 'center', font: '800 150px/1 Poppins, sans-serif', color: '#8b8178', letterSpacing: '-3px' }, c2, 'shopping');
    const strike = el('div', { position: 'absolute', left: '170px', top: '470px', height: '14px', width: '740px', background: RED, borderRadius: '7px', transformOrigin: 'left center', boxShadow: '0 6px 14px rgba(120,30,20,.3)' }, c2);
    const r3 = line(c3, 290, [{ w: 'I', t: tw('i', 1), css: grey }, { w: 'would', t: tw('would'), css: grey }, { w: 'just', t: tw('just'), css: grey }, { w: 'buy', t: tw('buy'), css: grey }]);
    const kB = el('div', Object.assign({ position: 'absolute', left: '0', width: '1080px', top: '380px', textAlign: 'center' }, extGold(230)), c3, 'books');
    const tS = tw('shopping'), tI2 = tw('i', 1), tB = tw('books'), tBuy = tw('buy');
    return t => {
      const pb = eio(t / DUR);
      cam.position.set(lerp(1.6, 2.6, pb), lerp(8.6, 6.6, pb), lerp(9.4, 8.6, pb)); cam.lookAt(0.55, lerp(0.2, 1.0, pb), 1.0);
      st.dofU && (st.dofU.focus.value = cam.position.distanceTo(new THREE.Vector3(0, 1.0, 1.0)));
      bills.forEach((b, i) => {
        const u = eo((t + 0.2 - i * 0.12) / 0.55), out = eio((t - (tBuy - 0.1) - i * 0.05) / 0.5);
        b.position.set(lerp(5.5, 0.25 + i * 0.45, u) - 7 * out, 0.02 + i * 0.012 + 0.4 * (1 - u) * (1 - u), lerp(2.6, 0.6 + i * 0.35, u)); b.rotation.set(0, lerp(-0.8, -0.3 + i * 0.32, u) + 0.6 * out, 0);
      });
      let y = 0;
      books.forEach(([m, hB], i) => {
        const k = eo((t - (tB - 0.32) - i * 0.09) / 0.32), land = clamp((t - (tB - 0.32) - i * 0.09 - 0.32) / 0.16);
        m.visible = k > 0; m.position.set(0.1 + 0.08 * Math.sin(i * 1.7), y + hB / 2 + 4.5 * (1 - k) * (1 - k) + 0.05 * Math.sin(Math.PI * land), 1.0 + 0.06 * Math.cos(i * 2.3));
        m.rotation.set(0, 0.12 * Math.sin(i * 2.1) - 0.05, 0); y += hB;
      });
      st.render(sc, cam);
      chunkVis(c1, t, 0, tS - 0.55); chunkVis(c2, t, tw('i'), tI2 - LEAD); chunkVis(c3, t, tI2, DUR + 1);
      const a = (t - (0 - LEAD)) / 0.3; kA.style.opacity = clamp(a * 2); kA.style.filter = `blur(${10 * (1 - eo(a))}px)`; kA.style.transform = `scale(${lerp(1.25, 1, eo(a))})`;
      r2(t); reveal(shop, t, tS, 30); strike.style.transform = `scaleX(${eo((t - tS - 0.28) / 0.22)})`;
      r3(t); const b = (t - (tB - LEAD)) / 0.3; kB.style.opacity = clamp(b * 2); kB.style.transform = `scale(${lerp(1.35, 1, eo(b))})`; kB.style.filter = `blur(${10 * (1 - eo(b))}px)`;
    };
  },

  // ------------------------------------------------------------------ 18.11-21.71  "they ran out of money / in the MIDDLE of the month"
  // desk from above: a wall-calendar page on the cutting mat; days cross out in red pen; the 15th is circled on "middle".
  calendar() {
    const { st, sc, cam } = matDesk();
    const PW = 4.3, PH = PW * 1.18;
    const grain = noiseCanvas(300, 354, 0.5, 4);
    const tMid = tw('middle'), tRan = tw('ran');
    const cal = paperSheet(sc, PW, PH, (g, w, h, t = 0) => {
      g.fillStyle = '#f8f5ee'; g.fillRect(0, 0, w, h); g.globalAlpha = 0.06; g.drawImage(grain, 0, 0, w, h); g.globalAlpha = 1;
      g.fillStyle = '#2b2620'; g.font = 'italic 600 120px "Playfair Display"'; g.fillText('November', 70, 170);
      g.fillStyle = '#8a8478'; g.font = '600 30px Inter'; g.textAlign = 'right'; g.fillText('ALLOWANCE DAY: THE 1ST', w - 70, 170); g.textAlign = 'left';
      g.fillStyle = GOLD_MID; g.fillRect(70, 205, w - 140, 6);
      const x0 = 70, y0 = 280, cw = (w - 140) / 7, ch = (h - y0 - 60) / 5.4;
      g.fillStyle = '#8a8478'; g.font = '700 30px Inter'; g.textAlign = 'center';
      'SMTWTFS'.split('').forEach((c, i) => g.fillText(c, x0 + cw * (i + 0.5), y0));
      const days = 14 * eio((t - tRan) / Math.max(0.3, tMid - 0.12 - tRan));
      for (let d = 1; d <= 30; d++) {
        const k = d - 1 + 5, cx = x0 + cw * (k % 7 + 0.5), cy = y0 + 70 + ch * Math.floor(k / 7);
        g.fillStyle = '#d7d1c4'; g.fillRect(cx - cw / 2 + 6, cy - ch / 2 + 6, cw - 12, 2);
        g.fillStyle = '#2b2620'; g.font = '600 64px Inter'; g.fillText(String(d), cx, cy + 22);
        const u = clamp(days - (d - 1));
        if (d < 15 && u > 0) {                                     // red pen strike, drawn on
          g.strokeStyle = RED; g.lineWidth = 9; g.lineCap = 'round'; g.beginPath();
          g.moveTo(cx - 40, cy + 34); g.lineTo(cx - 40 + 80 * u, cy + 34 - 68 * u); g.stroke();
        }
        if (d === 15) {
          const v = eo((t - (tMid - 0.1)) / 0.45);
          if (v > 0) { g.strokeStyle = RED; g.lineWidth = 11; g.beginPath(); g.ellipse(cx, cy + 4, 70, 58, -0.2, -2.2, -2.2 + 6.9 * v); g.stroke(); }
        }
      }
      g.textAlign = 'left';
    });
    const note = canvasTex(400, 400, (g, w, h) => {
      g.fillStyle = '#ffd86b'; g.fillRect(0, 0, w, h); g.fillStyle = 'rgba(0,0,0,.05)'; g.fillRect(0, 0, w, 40);
      g.fillStyle = '#2b2620'; g.font = '700 74px Caveat'; g.textAlign = 'center'; g.fillText('wallet:', w / 2, 180); g.fillStyle = RED; g.fillText('$0 ?!', w / 2, 280);
    });
    const sticky = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.02, 1.7), [0, 0, 1, 0, 0, 0].map(k => k ? new THREE.MeshStandardMaterial({ map: note.t, roughness: 0.8 }) : new THREE.MeshStandardMaterial({ color: 0xffd86b })));
    sticky.castShadow = sticky.receiveShadow = true; sc.add(sticky);
    return t => {
      cal.tex.redraw(t);
      const u = eo((t - 0.02) / 0.6);
      cal.g.position.set(lerp(7.5, 0.3, u), 0.6 * (1 - u) * (1 - u), lerp(-0.6, -0.35, u)); cal.g.rotation.y = lerp(-0.5, 0.06, u);
      const s = eo((t - (tRan + 0.2)) / 0.4);
      sticky.visible = s > 0; sticky.position.set(lerp(-6, -1.25, s), 0.04, 3.05); sticky.rotation.set(0, lerp(-0.6, 0.18, s), 0);
      const p = eio(t / DUR);
      cam.position.set(0.1, lerp(14.4, 12.6, p), lerp(0.35, 0.15, p)); cam.lookAt(0.1, 0, lerp(0.34, 0.14, p));
      if (st.dofU) st.dofU.focus.value = cam.position.y;
      st.render(sc, cam);
    };
  },
});

// ------------------------------------------------------------------ the loan book (4 stages, one world): a ruled notepad on the cutting mat
function ledgerScene(stage) {
  const { st, sc, cam } = matDesk();
  const PW = 4.4, PH = PW * 1.3;
  const grain = noiseCanvas(300, 390, 0.5, 4);
  const has = w => WORDS.some(([, x]) => norm(x) === w);
  const at = (w, n = 0) => has(w) ? tw(w, n) : -99;
  // when each line is written (scene-local s); lines from earlier stages are already there
  const W1 = stage === 1 ? [at('pay'), at('interest')] : [-99, -99];
  const W2 = stage === 2 ? [at('daddy'), at('20'), at('5')] : stage > 2 ? [-99, -99, -99] : [1e9, 1e9, 1e9];
  const tTick = stage === 3 ? 0.15 : stage > 3 ? -99 : 1e9;
  const tStrike = stage === 3 ? at('interest') : stage > 3 ? -99 : 1e9;
  const tFirst = stage === 4 ? at('first') : 1e9;
  const pad = paperSheet(sc, PW, PH, (g, w, h, t = 0) => {
    g.fillStyle = '#fbf6e4'; g.fillRect(0, 0, w, h); g.globalAlpha = 0.06; g.drawImage(grain, 0, 0, w, h); g.globalAlpha = 1;
    g.strokeStyle = 'rgba(90,130,190,.35)'; g.lineWidth = 2; for (let y = 300; y < h - 40; y += 118) { g.beginPath(); g.moveTo(0, y); g.lineTo(w, y); g.stroke(); }
    g.strokeStyle = 'rgba(217,58,43,.45)'; g.lineWidth = 3; g.beginPath(); g.moveTo(150, 0); g.lineTo(150, h); g.stroke();
    g.fillStyle = INK; g.font = 'italic 600 128px "Playfair Display"'; g.fillText('Loans', 190, 200);
    g.fillStyle = '#8a8478'; g.font = '600 32px Inter'; g.fillText('WHO OWES ME  ·  AGE 15', 560, 196);
    const hand = '700 96px Caveat', hl = 'rgba(242,195,91,.75)';
    const w1 = (t - W1[0]) / 0.55, w1b = (t - W1[1]) / 0.4;
    writeOn(g, 'Friends & family', 190, 400, hand, INK, w1);
    writeOn(g, '+ interest', 760, 400, hand, GOLD_DK, w1b, hl, (t - W1[1] - 0.2) / 0.4);
    writeOn(g, 'Dad', 190, 640, '700 110px Caveat', INK, (t - W2[0]) / 0.25);
    writeOn(g, '$20', 470, 640, '700 120px Caveat', INK, (t - W2[1]) / 0.25);
    writeOn(g, '+ $5', 720, 640, '700 120px Caveat', GOLD_DK, (t - W2[2]) / 0.25, hl, (t - W2[2] - 0.15) / 0.35);
    const k = eo((t - tTick) / 0.25);                                  // $20 came back: tick
    if (k > 0) { g.strokeStyle = '#2E8B57'; g.lineWidth = 12; g.lineCap = 'round'; g.beginPath(); g.moveTo(60, 600); g.lineTo(60 + 30 * Math.min(1, k * 2), 600 + 32 * Math.min(1, k * 2)); if (k > 0.5) g.lineTo(90 + 50 * (k - 0.5) * 2, 632 - 80 * (k - 0.5) * 2); g.stroke(); }
    const s = eo((t - tStrike) / 0.25);                                // the interest never came: struck in red
    if (s > 0) { g.strokeStyle = RED; g.lineWidth = 12; g.lineCap = 'round'; g.beginPath(); g.moveTo(705, 612); g.lineTo(705 + 250 * s, 600 - 10 * s); g.stroke(); }
    if (stage >= 1) { const v = eo((t - W1[1] - 0.25) / 0.25); if (v > 0) { g.strokeStyle = '#2E8B57'; g.lineWidth = 12; g.beginPath(); g.moveTo(60, 360); g.lineTo(90, 392); g.lineTo(60 + 80 * v, 312); g.stroke(); } }
  });
  // labels: +INTEREST (stage 1), UNPAID (stage 3, red), FIRST BUSINESS (stage 4, gold)
  const lab = stage === 1 ? labelMesh(pad.g, '+ interest', { w: 3.0, h: 0.95 })
    : stage >= 3 ? labelMesh(pad.g, 'UNPAID', { w: 2.6, h: 0.9, bg: '#f3e6e2', fg: RED, font: '800 200px Anton' }) : null;
  const lab4 = stage === 4 ? labelMesh(pad.g, 'First business', { w: 3.6, h: 1.25, sub: 'EST. AGE 15', font: 'italic 600 150px "Playfair Display"' }) : null;
  const tLab = stage === 1 ? at('interest') + 0.25 : stage === 3 ? tStrike + 0.2 : -99;
  return t => {
    pad.tex.redraw(t);
    const u = stage === 1 ? eo((t - 0.02) / 0.55) : 1;                 // the pad slides in once (stage 1), then stays
    pad.g.position.set(lerp(7.5, 0.0, u), 0.6 * (1 - u) * (1 - u), stage === 4 ? -0.2 : -0.35); pad.g.rotation.y = lerp(-0.5, 0.05, u);
    if (lab) {
      const m = (t - (tLab - 0.06)) / 0.22, settled = stage === 4 || m > 1;
      lab.visible = stage === 4 || m > 0;
      lab.position.set(stage === 1 ? 0.6 : 0.9, 0.12 + (settled ? 0 : 2.5 * (1 - eo(m))), stage === 1 ? -0.1 : 1.1);
      lab.rotation.set(0, stage === 1 ? -0.08 : 0.16, 0); lab.scale.setScalar(settled ? 1 : lerp(1.3, 1, eo(m)));
    }
    if (lab4) {
      const m = (t - (tFirst - 0.06)) / 0.22;
      lab4.visible = m > 0; lab4.position.set(0.0, 0.16 + 2.8 * (1 - eo(m)), 2.15); lab4.rotation.set(0, -0.06, 0); lab4.scale.setScalar(lerp(1.35, 1, eo(m)));
    }
    const m3 = Math.max((t - (tLab + 0.16)), (t - (tFirst + 0.16)));
    const shake = m3 > 0 && m3 < 0.5 ? 0.04 * Math.sin(m3 * 60) * (1 - m3 / 0.5) : 0;
    const p = eio(t / DUR);
    const z0 = stage === 2 ? 0.55 : stage === 4 ? 0.9 : 0.2;                // frame the line being written
    cam.position.set(0.1 + shake, lerp(13.8, 12.4, p), z0 + 0.01 + shake); cam.lookAt(0.1, 0, z0);
    if (st.dofU) st.dofU.focus.value = cam.position.y;
    st.render(sc, cam);
  };
}
Object.assign(SCENES, { ledger1: () => ledgerScene(1), ledger2: () => ledgerScene(2), ledger3: () => ledgerScene(3), ledger4: () => ledgerScene(4) });

// ------------------------------------------------------------------ text behind the speaker (python keeps only pixels outside her matte)
function rotoText(text, word, { size = 420, top = 250, count = null, letters = false } = {}) {
  const a = el('div', { position: 'absolute', left: '0', width: '1080px', top: top + 'px', textAlign: 'center', font: `${size}px/1 Anton`, color: '#F7F1E6', letterSpacing: '4px',
    textShadow: `0 0 40px rgba(242,195,91,.45), 0 8px 0 ${GOLD_MID}, 0 16px 0 ${GOLD_DK}, 0 26px 34px rgba(0,0,0,.5)` }, S, text);
  const tk = tw(word);
  const spans = letters ? (a.innerHTML = '', [...text].map(ch => el('span', { display: 'inline-block' }, a, ch))) : null;
  return t => {
    const u = (t - (tk - 0.35)) / 0.45;
    a.style.opacity = clamp(u * 1.8);
    a.style.transform = `translateY(${200 * (1 - eo(u))}px) scale(${lerp(0.92, 1, eo(u)) + 0.02 * clamp(t - tk)})`;
    if (count) { const v = Math.round(+count.replace(/\D/g, '') * eo((t - (tk - 0.45)) / 0.45)); a.textContent = count.replace(/\d+/, String(v)); }
    if (spans) spans.forEach((s, i) => { const r = mulberry(i * 31 + 7)(); const v = (t - (tk - 0.2) - 0.35 * r) / 0.22; s.style.opacity = clamp(v * 2); s.style.transform = `translateY(${60 * (1 - eo(v))}px)`; });
  };
}
Object.assign(SCENES, {
  r20a: () => rotoText('$20', '20', { count: '$20' }),
  r15: () => rotoText('15', '15', { size: 520, top: 200, count: '15' }),
  r20b: () => rotoText('$20', '20'),
  rent: () => rotoText('ENTREPRENEURSHIP', 'entrepreneurship', { size: 150, top: 330, letters: true }),

  // ------------------------------------------------------------------ house captions over the A-roll (whole timeline; python decides where they show)
  // Medium + Bold pair: Inter run-ins, gold serif-italic keyword (red for negatives), word-by-word rise-in, blur exit.
  caps() {
    const chunks = (CUES.chunks || []).map(c => {
      const box = layer(); box.style.display = 'none';
      const words = c.words.filter(([, , m]) => m !== '~');
      // group: consecutive run words share a line (wrapped), each keyword run gets its own line
      const lines = []; let cur = null;
      for (const [t, w, m] of words) {
        const kw = m === '*' || m === '!' || m === '^';
        if (!cur || cur.kw !== kw) { cur = { kw, items: [] }; lines.push(cur); }
        cur.items.push([t, w, m]);
      }
      const out = [];
      for (const L of lines) {
        if (L.kw) out.push(L);
        else { let row = { kw: false, items: [] }, len = 0; for (const it of L.items) { if (len + it[1].length > 24 && row.items.length) { out.push(row); row = { kw: false, items: [] }; len = 0; } row.items.push(it); len += it[1].length + 1; } out.push(row); }
      }
      let y = 1470; const ups = [];
      for (const L of out.reverse()) {
        const size = L.kw ? Math.min(170, Math.floor(1700 / Math.max(6, L.items.map(i => i[1]).join(' ').length))) : 62;
        y -= L.kw ? size * 0.98 : 78;
        ups.push(line(box, y, L.items.map(([t, w, m]) => ({ w, t, cls: L.kw ? 'kw' + (m === '!' ? ' kwn' : '') : 'run', css: L.kw ? { fontSize: size + 'px' } : { fontWeight: '600', fontSize: '62px' } }))));
      }
      return { box, ups, t0: c.t0, t1: c.t1 };
    });
    return t => chunks.forEach(c => { chunkVis(c.box, t, c.t0, c.t1); if (c.box.style.display !== 'none') c.ups.forEach(f => f(t)); });
  },
});
