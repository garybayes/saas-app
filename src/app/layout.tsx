import "./globals.css";
import { ReactNode } from "react";
import NavBar from "@/components/NavBar";
import ClientLayout from "@/components/ClientLayout";
import { geistSans, geistMono } from "@/lib/fonts";

export default function RootLayout({ children }: { children: ReactNode }) {
  console.log("🧩 layout.tsx running on:", typeof window !== "undefined" ? "client" : "server");
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans bg-background text-foreground`}
      >
        <ClientLayout>
          <NavBar />
          <main className="p-6 min-h-screen transition-colors">{children}</main>
        </ClientLayout>
      </body>
    </html>
  );
}
