document.getElementById('currentYear').textContent = new Date().getFullYear();

const backToTop = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
  if (window.pageYOffset > 400) {
    backToTop.classList.add('visible');
  } else {
    backToTop.classList.remove('visible');
  }
});

backToTop.addEventListener('click', (e) => {
  e.preventDefault();
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// REVEAL ON SCROLL
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px"
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
    }
  });
}, observerOptions);

document.querySelectorAll('.section, .card, .bar-group, .hero-stat, .page-shell header').forEach(el => {
  el.classList.add('reveal');
  observer.observe(el);
});

// INFO POPOVER TOGGLE
const infoTrigger = document.getElementById('infoTrigger');
const infoOverlay = document.getElementById('infoOverlay');
const infoClose = document.getElementById('infoClose');

if (infoTrigger && infoOverlay && infoClose) {
  infoTrigger.addEventListener('click', () => {
    infoOverlay.classList.add('active');
  });

  infoClose.addEventListener('click', () => {
    infoOverlay.classList.remove('active');
  });

  infoOverlay.addEventListener('click', (e) => {
    if (e.target === infoOverlay) {
      infoOverlay.classList.remove('active');
    }
  });
}
