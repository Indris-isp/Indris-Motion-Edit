// v2.1 scenes (client notes round 2): 3D coin rain + phone (0:10), V12-style puzzle world (0:14),
// V08-style cutting mat (0:20-0:25), 3D lottery purchase (0:31-0:34). Loaded after scenes.js; extends SCENES.
// three.js r149 (MIT) is vendored in vendor/three.min.js.

function mulberry(a) { return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }

function makeRenderer() {
  const cv = el('canvas', { position: 'absolute', left: '0', top: '0', width: '1080px', height: '1920px' });
  cv.width = 1080; cv.height = 1920;
  const R = new THREE.WebGLRenderer({ canvas: cv, antialias: true, alpha: true, preserveDrawingBuffer: true });
  R.setPixelRatio(1); R.setSize(1080, 1920, false);
  R.outputEncoding = THREE.sRGBEncoding; R.toneMapping = THREE.ACESFilmicToneMapping; R.toneMappingExposure = 1.0;
  R.shadowMap.enabled = true; R.shadowMap.type = THREE.PCFSoftShadowMap;
  // studio environment for reflections: a grey room with three bright softboxes
  const pm = new THREE.PMREMGenerator(R), env = new THREE.Scene();
  env.background = new THREE.Color(0x5a6066);
  for (const [x, y, z, w, h, c] of [[0, 6, 0, 10, 1, 0xffffff], [-6, 1, 2, 1, 6, 0xdff6ff], [6, 2, -2, 1, 5, 0xffffff], [0, -5, 0, 14, 1, 0x30363c]]) {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, w > h ? 3 : 3), new THREE.MeshBasicMaterial({ color: c })); m.position.set(x, y, z); env.add(m);
  }
  return { R, cv, envMap: pm.fromScene(env, 0.04).texture };
}

function coinFace(size = 512) {
  const c = document.createElement('canvas'); c.width = c.height = size; const g = c.getContext('2d'); const r = size / 2;
  const grd = g.createRadialGradient(r * 0.8, r * 0.7, r * 0.1, r, r, r);
  grd.addColorStop(0, '#bff3ff'); grd.addColorStop(0.55, '#5FD8F5'); grd.addColorStop(1, '#1a8fb0');
  g.fillStyle = grd; g.beginPath(); g.arc(r, r, r, 0, 7); g.fill();
  g.lineWidth = size * 0.05; g.strokeStyle = '#2aa6c8'; g.beginPath(); g.arc(r, r, r * 0.86, 0, 7); g.stroke();
  g.lineWidth = size * 0.012; g.strokeStyle = 'rgba(255,255,255,.6)'; g.beginPath(); g.arc(r, r, r * 0.8, 0, 7); g.stroke();
  g.font = `800 ${size * 0.62}px Inter, sans-serif`; g.textAlign = 'center'; g.textBaseline = 'middle';
  g.fillStyle = '#137b97'; g.fillText('$', r + size * 0.012, r + size * 0.03);
  g.fillStyle = '#e9fbff'; g.fillText('$', r - size * 0.008, r + size * 0.01);
  const t = new THREE.CanvasTexture(c); t.encoding = THREE.sRGBEncoding; t.anisotropy = 4; return t;
}

function roundedRect(w, h, r) {
  const s = new THREE.Shape(), x = -w / 2, y = -h / 2;
  s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r); s.lineTo(x + w, y + h - r);
  s.quadraticCurveTo(x + w, y + h, x + w - r, y + h); s.lineTo(x + r, y + h); s.quadraticCurveTo(x, y + h, x, y + h - r);
  s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y); return s;
}

