"use client";

import { useTheme } from "../../components/ThemeProvider";
import ProfileForm from "./form";
import { useEffect, useState } from "react";

export default function SettingsPage() {
  const { theme, toggleTheme } = useTheme();
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch("/api/settings/profile")
      .then((res) => res.json())
      .then(setUser)
      .catch(console.error);
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Settings</h1>
      <div className="card p-4">
        <h2 className="text-lg font-medium mb-2">Theme</h2>
        <div className="flex items-center space-x-4">
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
      </div>
      {user && <ProfileForm user={user} />}
      <div className="card p-4">
        <h2 className="text-lg font-medium mb-2">API Keys</h2>
        <button className="btn-primary" disabled>
          Reset API Keys
        </button>
      </div>
    </div>
  );
}
