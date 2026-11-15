// Shared copy for About / Editorial Policy / Disclaimer / Privacy / Contact / Accessibility / Credits.
// Jurisdiction-specific wording is driven by site.legal.jurisdiction ("MX" | "IL" | "AE").
// NOTE: this is a solid drafting baseline — have local counsel review before public launch (brief §9).
const esc = (s = '') => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const J = {
  MX: {
    country: 'Mexico',
    notAgent: `We are not a real estate agency, broker or advisor, and we are not registered as a real estate service provider in Quintana Roo. We do not act on behalf of any developer or buyer.`,
    adRules: `Because we do not offer or advertise property for sale, the guide contains no prices, payment plans, availability, yields or investment projections. Any such information must be obtained directly from the developer, whose commercial communications are subject to Mexico's consumer protection framework, including the Federal Consumer Protection Law (LFPC) and NOM-247-SE-2021 on commercial practices for residential real estate.`,
    privacyLaw: `Mexico's Federal Law on the Protection of Personal Data Held by Private Parties (LFPDPPP) and its applicable regulations`,
    rights: `You may exercise your ARCO rights (Access, Rectification, Cancellation and Opposition) and revoke consent by writing to the address below. We will respond within the time limits set by the applicable law.`,
    authority: `If you believe your rights have not been respected, you may contact the competent Mexican data protection authority.`,
  },
  IL: {
    country: 'Israel',
    notAgent: `We are not a licensed real estate broker under Israel's Real Estate Brokers Law, 5756-1996, we do not mediate transactions, and we are not an authorized representative of any developer. We do not receive fees for referrals.`,
    adRules: `The guide does not advertise specific apartments, prices, availability or purchase terms. For any project information that may affect a decision, please rely only on the developer's official materials and on independent professional advice.`,
    privacyLaw: `Israel's Protection of Privacy Law, 5741-1981, as amended (including Amendment No. 13), and the Privacy Protection (Data Security) Regulations, 5777-2017`,
    rights: `You may request to review personal information held about you and ask for it to be corrected or deleted, as provided in the Protection of Privacy Law. Write to the address below and we will respond within the statutory period.`,
    authority: `You may also contact the Privacy Protection Authority (Ministry of Justice).`,
  },
  AE: {
    country: 'the United Arab Emirates',
    notAgent: `We are not a real estate broker or agency, we are not registered with the Abu Dhabi Real Estate Centre (ADREC) or any other regulator as a broker, and we are not an authorized representative of any developer.`,
    adRules: `The guide does not advertise units, prices, payment plans or purchase offers. Property advertising in Abu Dhabi is regulated, and any commercial information should be obtained directly from the developer or a licensed broker.`,
    privacyLaw: `the UAE Federal Decree-Law No. 45 of 2021 on the Protection of Personal Data (PDPL), to the extent applicable, and other relevant UAE laws`,
    rights: `You may request access to, correction of, or deletion of personal data we hold about you, and you may withdraw consent at any time, by writing to the address below.`,
    authority: `You may also contact the UAE Data Office or the competent authority.`,
  },
};

