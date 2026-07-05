/* ════════════════════════════════════
   MECHANICAL DESIGNER PORTFOLIO — main.js
   ════════════════════════════════════ */

'use strict';

/* ── LOADER ── */
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  setTimeout(() => {
    // Snap to top before revealing content to prevent mobile jump
    window.scrollTo(0, 0);
    loader.classList.add('hidden');
    // Restore overflow after the loader fade completes
    setTimeout(() => {
      document.body.style.overflow = '';
    }, 650); // matches loader transition 0.6s
    // Trigger hero image animation
    const heroImg = document.getElementById('hero-bg-img');
    if (heroImg) heroImg.classList.add('loaded');
    // Start counter animations
    startCounters();
  }, 1800);
});

document.body.style.overflow = 'hidden';

/* ── PARTICLE CANVAS ── */
(function initParticles() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, particles = [];

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  function Particle() {
    this.reset();
  }

  Particle.prototype.reset = function () {
    this.x = Math.random() * W;
    this.y = Math.random() * H;
    this.r = Math.random() * 1.5 + 0.3;
    this.speedX = (Math.random() - 0.5) * 0.4;
    this.speedY = (Math.random() - 0.5) * 0.4;
    this.alpha = Math.random() * 0.6 + 0.1;
    this.color = Math.random() < 0.5 ? '0, 212, 255' : '0, 102, 255';
  };

  for (let i = 0; i < 120; i++) particles.push(new Particle());

  // Connection lines
  function connect() {
    for (let a = 0; a < particles.length; a++) {
      for (let b = a + 1; b < particles.length; b++) {
        const dx = particles[a].x - particles[b].x;
        const dy = particles[a].y - particles[b].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(0, 212, 255, ${(1 - dist / 120) * 0.08})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(particles[a].x, particles[a].y);
          ctx.lineTo(particles[b].x, particles[b].y);
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      p.x += p.speedX;
      p.y += p.speedY;
      if (p.x < 0 || p.x > W || p.y < 0 || p.y > H) p.reset();

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.color}, ${p.alpha})`;
      ctx.fill();
    });
    connect();
    requestAnimationFrame(animate);
  }

  animate();
})();

/* ── NAVBAR ── */
(function initNavbar() {
  const navbar    = document.getElementById('navbar');
  const toggle    = document.getElementById('nav-toggle');
  const navLinks  = document.getElementById('nav-links');
  const themeBtn  = document.getElementById('theme-toggle');

  /* ── Scroll background ── */
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });

  /* ── Hamburger menu ── */
  toggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
    const spans = toggle.querySelectorAll('span');
    if (navLinks.classList.contains('open')) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }
  });

  /* ── Close menu on link click ── */
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
      toggle.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    });
  });

  /* ── Active nav link on scroll ── */
  const sections = document.querySelectorAll('section[id]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        const active = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }, { threshold: 0.4 });
  sections.forEach(s => observer.observe(s));

  /* ── Light / Dark Theme Toggle ── */
  const savedTheme = localStorage.getItem('portfolio-theme');
  if (savedTheme === 'light') document.body.classList.add('light-mode');

  themeBtn.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
    const isLight = document.body.classList.contains('light-mode');
    localStorage.setItem('portfolio-theme', isLight ? 'light' : 'dark');
    themeBtn.style.transform = 'rotate(360deg) scale(1.15)';
    setTimeout(() => { themeBtn.style.transform = ''; }, 400);
  });
})();

/* ── HERO PARALLAX ── */
(function initParallax() {
  const heroImg = document.getElementById('hero-bg-img');
  const cube = document.getElementById('cube3d');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (heroImg) {
      heroImg.style.transform = `scale(1.05) translateY(${scrollY * 0.3}px)`;
    }
    if (cube) {
      cube.style.transform += '';
    }
  }, { passive: true });

  // Mouse move 3D tilt on hero content — disabled on touch devices
  const heroContent = document.querySelector('.hero-content');
  const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
  if (!isTouchDevice) {
    document.addEventListener('mousemove', (e) => {
      if (!heroContent) return;
      const { clientX, clientY } = e;
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      const dx = (clientX - cx) / cx;
      const dy = (clientY - cy) / cy;
      heroContent.style.transform = `perspective(1200px) rotateY(${dx * 2}deg) rotateX(${-dy * 2}deg)`;
    });
  }
})();

/* ── COUNTER ANIMATION ── */
function startCounters() {
  const counters = document.querySelectorAll('.stat-num[data-target]');
  counters.forEach(counter => {
    const target = parseInt(counter.getAttribute('data-target'));
    const duration = 2000;
    const step = Math.ceil(target / (duration / 16));
    let current = 0;
    const timer = setInterval(() => {
      current = Math.min(current + step, target);
      counter.textContent = current;
      if (current >= target) clearInterval(timer);
    }, 16);
  });
}

/* ── SCROLL REVEAL ── */
(function initReveal() {
  // Add reveal classes
  const revealSelectors = [
    { sel: '.section-tag',     cls: 'reveal' },
    { sel: '.section-title',   cls: 'reveal', delay: 'delay-1' },
    { sel: '.section-subtitle',cls: 'reveal', delay: 'delay-2' },
    { sel: '.about-image-wrap',cls: 'reveal-left' },
    { sel: '.about-text',      cls: 'reveal-right' },
    { sel: '.skill-card-3d',   cls: 'reveal' },
    { sel: '.project-card',    cls: 'reveal' },
    { sel: '.contact-info',    cls: 'reveal-left' },
    { sel: '.contact-form',    cls: 'reveal-right' },
  ];

  revealSelectors.forEach(({ sel, cls, delay }) => {
    document.querySelectorAll(sel).forEach((el, i) => {
      el.classList.add(cls);
      if (delay) el.classList.add(delay);
      else {
        const d = i * 0.1;
        el.style.transitionDelay = `${d}s`;
      }
    });
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Animate skill bars when skills section becomes visible
        if (entry.target.classList.contains('skill-card-3d')) {
          const bar = entry.target.querySelector('.progress-bar');
          const pct = entry.target.querySelector('.skill-progress')?.getAttribute('data-pct');
          if (bar && pct) {
            setTimeout(() => { bar.style.width = pct + '%'; }, 400);
          }
        }
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
    observer.observe(el);
  });

  // Timeline items
  const tlObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('.tl-item').forEach(el => tlObserver.observe(el));
})();

/* ── 3D CARD TILT (Skill Cards & Project Cards) ── */
(function init3DTilt() {
  const cards = document.querySelectorAll('.skill-card-3d, .project-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const dx = (x - cx) / cx;
      const dy = (y - cy) / cy;

      const inner = card.querySelector('.skill-card-inner') || card;
      inner.style.transform = `perspective(1000px) rotateX(${-dy * 8}deg) rotateY(${dx * 8}deg) translateZ(10px)`;
    });

    card.addEventListener('mouseleave', () => {
      const inner = card.querySelector('.skill-card-inner') || card;
      inner.style.transform = '';
    });
  });
})();

/* ── ABOUT BADGE 3D TILT ── */
(function initBadgeTilt() {
  const badges = document.querySelectorAll('.about-badge-card');
  badges.forEach(badge => {
    badge.addEventListener('mousemove', (e) => {
      const rect = badge.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const dx = (x / rect.width - 0.5) * 20;
      const dy = (y / rect.height - 0.5) * 20;
      badge.style.transform = `perspective(500px) rotateX(${-dy}deg) rotateY(${dx}deg) translateY(-8px)`;
    });
    badge.addEventListener('mouseleave', () => {
      badge.style.transform = '';
    });
  });
})();

/* ── CONTACT FORM ── */
(function initForm() {
  const form = document.getElementById('contact-form');
  const success = document.getElementById('form-success');

  form.addEventListener('submit', (e) => {
     console.log('FORM SUBMITTED');
    e.preventDefault();

    const btn = form.querySelector('#submit-btn');
    const span = btn.querySelector('span');

   // Send to backend
btn.disabled = true;
span.textContent = 'Sending...';

const name = document.getElementById('name-input').value;
const email = document.getElementById('email-input').value;
const subject = document.getElementById('subject-input').value;
const message = document.getElementById('message-input').value;

fetch('http://localhost:3001/api/contact', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        name,
        email,
        subject,
        message
    })
})
.then(response => response.json())
.then(data => {
    btn.disabled = false;
    span.textContent = 'Send Message';
    btn.style.opacity = '1';

    if (data.success) {
        success.classList.add('show');
        form.reset();
        setTimeout(() => success.classList.remove('show'), 5000);
    } else {
        alert('Failed to send message');
    }
})
.catch(error => {
    console.error(error);
    btn.disabled = false;
    span.textContent = 'Send Message';
    btn.style.opacity = '1';
    alert('Error connecting to server');
});
  });

  // Floating label effect
  const inputs = form.querySelectorAll('input, textarea');
  inputs.forEach(input => {
    input.addEventListener('focus', () => {
      input.parentElement.classList.add('focused');
    });
    input.addEventListener('blur', () => {
      if (!input.value) input.parentElement.classList.remove('focused');
    });
  });
})();

/* ── SMOOTH CURSOR GLOW ── */
(function initCursorGlow() {
  const glow = document.createElement('div');
  glow.id = 'cursor-glow';
  glow.style.cssText = `
    position: fixed;
    width: 350px; height: 350px;
    border-radius: 50%;
    background: radial-gradient(ellipse, rgba(0, 212, 255, 0.05) 0%, transparent 70%);
    pointer-events: none;
    z-index: 0;
    transform: translate(-50%, -50%);
    transition: left 0.15s ease, top 0.15s ease;
    mix-blend-mode: screen;
  `;
  document.body.appendChild(glow);

  document.addEventListener('mousemove', (e) => {
    glow.style.left = e.clientX + 'px';
    glow.style.top  = e.clientY + 'px';
  }, { passive: true });
})();

/* ── TYPING EFFECT ── */
(function initTypingEffect() {
  const cursor = document.querySelector('.title-cursor');
  if (!cursor) return;
  // Already handled by CSS blink animation
})();

/* ── SCROLL INDICATOR HIDE ── */
window.addEventListener('scroll', () => {
  const ind = document.getElementById('scroll-indicator');
  if (ind) ind.style.opacity = window.scrollY > 100 ? '0' : '1';
}, { passive: true });

/* ── GRID LINES DECORATION ── */
(function addGridLines() {
  const style = document.createElement('style');
  style.textContent = `
    .skills::after {
      content: '';
      position: absolute;
      inset: 0;
      background-image:
        linear-gradient(rgba(0, 212, 255, 0.025) 1px, transparent 1px),
        linear-gradient(90deg, rgba(0, 212, 255, 0.025) 1px, transparent 1px);
      background-size: 60px 60px;
      pointer-events: none;
      z-index: 0;
    }
    .skills .container { position: relative; z-index: 1; }
  `;
  document.head.appendChild(style);
})();

/* ── ENGINEERING DIMENSION LINES DECO ── */
(function addDimensionDeco() {
  const style = document.createElement('style');
  style.textContent = `
    .hero::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0; right: 0;
      height: 2px;
      background: linear-gradient(90deg, transparent, var(--accent-cyan), transparent);
      opacity: 0.3;
    }
  `;
  document.head.appendChild(style);
})();

/* ── PROJECT CARD SHINE ── */
(function initCardShine() {
  const cards = document.querySelectorAll('.project-card, .skill-card-inner, .tl-card');
  cards.forEach(card => {
    const shine = document.createElement('div');
    shine.style.cssText = `
      position: absolute; inset: 0; border-radius: inherit;
      background: radial-gradient(ellipse at var(--mx, 50%) var(--my, 50%), rgba(255,255,255,0.06) 0%, transparent 60%);
      pointer-events: none; opacity: 0; transition: opacity 0.3s ease; z-index: 1;
    `;
    card.style.position = 'relative';
    card.style.overflow = 'hidden';
    card.appendChild(shine);

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      shine.style.setProperty('--mx', x + '%');
      shine.style.setProperty('--my', y + '%');
      shine.style.opacity = '1';
    });

    card.addEventListener('mouseleave', () => {
      shine.style.opacity = '0';
    });
  });
})();

console.log('🔩 Portfolio initialized — Mechanical Designer v1.0');
