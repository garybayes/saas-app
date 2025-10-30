"use client";

import { ReactNode } from "react";
import { ThemeProvider } from "@/components/ThemeProvider";
import { SessionProvider } from "next-auth/react";
import NavBar from "@/components/NavBar";

export default function ClientLayout({ children }: { children: ReactNode }) {
  console.log("✅ ClientLayout running on:", typeof window !== "undefined" ? "client" : "server");

  return (
    <SessionProvider>
      <ThemeProvider>
        <NavBar />
        {children}
      </ThemeProvider>
    </SessionProvider>
  );
}
