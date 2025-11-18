"use client";

/**
 * Script used to prevent theme “flash” on initial load.
 * It runs before React hydration and chooses the correct theme
 * based on localStorage or system preference.
 */

export function themePreloadScript() {
  try {
    const saved = localStorage.getItem("theme");
    const system = window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";

    const theme = saved || system;
    document.documentElement.classList.add(theme);
  } catch (e) {
    console.warn("Theme preload failed:", e);
  }
}

themePreloadScript();
