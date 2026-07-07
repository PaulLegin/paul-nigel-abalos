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
});
