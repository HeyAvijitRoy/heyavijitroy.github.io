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
