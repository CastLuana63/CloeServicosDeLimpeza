/* =========================================================
   CLOE SERVIÇOS DE LIMPEZA — SCRIPT PRINCIPAL
   =========================================================
   IMPORTANTE PARA QUEM FOR DAR MANUTENÇÃO:
   Quase todas as informações de contato (WhatsApp, telefone,
   e-mail, Instagram, Facebook, endereço e horário) ficam
   centralizadas no objeto CONFIG abaixo. Troque os valores
   aqui e o site inteiro é atualizado automaticamente —
   não é preciso editar o HTML.
   ========================================================= */

const CONFIG = {
  // Apenas números, com código do país (55) e DDI (16): ex. 5516999998888
  whatsappNumber: '5516990000000',
  whatsappMessage: 'Olá! Vim pelo site da Cloe e gostaria de saber mais sobre os serviços de limpeza.',

  instagramUrl: 'https://instagram.com/cloelimpeza',
  facebookUrl: 'https://facebook.com/cloelimpeza',

  displayPhone: '(16) 99999-9999',
  telLink: 'tel:+5516999999999',

  email: 'contato@cloelimpeza.com.br',

  address: 'Ribeirão Preto - SP e região',
  hours: 'Segunda a sábado, das 8h às 18h',
};

document.addEventListener('DOMContentLoaded', () => {
  applyConfig();
  setCurrentYear();
  initHeaderScroll();
  initMobileNav();
  initHeroSlider();
  initScrollReveal();
  initVideoCarousels();
  initVideoFallbacks();
  initCompareSliders();
});

/* ---------------------------------------------------------
   Preenche links e textos a partir do objeto CONFIG
--------------------------------------------------------- */
function applyConfig() {
  const waText = encodeURIComponent(CONFIG.whatsappMessage);
  const waUrl = `https://wa.me/${CONFIG.whatsappNumber}?text=${waText}`;

  document.querySelectorAll('[data-wa-link]').forEach((el) => {
    el.setAttribute('href', waUrl);
  });

  document.querySelectorAll('[data-ig-link]').forEach((el) => {
    el.setAttribute('href', CONFIG.instagramUrl);
  });

  document.querySelectorAll('[data-fb-link]').forEach((el) => {
    el.setAttribute('href', CONFIG.facebookUrl);
  });

  document.querySelectorAll('[data-config-text]').forEach((el) => {
    const key = el.getAttribute('data-config-text');
    if (CONFIG[key] !== undefined) el.textContent = CONFIG[key];
  });

  document.querySelectorAll('[data-config-href]').forEach((el) => {
    const key = el.getAttribute('data-config-href');
    if (key === 'emailLink') {
      el.setAttribute('href', `mailto:${CONFIG.email}`);
    } else if (CONFIG[key] !== undefined) {
      el.setAttribute('href', CONFIG[key]);
    }
  });
}

function setCurrentYear() {
  const el = document.querySelector('[data-current-year]');
  if (el) el.textContent = new Date().getFullYear();
}

/* ---------------------------------------------------------
   Header: muda a aparência ao rolar a página
--------------------------------------------------------- */
function initHeaderScroll() {
  const header = document.querySelector('[data-header]');
  if (!header) return;

  const update = () => {
    header.classList.toggle('is-scrolled', window.scrollY > 40);
  };
  update();
  window.addEventListener('scroll', update, { passive: true });
}

/* ---------------------------------------------------------
   Menu mobile (abre/fecha o painel de navegação)
--------------------------------------------------------- */
function initMobileNav() {
  const toggle = document.querySelector('[data-nav-toggle]');
  const nav = document.querySelector('[data-header-nav]');
  if (!toggle || !nav) return;

  const closeNav = () => {
    nav.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Abrir menu');
  };

  const openNav = () => {
    nav.classList.add('is-open');
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Fechar menu');
  };

  toggle.addEventListener('click', () => {
    const isOpen = nav.classList.contains('is-open');
    isOpen ? closeNav() : openNav();
  });

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeNav);
  });

  document.addEventListener('click', (event) => {
    if (!nav.classList.contains('is-open')) return;
    if (!nav.contains(event.target) && !toggle.contains(event.target)) closeNav();
  });
}

/* ---------------------------------------------------------
   Slider de texto rotativo no hero ("Levamos cuidado para:")
--------------------------------------------------------- */
function initHeroSlider() {
  const track = document.querySelector('[data-hero-slider]');
  if (!track) return;

  const items = Array.from(track.children);
  if (items.length < 2) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) return;

  let current = 0;
  setInterval(() => {
    items[current].classList.remove('is-active');
    current = (current + 1) % items.length;
    items[current].classList.add('is-active');
  }, 2400);
}

