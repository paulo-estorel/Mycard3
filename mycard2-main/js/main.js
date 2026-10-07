/* Renders a profile from PROFILES. To go dynamic later, replace getProfile() with fetch('/api/profile.php?slug=...'). */
(function () {
  'use strict';
  const S = window.SBC;
  const CONFIG = {
    prettyUrls: false,            // true when your server rewrites /p/<slug> to profile.html (see README)
    defaultSlug: 'rhenjie-guarin',   // shown when no slug is in the URL
    analyticsEndpoint: ''         // e.g. '/api/track.php'
  };

  /* ---- Data: mirrors the future DB tables (profiles, businesses, services, products, social_links) ---- */
  const PROFILES = {
    'rhenjie-guarin': {
      slug: 'rhenjie-guarin', active: true, verified: true,
      name: 'Rhenjie Guarin', title: 'Sales Consultant', company: 'at Suzuki Auto Pangasinan',
      tagline: '',
      location: 'Calasiao Pangasinan', photo: '/images/profile-picture.jpg',
      phone: '+63 956 574 2290', messenger: 'rhenjie.guarin', email: 'rhenjieguarin123@gmail.com', website: 'https://example.com',
      address: 'Calasiao, Pangasinan, Philippines',
      hours: [['Mon – Fri', '9:00 AM – 6:00 PM'], ['Saturday', '10:00 AM – 2:00 PM'], ['Sunday', 'Closed']],
      social: { facebook: 'https://facebook.com/', instagram: 'https://instagram.com/', tiktok: 'https://tiktok.com/', linkedin: 'https://linkedin.com/', youtube: 'https://youtube.com/', x: 'https://x.com/' },
      about: {
        bio: 'I’m a dedicated Suzuki Sales Consultant committed to helping clients find the right vehicle for their needs and budget. I provide honest guidance, personalized assistance, and a smooth car-buying experience—from choosing the right model to completing the purchase.',
        closing: 'Your needs. Your budget. Your right Suzuki.',
        experience: ['Founder, Morgan Digital Solutions (2017 – present)', 'Senior Consultant, Brightline Advisory (2012 – 2017)', '120+ businesses supported across retail, hospitality and services'],
        skills: ['Customer Service', 'Sale & Negotiation', 'Product Knowledge', 'Test driving Assistance', 'Financing Assistance', 'Digital & Social Media Marketing']
      },
      services: [
        { icon: 'code', name: 'Web Development', desc: 'Fast, mobile-first websites and online stores.' },
        { icon: 'zap', name: 'AI Automation', desc: 'Automate replies, reports and repetitive tasks.' },
        { icon: 'trend', name: 'Digital Marketing', desc: 'Campaigns, content and search that bring customers.' },
        { icon: 'brief', name: 'Business Consulting', desc: 'Clear plans for growth, pricing and operations.' }
      ],
      products: [
        { title: 'All-New Suzuki Fronx Hybrid', desc: 'Subcompact crossover SUV with smart hybrid technology, bold styling, and premium features.', price: 'Inquire for Promo', image: '/images/suzuki-fronx.jpg' },
        { title: 'Suzuki e VITARA', desc: 'Explore the all-electric Suzuki e VITARA.', price: 'Inquire for Promo', image: '/images/vitara.png' },
        { title: 'S.Presso', desc: 'Explore the compact Suzuki S.Presso.', price: 'Inquire for Promo', image: '/images/spreso.png' }
      ]
    }
  };

  /* ---- Icons (stroke paths, 24x24) ---- */
  const P = {
    phone: 'M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z',
    messenger: 'M12 2C6.48 2 2 6.03 2 11c0 2.87 1.5 5.43 3.84 7.04-.15.86-.54 2.27-1.63 3.48 0 0 2.11.16 4.31-1.35.48.1 1 .15 1.48.15 5.52 0 10-4.03 10-9S17.52 2 12 2zm1.09 12.18l-2.55-2.72-4.98 2.72 5.47-5.81 2.61 2.72 4.92-2.72-5.47 5.81z',
    whatsapp: 'M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8z',
    mail: 'M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zM22 7l-10 6L2 7',
    pin: 'M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0zM12 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6z',
    globe: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM2 12h20M12 2a15 15 0 0 1 4 10 15 15 0 0 1-4 10 15 15 0 0 1-4-10 15 15 0 0 1 4-10z',
    share: 'M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v13',
    download: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3',
    user: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z',
    code: 'M16 18l6-6-6-6M8 6l-6 6 6 6',
    zap: 'M13 2L3 14h9l-1 8 10-12h-9z',
    trend: 'M23 6l-9.5 9.5-5-5L1 18M17 6h6v6',
    brief: 'M4 7h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2zM16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16',
    facebook: 'M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z',
    instagram: 'M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zM16 11.4A4 4 0 1 1 12.6 8 4 4 0 0 1 16 11.4zM17.5 6.5h.01',
    tiktok: 'M9 12a4 4 0 1 0 4 4V3a5 5 0 0 0 5 5',
    linkedin: 'M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2zM4 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4z',
    youtube: 'M22.5 6.4a2.8 2.8 0 0 0-2-2C18.9 4 12 4 12 4s-6.9 0-8.6.5a2.8 2.8 0 0 0-2 2A29 29 0 0 0 1 11.8a29 29 0 0 0 .4 5.3 2.8 2.8 0 0 0 2 2c1.7.5 8.6.5 8.6.5s6.9 0 8.6-.5a2.8 2.8 0 0 0 2-2 29 29 0 0 0 .4-5.3 29 29 0 0 0-.5-5.4zM9.75 15V8.5l5.75 3.25z',
    x: 'M4 4l16 16M20 4L4 20',
    check: 'M20 6L9 17l-5-5'
  };
  const ico = (n, cls) => `<svg class="ico ${cls || ''}" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="${P[n]}"/></svg>`;
  const SOCIAL_LABELS = { facebook: 'Facebook', instagram: 'Instagram', tiktok: 'TikTok', linkedin: 'LinkedIn', youtube: 'YouTube', x: 'X (Twitter)' };

  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const svgUri = (svg) => 'data:image/svg+xml,' + encodeURIComponent(svg);
  const initials = (n) => n.split(/\s+/).map((w) => w[0]).slice(0, 2).join('').toUpperCase();
  const avatarFor = (p) => p.photo || svgUri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#2563EB"/><stop offset="1" stop-color="#111827"/></linearGradient></defs><rect width="200" height="200" fill="url(#g)"/><text x="100" y="124" font-family="Arial,sans-serif" font-size="76" font-weight="700" fill="#fff" text-anchor="middle">${esc(initials(p.name))}</text></svg>`);
  const productImg = (pr) => pr.image || svgUri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 200"><rect width="320" height="200" fill="hsl(${pr.hue},80%,94%)"/><circle cx="240" cy="60" r="70" fill="hsl(${pr.hue},80%,86%)"/><rect x="60" y="70" width="150" height="70" rx="12" fill="hsl(${pr.hue},70%,50%)"/></svg>`);

  /* ---- Profile lookup + URLs ---- */
  function getSlug() {
    const q = new URLSearchParams(location.search).get('u');
    const m = location.pathname.match(/\/p\/([^/]+)/);
    return (q || (m && decodeURIComponent(m[1])) || CONFIG.defaultSlug).toLowerCase();
  }
  const getProfile = (slug) => PROFILES[slug] && PROFILES[slug].active ? PROFILES[slug] : null;
  function profileUrl(slug, src) {
    const base = CONFIG.prettyUrls ? `${location.origin}/p/${slug}` : `${location.origin}${location.pathname.replace(/[^/]*$/, '')}profile.html?u=${slug}`;
    return src ? base + (base.includes('?') ? '&' : '?') + 'src=' + src : base;
  }

  /* ---- SEO ---- */
  function setMeta(p, url) {
    const desc = `${p.name}, ${p.title} at ${p.company}. ${p.tagline}`;
    document.title = `${p.name} | Smart Business Card`;
    const set = (sel, attr, val) => { const el = document.querySelector(sel); if (el) el.setAttribute(attr, val); };
    set('meta[name="description"]', 'content', desc);
    set('meta[property="og:title"]', 'content', document.title);
    set('meta[property="og:description"]', 'content', desc);
    set('meta[property="og:url"]', 'content', url);
    set('meta[name="twitter:title"]', 'content', document.title);
    set('meta[name="twitter:description"]', 'content', desc);
    set('link[rel="canonical"]', 'href', url);
    document.getElementById('ldjson').textContent = JSON.stringify({
      '@context': 'https://schema.org', '@type': 'Person', name: p.name, jobTitle: p.title,
      worksFor: { '@type': 'Organization', name: p.company, url: p.website },
      email: p.email, telephone: p.phone, url, address: p.address, sameAs: Object.values(p.social)
    });
  }

  /* ---- Rendering ---- */
  const section = (id, title, body, cls) => `<section class="card ${cls || ''}" aria-labelledby="${id}"><h2 id="${id}">${title}</h2>${body}</section>`;

  function render(p, url) {
    const mapsQ = encodeURIComponent(p.address);
    const contact = [
      ['phone', 'Call', 'tel:' + p.phone.replace(/[^+\d]/g, ''), 'phone_click'],
      ['messenger', 'Messenger', 'https://m.me/' + (p.messenger || 'rhenjie.guarin'), 'messenger_click'],
      ['mail', 'Email', 'mailto:' + p.email, 'email_click'],
      ['pin', 'Location', 'https://www.google.com/maps/search/?api=1&query=' + mapsQ, 'location_click'],
      ['globe', 'Website', p.website, 'website_click']
    ].map(([i, l, h, t]) => `<a class="btn" href="${esc(h)}" ${h.startsWith('http') ? 'target="_blank" rel="noopener"' : ''} data-track="${t}">${ico(i)}<span>${l}</span></a>`).join('');

    const social = Object.entries(p.social).filter(([, v]) => v).map(([k, v]) =>
      `<a href="${esc(v)}" target="_blank" rel="noopener" aria-label="${SOCIAL_LABELS[k]}" data-track="social_click" data-track-meta="${k}">${ico(k)}</a>`).join('');

    document.getElementById('main').innerHTML = `
      <header class="card hero">
        <div class="cover"><div class="brand-badge"><img src="/images/suzuki-brand-logo.svg" alt="Suzuki" width="130" height="20"></div></div>
        <div class="hero-body">
          <button class="avatar" id="avatarBtn" aria-label="View larger profile photo of ${esc(p.name)}"><img src="${avatarFor(p)}" alt="Photo of ${esc(p.name)}" width="128" height="128"></button>
          <h1 class="name">${esc(p.name)}${p.verified ? `<svg class="ico verified" viewBox="0 0 24 24" role="img" aria-label="Verified profile"><path d="M12 2l2.4 2 3.1-.3 1 3 2.7 1.6-.9 3 .9 3-2.7 1.6-1 3-3.1-.3L12 22l-2.4-2-3.1.3-1-3L2.8 15.7l.9-3-.9-3L5.5 8l1-3 3.1.3z"/><path d="M8.5 12.2l2.4 2.4 4.6-4.8" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>` : ''}</h1>
          <p class="role">${esc(p.title)}</p>
          <p class="muted">${esc(p.company)}</p>
          ${p.tagline ? `<p class="tagline">${esc(p.tagline)}</p>` : ''}
          <p class="loc">${ico('pin')}${esc(p.location)}</p>
          <div class="actions">
            <button class="btn btn-primary" id="saveBtn" data-track="save_contact_click">${ico('user')}Save Contact</button>
            <button class="btn" id="shareBtn" data-track="share_click">${ico('share')}Share Profile</button>
          </div>
        </div>
      </header>
      ${section('t-contact', 'Contact', `<div class="contact">${contact}</div>`)}
      ${section('t-social', 'Social media', `<div class="social">${social}</div>`)}
      ${section('t-about', 'About me', `<p>${esc(p.about.bio)}</p><p class="about-promise"><strong>${esc(p.about.closing)}</strong></p><h3>Experience</h3><ul class="timeline">${p.about.experience.map((e) => `<li>${esc(e)}</li>`).join('')}</ul><h3>Skills</h3><div class="chips">${p.about.skills.map((s) => `<span class="chip">${esc(s)}</span>`).join('')}</div>`, 'about')}
      ${section('t-services', 'Services', `<div class="grid">${p.services.map((s) => `<article class="svc"><div class="badge">${ico(s.icon)}</div><h3>${esc(s.name)}</h3><p>${esc(s.desc)}</p></article>`).join('')}</div>`)}
      ${section('t-products', 'Products & portfolio', `<div class="grid">${p.products.map((pr, i) => `<article class="prod"><img src="${productImg(pr)}" alt="" loading="lazy" width="320" height="200"><div><h3>${esc(pr.title)}</h3><p>${esc(pr.desc)}</p><p class="price">${esc(pr.price)}</p><button class="btn" data-detail="${i}">View details</button></div></article>`).join('')}</div>`)}
      ${section('t-business', 'Business information', `<dl class="info">
        <div><dt>Company</dt><dd>${esc(p.company)}</dd></div><div><dt>Address</dt><dd>${esc(p.address)}</dd></div>
        <div><dt>Phone</dt><dd><a href="tel:${esc(p.phone.replace(/[^+\d]/g, ''))}">${esc(p.phone)}</a></dd></div>
        <div><dt>Email</dt><dd><a href="mailto:${esc(p.email)}">${esc(p.email)}</a></dd></div>
        <div><dt>Website</dt><dd><a href="${esc(p.website)}" target="_blank" rel="noopener">${esc(p.website.replace(/^https?:\/\//, ''))}</a></dd></div>
        ${p.hours.map(([d, h]) => `<div><dt>${esc(d)}</dt><dd>${esc(h)}</dd></div>`).join('')}</dl>
        <iframe class="map" title="Map of ${esc(p.company)}" loading="lazy" referrerpolicy="no-referrer-when-downgrade" src="https://www.google.com/maps?q=${mapsQ}&output=embed"></iframe>
        <a class="btn btn-primary" href="https://www.google.com/maps/dir/?api=1&destination=${mapsQ}" target="_blank" rel="noopener" data-track="directions_click">${ico('pin')}Get Directions</a>`)}
      <section class="card qr" aria-labelledby="t-qr"><h2 id="t-qr">Scan to view my digital business card</h2>
        <canvas id="qr" width="512" height="512" role="img" aria-label="QR code linking to this profile"></canvas>
        <button class="btn" id="qrBtn" data-track="qr_download">${ico('download')}Download QR Code</button></section>
      <p class="foot">Smart Business Card</p>
      <dialog class="lightbox" id="photoDlg" aria-label="Profile photo"><button class="close" aria-label="Close photo" data-close>&times;</button><img src="${avatarFor(p)}" alt="Large photo of ${esc(p.name)}"></dialog>
      <dialog class="sheet" id="detailDlg" aria-label="Product details"></dialog>`;
    bind(p, url);
  }

  function drawQR(canvas, text) {
    if (!window.qrcode) { canvas.replaceWith(Object.assign(document.createElement('p'), { className: 'muted', textContent: text })); return false; }
    const qr = window.qrcode(0, 'M'); qr.addData(text); qr.make();
    const n = qr.getModuleCount(), size = canvas.width, quiet = 4, cell = size / (n + quiet * 2), c = canvas.getContext('2d');
    c.fillStyle = '#fff'; c.fillRect(0, 0, size, size); c.fillStyle = '#111827';
    for (let r = 0; r < n; r++) for (let k = 0; k < n; k++) if (qr.isDark(r, k)) c.fillRect(Math.floor((k + quiet) * cell), Math.floor((r + quiet) * cell), Math.ceil(cell), Math.ceil(cell));
    return true;
  }

  function bind(p, url) {
    const $ = (id) => document.getElementById(id);
    const dialogs = document.querySelectorAll('dialog');
    dialogs.forEach((d) => d.addEventListener('click', (e) => { if (e.target === d || e.target.closest('[data-close]')) d.close(); }));
    $('avatarBtn').addEventListener('click', () => $('photoDlg').showModal());
    $('saveBtn').addEventListener('click', () => S.saveContact(p));
    $('shareBtn').addEventListener('click', () => S.shareProfile(p, url));
    document.querySelectorAll('[data-detail]').forEach((b) => b.addEventListener('click', () => {
      const pr = p.products[b.dataset.detail], d = $('detailDlg');
      const msg = encodeURIComponent(`Hi ${p.name}, I'm interested in "${pr.title}".`);
      d.innerHTML = `<div class="inner"><h2>${esc(pr.title)}</h2><p>${esc(pr.desc)}</p><p class="price">${esc(pr.price)}</p>
        <a class="btn btn-primary" href="https://m.me/${esc(p.messenger || 'rhenjie.guarin')}" target="_blank" rel="noopener" data-track="messenger_click">${ico('messenger')}Inquire on Messenger</a>
        <button class="btn" data-close>Close</button></div>`;
      d.showModal();
    }));
    const qrUrl = profileUrl(p.slug, 'qr');
    if (drawQR($('qr'), qrUrl)) {
      $('qrBtn').addEventListener('click', () => $('qr').toBlob((blob) => {
        const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = p.slug + '-qr.png';
        document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 1000);
        S.toast('QR code downloaded');
      }));
    } else $('qrBtn').hidden = true;
  }

  function init() {
    const slug = getSlug(), p = getProfile(slug), main = document.getElementById('main');
    if (!p) {
      document.title = 'Profile not found | Smart Business Card';
      main.innerHTML = '<div class="card empty"><h1>Profile not found</h1><p>This card is inactive or the link is incorrect. Check the address or ask the owner for a new link.</p></div>';
      return;
    }
    const url = profileUrl(p.slug);
    S.Analytics.init({ slug: p.slug, endpoint: CONFIG.analyticsEndpoint });
    setMeta(p, url);
    render(p, url);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
