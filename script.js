/* =====================================================
   Dra. Vivian Ríos Gómez — Script principal
   ECG Cursor + GSAP Awards + Footer Reveal
   Andina Web Studio
   ===================================================== */

'use strict';

const isTouch = () => window.matchMedia('(pointer: coarse)').matches;

/* ── Años ── */
const yr = new Date().getFullYear();
document.getElementById('nav-year').textContent    = yr;
document.getElementById('footer-year').textContent = yr;

/* ════════════════════════════════════════
   FOOTER REVEAL
   Footer fijo abajo, main lo tapa.
   ResizeObserver recalcula siempre.
════════════════════════════════════════ */
(function footerReveal() {
  const footer = document.getElementById('footer');
  const main   = document.getElementById('main');
  if (!footer || !main) return;

  function update() {
    const h = footer.offsetHeight;
    if (h > 0) {
      main.style.paddingBottom = h + 'px';
    }
  }

  /* Esperar a que el navegador pinte antes de medir */
  requestAnimationFrame(() => {
    requestAnimationFrame(update);
  });

  /* ResizeObserver para cambios posteriores */
  if (window.ResizeObserver) {
    new ResizeObserver(update).observe(footer);
  }
  window.addEventListener('resize', update, { passive: true });
})();

/* ════════════════════════════════════════
   NAVBAR — ocultar al bajar
════════════════════════════════════════ */
(function navbar() {
  const nav = document.getElementById('nav');
  let lastY = 0;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    nav.classList.toggle('is-hidden', y > lastY && y > 100);
    lastY = y;
  }, { passive: true });
})();

/* ════════════════════════════════════════
   MOBILE MENU
════════════════════════════════════════ */
(function mobileMenu() {
  const toggle = document.getElementById('navToggle');
  const menu   = document.getElementById('mobileMenu');
  const close  = document.getElementById('menuClose');
  if (!toggle || !menu) return;

  function openMenu() {
    menu.classList.add('is-open');
    menu.setAttribute('aria-hidden', 'false');
    toggle.classList.add('is-open');
    toggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }
  function closeMenu() {
    menu.classList.remove('is-open');
    menu.setAttribute('aria-hidden', 'true');
    toggle.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  toggle.addEventListener('click', () =>
    menu.classList.contains('is-open') ? closeMenu() : openMenu()
  );
  close?.addEventListener('click', closeMenu);
  menu.querySelectorAll('.mm-link').forEach(a =>
    a.addEventListener('click', closeMenu)
  );
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeMenu();
  });
})();

/* ════════════════════════════════════════
   GSAP — Hero words reveal
════════════════════════════════════════ */
(function heroReveal() {
  if (typeof gsap === 'undefined') return;
  gsap.to('[data-word]', {
    y: 0, opacity: 1,
    duration: 1.2,
    ease: 'power4.out',
    stagger: 0.14,
    delay: 0.3,
  });
})();

