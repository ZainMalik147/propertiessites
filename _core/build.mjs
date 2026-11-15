// Shared static-site generator for the three developer-guide sites.
// Usage:  node build.mjs            -> builds all sites
//         node build.mjs tulum      -> builds one site
// Each site folder contains:
//   content/site.json        site settings, copy, analytics IDs  (editable in /admin CMS)
//   content/developers.json  developer profiles                   (editable in /admin CMS)
//   assets/                  logos + photography
//   theme/templates.mjs      the site's own layout + page templates
//   theme/*.css|*.js         the site's own styles, scripts and 3D scene
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { legalPages } from './legal.mjs';

export const esc = (s = '') => String(s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

const readJSON = (p) => JSON.parse(fs.readFileSync(p, 'utf8').replace(/^\uFEFF/, ''));

function copyDir(src, dst) {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dst, { recursive: true });
  for (const e of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, e.name), d = path.join(dst, e.name);
    if (e.isDirectory()) copyDir(s, d); else fs.copyFileSync(s, d);
  }
}

/** Adds referral UTM parameters so developers can see the traffic this guide sends them. */
export function outboundUrl(site, url) {
  if (!site.outboundUtm || !url) return url;
  try {
    const u = new URL(url);
    for (const [k, v] of Object.entries(site.outboundUtm)) if (!u.searchParams.has(k)) u.searchParams.set(k, v);
    return u.toString();
  } catch { return url; }
}

/** Attributes for every link that leaves the site toward a developer. analytics.js reads these. */
export function outAttrs(site, dev, placement, type = 'website', extra = '') {
  return `data-outbound data-developer="${esc(dev.slug)}" data-developer-name="${esc(dev.name)}" data-placement="${esc(placement)}" data-link-type="${esc(type)}" target="_blank" rel="noopener"${extra}`;
}

/** Common <head> SEO block: title, description, canonical, OG/Twitter, hreflang-ready, JSON-LD. */
export function seoHead(site, page) {
  const url = site.url.replace(/\/$/, '') + page.path;
  const img = page.image ? site.url.replace(/\/$/, '') + '/' + page.image.replace(/^\//, '') : '';
  const ld = [].concat(page.jsonld || []).map(j => `<script type="application/ld+json">${JSON.stringify(j).replace(/</g, '\\u003c')}</script>`).join('\n');
  const alt = (site.languages || []).filter(l => l.enabled && l.code !== site.lang)
    .map(l => `<link rel="alternate" hreflang="${l.code}" href="${site.url.replace(/\/$/, '')}/${l.code}${page.path}">`).join('\n');
  return `<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(page.title)}</title>
<meta name="description" content="${esc(page.description)}">
<link rel="canonical" href="${esc(url)}">
<link rel="alternate" hreflang="${site.lang}" href="${esc(url)}">
${alt}
<meta name="robots" content="index, follow, max-image-preview:large">
<meta property="og:type" content="${page.ogType || 'website'}">
<meta property="og:site_name" content="${esc(site.name)}">
<meta property="og:title" content="${esc(page.title)}">
<meta property="og:description" content="${esc(page.description)}">
<meta property="og:url" content="${esc(url)}">
${img ? `<meta property="og:image" content="${esc(img)}">` : ''}
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="${esc(site.themeColor || '#000')}">
${site.verification?.google ? `<meta name="google-site-verification" content="${esc(site.verification.google)}">` : ''}
${site.verification?.bing ? `<meta name="msvalidate.01" content="${esc(site.verification.bing)}">` : ''}
<link rel="icon" href="/assets/brand/favicon.svg" type="image/svg+xml">
${ld}`;
}

/** Responsive <img> for a photo saved as name-960.webp / name-1920.webp */
export function photo(img, { alt, cls = '', eager = false, sizes = '100vw', attrs = '' } = {}) {
  if (!img) return '';
  const base = '/' + img.file.replace(/^\//, '');
  return `<img class="${cls}" src="${base}-1920.webp" srcset="${base}-960.webp 960w, ${base}-1920.webp 1920w" sizes="${sizes}" alt="${esc(alt ?? img.subject ?? '')}" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async" ${attrs}>`;
}

export function orgJsonLd(site) {
  return {
    '@context': 'https://schema.org', '@type': 'WebSite', name: site.name, url: site.url,
    description: site.description, inLanguage: site.lang,
    publisher: { '@type': 'Organization', name: site.name, url: site.url, email: site.contactEmail },
  };
}

export function developerJsonLd(site, dev) {
  return [{
    '@context': 'https://schema.org', '@type': 'Organization', name: dev.name, url: dev.website,
    description: dev.summary, logo: dev.logo?.file ? site.url.replace(/\/$/, '') + '/' + dev.logo.file : undefined,
    sameAs: [dev.website],
  }, {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: site.url },
      { '@type': 'ListItem', position: 2, name: 'Developers', item: site.url.replace(/\/$/, '') + '/#developers' },
      { '@type': 'ListItem', position: 3, name: dev.name, item: site.url.replace(/\/$/, '') + `/developers/${dev.slug}/` },
    ],
  }];
}

