"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import MobileNav from "./MobileNav";

export default function NavBar() {
  const pathname = usePathname();
  const linkStyle = (href: string) =>
    pathname === href ? "text-primary font-semibold" : "text-foreground";

  return (
    <nav className="fixed top-0 left-0 right-0 bg-muted border-b z-50 h-14 flex items-center justify-between px-4">
      <span className="font-bold text-lg">MindForge SaaS</span>
      <div className="hidden md:flex gap-6">
        <Link href="/dashboard" className={linkStyle("/dashboard")}>Dashboard</Link>
        <Link href="/connections" className={linkStyle("/connections")}>Connections</Link>
        <Link href="/settings" className={linkStyle("/settings")}>Settings</Link>
        <Link href="/api/auth/signout">Logout</Link>
      </div>
      <MobileNav />
    </nav>
  );
}
