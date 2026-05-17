// Aethos · landing interactions
(() => {
  // ── Footer year
  const yearEl = document.querySelector('[data-year]');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ── Sticky-ish nav state on scroll (pill shrinks toward viewport top)
  const nav = document.querySelector('[data-nav]');
  if (nav) {
    const onScroll = () => nav.classList.toggle('is-scrolled', window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // ── Mobile nav toggle
  const navToggle = document.querySelector('[data-nav-toggle]');
  if (navToggle && nav) {
    navToggle.addEventListener('click', () => {
      const open = nav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(open));
      navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
    nav.querySelectorAll('.nav__links a').forEach(a =>
      a.addEventListener('click', () => {
        nav.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.setAttribute('aria-label', 'Open menu');
      })
    );
  }

  // ── Magnetic nav indicator — smooth pill follows the hovered link
  const navLinks = document.querySelector('[data-nav-links]');
  if (navLinks && window.matchMedia('(min-width: 821px)').matches) {
    const indicator = navLinks.querySelector('.nav__indicator');
    const anchors = navLinks.querySelectorAll('a');

    const moveIndicator = (target) => {
      const rect = target.getBoundingClientRect();
      const parent = navLinks.getBoundingClientRect();
      indicator.style.transform = `translateX(${rect.left - parent.left}px)`;
      indicator.style.width = `${rect.width}px`;
      navLinks.classList.add('is-active');
    };
    const hideIndicator = () => navLinks.classList.remove('is-active');

    anchors.forEach(a => {
      a.addEventListener('mouseenter', () => moveIndicator(a));
      a.addEventListener('focus', () => moveIndicator(a));
    });
    navLinks.addEventListener('mouseleave', hideIndicator);
    navLinks.addEventListener('focusout', (e) => {
      if (!navLinks.contains(e.relatedTarget)) hideIndicator();
    });
  }

  // ── Cursor-following spotlight on system cards
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduced) {
    document.querySelectorAll('.sys-card').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--x', `${e.clientX - rect.left}px`);
        card.style.setProperty('--y', `${e.clientY - rect.top}px`);
      });
    });
  }

  // ── Scroll reveal
  const revealEls = document.querySelectorAll('[data-reveal]');
  if (reduced || !('IntersectionObserver' in window)) {
    revealEls.forEach(el => el.classList.add('is-visible'));
  } else if (revealEls.length) {
    const io = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14, rootMargin: '0px 0px -40px 0px' }
    );
    revealEls.forEach(el => io.observe(el));
  }

  // ── FAQ accordion (one open at a time + aria-expanded sync)
  const faq = document.querySelector('[data-faq]');
  if (faq) {
    const items = faq.querySelectorAll('details');
    items.forEach(detail => {
      const summary = detail.querySelector('summary');
      if (summary) summary.setAttribute('aria-expanded', String(detail.open));
      detail.addEventListener('toggle', () => {
        if (summary) summary.setAttribute('aria-expanded', String(detail.open));
        if (detail.open) {
          items.forEach(d => {
            if (d !== detail && d.open) d.removeAttribute('open');
          });
        }
      });
    });
  }
})();
