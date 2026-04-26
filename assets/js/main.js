/* =====================================================
   Avijit Roy — Main JS v2
   ===================================================== */

(function () {
  // Mobile nav
  const hamburger = document.getElementById("hamburger");
  const nav = document.getElementById("navLinks");
  
  if (hamburger) {
    hamburger.addEventListener("click", () => {
      const isOpen = nav?.classList.toggle("show");
      if (isOpen) {
        const firstLink = nav?.querySelector('a');
        firstLink && firstLink.focus();
        if (firstLink) firstLink.setAttribute("tabindex", "-1");
      }
      hamburger.setAttribute("aria-expanded", isOpen ? "true" : "false");
      hamburger.setAttribute("aria-label", isOpen ? "Close Menu" : "Open Menu");
    });
  }

  // Close on Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && nav?.classList.contains("show")) {
      nav.classList.remove("show");
      if (hamburger) {
        hamburger.setAttribute("aria-expanded", "false");
        hamburger.setAttribute("aria-label", "Open Menu");
        hamburger.focus();
      }
    }
  });

  // Theme toggle logic (OS preference aware)
  const root = document.documentElement;
  const savedTheme = localStorage.getItem("theme");
  const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  
  // Choose theme: saved setting > OS preference > light default
  const theme = savedTheme || (prefersDark ? "dark" : "light");
  root.setAttribute("data-theme", theme);
  
  // Initial dom ready logic
  document.addEventListener('DOMContentLoaded', () => {
    updateThemeIcon(theme);
    
    // Theme Status Announcer
    const themeStatus = document.createElement("span");
    themeStatus.setAttribute("id", "themeStatus");
    themeStatus.setAttribute("aria-live", "polite");
    themeStatus.classList.add("sr-only");
    document.body.appendChild(themeStatus);

    const themeToggleBtn = document.getElementById("themeToggle");
    if (themeToggleBtn) {
      themeToggleBtn.addEventListener("click", () => {
        const currentTheme = root.getAttribute("data-theme");
        const nextTheme = currentTheme === "dark" ? "light" : "dark";
        
        root.setAttribute("data-theme", nextTheme);
        localStorage.setItem("theme", nextTheme);
        updateThemeIcon(nextTheme);
        themeStatus.textContent = nextTheme === "dark" ? "Dark mode enabled" : "Light mode enabled";
      });
    }

    // Set current year in footer
    const yearSpan = document.getElementById("currentYear");
    if (yearSpan) {
      yearSpan.textContent = new Date().getFullYear();
    }
  });

  function updateThemeIcon(mode) {
    const icon = document.getElementById("themeIcon");
    const toggle = document.getElementById("themeToggle");
    if (!icon || !toggle) return;
    
    if (mode === "light") {
      icon.innerHTML = `<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true"><path d="M21.64 13a8.5 8.5 0 11-9.64-9.64 7 7 0 109.64 9.64z"/></svg>`;
      toggle.setAttribute("aria-pressed", "true");
      toggle.setAttribute("aria-label", "Switch to dark mode");
    } else {
      icon.innerHTML = `<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true"><path d="M6.995 12c0-2.761 2.246-5.005 5.005-5.005S17.005 9.239 17.005 12 14.759 17.005 12 17.005 6.995 14.761 6.995 12zm13.005-.5h2a1 1 0 110 2h-2a1 1 0 110-2zM2 11.5h2a1 1 0 110 2H2a1 1 0 110-2zm16.95-6.364l1.414 1.414a1 1 0 11-1.414 1.414L17.536 6.55a1 1 0 011.414-1.414zM6.05 17.95l1.414 1.414a1 1 0 11-1.414 1.414L4.636 19.364a1 1 0 011.414-1.414zM12 2.5a1 1 0 011 1V6a1 1 0 11-2 0V3.5a1 1 0 011-1zM12 17a1 1 0 011 1v2.5a1 1 0 11-2 0V18a1 1 0 011-1z"/></svg>`;
      toggle.setAttribute("aria-pressed", "false");
      toggle.setAttribute("aria-label", "Switch to light mode");
    }
  }

  // Project filters (manual cards only)
  const search = document.getElementById("projectSearch");
  const clearBtn = document.getElementById("clearSearch");
  const chips = document.querySelectorAll(".chip");
  const cards = () => Array.from(document.querySelectorAll("#projectGrid .card"));

  function applyFilter() {
    const q = (search?.value || "").toLowerCase().trim();
    const activeChip = document.querySelector(".chip.active");
    const tag = activeChip ? activeChip.getAttribute("data-tag").toLowerCase() : "all";

    cards().forEach((el) => {
      const name = (el.querySelector("h3")?.textContent || "").toLowerCase();
      const tags = (el.getAttribute("data-tags") || "").toLowerCase();
      const tagOk = tag === "all" || tags.includes(tag);
      const textOk = !q || name.includes(q) || tags.includes(q);
      el.style.display = tagOk && textOk ? "block" : "none";
    });
  }

  search?.addEventListener("input", applyFilter);
  clearBtn?.addEventListener("click", () => {
    search.value = "";
    setTimeout(() => search.focus(), 0);
    applyFilter();
  });
  
  // Initialize ARIA states
  chips.forEach((c) => {
    c.setAttribute("aria-pressed", c.classList.contains("active") ? "true" : "false");
  });

  chips.forEach((c) =>
    c.addEventListener("click", () => {
      chips.forEach((x) => {
        x.classList.remove("active");
        x.setAttribute("aria-pressed", "false");
      });
      c.classList.add("active");
      c.setAttribute("aria-pressed", "true");
      applyFilter();
    })
  );

  // make project inline tags clickable
  function wireInlineTags() {
    const inline = document.querySelectorAll(".tags li.clickable");
    inline.forEach((t) => {
      t.setAttribute("tabindex", "0");
      t.addEventListener("click", () => {
        const tag = t.getAttribute("data-tag");
        if (!tag) return;
        chips.forEach((x) => {
          x.classList.remove("active");
          x.setAttribute("aria-pressed", "false");
        });
        const match = Array.from(chips).find((x) => x.getAttribute("data-tag").toLowerCase() === tag.toLowerCase());
        if (match) {
          match.classList.add("active");
          match.setAttribute("aria-pressed", "true");
        }
        else {
          const allChip = document.querySelector('.chip[data-tag="all"]');
          if (allChip) {
            allChip.classList.add('active');
            allChip.setAttribute("aria-pressed", "true");
          }
        }
        if (search) search.value = "";
        applyFilter();
      });
      t.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); t.click(); }
      });
    });
  }

  // initial wire
  wireInlineTags();

})();
