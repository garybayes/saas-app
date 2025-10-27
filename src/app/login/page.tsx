"use client";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const email = form.email.value;
    const password = form.password.value;
    await signIn("credentials", { email, password, callbackUrl: "/" });
  };

  return (
    <div className="flex items-center justify-center h-screen bg-background text-foreground">
      <form onSubmit={handleLogin} className="card w-96">
        <h2 className="text-2xl font-semibold mb-4">Login</h2>
        <input name="email" placeholder="Email" className="input mb-2" />
        <input name="password" type="password" placeholder="Password" className="input mb-4" />
        <button type="submit" className="btn-primary w-full">Sign In</button>
      </form>
    </div>
  );
}
