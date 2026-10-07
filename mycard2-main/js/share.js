/* Share Profile: Web Share API with a fallback sheet. Also provides the toast helper. */
(function () {
  'use strict';
  const S = (window.SBC = window.SBC || {});
  let timer, sheet;

  S.toast = function (msg) {
    const el = document.getElementById('toast');
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(timer);
    timer = setTimeout(() => el.classList.remove('show'), 2400);
  };

  S.copyText = async function (text) {
    try { await navigator.clipboard.writeText(text); return true; } catch (e) {
      const t = document.createElement('textarea');
      t.value = text; t.setAttribute('readonly', ''); t.style.cssText = 'position:fixed;opacity:0';
      document.body.appendChild(t); t.select();
      let ok = false;
      try { ok = document.execCommand('copy'); } catch (_) { /* ignore */ }
      t.remove();
      return ok;
    }
  };

  function openSheet(p, url) {
    if (!sheet) {
      sheet = document.createElement('dialog');
      sheet.className = 'sheet';
      sheet.setAttribute('aria-label', 'Share profile');
      document.body.appendChild(sheet);
      sheet.addEventListener('click', (e) => { if (e.target === sheet || e.target.closest('[data-close]')) sheet.close(); });
    }
    const u = encodeURIComponent(url);
    const text = encodeURIComponent(`${p.name} – ${p.title}, ${p.company}`);
    const link = (href, label, track) => `<a class="btn" href="${href}" target="_blank" rel="noopener" data-track="share_${track}">${label}</a>`;
    sheet.innerHTML = `<div class="inner"><h2>Share profile</h2>
      <button class="btn" id="copyLink" data-track="share_copy">Copy profile link</button>
      ${link('https://www.facebook.com/sharer/sharer.php?u=' + u, 'Facebook', 'facebook')}
      ${link('fb-messenger://share/?link=' + u, 'Messenger', 'messenger')}
      ${link('mailto:?subject=' + encodeURIComponent(p.name + ' | Smart Business Card') + '&body=' + text + '%0A' + u, 'Email', 'email')}
      <button class="btn" data-close>Close</button></div>`;
    sheet.querySelector('#copyLink').addEventListener('click', async () => {
      S.toast((await S.copyText(url)) ? 'Link copied' : 'Could not copy. Copy it from the address bar.');
      sheet.close();
    });
    sheet.showModal();
  }

  S.shareProfile = async function (p, url) {
    const data = { title: `${p.name} | Smart Business Card`, text: `${p.name} – ${p.title}, ${p.company}`, url };
    if (navigator.share) {
      try { await navigator.share(data); return; } catch (e) { if (e.name === 'AbortError') return; }
    }
    openSheet(p, url);
  };
})();
