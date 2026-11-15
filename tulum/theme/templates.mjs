// TULUM — "Modern Tropical Luxury"
// Sand, jungle green, clay and cenote turquoise. Arched forms borrowed from Tulum's
// architecture, organic waves, Cormorant Garamond + Outfit. Hero: photo rendered in WebGL
// with cenote-water ripples and drifting 3D pollen.

const ARROW = `<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>`;
const ARROW_R = `<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h15M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>`;

export const LOGO = (id = 'lg') => `<svg class="brand-mark" viewBox="0 0 48 56" aria-hidden="true">
  <defs><clipPath id="${id}-c"><path d="M6 54V25a18 18 0 0 1 36 0v29z"/></clipPath></defs>
  <path class="d1" d="M4 55V25a20 20 0 0 1 40 0v30" fill="none" stroke="currentColor" stroke-width="2"/>
  <g clip-path="url(#${id}-c)">
    <circle class="sun" cx="24" cy="36" r="9" fill="var(--clay)"/>
    <rect x="0" y="37" width="48" height="20" fill="var(--logo-bg, var(--sand))"/>
    <path class="d2" d="M2 40q5.5-3 11 0t11 0 11 0 11 0" fill="none" stroke="currentColor" stroke-width="1.6"/>
    <path class="d3" d="M2 45q5.5-3 11 0t11 0 11 0 11 0" fill="none" stroke="var(--cenote)" stroke-width="1.6"/>
    <path class="d4" d="M2 50q5.5-3 11 0t11 0 11 0 11 0" fill="none" stroke="currentColor" stroke-width="1.6"/>
  </g>
</svg>`;

const brand = (site, id) => `<a class="brand" href="/" aria-label="${site.name} — home">${LOGO(id)}<span class="brand-text"><span class="brand-name">Tulum</span><span class="brand-sub">Properties · Developer Guide</span></span></a>`;

function devImage(ctx, dev, i, which = 0) {
  const keys = [].concat(dev.images || dev.image || []);
  const k = keys[which];
  return (k && ctx.images.find(im => im.file === k)) || ctx.images[(i * 3 + 1 + which) % ctx.images.length];
}
const logoPlate = (ctx, dev, cls = '') => dev.logo?.file
  ? `<figure class="logo-plate ${dev.logo.background === 'dark' ? 'is-dark' : ''} ${cls}"><img src="/${dev.logo.file}" alt="${ctx.esc(dev.name)} logo" loading="lazy"><figcaption class="sr-only">Official logo of ${ctx.esc(dev.name)}, shown for identification only.</figcaption></figure>`
  : `<div class="logo-plate is-text ${cls}">${ctx.esc(dev.name)}</div>`;

