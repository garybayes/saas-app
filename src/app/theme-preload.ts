export function themePreloadScript(serverTheme: "light" | "dark") {
  return `
    (function() {
      try {
        // Local storage value
        var ls = window.localStorage.getItem("theme");

        // System preference
        var sys = window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light";

        // FINAL theme resolution:
        // 1. Server says what user wants (DB)
        // 2. Use LS only AFTER user logs in and saves theme
        // 3. System is fallback
        var theme = "${serverTheme}" || ls || sys;

        document.documentElement.classList.add(theme);

        // Sync localStorage AFTER first paint
        window.localStorage.setItem("theme", theme);
      } catch (e) {
        console.error("Theme preload failed:", e);
      }
    })();
  `;
}
