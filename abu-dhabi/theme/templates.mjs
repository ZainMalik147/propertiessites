// ABU DHABI — "Modern Architectural Luxury"
// Obsidian, champagne gold and pearl. Italiana + Jost. Islamic-geometry star motifs,
// hairline gold grid, stacking developer panels. Hero: 3D gold wireframe skyline rising
// over a darkened photograph, with drifting gold dust.

const ARROW = `<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9" fill="none" stroke="currentColor" stroke-width="1.3"/></svg>`;
const ARROW_R = `<svg class="ico flip-rtl" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 12h17M14 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="1.3"/></svg>`;
const STAR = (cls = '') => `<svg class="star ${cls}" viewBox="0 0 100 100" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1"><rect x="20" y="20" width="60" height="60"/><rect x="20" y="20" width="60" height="60" transform="rotate(45 50 50)"/><circle cx="50" cy="50" r="18"/></g></svg>`;

export const LOGO = `<svg class="brand-mark" viewBox="0 0 56 56" aria-hidden="true">
  <g fill="none" stroke="currentColor" stroke-width="1.3">
    <rect class="lg-a" x="10" y="10" width="36" height="36"/>
    <rect class="lg-b" x="10" y="10" width="36" height="36" transform="rotate(45 28 28)"/>
  </g>
  <g fill="currentColor"><rect class="lg-t1" x="21" y="24" width="3" height="14"/><rect class="lg-t2" x="26.5" y="16" width="3" height="22"/><rect class="lg-t3" x="32" y="21" width="3" height="17"/></g>
  <rect x="17" y="38.5" width="22" height="1.2" fill="currentColor"/>
</svg>`;
const brand = (site) => `<a class="brand" href="/" aria-label="${site.name} — home">${LOGO}<span class="brand-text"><span class="brand-name">Abu Dhabi</span><span class="brand-sub">Properties · Developer Index</span></span></a>`;

function devImage(ctx, dev, i, which = 0) {
  const keys = [].concat(dev.images || dev.image || []);
  const k = keys[which];
  return (k && ctx.images.find(im => im.file === k)) || ctx.images[(i * 3 + 1 + which) % ctx.images.length];
}
const logoPlate = (ctx, dev, cls = '') => dev.logo?.file
  ? `<figure class="logo-plate ${dev.logo.background === 'dark' ? 'is-dark' : 'is-light'} ${cls}"><img src="/${dev.logo.file}" alt="${ctx.esc(dev.name)} logo" loading="lazy"><figcaption class="sr-only">Official logo of ${ctx.esc(dev.name)}, shown for identification only.</figcaption></figure>`
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
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Italiana&family=Jost:wght@300;400;500&display=swap">
<link rel="stylesheet" href="/assets/theme/style.css">
${page.preload || ''}
<script src="/assets/theme/analytics.js"></script>
<script type="module" src="/assets/theme/main.js"></script>
</head>
<body data-page="${page.type || 'page'}" ${page.developer ? `data-developer="${esc(page.developer.slug)}" data-developer-name="${esc(page.developer.name)}"` : ''}>
<a class="skip" href="#main">Skip to content</a>
<div class="gridlines" aria-hidden="true"><span></span><span></span><span></span><span></span><span></span></div>
<div class="intro-curtain" aria-hidden="true"><div class="ic-mark">${LOGO}</div><div class="ic-bar"></div></div>
<header class="site-header ${page.headerClass || ''}">
  <div class="wrap header-inner">
    ${brand(site)}
    <nav class="nav" aria-label="Main"><a href="/#developers">Developers</a><a href="/about/">About</a><a href="/editorial-policy/">Editorial</a><a href="/contact/">Contact</a></nav>
    <button class="menu-btn" aria-expanded="false" aria-controls="menu"><span class="mb-lines"><i></i><i></i></span><span class="sr-only">Menu</span></button>
  </div>
</header>
<div class="menu" id="menu" hidden>
  ${STAR('menu-star')}
  <nav class="wrap menu-inner" aria-label="Mobile">
    ${devs.map((d, i) => `<a class="menu-big" href="/developers/${d.slug}/"><span>${String(i + 1).padStart(2, '0')}</span>${esc(d.name)}</a>`).join('')}
    <div class="menu-small"><a href="/about/">About</a><a href="/editorial-policy/">Editorial policy</a><a href="/contact/">Contact</a></div>
  </nav>
