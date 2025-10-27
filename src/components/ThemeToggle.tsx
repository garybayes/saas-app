"use client";

import { useState, useEffect } from "react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  // --- Fetch initial theme from DB ---
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const res = await fetch("/api/settings/theme?userId=user-001");
        if (res.ok) {
          const data = await res.json();
          const savedTheme = data?.theme || "light";
          setTheme(savedTheme);
          document.documentElement.classList.toggle("dark", savedTheme === "dark");
          localStorage.setItem("theme", savedTheme);
        } else {
          console.warn("Failed to load theme from DB");
        }
      } catch (err) {
        console.error("Error fetching theme:", err);
      }
    };
    loadTheme();
  }, []);

  // --- Toggle theme and persist ---
  const toggleTheme = async () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
    localStorage.setItem("theme", newTheme);

    try {
      await fetch("/api/settings/theme", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: "user-001", theme: newTheme }),
      });
    } catch (err) {
      console.error("Failed to update theme in DB:", err);
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className="btn-primary mt-4"
    >
      {theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
    </button>
  );
}
