/* Save Contact: builds a vCard 3.0 file (works on iOS, Android, Windows, macOS). */
(function () {
  'use strict';
  const S = (window.SBC = window.SBC || {});
  const esc = (v) => String(v || '').replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/,/g, '\\,').replace(/;/g, '\\;');

  S.buildVCard = function (p) {
    const parts = p.name.trim().split(/\s+/);
    const last = parts.length > 1 ? parts.pop() : '';
    return [
      'BEGIN:VCARD', 'VERSION:3.0',
      `N:${esc(last)};${esc(parts.join(' '))};;;`,
      `FN:${esc(p.name)}`, `ORG:${esc(p.company)}`, `TITLE:${esc(p.title)}`,
      `TEL;TYPE=CELL,VOICE:${p.phone}`, `EMAIL;TYPE=INTERNET:${p.email}`,
      `URL:${p.website}`, `ADR;TYPE=WORK:;;${esc(p.address)};;;;`,
      `NOTE:${esc(p.tagline)}`, 'END:VCARD'
    ].join('\r\n') + '\r\n';
  };

  S.saveContact = function (p) {
    const blob = new Blob([S.buildVCard(p)], { type: 'text/vcard;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = p.slug + '.vcf';
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    S.toast('Contact file downloaded');
  };
})();
