// NETANYA — "Modern Coastal Luxury", set like an architecture magazine.
// Limestone, ink navy and Mediterranean blue. Bodoni Moda + Inter Tight, numbered chapters,
// drop caps, ruled columns. Hero: magazine split with a 3D point-cloud Mediterranean beneath.
// Built with logical CSS properties so Hebrew (RTL) can be added later.

const ARROW = `<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>`;
const ARROW_R = `<svg class="ico flip-rtl" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h15M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>`;

export const LOGO = `<svg class="brand-mark" viewBox="0 0 44 44" aria-hidden="true">
  <rect class="m-frame" x="1" y="1" width="42" height="42" fill="none" stroke="currentColor" stroke-width="1.2"/>
  <path class="m-n" d="M12 31V11l20 20V11" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linejoin="miter"/>
  <path class="m-w1" d="M6 36.5q4-2.4 8 0t8 0 8 0 8 0" fill="none" stroke="var(--blue)" stroke-width="1.4"/>
</svg>`;

const brand = (site) => `<a class="brand" href="/" aria-label="${site.name} — home">${LOGO}<span class="brand-text"><span class="brand-name">Netanya</span><span class="brand-sub">Properties — The Developer Review</span></span></a>`;

function devImage(ctx, dev, i, which = 0) {
  const keys = [].concat(dev.images || dev.image || []);
  const k = keys[which];
  return (k && ctx.images.find(im => im.file === k)) || ctx.images[(i * 3 + 1 + which) % ctx.images.length];
}
const logoPlate = (ctx, dev, cls = '') => dev.logo?.file
  ? `<figure class="logo-plate is-${dev.logo.background} ${cls}"><img src="/${dev.logo.file}" alt="${ctx.esc(dev.name)} logo" loading="lazy"><figcaption class="logo-cap">Official logo · identification only</figcaption></figure>`
  : `<div class="logo-plate is-text ${cls}">${ctx.esc(dev.name)}</div>`;
const roman = n => ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'][n] || n + 1;

