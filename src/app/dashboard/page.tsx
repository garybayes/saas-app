"use client";
import { useEffect, useState } from "react";

interface Stats {
  displayName?: string | null;
  email: string;
  theme: string;
  lastLogin?: string;
  connections: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch("/api/settings/profile")
      .then((res) => res.json())
      .then(setStats)
      .catch(console.error);
  }, []);

  if (!stats) return <p>Loading dashboard...</p>;

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">
        Welcome back, {stats.displayName || stats.email || "User"}
      </h1>
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="card">Connections: {stats.connections}</div>
        <div className="card">Theme: {stats.theme}</div>
        <div className="card">Last Login: {stats.lastLogin || "N/A"}</div>
      </div>
    </div>
  );
}
