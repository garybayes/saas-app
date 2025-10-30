"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import LayoutContainer from "../../components/LayoutContainer";
import { useTheme } from "../../components/ThemeProvider";

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const { theme, setTheme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [savedTheme, setSavedTheme] = useState<string | null>(null);

  // ✅ Load user’s saved theme on mount
  useEffect(() => {
    if (status === "authenticated" && session?.user?.id) {
      fetch(`/api/settings/theme?userId=${session.user.id}`)
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data?.theme) {
            setSavedTheme(data.theme);
            setTheme(data.theme);
            document.documentElement.dataset.theme = data.theme;
          }
        })
        .catch((err) => console.error("Failed to fetch theme:", err));
    }
  }, [status, session?.user?.id, setTheme]);

  // ✅ Update theme in local state and server
  async function handleThemeToggle() {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    document.documentElement.dataset.theme = newTheme;

    if (session?.user?.id) {
      setLoading(true);
      try {
        const res = await fetch("/api/settings/theme", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ theme: newTheme }),
        });
        if (res.ok) {
          setSavedTheme(newTheme);
        } else {
          console.error("Failed to update theme in DB");
        }
      } catch (err) {
        console.error("Theme update failed:", err);
      } finally {
        setLoading(false);
      }
    }
  }

  if (status === "loading") {
    return <p className="text-center text-muted-foreground mt-10">Loading session...</p>;
  }

  if (!session?.user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
        <p>You must be logged in to access Settings.</p>
      </div>
    );
  }

  return (
    <LayoutContainer>
      <div className="flex flex-col items-center justify-center py-10 text-foreground">
        <div className="card w-full max-w-md space-y-6 text-center">
          <h1 className="text-2xl font-semibold">Settings</h1>

          <div className="space-y-2">
            <p className="text-lg font-medium">
              Current Theme: <span className="capitalize">{theme}</span>
            </p>
            <button
              onClick={handleThemeToggle}
              className="btn-primary w-full"
              disabled={loading}
            >
              {loading ? "Saving..." : `Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`}
            </button>
            {savedTheme && (
              <p className="text-sm text-muted-foreground">
                Saved preference: {savedTheme}
              </p>
            )}
          </div>

          <div className="pt-6 border-t border-border">
            <p className="text-sm text-muted-foreground">
              Logged in as <b>{session.user.email}</b>
              <br />
              User ID: {session.user.id}
            </p>
          </div>
        </div>
      </div>
    </LayoutContainer>
  );
}