function layout(ctx, page, body) {
  const { site, devs, esc, seoHead } = ctx;
  return `<!doctype html>
<html lang="${site.lang}" dir="${site.dir || 'ltr'}">
<head>
${seoHead(site, page)}
<meta name="gtm-id" content="${esc(site.gtmId || '')}">
<meta name="ga4-id" content="${esc(site.ga4Id || '')}">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,6..96,400;0,6..96,500;1,6..96,400&family=Inter+Tight:wght@300;400;500;600&display=swap">
<link rel="stylesheet" href="/assets/theme/style.css">
${page.preload || ''}
<script src="/assets/theme/analytics.js"></script>
<script type="module" src="/assets/theme/main.js"></script>
</head>
<body data-page="${page.type || 'page'}" ${page.developer ? `data-developer="${esc(page.developer.slug)}" data-developer-name="${esc(page.developer.name)}"` : ''}>
<a class="skip" href="#main">Skip to content</a>
<div class="topbar"><div class="wrap topbar-inner"><span>Issue Nº 01 — Netanya, Israel</span><span class="tb-mid">An independent editorial guide · Not affiliated with the developers featured</span><span>${new Date().getFullYear()}</span></div></div>
<header class="site-header">
  <div class="wrap header-inner">
    ${brand(site)}
    <nav class="nav" aria-label="Main">
      <a href="/#developers">Developers</a><a href="/about/">About</a><a href="/editorial-policy/">Editorial</a><a href="/accessibility/">Accessibility</a><a href="/contact/">Contact</a>
    </nav>
    <button class="menu-btn" aria-expanded="false" aria-controls="menu">Menu</button>
  </div>
</header>
<div class="menu" id="menu" hidden>
  <nav class="wrap menu-inner" aria-label="Mobile">
    <p class="menu-kicker">Contents</p>
    ${devs.map((d, i) => `<a class="menu-big" href="/developers/${d.slug}/"><span>${roman(i)}.</span> ${esc(d.name)}</a>`).join('')}
    <div class="menu-small"><a href="/about/">About</a><a href="/editorial-policy/">Editorial policy</a><a href="/accessibility/">Accessibility</a><a href="/contact/">Contact</a></div>
  </nav>
</div>
<main id="main">
${body}
</main>
<footer class="site-footer">
  <div class="wrap">
    <div class="footer-mast" aria-hidden="true">Netanya</div>
    <div class="footer-grid">
      <div><p class="f-label">The Review</p><p class="f-note">${esc(site.footerNote)}</p></div>
      <nav aria-label="Developers"><p class="f-label">Developers</p>${devs.map(d => `<a href="/developers/${d.slug}/">${esc(d.name)}</a>`).join('')}</nav>
      <nav aria-label="Guide"><p class="f-label">The guide</p><a href="/about/">About</a><a href="/editorial-policy/">Editorial policy</a><a href="/contact/">Contact</a><a href="/credits/">Image credits</a></nav>
      <nav aria-label="Legal"><p class="f-label">Legal &amp; access</p><a href="/disclaimer/">Disclaimer</a><a href="/privacy-policy/">Privacy policy</a><a href="/accessibility/">Accessibility statement</a><a href="#" data-open-consent>Cookie settings</a><button class="motion-toggle" type="button" aria-pressed="false">Pause motion</button></nav>
    </div>
    <div class="footer-legal"><p>${esc(site.name)} is an independent editorial directory. It is not a licensed real estate broker, does not sell or market property, and is not affiliated with, sponsored or endorsed by any company featured. Logos and trademarks belong to their owners and are shown for identification only.</p><p>© ${new Date().getFullYear()} ${esc(site.name)}</p></div>
  </div>
</footer>
<div class="consent" id="consent" role="dialog" aria-live="polite" aria-label="Cookie preferences" hidden>
  <p><strong>Cookies.</strong> With your permission we use analytics cookies to understand how the guide is read. They remain off unless you accept. <a href="/privacy-policy/">Privacy policy</a></p>
  <div class="consent-btns"><button class="btn btn-line" data-consent="none">Decline</button><button class="btn btn-solid" data-consent="all">Accept</button></div>
</div>
</body>
</html>`;
}

