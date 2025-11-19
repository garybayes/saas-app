import "./globals.css";
import { ReactNode } from "react";
import { geistSans, geistMono } from "@/lib/fonts";
import ClientLayout from "@/components/ClientLayout";
import NavBar from "@/components/NavBar";
import { themePreloadScript } from "./theme-preload";
import { cookies } from "next/headers";

export const metadata = {
  title: "MindForge SaaS",
  description: "Workflow Hub + AI Consolidation Engine",
};

// ⬅ Make this async so we can await cookies()
export default async function RootLayout({ children }: { children: ReactNode }) {
  const cookieStore = await cookies();          // ⬅ FIX
  const theme = cookieStore.get("theme")?.value === "dark" ? "dark" : "light";

  return (
    <html lang="en" className={theme === "dark" ? "dark" : ""} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: themePreloadScript(theme),
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
