/* Analytics-ready tracking. Events queue in localStorage; set CONFIG.analyticsEndpoint in main.js to POST them to your PHP/Node API. */
(function () {
  'use strict';
  const S = (window.SBC = window.SBC || {});
  const A = (S.Analytics = { endpoint: '', slug: '', source: 'direct' });
  const KEY = 'sbc_queue';

  A.init = function (opts) {
    A.endpoint = opts.endpoint || '';
    A.slug = opts.slug;
    const src = new URLSearchParams(location.search).get('src');
    A.source = src === 'nfc' || src === 'qr' ? src : 'direct';
    if (src) { // keep the address bar (and shared links) free of ?src=
      const u = new URL(location.href);
      u.searchParams.delete('src');
      history.replaceState(null, '', u);
    }
    let first = true;
    try {
      first = !sessionStorage.getItem('sbc_view_' + A.slug);
      sessionStorage.setItem('sbc_view_' + A.slug, '1');
    } catch (e) { /* storage unavailable */ }
    if (first) {
      A.track('profile_view');
      if (A.source !== 'direct') A.track(A.source + '_visit');
    }
  };

  A.track = function (event, meta) {
    const e = { event, slug: A.slug, source: A.source, meta: meta || null, ts: Date.now() };
    try {
      const q = JSON.parse(localStorage.getItem(KEY) || '[]');
      q.push(e);
      localStorage.setItem(KEY, JSON.stringify(q.slice(-100)));
    } catch (err) { /* storage unavailable */ }
    if (A.endpoint && navigator.sendBeacon) {
      navigator.sendBeacon(A.endpoint, new Blob([JSON.stringify(e)], { type: 'application/json' }));
    }
  };

  // Any element with data-track="event_name" (optional data-track-meta) is tracked on click
  document.addEventListener('click', function (ev) {
    const el = ev.target.closest('[data-track]');
    if (el) A.track(el.dataset.track, el.dataset.trackMeta);
  });
})();