function layout(ctx, page, body) {
  const { site, devs, esc, seoHead } = ctx;
  return `<!doctype html>
<html lang="${site.lang}" dir="${site.dir || 'ltr'}">
<head>
${seoHead(site, page)}
<meta name="gtm-id" content="${esc(site.gtmId || '')}">
<meta name="ga4-id" content="${esc(site.ga4Id || '')}">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Outfit:wght@300;400;500;600&display=swap">
<link rel="stylesheet" href="/assets/theme/style.css">
${page.preload || ''}
<script src="/assets/theme/analytics.js"></script>
<script type="module" src="/assets/theme/main.js"></script>
</head>
<body data-page="${page.type || 'page'}" ${page.developer ? `data-developer="${esc(page.developer.slug)}" data-developer-name="${esc(page.developer.name)}"` : ''} class="${page.bodyClass || ''}">
<a class="skip" href="#main">Skip to content</a>
<div class="loader" aria-hidden="true"><div class="loader-mark">${LOGO('ld')}</div></div>
<header class="site-header ${page.headerClass || ''}">
  <div class="wrap header-inner">
    ${brand(site, 'hd')}
    <nav class="nav" aria-label="Main">
      <a href="/#developers">Developers</a>
      <a href="/about/">About</a>
      <a href="/editorial-policy/">Editorial policy</a>
      <a href="/contact/">Contact</a>
    </nav>
    <button class="menu-btn" aria-expanded="false" aria-controls="menu"><span></span><span></span><span class="sr-only">Menu</span></button>
  </div>
</header>
<div class="menu" id="menu" hidden>
  <div class="menu-arch" aria-hidden="true"></div>
  <nav class="menu-nav" aria-label="Mobile">
    <p class="menu-kicker">The developers</p>
    ${devs.map((d, i) => `<a href="/developers/${d.slug}/"><span>0${i + 1}</span>${esc(d.name)}</a>`).join('')}
    <p class="menu-kicker">The guide</p>
    <div class="menu-small"><a href="/about/">About</a><a href="/editorial-policy/">Editorial policy</a><a href="/contact/">Contact</a></div>
  </nav>
</div>
<main id="main">
${body}
</main>
<footer class="site-footer">
  <svg class="footer-wave" viewBox="0 0 1440 80" preserveAspectRatio="none" aria-hidden="true"><path d="M0 40c120-30 240-30 360 0s240 30 360 0 240-30 360 0 240 30 360 0v40H0z"/></svg>
  <div class="wrap footer-grid">
    <div class="footer-brand">${brand(site, 'ft')}
      <p>${esc(site.footerNote)}</p>
    </div>
    <nav aria-label="Developers"><h2>Developers</h2>${devs.map(d => `<a href="/developers/${d.slug}/">${esc(d.name)}</a>`).join('')}</nav>
    <nav aria-label="Guide"><h2>The guide</h2><a href="/about/">About</a><a href="/editorial-policy/">Editorial policy</a><a href="/contact/">Contact</a><a href="/credits/">Image credits</a></nav>
    <nav aria-label="Legal"><h2>Legal</h2><a href="/disclaimer/">Disclaimer</a><a href="/privacy-policy/">Privacy policy</a><a href="#" data-open-consent>Cookie settings</a><button class="motion-toggle" type="button" aria-pressed="false">Pause motion</button></nav>
  </div>
  <div class="wrap footer-legal">
    <p>${esc(site.name)} is an independent editorial directory. It is not a real estate agency or broker, does not sell property, and is not affiliated with, sponsored or endorsed by any company featured. All trademarks and logos belong to their owners and are shown for identification only.</p>
    <p>© ${new Date().getFullYear()} ${esc(site.name)}</p>
  </div>
</footer>
<div class="consent" id="consent" role="dialog" aria-live="polite" aria-label="Cookie preferences" hidden>
  <p><strong>Your privacy.</strong> We'd like to use analytics cookies to understand how the guide is used. They stay off unless you accept. <a href="/privacy-policy/">Privacy policy</a></p>
  <div class="consent-btns"><button class="btn btn-ghost" data-consent="none">Decline</button><button class="btn btn-solid" data-consent="all">Accept</button></div>
</div>
</body>
</html>`;
}