/* ════════════════════════════════════════
   GSAP ScrollTrigger — todas las secciones
════════════════════════════════════════ */
(function scrollAnimations() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);

  /* ── Stats ── */
  gsap.from('.stats-grid', {
    scrollTrigger: { trigger: '.stats-section', start: 'top 80%' },
    y: 40, opacity: 0, duration: 1.0, ease: 'power3.out',
  });

  /* ── About ── */
  gsap.from('[data-about-photo]', {
    scrollTrigger: { trigger: '.about-section', start: 'top 72%' },
    x: -70, opacity: 0, duration: 1.3, ease: 'power4.out',
  });
  gsap.from('[data-about-text] > *', {
    scrollTrigger: { trigger: '.about-section', start: 'top 68%' },
    y: 44, opacity: 0, duration: 1.0, ease: 'power3.out', stagger: 0.09,
  });

  /* ── Services title — clip-path reveal ── */
  gsap.to('.services-title', {
    scrollTrigger: { trigger: '.services-section', start: 'top 78%' },
    clipPath: 'inset(0 0% 0 0)',
    duration: 1.3,
    ease: 'power4.inOut',
  });
  gsap.from('.services-tag', {
    scrollTrigger: { trigger: '.services-section', start: 'top 80%' },
    y: 20, opacity: 0, duration: 0.7, ease: 'power3.out',
  });

  /* ── Service rows — entran desde la izquierda en cascada ── */
  if (!isTouch()) {
    gsap.to('[data-srow]', {
      scrollTrigger: {
        trigger: '.services-section',
        start: 'top 70%',
      },
      x: 0, opacity: 1,
      duration: 0.8,
      ease: 'power3.out',
      stagger: 0.10,
    });
  }

  /* ── Testimonios ── */
  gsap.from('.testimonials-inner', {
    scrollTrigger: { trigger: '.testimonials-section', start: 'top 75%' },
    y: 50, opacity: 0, duration: 1.0, ease: 'power3.out',
  });

  /* ── CTA reveal ── */
  gsap.to('.cta-eyebrow', {
    scrollTrigger: { trigger: '.cta-section', start: 'top 78%' },
    y: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
  });
  gsap.to('.cta-title', {
    scrollTrigger: { trigger: '.cta-section', start: 'top 75%' },
    y: 0, opacity: 1, duration: 1.0, ease: 'power4.out', delay: 0.1,
  });
  gsap.to('.cta-sub', {
    scrollTrigger: { trigger: '.cta-section', start: 'top 72%' },
    y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', delay: 0.2,
  });
  gsap.to('.cta-actions', {
    scrollTrigger: { trigger: '.cta-section', start: 'top 70%' },
    y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', delay: 0.3,
  });
  gsap.to('.cta-note', {
    scrollTrigger: { trigger: '.cta-section', start: 'top 68%' },
    opacity: 1, duration: 0.6, ease: 'power2.out', delay: 0.45,
  });

  /* ── CTA parallax imagen de fondo ── */
  gsap.to('.cta-bg', {
    scrollTrigger: {
      trigger: '.cta-section',
      start: 'top bottom',
      end: 'bottom top',
      scrub: true,
    },
    y: '18%',
    ease: 'none',
  });

  /* ── About title clip-path reveal ── */
  gsap.from('.about-title', {
    scrollTrigger: { trigger: '.about-section', start: 'top 72%' },
    clipPath: 'inset(0 100% 0 0)',
    duration: 1.2,
    ease: 'power4.inOut',
    delay: 0.2,
  });

})();

/* ════════════════════════════════════════
   INTERSECTION OBSERVER — Stats counters
════════════════════════════════════════ */
(function inviewStats() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('is-inview');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.2 });
  document.querySelectorAll('[data-stat]').forEach(el => obs.observe(el));
})();

/* ════════════════════════════════════════
   CONTADORES ANIMADOS
════════════════════════════════════════ */
(function counters() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el     = entry.target;
      const target = parseInt(el.dataset.count, 10);
      const dur    = 1800;
      const start  = performance.now();
      function step(now) {
        const p = Math.min((now - start) / dur, 1);
        el.textContent = Math.floor((1 - Math.pow(1 - p, 3)) * target);
        if (p < 1) requestAnimationFrame(step);
        else el.textContent = target;
      }
      requestAnimationFrame(step);
      obs.unobserve(el);
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('[data-count]').forEach(el => obs.observe(el));
})();

/* ════════════════════════════════════════
   TESTIMONIALS — autoplay + dots
════════════════════════════════════════ */
(function testimonials() {
  const items = document.querySelectorAll('.testimonial');
  const dots  = document.querySelectorAll('.t-dot');
  if (!items.length) return;
  let cur = 0, timer;

  function show(idx) {
    items[cur].classList.remove('active');
    dots[cur].classList.remove('active');
    dots[cur].setAttribute('aria-selected', 'false');
    cur = idx;
    items[cur].classList.add('active');
    dots[cur].classList.add('active');
    dots[cur].setAttribute('aria-selected', 'true');
  }

  function start() { timer = setInterval(() => show((cur + 1) % items.length), 5000); }
  function stop()  { clearInterval(timer); }

  dots.forEach(d => d.addEventListener('click', () => {
    stop(); show(parseInt(d.dataset.idx, 10)); start();
  }));

  const section = document.getElementById('testimonios');
  if (section) {
    new IntersectionObserver(entries => {
      entries[0].isIntersecting ? start() : stop();
    }, { threshold: 0.3 }).observe(section);
  } else {
    start();
  }
})();

/* ════════════════════════════════════════
   CURSOR MAGNÉTICO — botones CTA
════════════════════════════════════════ */
(function magneticButtons() {
  if (isTouch()) return;
  document.querySelectorAll('.cta-btn-primary, .cta-btn-secondary, .srow__cta').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r  = btn.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width  / 2)) * 0.25;
      const dy = (e.clientY - (r.top  + r.height / 2)) * 0.25;
      btn.style.transform    = `translate(${dx}px, ${dy}px)`;
      btn.style.transition   = 'transform 0.1s linear';
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform  = '';
      btn.style.transition = 'transform 0.6s cubic-bezier(0.34,1.56,0.64,1)';
    });
  });
})();