</div>
<main id="main">
${body}
</main>
<footer class="site-footer">
  <div class="wrap">
    <div class="f-top">${STAR('f-star')}<p class="f-statement">${esc(site.footerNote)}</p></div>
    <div class="footer-grid">
      <div>${brand(site)}</div>
      <nav aria-label="Developers"><p class="f-label">Developers</p>${devs.map(d => `<a href="/developers/${d.slug}/">${esc(d.name)}</a>`).join('')}</nav>
      <nav aria-label="Guide"><p class="f-label">The guide</p><a href="/about/">About</a><a href="/editorial-policy/">Editorial policy</a><a href="/contact/">Contact</a><a href="/credits/">Image credits</a></nav>
      <nav aria-label="Legal"><p class="f-label">Legal</p><a href="/disclaimer/">Disclaimer</a><a href="/privacy-policy/">Privacy policy</a><a href="#" data-open-consent>Cookie settings</a><button class="motion-toggle" type="button" aria-pressed="false">Pause motion</button></nav>
    </div>
    <div class="footer-legal"><p>${esc(site.name)} is an independent editorial directory. It is not a real estate broker or agency, does not sell property, and is not affiliated with, sponsored or endorsed by any company featured. Logos and trademarks belong to their owners and are shown for identification only.</p><p>© ${new Date().getFullYear()} ${esc(site.name)}</p></div>
  </div>
</footer>
<div class="consent" id="consent" role="dialog" aria-live="polite" aria-label="Cookie preferences" hidden>
  <p><strong>Privacy</strong> — We'd like to use analytics cookies to understand how this guide is used. They stay off unless you accept. <a href="/privacy-policy/">Privacy policy</a></p>
  <div class="consent-btns"><button class="btn btn-line" data-consent="none">Decline</button><button class="btn btn-gold" data-consent="all">Accept</button></div>
</div>
</body>
</html>`;
}

export function home(ctx) {
  const { site, devs, images, esc, photo, outAttrs, outboundUrl, orgJsonLd } = ctx;
  const hero = images.find(i => i.file === site.heroImage) || images[0];
  const night = images.find(i => i.file === site.secondImage) || images[2] || hero;
  const T = site.hero.title.split(' ');

  const body = `
<section class="hero" aria-labelledby="hero-title">
  <div class="hero-photo" data-parallax="0.25">${photo(hero, { eager: true, alt: hero.subject })}</div>
  <canvas class="hero-gl" aria-hidden="true"></canvas>
  <div class="hero-vignette" aria-hidden="true"></div>
  <div class="wrap hero-inner">
    <p class="label reveal">${esc(site.hero.eyebrow)}</p>
    <h1 id="hero-title" class="hero-title">${T.map((w, i) => `<span class="ln"><span style="--i:${i}">${esc(w)}</span></span>`).join(' ')}</h1>
    <p class="hero-sub reveal" style="--d:.9s">${esc(site.hero.subtitle)}</p>
    <a class="btn btn-gold reveal" style="--d:1.05s" href="#developers">${esc(site.hero.button)} ${ARROW_R}</a>
  </div>
  <div class="hero-bottom wrap" aria-hidden="true"><span>24.4539° N</span><span class="hb-line"></span><span>54.3773° E</span></div>
</section>

<section class="intro" aria-labelledby="intro-title">
  <div class="wrap intro-grid">
    <div class="intro-star">${STAR('spin')}${STAR('spin rev')}</div>
    <div>
      <p class="label">The index</p>
      <h2 id="intro-title" class="intro-text reveal">${esc(site.intro)}</h2>
      <dl class="counters reveal">
        <div><dt>Developers profiled</dt><dd data-count="${devs.length}">${devs.length}</dd></div>
        <div><dt>Communities featured</dt><dd data-count="${devs.reduce((n, d) => n + (d.projects?.length || 0), 0)}">${devs.reduce((n, d) => n + (d.projects?.length || 0), 0)}</dd></div>
        <div><dt>Commercial affiliations</dt><dd data-count="0">0</dd></div>
      </dl>
    </div>
  </div>
</section>

<section class="index" id="developers" aria-labelledby="idx-title">
  <div class="wrap">
    <div class="idx-head"><p class="label">Featured developers</p><h2 id="idx-title" class="section-title reveal">The Index</h2><p class="idx-note">Editorial selection · in no particular order · not a ranking</p></div>
    <ol class="idx-list">${devs.map((d, i) => `<li><a href="#dev-${d.slug}" data-preview="/${devImage(ctx, d, i, 0).file}-960.webp"><span class="idx-n">${String(i + 1).padStart(2, '0')}</span><span class="idx-name">${esc(d.name)}</span><span class="idx-areas">${esc((d.areas || []).slice(0, 2).join(' · '))}</span>${ARROW_R}</a></li>`).join('')}</ol>
    <div class="idx-preview" aria-hidden="true"><img alt=""></div>
  </div>
</section>

