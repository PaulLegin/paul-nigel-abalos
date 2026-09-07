/**
 * Dr. Paul Nigel S. Abalos, DIT — Portfolio Scripts
 * High-Performance Minimalist Interactions & Dynamic Ambient Background
 */

document.addEventListener('DOMContentLoaded', () => {
  const nav = document.querySelector('.glass-nav');
  const progressBar = document.getElementById('progressBar');
  const backToTopBtn = document.getElementById('backToTop');

  // ------------------------------------------------------------------------
  // 1. Scroll Events: Progress Bar, Navbar Shadow, Back-to-Top
  // ------------------------------------------------------------------------
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    // Navbar state
    if (nav) {
      nav.classList.toggle('scrolled', scrollY > 20);
    }

    // Scroll progress calculation
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    if (progressBar && docHeight > 0) {
      const scrollPercent = (scrollY / docHeight) * 100;
      progressBar.style.width = `${scrollPercent}%`;
    }

    // Back to top visibility
    if (backToTopBtn) {
      if (scrollY > 450) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }
  }, { passive: true });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // ------------------------------------------------------------------------
  // 2. Intersection Observer: Scroll Reveal
  // ------------------------------------------------------------------------
  const revealElements = document.querySelectorAll('.reveal');
  const revealOptions = {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, revealOptions);

  revealElements.forEach(el => revealObserver.observe(el));

  // ------------------------------------------------------------------------
  // 3. Instant Copy Email to Clipboard with Visual Feedback
  // ------------------------------------------------------------------------
  const emailCard = document.getElementById('emailContactCard');
  const emailText = document.getElementById('emailText');
  const emailIcon = document.getElementById('emailIcon');
  let copyTimeout;

  if (emailCard && emailText) {
    emailCard.addEventListener('click', async (e) => {
      e.preventDefault();
      const email = 'paulnigelabalos@gmail.com';
      try {
        await navigator.clipboard.writeText(email);

        emailText.textContent = '✓ Copied to clipboard!';
        emailText.style.color = 'var(--brand-cyan)';
        if (emailIcon) {
          emailIcon.className = 'bi bi-check-circle-fill contact-icon';
          emailIcon.style.color = '#10b981';
        }

        clearTimeout(copyTimeout);
        copyTimeout = setTimeout(() => {
          emailText.textContent = email;
          emailText.style.color = '';
          if (emailIcon) {
            emailIcon.className = 'bi bi-envelope-at-fill contact-icon';
            emailIcon.style.color = '';
          }
        }, 2500);
      } catch (err) {
        // Fallback for browsers with restricted clipboard permissions
        window.location.href = `mailto:${email}`;
      }
    });
  }

  // ------------------------------------------------------------------------
  // 4. Subtle Ambient Particle Mesh Canvas (Silicon Valley Minimalist)
  // ------------------------------------------------------------------------
  const canvas = document.getElementById('bgNetworkCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initParticles();
    }, { passive: true });

    let particles = [];
    const isMobile = window.innerWidth < 768;
    const particleCount = isMobile ? 28 : 55;
    const maxDistance = isMobile ? 85 : 130;

    let mouse = { x: null, y: null, radius: 100 };
    window.addEventListener('mousemove', (e) => {
      mouse.x = e.x;
      mouse.y = e.y;
    }, { passive: true });

    window.addEventListener('mouseleave', () => {
      mouse.x = null;
      mouse.y = null;
    }, { passive: true });

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.45;
        this.vy = (Math.random() - 0.5) * 0.45;
        this.radius = Math.random() * 1.5 + 0.8;
        this.color = Math.random() > 0.6 ? 'rgba(56, 189, 248, ' : 'rgba(99, 102, 241, ';
        this.baseAlpha = Math.random() * 0.4 + 0.2;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        // Mouse gentle interaction
        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const dist = Math.hypot(dx, dy);
          if (dist < mouse.radius) {
            const force = (mouse.radius - dist) / mouse.radius;
            this.x -= (dx / dist) * force * 1.5;
            this.y -= (dy / dist) * force * 1.5;
          }
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color + this.baseAlpha + ')';
        ctx.fill();
      }
    }

    function initParticles() {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();

        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.hypot(dx, dy);

          if (dist < maxDistance) {
            const opacity = (1 - dist / maxDistance) * 0.18;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(99, 102, 241, ${opacity})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(animate);
    }

    initParticles();
    animate();
  }

  // ------------------------------------------------------------------------
  // 5. Auto-close Mobile Navbar on Link Click
  // ------------------------------------------------------------------------
  const navLinks = document.querySelectorAll('#navbarNav .nav-link, #navbarNav .btn');
  const navCollapse = document.getElementById('navbarNav');
  if (navCollapse && window.bootstrap) {
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (navCollapse.classList.contains('show')) {
          const bsCollapse = window.bootstrap.Collapse.getInstance(navCollapse);
          if (bsCollapse) {
            bsCollapse.hide();
          }
        }
      });
    });
  }

  // ------------------------------------------------------------------------
  // 6. Resume Modal: Dynamic Injection (Eliminates file:/// Frame Collision)
  // ------------------------------------------------------------------------
  const resumeModal = document.getElementById('resumeModal');
  const resumeModalBody = document.getElementById('resumeModalBody');

  if (resumeModal && resumeModalBody) {
    resumeModal.addEventListener('show.bs.modal', () => {
      if (!resumeModalBody.querySelector('iframe')) {
        const iframe = document.createElement('iframe');
        iframe.id = 'resumeIframe';
        iframe.src = 'assets/docs/resume.pdf#toolbar=1&navpanes=0';
        iframe.className = 'w-100 h-100 d-block';
        iframe.style.border = 'none';
        iframe.title = 'Curriculum Vitae / Resume Preview';
        resumeModalBody.appendChild(iframe);
      }
    });

    resumeModal.addEventListener('hidden.bs.modal', () => {
      resumeModalBody.innerHTML = '';
    });
  }
});

