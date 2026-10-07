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
  // 4. Flowing Data Streams & Ambient Neural Wave Canvas (High-Tech Aesthetic)
  // ------------------------------------------------------------------------
  const canvas = document.getElementById('bgNetworkCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initDataSystem();
    }, { passive: true });

    let mouse = { x: null, y: null, radius: 130 };
    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    }, { passive: true });

    window.addEventListener('mouseleave', () => {
      mouse.x = null;
      mouse.y = null;
    }, { passive: true });

    const isMobile = window.innerWidth < 768;

    // 1. Flowing Data Waves (Horizontal & Diagonal Spline Streams)
    const waveCount = isMobile ? 3 : 5;
    const waves = [];

    class DataWave {
      constructor(index) {
        this.index = index;
        this.baseY = (height / (waveCount + 1)) * (index + 1);
        this.amplitude = 35 + Math.random() * 25;
        this.frequency = 0.0018 + Math.random() * 0.0012;
        this.speed = 0.008 + (index % 2 === 0 ? 0.005 : 0.003);
        this.phase = Math.random() * Math.PI * 2;
        this.color = index % 2 === 0 ? 'rgba(56, 189, 248, ' : 'rgba(99, 102, 241, ';
        
        // Data packets flowing along this specific wave
        this.packets = [];
        const packetCount = isMobile ? 2 : 4;
        for (let i = 0; i < packetCount; i++) {
          this.packets.push({
            progress: Math.random(),
            speed: 0.0015 + Math.random() * 0.002,
            size: Math.random() * 2.5 + 2,
            glow: Math.random() * 8 + 6
          });
        }
      }

      getY(x, t) {
        let y = this.baseY + Math.sin(x * this.frequency + t * this.speed + this.phase) * this.amplitude;
        y += Math.cos(x * this.frequency * 0.5 + t * this.speed * 0.7) * (this.amplitude * 0.4);
        
        // Mouse disturbance
        if (mouse.x !== null && mouse.y !== null) {
          const dx = x - mouse.x;
          const dy = y - mouse.y;
          const dist = Math.hypot(dx, dy);
          if (dist < mouse.radius) {
            const force = (1 - dist / mouse.radius) * 35;
            y += (dy > 0 ? 1 : -1) * force;
          }
        }
        return y;
      }

      draw(t) {
        ctx.beginPath();
        const step = 20;
        for (let x = 0; x <= width + step; x += step) {
          const y = this.getY(x, t);
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.strokeStyle = this.color + '0.14)';
        ctx.lineWidth = 1.2;
        ctx.stroke();

        // Draw Flowing Light Packets along the wave
        for (let p of this.packets) {
          p.progress += p.speed;
          if (p.progress > 1) p.progress = 0;

          const px = p.progress * width;
          const py = this.getY(px, t);

          // Packet Glow Halo
          ctx.beginPath();
          ctx.arc(px, py, p.size + 2, 0, Math.PI * 2);
          ctx.fillStyle = this.color + '0.25)';
          ctx.fill();

          // Packet Core
          ctx.beginPath();
          ctx.arc(px, py, p.size, 0, Math.PI * 2);
          ctx.fillStyle = '#ffffff';
          ctx.shadowColor = '#38bdf8';
          ctx.shadowBlur = p.glow;
          ctx.fill();
          ctx.shadowBlur = 0; // reset
        }
      }
    }

    // 2. Floating Digital Circuit Nodes
    const nodeCount = isMobile ? 22 : 45;
    const maxConnectDist = isMobile ? 80 : 120;
    const nodes = [];

    class DataNode {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.38;
        this.vy = (Math.random() - 0.5) * 0.38;
        this.radius = Math.random() * 1.6 + 1;
        this.color = Math.random() > 0.5 ? 'rgba(56, 189, 248, ' : 'rgba(99, 102, 241, ';
        this.alpha = Math.random() * 0.45 + 0.25;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const dist = Math.hypot(dx, dy);
          if (dist < mouse.radius) {
            const force = (mouse.radius - dist) / mouse.radius;
            this.x -= (dx / dist) * force * 1.4;
            this.y -= (dy / dist) * force * 1.4;
          }
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color + this.alpha + ')';
        ctx.fill();
      }
    }

    // 3. Subtle Digital Binary/Hex Bits Floating Upward
    const bits = [];
    const bitCount = isMobile ? 8 : 16;
    const bitChars = ['01', '10', '11', '00', '< >', '{ }', '::', '->', '&&'];

    class DigitalBit {
      constructor() {
        this.reset();
        this.y = Math.random() * height; // initial scatter
      }

      reset() {
        this.x = Math.random() * width;
        this.y = height + 20;
        this.vy = -(0.25 + Math.random() * 0.35);
        this.text = bitChars[Math.floor(Math.random() * bitChars.length)];
        this.alpha = 0.02 + Math.random() * 0.08;
        this.color = Math.random() > 0.5 ? '#38bdf8' : '#818cf8';
      }

      update() {
        this.y += this.vy;
        if (this.y < -30) {
          this.reset();
        }
      }

      draw() {
        ctx.font = '10px "JetBrains Mono", monospace';
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.alpha;
        ctx.fillText(this.text, this.x, this.y);
        ctx.globalAlpha = 1.0;
      }
    }

    function initDataSystem() {
      waves.length = 0;
      for (let i = 0; i < waveCount; i++) {
        waves.push(new DataWave(i));
      }

      nodes.length = 0;
      for (let i = 0; i < nodeCount; i++) {
        nodes.push(new DataNode());
      }

      bits.length = 0;
      for (let i = 0; i < bitCount; i++) {
        bits.push(new DigitalBit());
      }
    }

    let time = 0;
    function animateDataFlow() {
      ctx.clearRect(0, 0, width, height);
      time += 1;

      // 1. Draw digital code bits
      for (let b of bits) {
        b.update();
        b.draw();
      }

      // 2. Draw flowing data wave streams
      for (let w of waves) {
        w.draw(time);
      }

      // 3. Draw and connect circuit nodes
      for (let i = 0; i < nodes.length; i++) {
        nodes[i].update();
        nodes[i].draw();

        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.hypot(dx, dy);

          if (dist < maxConnectDist) {
            const opacity = (1 - dist / maxConnectDist) * 0.16;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(99, 102, 241, ${opacity})`;
            ctx.lineWidth = 0.85;
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(animateDataFlow);
    }

    initDataSystem();
    animateDataFlow();
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

  // ------------------------------------------------------------------------
  // 7. Safe Internal Anchor Scrolling (Neutralizes file:/// Frame Origin Warnings)
  // ------------------------------------------------------------------------
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId && targetId !== '#') {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          targetElement.scrollIntoView({ behavior: 'smooth' });
          if (window.history && window.history.pushState && window.location.protocol !== 'file:') {
            window.history.pushState(null, null, targetId);
          }
        }
      }
    });
  });

  // Handle initial hash on load without frame reload
  if (window.location.hash && window.location.hash !== '#') {
    const initialTarget = document.querySelector(window.location.hash);
    if (initialTarget) {
      setTimeout(() => {
        initialTarget.scrollIntoView({ behavior: 'smooth' });
      }, 150);
    }
  }
});

