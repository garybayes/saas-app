// src/app/layout.tsx
import "./globals.css";
import { ReactNode } from "react";
import { geistSans, geistMono } from "@/lib/fonts";
import ClientLayout from "@/components/ClientLayout";
import NavBar from "@/components/NavBar";

export const metadata = {
  title: "MindForge SaaS",
  description: "Workflow Hub + AI Consolidation Engine for remote professionals",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  console.log("🧩 layout.tsx running on:", typeof window !== "undefined" ? "client" : "server");

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ClientLayout>
          <NavBar />
          <main className="pt-16 min-h-screen bg-background text-foreground transition-colors duration-300">
            {children}
          </main>
        </ClientLayout>
      </body>
    </html>
  );
}
