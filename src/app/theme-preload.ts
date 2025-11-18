"use client";

// Light/dark system-preference initializer
export function preloadTheme() {
  const ls = window.localStorage.getItem("theme");
  const sys = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  const theme = ls || sys;
  document.documentElement.classList.add(theme);
}

preloadTheme();
