export function themePreloadScript(): string {
  return `
    (function() {
      try {
        const theme = localStorage.getItem("theme") || "light";
        document.documentElement.dataset.theme = theme;
      } catch (e) {}
    })();
  `;
}
