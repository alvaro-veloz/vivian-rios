/* =====================================================
   Dra. Johana Dávila — Script principal
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
   ECG CURSOR — solo desktop
   Trail con fade por life, spike QRS
   mix-blend-mode difference — visible
   en fondos claros y oscuros
════════════════════════════════════════ */
(function ecgCursor() {
  if (isTouch()) return;

  const canvas = document.getElementById('ecgCanvas');
  if (!canvas) return;
  canvas.style.display = 'block';

  const ctx = canvas.getContext('2d');
  let W, H;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  const TRAIL = 50;
  const pts   = [];
  let mx = -999, my = -999;

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    pts.push({ x: mx, y: my, life: 1.0 });
    if (pts.length > TRAIL) pts.shift();
  });

  function draw() {
    requestAnimationFrame(draw);
    ctx.clearRect(0, 0, W, H);
    if (pts.length < 2) return;

    /* Reducir life de cada punto */
    pts.forEach(p => { p.life = Math.max(0, p.life - 0.024); });

    ctx.globalCompositeOperation = 'difference';

    for (let i = 1; i < pts.length; i++) {
      const p0 = pts[i - 1];
      const p1 = pts[i];
      if (p0.life <= 0 || p1.life <= 0) continue;

      const alpha = p1.life * 0.78;
      const lw    = p1.life * 1.9;
      const isMid = (i === Math.floor(pts.length * 0.68));

      ctx.beginPath();
      ctx.moveTo(p0.x, p0.y);

      if (isMid) {
        /* Spike QRS */
        const cx2 = (p0.x + p1.x) / 2;
        const cy2 = (p0.y + p1.y) / 2;
        ctx.lineTo(cx2, cy2 - 22);
        ctx.lineTo(cx2 + 5, cy2 + 12);
        ctx.lineTo(p1.x, p1.y);
      } else {
        ctx.lineTo(p1.x, p1.y);
      }

      ctx.strokeStyle = `rgba(193,127,89,${alpha})`;
      ctx.lineWidth   = lw;
      ctx.lineCap     = 'round';
      ctx.lineJoin    = 'round';
      ctx.stroke();
    }

    /* Punto cabeza */
    if (mx > 0 && pts.length > 0) {
      const last = pts[pts.length - 1];
      if (last.life > 0) {
        ctx.beginPath();
        ctx.arc(last.x, last.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(248,245,240,${last.life * 0.92})`;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(last.x, last.y, 10, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(193,127,89,${last.life * 0.5})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }

    ctx.globalCompositeOperation = 'source-over';
  }
  draw();
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
