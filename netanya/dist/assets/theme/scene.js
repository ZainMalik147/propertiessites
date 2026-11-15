// Netanya hero: a 3D point-cloud Mediterranean. Thousands of points ride layered waves under a
// low dusk sun; a row of white tower silhouettes stands on the far cliff line. Pointer steers the camera.
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.min.js';

export function start(host) {
  const canvas = host.querySelector('.sea-gl');
  let renderer;
  try { renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true }); } catch (e) { return; }
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75));
  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x071a30, 18, 62);
  const camera = new THREE.PerspectiveCamera(48, 1, .1, 200);
  camera.position.set(0, 3.2, 14);

  const mobile = innerWidth < 700;
  const W = mobile ? 120 : 220, H = mobile ? 70 : 120, SX = 80, SZ = 60;
  const pos = new Float32Array(W * H * 3);
  let k = 0;
  for (let z = 0; z < H; z++) for (let x = 0; x < W; x++) {
    pos[k++] = (x / (W - 1) - .5) * SX; pos[k++] = 0; pos[k++] = -(z / (H - 1)) * SZ + 8;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const uniforms = { uTime: { value: 0 }, uPR: { value: renderer.getPixelRatio() }, uMouse: { value: new THREE.Vector2() } };
  const sea = new THREE.Points(geo, new THREE.ShaderMaterial({
    uniforms, transparent: true, depthWrite: false,
    vertexShader: `uniform float uTime, uPR; uniform vec2 uMouse; varying float vH; varying float vD;
      float w(vec2 p, vec2 dir, float f, float s, float a){ return sin(dot(p, dir)*f + uTime*s)*a; }
      void main(){ vec3 p = position;
        float h = w(p.xz, normalize(vec2(1.,.6)), .35, 1.1, .45) + w(p.xz, normalize(vec2(-.4,1.)), .6, 1.5, .22)
                + w(p.xz, normalize(vec2(.8,-.3)), 1.3, 2.2, .08) + w(p.xz, vec2(0.,1.), .18, .6, .6);
        float dm = length(p.xz - vec2(uMouse.x*20., 2.)); h += sin(dm*1.2 - uTime*3.)*.25*exp(-dm*.18);
        p.y = h; vH = h; vec4 mv = modelViewMatrix*vec4(p,1.); vD = -mv.z;
        gl_Position = projectionMatrix*mv; gl_PointSize = uPR * clamp(26./vD, 1., 4.5); }`,
    fragmentShader: `varying float vH; varying float vD; void main(){ float d = length(gl_PointCoord-.5); if(d>.5) discard;
        vec3 deep = vec3(.11,.37,.62), crest = vec3(.85,.93,.97), sun = vec3(1.,.78,.55);
        vec3 c = mix(deep, crest, smoothstep(-.5, .9, vH));
        c = mix(c, sun, smoothstep(25., 55., vD)*.55);
        float a = (1.-d*2.) * smoothstep(62., 30., vD) * .95; gl_FragColor = vec4(c, a); }`,
  }));
  scene.add(sea);

  // Dusk sun
  const sunMat = new THREE.ShaderMaterial({ transparent: true, depthWrite: false, uniforms: { uTime: uniforms.uTime },
    vertexShader: `varying vec2 vUv; void main(){ vUv=uv; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.); }`,
    fragmentShader: `varying vec2 vUv; uniform float uTime; void main(){ float d = length(vUv-.5);
      float core = smoothstep(.18,.16,d); float glow = exp(-d*7.)*.6;
      float bands = step(.5, fract(vUv.y*14. - uTime*.15)) * step(vUv.y, .42) ; core *= 1.-bands*.9;
      gl_FragColor = vec4(mix(vec3(1.,.55,.35), vec3(1.,.85,.6), vUv.y), core + glow*.6); }` });
  const sunMesh = new THREE.Mesh(new THREE.PlaneGeometry(26, 26), sunMat);
  sunMesh.position.set(9, 4.5, -56);
  scene.add(sunMesh);

  // Cliff-top towers (Netanya's coastal skyline, abstracted)
  const towers = new THREE.Group();
  const tMat = new THREE.MeshBasicMaterial({ color: 0xdce6f0, transparent: true, opacity: .9 });
  const eMat = new THREE.LineBasicMaterial({ color: 0x9cc3d5, transparent: true, opacity: .6 });
  for (let i = 0; i < 26; i++) {
    const h = 2 + Math.random() * 7, w = .9 + Math.random() * 1.3;
    const g = new THREE.BoxGeometry(w, h, w);
    const m = new THREE.Mesh(g, tMat.clone()); m.material.opacity = .25 + Math.random() * .35;
    const x = -38 + i * 3 + Math.random();
    m.position.set(x, h / 2 + .8, -50 - Math.random() * 6);
    m.userData.h = h; m.scale.y = .001;
    const e = new THREE.LineSegments(new THREE.EdgesGeometry(g), eMat); m.add(e);
    towers.add(m);
  }
  const cliff = new THREE.Mesh(new THREE.BoxGeometry(100, 1.6, 8), new THREE.MeshBasicMaterial({ color: 0x0b2440 }));
  cliff.position.set(0, 0, -53); towers.add(cliff);
  scene.add(towers);

  function resize() { const w = host.clientWidth, h = host.clientHeight; renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix(); }
  addEventListener('resize', resize); resize();
  host.classList.add('gl-on');

  const target = new THREE.Vector2();
  addEventListener('pointermove', e => target.set(e.clientX / innerWidth * 2 - 1, e.clientY / innerHeight * 2 - 1), { passive: true });
  let visible = true;
  new IntersectionObserver(([e]) => (visible = e.isIntersecting)).observe(host);
  const clock = new THREE.Clock();
  (function loop() {
    requestAnimationFrame(loop);
    if (!visible || document.hidden) return;
    const t = clock.getElapsedTime();
    uniforms.uTime.value = t;
    uniforms.uMouse.value.lerp(target, .04);
    camera.position.x += (target.x * 2.5 - camera.position.x) * .03;
    camera.position.y += (3.2 - target.y * .8 - camera.position.y) * .03;
    camera.lookAt(0, .6, -30);
    towers.children.forEach((m, i) => { if (m.userData.h) m.scale.y = Math.min(1, m.scale.y + (1 - m.scale.y) * .02 * (t > i * .06 ? 1 : 0)) || .001; if (m.userData.h) m.position.y = m.userData.h * m.scale.y / 2 + .8; });
    renderer.render(scene, camera);
  })();
}
