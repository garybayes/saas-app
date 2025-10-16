"use client";
import { useState, useEffect } from "react";

export default function SettingsPage() {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    if (stored) setTheme(stored);
  }, []);

  const toggleTheme = async () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");

    await fetch("/api/theme", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ theme: newTheme }),
    });
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-2xl mb-4">Current theme: {theme}</h1>
      <button
        onClick={toggleTheme}
        className="px-4 py-2 rounded bg-gray-800 text-white dark:bg-gray-200 dark:text-black transition"
      >
        Toggle Theme
      </button>
    </main>
  );
}
