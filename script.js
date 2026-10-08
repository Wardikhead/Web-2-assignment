document.addEventListener('DOMContentLoaded', function () {
  window.setTimeout(function () {
    document.documentElement.classList.remove('js-loading');
  }, 450);
  var prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!prefersReducedMotion && document.visibilityState !== 'hidden' && 'IntersectionObserver' in window) {
    var revealTargets = document.querySelectorAll('main section[id], .skills-grid > li, .timeline > li, .profile-details > div, .contact-form-card, .contact-details-card');
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -4% 0px' });
    revealTargets.forEach(function (target) {
      var siblings = target.parentElement ? Array.prototype.indexOf.call(target.parentElement.children, target) : 0;
      target.setAttribute('data-reveal', '');
      target.style.setProperty('--reveal-delay', Math.min(siblings, 5) * 45 + 'ms');
      revealObserver.observe(target);
    });
    document.documentElement.classList.add('has-scroll-reveal');
    document.addEventListener('visibilitychange', function () {
      if (document.visibilityState === 'hidden' && document.documentElement.classList.contains('has-scroll-reveal')) {
        revealTargets.forEach(function (target) { target.classList.add('is-visible'); });
        document.documentElement.classList.remove('has-scroll-reveal');
      }
    });
  }
  var hero = document.getElementById('home');
  var finePointer = window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (hero && finePointer && !prefersReducedMotion) {
    var pointerFrame = 0;
    var pointerX = 0;
    var pointerY = 0;
    hero.addEventListener('pointermove', function (event) {
      var bounds = hero.getBoundingClientRect();
      pointerX = event.clientX - bounds.left;
      pointerY = event.clientY - bounds.top;
      if (!pointerFrame) {
        pointerFrame = window.requestAnimationFrame(function () {
          hero.style.setProperty('--pointer-x', pointerX + 'px');
          hero.style.setProperty('--pointer-y', pointerY + 'px');
          pointerFrame = 0;
        });
      }
    });
    hero.addEventListener('pointerenter', function (event) {
      if (event.pointerType === 'mouse' || event.pointerType === 'pen') hero.classList.add('has-pointer-glow');
    });
    hero.addEventListener('pointerleave', function () {
      hero.classList.remove('has-pointer-glow');
    });
  }
  var navToggle = document.getElementById('nav-toggle');
  var nav = document.getElementById('main-nav');
  var themeBtn = document.getElementById('theme-toggle');
  var paletteSelect = document.getElementById('palette-select');
  var form = document.getElementById('contact-form');
  var toTop = document.getElementById('back-to-top');
  if (navToggle && nav) {
    navToggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(open));
      var navLabel = document.getElementById('nav-label');
      if (navLabel) navLabel.textContent = open ? 'Close menu' : 'Menu';
      if (open) { var f = nav.querySelector('a'); if (f) f.focus(); }
    });
    nav.addEventListener('click', function (e) {
      var link = e.target.closest('a[href^="#"]');
      if (!link || !nav.classList.contains('open')) return;
      var target = document.getElementById(link.getAttribute('href').slice(1));
      nav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
      var navLabel = document.getElementById('nav-label');
      if (navLabel) navLabel.textContent = 'Menu';
      if (target) target.focus({ preventScroll: true });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('open')) {
        nav.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        var navLabel = document.getElementById('nav-label');
        if (navLabel) navLabel.textContent = 'Menu';
        navToggle.focus();
      }
    });
  }
  function applyTheme(t) {
    document.documentElement.setAttribute('data-theme', t);
    try { localStorage.setItem('theme', t); } catch (e) {}
    if (themeBtn) {
      var icon = document.getElementById('theme-icon');
      var label = document.getElementById('theme-label');
      if (icon) {
        icon.className = t === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
      }
      if (label) label.textContent = t === 'dark' ? 'Light mode' : 'Dark mode';
      themeBtn.setAttribute('aria-label', t === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    }
  }
  var palettes = ['blue', 'teal', 'forest', 'plum'];
  function applyPalette(palette) {
    if (palettes.indexOf(palette) === -1) return;
    document.documentElement.setAttribute('data-palette', palette);
    if (paletteSelect) paletteSelect.value = palette;
    try { localStorage.setItem('portfolio-palette', palette); } catch (e) {}
  }
  var activePalette = document.documentElement.getAttribute('data-palette') || 'blue';
  applyPalette(activePalette);
  if (paletteSelect) {
    paletteSelect.addEventListener('change', function () {
      applyPalette(paletteSelect.value);
    });
  }
  var saved = null;
  try { saved = localStorage.getItem('theme'); } catch (e) {}
  if (saved === 'dark' || saved === 'light') { applyTheme(saved); }
  else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) { applyTheme('dark'); }
  if (themeBtn) { themeBtn.addEventListener('click', function () {
    var cur = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    function switchTheme() {
      applyTheme(cur);
      if (!reduceMotion) {
        themeBtn.classList.remove('is-switching');
        void themeBtn.offsetWidth;
        themeBtn.classList.add('is-switching');
        var icon = document.getElementById('theme-icon');
        if (icon) {
          icon.addEventListener('animationend', function () {
            themeBtn.classList.remove('is-switching');
          }, { once: true });
        }
        window.setTimeout(function () { themeBtn.classList.remove('is-switching'); }, 520);
      }
    }
    switchTheme();
  }); }
  var links = Array.prototype.slice.call(document.querySelectorAll('.main-nav a'));
  if ('IntersectionObserver' in window) {
    var map = {};
    links.forEach(function (a) { var h = (a.getAttribute('href')||'').slice(1); if (h) map[h] = a; });
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          links.forEach(function (a) { a.removeAttribute('aria-current'); });
          var act = map[en.target.id];
          if (act) act.setAttribute('aria-current', 'location');
        }
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    ['home','about','skills','education','contact'].forEach(function (id) {
      var s = document.getElementById(id); if (s) obs.observe(s);
    });
  }
  var prog = document.getElementById('scroll-progress');
  var progFill = document.getElementById('scroll-progress-fill');
  var ticking = false;
  function updateProgress() {
    ticking = false;
    if (!prog || !progFill) return;
    var h = document.documentElement;
    var max = h.scrollHeight - h.clientHeight;
    var p = max > 0 ? Math.min(100, Math.round(((h.scrollTop || document.body.scrollTop) / max) * 100)) : 0;
    progFill.style.width = p + '%';
    prog.setAttribute('aria-valuenow', String(p));
  }
  function onScroll() {
    if (toTop) toTop.hidden = window.scrollY < 600;
    if (!ticking) { ticking = true; window.requestAnimationFrame ? window.requestAnimationFrame(updateProgress) : updateProgress(); }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll(); updateProgress();
  if (toTop) toTop.addEventListener('click', function () {
    var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    var heading = document.getElementById('home-heading');
    if (heading) heading.focus({ preventScroll: true });
  });
  function setErr(input, errEl, msg) {
    if (msg) { errEl.hidden = false; errEl.textContent = msg; input.setAttribute('aria-invalid', 'true'); }
    else { errEl.textContent = ''; errEl.hidden = true; input.removeAttribute('aria-invalid'); }
  }
  function validateField(id) {
    var input = document.getElementById(id);
    var err = document.getElementById(id + '-error');
    if (!input || !err) return false;
    var v = input.value.trim();
    if (id === 'name' && v.length < 2) { setErr(input, err, 'Please enter your name (at least 2 characters).'); return false; }
    if (id === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) { setErr(input, err, 'Please enter a valid email address.'); return false; }
    if (id === 'message' && v.length < 10) { setErr(input, err, 'Please enter at least 10 characters.'); return false; }
    setErr(input, err, ''); return true;
  }
  if (form) {
    ['name','email','message'].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.addEventListener('blur', function () { validateField(id); });
    });
    form.addEventListener('submit', function (e) {
      var ok = ['name','email','message'].map(validateField).every(Boolean);
      var status = document.getElementById('form-status');
      if (!ok) {
        e.preventDefault();
        if (status) status.textContent = 'Please fix the highlighted fields.';
        var bad = form.querySelector('[aria-invalid="true"]'); if (bad) bad.focus();
        return;
      }
      if (status) status.textContent = 'Sending your message…';
    });
    var submitButton = form.querySelector('button[type="submit"]');
    if (submitButton) submitButton.disabled = false;
  }
  var y = document.getElementById('year');
  if (y) y.textContent = String(new Date().getFullYear());
});
