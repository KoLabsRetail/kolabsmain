// Smooth in-page navigation
document.addEventListener('click', (e) => {
  const target = e.target;
  if (target instanceof Element && target.matches('a[href^="#"]')) {
    const href = target.getAttribute('href');
    if (href && href.length > 1) {
      const el = document.querySelector(href);
      if (el) {
        e.preventDefault();
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }
});

// Dynamic year in footer (if footer exists)
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = String(new Date().getFullYear());

// External links: set your real URLs here
const LINKS = {
  tiktok: '#', // e.g., 'https://www.tiktok.com/@yourshop'
  ebay: '#',   // e.g., 'https://www.ebay.co.uk/str/yourstore'
};
const heroTikTok = document.getElementById('icon-tiktok');
const heroEbay = document.getElementById('icon-ebay');
if (heroTikTok && LINKS.tiktok) heroTikTok.setAttribute('href', LINKS.tiktok);
if (heroEbay && LINKS.ebay) heroEbay.setAttribute('href', LINKS.ebay);

// Orders count-up animation (simple, smooth)
// Priority: DOM data-target -> ?orders=NUMBER -> default 44
function getInitialOrders() {
  const el = document.getElementById('ordersCountCard');
  if (el) {
    const ds = el.getAttribute('data-target');
    if (ds && /^\d+$/.test(ds)) return parseInt(ds, 10);
  }
  const url = new URL(window.location.href);
  const qp = url.searchParams.get('orders');
  if (qp && /^\d+$/.test(qp)) return parseInt(qp, 10);
  return 44;
}
function startCountUp(target) {
  const el = document.getElementById('ordersCountCard');
  if (!el) return;
  const durationMs = 2200;
  const startTime = performance.now();
  function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }
  function tick(now) {
    const t = Math.min(1, (now - startTime) / durationMs);
    const eased = easeInOutCubic(t);
    const value = Math.round(target * eased);
    el.textContent = String(value);
    if (t < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

const targetOrders = getInitialOrders();
startCountUp(targetOrders);

// Reveal on load/scroll
function setupReveal() {
  const els = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });
  els.forEach(el => io.observe(el));
}
setupReveal();

// Logo letter-by-letter animation (once on load)
function animateLogoOnce() {
  const heading = document.querySelector('.logo');
  if (!heading) return;
  const text = heading.textContent || '';
  heading.textContent = '';
  const frag = document.createDocumentFragment();
  Array.from(text).forEach((ch, idx) => {
    const span = document.createElement('span');
    span.className = 'char';
    span.textContent = ch;
    span.style.animationDelay = `${100 + idx * 120}ms`;
    frag.appendChild(span);
  });
  heading.appendChild(frag);
  // trigger
  requestAnimationFrame(() => heading.classList.add('animated'));
}

window.addEventListener('DOMContentLoaded', animateLogoOnce, { once: true });

