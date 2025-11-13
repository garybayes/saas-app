"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function SignupPage() {
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      // 1️⃣ Create the new user in your database
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ displayName, email, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || "Signup failed.");
        return;
      }

      // 2️⃣ Auto-login via NextAuth credentials provider
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      // 3️⃣ Redirect to first page after signup
      if (result?.ok) {
        router.push("/connections"); // ✅ new users start here
      } else {
        setError("Auto-login failed after signup.");
      }
    } catch (err) {
      console.error("Signup error:", err);
      setError("Unexpected signup error");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
      <form
        onSubmit={handleSignup}
        className="card w-full max-w-md flex flex-col gap-4"
      >
        <h2 className="text-2xl font-semibold mb-2 text-center">
          Create Account
        </h2>

        <input
          type="text"
          placeholder="Display Name"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          required
          className="input"
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="input"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="input"
        />

        {error && (
          <div className="error-msg text-center text-red-500">{error}</div>
        )}

        <button type="submit" className="btn-primary mt-2">
          Sign Up
        </button>

        <p className="text-sm text-center">
          Already have an account?{" "}
          <a href="/login" className="text-primary hover:underline">
            Login
          </a>
        </p>
      </form>
    </div>
  );
}