/* ════════════════════════════════════════
   SERVICE ROWS — número gigante contador
   Al hacer hover el número se anima
════════════════════════════════════════ */
(function rowHoverNum() {
  if (isTouch()) return;
  document.querySelectorAll('[data-srow]').forEach(row => {
    const num = row.querySelector('.srow__num');
    if (!num) return;
    row.addEventListener('mouseenter', () => {
      if (typeof gsap !== 'undefined') {
        gsap.fromTo(num,
          { y: 10, opacity: 0.08 },
          { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out' }
        );
      }
    });
    row.addEventListener('mouseleave', () => {
      if (typeof gsap !== 'undefined') {
        gsap.to(num, { y: 6, opacity: 0.08, duration: 0.4, ease: 'power2.in' });
      }
    });
  });
})();

/* ════════════════════════════════════════
   GALLERY — clip-path reveal + drag scroll
   + progress bar
════════════════════════════════════════ */
(function galleryInit() {
  const strip = document.getElementById('galleryStrip');
  const bar   = document.getElementById('galleryProgress');

  /* Progress bar */
  if (strip && bar) {
    strip.addEventListener('scroll', () => {
      const max = strip.scrollWidth - strip.clientWidth;
      bar.style.width = max > 0 ? (strip.scrollLeft / max * 100) + '%' : '0%';
    }, { passive: true });
  }

  /* Drag to scroll — desktop */
  if (strip && !isTouch()) {
    let down = false, startX, scrollLeft;
    strip.addEventListener('mousedown', e => {
      down = true;
      startX     = e.pageX - strip.offsetLeft;
      scrollLeft = strip.scrollLeft;
      strip.style.cursor = 'grabbing';
    });
    document.addEventListener('mouseup', () => {
      down = false;
      strip.style.cursor = 'grab';
    });
    strip.addEventListener('mousemove', e => {
      if (!down) return;
      e.preventDefault();
      strip.scrollLeft = scrollLeft - (e.pageX - strip.offsetLeft - startX) * 1.4;
    });
  }

  /* GSAP reveal — items entran con clip-path desde la derecha */
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  /* Título galería */
  gsap.to('.gallery-title', {
    scrollTrigger: { trigger: '.gallery-section', start: 'top 78%' },
    clipPath: 'inset(0 0% 0 0)',
    duration: 1.2,
    ease: 'power4.inOut',
  });
  gsap.from('.gallery-tag', {
    scrollTrigger: { trigger: '.gallery-section', start: 'top 80%' },
    y: 20, opacity: 0, duration: 0.7, ease: 'power3.out',
  });

  /* Items del strip — entran uno por uno */
  if (!isTouch()) {
    gsap.to('[data-gitem]', {
      scrollTrigger: {
        trigger: '.gallery-strip',
        start: 'top 82%',
      },
      clipPath: 'inset(0 0% 0 0)',
      opacity: 1,
      duration: 0.85,
      ease: 'power3.out',
      stagger: 0.12,
    });
  } else {
    /* Mobile — visibles de inmediato */
    document.querySelectorAll('[data-gitem]').forEach(el => {
      el.style.opacity   = '1';
      el.style.clipPath  = 'inset(0 0% 0 0)';
    });
  }
})();

/* ════════════════════════════════════════
   CTA NUEVO — animaciones mesh + contactos
════════════════════════════════════════ */
(function ctaAnimations() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  gsap.to('.cta-eyebrow', {
    scrollTrigger: { trigger: '.cta-section', start: 'top 78%' },
    y: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
  });
  gsap.to('.cta-title', {
    scrollTrigger: { trigger: '.cta-section', start: 'top 75%' },
    y: 0, opacity: 1, duration: 1.0, ease: 'power4.out', delay: 0.1,
  });
  gsap.to('.cta-sub', {
    scrollTrigger: { trigger: '.cta-section', start: 'top 72%' },
    y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', delay: 0.2,
  });
  gsap.to('.cta-contacts', {
    scrollTrigger: { trigger: '.cta-section', start: 'top 70%' },
    y: 0, opacity: 1, duration: 0.9, ease: 'power3.out', delay: 0.3,
  });
  gsap.to('.cta-note', {
    scrollTrigger: { trigger: '.cta-section', start: 'top 65%' },
    opacity: 1, duration: 0.6, ease: 'power2.out', delay: 0.5,
  });

  /* Cards de contacto entran en cascada */
  gsap.from('.cta-contact-item', {
    scrollTrigger: { trigger: '.cta-contacts', start: 'top 80%' },
    y: 30, opacity: 0, duration: 0.7, ease: 'power3.out', stagger: 0.08,
  });
})();

