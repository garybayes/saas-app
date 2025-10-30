"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignUpPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Signup failed");
      } else {
        // ✅ redirect to login after successful signup
        router.push("/login");
      }
    } catch (err) {
      console.error("Signup error:", err);
      setError("Unexpected error during signup");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[rgb(var(--background))] text-[rgb(var(--foreground))] transition-colors duration-300">
      <div className="card w-full max-w-md">
        <h1 className="text-2xl font-semibold mb-6 text-center">Create Account</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label block mb-1" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="label block mb-1" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="(leave blank for none)"
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center bg-red-100 dark:bg-red-900/30 rounded-md py-1">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full"
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <p className="text-center text-sm mt-4 text-[rgb(var(--muted-foreground))]">
          Already have an account?{" "}
          <Link href="/login" className="text-[rgb(var(--accent))] hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
