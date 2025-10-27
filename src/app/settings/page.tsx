"use client";

import LayoutContainer from "../../components/LayoutContainer";
import { useTheme } from "../../components/ThemeProvider";

export default function SettingsPage() {
  const { theme, toggleTheme } = useTheme();

  return (
    <LayoutContainer title="User Settings">
      <div className="flex flex-col items-center space-y-6 transition-colors duration-500">
        <p className="text-lg">
          Current theme:{" "}
          <span className="font-semibold capitalize text-primary">
            {theme}
          </span>
        </p>
        <button onClick={toggleTheme} className="btn-primary px-6 py-2">
          Switch to {theme === "light" ? "Dark" : "Light"} Mode
        </button>
      </div>
    </LayoutContainer>
  );
}
