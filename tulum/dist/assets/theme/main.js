// Tulum — interactions
const d = document, root = d.documentElement;
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const fine = matchMedia('(pointer: fine)').matches;
let motionOff = reduce;
try { if (localStorage.getItem('motion') === 'off') motionOff = true; } catch (e) {}
if (motionOff) root.classList.add('no-motion');

// Loader → loaded
const done = () => d.body.classList.add('is-loaded');
if (d.readyState === 'complete') setTimeout(done, 350); else addEventListener('load', () => setTimeout(done, 350));
setTimeout(done, 2500); // never block content

// Header: solid after hero, hide on scroll down
const header = d.querySelector('.site-header');
let lastY = 0;
addEventListener('scroll', () => {
  const y = scrollY;
  header.classList.toggle('is-scrolled', y > innerHeight * .6 || !header.classList.contains('is-over'));
  header.classList.toggle('is-hidden', y > lastY && y > 400 && !d.body.classList.contains('menu-open'));
  lastY = y;
}, { passive: true });

// Mobile menu
const btn = d.querySelector('.menu-btn'), menu = d.getElementById('menu');
btn?.addEventListener('click', () => {
  const open = btn.getAttribute('aria-expanded') !== 'true';
  btn.setAttribute('aria-expanded', open);
  d.body.classList.toggle('menu-open', open);
  if (open) { menu.hidden = false; requestAnimationFrame(() => menu.classList.add('is-open')); menu.querySelector('a')?.focus({ preventScroll: true }); }
  else { menu.classList.remove('is-open'); setTimeout(() => (menu.hidden = true), 700); }
});
menu?.addEventListener('click', e => { if (e.target.closest('a')) btn.click(); });
d.addEventListener('keydown', e => { if (e.key === 'Escape' && btn?.getAttribute('aria-expanded') === 'true') { btn.click(); btn.focus(); } });

// Reveal on scroll
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px' });
d.querySelectorAll('.reveal').forEach(el => io.observe(el));
d.querySelectorAll('.split:not(.hero-title)').forEach(el => { if (!d.querySelector('.hero')) {} });

// Parallax + 3D strip (rAF, only while visible)
const par = [...d.querySelectorAll('[data-parallax]')];
const strip = d.querySelector('[data-strip]');
const items = strip ? [...strip.querySelectorAll('.strip-item')] : [];
function frame() {
  if (!motionOff) {
    const vh = innerHeight;
    for (const el of par) {
      const r = el.getBoundingClientRect();
      if (r.bottom < -100 || r.top > vh + 100) continue;
      const k = parseFloat(el.dataset.parallax) || .1;
      el.style.transform = `translate3d(0, ${((r.top + r.height / 2 - vh / 2) * -k).toFixed(1)}px, 0)`;
    }
    if (strip) {
      const cx = innerWidth / 2;
      for (const it of items) {
        const r = it.getBoundingClientRect();
        const t = Math.max(-1, Math.min(1, (r.left + r.width / 2 - cx) / cx));
        it.style.setProperty('--ry', (t * -18).toFixed(2) + 'deg');
        it.style.setProperty('--tz', (-Math.abs(t) * 120).toFixed(0) + 'px');
      }
    }
  }
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);

// Drag-to-scroll strip on desktop
if (strip && fine) {
  let down = false, sx = 0, sl = 0;
  strip.addEventListener('pointerdown', e => { down = true; sx = e.clientX; sl = strip.scrollLeft; strip.style.scrollSnapType = 'none'; });
  addEventListener('pointerup', () => { down = false; strip.style.scrollSnapType = ''; });
  strip.addEventListener('pointermove', e => { if (down) strip.scrollLeft = sl - (e.clientX - sx); });
  strip.addEventListener('wheel', e => { if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) return; }, { passive: true });
}

// 3D tilt + magnetic buttons (pointer devices only)
if (fine && !motionOff) {
  d.querySelectorAll('.tilt').forEach(el => {
    el.addEventListener('pointermove', e => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
      el.style.transform = `perspective(900px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg)`;
    });
    el.addEventListener('pointerleave', () => { el.style.transition = 'transform .8s cubic-bezier(.22,1,.36,1)'; el.style.transform = ''; setTimeout(() => (el.style.transition = ''), 800); });
  });
  d.querySelectorAll('.magnetic').forEach(el => {
    el.addEventListener('pointermove', e => { const r = el.getBoundingClientRect(); el.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .25}px, ${(e.clientY - r.top - r.height / 2) * .35}px)`; });
    el.addEventListener('pointerleave', () => (el.style.transform = ''));
  });
}

// Pause motion toggle (accessibility)
const mt = d.querySelector('.motion-toggle');
if (mt) {
  mt.setAttribute('aria-pressed', motionOff);
  mt.textContent = motionOff ? 'Resume motion' : 'Pause motion';
  mt.addEventListener('click', () => {
    motionOff = !motionOff;
    try { localStorage.setItem('motion', motionOff ? 'off' : 'on'); } catch (e) {}
    location.reload();
  });
}

// Hero WebGL scene — loaded lazily, skipped when motion is reduced / no WebGL / save-data
const heroMedia = d.querySelector('.hero-media');
if (heroMedia && !motionOff && !(navigator.connection && navigator.connection.saveData)) {
  const go = () => import('./scene.js').then(m => m.start(heroMedia)).catch(() => {});
  ('requestIdleCallback' in window) ? requestIdleCallback(go, { timeout: 1500 }) : setTimeout(go, 600);
}
