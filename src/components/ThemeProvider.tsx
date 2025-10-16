"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "light",
  toggleTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>("light");

  // Load initial theme from DB on mount
  useEffect(() => {
    const fetchTheme = async () => {
      try {
        const res = await fetch("/api/theme?userId=user-001");
        const data = await res.json();
        const dbTheme: Theme = data.theme === "dark" ? "dark" : "light";
        setTheme(dbTheme);
        document.documentElement.classList.toggle("dark", dbTheme === "dark");
      } catch (err) {
        console.error("Failed to fetch theme:", err);
      }
    };
    fetchTheme();
  }, []);

  // Toggle theme locally and update DB
  const toggleTheme = async () => {
    const newTheme: Theme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");

    try {
      await fetch("/api/theme", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: "user-001", theme: newTheme }),
      });
    } catch (err) {
      console.error("Failed to update theme:", err);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
