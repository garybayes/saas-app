"use client";

import { signOut } from "next-auth/react";

export default function LogoutButton() {
  return (
    <button
      onClick={() =>
        signOut({
          callbackUrl: "/login", // ✅ ensures user is redirected here
        })
      }
      className="btn-muted text-sm mt-2"
    >
      Log Out
    </button>
  );
}
