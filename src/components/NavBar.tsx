"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { useTheme } from "./ThemeProvider";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function NavBar() {
  const { data: session } = useSession();
  const { theme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Determine if on Settings to hide toggle there
  const isSettingsPage = pathname?.includes("/settings");

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/login");
  };

  if (!session?.user) return null;

  return (
    <nav
      className={`flex items-center justify-between border-b px-6 py-3 shadow-sm ${
        theme === "dark"
          ? "bg-gray-900 border-gray-700 text-gray-100"
          : "bg-white border-gray-200 text-gray-900"
      }`}
    >
      {/* Left: Brand or Logo */}
      <div className="flex items-center gap-2 font-semibold text-lg">
        <button
          className="md:hidden p-1 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
        <Link href="/connections" className="hover:opacity-80">
          MindForge
        </Link>
      </div>

      {/* Center: User Info */}
      <div className="hidden md:flex flex-col items-center text-sm font-medium">
        <span
          className={`${
            theme === "dark" ? "text-gray-100" : "text-gray-800"
          }`}
        >
          {session.user.email}
        </span>
        <span
          className={`text-xs ${
            theme === "dark" ? "text-gray-400" : "text-gray-500"
          }`}
        >
          Theme: {session.user.theme}
        </span>
      </div>

{/* Right: Navigation */}
<div className="flex items-center gap-3">
  {isSettingsPage ? (
    <Link
      href="/connections"
      className={`rounded-lg px-3 py-1 text-sm font-semibold transition ${
        theme === "dark"
          ? "bg-gray-800 hover:bg-gray-700 text-gray-100"
          : "bg-gray-100 hover:bg-gray-200 text-gray-900"
      }`}
    >
      Connections
    </Link>
  ) : (
    <Link
      href="/settings"
      className={`rounded-lg px-3 py-1 text-sm font-semibold transition ${
        theme === "dark"
          ? "bg-gray-800 hover:bg-gray-700 text-gray-100"
          : "bg-gray-100 hover:bg-gray-200 text-gray-900"
      }`}
    >
      Settings
    </Link>
  )}

  <button
    onClick={handleLogout}
    className={`rounded-lg px-3 py-1 text-sm font-semibold transition ${
      theme === "dark"
        ? "bg-red-600 hover:bg-red-500 text-white"
        : "bg-red-500 hover:bg-red-600 text-white"
    }`}
  >
    Logout
  </button>
</div>
    </nav>
  );
}
