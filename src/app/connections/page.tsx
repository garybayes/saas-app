"use client";

import { useEffect, useState } from "react";
import LayoutContainer from "../../components/LayoutContainer";

interface Connection {
  id: string;
  appName: string;
  apiKey: string;
  userId: string;
  createdAt: string;
}

export default function ConnectionsPage() {
  const [connections, setConnections] = useState<Connection[]>([]);
  const [appName, setAppName] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [loading, setLoading] = useState(false);

  const userId = "user-001"; // later replaced by real auth

  // Fetch all connections from DB
  useEffect(() => {
    const fetchConnections = async () => {
      try {
        const res = await fetch(`/api/connections?userId=${userId}`);
        if (!res.ok) throw new Error("Failed to fetch connections");
        const data = await res.json();
        setConnections(data || []);
      } catch (err) {
        console.error("Error loading connections:", err);
      }
    };
    fetchConnections();
  }, []);

  // Add new connection
  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!appName || !apiKey) return;
    setLoading(true);
    try {
      const res = await fetch("/api/connections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, appName, apiKey }),
      });
      if (res.ok) {
        const newConn = await res.json();
        setConnections((prev) => [...prev, newConn]);
        setAppName("");
        setApiKey("");
      }
    } catch (err) {
      console.error("Error adding connection:", err);
    } finally {
      setLoading(false);
    }
  };

  // Delete connection
  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/connections?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setConnections((prev) => prev.filter((conn) => conn.id !== id));
      }
    } catch (err) {
      console.error("Error deleting connection:", err);
    }
  };

  return (
    <LayoutContainer title="Connected Apps">
      <form onSubmit={handleAdd} className="space-y-4 mb-8">
        <div>
          <label className="label">App Name</label>
          <input
            value={appName}
            onChange={(e) => setAppName(e.target.value)}
            className="input"
            placeholder="e.g., Notion, Zapier"
          />
        </div>

        <div>
          <label className="label">API Key</label>
          <input
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="input"
            placeholder="Enter API key"
          />
        </div>

        <button
          type="submit"
          className="btn-primary w-full"
          disabled={loading}
        >
          {loading ? "Saving..." : "Add Connection"}
        </button>
      </form>

      {connections.length > 0 ? (
        <ul className="space-y-4">
          {connections.map((conn) => (
            <li
              key={conn.id}
              className="card flex items-center justify-between"
            >
              <div>
                <p className="font-medium">{conn.appName}</p>
                <p className="text-sm text-muted-foreground">{conn.apiKey}</p>
              </div>
              <button
                onClick={() => handleDelete(conn.id)}
                className="btn-muted"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-muted-foreground text-center">
          No apps connected yet.
        </p>
      )}
    </LayoutContainer>
  );
}
