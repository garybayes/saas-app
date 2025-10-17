"use client";

import { useTheme } from "@/components/ThemeProvider";

export default function SettingsPage() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-custom text-custom transition-colors duration-300">
      <h1 className="text-2xl font-bold mb-4">Settings</h1>

      <p className="mb-4 text-lg">
        Current theme: <span className="font-mono">{theme}</span>
      </p>

      <button
        className="px-6 py-2 rounded border border-gray-700
                   bg-white text-black
                   dark:bg-gray-800 dark:text-white
                   hover:bg-gray-200 dark:hover:bg-gray-700
                   transition-colors duration-300"
        onClick={toggleTheme}
      >
        Toggle Theme
      </button>
    </div>
  );
}
