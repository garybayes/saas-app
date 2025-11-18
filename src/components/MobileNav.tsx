"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { signOut } from "next-auth/react";

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const linkStyle = (href: string) =>
    pathname === href ? "text-primary font-semibold" : "text-foreground";

  return (
    <div className="md:hidden">
      <button onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <X /> : <Menu />}
      </button>
      {isOpen && (
        <div className="absolute top-14 left-0 right-0 bg-muted border-b z-40">
          <div className="flex flex-col gap-4 p-4">
            <Link
              href="/dashboard"
              className={linkStyle("/dashboard")}
              onClick={() => setIsOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              href="/connections"
              className={linkStyle("/connections")}
              onClick={() => setIsOpen(false)}
            >
              Connections
            </Link>
            <Link
              href="/settings"
              className={linkStyle("/settings")}
              onClick={() => setIsOpen(false)}
            >
              Settings
            </Link>
            <button
              className="text-foreground text-left"
              onClick={() => {
                setIsOpen(false);
                signOut({ callbackUrl: "/login" });
              }}
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
