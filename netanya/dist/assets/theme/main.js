// Netanya — interactions
const d = document, root = d.documentElement;
const fine = matchMedia('(pointer: fine)').matches;
let motionOff = matchMedia('(prefers-reduced-motion: reduce)').matches;
try { if (localStorage.getItem('motion') === 'off') motionOff = true; } catch (e) {}
if (motionOff) root.classList.add('no-motion');

requestAnimationFrame(() => setTimeout(() => d.body.classList.add('is-loaded'), 80));

const header = d.querySelector('.site-header');
let lastY = 0;
addEventListener('scroll', () => {
  const y = scrollY;
  header.classList.toggle('is-hidden', y > lastY && y > 500 && !d.body.classList.contains('menu-open'));
  lastY = y;
}, { passive: true });

const btn = d.querySelector('.menu-btn'), menu = d.getElementById('menu');
btn?.addEventListener('click', () => {
  const open = btn.getAttribute('aria-expanded') !== 'true';
  btn.setAttribute('aria-expanded', open);
  btn.textContent = open ? 'Close' : 'Menu';
  d.body.classList.toggle('menu-open', open);
  if (open) { menu.hidden = false; requestAnimationFrame(() => menu.classList.add('is-open')); menu.querySelector('a')?.focus({ preventScroll: true }); }
  else { menu.classList.remove('is-open'); setTimeout(() => (menu.hidden = true), 800); }
});
menu?.addEventListener('click', e => { if (e.target.closest('a')) btn.click(); });
d.addEventListener('keydown', e => { if (e.key === 'Escape' && btn?.getAttribute('aria-expanded') === 'true') { btn.click(); btn.focus(); } });

const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -10% 0px' });
d.querySelectorAll('.reveal, .reveal-clip, .spread').forEach(el => io.observe(el));

// Parallax
const par = [...d.querySelectorAll('[data-parallax]')];
if (!motionOff && par.length) (function loop() {
  const vh = innerHeight;
  for (const el of par) {
    const r = el.parentElement.getBoundingClientRect();
    if (r.bottom < 0 || r.top > vh) continue;
    el.style.transform = `translate3d(0, ${((r.top + r.height / 2 - vh / 2) * -0.12).toFixed(1)}px, 0)`;
  }
  requestAnimationFrame(loop);
})();

// 3D tilt on the cover photograph
const cover = d.querySelector('[data-tilt]');
if (cover && fine && !motionOff) {
  const host = cover.parentElement;
  host.addEventListener('pointermove', e => {
    const r = host.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
    cover.style.transform = `rotateY(${x * 10}deg) rotateX(${-y * 8}deg) translateZ(20px)`;
  });
  host.addEventListener('pointerleave', () => (cover.style.transform = ''));
}

const mt = d.querySelector('.motion-toggle');
if (mt) {
  mt.setAttribute('aria-pressed', motionOff);
  mt.textContent = motionOff ? 'Resume motion' : 'Pause motion';
  mt.addEventListener('click', () => { try { localStorage.setItem('motion', motionOff ? 'on' : 'off'); } catch (e) {} location.reload(); });
}

const sea = d.querySelector('.sea');
if (sea && !motionOff && !(navigator.connection && navigator.connection.saveData)) {
  const go = () => import('./scene.js').then(m => m.start(sea)).catch(() => {});
  ('requestIdleCallback' in window) ? requestIdleCallback(go, { timeout: 1200 }) : setTimeout(go, 500);
}
