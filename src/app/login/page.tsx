"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  const result = await signIn("credentials", {
    redirect: false,
    email,
    password,
  });

  if (result?.ok) {
    router.push("/dashboard"); // ✅ Go to dashboard after login
  } else {
    setError("Login failed. Please check your credentials.");
  }
};

  return (
    <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
      <form
        onSubmit={handleLogin}
        className="card w-full max-w-md flex flex-col gap-4"
      >
        <h2 className="text-2xl font-semibold mb-2 text-center">Sign In</h2>
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
        {error && <div className="error-msg text-center">{error}</div>}
        <button type="submit" className="btn-primary mt-2">
          Login
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
