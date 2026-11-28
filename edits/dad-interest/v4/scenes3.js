// v2.2 scenes (client notes round 3: "these frames look sloppy, use the premium references").
// Rebuilt as lit 3D sets with real depth of field, soft shadows, props and big type, following what makes the
// reference frames premium: the set fills the frame, there is depth (a soft foreground object, a sharp subject,
// a soft background), materials have texture, and the type is large and confident.
// Loaded after scenes2.js; overrides puzzle_v12, mat and lottery3d. three.js r149 (MIT) is vendored.

// ------------------------------------------------------------------ shared: renderer + depth-of-field post pass
function makeStudio({ dof = null, shadows = 'vsm', env = 'studio', exposure = 0.62 } = {}) {
  const cv = el('canvas', { position: 'absolute', left: '0', top: '0', width: '1080px', height: '1920px' });
  cv.width = 1080; cv.height = 1920;
  const R = new THREE.WebGLRenderer({ canvas: cv, antialias: true, alpha: false, preserveDrawingBuffer: true });
  R.setPixelRatio(1); R.setSize(1080, 1920, false);
  R.outputEncoding = THREE.sRGBEncoding; R.toneMapping = THREE.ACESFilmicToneMapping; R.toneMappingExposure = exposure;
  R.shadowMap.enabled = true; R.shadowMap.type = shadows === 'vsm' ? THREE.VSMShadowMap : THREE.PCFSoftShadowMap;
  // environment for reflections: softboxes in a dim room (warm key, cool rim)
  const pm = new THREE.PMREMGenerator(R), es = new THREE.Scene();
  es.background = new THREE.Color(env === 'night' ? 0x07090b : 0x2c2926);
  const boxes = env === 'night'
    ? [[0, 7, 0, 9, 1, 0xffffff, 0.5], [-7, 2, 1, 1, 5, 0x5FD8F5, 0.7], [7, 2, -1, 1, 4, 0xffb070, 0.5], [0, 2, -8, 6, 2, 0x5FD8F5, 0.4]]
    : [[0, 7, 0, 10, 1, 0xffffff, 0.7], [-7, 2, 2, 1, 6, 0xfff3e2, 0.6], [7, 2, -2, 1, 5, 0xffffff, 0.5], [0, -6, 0, 16, 1, 0x3a342e, 1]];
  for (const [x, y, z, w, h, c, k] of boxes) {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, 3), new THREE.MeshBasicMaterial({ color: new THREE.Color(c).multiplyScalar(k) }));
    m.position.set(x, y, z); es.add(m);
  }
  const envMap = pm.fromScene(es, 0.04).texture;
  const out = { R, cv, envMap };
  if (!dof) { out.render = (sc, cam) => R.render(sc, cam); return out; }
  // DOF: colour (MSAA, half float) + depth pass, then a 64-tap gather blur weighted by circle of confusion.
  const rtC = new THREE.WebGLRenderTarget(1080, 1920, { type: THREE.HalfFloatType, samples: 4 });
  const rtD = new THREE.WebGLRenderTarget(1080, 1920);
  rtD.depthTexture = new THREE.DepthTexture(1080, 1920); rtD.depthTexture.type = THREE.UnsignedIntType;
  const depthOnly = new THREE.MeshBasicMaterial({ colorWrite: false });
  const U = { tC: { value: rtC.texture }, tD: { value: rtD.depthTexture }, near: { value: 0.1 }, far: { value: 100 },
    focus: { value: dof.focus }, aperture: { value: dof.aperture }, maxR: { value: dof.maxR || 36 }, bgCoc: { value: dof.bgCoc == null ? 6 : dof.bgCoc }, res: { value: new THREE.Vector2(1080, 1920) } };
  const q = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), new THREE.ShaderMaterial({ uniforms: U, depthTest: false, depthWrite: false, toneMapped: true,
    vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0., 1.); }',
    fragmentShader: `#include <packing>
      uniform sampler2D tC; uniform sampler2D tD; uniform float near, far, focus, aperture, maxR, bgCoc; uniform vec2 res; varying vec2 vUv;
      float vz(vec2 uv){ return -perspectiveDepthToViewZ(texture2D(tD, uv).x, near, far); }
      float coc(float z){ return z > far * 0.995 ? bgCoc : clamp(abs(z - focus) / z * aperture, 0., maxR); }
      void main(){
        float zc = vz(vUv), cc = coc(zc);
        vec3 acc = texture2D(tC, vUv).rgb; float ws = 1.;
        for (int i = 1; i < 64; i++) {
          float fi = float(i), r = sqrt(fi / 64.) * maxR, a = fi * 2.39996323;
          vec2 uv = vUv + vec2(cos(a), sin(a)) * r / res;
          float zs = vz(uv), cs = coc(zs);
          float eff = zs > zc + 0.05 ? min(cs, cc) : cs;      // the background cannot bleed over a sharper foreground
          float w = smoothstep(r - 1.5, r + 0.5, eff);
          acc += texture2D(tC, uv).rgb * w; ws += w;
        }
        gl_FragColor = vec4(acc / ws, 1.);
        #include <tonemapping_fragment>
        #include <encodings_fragment>
      }` }));
  const qs = new THREE.Scene(); qs.add(q); const qc = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  out.dofU = U;
  out.render = (sc, cam) => {
    U.near.value = cam.near; U.far.value = cam.far;
    R.setRenderTarget(rtC); R.render(sc, cam);
    const bg = sc.background; sc.overrideMaterial = depthOnly; sc.background = null;
    R.setRenderTarget(rtD); R.render(sc, cam);
    sc.overrideMaterial = null; sc.background = bg;
    R.setRenderTarget(null); R.render(qs, qc);
  };
  return out;
}

