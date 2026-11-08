/* Shared behavior for static content pages: theme toggle sync. */
(function () {
  var KEY = "imey_scheduler:theme";

  function systemTheme() {
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }

  function readStored() {
    try {
      var raw = localStorage.getItem(KEY);
      if (raw == null) return null;
      var parsed = JSON.parse(raw);
      if (parsed === "light" || parsed === "dark") return parsed;
      return null;
    } catch (e) {
      return null;
    }
  }

  function currentTheme() {
    return readStored() || systemTheme();
  }

  function applyTheme(theme) {
    document.documentElement.dataset.theme = theme;
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", theme === "dark" ? "#000000" : "#f8fafc");
    updateLabels(theme);
  }

  function updateLabels(theme) {
    var dark = theme === "dark";
    document.querySelectorAll(".theme-toggle").forEach(function (btn) {
      btn.setAttribute("aria-checked", dark ? "true" : "false");
      btn.setAttribute("aria-label", dark ? "Switch to light mode" : "Switch to dark mode");
      var label = btn.querySelector(".theme-toggle__label");
      if (label) label.textContent = dark ? "Dark" : "Light";
    });
  }

  function toggle() {
    var next = currentTheme() === "dark" ? "light" : "dark";
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch (e) {}
    applyTheme(next);
  }

  // Initial apply (in case inline script didn't run / sync)
  applyTheme(currentTheme());

  // Wire up buttons once DOM ready
  function wire() {
    document.querySelectorAll(".theme-toggle").forEach(function (btn) {
      btn.addEventListener("click", toggle);
    });
    updateLabels(currentTheme());
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", wire);
  } else {
    wire();
  }

  // React to system changes if no stored preference
  if (window.matchMedia) {
    var mql = window.matchMedia("(prefers-color-scheme: dark)");
    mql.addEventListener("change", function () {
      if (readStored() === null) applyTheme(systemTheme());
    });
  }
})();
