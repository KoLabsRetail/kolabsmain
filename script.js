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

    // trigger animation
    requestAnimationFrame(() => {
      logo.classList.add('animated');
    });
  }

  // Generic rolling number animator
  function animateCount(el, format = false) {
    if (!el) return;

    const target = parseInt(el.dataset.target || '0', 10);
    const duration = 1500;
    const start = 0;
    const startTime = performance.now();

    function tick(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const value = Math.floor(start + (target - start) * progress);

      el.textContent = format ? value.toLocaleString() : value;

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        el.textContent = format ? target.toLocaleString() : target;
      }
    }

    requestAnimationFrame(tick);
  }

  let ordersAnimated = false;
  let gmvAnimated = false;

  const ordersCountEl = document.getElementById('ordersCountCard');
  const gmvCountEl = document.getElementById('gmvCount');

  // Reveal animation observer
  const reveals = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');

            // ORDERS counter
            if (entry.target.dataset.reveal === 'orders' && !ordersAnimated) {
              ordersAnimated = true;
              animateCount(ordersCountEl, false);
            }

            // GMV counter (formatted with commas)
            if (entry.target.dataset.reveal === 'gmv' && !gmvAnimated) {
              gmvAnimated = true;
              animateCount(gmvCountEl, true);
            }

            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );

    reveals.forEach(el => observer.observe(el));
  } else {
    // Fallback: reveal everything and animate both immediately
    reveals.forEach(el => el.classList.add('revealed'));
    if (ordersCountEl) animateCount(ordersCountEl, false);
    if (gmvCountEl) animateCount(gmvCountEl, true);
  }
});
