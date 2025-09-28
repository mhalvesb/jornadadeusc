document.addEventListener('DOMContentLoaded', () => {
  const elemsSelector = '.fade.dynamic';

  function initWithIntersectionObserver() {
    const thresholds = Array.from({ length: 101 }, (_, i) => i / 100);

    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const el = entry.target;
        let ratio = entry.intersectionRatio;

        const threshold = 0.15; // 15% visível para começar
        const fadeRange = 0.1;  // fade rápido entre 15% → 25%

        if (ratio < threshold) {
          ratio = 0;
        } else if (ratio < threshold + fadeRange) {
          ratio = (ratio - threshold) / fadeRange;
        } else {
          ratio = 1;
        }

        el.style.opacity = ratio;
        el.style.transform = `translateY(${20 * (1 - ratio)}px)`;
      });
    }, { root: null, threshold: thresholds });

    document.querySelectorAll(elemsSelector).forEach(el => {
      el.style.opacity = 0;
      el.style.transform = 'translateY(20px)';
      io.observe(el);
    });
  }

  function initWithRAF() {
    function calcRatio(el) {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      const intersection = Math.min(rect.bottom, vh) - Math.max(rect.top, 0);
      const visible = Math.max(0, intersection);
      const h = rect.height || 1;
      return Math.min(1, Math.max(0, visible / h));
    }

    function update() {
      const threshold = 0.15;
      const fadeRange = 0.1;

      document.querySelectorAll(elemsSelector).forEach(el => {
        let ratio = calcRatio(el);

        if (ratio < threshold) {
          ratio = 0;
        } else if (ratio < threshold + fadeRange) {
          ratio = (ratio - threshold) / fadeRange;
        } else {
          ratio = 1;
        }

        el.style.opacity = ratio;
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