export function home(ctx) {
  const { site, devs, images, esc, photo, outAttrs, outboundUrl, orgJsonLd } = ctx;
  const hero = images.find(i => i.file === site.heroImage) || images[0];
  const second = images.find(i => i.file === site.secondImage) || images[1] || hero;
  const marquee = site.marquee || ['Mediterranean coastline', 'Urban renewal', 'Park HaYam', 'Residential towers', 'Sharon Plain', 'Sea-view living'];

  const body = `
<section class="hero" aria-labelledby="hero-title">
  <div class="wrap hero-grid">
    <div class="hero-text">
      <p class="kicker reveal">${esc(site.hero.eyebrow)}</p>
      <h1 id="hero-title" class="hero-title">${site.hero.title.split(' ').map((w, i) => `<span class="line"><span style="--i:${i}">${i === site.hero.title.split(' ').length - 1 ? `<em>${esc(w)}</em>` : esc(w)}</span></span>`).join(' ')}</h1>
      <p class="hero-sub reveal" style="--d:.4s">${esc(site.hero.subtitle)}</p>
      <a class="btn btn-solid reveal" style="--d:.55s" href="#developers">${esc(site.hero.button)} ${ARROW_R}</a>
    </div>
    <figure class="hero-cover reveal-clip">
      <div class="cover-inner" data-tilt>${photo(hero, { eager: true, sizes: '(min-width: 900px) 55vw, 100vw', alt: hero.subject })}</div>
      <figcaption><span>Cover</span> ${esc(hero.subject)}</figcaption>
    </figure>
  </div>
  <div class="sea" aria-hidden="true"><canvas class="sea-gl"></canvas><div class="sea-fallback"></div>
    <div class="wrap sea-meta"><span>32.3215° N</span><span>Mediterranean Sea</span><span>34.8532° E</span></div>
  </div>
</section>

<div class="marquee" aria-hidden="true"><div class="marquee-track">${[...marquee, ...marquee].map(m => `<span>${esc(m)}</span><i>✦</i>`).join('')}</div></div>

<section class="intro" aria-labelledby="intro-title">
  <div class="wrap intro-grid">
    <p class="kicker">Editor's letter</p>
    <div>
      <h2 id="intro-title" class="sr-only">About this guide</h2>
      <p class="intro-text dropcap reveal">${esc(site.intro)}</p>
      <p class="intro-small reveal">${esc(site.introMore || '')}</p>
    </div>
    <ol class="toc reveal" aria-label="In this issue">
      <li class="toc-head">In this issue</li>
      ${devs.map((d, i) => `<li><a href="#dev-${d.slug}"><span class="toc-n">${roman(i)}</span><span class="toc-name">${esc(d.name)}</span><span class="toc-dots"></span><span class="toc-p">${d.projects?.length || 0} projects</span></a></li>`).join('')}
    </ol>
  </div>
</section>

<section class="devs" id="developers" aria-labelledby="devs-title">
  <div class="wrap devs-head">
    <h2 id="devs-title" class="section-title reveal">The Developers</h2>
    <p class="devs-note reveal">Four established developers, selected editorially and presented in no particular order. Not a ranking.</p>
  </div>
  ${devs.map((d, i) => {
    const im = devImage(ctx, d, i, 0);
    return `
  <article class="spread ${i % 2 ? 'is-alt' : ''}" id="dev-${d.slug}" aria-labelledby="dev-${d.slug}-name">
    <div class="wrap">
      <header class="spread-head">
        <span class="chapter">Chapter ${roman(i)}</span>
        <span class="rule"></span>
        ${d.listingType === 'sponsored' ? '<span class="tag-sponsored">Sponsored</span>' : '<span class="chapter">Editorial profile</span>'}
      </header>
      <div class="spread-grid">
        <figure class="spread-photo reveal-clip">${photo(im, { sizes: '(min-width: 900px) 58vw, 100vw', alt: im.subject })}<figcaption>${esc(im.subject)}</figcaption></figure>
        <div class="spread-text">
          ${logoPlate(ctx, d, 'reveal')}
          <h3 id="dev-${d.slug}-name" class="spread-name reveal">${esc(d.name)}</h3>
          <p class="pull reveal">“${esc(d.summary)}”</p>
          <div class="cols reveal"><p class="dropcap">${esc((d.description || [])[0] || '')}</p></div>
          <p class="mini-label reveal">Key areas of activity</p>
          <ul class="areas reveal">${(d.areas || []).map(a => `<li>${esc(a)}</li>`).join('')}</ul>
        </div>
      </div>
      ${d.projects?.length ? `<div class="pj-table reveal" role="list" aria-label="${esc(d.name)} projects">
        <div class="pj-row pj-th" aria-hidden="true"><span>Nº</span><span>Project</span><span>Location</span><span>Type</span><span></span></div>
        ${d.projects.slice(0, 5).map((p, k) => `<a role="listitem" class="pj-row" href="${esc(outboundUrl(site, p.url || d.website))}" ${outAttrs(site, d, 'home', 'project')}><span class="pj-n">${String(k + 1).padStart(2, '0')}</span><span class="pj-name">${esc(p.name)}</span><span class="pj-loc">${esc(p.location || '')}</span><span class="pj-type">${esc(p.type || '')}</span>${ARROW}<span class="sr-only">(opens ${esc(d.name)}'s website in a new tab)</span></a>`).join('')}
      </div>` : ''}
      <div class="spread-cta reveal">
        <a class="btn btn-solid" href="/developers/${d.slug}/">Read the full profile ${ARROW_R}</a>
        <a class="btn btn-line" href="${esc(outboundUrl(site, d.website))}" ${outAttrs(site, d, 'home')}>${esc(d.website.replace(/^https?:\/\/(www\.)?/, '').split('/')[0])} ${ARROW}<span class="sr-only">(official website, opens in a new tab)</span></a>
      </div>
    </div>
  </article>`;
  }).join('')}
