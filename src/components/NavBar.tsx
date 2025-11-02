"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import MobileNav from "./MobileNav";
import { signOut } from "next-auth/react";

export default function NavBar() {
  const pathname = usePathname();
  const linkStyle = (href: string) =>
    pathname === href ? "text-primary font-semibold" : "text-foreground";

  return (
    <nav className="fixed top-0 left-0 right-0 bg-muted border-b z-50 h-14 flex items-center justify-between px-4">
      <span className="font-bold text-lg">MindForge SaaS</span>
<<<<<<< HEAD
      <div className="hidden md:flex gap-6">
        <Link href="/dashboard" className={linkStyle("/dashboard")}>Dashboard</Link>
        <Link href="/connections" className={linkStyle("/connections")}>Connections</Link>
        <Link href="/settings" className={linkStyle("/settings")}>Settings</Link>
        <Link href="/api/auth/signout">Logout</Link>
=======
      <div className="hidden md:flex gap-6 items-center">
        <Link href="/dashboard" className={linkStyle("/dashboard")}>Dashboard</Link>
        <Link href="/connections" className={linkStyle("/connections")}>Connections</Link>
        <Link href="/settings" className={linkStyle("/settings")}>Settings</Link>
        <button onClick={() => signOut({ callbackUrl: "/login" })} className="btn-muted text-sm">
          Logout
        </button>
>>>>>>> sprint-3.2-nav-ux-polish
      </div>
      <MobileNav />
    </nav>
  );
}
