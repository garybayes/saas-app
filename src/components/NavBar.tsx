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
      <div className="hidden md:flex items-center gap-6">
        <Link href="/dashboard" className={linkStyle("/dashboard")}>
          Dashboard
        </Link>
        <Link href="/connections" className={linkStyle("/connections")}>
          Connections
        </Link>
        <Link href="/workflows" className={linkStyle("/workflows")}>
          Workflows
        </Link>
        <Link href="/settings" className={linkStyle("/settings")}>
          Settings
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="text-foreground"
        >
          Logout
        </button>
      </div>
      <MobileNav />
    </nav>
  );
}