</section>

<section class="coast" aria-label="The coastline">
  <div class="coast-img" data-parallax>${photo(second, { alt: second.subject })}</div>
  <div class="wrap coast-inner"><p class="kicker">The setting</p><p class="coast-quote">Fourteen kilometres of Mediterranean cliffs and beaches, and a city <em>building upward.</em></p></div>
</section>

<section class="about-guide" aria-labelledby="ag-title">
  <div class="wrap ag-grid">
    <div class="ag-seal" aria-hidden="true"><span>Independent</span>${LOGO}<span>Editorial</span></div>
    <div>
      <p class="kicker">About the guide</p>
      <h2 id="ag-title" class="section-title">Independent by design.</h2>
      <p class="ag-text">${esc(site.aboutShort)}</p>
      <p class="ag-links"><a href="/about/">About ${ARROW_R}</a><a href="/editorial-policy/">Editorial policy ${ARROW_R}</a><a href="/disclaimer/">Disclaimer ${ARROW_R}</a><a href="/accessibility/">Accessibility ${ARROW_R}</a></p>
    </div>
  </div>
</section>`;

  return layout(ctx, {
    path: '/', type: 'home', title: site.seo.homeTitle, description: site.seo.homeDescription, image: hero.file + '-1920.webp',
    preload: `<link rel="preload" as="image" href="/${hero.file}-960.webp" imagesrcset="/${hero.file}-960.webp 960w, /${hero.file}-1920.webp 1920w" imagesizes="(min-width: 900px) 55vw, 100vw">`,
    jsonld: [orgJsonLd(site), { '@context': 'https://schema.org', '@type': 'ItemList', name: 'Featured residential developers in Netanya', itemListElement: devs.map((d, i) => ({ '@type': 'ListItem', position: i + 1, url: site.url.replace(/\/$/, '') + `/developers/${d.slug}/`, name: d.name })) }],
  }, body);
}

export function profile(ctx, d) {
  const { site, devs, esc, photo, outAttrs, outboundUrl, developerJsonLd } = ctx;
  const i = devs.indexOf(d);
  const im = devImage(ctx, d, i, 0), im2 = devImage(ctx, d, i, 1);
  const next = devs[(i + 1) % devs.length];
  const body = `
