"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useSession } from "next-auth/react";

type Theme = "light" | "dark";

interface ThemeContextProps {
  theme: Theme;
  toggleTheme: () => Promise<void>;
}

const ThemeContext = createContext<ThemeContextProps>({
  theme: "light",
  toggleTheme: async () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();

  // Public pages ALWAYS start light
  const [theme, setTheme] = useState<Theme>("light");

  //
  // 1 — When authenticated, load cached theme immediately
  //
  useEffect(() => {
    if (status === "authenticated") {
      const cached = localStorage.getItem("theme") as Theme | null;
      const initial = cached || (session?.user?.theme as Theme) || "light";

      setTheme(initial);
      localStorage.setItem("theme", initial);
      document.documentElement.classList.toggle(
        "dark",
        initial === "dark"
      );
    }

    // When status becomes unauthenticated → always light
    if (status === "unauthenticated") {
      setTheme("light");
      document.documentElement.classList.remove("dark");
    }
  }, [status, session?.user?.theme]);

  //
  // 2 — Apply theme on theme change
  //
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  //
  // 3 — Toggle theme + sync DB
  //
  const toggleTheme = async () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);

    if (status === "authenticated") {
      localStorage.setItem("theme", next);

      try {
        await fetch("/api/settings/theme", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ theme: next }),
        });
      } catch (err) {
        console.error("Failed to update theme", err);
      }
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