function canvasTex(w, h, draw) {
  const c = document.createElement('canvas'); c.width = w; c.height = h; const g = c.getContext('2d');
  const t = new THREE.CanvasTexture(c); t.encoding = THREE.sRGBEncoding; t.anisotropy = 8;
  const redraw = (...a) => { draw(g, w, h, ...a); t.needsUpdate = true; };
  redraw(); return { c, g, t, redraw };
}
function noiseCanvas(w, h, amt, seed = 3) {
  const c = document.createElement('canvas'); c.width = w; c.height = h; const g = c.getContext('2d');
  const d = g.createImageData(w, h), r = mulberry(seed);
  for (let i = 0; i < d.data.length; i += 4) { const v = 128 + (r() - 0.5) * 255 * amt; d.data[i] = d.data[i + 1] = d.data[i + 2] = v; d.data[i + 3] = 255; }
  g.putImageData(d, 0, 0); return c;
}
function gradientBg(stops, w = 512, h = 1024, cx = 0.5, cy = 0.45) {
  return canvasTex(w, h, (g) => {
    const gr = g.createRadialGradient(w * cx, h * cy, 0, w * cx, h * cy, h * 0.75);
    stops.forEach(([o, c]) => gr.addColorStop(o, c)); g.fillStyle = gr; g.fillRect(0, 0, w, h);
  }).t;
}
// jigsaw piece outline in [-1,1]^2 (CCW). edges: [bottom, right, top, left]: +1 tab, -1 blank, 0 flat
function jigsaw(edges) {
  const s = new THREE.Shape(), C = [[-1, -1], [1, -1], [1, 1], [-1, 1]];
  const tab = [[0.34, 0], [0.40, 0.0, 0.43, 0.10, 0.38, 0.17], [0.31, 0.27, 0.38, 0.40, 0.50, 0.40], [0.62, 0.40, 0.69, 0.27, 0.62, 0.17], [0.57, 0.10, 0.60, 0.0, 0.66, 0.0]];
  s.moveTo(...C[0]);
  for (let e = 0; e < 4; e++) {
    const [x0, y0] = C[e], [x1, y1] = C[(e + 1) % 4], dx = x1 - x0, dy = y1 - y0, L = Math.hypot(dx, dy), nx = dy / L, ny = -dx / L, k = edges[e];
    const P = (u, v) => [x0 + dx * u + nx * v * L * k, y0 + dy * u + ny * v * L * k];
    if (k) {
      s.lineTo(...P(...tab[0]));
      for (const b of tab.slice(1)) s.bezierCurveTo(...P(b[0], b[1]), ...P(b[2], b[3]), ...P(b[4], b[5]));
    }
    s.lineTo(x1, y1);
  }
  return s;
}

