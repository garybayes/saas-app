"use client";

import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ReactNode } from "react";

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className="antialiased">
      <body className="font-sans transition-colors duration-300">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
