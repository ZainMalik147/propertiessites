// Tulum hero: the photograph becomes cenote water. Pointer movement drops ripples that
// refract the image, a slow caustic shimmer plays over the sea, and golden pollen drifts in 3D.
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.min.js';

export function start(host) {
  const canvas = host.querySelector('.hero-gl');
  const src = host.dataset.heroImg;
  if (!canvas || !src) return;
  let renderer;
  try { renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: true, powerPreference: 'high-performance' }); }
  catch (e) { return; }
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
  camera.position.z = 5;

  const N = 10;
  const ripples = Array.from({ length: N }, () => new THREE.Vector3(-10, -10, -100));
  const uniforms = {
    uTex: { value: null }, uTime: { value: 0 }, uRes: { value: new THREE.Vector2(1, 1) },
    uImg: { value: new THREE.Vector2(1, 1) }, uMouse: { value: new THREE.Vector2(.5, .5) },
    uRipples: { value: ripples }, uReveal: { value: 0 },
  };

  const bg = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), new THREE.ShaderMaterial({
    uniforms, depthWrite: false,
    vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0., 1.); }`,
    fragmentShader: `
      precision highp float;
      uniform sampler2D uTex; uniform float uTime, uReveal; uniform vec2 uRes, uImg, uMouse; uniform vec3 uRipples[${N}];
      varying vec2 vUv;
      vec2 cover(vec2 uv){ float rs = uRes.x/uRes.y, ri = uImg.x/uImg.y; vec2 s = rs < ri ? vec2(rs/ri, 1.) : vec2(1., ri/rs); return (uv - .5) * s + .5; }
      float caustic(vec2 p, float t){ float c = 0.; for(int i=0;i<3;i++){ float fi=float(i); p += vec2(sin(p.y*1.7+t*.6+fi), cos(p.x*1.3-t*.5+fi*1.7))*.35; c += .5/length(fract(p)-.5); } return c/3.; }
      void main(){
        vec2 uv = vUv;
        vec2 asp = vec2(uRes.x/uRes.y, 1.);
        vec2 off = vec2(0.);
        for (int i=0;i<${N};i++){
          vec3 r = uRipples[i]; float age = uTime - r.z; if (age < 0. || age > 3.) continue;
          vec2 dv = (uv - r.xy) * asp; float dist = length(dv);
          float wave = sin(dist*42. - age*9.) * exp(-dist*5.) * (1. - age/3.);
          off += normalize(dv + 1e-5) * wave * .012;
        }
        // gentle breathing + parallax toward pointer
        off += (uMouse - .5) * -.015;
        off.y += sin(uv.x*6. + uTime*.7) * .0016 * smoothstep(.55, .0, uv.y);
        vec2 tuv = cover(uv + off);
        tuv = (tuv - .5) * (1. - .04 * uReveal) + .5;
        vec3 col = texture2D(uTex, tuv).rgb;
        // caustic shimmer on lower half (the sea)
        float c = caustic(uv*vec2(6.,3.) + vec2(0., uTime*.05), uTime);
        col += vec3(.75,.95,1.) * pow(clamp(c-.9, 0., 1.), 2.) * .08 * smoothstep(.6, .0, uv.y);
        // warm sun bloom toward the pointer
        float glow = exp(-length((uv - uMouse)*asp)*3.2);
        col += vec3(1., .78, .55) * glow * .07;
        gl_FragColor = vec4(col, 1.);
      }`,
  }));
  bg.frustumCulled = false;
  scene.add(bg);

  // Pollen / fireflies
  const P = innerWidth < 700 ? 140 : 320;
  const pos = new Float32Array(P * 3), seed = new Float32Array(P);
  for (let i = 0; i < P; i++) { pos[i * 3] = (Math.random() - .5) * 9; pos[i * 3 + 1] = (Math.random() - .5) * 5; pos[i * 3 + 2] = Math.random() * 3 - 1.5; seed[i] = Math.random(); }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  g.setAttribute('seed', new THREE.BufferAttribute(seed, 1));
  const pm = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    uniforms: { uTime: uniforms.uTime, uPR: { value: renderer.getPixelRatio() } },
    vertexShader: `attribute float seed; uniform float uTime, uPR; varying float vA;
      void main(){ vec3 p = position; float t = uTime*.12 + seed*40.;
        p.x += sin(t*1.3)*.35; p.y += mod(p.y + uTime*.06*(.4+seed) + 2.5, 5.) - p.y - 2.5 + sin(t)*.2; p.z += cos(t*.9)*.3;
        vec4 mv = modelViewMatrix * vec4(p,1.); gl_Position = projectionMatrix * mv;
        gl_PointSize = (2. + seed*5.) * uPR * (4./-mv.z); vA = .35 + .65*sin(uTime*1.5 + seed*30.)*.5+.3; }`,
    fragmentShader: `varying float vA; void main(){ float d = length(gl_PointCoord-.5); if(d>.5) discard; gl_FragColor = vec4(1., .86, .6, (1.-d*2.) * vA * .7); }`,
  });
  const pts = new THREE.Points(g, pm);
  scene.add(pts);

  new THREE.TextureLoader().load(src, tex => {
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.minFilter = THREE.LinearFilter;
    uniforms.uTex.value = tex;
    uniforms.uImg.value.set(tex.image.width, tex.image.height);
    resize();
    renderer.render(scene, camera);
    d.body.classList.add('gl-ready');
  });

  const d = document;
  function resize() {
    const w = host.clientWidth, h = host.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h; camera.updateProjectionMatrix();
    uniforms.uRes.value.set(w, h);
  }
  addEventListener('resize', resize);
  resize();

  let ri = 0, lastDrop = 0;
  const target = new THREE.Vector2(.5, .5);
  const drop = (x, y, t) => { ripples[ri].set(x, y, t); ri = (ri + 1) % N; };
  host.closest('.hero').addEventListener('pointermove', e => {
    const r = host.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width, y = 1 - (e.clientY - r.top) / r.height;
    target.set(x, y);
    const t = clock.getElapsedTime();
    if (t - lastDrop > .12) { drop(x, y, t); lastDrop = t; }
  }, { passive: true });

  const clock = new THREE.Clock();
  let visible = true;
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; }).observe(host);
  // ambient drops so mobile users see the water too
  setInterval(() => { if (visible) drop(.2 + Math.random() * .6, .08 + Math.random() * .3, clock.getElapsedTime()); }, 2600);

  (function loop() {
    requestAnimationFrame(loop);
    if (!visible || d.hidden || !uniforms.uTex.value) return;
    const t = clock.getElapsedTime();
    uniforms.uTime.value = t;
    uniforms.uReveal.value = Math.min(1, t / 2.5);
    uniforms.uMouse.value.lerp(target, .05);
    pts.rotation.y = (uniforms.uMouse.value.x - .5) * .3;
    pts.rotation.x = (uniforms.uMouse.value.y - .5) * -.15;
    const sy = Math.min(1, scrollY / innerHeight);
    camera.position.z = 5 - sy * 1.2;
    renderer.render(scene, camera);
  })();
}
