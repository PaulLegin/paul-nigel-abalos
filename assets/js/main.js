document.addEventListener('DOMContentLoaded', () => {
  const nav = document.querySelector('.glass-nav');
  const progressBar = document.getElementById('progressBar');
  const backToTopBtn = document.getElementById('backToTop');

  // Handle Scroll Events
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    
    // Navbar shadow
    nav.classList.toggle('shadow-sm', scrollY > 30);

    // Scroll Progress Bar
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollPercent = (scrollY / docHeight) * 100;
    if (progressBar) {
      progressBar.style.width = `${scrollPercent}%`;
    }

    // Back to Top Button Visibility
    if (backToTopBtn) {
      if (scrollY > 500) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }
  });

  // Back to Top functionality
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // Intersection Observer for Reveal Animations
  const revealElements = document.querySelectorAll('.reveal');
  
  const revealOptions = {
    threshold: 0.15, // Trigger when 15% of element is visible
    rootMargin: "0px 0px -50px 0px" // Trigger slightly before the bottom
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target); // Only animate once
      }
    });
  }, revealOptions);

  revealElements.forEach(el => {
    revealObserver.observe(el);
  });

  // Automatic Copy Email to Clipboard with Smooth In-Card Feedback
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
        
        // Visual feedback inside card
        emailText.textContent = '✓ Copied to clipboard!';
        emailText.style.color = 'var(--cyan)';
        emailText.style.fontWeight = '700';
        if (emailIcon) {
          emailIcon.className = 'bi bi-check-circle-fill';
          emailIcon.style.color = '#10b981';
        }

        clearTimeout(copyTimeout);
        copyTimeout = setTimeout(() => {
          emailText.textContent = email;
          emailText.style.color = '';
          emailText.style.fontWeight = '';
          if (emailIcon) {
            emailIcon.className = 'bi bi-envelope-at';
            emailIcon.style.color = '';
          }
        }, 2200);
      } catch (err) {
        // Fallback if clipboard permission is denied
        window.location.href = `mailto:${email}`;
      }
    });
  }

  // Ambient Data Nodes & Stream Network Background Animation
  const canvas = document.getElementById('bgNetworkCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.innerWidth < 768;
    const particleCount = prefersReducedMotion ? 0 : (isMobile ? 24 : 50);
    const maxDistance = isMobile ? 85 : 120;
    const particles = [];
    const mouse = { x: null, y: null, radius: 140 };

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    window.addEventListener('mouseleave', () => {
      mouse.x = null;
      mouse.y = null;
    });

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.45;
        this.vy = (Math.random() - 0.5) * 0.45;
        this.radius = Math.random() * 1.8 + 1;
        this.baseAlpha = Math.random() * 0.4 + 0.2;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        // Bounce from edges
        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        // Mouse gentle repulsion
        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouse.radius) {
            const force = (mouse.radius - dist) / mouse.radius;
            this.x -= (dx / dist) * force * 1.2;
            this.y -= (dy / dist) * force * 1.2;
          }
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 200, 255, ${this.baseAlpha})`;
        ctx.shadowBlur = 6;
        ctx.shadowColor = 'rgba(0, 200, 255, 0.7)';
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    if (particleCount > 0) {
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }

      function animate() {
        ctx.clearRect(0, 0, width, height);

        for (let i = 0; i < particles.length; i++) {
          particles[i].update();
          particles[i].draw();

          for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < maxDistance) {
              const alpha = (1 - dist / maxDistance) * 0.22;
              ctx.beginPath();
              ctx.moveTo(particles[i].x, particles[i].y);
              ctx.lineTo(particles[j].x, particles[j].y);
              ctx.strokeStyle = `rgba(0, 200, 255, ${alpha})`;
              ctx.lineWidth = 0.85;
              ctx.stroke();
            }
          }
        }

        requestAnimationFrame(animate);
      }

      animate();
    }
  }
});
