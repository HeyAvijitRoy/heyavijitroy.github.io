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

function copyBibtex() {
  const block = document.getElementById("bibtexBlock");
  const status = document.getElementById("copyStatus");

  if (!block) {
    console.error("bibtexBlock element not found.");
    return;
  }

  const text = block.innerText.trim();

  function showStatus(message, success = true) {
    if (!status) return;

    status.textContent = message;
    status.classList.add("show");

    if (!success) {
      status.style.color = "var(--red)";
    } else {
      status.style.color = "var(--green)";
    }

    // Hide after 2 seconds
    setTimeout(() => {
      status.classList.remove("show");
    }, 2000);
  }

  if (!navigator.clipboard || !window.isSecureContext) {
    // Fallback method
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "absolute";
    textarea.style.left = "-9999px";

    document.body.appendChild(textarea);
    textarea.select();

    try {
      document.execCommand("copy");
      showStatus("Copied ✓");
    } catch (err) {
      console.error("Fallback copy failed:", err);
      showStatus("Copy failed", false);
    }

    document.body.removeChild(textarea);
    return;
  }

  navigator.clipboard.writeText(text)
    .then(() => {
      showStatus("BibTeX copied ✓");
    })
    .catch((err) => {
      console.error("Clipboard write failed:", err);
      showStatus("Copy failed", false);
    });
}