"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useSession } from "next-auth/react";

type ThemeContextType = {
  theme: "light" | "dark";
  setTheme: (t: "light" | "dark") => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const [theme, setTheme] = useState<"light" | "dark">("light");

  // ✅ 1. Load from localStorage or system preference
useEffect(() => {
  const stored = localStorage.getItem("theme") as "light" | "dark" | null;
  if (stored) {
    setTheme(stored);
  }
  // ❌ No fallback to system preference — we only trust stored or DB theme
}, []);

  // ✅ 2. Override with DB value from authenticated user (if present)
  useEffect(() => {
    if (session?.user?.theme && (session.user.theme === "light" || session.user.theme === "dark")) {
      setTheme(session.user.theme);
    }
  }, [session]);

  // ✅ 3. Apply to <html> and persist
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    root.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  // ✅ 4. Provide context for components
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <div
        className={`min-h-screen transition-colors duration-300 ${
          theme === "dark"
            ? "bg-gray-900 text-gray-100"
            : "bg-white text-gray-900"
        }`}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
};
