// Build info
const BUILD_HASH = '46c7212';
const BUILD_DATE = '2026-02-13';
document.addEventListener('DOMContentLoaded', () => {
  const el = document.getElementById('footer-version');
  if (el) el.textContent = `build: ${BUILD_HASH} (${BUILD_DATE})`;
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute('href')).scrollIntoView({
      behavior: 'smooth'
    });
  });
});

// ─── Dark Mode ───
const darkToggle = document.getElementById('darkToggle');
const root = document.documentElement;

function setTheme(theme) {
  root.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
}

// Init from localStorage
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
  setTheme(savedTheme);
} else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
  setTheme('dark');
}

if (darkToggle) {
  darkToggle.addEventListener('click', () => {
    const current = root.getAttribute('data-theme');
    setTheme(current === 'dark' ? 'light' : 'dark');
  });
}

// ─── Intersection Observer for animations ───
const observerOptions = { threshold: 0.15 };

const animObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, observerOptions);

// Observe sections for fade-in
document.querySelectorAll('.section').forEach(section => {
  section.classList.add('fade-in');
  animObserver.observe(section);
});

// Observe slide-in headings
document.querySelectorAll('.slide-in').forEach(el => {
  animObserver.observe(el);
});

// Observe timeline items with staggered delay
document.querySelectorAll('.anim-fade').forEach((el, i) => {
  el.style.transitionDelay = `${i * 0.15}s`;
  animObserver.observe(el);
});

// Add base fade-in CSS
const style = document.createElement('style');
style.textContent = `
  .fade-in {
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.6s ease, transform 0.6s ease;
  }
  .fade-in.visible {
    opacity: 1;
    transform: translateY(0);
  }
`;
document.head.appendChild(style);

// ─── Parallax on Hero ───
const hero = document.getElementById('hero');
if (hero) {
  const heroContent = hero.querySelector('.hero-content');
  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    if (scrolled < window.innerHeight) {
      const rate = scrolled * 0.3;
      heroContent.style.transform = `translateY(${rate}px)`;
      heroContent.style.opacity = 1 - (scrolled / (window.innerHeight * 0.8));
    }
  }, { passive: true });
}
