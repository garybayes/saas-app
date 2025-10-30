"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import LayoutContainer from "../../components/LayoutContainer";

interface Connection {
  id: string;
  appName: string;
  apiKey: string;
  createdAt: string;
}

export default function ConnectionsPage() {
  const { data: session, status } = useSession();
  const [connections, setConnections] = useState<Connection[]>([]);
  const [appName, setAppName] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Fetch user's connections
  async function fetchConnections() {
    try {
      const res = await fetch("/api/connections");
      if (res.ok) {
        const data = await res.json();
        setConnections(data);
      } else {
        console.error("Failed to fetch connections:", res.status);
      }
    } catch (error) {
      console.error("Error fetching connections:", error);
    }
  }

  // ✅ Add new connection
  async function addConnection(e: React.FormEvent) {
    e.preventDefault();
    if (!appName || !apiKey) return;

    setLoading(true);
    try {
      const res = await fetch("/api/connections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ appName, apiKey }),
      });

      if (res.ok) {
        setAppName("");
        setApiKey("");
        await fetchConnections(); // refresh list
      } else {
        console.error("Failed to add connection:", res.status);
      }
    } catch (error) {
      console.error("Error adding connection:", error);
    } finally {
      setLoading(false);
    }
  }

  // ✅ Delete connection
  async function deleteConnection(id: string) {
    if (!confirm("Are you sure you want to delete this connection?")) return;
    try {
      const res = await fetch("/api/connections", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (res.ok) await fetchConnections();
      else console.error("Failed to delete connection:", res.status);
    } catch (error) {
      console.error("Error deleting connection:", error);
    }
  }

  // ✅ Load data when logged in
  useEffect(() => {
    if (status === "authenticated") {
      fetchConnections();
    }
  }, [status]);

  if (status === "loading") {
    return <p className="text-center text-muted-foreground mt-10">Loading session...</p>;
  }

  if (!session?.user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
        <p>You must be logged in to view this page.</p>
      </div>
    );
  }

  return (
    <LayoutContainer>
      <div className="flex flex-col items-center justify-center py-10 text-foreground">
        {/* ✅ User info for verification */}
        <div className="mb-6 text-center">
          <p className="text-lg font-semibold">
            Logged in as: {session.user.email}
          </p>
          <p className="text-sm text-muted-foreground">
            User ID: {session.user.id || "Unknown"}
          </p>
        </div>

        {/* ✅ Add Connection Form */}
        <form onSubmit={addConnection} className="card w-full max-w-md space-y-4">
          <h2 className="text-xl font-semibold text-center">Add New Connection</h2>
          <div>
            <label className="label">App Name</label>
            <input
              type="text"
              className="input"
              value={appName}
              onChange={(e) => setAppName(e.target.value)}
              placeholder="e.g. Slack, Notion"
              required
            />
          </div>
          <div>
            <label className="label">API Key</label>
            <input
              type="text"
              className="input"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter API key"
              required
            />
          </div>
          <button type="submit" className="btn-primary w-full" disabled={loading}>
            {loading ? "Adding..." : "Add Connection"}
          </button>
        </form>

        {/* ✅ List of existing connections */}
        <div className="mt-10 w-full max-w-2xl">
          <h2 className="text-xl font-semibold mb-3">Your Connections</h2>
          {connections.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              No connections found.
            </p>
          ) : (
            <ul className="space-y-3">
              {connections.map((conn) => (
                <li
                  key={conn.id}
                  className="card flex justify-between items-center px-4 py-3"
                >
                  <div>
                    <p className="font-medium">{conn.appName}</p>
                    <p className="text-sm text-muted-foreground">
                      {conn.apiKey ? "API Key stored securely" : "No API key"}
                    </p>
                  </div>
                  <button
                    onClick={() => deleteConnection(conn.id)}
                    className="btn-muted text-sm"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </LayoutContainer>
  );
}