export function home(ctx) {
  const { site, devs, images, esc, photo, outAttrs, outboundUrl, orgJsonLd } = ctx;
  const hero = images.find(i => i.file === site.heroImage) || images[0];
  const gallery = (site.galleryImages || []).map(f => images.find(i => i.file === f)).filter(Boolean);
  const gal = gallery.length ? gallery : images.slice(0, 7);
  const words = (s) => s.split(' ').map((w, i) => `<span class="w"><span style="--i:${i}">${esc(w)}</span></span>`).join(' ');

  const body = `
<section class="hero" aria-labelledby="hero-title">
  <div class="hero-media" data-hero-img="/${hero.file}-1920.webp">
    ${photo(hero, { eager: true, cls: 'hero-img', alt: hero.subject })}
    <canvas class="hero-gl" aria-hidden="true"></canvas>
  </div>
  <div class="hero-shade" aria-hidden="true"></div>
  <div class="wrap hero-content">
    <p class="eyebrow reveal">${esc(site.hero.eyebrow)}</p>
    <h1 id="hero-title" class="hero-title split">${words(site.hero.title)}</h1>
    <p class="hero-sub reveal" style="--d:.5s">${esc(site.hero.subtitle)}</p>
    <div class="hero-cta reveal" style="--d:.7s"><a class="btn btn-solid magnetic" href="#developers">${esc(site.hero.button)} ${ARROW_R}</a><a class="btn btn-line" href="#about-guide">An independent guide</a></div>
  </div>
  <div class="hero-foot wrap">
    <span class="coords">20.2114° N · 87.4654° W</span>
    <a class="scroll-cue" href="#intro" aria-label="Scroll to introduction"><span></span></a>
    <span class="coords">Quintana Roo · México</span>
  </div>
</section>

<section class="intro" id="intro">
  <div class="wrap intro-grid">
    <div class="sun-orbit" aria-hidden="true"><div class="orbit-ring"></div><div class="orbit-ring r2"></div><div class="orbit-sun"></div></div>
    <div>
      <p class="eyebrow reveal">The guide</p>
      <p class="intro-text reveal">${esc(site.intro)}</p>
      <ul class="intro-stats reveal">
        <li><strong>${devs.length}</strong><span>Established developers</span></li>
        <li><strong>${devs.reduce((n, d) => n + (d.projects?.length || 0), 0)}</strong><span>Communities profiled</span></li>
        <li><strong>100%</strong><span>Independent &amp; editorial</span></li>
      </ul>
    </div>
  </div>
</section>

<section class="devs" id="developers" aria-labelledby="devs-title">
  <div class="wrap devs-head">
    <p class="eyebrow reveal">Featured developers</p>
    <h2 id="devs-title" class="section-title reveal">Four builders,<br><em>one coastline.</em></h2>
    <p class="devs-note reveal">An editorial selection, presented in no particular order — not a ranking.</p>
    <nav class="dev-index reveal" aria-label="Jump to developer">${devs.map((d, i) => `<a href="#dev-${d.slug}"><span>0${i + 1}</span>${esc(d.name)}</a>`).join('')}</nav>
  </div>
  ${devs.map((d, i) => {
    const im = devImage(ctx, d, i, 0), im2 = devImage(ctx, d, i, 1);
    return `
  <article class="dev ${i % 2 ? 'is-flip' : ''}" id="dev-${d.slug}" aria-labelledby="dev-${d.slug}-name">
    <div class="wrap dev-grid">
      <div class="dev-visual">
        <div class="arch arch-main tilt" data-parallax="0.08">${photo(im, { sizes: '(min-width: 900px) 45vw, 92vw', alt: im.subject })}</div>
        <div class="arch arch-small" data-parallax="-0.12">${photo(im2, { sizes: '30vw', alt: im2.subject })}</div>
        <span class="dev-num" aria-hidden="true">0${i + 1}</span>
      </div>
      <div class="dev-body">
        ${d.listingType === 'sponsored' ? '<p class="tag-sponsored">Sponsored</p>' : ''}
        ${logoPlate(ctx, d, 'reveal')}
        <h3 id="dev-${d.slug}-name" class="dev-name reveal">${esc(d.name)}</h3>
        <p class="dev-summary reveal">${esc(d.summary)}</p>
        <ul class="chips reveal" aria-label="Key areas of activity">${(d.areas || []).map(a => `<li>${esc(a)}</li>`).join('')}</ul>
        ${d.projects?.length ? `<div class="dev-projects reveal"><p class="mini-label">Communities &amp; projects</p><ul>${d.projects.map(p => `<li><a href="${esc(outboundUrl(site, p.url || d.website))}" ${outAttrs(site, d, 'home', 'project')}><span class="pj-name">${esc(p.name)}</span><span class="pj-meta">${esc(p.location || '')}${p.type ? ' · ' + esc(p.type) : ''}</span>${ARROW}<span class="sr-only">(opens ${esc(d.name)}'s website in a new tab)</span></a></li>`).join('')}</ul></div>` : ''}
        <div class="dev-cta reveal">
          <a class="btn btn-solid" href="/developers/${d.slug}/">Read the profile ${ARROW_R}</a>
          <a class="btn btn-line" href="${esc(outboundUrl(site, d.website))}" ${outAttrs(site, d, 'home')}>Official website ${ARROW}<span class="sr-only">(opens in a new tab)</span></a>
        </div>
      </div>
    </div>
  </article>`;
  }).join('')}
</section>

<section class="landscape" aria-labelledby="land-title">
  <div class="wrap"><p class="eyebrow reveal">The setting</p><h2 id="land-title" class="section-title reveal">Jungle, cenote <em>&amp;</em> Caribbean</h2></div>
  <div class="strip" data-strip>
    <div class="strip-track">${gal.map((g, i) => `<figure class="strip-item ${i % 3 === 1 ? 'is-arch' : ''}">${photo(g, { sizes: '(min-width: 900px) 30vw, 75vw', alt: g.subject })}<figcaption>${esc(g.subject)}</figcaption></figure>`).join('')}</div>
  </div>
</section>

<section class="about-guide" id="about-guide" aria-labelledby="ag-title">
  <div class="wrap ag-grid">
    <div class="ag-badge" aria-hidden="true"><svg viewBox="0 0 200 200"><defs><path id="circ" d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0"/></defs><text><textPath href="#circ">INDEPENDENT · EDITORIAL · NOT AFFILIATED · INDEPENDENT · EDITORIAL · </textPath></text></svg><div class="ag-badge-mark">${LOGO('bd')}</div></div>
    <div>
      <p class="eyebrow">About the guide</p>
      <h2 id="ag-title" class="section-title">An independent<br><em>point of view.</em></h2>
      <p>${esc(site.aboutShort)}</p>
      <p class="ag-links"><a href="/about/">About us ${ARROW_R}</a><a href="/editorial-policy/">Editorial policy ${ARROW_R}</a><a href="/disclaimer/">Disclaimer ${ARROW_R}</a></p>
    </div>
  </div>
</section>`;

  return layout(ctx, {
    path: '/', type: 'home', title: site.seo.homeTitle, description: site.seo.homeDescription,
    image: hero.file + '-1920.webp', headerClass: 'is-over',
    preload: `<link rel="preload" as="image" href="/${hero.file}-960.webp" imagesrcset="/${hero.file}-960.webp 960w, /${hero.file}-1920.webp 1920w" imagesizes="100vw">`,
    jsonld: [orgJsonLd(site), { '@context': 'https://schema.org', '@type': 'ItemList', name: 'Featured developers in Tulum', itemListElement: devs.map((d, i) => ({ '@type': 'ListItem', position: i + 1, url: site.url.replace(/\/$/, '') + `/developers/${d.slug}/`, name: d.name })) }],
  }, body);
}

export function profile(ctx, d) {
  const { site, devs, esc, photo, outAttrs, outboundUrl, developerJsonLd } = ctx;
  const i = devs.indexOf(d);
  const im = devImage(ctx, d, i, 0), im2 = devImage(ctx, d, i, 1);
  const next = devs[(i + 1) % devs.length];
  const body = `
<section class="p-hero">
  <div class="wrap p-hero-grid">
    <div class="p-hero-text">
      <nav class="crumbs" aria-label="Breadcrumb"><a href="/">Home</a><span>/</span><a href="/#developers">Developers</a><span>/</span><span aria-current="page">${esc(d.name)}</span></nav>
      ${d.listingType === 'sponsored' ? '<p class="tag-sponsored">Sponsored</p>' : '<p class="eyebrow">Developer profile · 0' + (i + 1) + '</p>'}
      <h1 class="p-title split">${esc(d.name).split(' ').map((w, k) => `<span class="w"><span style="--i:${k}">${w}</span></span>`).join(' ')}</h1>
      <p class="p-summary reveal">${esc(d.summary)}</p>
      <div class="dev-cta reveal"><a class="btn btn-solid magnetic" href="${esc(outboundUrl(site, d.website))}" ${outAttrs(site, d, 'profile_hero')}>Visit official website ${ARROW}<span class="sr-only">(opens in a new tab)</span></a></div>
    </div>
    <div class="p-hero-visual">
      <div class="arch arch-main tilt">${photo(im, { eager: true, sizes: '(min-width: 900px) 45vw, 92vw', alt: im.subject })}</div>
      ${logoPlate(ctx, d, 'p-logo')}
    </div>
  </div>
</section>

<section class="p-body">
  <div class="wrap p-grid">
    <aside class="p-facts reveal" aria-label="At a glance">
      <h2 class="mini-label">At a glance</h2>
      <dl>${(d.facts || []).map(f => `<div><dt>${esc(f.label)}</dt><dd>${esc(f.value)}</dd></div>`).join('')}
      <div><dt>Official website</dt><dd><a href="${esc(outboundUrl(site, d.website))}" ${outAttrs(site, d, 'profile_facts')}>${esc(d.website.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, ''))}<span class="sr-only"> (opens in a new tab)</span></a></dd></div></dl>
    </aside>
    <div class="p-main">
      <h2 class="section-title reveal">About <em>${esc(d.name)}</em></h2>
      <div class="prose reveal">${(d.description || []).map(p => `<p>${esc(p)}</p>`).join('')}</div>
      <h3 class="mini-label reveal">Key areas of activity</h3>
      <ul class="chips reveal">${(d.areas || []).map(a => `<li>${esc(a)}</li>`).join('')}</ul>
    </div>
  </div>
</section>

${d.projects?.length ? `<section class="p-projects" aria-labelledby="pj-title">
  <div class="wrap">
    <p class="eyebrow reveal">Portfolio</p>
    <h2 id="pj-title" class="section-title reveal">Communities &amp; <em>projects</em></h2>
    <p class="devs-note reveal">Project information, availability and pricing are published only by ${esc(d.name)}. Links open the developer's official pages.</p>
    <div class="pj-grid">${d.projects.map((p, k) => `
      <a class="pj-card reveal tilt" style="--d:${k * 0.08}s" href="${esc(outboundUrl(site, p.url || d.website))}" ${outAttrs(site, d, 'profile_projects', 'project')}>
        <span class="pj-idx">${String(k + 1).padStart(2, '0')}</span>
        <span class="pj-type">${esc(p.type || '')}</span>
        <h3>${esc(p.name)}</h3>
        <p class="pj-loc">${esc(p.location || '')}</p>
        <p>${esc(p.description || '')}</p>
        <span class="pj-go">View on ${esc(d.name)}'s site ${ARROW}</span><span class="sr-only">(opens in a new tab)</span>
      </a>`).join('')}
    </div>
  </div>
</section>` : ''}

<section class="p-band">
  <div class="arch-band" data-parallax="0.1">${photo(im2, { alt: im2.subject })}</div>
  <div class="wrap p-band-inner">
    <p class="eyebrow">Continue at the source</p>
    <h2 class="section-title">Explore ${esc(d.name)}<br><em>on its official website.</em></h2>
    <a class="btn btn-solid magnetic" href="${esc(outboundUrl(site, d.website))}" ${outAttrs(site, d, 'profile_footer')}>Visit ${esc(d.name)} ${ARROW}<span class="sr-only">(opens in a new tab)</span></a>
  </div>
</section>
<nav class="next-dev" aria-label="Next developer">
  <a class="wrap" href="/developers/${next.slug}/"><span class="eyebrow">Next developer</span><span class="next-name">${esc(next.name)} ${ARROW_R}</span></a>
</nav>`;

  return layout(ctx, {
    path: `/developers/${d.slug}/`, type: 'profile', developer: d, ogType: 'profile',
    title: `${d.name} — Real Estate Developer in Tulum | ${site.name}`,
    description: (d.seoDescription || `${d.summary} Independent profile: background, key areas of activity, projects and official website.`).slice(0, 300),
    image: im.file + '-1920.webp', jsonld: developerJsonLd(site, d),
  }, body);
}

export function page(ctx, pg) {
  const { site, esc } = ctx;
  const body = `
<section class="page-hero">
  <div class="wrap"><p class="eyebrow">${esc(pg.kicker || '')}</p><h1 class="page-title split">${esc(pg.title).split(' ').map((w, k) => `<span class="w"><span style="--i:${k}">${w}</span></span>`).join(' ')}</h1></div>
  <svg class="page-wave" viewBox="0 0 1440 60" preserveAspectRatio="none" aria-hidden="true"><path d="M0 30c120-24 240-24 360 0s240 24 360 0 240-24 360 0 240 24 360 0v30H0z"/></svg>
</section>
<section class="page-body"><div class="wrap narrow prose">${pg.html}</div></section>`;
  return layout(ctx, { path: pg.path, type: 'page', title: `${pg.title} | ${site.name}`, description: pg.description, headerClass: 'is-solid' }, body);
}
