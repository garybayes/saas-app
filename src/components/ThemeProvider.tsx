"use client";

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";

interface ThemeContextType {
  theme: "light" | "dark";
  toggleTheme: () => void;
  setTheme: (theme: "light" | "dark") => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setThemeState] = useState<"light" | "dark">("light");
  const userId = "user-001";

  /** 🧩 Apply Tailwind theme classes to <html> + persist */
  const applyTheme = (newTheme: "light" | "dark") => {
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(newTheme);

    // Tailwind uses `.dark` to trigger dark mode variants
    root.classList.toggle("dark", newTheme === "dark");

    localStorage.setItem("theme", newTheme);
  };

  const setTheme = useCallback((newTheme: "light" | "dark") => {
    setThemeState(newTheme);
    applyTheme(newTheme);
  }, []);

  /** 🔄 Load user theme from DB or localStorage */
  useEffect(() => {
    const loadTheme = async () => {
      const local = localStorage.getItem("theme") as "light" | "dark" | null;
      if (local) {
        setTheme(local);
        return;
      }

      try {
        const res = await fetch(`/api/settings/theme?userId=${userId}`);
        if (res.ok) {
          const data = await res.json();
          const savedTheme = data?.theme || "light";
          setTheme(savedTheme);
        } else {
          setTheme("light");
        }
      } catch {
        setTheme("light");
      }
    };

    loadTheme();
  }, [setTheme]);

  /** 🌗 Toggle theme + persist to DB */
  const toggleTheme = async () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);

    try {
      await fetch("/api/settings/theme", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, theme: newTheme }),
      });
    } catch (err) {
      console.error("Theme update failed:", err);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside ThemeProvider");
  return ctx;
};