<section class="stack" aria-label="Developer profiles">
  ${devs.map((d, i) => {
    const im = devImage(ctx, d, i, 0);
    return `
  <article class="panel" id="dev-${d.slug}" style="--k:${i}" aria-labelledby="dev-${d.slug}-name">
    <div class="wrap panel-grid">
      <figure class="panel-photo">
        ${photo(im, { sizes: '(min-width: 1000px) 46vw, 100vw', alt: im.subject })}
        <span class="frame" aria-hidden="true"></span>
        <span class="panel-n" aria-hidden="true">${String(i + 1).padStart(2, '0')}</span>
      </figure>
      <div class="panel-body">
        ${d.listingType === 'sponsored' ? '<p class="tag-sponsored">Sponsored</p>' : `<p class="label">Developer ${String(i + 1).padStart(2, '0')} / ${String(devs.length).padStart(2, '0')}</p>`}
        ${logoPlate(ctx, d)}
        <h3 id="dev-${d.slug}-name" class="panel-name">${esc(d.name)}</h3>
        <p class="panel-summary">${esc(d.summary)}</p>
        <ul class="tags" aria-label="Key areas of activity">${(d.areas || []).map(a => `<li>${esc(a)}</li>`).join('')}</ul>
        ${d.projects?.length ? `<div class="panel-pj"><p class="label">Selected communities</p><ul>${d.projects.slice(0, 4).map(p => `<li><a href="${esc(outboundUrl(site, p.url || d.website))}" ${outAttrs(site, d, 'home', 'project')}><span>${esc(p.name)}</span><small>${esc(p.location || '')}</small>${ARROW}<span class="sr-only">(opens ${esc(d.name)}'s website in a new tab)</span></a></li>`).join('')}</ul></div>` : ''}
        <div class="panel-cta">
          <a class="btn btn-gold" href="/developers/${d.slug}/">Full profile ${ARROW_R}</a>
          <a class="btn btn-line" href="${esc(outboundUrl(site, d.website))}" ${outAttrs(site, d, 'home')}>Official website ${ARROW}<span class="sr-only">(opens in a new tab)</span></a>
        </div>
      </div>
    </div>
  </article>`;
  }).join('')}
</section>

<section class="skyline" aria-label="Abu Dhabi">
  <div class="sky-img" data-parallax="0.15">${photo(night, { alt: night.subject })}</div>
  <div class="wrap sky-inner"><p class="label">The capital</p><p class="sky-quote reveal">Islands, waterfronts and master-planned districts — <em>a skyline still being drawn.</em></p></div>
</section>

<section class="about-guide" aria-labelledby="ag-title">
  <div class="wrap ag-grid">
    <div><p class="label">About the guide</p><h2 id="ag-title" class="section-title">Independent.<br>Editorial.<br><em>Unaffiliated.</em></h2></div>
    <div><p class="ag-text">${esc(site.aboutShort)}</p>
      <p class="ag-links"><a href="/about/">About ${ARROW_R}</a><a href="/editorial-policy/">Editorial policy ${ARROW_R}</a><a href="/disclaimer/">Disclaimer ${ARROW_R}</a></p></div>
  </div>
</section>`;

  return layout(ctx, {
    path: '/', type: 'home', title: site.seo.homeTitle, description: site.seo.homeDescription, image: hero.file + '-1920.webp', headerClass: 'is-over',
    preload: `<link rel="preload" as="image" href="/${hero.file}-960.webp" imagesrcset="/${hero.file}-960.webp 960w, /${hero.file}-1920.webp 1920w" imagesizes="100vw">`,
    jsonld: [orgJsonLd(site), { '@context': 'https://schema.org', '@type': 'ItemList', name: 'Featured property developers in Abu Dhabi', itemListElement: devs.map((d, i) => ({ '@type': 'ListItem', position: i + 1, url: site.url.replace(/\/$/, '') + `/developers/${d.slug}/`, name: d.name })) }],
  }, body);
}

export function profile(ctx, d) {
  const { site, devs, esc, photo, outAttrs, outboundUrl, developerJsonLd } = ctx;
  const i = devs.indexOf(d);
  const im = devImage(ctx, d, i, 0), im2 = devImage(ctx, d, i, 1);
  const next = devs[(i + 1) % devs.length];
  const body = `
<section class="p-hero">
  <div class="p-hero-img" data-parallax="0.2">${photo(im, { eager: true, alt: im.subject })}</div>
  <div class="hero-vignette" aria-hidden="true"></div>
  <div class="wrap p-hero-inner">
    <nav class="crumbs" aria-label="Breadcrumb"><a href="/">Home</a><span>—</span><a href="/#developers">Developers</a><span>—</span><span aria-current="page">${esc(d.name)}</span></nav>
    ${logoPlate(ctx, d, 'reveal')}
    <h1 class="p-title">${esc(d.name).split(' ').map((w, k) => `<span class="ln"><span style="--i:${k}">${w}</span></span>`).join(' ')}</h1>
    <p class="p-summary reveal" style="--d:.5s">${esc(d.summary)}</p>
    <a class="btn btn-gold reveal" style="--d:.6s" href="${esc(outboundUrl(site, d.website))}" ${outAttrs(site, d, 'profile_hero')}>Visit official website ${ARROW}<span class="sr-only">(opens in a new tab)</span></a>
  </div>
