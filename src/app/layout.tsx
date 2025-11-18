import "./globals.css";
import { ReactNode } from "react";
import { geistSans, geistMono } from "@/lib/fonts";
import ClientLayout from "@/components/ClientLayout";
import NavBar from "@/components/NavBar";
import { themePreloadScript } from "./theme-preload";

export const metadata = {
  title: "MindForge SaaS",
  description: "Workflow Hub + AI Consolidation Engine",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: themePreloadScript(),
          }}
        />
      </head>

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
