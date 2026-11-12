(() => {
  const storageKey = "learning-lab-theme";
  const systemTheme = window.matchMedia("(prefers-color-scheme: dark)");
  let preference = null;
  try {
    const saved = localStorage.getItem(storageKey);
    if (saved === "light" || saved === "dark") preference = saved;
  } catch {
    // The switch still works when browser storage is unavailable.
  }

  function applyTheme() {
    const theme = preference || (systemTheme.matches ? "dark" : "light");
    document.documentElement.dataset.theme = theme;
    const toggle = document.getElementById("themeToggle");
    if (toggle) {
      toggle.textContent = theme === "dark" ? "Light mode" : "Dark mode";
      toggle.setAttribute("aria-pressed", String(theme === "dark"));
      toggle.setAttribute("aria-label", "Dark mode");
    }
  }

  applyTheme();
  systemTheme.addEventListener("change", applyTheme);
  document.addEventListener("DOMContentLoaded", () => {
    const toggle = document.getElementById("themeToggle");
    toggle.onclick = () => {
      preference = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
      try {
        localStorage.setItem(storageKey, preference);
      } catch {
        // Retain the choice for this page even if it cannot be saved.
      }
      applyTheme();
    };
    applyTheme();
  });
})();
