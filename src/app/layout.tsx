import "./globals.css";
import { ReactNode } from "react";
import ClientLayout from "@/components/ClientLayout";

export const metadata = {
  title: "SaaS-App",
  description: "Unified AI workspace",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  console.log("🧩 layout.tsx running on:", typeof window !== "undefined" ? "client" : "server");

  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        {/* 👇 Entire body subtree now runs client-side */}
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