function sitemap(site, pages) {
  const base = site.url.replace(/\/$/, '');
  const today = new Date().toISOString().slice(0, 10);
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(p => `  <url><loc>${base}${p.path}</loc><lastmod>${today}</lastmod><priority>${p.priority ?? 0.5}</priority></url>`).join('\n')}
</urlset>
`;
}

function robots(site) {
  // Everything public is open to search engines and AI search crawlers (per brief §8).
  return `# ${site.name}
User-agent: *
Allow: /
Disallow: /admin/

User-agent: OAI-SearchBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: GPTBot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: Googlebot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: ClaudeBot
Allow: /

Sitemap: ${site.url.replace(/\/$/, '')}/sitemap.xml
`;
}

function llmsTxt(site, devs) {
  const base = site.url.replace(/\/$/, '');
  return `# ${site.name}

> ${site.description}

${site.name} is an independent editorial directory. It is not a real estate agency or broker, does not sell property and is not affiliated with the companies it profiles.

## Developer profiles
${devs.map(d => `- [${d.name}](${base}/developers/${d.slug}/): ${d.summary}`).join('\n')}

## About
- [About the guide](${base}/about/)
- [Editorial policy](${base}/editorial-policy/)
- [Disclaimer](${base}/disclaimer/)
`;
}

export async function buildSite(siteDir) {
  const root = path.resolve(siteDir);
  const site = readJSON(path.join(root, 'content/site.json'));
  const devFile = readJSON(path.join(root, 'content/developers.json'));
  const images = devFile.images || [];
  const devs = (devFile.developers || [])
    .filter(d => d.published !== false)
    .sort((a, b) => (a.order ?? 99) - (b.order ?? 99));

  // Sources must be plain URLs (research notes such as "url (via Wayback …)" are trimmed).
  for (const d of devs) d.sources = [...new Set((d.sources || []).map(s => {
    const u = String(s).trim().split(/\s+/)[0];
    return /^https?:\/\//.test(u) ? u : 'https://' + u;
  }).filter(u => !/web\.archive\.org/.test(u)))];

  const sponsored = devs.filter(d => d.listingType === 'sponsored');
  if (sponsored.length > (site.maxAdvertisers ?? 8))
    console.warn(`  ! ${sponsored.length} sponsored listings exceed the limit of ${site.maxAdvertisers ?? 8}`);

  const img = (key) => images.find(i => i.file.endsWith('/' + key) || i.key === key) || images[0];
  const tpl = await import('file:///' + path.join(root, 'theme/templates.mjs').replace(/\\/g, '/') + `?t=${Date.now()}`);
  const ctx = { site, devs, images, img, esc, photo, outAttrs, outboundUrl, seoHead, orgJsonLd, developerJsonLd };

  const dist = path.join(root, 'dist');
  fs.rmSync(dist, { recursive: true, force: true });
  fs.mkdirSync(dist, { recursive: true });

  const pages = [];
  // Developers whose official site is down: outbound links become inert labels (no dead/parked links),
  // and a notice is injected under each of their sections.
  const offline = devs.filter(d => d.websiteOffline);
  const disableOffline = (html) => {
    for (const d of offline) {
      const re = new RegExp('<a ([^>]*?)data-outbound data-developer="' + d.slug + '"[^>]*>([\\s\\S]*?)</a>', 'g');
      html = html.replace(re, (m, pre, inner) => {
        const cls = (m.match(/class="([^"]*)"/) || [])[1] || '';
        return `<span class="${cls} link-off" aria-disabled="true">${inner.replace(/<span class="sr-only">[\s\S]*?<\/span>/g, '')}</span>`;
      });
      const note = `<p class="site-offline" role="note">${esc(d.websiteNote || `${d.name}'s official website is currently unavailable, so links are temporarily disabled.`)}</p>`;
      html = html.replace(new RegExp('(<h[13][^>]*id="dev-' + d.slug + '-name"[^>]*>[\\s\\S]*?</h[13]>)'), (m) => m + note);
      if (html.includes(`data-developer="${d.slug}" data-developer-name`) && html.includes('data-page="profile"'))
        html = html.replace(/(<\/h1>)/, `$1${note}`);
    }
    return html;
  };
  const write = (p, html) => {
    html = disableOffline(html);
    const file = path.join(dist, p.path, 'index.html');
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, html);
    pages.push(p);
  };

  // Home
  write({ path: '/', priority: 1.0 }, tpl.home(ctx));
  // Developer profiles
  for (const dev of devs) write({ path: `/developers/${dev.slug}/`, priority: 0.9 }, tpl.profile(ctx, dev));
  // Legal / info pages (shared copy, site-specific jurisdiction + site-specific layout)
  for (const pg of legalPages(site, devs, images)) write({ path: pg.path, priority: pg.priority ?? 0.4 }, tpl.page(ctx, pg));
  // 404 (not in sitemap)
  fs.writeFileSync(path.join(dist, '404.html'), tpl.page(ctx, {
    path: '/404/', title: 'Page not found', kicker: '404', description: 'This page could not be found.',
    html: `<p>The page you were looking for doesn't exist. <a href="/">Return to the homepage</a>.</p>`,
  }));

  fs.writeFileSync(path.join(dist, 'sitemap.xml'), sitemap(site, pages));
  fs.writeFileSync(path.join(dist, 'robots.txt'), robots(site));
  fs.writeFileSync(path.join(dist, 'llms.txt'), llmsTxt(site, devs));
  if (site.indexNowKey) fs.writeFileSync(path.join(dist, `${site.indexNowKey}.txt`), site.indexNowKey);

  // Static files
  copyDir(path.join(root, 'assets'), path.join(dist, 'assets'));
  copyDir(path.join(root, 'theme/static'), path.join(dist, 'assets/theme'));
  fs.copyFileSync(path.join(path.dirname(fileURLToPath(import.meta.url)), 'analytics.js'), path.join(dist, 'assets/theme/analytics.js'));
  // Decap CMS admin + its content files (so the CMS edits the same JSON the build reads)
  copyDir(path.join(root, 'admin'), path.join(dist, 'admin'));
  fs.writeFileSync(path.join(dist, '_headers'), `/*
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  X-Frame-Options: SAMEORIGIN
  Permissions-Policy: camera=(), microphone=(), geolocation=()
/assets/*
  Cache-Control: public, max-age=604800
`);
  console.log(`  ✓ ${site.name}: ${pages.length} pages → ${path.relative(process.cwd(), dist)}`);
  return pages;
}