Object.assign(SCENES, {
  // 9.70-13.19  "that brings you / Income first."  3D phone flies in, balance counts up, cyan coins burst and rain, pile up
  coins() {
    el('div', { position: 'absolute', inset: '0', background: 'radial-gradient(ellipse 85% 60% at 50% 55%, #f4f6f7 0%, #e3e7ea 55%, #c9cfd4 100%)' });
    const { R, envMap } = makeRenderer();
    const sc = new THREE.Scene(); sc.environment = envMap;
    const cam = new THREE.PerspectiveCamera(30, 1080 / 1920, 0.1, 100);
    sc.add(new THREE.HemisphereLight(0xffffff, 0x9aa4ab, 0.55));
    const key = new THREE.DirectionalLight(0xffffff, 1.6); key.position.set(4, 9, 8); key.castShadow = true;
    key.shadow.mapSize.set(2048, 2048); Object.assign(key.shadow.camera, { left: -8, right: 8, top: 10, bottom: -10 }); key.shadow.radius = 6; sc.add(key);
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(40, 40), new THREE.ShadowMaterial({ opacity: 0.16 }));
    floor.rotation.x = -Math.PI / 2; floor.position.y = -5.1; floor.receiveShadow = true; sc.add(floor);
    // phone
    const phone = new THREE.Group(); sc.add(phone);
    const body = new THREE.Mesh(new THREE.ExtrudeGeometry(roundedRect(3.1, 6.3, 0.5), { depth: 0.22, bevelEnabled: true, bevelThickness: 0.08, bevelSize: 0.08, bevelSegments: 6, curveSegments: 24 }),
      new THREE.MeshStandardMaterial({ color: 0x23282e, metalness: 0.85, roughness: 0.28, envMapIntensity: 1.2 }));
    body.position.z = -0.15; body.castShadow = true; phone.add(body);
    const ui = document.createElement('canvas'); ui.width = 560; ui.height = 1160; const g = ui.getContext('2d');
    const uiTex = new THREE.CanvasTexture(ui); uiTex.encoding = THREE.sRGBEncoding;
    const screen = new THREE.Mesh(new THREE.ShapeGeometry(roundedRect(2.92, 6.12, 0.42)), new THREE.MeshBasicMaterial({ map: uiTex, toneMapped: false }));
    // ShapeGeometry UVs are in shape units: remap to 0..1
    const uv = screen.geometry.attributes.uv; for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) / 2.92 + 0.5, uv.getY(i) / 6.12 + 0.5);
    screen.position.z = 0.16; phone.add(screen);
    const drawUI = (t) => {
      const v = Math.round(12480 + (58020 - 12480) * eo((t - 0.85) / 2.3));
      g.fillStyle = '#f7f9fb'; g.fillRect(0, 0, 560, 1160);
      g.fillStyle = '#0F1113'; g.font = '600 26px Inter'; g.fillText('9:41', 52, 62);
      g.fillStyle = '#0F1113'; g.beginPath(); g.roundRect ? g.roundRect(205, 32, 150, 44, 22) : g.rect(205, 32, 150, 44); g.fill();
      g.fillStyle = '#69717a'; g.font = '500 28px Inter'; g.fillText('Total income', 48, 190);
      g.fillStyle = '#0F1113'; g.font = '800 84px Inter'; g.fillText('$' + v.toLocaleString('en-US'), 44, 285);
      g.fillStyle = '#1592B4'; g.font = '700 26px Inter'; g.fillText('▲ ' + Math.round((v - 12480) / 12480 * 100) + '% this month', 48, 335);
      // chart
      const pts = 14, grow = clamp((t - 0.85) / 2.3);
      g.beginPath(); g.moveTo(40, 620);
      const ys = []; for (let i = 0; i < pts; i++) { const x = 40 + i * 480 / (pts - 1); const y = 600 - (i / (pts - 1)) * 190 * grow - 28 * Math.sin(i * 1.3) * grow; ys.push([x, y]); g.lineTo(x, y); }
      g.lineTo(520, 620); g.closePath();
      const gr = g.createLinearGradient(0, 380, 0, 620); gr.addColorStop(0, 'rgba(95,216,245,.55)'); gr.addColorStop(1, 'rgba(95,216,245,0)'); g.fillStyle = gr; g.fill();
      g.beginPath(); ys.forEach(([x, y], i) => i ? g.lineTo(x, y) : g.moveTo(x, y)); g.strokeStyle = '#1592B4'; g.lineWidth = 5; g.stroke();
      for (let i = 0; i < 4; i++) {
        const y = 700 + i * 105; g.fillStyle = ['#5FD8F5', '#0F1113', '#BFEFFB', '#1592B4'][i]; g.beginPath(); g.arc(80, y, 30, 0, 7); g.fill();
        g.fillStyle = '#0F1113'; g.font = '600 28px Inter'; g.fillText(['Salary', 'Real estate', 'Dividends', 'Side job'][i], 130, y + 10);
        g.fillStyle = '#1592B4'; g.font = '700 28px Inter'; g.fillText('+$' + [4200, 1850, 640, 900][i].toLocaleString('en-US'), 400, y + 10);
      }
      uiTex.needsUpdate = true;
    };
    // coins
    const face = coinFace();
    const side = new THREE.MeshStandardMaterial({ color: 0x3fc3e4, metalness: 0.75, roughness: 0.22, envMapIntensity: 1.3 });
    const top = new THREE.MeshStandardMaterial({ map: face, metalness: 0.55, roughness: 0.25, envMapIntensity: 1.2 });
    const cg = new THREE.CylinderGeometry(0.62, 0.62, 0.13, 48);
    const rnd = mulberry(11), coins = [];
    for (let i = 0; i < 52; i++) {
      const m = new THREE.Mesh(cg, [side, top, top]); m.castShadow = true; sc.add(m);
      const burst = i < 24;
      const c = burst ? { t0: 0.72 + i * 0.022, p: [0, 0.6, -0.4], v: [(rnd() - 0.5) * 11, 4 + rnd() * 6, 1 + rnd() * 4] }
                      : { t0: 0.95 + (i - 24) * 0.055, p: [(rnd() - 0.5) * 8, 8 + rnd() * 3, -1 + rnd() * 4], v: [(rnd() - 0.5) * 1.5, -3 - rnd() * 3, 0] };
      c.spin = [(rnd() - 0.5) * 14, (rnd() - 0.5) * 10, (rnd() - 0.5) * 14]; c.rest = [(rnd() - 0.5) * 0.5, rnd() * 6, (rnd() - 0.5) * 0.5];
      c.floor = -4.6 + rnd() * 0.5; coins.push([m, c]);
    }
    const G = -15;
    return t => {
      cam.position.set(0, 0.2, 21 - 1.2 * t / DUR); cam.lookAt(0, -0.4, 0);
      // phone flight: off-screen bottom-left, tumbling -> centre, turning to face the camera
      const u = eio(t / 0.95), f = eio((t - 0.6) / 2.0);
      phone.position.set(lerp(-6, 0, u), lerp(-12, -0.6, u) + 0.08 * Math.sin(t * 2.2), lerp(3, 0, u));
      phone.rotation.set(lerp(lerp(-1.2, 0.32, u), 0.04, f), lerp(lerp(1.1, -0.42, u), 0, f), lerp(lerp(0.6, 0.16, u), 0, f));
      drawUI(t);
      for (const [m, c] of coins) {
        const d = t - c.t0;
        if (d < 0) { m.visible = false; continue; }
        m.visible = true;
        let x = c.p[0] + c.v[0] * d, y = c.p[1] + c.v[1] * d + 0.5 * G * d * d, z = c.p[2] + c.v[2] * d;
        let rx = c.spin[0] * d + Math.PI / 2, ry = c.spin[1] * d, rz = c.spin[2] * d;
        // landing time on its floor
        const a = 0.5 * G, b = c.v[1], cc = c.p[1] - c.floor, disc = b * b - 4 * a * cc;
        const tl = disc > 0 ? (-b - Math.sqrt(disc)) / (2 * a) : 1e9;
        if (d > tl) {
          x = c.p[0] + c.v[0] * tl; z = c.p[2] + c.v[2] * tl; y = c.floor;
          const k = eo((d - tl) / 0.18);
          rx = lerp(c.spin[0] * tl + Math.PI / 2, c.rest[0], k); ry = c.rest[1]; rz = lerp(c.spin[2] * tl, c.rest[2], k);
          x = clamp(x, -4.2, 4.2);
        }
        m.position.set(x, y, z); m.rotation.set(rx, ry, rz);
      }
      R.render(sc, cam);
    };
  },

  // caption for the coin scene (dark text on the light studio)
  coins_text() {
    const r1 = line(S, 170, [run('that'), run('brings'), run('you')], { font: '600 58px Inter, sans-serif' });
    S.querySelectorAll('.w').forEach(s => { s.style.color = BASE; s.style.textShadow = 'none'; });
    const big = el('div', { position: 'absolute', left: '0', width: '1080px', top: '245px', textAlign: 'center', font: '400 200px/1 "Instrument Serif", serif', color: BASE }, S);
    const a = el('span', {}, big, 'Income', 'w'), b = el('span', { fontStyle: 'italic', color: '#1592B4' }, big, ' first.', 'w');
    return t => { r1(t); reveal(a, t, tw('income'), 34, 0.3); reveal(b, t, tw('first'), 34, 0.3); };
  },

  // 13.19-17.33  V12-style puzzle world: cream paper, big soft bulb, thick pieces drifting together, extruded keyword
  puzzle_v12() {
    const cam = el('div', { position: 'absolute', left: '0', top: '0', width: '1080px', height: '2700px', transformOrigin: '540px 960px' });
    el('div', { position: 'absolute', inset: '0', background: 'radial-gradient(ellipse 90% 55% at 55% 40%, #f3eee8 0%, #e7e0d8 55%, #d9d1c8 100%)' }, cam);
    const NS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(NS, 'svg'); svg.setAttribute('width', 1080); svg.setAttribute('height', 2700); svg.style.position = 'absolute'; cam.appendChild(svg);
    const s = 300;
    const A = `M0,0 H${s} V${s * .37} A${s * .15},${s * .15} 0 1 1 ${s},${s * .63} V${s} H0 Z`;
    const B = `M0,0 H${s} V${s} H0 V${s * .63} A${s * .15},${s * .15} 0 1 0 0,${s * .37} Z`;
    svg.innerHTML = `<defs>
      <linearGradient id="pf" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7fe0f7"/><stop offset="1" stop-color="#2aa7c9"/></linearGradient>
      <filter id="ls" x="-50%" y="-50%" width="220%" height="220%"><feGaussianBlur stdDeviation="22"/></filter>
      <filter id="soft" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="9"/></filter>
      <radialGradient id="bg1" cx=".4" cy=".35" r=".7"><stop offset="0" stop-color="#ffffff"/><stop offset=".7" stop-color="#eef2f4"/><stop offset="1" stop-color="#cfd8dd"/></radialGradient>
      <radialGradient id="glow"><stop offset="0" stop-color="#9ff0ff" stop-opacity=".9"/><stop offset="1" stop-color="#5FD8F5" stop-opacity="0"/></radialGradient></defs>
      <g id="bulb" filter="url(#soft)" transform="translate(-60,330) rotate(-28)">
        <circle cx="160" cy="160" r="560" fill="url(#glow)" id="bglow" opacity="0"/>
        <circle cx="160" cy="160" r="300" fill="url(#bg1)"/>
        <path d="M30,380 L290,380 L270,520 L50,520 Z" fill="#d7dde1"/><rect x="40" y="520" width="240" height="40" rx="18" fill="#bfc8ce"/>
        <rect x="50" y="575" width="220" height="40" rx="18" fill="#aeb8bf"/></g>
      <circle cx="1030" cy="2050" r="230" fill="#5FD8F5" opacity=".55" filter="url(#ls)"/>
      <circle cx="120" cy="2500" r="200" fill="#5FD8F5" opacity=".35" filter="url(#ls)"/>`;
    const piece = (d) => {
      const g = document.createElementNS(NS, 'g');
      g.innerHTML = `<path d="${d}" fill="#000" opacity=".28" filter="url(#ls)" transform="translate(42,62)"/>
        ${[16, 12, 8, 4].map(o => `<path d="${d}" fill="#1a86a6" transform="translate(${o * .5},${o})"/>`).join('')}
        <path d="${d}" fill="url(#pf)"/><path d="${d}" fill="none" stroke="#bff3ff" stroke-width="3" opacity=".6"/>`;
      svg.appendChild(g); return g;
    };
    const gA = piece(A), gB = piece(B);
    const glow = svg.querySelector('#bglow');
    // text (V12: grey rounded sans run-ins, keyword in thick extruded type that sharpens in)
    const grey = { font: '500 50px Poppins, Inter, sans-serif', color: '#4a4a4a', textShadow: 'none' };
    const ext = (c) => ({ font: '800 132px/1 Poppins, sans-serif', color: c, letterSpacing: '-2px',
      textShadow: [1, 2, 3, 4, 5, 6, 7, 8].map(i => `0 ${i}px 0 #157a96`).join(',') + ', 0 22px 26px rgba(0,0,0,.25)' });
    const gr = w => run(w, { css: grey });
    const r1 = line(cam, 1290, [gr('if'), gr('you'), gr('can')]);
    const k1 = line(cam, 1360, [{ w: 'find', t: tw('find'), css: ext('#3fc6e8') }, { w: 'a', t: tw('a'), css: ext('#3fc6e8') }, { w: 'way', t: tw('way'), css: ext('#3fc6e8') }]);
    const r2 = line(cam, 1870, [{ w: 'to', t: tw('to'), css: grey }, gr('have'), gr('those')]);
    const big2 = Object.assign(ext('#3fc6e8'), { fontSize: '92px' });
    const k2 = line(cam, 1945, [{ w: 'checks', t: tw('checks'), css: big2 }, { w: 'rolling', t: tw('rolling'), css: big2 }, { w: 'in', t: tw('in'), css: big2 }]);
    const tJ = tw('way'), tT = tw('to');
    const bez = (p0, p1, p2, p3, u) => { const v = 1 - u; return [0, 1].map(k => v * v * v * p0[k] + 3 * v * v * u * p1[k] + 3 * v * u * u * p2[k] + u * u * u * p3[k]); };
    return t => {
      // V12: the pieces drift slowly toward each other on a gentle curve and lock on "way"
      const u = eio((t + 0.25) / (tJ + 0.25));
      const [ax, ay] = bez([60, 1010], [160, 900], [190, 830], [240, 860], u);
      const [bx, by] = bez([760, 760], [700, 820], [600, 880], [540, 860], u);
      gA.setAttribute('transform', `translate(${ax},${ay}) rotate(${lerp(-16, 0, u)} ${s / 2} ${s / 2})`);
      gB.setAttribute('transform', `translate(${bx},${by}) rotate(${lerp(14, 0, u)} ${s / 2} ${s / 2})`);
      glow.setAttribute('opacity', (0.95 * eo((t - tJ) / 0.4)).toFixed(3));
      // camera: slow push; a quick tilt up for the second line (V12 whip-tilt)
      const c = eio((t - tT + 0.05) / 0.42);
      cam.style.transform = `translateY(${-540 * c}px) scale(${1.0 + 0.04 * t / DUR})`;
      cam.style.filter = c > 0.06 && c < 0.94 ? `blur(${5 * Math.sin(Math.PI * c)}px)` : '';
      r1(t); k1(t); r2(t); k2(t);
    };
  },

  // 19.96-24.95  V08-style cutting mat: a folded paper slides in and settles; serif lines write on with a tan highlight;
  // the lower half fills with "that brings / the money in" (same sheet, no pan); MONEY IN sticker slams on
  mat() {
    const cam = el('div', { position: 'absolute', left: '-300px', top: '-300px', width: '1680px', height: '2900px', transformOrigin: '840px 1260px',
      backgroundColor: '#3f9a58', backgroundImage: 'linear-gradient(rgba(255,255,255,.28) 2px, transparent 2px), linear-gradient(90deg, rgba(255,255,255,.28) 2px, transparent 2px), linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
      backgroundSize: '220px 220px, 220px 220px, 44px 44px, 44px 44px' });
    el('div', { position: 'absolute', inset: '0', background: 'radial-gradient(ellipse at 50% 45%, rgba(255,255,255,.12), rgba(0,0,0,.28) 100%)' }, cam);
    const paper = el('div', { position: 'absolute', left: '480px', top: '510px', width: '760px', height: '1240px', background: 'linear-gradient(180deg,#fbfaf7 0%, #f2f0ea 49.6%, #e3e0d8 50%, #f6f4ef 50.6%, #fbfaf7 100%)',
      boxShadow: '0 24px 40px rgba(0,0,0,.35), 0 4px 8px rgba(0,0,0,.2)', transformOrigin: '50% 50%' }, cam);
    el('div', { position: 'absolute', left: '60px', top: '52px', font: '700 22px Inter', color: '#8a8478', letterSpacing: '.3em' }, paper, 'OFFER LETTER');
    const serif = { font: '600 112px/1 "Playfair Display", serif', color: '#3a3833' };
    const word = (parent, text, t0, top, css = {}) => {
      const w = el('div', Object.assign({ position: 'absolute', top: top + 'px', whiteSpace: 'nowrap' }, serif, css), parent);
      const hl = el('div', { position: 'absolute', left: '-10px', right: '-10px', top: '38%', height: '52%', background: 'rgba(214,190,140,.55)', transformOrigin: 'left center' }, w);
      el('span', { position: 'relative' }, w, text);
      return [w, hl, t0];
    };
    // top half: "you find a / full-time job"
    const W = [word(paper, 'you find a', tw('you'), 150, { left: '70px', fontSize: '86px' }),
               word(paper, 'full-time job', tw('full-time'), 260, { left: '60px' }),
               word(paper, 'that brings', tw('that'), 700, { left: '70px' }),
               word(paper, 'the money in', tw('money'), 830, { left: '60px' })];
    const sticker = el('div', { position: 'absolute', left: '160px', top: '1010px', padding: '8px 26px', background: 'rgba(20,24,26,.82)', font: '700 120px/1 "Playfair Display", serif',
      color: ACC, textShadow: '0 0 18px rgba(95,216,245,.5)', transform: 'rotate(-4deg)', opacity: '0' }, paper, 'Money in');
    const tF = tw('full-time'), tM = tw('money'), tThat = tw('that');
    return t => {
      // paper slides in from the right with a little rotation and settles (V08), then the camera drifts and rotates slowly
      const u = eo((t - 0.08) / 0.55);
      paper.style.transform = `translate(${lerp(900, 0, u)}px, ${lerp(120, 0, u)}px) rotate(${lerp(-18, -7, u)}deg)`;
      paper.style.filter = u < 0.9 ? `blur(${6 * (1 - u)}px)` : '';
      const fill = eio((t - tThat + 0.6) / 0.9);                                       // after "full-time job", the camera moves down the sheet
      cam.style.transform = `translate(${lerp(-150, -150, fill)}px, ${lerp(20, -380, fill)}px) rotate(${lerp(-1.5, 2.5, t / DUR)}deg) scale(${lerp(1.0, 1.08, t / DUR)})`;
      W.forEach(([w, hl, t0], i) => {
        const v = (t - (t0 - LEAD)) / 0.32;
        w.style.opacity = clamp(v * 1.8); w.style.filter = `blur(${8 * (1 - eo(v))}px)`; w.style.transform = `translateY(${18 * (1 - eo(v))}px)`;
        hl.style.transform = `scaleX(${eo((t - t0 - 0.12) / 0.4)})`;
      });
      const um = (t - (tM - 0.02)) / 0.26;
      sticker.style.opacity = clamp(um * 3); sticker.style.transform = `rotate(-4deg) scale(${lerp(1.8, 1, back(um, 1.2))})`;
    };
  },

  // 31.61-34.39  3D lottery purchase: neon LOTTERY sign, cash slides to the terminal, PAID, ticket prints and flies to camera
  lottery3d() {
    el('div', { position: 'absolute', inset: '0', background: 'radial-gradient(ellipse 80% 50% at 50% 30%, #14313a 0%, #0c1519 50%, #070a0b 100%)' });
    el('div', { position: 'absolute', inset: '0', opacity: '.5', backgroundImage: 'repeating-linear-gradient(90deg, rgba(255,255,255,.03) 0 2px, transparent 2px 120px)' });
    const neon = el('div', { position: 'absolute', left: '0', width: '1080px', top: '250px', textAlign: 'center', font: '150px/1 Anton', color: '#dff8ff', letterSpacing: '10px',
      textShadow: '0 0 10px #5FD8F5, 0 0 30px #5FD8F5, 0 0 70px #5FD8F5, 0 0 120px rgba(95,216,245,.6)' }, S, 'LOTTERY');
    const { R, envMap } = makeRenderer();
    const sc = new THREE.Scene(); sc.environment = envMap;
    const cam = new THREE.PerspectiveCamera(32, 1080 / 1920, 0.1, 100);
    sc.add(new THREE.HemisphereLight(0xcff6ff, 0x101418, 0.5));
    const key = new THREE.SpotLight(0xffffff, 2.4, 40, 0.6, 0.6); key.position.set(-2, 9, 7); key.castShadow = true; key.shadow.mapSize.set(2048, 2048); sc.add(key); sc.add(key.target);
    const rim = new THREE.PointLight(0x5FD8F5, 1.6, 20); rim.position.set(0, 4, -4); sc.add(rim);
    // counter
    const counter = new THREE.Mesh(new THREE.BoxGeometry(14, 1, 7), new THREE.MeshStandardMaterial({ color: 0x1a120c, roughness: 0.45, metalness: 0.05, envMapIntensity: 0.25 }));
    counter.position.set(0, -3.5, 0); counter.receiveShadow = true; sc.add(counter);
    const edge = new THREE.Mesh(new THREE.BoxGeometry(14, 0.08, 0.08), new THREE.MeshBasicMaterial({ color: 0x5FD8F5 })); edge.position.set(0, -3.0, 3.5); sc.add(edge);
    // terminal with a screen
    const term = new THREE.Group(); term.position.set(1.7, -3.0, -0.6); term.rotation.y = -0.35; sc.add(term);
    const tb = new THREE.Mesh(new THREE.BoxGeometry(2.8, 1.5, 2.0), new THREE.MeshStandardMaterial({ color: 0xe9e6df, roughness: 0.4 })); tb.position.y = 0.75; tb.castShadow = true; term.add(tb);
    const tsCan = document.createElement('canvas'); tsCan.width = 512; tsCan.height = 256; const tg = tsCan.getContext('2d');
    const tsTex = new THREE.CanvasTexture(tsCan); tsTex.encoding = THREE.sRGBEncoding;
    const scr = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 1.1), new THREE.MeshBasicMaterial({ map: tsTex, toneMapped: false }));
    scr.position.set(0, 1.62, 0.2); scr.rotation.x = -1.05; term.add(scr);
    const slot = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.06, 0.3), new THREE.MeshBasicMaterial({ color: 0x111111 })); slot.position.set(0, 1.0, 1.0); term.add(slot);
    const drawTS = (paid) => {
      tg.fillStyle = '#071216'; tg.fillRect(0, 0, 512, 256); tg.textAlign = 'center';
      tg.fillStyle = paid ? '#5FD8F5' : '#cfeff8'; tg.font = '700 64px Inter'; tg.fillText(paid ? 'PAID ✓' : 'LOTTO', 256, 120);
      tg.fillStyle = '#7d9aa3'; tg.font = '600 40px Inter'; tg.fillText('1 ticket · $2.00', 256, 200); tsTex.needsUpdate = true;
    };
    // cash: two notes
    const noteCan = document.createElement('canvas'); noteCan.width = 512; noteCan.height = 220; const ng = noteCan.getContext('2d');
    ng.fillStyle = '#cfe0cb'; ng.fillRect(0, 0, 512, 220); ng.strokeStyle = '#6e8e6c'; ng.lineWidth = 10; ng.strokeRect(12, 12, 488, 196);
    ng.fillStyle = '#7f9e7c'; ng.beginPath(); ng.ellipse(256, 110, 60, 70, 0, 0, 7); ng.fill(); ng.fillStyle = '#4c6b4a'; ng.font = '700 48px Inter'; ng.fillText('1', 40, 70); ng.fillText('1', 450, 190);
    const noteTex = new THREE.CanvasTexture(noteCan); noteTex.encoding = THREE.sRGBEncoding;
    const notes = [0, 1].map(i => { const m = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 1.03), new THREE.MeshStandardMaterial({ map: noteTex, roughness: 0.8, side: THREE.DoubleSide }));
      m.rotation.x = -Math.PI / 2; m.castShadow = true; sc.add(m); return m; });
    // ticket
    const tkCan = document.createElement('canvas'); tkCan.width = 800; tkCan.height = 400; const kg = tkCan.getContext('2d');
    const kgr = kg.createLinearGradient(0, 0, 0, 400); kgr.addColorStop(0, '#fbf2da'); kgr.addColorStop(1, '#ead6a8'); kg.fillStyle = kgr; kg.fillRect(0, 0, 800, 400);
    kg.strokeStyle = '#c49a4a'; kg.lineWidth = 10; kg.strokeRect(14, 14, 772, 372); kg.setLineDash([12, 10]); kg.lineWidth = 4; kg.beginPath(); kg.moveTo(205, 30); kg.lineTo(205, 370); kg.stroke(); kg.setLineDash([]);
    kg.fillStyle = '#0E6E85'; kg.font = '112px Anton'; kg.textAlign = 'center'; kg.fillText('LOTTERY', 500, 150);
    kg.fillStyle = '#0F1113'; kg.font = '600 30px Inter'; kg.fillText('T  I  C  K  E  T', 500, 195);
    ['07', '14', '23', '38', '41'].forEach((n, i) => { const x = 320 + i * 90; kg.fillStyle = '#fffdf6'; kg.beginPath(); kg.arc(x, 265, 36, 0, 7); kg.fill(); kg.strokeStyle = '#5FD8F5'; kg.lineWidth = 6; kg.stroke(); kg.fillStyle = '#0F1113'; kg.font = '700 30px Inter'; kg.fillText(n, x, 276); });
    kg.save(); kg.translate(110, 200); kg.rotate(-Math.PI / 2); kg.fillStyle = '#0F1113'; kg.font = '44px Anton'; kg.fillText('No. 0451', 0, 15); kg.restore();
    const tkTex = new THREE.CanvasTexture(tkCan); tkTex.encoding = THREE.sRGBEncoding; tkTex.anisotropy = 4;
    const ticket = new THREE.Mesh(new THREE.PlaneGeometry(2.0, 1.0), new THREE.MeshStandardMaterial({ map: tkTex, roughness: 0.55, side: THREE.DoubleSide })); ticket.castShadow = true; sc.add(ticket);
    // captions
    const c1 = el('div', { position: 'absolute', left: '0', top: '0', width: '1080px', height: '1920px' }), c2 = el('div', { position: 'absolute', left: '0', top: '0', width: '1080px', height: '1920px' }), c3 = el('div', { position: 'absolute', left: '0', top: '0', width: '1080px', height: '1920px' });
    const l1 = line(c1, 1540, [{ w: 'I', t: tw('mean') - 0.25 }, run('mean,'), run("you're")]);
    const l2 = line(c2, 1540, [run('better'), run('off'), run('buying'), { w: 'a', t: tw('a') }]);
    const l3 = line(c3, 1490, [{ w: 'lottery ticket', t: tw('lottery'), cls: 'kw', css: { fontSize: '170px' } }]);
    const tL = tw('lottery'), T = [0, tw('better'), tL, DUR + 1];
    const tPaid = 1.05, tPrint = 1.15, tFly = tL - 0.35;
    return t => {
      cam.position.set(lerp(-0.6, 0.4, t / DUR), 3.2, 12.5 - 1.0 * t / DUR); cam.lookAt(0.3, -2.0, 0);
      neon.style.opacity = (0.88 + 0.12 * Math.sin(t * 23) * Math.sin(t * 7)).toFixed(3);
      // cash slides across the counter to the terminal, then is taken in
      notes.forEach((m, i) => {
        const u = eo((t - 0.12 - i * 0.12) / 0.75), gone = eo((t - 0.95 - i * 0.05) / 0.3);
        m.position.set(lerp(-6.5, 0.2 + i * 0.15, u) + 0.9 * gone, -2.98 + i * 0.012, lerp(2.6, 1.2 + i * 0.1, u) - 1.2 * gone);
        m.rotation.z = lerp(0.5 - i * 0.2, 0.1 - i * 0.12, u); m.visible = gone < 0.98; m.material.opacity = 1;
      });
      drawTS(t > tPaid);
      // the ticket prints out of the slot, then flies up to the camera and turns to face it
      const p = eo((t - tPrint) / 0.5), fly = eio((t - tFly) / 0.55);
      const base = new THREE.Vector3(1.36, -1.98, 0.34);                // the terminal's slot, in world space
      const printed = new THREE.Vector3(base.x + 0.35 * p, base.y - 0.02, base.z + 0.4 + 0.5 * p);
      const dest = new THREE.Vector3(0.3, 0.6, 6.2);
      ticket.position.lerpVectors(printed, dest, fly);
      ticket.rotation.set(lerp(-Math.PI / 2 + 0.15, -0.28, fly), lerp(-0.35, 0.05, fly) + 0.05 * Math.sin(t * 2), lerp(0, -0.06, fly));
      ticket.scale.setScalar(lerp(lerp(0.2, 1.0, p), 1.25, fly)); ticket.visible = t > tPrint;
      R.render(sc, cam);
      [c1, c2, c3].forEach((c, i) => chunkVis(c, t, T[i], T[i + 1] - LEAD)); l1(t); l2(t); l3(t);
    };
  },
});
