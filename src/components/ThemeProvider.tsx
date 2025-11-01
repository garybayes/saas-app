"use client";

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import { useSession } from "next-auth/react";

interface ThemeContextType {
  theme: "light" | "dark";
  toggleTheme: () => void;
  setTheme: (theme: "light" | "dark") => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const { data: session } = useSession();
  const [theme, setThemeState] = useState<"light" | "dark">("light");

  const applyTheme = (newTheme: "light" | "dark") => {
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(newTheme);
    root.classList.toggle("dark", newTheme === "dark");
    localStorage.setItem("theme", newTheme);
  };

  const setTheme = useCallback((newTheme: "light" | "dark") => {
    setThemeState(newTheme);
    applyTheme(newTheme);
  }, []);

  useEffect(() => {
    const loadTheme = async () => {
      if (session?.user?.id) {
        try {
          const res = await fetch(`/api/settings/theme`);
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
      } else {
        setTheme("light");
      }
    };

    loadTheme();
  }, [session?.user?.id, setTheme]);

  const toggleTheme = async () => {
    if (!session?.user?.id) return;
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);

    try {
      await fetch("/api/settings/theme", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ theme: newTheme }),
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
