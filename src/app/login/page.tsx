"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(""); // can be blank
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const result = await signIn("credentials", {
      redirect: false,
      email,
      password: password || "",
      callbackUrl: "/connections",
    });

    if (result?.ok) {
      router.push("/connections");
    } else {
      setError("Invalid email or password");
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300">
      <form
        onSubmit={handleLogin}
        className="w-80 rounded-xl bg-gray-50 p-6 shadow-md transition-colors duration-300 dark:bg-gray-800 dark:text-gray-100"
      >
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          Login
        </h2>

        <div className="mt-4 space-y-3">
          <input
            type="email"
            placeholder="Email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-md border border-gray-300 bg-white p-2 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
          />

          <input
            type="password"
            placeholder="Password (leave blank if none)"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-md border border-gray-300 bg-white p-2 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
          />

          {error && (
  <div className="mt-2 rounded-md bg-red-600/90 px-3 py-2 text-center text-sm font-semibold text-white dark:bg-red-500/90">
    {error}
  </div>
         )}
          <button
            type="submit"
            className="w-full rounded-md bg-blue-600 py-2 font-medium text-white transition hover:bg-blue-700"
          >
            Sign In
          </button>
        </div>

        <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-300">
          Don’t have an account?{" "}
          <a
            href="/signup"
            className="font-medium text-blue-600 underline dark:text-blue-400"
          >
            Sign up
          </a>
        </p>
      </form>
    </main>
  );
}
