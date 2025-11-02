"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ReactNode } from "react";

export default function ClientLayout({ children }: { children: ReactNode }) {
  console.log("✅ ClientLayout running on:", typeof window !== "undefined" ? "client" : "server");
  return (
    <SessionProvider>
      <ThemeProvider>{children}</ThemeProvider>
    </SessionProvider>
  );
}
