// Abu Dhabi hero: a 3D skyline of gold wireframe towers rises from a mirrored grid,
// a slowly turning eight-point star hovers above, and gold dust drifts through the scene.
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.min.js';

export function start(canvas) {
  let renderer;
  try { renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true }); } catch (e) { return; }
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75));
  const host = canvas.parentElement;
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x0a0a0b, .028);
  const camera = new THREE.PerspectiveCamera(42, 1, .1, 300);
  const GOLD = 0xc9a96e, GOLD2 = 0xe3c995;
  const mobile = innerWidth < 700;

  // Floor grid
  const grid = new THREE.GridHelper(220, 88, GOLD, GOLD);
  grid.material.transparent = true; grid.material.opacity = .14;
  scene.add(grid);

  // Towers
  const city = new THREE.Group();
  const count = mobile ? 70 : 150;
  const towers = [];
  const lineMat = new THREE.LineBasicMaterial({ color: GOLD, transparent: true, opacity: .55 });
  const lineMat2 = new THREE.LineBasicMaterial({ color: GOLD2, transparent: true, opacity: .9 });
  const faceMat = new THREE.MeshBasicMaterial({ color: 0x0a0a0b, transparent: true, opacity: .55 });
  const rand = (a, b) => a + Math.random() * (b - a);
  for (let i = 0; i < count; i++) {
    const ang = Math.random() * Math.PI * 2, rad = 6 + Math.pow(Math.random(), .7) * 70;
    const x = Math.cos(ang) * rad, z = Math.sin(ang) * rad - 20;
    if (Math.abs(x) < 7 && z > -12) continue; // keep the centre open for the title
    const near = 1 - rad / 80;
    const h = rand(3, 10) + near * rand(4, 26) * (Math.random() < .15 ? 2 : 1);
    const w = rand(1.2, 3.2);
    const round = Math.random() < .2;
    const g = round ? new THREE.CylinderGeometry(w * .5, w * .55, h, 12, 1) : new THREE.BoxGeometry(w, h, w * rand(.7, 1.3));
    g.translate(0, h / 2, 0);
    const mesh = new THREE.Mesh(g, faceMat);
    const edges = new THREE.LineSegments(new THREE.EdgesGeometry(g, 20), Math.random() < .12 ? lineMat2 : lineMat);
    const t = new THREE.Group(); t.add(mesh, edges);
    // floor lines on tall towers
    if (h > 18 && !round) {
      const pts = []; for (let y = 2; y < h; y += 1.6) { const hw = w / 2 + .01; pts.push(-hw, y, -hw, hw, y, -hw, hw, y, -hw, hw, y, hw); }
      const fg = new THREE.BufferGeometry(); fg.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
      t.add(new THREE.LineSegments(fg, new THREE.LineBasicMaterial({ color: GOLD, transparent: true, opacity: .18 })));
    }
    t.position.set(x, 0, z); t.rotation.y = Math.random() * Math.PI;
    t.scale.y = .001; t.userData.delay = .3 + rad / 70 * 1.4 + Math.random() * .3;
    city.add(t); towers.push(t);
  }
  scene.add(city);

  // Hovering eight-point star (two rotated squares, extruded edges)
  const star = new THREE.Group();
  const sq = new THREE.EdgesGeometry(new THREE.BoxGeometry(6, 6, .3));
  const s1 = new THREE.LineSegments(sq, lineMat2), s2 = new THREE.LineSegments(sq, lineMat2);
  s2.rotation.z = Math.PI / 4;
  const ring = new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(Array.from({ length: 64 }, (_, i) => new THREE.Vector3(Math.cos(i / 64 * Math.PI * 2) * 2, Math.sin(i / 64 * Math.PI * 2) * 2, 0))), lineMat2);
  star.add(s1, s2, ring);
  star.position.set(0, 26, -60);
  scene.add(star);

  // Gold dust
  const N = mobile ? 400 : 1100;
  const p = new Float32Array(N * 3), sd = new Float32Array(N);
  for (let i = 0; i < N; i++) { p[i * 3] = rand(-70, 70); p[i * 3 + 1] = rand(0, 45); p[i * 3 + 2] = rand(-90, 20); sd[i] = Math.random(); }
  const dg = new THREE.BufferGeometry(); dg.setAttribute('position', new THREE.BufferAttribute(p, 3)); dg.setAttribute('seed', new THREE.BufferAttribute(sd, 1));
  const uT = { value: 0 };
  const dust = new THREE.Points(dg, new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, uniforms: { uTime: uT, uPR: { value: renderer.getPixelRatio() } },
    vertexShader: `attribute float seed; uniform float uTime, uPR; varying float vA; void main(){ vec3 q = position; q.y = mod(q.y + uTime*(.4+seed*.8), 45.); q.x += sin(uTime*.3+seed*20.)*1.5;
      vec4 mv = modelViewMatrix*vec4(q,1.); gl_Position = projectionMatrix*mv; gl_PointSize = uPR*(1.+seed*2.5)*(40./-mv.z); vA = .4+.6*sin(uTime*2.+seed*50.)*.5+.3; }`,
    fragmentShader: `varying float vA; void main(){ float d = length(gl_PointCoord-.5); if(d>.5) discard; gl_FragColor = vec4(.89,.79,.58, (1.-d*2.)*vA); }`,
  }));
  scene.add(dust);

  function resize() { const w = host.clientWidth, h = host.clientHeight; renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix(); }
  addEventListener('resize', resize); resize();

  const target = new THREE.Vector2();
  addEventListener('pointermove', e => target.set(e.clientX / innerWidth * 2 - 1, e.clientY / innerHeight * 2 - 1), { passive: true });
  const m = new THREE.Vector2();
  let visible = true;
  new IntersectionObserver(([e]) => (visible = e.isIntersecting)).observe(host);
  const clock = new THREE.Clock();
  const ease = x => 1 - Math.pow(1 - x, 4);
  (function loop() {
    requestAnimationFrame(loop);
    if (!visible || document.hidden) return;
    const t = clock.getElapsedTime();
    uT.value = t;
    m.lerp(target, .035);
    for (const tw of towers) { const k = Math.max(0, Math.min(1, (t - tw.userData.delay) / 1.8)); tw.scale.y = Math.max(.001, ease(k)); }
    const a = t * .035 + m.x * .25;
    const sy = Math.min(1, scrollY / innerHeight);
    camera.position.set(Math.sin(a) * 46, 9 + m.y * -3 + sy * 10, Math.cos(a) * 46 - 18);
    camera.lookAt(0, 9 + sy * 4, -26);
    star.rotation.y = t * .3; star.rotation.x = Math.sin(t * .4) * .2;
    star.position.y = 26 + Math.sin(t * .8) * 1.2;
    renderer.render(scene, camera);
  })();
}
