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

// ─── Gate Loading Screen ───
(function() {
  const overlay = document.getElementById('loading-overlay');
  if (!overlay) return;
  document.body.style.overflow = 'hidden';

  window.addEventListener('load', () => {
    setTimeout(() => {
      overlay.classList.add('open');
      document.body.style.overflow = '';
      setTimeout(() => {
        overlay.classList.add('done');
        overlay.remove();
      }, 1200);
    }, 1200);
  });
})();

// ─── Gold Particle Effect (Hero) ───
(function() {
  const canvas = document.getElementById('heroParticles');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let particles = [];
  const COUNT = 25;

  function resize() {
    const hero = canvas.parentElement;
    canvas.width = hero.offsetWidth;
    canvas.height = hero.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  function isDark() {
    return document.documentElement.getAttribute('data-theme') === 'dark';
  }

  for (let i = 0; i < COUNT; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 2.5 + 1,
      speedY: -(Math.random() * 0.3 + 0.1),
      drift: Math.random() * 0.4 - 0.2,
      alpha: Math.random() * 0.5 + 0.2,
      phase: Math.random() * Math.PI * 2
    });
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const bright = isDark() ? 1.3 : 1;
    particles.forEach(p => {
      p.y += p.speedY;
      p.x += Math.sin(p.phase) * 0.3 + p.drift;
      p.phase += 0.01;
      if (p.y < -10) { p.y = canvas.height + 10; p.x = Math.random() * canvas.width; }
      if (p.x < -10) p.x = canvas.width + 10;
      if (p.x > canvas.width + 10) p.x = -10;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      const a = Math.min(p.alpha * bright, 1);
      ctx.fillStyle = `rgba(212, 185, 106, ${a})`;
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }
  draw();
})();

// ─── Cursor Trail ───
(function() {
  if (window.matchMedia('(max-width: 700px)').matches || 'ontouchstart' in window) return;
  const canvas = document.getElementById('cursorTrail');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let trails = [];

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  document.addEventListener('mousemove', (e) => {
    trails.push({
      x: e.clientX,
      y: e.clientY,
      alpha: 0.5,
      r: Math.random() * 2 + 1
    });
    if (trails.length > 50) trails.shift();
  });

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    trails = trails.filter(t => t.alpha > 0.01);
    trails.forEach(t => {
      ctx.beginPath();
      ctx.arc(t.x, t.y, t.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(212, 185, 106, ${t.alpha})`;
      ctx.fill();
      t.alpha -= 0.02;
    });
    requestAnimationFrame(draw);
  }
  draw();
})();

// ─── Timeline Dot Pulse ───
(function() {
  const dots = document.querySelectorAll('.timeline-dot');
  if (!dots.length) return;
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('pulse');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  dots.forEach(d => obs.observe(d));
})();

// ─── Profile Card 3D Tilt ───
(function() {
  if (window.matchMedia('(max-width: 700px)').matches || 'ontouchstart' in window) return;
  document.querySelectorAll('.profile-card').forEach(card => {
    // Add gloss overlay
    const gloss = document.createElement('div');
    gloss.className = 'gloss-overlay';
    card.appendChild(gloss);

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `rotateY(${x * 10}deg) rotateX(${-y * 10}deg)`;
      gloss.style.background = `radial-gradient(circle at ${(x+0.5)*100}% ${(y+0.5)*100}%, rgba(255,255,255,0.18) 0%, transparent 60%)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transition = 'transform 0.5s ease';
      card.style.transform = '';
      setTimeout(() => card.style.transition = '', 500);
    });

    card.addEventListener('mouseenter', () => {
      card.style.transition = '';
    });
  });
})();

// ─── SVG Luxury Dividers ───
(function() {
  const svgContent = '<svg viewBox="0 0 400 30" xmlns="http://www.w3.org/2000/svg"><path d="M0,15 Q50,15 80,10 Q100,7 120,15 Q140,23 160,15 Q170,10 200,5 Q230,10 240,15 Q260,23 280,15 Q300,7 320,15 Q350,15 400,15" fill="none" stroke="var(--gold)" stroke-width="0.8" opacity="0.4"/><circle cx="200" cy="5" r="2.5" fill="var(--gold)" opacity="0.6"/><path d="M185,8 Q192,2 200,5 Q208,2 215,8" fill="none" stroke="var(--gold)" stroke-width="0.6" opacity="0.5"/><path d="M180,12 Q190,5 200,8 Q210,5 220,12" fill="none" stroke="var(--gold)" stroke-width="0.5" opacity="0.3"/><circle cx="100" cy="12" r="1.5" fill="var(--gold)" opacity="0.3"/><circle cx="300" cy="12" r="1.5" fill="var(--gold)" opacity="0.3"/></svg>';
  const sections = document.querySelectorAll('section');
  sections.forEach((sec, i) => {
    if (i < sections.length - 1) {
      const div = document.createElement('div');
      div.className = 'luxury-divider';
      div.innerHTML = svgContent;
      sec.after(div);
    }
  });
})();

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
