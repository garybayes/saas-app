"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useTheme } from "@/components/ThemeProvider";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export default function NavBar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (!session?.user) return null;

  const navLinks = [
    { href: "/connections", label: "Connections" },
    { href: "/settings", label: "Settings" },
  ];

  const handleLogout = () => {
    setTheme("light");
    signOut({ callbackUrl: "/login" });
  };

  return (
    <nav className="bg-card border-b border-border text-foreground flex justify-between items-center px-6 py-3 shadow-sm relative z-10">
      <div className="flex items-center gap-4">
        <button
          className="md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle Menu"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
        <span className="font-semibold text-lg">MindForge</span>
      </div>

      <div className="hidden md:flex gap-6 items-center">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`hover:text-primary ${
              pathname === link.href ? "text-primary font-medium" : ""
            }`}
          >
            {link.label}
          </Link>
        ))}
        <div className="text-sm opacity-75">
          {session.user.email} · {theme}
        </div>
        <button
          onClick={handleLogout}
          className="btn-muted text-sm"
        >
          Logout
        </button>
      </div>

      {mobileOpen && (
        <div className="absolute top-14 left-0 w-full bg-card border-t border-border flex flex-col items-start p-4 md:hidden">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={`py-2 ${
                pathname === link.href ? "text-primary font-medium" : ""
              }`}
            >
              {link.label}
            </Link>
          ))}
          <button
            onClick={handleLogout}
            className="mt-3 btn-muted w-full text-left"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}
