// Suzuki NFC Tap Intro Animation Component
(function initSuzukiIntro() {
  const introEl = document.getElementById('suzuki-intro');
  if (!introEl) return;
  if (introEl.dataset.enabled === 'false') {
    introEl.remove();
    return;
  }

  // Accessibility: immediately remove if user prefers reduced motion
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    introEl.remove();
    return;
  }

  const INTRO_SESSION_KEY = 'suzuki_intro_shown';
  const urlParams = new URLSearchParams(window.location.search);
  const forceIntro = urlParams.get('intro') === '1';

  try {
    if (sessionStorage.getItem(INTRO_SESSION_KEY) && !forceIntro) {
      introEl.remove();
      return;
    }
    sessionStorage.setItem(INTRO_SESSION_KEY, 'true');
  } catch {
    // Keep the intro working when browser storage is unavailable.
  }

  const INTRO_HOLD_MS = 1400;
  const INTRO_FADE_MS = 400;
  setTimeout(() => {
    introEl.classList.add('intro-done');
    setTimeout(() => {
      introEl.remove();
    }, INTRO_FADE_MS);
  }, INTRO_HOLD_MS);
})();
