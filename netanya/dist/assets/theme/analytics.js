/*
 * Analytics + consent for the developer guides.
 * - Google Consent Mode v2: everything denied until the visitor chooses.
 * - Loads Google Tag Manager (preferred) or GA4 directly, using IDs from <meta name="gtm-id"> / <meta name="ga4-id">.
 * - Pushes exactly ONE dataLayer event per outbound developer click (no double counting):
 *     event: "developer_outbound_click", developer, developer_name, placement (home|profile|...), link_type, link_url
 * - Pushes "developer_profile_view" on profile pages.
 * - Keeps first-touch UTM parameters for the session and attaches them to events so
 *   campaign → developer click conversions can be reported in GA4 / Looker Studio.
 */
(function () {
  var w = window, d = document;
  w.dataLayer = w.dataLayer || [];
  function gtag() { w.dataLayer.push(arguments); }
  w.gtag = w.gtag || gtag;

  var meta = function (n) { var m = d.querySelector('meta[name="' + n + '"]'); return m ? m.content.trim() : ''; };
  var GTM = meta('gtm-id'), GA4 = meta('ga4-id');
  var KEY = 'guide_consent_v1';
  var store = { get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
                set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} } };

  gtag('consent', 'default', {
    ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied',
    analytics_storage: 'denied', functionality_storage: 'granted', security_storage: 'granted',
    wait_for_update: 500
  });
  gtag('set', 'ads_data_redaction', true);
  gtag('set', 'url_passthrough', true);

  // ---- UTM capture (session first-touch) ----
  var UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid'];
  var utm = {};
  try {
    var saved = sessionStorage.getItem('guide_utm');
    if (saved) utm = JSON.parse(saved);
    var q = new URLSearchParams(location.search), found = false;
    UTM_KEYS.forEach(function (k) { if (q.get(k)) { found = true; } });
    if (found) { utm = {}; UTM_KEYS.forEach(function (k) { if (q.get(k)) utm[k] = q.get(k); }); sessionStorage.setItem('guide_utm', JSON.stringify(utm)); }
  } catch (e) {}

  function loadTags() {
    if (w.__guideTagsLoaded) return; w.__guideTagsLoaded = true;
    if (GTM) {
      w.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' });
      var s = d.createElement('script'); s.async = true; s.src = 'https://www.googletagmanager.com/gtm.js?id=' + encodeURIComponent(GTM); d.head.appendChild(s);
    } else if (GA4) {
      var g = d.createElement('script'); g.async = true; g.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(GA4); d.head.appendChild(g);
      gtag('js', new Date()); gtag('config', GA4);
    }
  }

  function applyConsent(choice) {
    var granted = choice === 'all';
    gtag('consent', 'update', {
      analytics_storage: granted || choice === 'analytics' ? 'granted' : 'denied',
      ad_storage: granted ? 'granted' : 'denied',
      ad_user_data: granted ? 'granted' : 'denied',
      ad_personalization: granted ? 'granted' : 'denied'
    });
  }

  // Default "basic": no Google tags load until the visitor accepts. Set
  // data-consent-mode="advanced" on <html> to allow cookieless pings before consent.
  var basic = d.documentElement.getAttribute('data-consent-mode') !== 'advanced';
  var prior = store.get(KEY);
  if (prior) applyConsent(prior);
  if (!basic || prior === 'all' || prior === 'analytics') loadTags();

  // ---- Events ----
  function base(extra) {
    var o = { page_type: d.body.getAttribute('data-page') || 'page' };
    for (var k in utm) o['campaign_' + k.replace('utm_', '')] = utm[k];
    for (var e in extra) o[e] = extra[e];
    return o;
  }

  function onReady() {
    var dev = d.body.getAttribute('data-developer');
    if (dev) w.dataLayer.push(base({ event: 'developer_profile_view', developer: dev, developer_name: d.body.getAttribute('data-developer-name') || dev }));

    // One delegated listener; a per-click guard stops double pushes (e.g. auxclick + click).
    var last = { t: 0, el: null };
    function handle(ev) {
      var a = ev.target.closest && ev.target.closest('a[data-outbound]');
      if (!a) return;
      if (ev.type === 'auxclick' && ev.button !== 1) return;
      var now = Date.now();
      if (last.el === a && now - last.t < 800) return;
      last = { t: now, el: a };
      w.dataLayer.push(base({
        event: 'developer_outbound_click',
        developer: a.getAttribute('data-developer'),
        developer_name: a.getAttribute('data-developer-name'),
        placement: a.getAttribute('data-placement'),
        link_type: a.getAttribute('data-link-type') || 'website',
        link_url: a.href
      }));
    }
    d.addEventListener('click', handle, true);
    d.addEventListener('auxclick', handle, true);

    // ---- Consent banner ----
    var banner = d.getElementById('consent');
    if (!banner) return;
    var open = function () { banner.hidden = false; requestAnimationFrame(function () { banner.classList.add('is-open'); }); };
    var close = function () { banner.classList.remove('is-open'); setTimeout(function () { banner.hidden = true; }, 400); };
    if (!prior) setTimeout(open, 1200);
    banner.addEventListener('click', function (e) {
      var b = e.target.closest('[data-consent]'); if (!b) return;
      var c = b.getAttribute('data-consent');
      store.set(KEY, c); applyConsent(c); if (c !== 'none') loadTags(); close();
    });
    d.querySelectorAll('[data-open-consent]').forEach(function (b) { b.addEventListener('click', function (e) { e.preventDefault(); open(); }); });
  }
  if (d.readyState === 'loading') d.addEventListener('DOMContentLoaded', onReady); else onReady();
})();
