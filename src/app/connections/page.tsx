"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { Loader2, Trash2 } from "lucide-react";

interface Connection {
  id: string;
  appName: string;
  apiKey: string;
  createdAt: string;
}

export default function ConnectionsPage() {
  const { data: session } = useSession();
  const [connections, setConnections] = useState<Connection[]>([]);
  const [loading, setLoading] = useState(false);
  const [appName, setAppName] = useState("");
  const [apiKey, setApiKey] = useState("");

  const fetchConnections = useCallback(async () => {
    if (!session?.user?.id) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/connections`);
      if (res.ok) {
        const data = await res.json();
        setConnections(data);
      } else {
        console.error("Failed to fetch connections:", res.status);
      }
    } catch (err) {
      console.error("Error fetching connections:", err);
    } finally {
      setLoading(false);
    }
  }, [session?.user?.id]);

  useEffect(() => {
    fetchConnections();
  }, [fetchConnections]);

  const handleDelete = async (id: string) => {
    // Optimistic update
    const prev = [...connections];
    setConnections(prev.filter((c) => c.id !== id));

    try {
      const res = await fetch(`/api/connections/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        console.error("Delete failed:", await res.text());
        alert("Failed to delete connection. Please retry.");
        setConnections(prev); // rollback
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("An error occurred while deleting.");
      setConnections(prev); // rollback
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/connections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ appName, apiKey }),
      });
      if (res.ok) {
        setAppName("");
        setApiKey("");
        fetchConnections();
      } else {
        alert("Failed to add connection");
      }
    } catch (error) {
      console.error("Add error:", error);
      alert("An error occurred while adding the connection.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Your Connections</h1>

      <form onSubmit={handleAdd} className="card p-4 mb-6">
        <h2 className="text-lg font-medium mb-2">Add New Connection</h2>
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="App Name"
            value={appName}
            onChange={(e) => setAppName(e.target.value)}
            required
            className="input"
          />
          <input
            type="text"
            placeholder="API Key"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            required
            className="input"
          />
          <button type="submit" className="btn-primary">
            Add
          </button>
        </div>
      </form>

      {loading ? (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="animate-spin h-5 w-5" /> Loading connections...
        </div>
      ) : connections.length === 0 ? (
        <p className="text-muted-foreground">No connections found.</p>
      ) : (
        <ul className="space-y-4">
          {connections.map((conn) => (
            <li
              key={conn.id}
              className="card flex items-center justify-between p-4 hover:bg-muted transition"
            >
              <div>
                <h3 className="font-medium">{conn.appName}</h3>
                <p className="text-sm text-muted-foreground">
                  Added {new Date(conn.createdAt).toLocaleDateString()}
                </p>
              </div>

              <button
                onClick={() => handleDelete(conn.id)}
                title="Delete Connection"
                className="btn-primary"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
