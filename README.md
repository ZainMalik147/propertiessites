# Developer Guides — Tulum · Netanya · Abu Dhabi

Three independent editorial directory sites, each with its own identity, built from one small static-site generator.

| Site | Style | Signature 3D | Fonts | Preview |
|---|---|---|---|---|
| **Tulum Properties** | Modern Tropical Luxury: sand, jungle green, clay, cenote turquoise; arched forms | Hero photo rendered in WebGL as cenote water (pointer ripples + caustics) with drifting 3D pollen | Cormorant Garamond + Outfit | `node serve.mjs tulum 4301` |
| **Netanya Properties** | Modern Coastal Luxury as an architecture magazine: limestone, ink navy, Mediterranean blue | 3D point-cloud Mediterranean under a dusk sun with rising cliff-top towers | Bodoni Moda + Inter Tight | `node serve.mjs netanya 4302` |
| **Abu Dhabi Properties** | Modern Architectural Luxury: obsidian, champagne gold, Islamic-geometry star | 3D gold wireframe skyline rising from a mirrored grid, orbiting camera, gold dust | Italiana + Jost | `node serve.mjs abu-dhabi 4303` |

Every site has: home, 4 developer profiles (`/developers/<slug>/`), About, Editorial Policy, Disclaimer, Privacy Policy, Contact, Image Credits, 404 — plus an Accessibility Statement on Netanya (Israeli requirement). No prices, inventory or lead forms (per the briefs, §5 and §9). Each developer's **projects/communities** are listed by name and link to the developer's own page for that project.

## Build & preview

Requires Node 18+. No npm install needed.

```bash
node build.mjs            # builds all three into <site>/dist
node build.mjs tulum      # one site
node serve.mjs tulum 4301 # preview with clean URLs
```

## Folder layout

```
_core/            shared generator: SEO, sitemap, robots, llms.txt, legal pages, analytics.js
<site>/content/   site.json (settings, copy, analytics IDs) + developers.json (profiles, photos)
<site>/assets/    logos/ (official, unmodified), img/ (licensed photos, WebP 960 + 1920), brand/ (favicon)
<site>/theme/     templates.mjs + static/ (style.css, main.js, scene.js) — the site's own design
<site>/admin/     Decap CMS (content editor at /admin)
<site>/dist/      build output — deploy this folder
```

## Content management (CMS)

`/admin` on each site runs **Decap CMS** (free, open-source). It edits `content/site.json` and `content/developers.json` directly in Git; each save triggers a rebuild.

Setup (Netlify, free tier): push this folder to a GitHub repo you own → create one Netlify site per city with **Base directory** = `tulum` / `netanya` / `abu-dhabi` (each folder has a `netlify.toml`) → enable *Identity* + *Git Gateway* → invite yourself. Using another host? Switch `backend` in `admin/config.yml` to `github`.

**Add a developer:** add an entry in *Developers* (slug, name, website, summary, description, areas, facts, projects, logo, photos). The profile page, homepage section, sitemap, structured data, menu and footer update automatically.

**Sponsored listings:** set *Listing type* to `sponsored` — the profile is labelled "Sponsored" everywhere. The build warns if more than `maxAdvertisers` (8) are sponsored. Editorial profiles don't count toward the limit.

**Remove/replace a logo:** change `logo.file` (or delete it — the name is shown as text instead).

## Analytics (brief §6)

Everything is consent-gated (Google Consent Mode v2, default *denied*; tags load only after "Accept").

1. Create a **GA4** property and a **Google Tag Manager** web container (both in your own Google account).
2. Put the GTM ID in *Site settings → gtmId* (or a GA4 ID in `ga4Id` to skip GTM).
3. In GTM add: *Google tag* (your G- ID) on Initialization – All Pages; and two **GA4 Event** tags fired by **Custom Event** triggers:

| dataLayer event | Event parameters to pass (Data Layer Variables) |
|---|---|
| `developer_outbound_click` | `developer`, `developer_name`, `placement`, `link_type`, `link_url`, `campaign_source`, `campaign_medium`, `campaign_campaign` |
| `developer_profile_view` | `developer`, `developer_name` |

   Use only these Custom Event triggers — **do not** also add a GTM "Just Links"/outbound click trigger, or clicks will be double-counted. The site pushes exactly one event per click (with a guard against duplicate click/auxclick).
4. In GA4: register `developer`, `placement`, `link_type` as **custom dimensions**; mark `developer_outbound_click` as a **key event** (conversion) — importable into Google Ads.
5. `placement` tells you where the click happened: `home`, `profile_hero`, `profile_facts`, `profile_projects`, `profile_footer`, `profile_sidebar`; `link_type` = `website` or `project`.
6. **Looker Studio**: new report → GA4 connector → pages: *Traffic* (users, sessions, views over time), *Sources* (session source/medium, country), *Developer interest* (`developer_profile_view` by `developer`), *Outbound clicks* (`developer_outbound_click` by `developer` × `placement`, and by session campaign). Date range + comparison controls and PDF/CSV export are built in.
7. Outbound links carry `utm_source=<site>&utm_medium=referral&utm_campaign=developer-guide` so each developer can see the traffic in their own analytics (edit `outboundUtm` in site settings, or remove it).

## SEO & AI search (brief §7–8)

- Unique titles/descriptions, canonical URLs, Open Graph, clean URLs, one H1 per page, alt text on every image.
- JSON-LD: `WebSite`, `ItemList` of developers, `Organization` + `BreadcrumbList` per profile.
- `sitemap.xml`, `robots.txt` (Google, Bing, OAI-SearchBot, ChatGPT-User, GPTBot, PerplexityBot, ClaudeBot all allowed), `llms.txt`.
- **IndexNow:** key file is generated at `/<indexNowKey>.txt`. After each deploy: `curl "https://api.indexnow.org/indexnow?url=<changed-url>&key=<indexNowKey>"`.
- **Search Console / Bing Webmaster Tools:** paste verification codes into site settings, then submit `sitemap.xml`. In Bing Webmaster Tools open **AI Performance** to see Copilot/Bing AI citations — this stays separate from GA4 visit data.
- The hero WebGL loads after first paint, only on capable devices, never with reduced-motion or Save-Data; photos are WebP at 960/1920 widths with `srcset`.

## Accessibility

Skip links, landmarks, keyboard-operable menus (Esc closes), visible focus, AA contrast, new-tab links announced, `prefers-reduced-motion` respected, and a **Pause motion** control in every footer. Netanya uses logical CSS properties throughout so Hebrew (RTL) can be added; Abu Dhabi is likewise ready for Arabic. Run an audit (axe / Lighthouse) and a screen-reader pass before launch; Netanya's statement must name a real accessibility coordinator.

## Before launch — fill these in

- [ ] Real domains in each `site.json` `url` and `admin/config.yml` `site_url`; real contact emails.
- [ ] GTM/GA4 IDs, Search Console + Bing verification codes.
- [ ] Netanya: accessibility coordinator name/phone in `legal.accessibilityContact` / `accessibilityPhone`.
- [ ] Legal review of the policy pages for each jurisdiction (Mexico: LFPDPPP, LFPC, NOM-247-SE-2021, Quintana Roo; Israel: Real Estate Brokers Law, Privacy Protection Law Amendment 13, accessibility regulations; UAE: PDPL, ADREC rules).
- [ ] Review each developer's brand-usage guidelines (recorded in `developers.json` → `logo.guidelines`) and confirm logo use; consider notifying the companies.
- [ ] Re-verify developer facts and project URLs shortly before launch (they change).
- [ ] Test the UTM flow: open `/?utm_source=test&utm_medium=cpc&utm_campaign=launch`, accept cookies, click a developer link, confirm one `developer_outbound_click` in GA4 DebugView.