Object.assign(SCENES, {
  // ------------------------------------------------------------------ 13.19-17.33  "if you can FIND A WAY to have those CHECKS ROLLING IN"
  // V12 world, premium: a warm studio table seen from above, a huge frosted bulb soft in the foreground, two thick glossy
  // jigsaw pieces gliding together and locking on "way" (the bulb lights), then the camera tilts down to cheques sliding in.
  puzzle_v12() {
    const st = makeStudio({ dof: { focus: 13, aperture: 60, maxR: 34, bgCoc: 20 }, exposure: 0.56 }), { R, envMap } = st;
    const sc = new THREE.Scene(); sc.environment = envMap;
    sc.background = gradientBg([[0, '#efe2d0'], [0.6, '#dcc8b0'], [1, '#bfa688']]);
    sc.fog = new THREE.Fog(0xdcc9b2, 24, 48);
    const cam = new THREE.PerspectiveCamera(30, 1080 / 1920, 0.1, 100);
    sc.add(new THREE.HemisphereLight(0xffe6c4, 0xb89470, 0.42));
    const key = new THREE.DirectionalLight(0xfff1de, 1.05); key.position.set(-6, 12, -3); key.castShadow = true;
    key.shadow.mapSize.set(2048, 2048); Object.assign(key.shadow.camera, { left: -12, right: 12, top: 14, bottom: -14, near: 1, far: 40 });
    key.shadow.radius = 14; key.shadow.blurSamples = 20; key.shadow.bias = -0.0005; sc.add(key);
    const table = new THREE.Mesh(new THREE.PlaneGeometry(80, 80), new THREE.MeshStandardMaterial({ color: 0xf0d6b4, roughness: 0.95, metalness: 0 }));
    table.rotation.x = -Math.PI / 2; table.receiveShadow = true; sc.add(table);
    // pieces: thick, bevelled, glossy cyan
    const mat = new THREE.MeshPhysicalMaterial({ color: 0x12a6d4, roughness: 0.38, metalness: 0.0, clearcoat: 0.7, clearcoatRoughness: 0.2, envMapIntensity: 0.6 });
    const geo = e => { const g = new THREE.ExtrudeGeometry(jigsaw(e), { depth: 0.42, bevelEnabled: true, bevelThickness: 0.09, bevelSize: 0.07, bevelSegments: 5, curveSegments: 28 }); g.rotateX(-Math.PI / 2); g.translate(0, 0.09, 0); return g; };
    const A = new THREE.Mesh(geo([0, 1, 0, 0]), mat), B = new THREE.Mesh(geo([0, 0, 0, -1]), mat);
    [A, B].forEach(m => { m.castShadow = true; m.receiveShadow = true; sc.add(m); });
    // bulb: frosted glass globe on a ribbed metal base, lying in the foreground (soft), lights up on "way"
    const bulb = new THREE.Group(); sc.add(bulb);
    const glassM = new THREE.MeshPhysicalMaterial({ color: 0xfaf6ef, roughness: 0.35, clearcoat: 1, clearcoatRoughness: 0.2, emissive: 0xffe2b0, emissiveIntensity: 0.05, envMapIntensity: 1.4, sheen: 1, sheenColor: 0xfff1dd });
    const globe = new THREE.Mesh(new THREE.SphereGeometry(1.6, 64, 48), glassM); globe.castShadow = true; bulb.add(globe);
    const neck = new THREE.Mesh(new THREE.CylinderGeometry(1.02, 0.76, 1.0, 64, 1, true), glassM); neck.position.y = -1.62; neck.castShadow = true; bulb.add(neck);
    const thread = []; for (let i = 0; i <= 60; i++) { const y = -2.1 - 1.2 * i / 60; thread.push(new THREE.Vector2(0.76 + 0.05 * Math.sin(i / 60 * Math.PI * 10), y)); }
    thread.push(new THREE.Vector2(0.45, -3.42), new THREE.Vector2(0.2, -3.55), new THREE.Vector2(0.001, -3.57));
    const base = new THREE.Mesh(new THREE.LatheGeometry(thread.reverse(), 64), new THREE.MeshStandardMaterial({ color: 0xc9cdd1, metalness: 1, roughness: 0.28, side: THREE.DoubleSide })); base.castShadow = true; bulb.add(base);
    const blight = new THREE.PointLight(0xfff0cf, 0, 18, 1.6); bulb.add(blight);
    bulb.position.set(-0.2, 1.0, -5.6); bulb.rotation.set(0, -0.35, -1.5); bulb.scale.setScalar(0.62);
    // cheques ("checks rolling in"): paper slips that slide in and fan out
    const cheque = canvasTex(1024, 440, (g, w, h) => {
      const gr = g.createLinearGradient(0, 0, w, h); gr.addColorStop(0, '#f4fbfd'); gr.addColorStop(1, '#dcf1f7'); g.fillStyle = gr; g.fillRect(0, 0, w, h);
      g.strokeStyle = 'rgba(21,146,180,.10)'; g.lineWidth = 2; for (let i = -h; i < w; i += 14) { g.beginPath(); g.moveTo(i, 0); g.lineTo(i + h, h); g.stroke(); }
      g.strokeStyle = '#1592B4'; g.lineWidth = 6; g.strokeRect(14, 14, w - 28, h - 28);
      g.fillStyle = '#0E6E85'; g.font = '800 40px Poppins'; g.fillText('INCOME BANK', 50, 82);
      g.fillStyle = '#5b6b70'; g.font = '500 24px Inter'; g.fillText('PAY TO THE ORDER OF', 50, 190); g.fillText('DATE', 690, 82);
      g.fillStyle = '#0F1113'; g.font = 'italic 500 44px "Playfair Display"'; g.fillText('You', 330, 192); g.fillText('Nov 26', 770, 84);
      g.strokeStyle = '#8aa3aa'; g.lineWidth = 2; [[320, 200, 690], [50, 290, 690], [690, 96, 960]].forEach(([x, y, x2]) => { g.beginPath(); g.moveTo(x, y); g.lineTo(x2, y); g.stroke(); });
      g.fillStyle = '#ffffff'; g.fillRect(720, 150, 250, 70); g.strokeStyle = '#1592B4'; g.lineWidth = 3; g.strokeRect(720, 150, 250, 70);
      g.fillStyle = '#0F1113'; g.font = '700 44px Inter'; g.fillText('$4,200.00', 740, 202);
      g.strokeStyle = '#0F1113'; g.lineWidth = 3; g.beginPath(); g.moveTo(640, 360); g.bezierCurveTo(690, 300, 700, 390, 740, 340); g.bezierCurveTo(770, 300, 790, 380, 840, 345); g.bezierCurveTo(870, 330, 900, 350, 940, 340); g.stroke();
      g.fillStyle = '#4a5a5f'; g.font = '500 30px monospace'; g.fillText('⑆041000124⑆ 0048 2215⑈ 1021', 50, 395);
    });
    const chM = new THREE.MeshStandardMaterial({ map: cheque.t, roughness: 0.75 });
    const cheques = []; const rnd = mulberry(5);
    for (let i = 0; i < 5; i++) {
      const m = new THREE.Mesh(new THREE.BoxGeometry(3.9, 0.025, 1.68), [null, null, chM, null, null, null].map(x => x || new THREE.MeshStandardMaterial({ color: 0xe6f3f6, roughness: 0.8 })));
      m.castShadow = true; m.receiveShadow = true; sc.add(m);
      cheques.push([m, { x: (rnd() - 0.5) * 0.9, z: 4.7 + (rnd() - 0.5) * 0.7 - i * 0.1, r: (rnd() - 0.5) * 0.7, y: 0.03 + i * 0.03 }]);
    }
    // bloom of the bulb (screen blend over the render)
    const bloom = el('div', { position: 'absolute', inset: '0', mixBlendMode: 'screen', opacity: '0', background: 'radial-gradient(circle at 30% 4%, rgba(255,236,200,.9) 0%, rgba(255,226,180,.35) 14%, rgba(255,216,170,.06) 30%, rgba(0,0,0,0) 45%)' });
    // type (V12: grey rounded run-ins + a thick extruded keyword), now large
    const T = el('div', { position: 'absolute', left: '0', top: '0', width: '1080px', height: '1920px' });
    const grey = { font: '500 60px Poppins, Inter, sans-serif', color: '#5a534b', textShadow: '0 2px 10px rgba(255,250,240,.6)' };
    const ext = (size) => ({ font: `800 ${size}px/1 Poppins, sans-serif`, color: '#4fcdec', letterSpacing: '-3px',
      textShadow: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => `0 ${i}px 0 ${i < 6 ? '#2aa6c8' : '#13809f'}`).join(',') + ', 0 26px 30px rgba(70,50,30,.28)' });
    const gr = w => run(w, { css: grey });
    const p1 = el('div', { position: 'absolute', left: '0', top: '0', width: '1080px', height: '1920px' }, T);
    const r1 = line(p1, 1210, [gr('if'), gr('you'), gr('can')]);
    const k1 = line(p1, 1300, [{ w: 'find', t: tw('find'), css: ext(176) }, { w: 'a', t: tw('a'), css: ext(176) }, { w: 'way', t: tw('way'), css: ext(176) }]);
    const p2 = el('div', { position: 'absolute', left: '0', top: '0', width: '1080px', height: '1920px' }, T);
    const r2 = line(p2, 1180, [{ w: 'to', t: tw('to'), css: grey }, gr('have'), gr('those')]);
    const k2 = line(p2, 1270, [{ w: 'checks', t: tw('checks'), css: ext(190) }]);
    const k3 = line(p2, 1470, [{ w: 'rolling', t: tw('rolling'), css: ext(170) }, { w: 'in', t: tw('in'), css: ext(170) }]);
    const tJ = tw('way'), tT = tw('to'), tC = tw('checks');
    const bez = (p0, p1, p2, p3, u) => { const v = 1 - u; return [0, 1].map(k => v * v * v * p0[k] + 3 * v * v * u * p1[k] + 3 * v * u * u * p2[k] + u * u * u * p3[k]); };
    return t => {
      // camera: slow push over the pieces, then a smooth tilt down the table to the cheques on "to"
      const c = eio((t - tT + 0.1) / 0.6);
      const tgt = new THREE.Vector3(0, 0, lerp(-1.2, 6.4, c));
      cam.position.set(lerp(0.25, -0.2, t / DUR), lerp(15.5, 14.2, t / DUR), tgt.z + 7.8);
      cam.lookAt(tgt);
      st.dofU.focus.value = cam.position.distanceTo(tgt);
      // pieces glide in on curves, hovering, then drop and lock with a small bounce on "way"
      const u = eio((t + 0.3) / (tJ + 0.3));
      const [ax, az] = bez([-4.6, -0.4], [-3.4, -2.0], [-2.4, -3.0], [-1.0, -2.7], u);
      const [bx, bz] = bez([4.8, -4.8], [3.4, -4.2], [2.2, -2.6], [1.0, -2.7], u);
      const lift = 0.55 * (1 - eo((t - tJ + 0.12) / 0.2)) + 0.06 * Math.sin(Math.PI * clamp((t - tJ) / 0.16));
      A.position.set(ax, lift, az); B.position.set(bx, lift, bz);
      A.rotation.set(lerp(0.12, 0, u), lerp(0.55, 0, u), lerp(-0.1, 0, u)); B.rotation.set(lerp(-0.1, 0, u), lerp(-0.6, 0, u), lerp(0.12, 0, u));
      // bulb lights on "way"
      const g = eo((t - tJ) / 0.35) * (1 - 0.15 * clamp((t - tJ - 1) / 1));
      glassM.emissiveIntensity = 0.28 + 2.0 * g; blight.intensity = 2.5 * g; bloom.style.opacity = (0.85 * g * (1 - c)).toFixed(3);
      // cheques slide in one after another from the right and fan out on the table
      cheques.forEach(([m, d], i) => {
        const k = eo((t - (tC - 0.3) - i * 0.13) / 0.42);
        m.visible = k > 0;
        m.position.set(lerp(9, d.x, k), d.y + 0.9 * (1 - k) * (1 - k), d.z);
        m.rotation.set(0, d.r + 1.2 * (1 - k), 0.25 * (1 - k));
      });
      st.render(sc, cam);
      // text: the first block rides up with the tilt; the second rises in after it
      p1.style.transform = `translateY(${-1300 * c}px)`; p1.style.opacity = 1 - clamp((c - 0.5) * 2);
      p2.style.transform = `translateY(${900 * (1 - c)}px)`; p2.style.display = c > 0.02 ? 'block' : 'none';
      r1(t); k1(t); r2(t); k2(t); k3(t);
    };
  },

  // ------------------------------------------------------------------ 19.96-24.95  "you find a FULL-TIME JOB that brings THE MONEY IN"
  // V08, premium: a real desk seen from above (self-healing cutting mat with ruler marks, keyboard, mouse, coffee, pen,
  // a sticky note); an offer letter slides in and settles; the words write on with a highlighter; the camera glides
  // down the same sheet; a dark "Money in" label slaps on.
  mat() {
    const st = makeStudio({ dof: window.NODOF ? null : { focus: 12, aperture: 10, maxR: 16 } }), { R, envMap } = st;
    const sc = new THREE.Scene(); sc.environment = envMap; sc.background = new THREE.Color(0x26754a);
    const cam = new THREE.PerspectiveCamera(36, 1080 / 1920, 0.1, 100); cam.up.set(0, 0, -1);
    sc.add(new THREE.HemisphereLight(0xffffff, 0x41604c, 0.3));
    const key = new THREE.DirectionalLight(0xfff4e6, 1.0); key.position.set(-5, 14, -6); key.castShadow = true;
    key.shadow.mapSize.set(2048, 2048); Object.assign(key.shadow.camera, { left: -10, right: 10, top: 12, bottom: -12, near: 1, far: 40 });
    key.shadow.radius = 10; key.shadow.blurSamples = 20; key.shadow.bias = -0.0004; sc.add(key);
    // cutting mat
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
      g.font = '700 30px Inter'; g.fillText('SELF-HEALING CUTTING MAT  ·  A2  ·  CM', 120, h - 40);
    });
    const matM = new THREE.Mesh(new THREE.PlaneGeometry(14, 21), new THREE.MeshStandardMaterial({ map: matTex.t, roughness: 0.85 }));
    matM.rotation.x = -Math.PI / 2; matM.receiveShadow = true; sc.add(matM);
    // props
    const white = new THREE.MeshStandardMaterial({ color: 0xf1f0ec, roughness: 0.45 }), dark = new THREE.MeshStandardMaterial({ color: 0x1b1f22, roughness: 0.4, metalness: 0.2 });
    const add = (geo, m, p, r = [0, 0, 0]) => { const x = new THREE.Mesh(geo, m); x.position.set(...p); x.rotation.set(...r); x.castShadow = x.receiveShadow = true; sc.add(x); return x; };
    const kb = new THREE.Group(); kb.position.set(-3.9, 0, -5.6); kb.rotation.y = 0.16; sc.add(kb);
    const kbBody = new THREE.Mesh(new THREE.ExtrudeGeometry(roundedRect(6.4, 2.3, 0.25), { depth: 0.22, bevelEnabled: true, bevelSize: 0.05, bevelThickness: 0.05, bevelSegments: 3 }), white);
    kbBody.rotation.x = -Math.PI / 2; kbBody.castShadow = kbBody.receiveShadow = true; kb.add(kbBody);
    const keyG = new THREE.BoxGeometry(0.34, 0.12, 0.34), keyM = new THREE.MeshStandardMaterial({ color: 0xfafaf8, roughness: 0.5 });
    const keys = new THREE.InstancedMesh(keyG, keyM, 15 * 5); const mm = new THREE.Matrix4(); let n = 0;
    for (let r = 0; r < 5; r++) for (let c = 0; c < 15; c++) { mm.makeTranslation(-2.95 + c * 0.42 + (r % 2) * 0.1, 0.33, -0.86 + r * 0.42); keys.setMatrixAt(n++, mm); }
    keys.castShadow = true; kb.add(keys);
    add(new THREE.SphereGeometry(1, 40, 24).scale(0.58, 0.32, 0.92), white, [2.35, 0.05, 3.9], [0, -0.25, 0]);
    add(new THREE.CylinderGeometry(0.62, 0.55, 1.1, 48), white, [2.55, 0.55, -4.9]);
    add(new THREE.CylinderGeometry(0.54, 0.54, 0.02, 48), new THREE.MeshStandardMaterial({ color: 0x3a2516, roughness: 0.15 }), [2.55, 1.06, -4.9]);
    add(new THREE.TorusGeometry(0.34, 0.08, 16, 32, Math.PI), white, [3.17, 0.55, -4.9], [0, Math.PI / 2, -Math.PI / 2]);
    const pen = new THREE.Group(); pen.position.set(2.5, 0.08, 0.6); pen.rotation.y = 0.5; sc.add(pen);
    const penBody = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.075, 2.8, 24), dark); penBody.rotation.z = Math.PI / 2; penBody.castShadow = true; pen.add(penBody);
    const tip = new THREE.Mesh(new THREE.ConeGeometry(0.075, 0.3, 24), new THREE.MeshStandardMaterial({ color: 0xc9cdd1, metalness: 1, roughness: 0.3 })); tip.rotation.z = Math.PI / 2; tip.position.x = 1.55; pen.add(tip);
    const clip = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.03, 0.05), new THREE.MeshStandardMaterial({ color: 0x5FD8F5, roughness: 0.3, metalness: 0.4 })); clip.position.set(-0.9, 0.08, 0); pen.add(clip);
    const note = canvasTex(400, 400, (g, w, h) => {
      g.fillStyle = '#8fe3f6'; g.fillRect(0, 0, w, h); g.fillStyle = 'rgba(0,0,0,.05)'; g.fillRect(0, 0, w, 40);
      g.fillStyle = '#0F1113'; g.font = '64px "Permanent Marker"'; g.textAlign = 'center'; g.fillText('PAY DAY', w / 2, 190); g.fillText('✓ 1st', w / 2, 280);
    });
    add(new THREE.BoxGeometry(1.7, 0.02, 1.7), [0, 0, 1, 0, 0, 0].map(k => k ? new THREE.MeshStandardMaterial({ map: note.t, roughness: 0.8 }) : new THREE.MeshStandardMaterial({ color: 0x8fe3f6 })), [-2.6, 0.02, 4.3], [0, 0.22, 0]);
    // the offer letter: tri-folded paper (two soft creases), corner curl, letterhead, words written on with a highlighter
    const PW = 3.9, PH = PW * 1.414;
    const grain = noiseCanvas(300, 424, 0.5, 4);
    const words = [['you find a', 'you', 300, 96, 0.5], ['full-time job', 'full-time', 450, 152, 1], ['that brings', 'that', 980, 128, 1], ['the money in', 'money', 1120, 128, 1]];
    const tw2 = { you: tw('you'), 'full-time': tw('full-time'), that: tw('that'), money: tw('the') };
    const paper = canvasTex(1200, 1697, (g, w, h, t = 0) => {
      g.fillStyle = '#f8f6f1'; g.fillRect(0, 0, w, h); g.globalAlpha = 0.06; g.drawImage(grain, 0, 0, w, h); g.globalAlpha = 1;
      g.fillStyle = '#1592B4'; g.beginPath(); g.arc(110, 110, 26, 0, 7); g.fill(); g.fillStyle = '#f8f6f1'; g.beginPath(); g.arc(110, 110, 11, 0, 7); g.fill();
      g.fillStyle = '#2c2a26'; g.font = '700 26px Inter'; g.fillText('NORTHBRIDGE & CO.', 152, 120);
      g.fillStyle = '#8a8478'; g.font = '600 22px Inter'; g.fillText('O F F E R   L E T T E R', 82, 196); g.textAlign = 'right'; g.fillText('26 NOV', w - 82, 120); g.textAlign = 'left';
      g.fillStyle = 'rgba(60,56,50,.13)';
      const r = mulberry(21);
      const body = (y0, n) => { for (let i = 0; i < n; i++) { let x = 82; const y = y0 + i * 40; while (x < w - 150) { const ww = 40 + r() * 110; g.fillRect(x, y, Math.min(ww, w - 82 - x), 12); x += ww + 16; } } };
      body(610, 7); body(1260, 6);
      g.strokeStyle = 'rgba(30,30,30,.6)'; g.lineWidth = 3; g.beginPath(); g.moveTo(760, 1590); g.bezierCurveTo(800, 1530, 820, 1620, 860, 1570); g.bezierCurveTo(890, 1540, 920, 1600, 980, 1575); g.stroke();
      g.fillStyle = 'rgba(60,56,50,.4)'; g.fillRect(740, 1612, 300, 2);
      for (const [txt, k, y, size, hl] of words) {
        const t0 = tw2[k], u = (t - (t0 - LEAD)) / 0.3; if (u <= 0) continue;
        g.font = `600 ${size}px "Playfair Display"`; const tw_ = g.measureText(txt).width;
        const h0 = eo((t - t0 - 0.1) / 0.45);
        if (h0 > 0 && hl) {
          g.save(); g.globalCompositeOperation = 'multiply'; g.fillStyle = 'rgba(226,186,104,.78)'; const r2 = mulberry(y);
          g.beginPath(); g.moveTo(70, y - size * 0.42 + 3); const xe = 70 + (tw_ + 30) * h0;
          for (let x = 70; x <= xe; x += 40) g.lineTo(x, y - size * 0.42 + (r2() - 0.5) * 8);
          g.lineTo(xe, y + size * 0.14 + (r2() - 0.5) * 8); for (let x = xe; x >= 70; x -= 40) g.lineTo(x, y + size * 0.14 + (r2() - 0.5) * 8); g.closePath(); g.fill(); g.restore();
        }
        g.save(); g.globalAlpha = clamp(u * 1.6); g.filter = `blur(${(6 * (1 - eo(u))).toFixed(1)}px)`; g.fillStyle = '#2f2c27'; g.fillText(txt, 82, y + 14 * (1 - eo(u))); g.restore();
      }
    });
    const pg = new THREE.PlaneGeometry(PW, PH, 48, 68); pg.rotateX(-Math.PI / 2);
    const pp = pg.attributes.position;
    for (let i = 0; i < pp.count; i++) {
      const x = pp.getX(i) / PW + 0.5, z = pp.getZ(i) / PH + 0.5;                      // 0..1 across, 0..1 down
      const crease = 0.055 * (Math.abs(Math.sin(Math.PI * 3 * z)));                     // tri-fold: peaks between the creases
      const curl = 0.5 * Math.pow(Math.max(0, x + z - 1.62), 2) * 9;
      pp.setY(i, crease + curl);
    }
    pg.computeVertexNormals();
    const paperM = new THREE.Mesh(pg, new THREE.MeshStandardMaterial({ map: paper.t, roughness: 0.92, side: THREE.DoubleSide }));
    paperM.castShadow = paperM.receiveShadow = true;
    const sheet = new THREE.Group(); sheet.add(paperM); sc.add(sheet);
    // "Money in" label (dark sticker, cyan serif)
    const lab = canvasTex(900, 300, (g, w, h) => {
      g.fillStyle = '#15191b'; g.fillRect(0, 0, w, h); g.globalAlpha = 0.08; g.drawImage(grain, 0, 0, w, h); g.globalAlpha = 1;
      g.fillStyle = '#5FD8F5'; g.font = '700 190px "Playfair Display"'; g.textAlign = 'center'; g.shadowColor = 'rgba(95,216,245,.5)'; g.shadowBlur = 18; g.fillText('Money in', w / 2, 218);
    });
    const label = new THREE.Mesh(new THREE.BoxGeometry(3.0, 0.03, 1.0), [0, 0, 1, 0, 0, 0].map(k => k ? new THREE.MeshStandardMaterial({ map: lab.t, roughness: 0.5 }) : new THREE.MeshStandardMaterial({ color: 0x15191b })));
    label.castShadow = true; sheet.add(label);
    const tM = tw('money'), tThat = tw('that');
    return t => {
      paper.redraw(t);
      // the sheet slides in from the right, lifted, and settles (shadow tightens as it lands)
      const u = eo((t - 0.04) / 0.6);
      sheet.position.set(lerp(7.5, 0.05, u), 0.6 * (1 - u) * (1 - u), lerp(-0.4, 0, u));
      sheet.rotation.y = lerp(-0.5, 0.09, u);
      // label slaps on at "money"
      const m = (t - (tM - 0.06)) / 0.22;
      label.visible = m > 0; label.position.set(-0.15, 0.12 + 2.5 * (1 - eo(m)), 1.55); label.rotation.set(0, 0.07, 0); label.scale.setScalar(lerp(1.3, 1, eo(m)));
      // camera: top-down, framing the top of the letter, glides down the same sheet after "job"; slight push and roll
      const f = eio((t - tThat + 0.55) / 0.95);
      const shake = m > 1 && m < 2.2 ? 0.035 * Math.sin((m - 1) * 40) * (1 - (m - 1) / 1.2) : 0;
      const tz = lerp(-1.15, 0.95, f) + shake;
      cam.position.set(0.12 + shake, lerp(14.6, 13.6, t / DUR), tz + 0.01);
      cam.up.set(Math.sin(lerp(-0.03, 0.03, t / DUR)), 0, -Math.cos(lerp(-0.03, 0.03, t / DUR)));
      cam.lookAt(0.12, 0, tz);
      if (st.dofU) st.dofU.focus.value = cam.position.y;
      st.render(sc, cam);
    };
  },

  // ------------------------------------------------------------------ 31.61-34.39  "I mean, you're better off buying a LOTTERY TICKET"
  // a night-time corner-store counter: glossy black top with a cyan edge light, a lottery terminal, a scratch-card rack
  // soft in the foreground, neon and shelves soft behind. Cash is pushed across, the terminal flashes PAID, the ticket
  // prints and flies up to camera.
  lottery3d() {
    const st = makeStudio({ dof: { focus: 8, aperture: 40, maxR: 34, bgCoc: 2 }, env: 'night' }), { R, envMap } = st;
    const sc = new THREE.Scene(); sc.environment = envMap;
    sc.background = canvasTex(540, 960, (g, w, h) => {
      const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#0d1a1f'); gr.addColorStop(0.55, '#0a1013'); gr.addColorStop(1, '#050708'); g.fillStyle = gr; g.fillRect(0, 0, w, h);
      g.filter = 'blur(10px)';
      const r = mulberry(8);
      for (let row = 0; row < 4; row++) for (let i = 0; i < 9; i++) {              // shelves of products, soft
        const cs = ['#d24b3c', '#e7b53c', '#3c8fd2', '#e8e2d4', '#3cbf8a', '#8a5cd2'];
        g.fillStyle = cs[Math.floor(r() * cs.length)]; g.globalAlpha = 0.35; g.fillRect(i * 62 + r() * 10, 380 + row * 70, 40 + r() * 16, 50);
      }
      g.globalAlpha = 1;
      for (let i = 0; i < 26; i++) {                                                 // bokeh
        const x = r() * w, y = 80 + r() * 520, rad = 8 + r() * 26; g.fillStyle = r() < 0.6 ? 'rgba(95,216,245,.28)' : 'rgba(255,190,120,.25)';
        g.beginPath(); g.arc(x, y, rad, 0, 7); g.fill();
      }
      g.filter = 'blur(1.6px)';
      g.font = '96px Anton'; g.textAlign = 'center'; g.fillStyle = '#e6fbff';
      for (const [b, a] of [[40, .9], [20, .9], [8, 1]]) { g.shadowColor = `rgba(95,216,245,${a})`; g.shadowBlur = b; g.fillText('LOTTERY', w / 2, 190); }
      g.shadowBlur = 0; g.filter = 'none';
    }).t;
    const cam = new THREE.PerspectiveCamera(34, 1080 / 1920, 0.1, 100);
    sc.add(new THREE.HemisphereLight(0xbfefff, 0x0a0c0e, 0.12));
    const key = new THREE.SpotLight(0xfff2e0, 1.7, 40, 0.5, 0.8, 1.2); key.position.set(-2.5, 9, -1.5); key.castShadow = true; key.shadow.mapSize.set(2048, 2048);
    key.shadow.radius = 8; key.shadow.blurSamples = 16; sc.add(key); sc.add(key.target);
    const rim = new THREE.PointLight(0x5FD8F5, 2.2, 16); rim.position.set(2.5, 3, -4); sc.add(rim);
    // counter: glossy black stone with a cyan edge light
    const top = new THREE.Mesh(new THREE.BoxGeometry(16, 0.5, 8), new THREE.MeshPhysicalMaterial({ color: 0x050607, roughness: 0.45, clearcoat: 0.6, clearcoatRoughness: 0.12, envMapIntensity: 0.7 }));
    top.position.set(0, -0.25, 0); top.receiveShadow = true; sc.add(top);
    const strip = new THREE.Mesh(new THREE.BoxGeometry(16, 0.05, 0.05), new THREE.MeshBasicMaterial({ color: 0x9feeff })); strip.position.set(0, -0.02, 4.0); sc.add(strip);
    const front = new THREE.Mesh(new THREE.BoxGeometry(16, 3, 0.2), new THREE.MeshStandardMaterial({ color: 0x0a0d0f, roughness: 0.6 })); front.position.set(0, -2, 4.0); sc.add(front);
    // lottery terminal: wedge body, angled screen, printer slot, cyan accent
    const term = new THREE.Group(); term.position.set(0.9, 0, -0.6); term.rotation.y = -0.38; sc.add(term);
    const prof = new THREE.Shape(); prof.moveTo(-1.1, 0); prof.lineTo(1.1, 0); prof.lineTo(1.1, 0.55); prof.lineTo(-0.35, 1.75); prof.lineTo(-1.1, 1.75); prof.lineTo(-1.1, 0);
    const bodyG = new THREE.ExtrudeGeometry(prof, { depth: 2.4, bevelEnabled: true, bevelSize: 0.08, bevelThickness: 0.08, bevelSegments: 4 }); bodyG.translate(0, 0, -1.2); bodyG.rotateY(-Math.PI / 2);
    const body = new THREE.Mesh(bodyG, new THREE.MeshStandardMaterial({ color: 0x15191c, roughness: 0.42, metalness: 0.25 })); body.castShadow = body.receiveShadow = true; term.add(body);
    const scr = canvasTex(640, 400, (g, w, h, paid = false, flash = 0) => {
      g.fillStyle = '#061014'; g.fillRect(0, 0, w, h);
      const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, 'rgba(95,216,245,.18)'); gr.addColorStop(1, 'rgba(95,216,245,0)'); g.fillStyle = gr; g.fillRect(0, 0, w, h);
      g.textAlign = 'center'; g.fillStyle = '#7fa8b3'; g.font = '600 34px Inter'; g.fillText(paid ? 'THANK YOU' : 'LOTTO  ·  1 TICKET', w / 2, 80);
      g.fillStyle = paid ? '#5FD8F5' : '#e8f8fc'; g.font = '800 120px Inter'; g.fillText(paid ? 'PAID ✓' : '$2.00', w / 2, 240);
      g.fillStyle = '#7fa8b3'; g.font = '600 34px Inter'; g.fillText(paid ? 'printing ticket…' : 'insert cash', w / 2, 330);
      if (flash > 0) { g.fillStyle = `rgba(160,240,255,${flash})`; g.fillRect(0, 0, w, h); }
    });
    const screen = new THREE.Mesh(new THREE.PlaneGeometry(1.95, 1.22), new THREE.MeshBasicMaterial({ map: scr.t, toneMapped: false }));
    // the screen face runs from (z=+0.35,y=1.75) down to (z=+1.1,y=0.55) after the rotation; put the screen on it
    screen.position.set(0, 1.23, 0.44); screen.rotation.x = -Math.atan2(1.45, 1.2); term.add(screen);
    const led = new THREE.Mesh(new THREE.BoxGeometry(2.3, 0.04, 0.04), new THREE.MeshBasicMaterial({ color: 0x5FD8F5 })); led.position.set(0, 0.5, 1.2); term.add(led);
    const slot = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.05, 0.12), new THREE.MeshBasicMaterial({ color: 0x020303 })); slot.position.set(0, 0.32, 1.19); term.add(slot);
    // scratch-card rack, close to camera on the left (soft)
    const rack = canvasTex(600, 800, (g, w, h) => {
      g.fillStyle = '#121619'; g.fillRect(0, 0, w, h);
      const cs = [['#ffcf3f', '#d4462f'], ['#5FD8F5', '#0E6E85'], ['#ff7a59', '#7a2a1a'], ['#b38cff', '#3c2a7a'], ['#8ff0b0', '#1f6b45'], ['#ffd6e0', '#b03a5b']];
      for (let r = 0; r < 4; r++) for (let c = 0; c < 3; c++) {
        const [a, b] = cs[(r * 3 + c) % cs.length], x = 20 + c * 195, y = 20 + r * 195;
        const gr = g.createLinearGradient(x, y, x + 180, y + 180); gr.addColorStop(0, a); gr.addColorStop(1, b); g.fillStyle = gr; g.fillRect(x, y, 180, 180);
        g.fillStyle = 'rgba(255,255,255,.85)'; g.font = '44px Anton'; g.textAlign = 'center'; g.fillText(['$5', 'WIN', '7s', 'CASH', '$10', 'GOLD'][(r * 3 + c) % 6], x + 90, y + 108);
      }
    });
    const rackM = new THREE.Mesh(new THREE.BoxGeometry(2.4, 3.2, 0.15), [0, 0, 0, 0, 1, 0].map(k => k ? new THREE.MeshStandardMaterial({ map: rack.t, roughness: 0.4, emissive: 0xffffff, emissiveMap: rack.t, emissiveIntensity: 0.15 }) : new THREE.MeshStandardMaterial({ color: 0x15191c })));
    rackM.position.set(-1.75, 1.5, 4.3); rackM.rotation.y = 0.5; sc.add(rackM);
    // banknotes: guilloche, portrait oval, numerals
    const bill = canvasTex(800, 340, (g, w, h) => {
      g.fillStyle = '#d6e3d0'; g.fillRect(0, 0, w, h);
      g.strokeStyle = 'rgba(60,100,70,.35)'; g.lineWidth = 1.2;
      for (let k = 0; k < 26; k++) { g.beginPath(); for (let x = 0; x <= w; x += 6) g.lineTo(x, h / 2 + Math.sin(x / 38 + k * 0.5) * (40 + k * 4)); g.stroke(); }
      g.strokeStyle = '#4f7a5a'; g.lineWidth = 10; g.strokeRect(14, 14, w - 28, h - 28);
      g.fillStyle = '#e8efe4'; g.beginPath(); g.ellipse(w / 2, h / 2, 95, 115, 0, 0, 7); g.fill(); g.strokeStyle = '#4f7a5a'; g.lineWidth = 6; g.stroke();
      g.fillStyle = '#7d9e86'; g.beginPath(); g.arc(w / 2, h / 2 - 20, 40, 0, 7); g.fill(); g.beginPath(); g.ellipse(w / 2, h / 2 + 70, 70, 45, 0, Math.PI, 0); g.fill();
      g.fillStyle = '#3e6a4a'; g.font = '800 80px Inter'; g.fillText('20', 40, 100); g.fillText('20', w - 140, h - 40);
      g.font = '600 26px Inter'; g.fillText('TWENTY', 40, h - 44); g.fillStyle = '#a2443a'; g.font = '600 24px monospace'; g.fillText('B 04518823 C', w - 240, 70);
    });
    const notes = [0, 1].map(i => { const m = new THREE.Mesh(new THREE.BoxGeometry(1.75, 0.008, 0.75), new THREE.MeshStandardMaterial({ map: bill.t, roughness: 0.85 })); m.castShadow = m.receiveShadow = true; sc.add(m); return m; });
    // the ticket
    const tk = canvasTex(1000, 500, (g, w, h) => {
      const gr = g.createLinearGradient(0, 0, w, h); gr.addColorStop(0, '#fff8e6'); gr.addColorStop(1, '#f1ddb0'); g.fillStyle = gr; g.fillRect(0, 0, w, h);
      g.strokeStyle = 'rgba(196,154,74,.25)'; g.lineWidth = 1; for (let i = -h; i < w; i += 10) { g.beginPath(); g.moveTo(i, 0); g.lineTo(i + h, h); g.stroke(); }
      g.strokeStyle = '#c49a4a'; g.lineWidth = 12; g.strokeRect(16, 16, w - 32, h - 32);
      const fo = g.createLinearGradient(0, 0, 0, h); fo.addColorStop(0, '#9feeff'); fo.addColorStop(0.5, '#3fb9da'); fo.addColorStop(1, '#0E6E85'); g.fillStyle = fo; g.fillRect(16, 16, 190, h - 32);
      g.save(); g.translate(122, h / 2); g.rotate(-Math.PI / 2); g.fillStyle = '#ffffff'; g.font = '54px Anton'; g.textAlign = 'center'; g.fillText('No. 0451', 0, 18); g.restore();
      g.fillStyle = '#0E6E85'; g.font = '150px Anton'; g.textAlign = 'center'; g.fillText('LOTTERY', 600, 190);
      g.fillStyle = '#0F1113'; g.font = '600 34px Inter'; g.fillText('T  I  C  K  E  T   ·   $2', 600, 245);
      ['07', '14', '23', '38', '41', '49'].forEach((n, i) => { const x = 330 + i * 108; g.fillStyle = '#fffdf6'; g.beginPath(); g.arc(x, 340, 44, 0, 7); g.fill(); g.strokeStyle = '#3fb9da'; g.lineWidth = 7; g.stroke(); g.fillStyle = '#0F1113'; g.font = '700 36px Inter'; g.fillText(n, x, 353); });
      g.fillStyle = '#6b5a3a'; g.font = '500 22px Inter'; g.fillText('DRAW 26 NOV  ·  GOOD LUCK', 600, 440);
    });
    const ticket = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.008, 0.6), [0, 0, 1, 0, 0, 0].map(k => k ? new THREE.MeshPhysicalMaterial({ map: tk.t, roughness: 0.35, clearcoat: 0.6, emissive: 0xffffff, emissiveMap: tk.t, emissiveIntensity: 0 }) : new THREE.MeshStandardMaterial({ color: 0xf1ddb0 })));
    ticket.castShadow = true; sc.add(ticket);
    // captions (large run-ins, keyword in the house serif)
    const mk = () => el('div', { position: 'absolute', left: '0', top: '0', width: '1080px', height: '1920px' });
    const c1 = mk(), c2 = mk(), c3 = mk();
    const big = { fontSize: '66px', fontWeight: '600' };
    const l1 = line(c1, 1560, [{ w: 'I', t: tw('mean') - 0.25, css: big }, run('mean,', { css: big }), run("you're", { css: big })]);
    const l2 = line(c2, 1560, [run('better', { css: big }), run('off', { css: big }), run('buying', { css: big }), { w: 'a', t: tw('a'), css: big }]);
    const l3 = line(c3, 1470, [{ w: 'lottery ticket', t: tw('lottery'), cls: 'kw', css: { fontSize: '178px' } }]);
    const tL = tw('lottery'), T = [0, tw('better'), tL, DUR + 1];
    const tPaid = 0.98, tPrint = 1.08, tFly = tL - 0.42;
    const slotW = new THREE.Vector3();
    return t => {
      cam.position.set(lerp(-1.1, 0.5, eio(t / DUR)), lerp(3.4, 3.0, t / DUR), lerp(8.6, 7.6, t / DUR)); cam.lookAt(0.2, 0.55, -0.2);
      // cash is pushed across the counter toward the terminal
      notes.forEach((m, i) => {
        const u = eo((t - 0.05 - i * 0.1) / 0.7);
        m.position.set(lerp(4.2, -0.75 + i * 0.12, u), 0.01 + i * 0.01, lerp(3.6, 1.75 - i * 0.1, u));
        m.rotation.set(0, lerp(-0.7, 0.18 - i * 0.14, u), 0);
      });
      const flash = clamp(1 - (t - tPaid) / 0.25) * (t > tPaid ? 0.6 : 0);
      scr.redraw(t > tPaid, flash);
      led.material.color.setHex(t > tPaid && t < tPaid + 0.3 ? 0xffffff : 0x5FD8F5);
      // the ticket prints out of the slot, then flies up to the camera and turns to face it
      slot.getWorldPosition(slotW);
      const p = eo((t - tPrint) / 0.45), fly = eio((t - tFly) / 0.6);
      const dirOut = new THREE.Vector3(Math.sin(-0.38), 0, Math.cos(-0.38));
      const printed = slotW.clone().addScaledVector(dirOut, 0.15 + 0.85 * p).add(new THREE.Vector3(0, -0.12 * p, 0));
      const dest = cam.position.clone().add(new THREE.Vector3(0, 0, -1).applyQuaternion(cam.quaternion).multiplyScalar(3.9)).add(new THREE.Vector3(0, 0.32, 0));
      ticket.position.lerpVectors(printed, dest, fly);
      const q0 = new THREE.Quaternion().setFromEuler(new THREE.Euler(-0.25, -0.38, 0));
      const q1 = cam.quaternion.clone().multiply(new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.PI / 2 - 0.12, 0, -0.05)));
      ticket.quaternion.slerpQuaternions(q0, q1, fly);
      ticket.scale.set(lerp(0.6, 1, p), 1, lerp(0.3, 1, p)); ticket.visible = t > tPrint; ticket.material[2].emissiveIntensity = 0.75 * fly;
      st.dofU.focus.value = lerp(cam.position.distanceTo(new THREE.Vector3(0.6, 0.6, 0)), 3.9, fly);
      st.render(sc, cam);
      [c1, c2, c3].forEach((c, i) => chunkVis(c, t, T[i], T[i + 1] - LEAD)); l1(t); l2(t); l3(t);
    };
  },
});