</section>

<section class="p-body">
  <div class="wrap p-grid">
    <aside class="p-facts" aria-label="At a glance">
      <p class="label">At a glance</p>
      <dl>${(d.facts || []).map(f => `<div><dt>${esc(f.label)}</dt><dd>${esc(f.value)}</dd></div>`).join('')}
        <div><dt>Website</dt><dd><a href="${esc(outboundUrl(site, d.website))}" ${outAttrs(site, d, 'profile_facts')}>${esc(d.website.replace(/^https?:\/\/(www\.)?/, '').split('/')[0])}<span class="sr-only"> (opens in a new tab)</span></a></dd></div></dl>
    </aside>
    <div class="p-main">
      <h2 class="section-title sm reveal">Profile</h2>
      <div class="prose reveal">${(d.description || []).map(p => `<p>${esc(p)}</p>`).join('')}</div>
      <p class="label">Key areas of activity</p>
      <ul class="tags">${(d.areas || []).map(a => `<li>${esc(a)}</li>`).join('')}</ul>
    </div>
  </div>
</section>

${d.projects?.length ? `<section class="p-projects" aria-labelledby="pj-title">
  <div class="wrap">
    <div class="idx-head"><p class="label">Portfolio</p><h2 id="pj-title" class="section-title reveal">Communities</h2><p class="idx-note">Availability, specifications and pricing are published only by ${esc(d.name)}.</p></div>
    <div class="pj-grid">${d.projects.map((p, k) => `
      <a class="pj-card reveal" style="--d:${k * .07}s" href="${esc(outboundUrl(site, p.url || d.website))}" ${outAttrs(site, d, 'profile_projects', 'project')}>
        ${STAR('pj-star')}
        <span class="pj-n">${String(k + 1).padStart(2, '0')}</span>
        <span class="pj-type">${esc(p.type || '')}</span>
        <h3>${esc(p.name)}</h3>
        <p class="pj-loc">${esc(p.location || '')}</p>
        <p class="pj-desc">${esc(p.description || '')}</p>
        <span class="pj-go">On ${esc(d.name)}'s website ${ARROW}</span><span class="sr-only">(opens in a new tab)</span>
      </a>`).join('')}</div>
  </div>
</section>` : ''}

<section class="skyline small">
  <div class="sky-img" data-parallax="0.15">${photo(im2, { alt: '' })}</div>
  <div class="wrap sky-inner"><p class="label">Continue at the source</p><p class="sky-quote">${esc(d.name)}</p><a class="btn btn-gold" href="${esc(outboundUrl(site, d.website))}" ${outAttrs(site, d, 'profile_footer')}>Official website ${ARROW}<span class="sr-only">(opens in a new tab)</span></a></div>
</section>

<section class="p-sources">
  <div class="wrap p-grid">
    <div><p class="label">Sources</p><ul class="sources">${(d.sources || []).map(s => `<li><a href="${esc(s)}" target="_blank" rel="noopener nofollow">${esc(s.replace(/^https?:\/\//, ''))}</a></li>`).join('')}</ul></div>
    <p class="notice"><strong>Independent profile.</strong> ${esc(site.name)} is not affiliated with ${esc(d.name)}. This editorial profile is based on publicly available information and is not an advertisement or offer of property. The logo is a trademark of its owner, shown for identification only.</p>
  </div>
</section>
<nav class="next" aria-label="Next developer"><a class="wrap" href="/developers/${next.slug}/"><span class="label">Next</span><span class="next-name">${esc(next.name)} ${ARROW_R}</span></a></nav>`;
  return layout(ctx, {
    path: `/developers/${d.slug}/`, type: 'profile', developer: d, ogType: 'profile', headerClass: 'is-over',
    title: `${d.name} — Property Developer in Abu Dhabi | ${site.name}`,
    description: (d.seoDescription || `${d.summary} Independent profile with background, Abu Dhabi communities and official website.`).slice(0, 300),
    image: im.file + '-1920.webp', jsonld: developerJsonLd(site, d),
  }, body);
}

export function page(ctx, pg) {
  const { site, esc } = ctx;
  const body = `
<header class="page-head"><div class="wrap narrow">${STAR('page-star spin')}<p class="label">${esc(pg.kicker || '')}</p><h1 class="page-title">${esc(pg.title).split(' ').map((w, k) => `<span class="ln"><span style="--i:${k}">${w}</span></span>`).join(' ')}</h1></div></header>
<div class="wrap narrow prose page-prose">${pg.html}</div>`;
  return layout(ctx, { path: pg.path, type: 'page', title: `${pg.title} | ${site.name}`, description: pg.description }, body);
}