/* ---------------------------------------------------------
   Animação de revelação ao rolar a página
--------------------------------------------------------- */
function initScrollReveal() {
  const items = document.querySelectorAll('[data-reveal]');
  if (!items.length) return;

  if (!('IntersectionObserver' in window)) {
    items.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  items.forEach((el) => observer.observe(el));
}

/* ---------------------------------------------------------
   Carrossel de vídeos (rolagem horizontal com setas e pontos)
--------------------------------------------------------- */
function initVideoCarousels() {
  document.querySelectorAll('[data-carousel]').forEach((carousel) => {
    const track = carousel.querySelector('[data-carousel-track]');
    const prevBtn = carousel.querySelector('[data-carousel-prev]');
    const nextBtn = carousel.querySelector('[data-carousel-next]');
    const slides = Array.from(carousel.querySelectorAll('[data-carousel-slide]'));
    const dotsWrap = carousel.parentElement.querySelector('[data-carousel-dots]');
    if (!track || !slides.length) return;

    // Cria os pontos indicadores
    let dots = [];
    if (dotsWrap) {
      dotsWrap.innerHTML = '';
      dots = slides.map((_, index) => {
        const dot = document.createElement('span');
        if (index === 0) dot.classList.add('is-active');
        dot.addEventListener('click', () => scrollToSlide(index));
        dotsWrap.appendChild(dot);
        return dot;
      });
    }

    function scrollToSlide(index) {
      const target = slides[index];
      if (!target) return;
      track.scrollTo({ left: target.offsetLeft - track.offsetLeft, behavior: 'smooth' });
    }

    function getCurrentIndex() {
      const trackLeft = track.scrollLeft;
      let closest = 0;
      let minDiff = Infinity;
      slides.forEach((slide, index) => {
        const diff = Math.abs((slide.offsetLeft - track.offsetLeft) - trackLeft);
        if (diff < minDiff) { minDiff = diff; closest = index; }
      });
      return closest;
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        scrollToSlide(Math.max(0, getCurrentIndex() - 1));
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        scrollToSlide(Math.min(slides.length - 1, getCurrentIndex() + 1));
      });
    }

    let scrollTimeout;
    track.addEventListener('scroll', () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        const index = getCurrentIndex();
        dots.forEach((dot, i) => dot.classList.toggle('is-active', i === index));
      }, 100);
    }, { passive: true });
  });
}

/* ---------------------------------------------------------
   Mostra um aviso amigável quando o arquivo de vídeo
   ainda não foi adicionado em assets/video/
--------------------------------------------------------- */
function initVideoFallbacks() {
  document.querySelectorAll('[data-video-frame]').forEach((frame) => {
    const video = frame.querySelector('.video-el');
    const fallback = frame.querySelector('.video-fallback');
    if (!video || !fallback) return;

    video.addEventListener('error', () => {
      video.hidden = true;
      fallback.hidden = false;
    }, true);
  });
}

/* ---------------------------------------------------------
   Comparador de fotos antes/depois (arrastar para revelar)
--------------------------------------------------------- */
function initCompareSliders() {
  document.querySelectorAll('[data-compare]').forEach((wrapper) => {
    const frame = wrapper.querySelector('[data-compare-frame]');
    const before = wrapper.querySelector('[data-compare-before]');
    const divider = wrapper.querySelector('[data-compare-divider]');
    const range = wrapper.querySelector('[data-compare-range]');
    if (!frame || !before || !divider || !range) return;

    let dragging = false;

    function setValue(percent) {
      const clamped = Math.min(100, Math.max(0, percent));
      before.style.clipPath = `inset(0 ${100 - clamped}% 0 0)`;
      divider.style.left = `${clamped}%`;
      range.value = clamped;
    }

    function percentFromEvent(clientX) {
      const rect = frame.getBoundingClientRect();
      return ((clientX - rect.left) / rect.width) * 100;
    }

    frame.addEventListener('pointerdown', (event) => {
      dragging = true;
      frame.setPointerCapture?.(event.pointerId);
      setValue(percentFromEvent(event.clientX));
    });
    frame.addEventListener('pointermove', (event) => {
      if (!dragging) return;
      setValue(percentFromEvent(event.clientX));
    });
    frame.addEventListener('pointerup', () => { dragging = false; });
    frame.addEventListener('pointerleave', () => { dragging = false; });

    range.addEventListener('input', () => setValue(Number(range.value)));

    setValue(Number(range.value));
  });
}