<article class="profile">
  <header class="p-head">
    <div class="wrap">
      <nav class="crumbs" aria-label="Breadcrumb"><a href="/">Home</a> / <a href="/#developers">Developers</a> / <span aria-current="page">${esc(d.name)}</span></nav>
      <div class="p-head-grid">
        <div>
          <p class="kicker">${d.listingType === 'sponsored' ? 'Sponsored' : `Chapter ${roman(i)} · Developer profile`}</p>
          <h1 class="p-title">${esc(d.name).split(' ').map((w, k) => `<span class="line"><span style="--i:${k}">${w}</span></span>`).join(' ')}</h1>
        </div>
        ${logoPlate(ctx, d, 'p-logo reveal')}
      </div>
      <p class="p-standfirst reveal">${esc(d.summary)}</p>
    </div>
  </header>
  <figure class="p-photo reveal-clip"><div data-parallax>${photo(im, { eager: true, alt: im.subject })}</div><figcaption class="wrap">${esc(im.subject)}</figcaption></figure>
  <div class="wrap p-grid">
    <aside class="p-side" aria-label="At a glance">
      <p class="mini-label">At a glance</p>
      <dl>${(d.facts || []).map(f => `<div><dt>${esc(f.label)}</dt><dd>${esc(f.value)}</dd></div>`).join('')}</dl>
      <a class="btn btn-solid btn-block" href="${esc(outboundUrl(site, d.website))}" ${outAttrs(site, d, 'profile_sidebar')}>Official website ${ARROW}<span class="sr-only">(opens in a new tab)</span></a>
    </aside>
    <div class="p-main">
      <div class="prose">${(d.description || []).map((p, k) => `<p class="${k === 0 ? 'dropcap' : ''}">${esc(p)}</p>`).join('')}</div>
      <h2 class="h-rule">Key areas of activity</h2>
      <ul class="areas">${(d.areas || []).map(a => `<li>${esc(a)}</li>`).join('')}</ul>
      ${d.projects?.length ? `<h2 class="h-rule">Projects &amp; neighbourhoods</h2>
      <p class="note-small">Information on availability, specifications and pricing is published only by ${esc(d.name)}.</p>
      <div class="p-projects">${d.projects.map((p, k) => `
        <a class="p-pj reveal" href="${esc(outboundUrl(site, p.url || d.website))}" ${outAttrs(site, d, 'profile_projects', 'project')}>
          <span class="pj-n">${String(k + 1).padStart(2, '0')}</span>
          <span class="p-pj-body"><span class="pj-type">${esc(p.type || '')}${p.location ? ' · ' + esc(p.location) : ''}</span><span class="p-pj-name">${esc(p.name)}</span><span class="p-pj-desc">${esc(p.description || '')}</span></span>
          ${ARROW}<span class="sr-only">(opens ${esc(d.name)}'s website in a new tab)</span>
        </a>`).join('')}</div>` : ''}
      <h2 class="h-rule">Sources</h2>
      <ul class="sources">${(d.sources || []).map(s => `<li><a href="${esc(s)}" target="_blank" rel="noopener nofollow">${esc(s.replace(/^https?:\/\//, ''))}<span class="sr-only"> (opens in a new tab)</span></a></li>`).join('')}</ul>
      <p class="notice"><strong>Independent profile.</strong> ${esc(site.name)} is not affiliated with ${esc(d.name)}. This profile is editorial, written from publicly available information, and is not an advertisement or offer of property. The logo is a trademark of its owner, shown for identification only.</p>
    </div>
  </div>
  <section class="p-band">
    <div class="p-band-img">${photo(im2, { alt: '' })}</div>
    <div class="wrap p-band-inner"><p class="kicker">Continue at the source</p><h2>Visit ${esc(d.name)}</h2><a class="btn btn-light" href="${esc(outboundUrl(site, d.website))}" ${outAttrs(site, d, 'profile_footer')}>Official website ${ARROW}<span class="sr-only">(opens in a new tab)</span></a></div>
  </section>
  <nav class="next" aria-label="Next developer"><a class="wrap" href="/developers/${next.slug}/"><span class="kicker">Next chapter</span><span class="next-name">${esc(next.name)} ${ARROW_R}</span></a></nav>
</article>`;
  return layout(ctx, {
    path: `/developers/${d.slug}/`, type: 'profile', developer: d, ogType: 'profile',
    title: `${d.name} — Residential Developer in Netanya | ${site.name}`,
    description: (d.seoDescription || `${d.summary} Independent profile with background, Netanya projects and official website.`).slice(0, 300),
    image: im.file + '-1920.webp', jsonld: developerJsonLd(site, d),
  }, body);
}

export function page(ctx, pg) {
  const { site, esc } = ctx;
  const body = `
<header class="page-head"><div class="wrap narrow">
  <p class="kicker">${esc(pg.kicker || '')}</p>
  <h1 class="page-title">${esc(pg.title).split(' ').map((w, k) => `<span class="line"><span style="--i:${k}">${w}</span></span>`).join(' ')}</h1>
</div></header>
<div class="wrap narrow prose page-prose">${pg.html}</div>`;
  return layout(ctx, { path: pg.path, type: 'page', title: `${pg.title} | ${site.name}`, description: pg.description }, body);
}
