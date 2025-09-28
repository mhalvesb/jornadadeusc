document.addEventListener('DOMContentLoaded', () => {
  const elemsSelector = '.fade.dynamic';

  function initWithIntersectionObserver() {
    // thresholds de 0.0 a 1.0 em passos de 0.01 para opacidade suave
    const thresholds = Array.from({ length: 101 }, (_, i) => i / 100);

    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const el = entry.target;
        // entry.intersectionRatio vai de 0 a 1 (quanto do elemento está visível)
        const ratio = Math.max(0, Math.min(1, entry.intersectionRatio));
        el.style.opacity = String(ratio);
        el.style.transform = `translateY(${20 * (1 - ratio)}px)`;
      });
    }, { root: null, threshold: thresholds });

    document.querySelectorAll(elemsSelector).forEach(el => {
      // estado inicial
      el.style.opacity = 0;
      el.style.transform = 'translateY(20px)';
      io.observe(el);
    });
  }

  function initWithRAF() {
    function calcRatio(el) {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      // interseção vertical entre elemento e viewport
      const intersection = Math.min(rect.bottom, vh) - Math.max(rect.top, 0);
      const visible = Math.max(0, intersection);
      // se o elemento tiver height 0 (não deveria), evita divisão por 0
      const h = rect.height || 1;
      return Math.min(1, Math.max(0, visible / h));
    }

    function update() {
      document.querySelectorAll(elemsSelector).forEach(el => {
        const ratio = calcRatio(el);
        el.style.opacity = String(ratio);
        el.style.transform = `translateY(${20 * (1 - ratio)}px)`;
      });
    }

    let ticking = false;
    function requestUpdate() {
      if (!ticking) {
        requestAnimationFrame(() => {
          update();
          ticking = false;
        });
        ticking = true;
      }
    }

    // inicial
    update();
    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate);
  }

  if ('IntersectionObserver' in window) {
    initWithIntersectionObserver();
  } else {
    initWithRAF();
  }
});