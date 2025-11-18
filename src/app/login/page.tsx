"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;           // ⛔ prevents double submit
    setLoading(true);
    setError("");

    if (!email || !password) {     // ⛔ prevents empty first submission
      setError("Email and password are required.");
      setLoading(false);
      return;
    }

    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (result?.ok) {
      router.replace("/dashboard");
      return;
    }

    setError("Invalid email or password");
    setLoading(false);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
      <form onSubmit={handleLogin} className="card w-full max-w-md flex flex-col gap-4">
        <h2 className="text-2xl font-semibold text-center mb-2">Sign In</h2>

        <input
          type="email"
          className="input"
          placeholder="Email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          className="input"
          placeholder="Password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && <p className="error-msg text-center">{error}</p>}

        <button type="submit" className="btn-primary mt-2" disabled={loading}>
          {loading ? "Signing in..." : "Login"}
        </button>

        <p className="text-sm text-center">
          Don’t have an account?{" "}
          <a href="/signup" className="text-primary hover:underline">
            Sign up
          </a>
        </p>
      </form>
    </div>
  );
}