/* ════════════════════════════════════════
   CURSOR MAGNÉTICO — contact cards
════════════════════════════════════════ */
(function magneticContacts() {
  if (isTouch()) return;
  document.querySelectorAll('.cta-contact-item').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r  = card.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width  / 2)) * 0.15;
      const dy = (e.clientY - (r.top  + r.height / 2)) * 0.15;
      card.style.transform  = `translate(${dx}px, ${dy}px) translateY(-4px)`;
      card.style.transition = 'transform 0.1s linear';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform  = '';
      card.style.transition = 'transform 0.6s cubic-bezier(0.34,1.56,0.64,1)';
    });
  });
})();

/* ════════════════════════════════════════
   CROSSFADE — dos fotos de la doctora
   Transición ambiental automática, no
   es un carrusel (sin flechas ni dots)
════════════════════════════════════════ */
(function photoCrossfade() {
  const frame  = document.getElementById('aboutPhotoFrame');
  const photos = frame ? frame.querySelectorAll('.about-photo') : [];
  if (photos.length < 2) return;

  let cur = 0;
  let timer;

  function next() {
    const upcoming = (cur + 1) % photos.length;
    photos[upcoming].style.transform = 'scale(1.04)';
    photos[cur].classList.remove('is-active');
    photos[upcoming].classList.add('is-active');
    cur = upcoming;
  }

  function start() {
    stop();
    timer = setInterval(next, 4000);
  }
  function stop() { clearInterval(timer); }

  /* Solo corre cuando la sección está visible, para no gastar ciclos de más */
  const section = document.getElementById('sobre');
  if (section && window.IntersectionObserver) {
    new IntersectionObserver(entries => {
      entries[0].isIntersecting ? start() : stop();
    }, { threshold: 0.25 }).observe(section);
  } else {
    start();
  }
})();

/* ════════════════════════════════════════
   VIDEOS — sin controles nativos, solo
   ícono de audio. En desktop arrancan
   solos (mudos) al entrar en pantalla.
   En mobile: mazo de cartas, se abren
   y arrancan al hacer tap.
════════════════════════════════════════ */
(function videoDeck() {
  const grid    = document.getElementById('videosGrid');
  const trigger = document.getElementById('videosDeckTrigger');
  const section = document.getElementById('videos');
  if (!grid || !trigger) return;

  const cards  = grid.querySelectorAll('[data-video-card]');
  const videos = grid.querySelectorAll('.video-el');
  const mq     = window.matchMedia('(max-width: 600px)');

  /* Silenciados por defecto: evita reproducción con audio automática */
  videos.forEach(v => { v.muted = true; v.removeAttribute('controls'); });

  /* Desktop — autoplay al entrar la sección en pantalla */
  if (section && window.IntersectionObserver) {
    new IntersectionObserver(entries => {
      if (mq.matches) return; /* en mobile el video arranca al abrir el mazo */
      if (entries[0].isIntersecting) {
        videos.forEach(v => v.play().catch(() => {}));
      } else {
        videos.forEach(v => v.pause());
      }
    }, { threshold: 0.3 }).observe(section);
  }

  /* Mobile — mazo de cartas, arranca al abrirse */
  function openDeck() {
    grid.classList.add('is-open');
    videos.forEach(v => v.play().catch(() => {}));
  }
  trigger.addEventListener('click', openDeck);

  /* Botón de mute individual por video */
  cards.forEach(card => {
    const video = card.querySelector('.video-el');
    const btn   = card.querySelector('[data-mute-btn]');
    if (!video || !btn) return;

    function sync() {
      btn.classList.toggle('is-muted', video.muted);
      btn.setAttribute('aria-label', video.muted ? 'Activar audio' : 'Silenciar');
    }
    sync();

    btn.addEventListener('click', e => {
      e.stopPropagation();
      video.muted = !video.muted;
      sync();
    });
  });
})();

