document.addEventListener('DOMContentLoaded', () => {
  // Set year in footer
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // Logo animation: split text into spans
  const logo = document.querySelector('.logo');
  if (logo) {
    const text = logo.textContent.trim();
    logo.textContent = '';
    text.split('').forEach((char, i) => {
      const span = document.createElement('span');
      span.textContent = char;
      span.classList.add('char');
      span.style.animationDelay = `${i * 60}ms`;
      logo.appendChild(span);
    });

    requestAnimationFrame(() => {
      logo.classList.add('animated');
    });
  }

  // Generic rolling number animator
  function animateCount(el, format) {
    if (!el) return;

    const target = parseInt(el.dataset.target || '0', 10);
    const duration = 1500;
    const start = 0;
    const startTime = performance.now();

    function tick(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const value = Math.floor(start + (target - start) * progress);

      if (format === 'currency') {
        el.textContent = value.toLocaleString('en-GB');
      } else {
        el.textContent = value.toString();
      }

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        if (format === 'currency') {
          el.textContent = target.toLocaleString('en-GB');
        } else {
          el.textContent = target.toString();
        }
      }
    }

    requestAnimationFrame(tick);
  }

  const counters = document.querySelectorAll('[data-counter]');
  const reveals = document.querySelectorAll('.reveal');

  // Helper to animate all counters inside a card once
  function animateCountersIn(element) {
    const innerCounters = element.querySelectorAll('[data-counter]');
    innerCounters.forEach(counter => {
      if (counter.dataset.animated === 'true') return;
      counter.dataset.animated = 'true';
      const format = counter.dataset.format || null;
      animateCount(counter, format);
    });
  }

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;

          entry.target.classList.add('revealed');
          animateCountersIn(entry.target);

          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.3 }
    );

    reveals.forEach(el => observer.observe(el));
  } else {
    // Fallback: reveal and animate everything immediately
    reveals.forEach(el => {
      el.classList.add('revealed');
      animateCountersIn(el);
    });
  }
});
