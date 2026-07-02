const nav = document.querySelector('.glass-nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('shadow-sm', window.scrollY > 30);
});