export function legalPages(site, devs, images) {
  const j = J[site.legal?.jurisdiction] || J.MX;
  const names = devs.map(d => d.name);
  const list = names.length > 1 ? names.slice(0, -1).join(', ') + ' and ' + names.at(-1) : names[0] || '';
  const mail = `<a href="mailto:${esc(site.contactEmail)}">${esc(site.contactEmail)}</a>`;
  const updated = site.legal?.updated || new Date().toISOString().slice(0, 10);
  const tools = site.ga4Id || site.gtmId ? 'Google Analytics 4 via Google Tag Manager' : 'Google Analytics 4 via Google Tag Manager (once configured)';

  const pages = [
    {
      path: '/about/', priority: 0.6, kicker: 'About', title: `About ${site.name}`,
      description: `${site.name} is an independent editorial guide to established real estate developers active in ${site.city}.`,
      html: `
<p class="lead">${esc(site.name)} is an independent, English-language guide to established real estate developers active in ${esc(site.city)}, ${esc(site.cityCountry || j.country)}.</p>
<h2>What this guide is</h2>
<p>We profile developers that are shaping ${esc(site.city)}'s residential landscape — their background, where they work, the kind of communities they build, and where to find their official information. Each profile links directly to the developer's own website so that readers can continue their research at the source.</p>
<h2>What it is not</h2>
<p>${j.notAgent} We do not sell property, collect buyer enquiries, publish prices or recommend investments.</p>
<h2>How companies are selected</h2>
<p>The current selection — ${esc(list)} — is editorial. It is not a ranking and does not suggest that these are the largest or best developers in ${esc(site.city)}. See our <a href="/editorial-policy/">editorial policy</a> for how profiles are researched and kept up to date.</p>
<h2>Independence</h2>
<p>The companies featured have not paid to appear and have no control over what we write. Their names, logos and links are used only to identify them. If sponsored placements are introduced in future, they will always be clearly labelled as such and kept separate from editorial profiles.</p>`,
    },
    {
      path: '/editorial-policy/', priority: 0.4, kicker: 'Policy', title: 'Editorial Policy',
      description: `How ${site.name} selects, researches, writes and updates its developer profiles.`,
      html: `
<p class="lead">Our aim is to give readers a clear, accurate and fair starting point for learning about developers active in ${esc(site.city)}.</p>
<h2>Selection</h2>
<p>Developers are chosen by our editors based on an established, publicly visible track record in ${esc(site.city)}. Inclusion is not a ranking, endorsement or recommendation, and the order in which companies appear has no significance.</p>
<h2>Sources</h2>
<p>Profiles are written in our own words using publicly available information — principally each developer's official website, published company materials and reputable press coverage. Sources are listed on each profile.</p>
<h2>What we don't publish</h2>
<p>We do not publish prices, inventory, payment plans, yields or investment projections, and we do not rate or review individual properties.</p>
<h2>Logos and trademarks</h2>
<p>Company names and logos belong to their respective owners. They are reproduced unaltered, only to identify each company, and never as part of our own branding. Their use does not imply any partnership, sponsorship or endorsement.</p>
<h2>Corrections</h2>
<p>We review profiles periodically. If you spot an error — including developers wishing to correct factual information or request removal of their logo — write to ${mail} and we will review it promptly.</p>
<h2>Sponsored content</h2>
<p>The guide may in future offer a limited number of clearly labelled sponsored placements. Sponsored content will always be identified as such and will not affect editorial profiles or their selection.</p>`,
    },
    {
      path: '/disclaimer/', priority: 0.3, kicker: 'Legal', title: 'Disclaimer',
      description: `${site.name} is an independent informational resource with no affiliation to the developers it features.`,
      html: `
<p class="lead">${esc(site.name)} is an independent informational resource. It is not affiliated with, endorsed by, or acting on behalf of ${esc(list)} or any other company mentioned on this website.</p>
<h2>No brokerage or advice</h2>
<p>${j.notAgent}</p>
<p>${j.adRules}</p>
<p>Nothing on this website is legal, financial, tax or investment advice. Before making any decision, verify all information directly with the developer and consult qualified, independent professionals.</p>
<h2>Accuracy</h2>
<p>Content is based on publicly available information at the time of writing and may change without notice. While we take care to be accurate, we make no warranty as to completeness or currency.</p>
<h2>External websites</h2>
<p>Links to developers' websites are provided for convenience. We have no control over and accept no responsibility for third-party websites or their content.</p>
<h2>Trademarks</h2>
<p>All company names, logos and trademarks are the property of their respective owners and are used for identification only.</p>`,
    },
    {
      path: '/privacy-policy/', priority: 0.3, kicker: 'Legal', title: 'Privacy Policy',
      description: `How ${site.name} handles personal data, analytics and cookies.`,
      html: `
<p class="lead">This notice explains what information ${esc(site.name)} collects when you visit, and why. Last updated: ${esc(updated)}.</p>
<h2>Who is responsible</h2>
<p>The website is operated by ${esc(site.operator || site.name)} (the "controller"). Contact: ${mail}.</p>
<h2>What we collect</h2>
<p>We do not ask you to create an account and we do not collect enquiries from property buyers. With your consent, we use ${tools} to measure aggregated usage: pages viewed, approximate location (country/city), device and browser type, how you arrived (for example a search engine, social network or advertising campaign including UTM parameters), and which links to developers' official websites were clicked.</p>
<p>If you email us, we receive your email address and whatever you choose to include, and use it only to reply.</p>
<h2>Cookies and consent</h2>
<p>Analytics and advertising cookies are <strong>off by default</strong>. They are only set if you choose "Accept" in the cookie banner. You can change your choice at any time using <a href="#" data-open-consent>Cookie settings</a>. We use Google Consent Mode so that Google services respect your choice.</p>
<h2>Purposes and legal basis</h2>
<p>Analytics data is used to understand how the guide is used, improve content, and report aggregated interest in each featured company. Processing is based on your consent, which you may withdraw at any time.</p>
<h2>Sharing and international transfers</h2>
<p>Analytics data is processed by Google LLC and its affiliates as our service provider, which may involve transfers outside ${esc(j.country)}. We may share aggregated, non-identifying statistics (for example, number of clicks to a company's website) with featured companies. We do not sell personal data.</p>
<h2>Retention</h2>
<p>Google Analytics event data is retained for ${esc(site.legal?.retention || '14 months')}, after which it is deleted automatically.</p>
<h2>Your rights</h2>
<p>This notice is provided in accordance with ${j.privacyLaw}. ${j.rights} ${j.authority}</p>
<h2>Changes</h2>
<p>We may update this notice; the date above shows the latest revision.</p>`,
    },
    {
      path: '/contact/', priority: 0.4, kicker: 'Contact', title: 'Contact',
      description: `Contact the editors of ${site.name}.`,
      html: `
<p class="lead">We'd love to hear from you — corrections, suggestions, and enquiries from developers are all welcome.</p>
<div class="contact-card">
  <p class="contact-label">Editorial &amp; general</p>
  <p class="contact-email">${mail}</p>
</div>
<h2>Looking to buy or rent?</h2>
<p>${esc(site.name)} is an editorial guide and cannot answer questions about specific properties, prices or availability. Please contact the developers directly through the official links on each profile:</p>
<ul class="contact-devs">${devs.map(d => `<li><a href="/developers/${d.slug}/">${esc(d.name)}</a></li>`).join('')}</ul>
<h2>Are you a developer?</h2>
<p>If your company is featured and you would like to update information or your logo, or if you are interested in being considered for the guide, write to us at ${mail}.</p>`,
    },
  ];

  if (site.legal?.accessibility) pages.push({
    path: '/accessibility/', priority: 0.4, kicker: 'Accessibility', title: 'Accessibility Statement',
    description: `Accessibility statement for ${site.name}.`,
    html: `
<p class="lead">We want everyone to be able to use ${esc(site.name)}, including people with disabilities. Last reviewed: ${esc(updated)}.</p>
<h2>Standard</h2>
<p>The website is designed to conform with the Web Content Accessibility Guidelines (WCAG) 2.1 at Level AA, consistent with Israeli Standard SI 5568 and the Equal Rights for Persons with Disabilities (Service Accessibility Adjustments) Regulations, 5773-2013.</p>
<h2>Accessibility features</h2>
<ul>
<li>Semantic HTML with a logical heading structure and landmarks.</li>
<li>A "Skip to content" link and full keyboard navigation with visible focus indicators.</li>
<li>Text alternatives for all meaningful images; decorative 3D graphics are hidden from assistive technology.</li>
<li>Colour contrast meeting AA ratios for body text and controls.</li>
<li>Text that can be resized to 200% without loss of content; responsive layouts down to 320px.</li>
<li>Animations are reduced or disabled when your device requests reduced motion, and can be paused using the "Pause motion" control.</li>
<li>Links that open in a new tab are announced to screen readers.</li>
<li>The site structure supports right-to-left languages for planned Hebrew content.</li>
</ul>
<h2>Known limitations</h2>
<p>Developer websites we link to are outside our control and may not meet the same standard. Some developer logos are supplied by the companies themselves and are provided as images with text alternatives.</p>
<h2>Accessibility coordinator</h2>
<p>If you encounter any barrier, please contact our accessibility coordinator, ${esc(site.legal?.accessibilityContact || 'the editor')}, at ${mail}${site.legal?.accessibilityPhone ? ` or ${esc(site.legal.accessibilityPhone)}` : ''}. Please describe the page and the problem; we will respond as soon as possible.</p>`,
  });

  if (images?.length) pages.push({
    path: '/credits/', priority: 0.2, kicker: 'Credits', title: 'Image Credits',
    description: `Photography credits and licences for ${site.name}.`,
    html: `
<p class="lead">Photography on this website is used under open licences. We thank the photographers below.</p>
<ul class="credits">${images.map(i => `<li><strong>${esc(i.subject)}</strong> — ${esc(i.author || 'Unknown')}, <a href="${esc(i.source)}" target="_blank" rel="noopener">${esc(i.license)}</a>${/BY|SA/i.test(i.license || '') ? ' (cropped/resized)' : ''}</li>`).join('')}</ul>
<p>Developer logos are trademarks of their respective owners and are reproduced unaltered for identification only.</p>`,
  });
  return pages;
}
