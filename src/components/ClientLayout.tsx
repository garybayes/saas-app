"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "@/components/ThemeProvider";
import NavBar from "@/components/NavBar";
import { ReactNode } from "react";

export default function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider>
        <NavBar />
        <main className="pt-16 min-h-screen bg-background text-foreground transition-colors duration-300">
          {children}
        </main>
      </ThemeProvider>
    </SessionProvider>
  );
}
