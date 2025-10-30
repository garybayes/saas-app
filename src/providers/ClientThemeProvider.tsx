"use client";

import { ThemeProvider } from "@/components/ThemeProvider";

export default function ClientThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ThemeProvider>{children}</ThemeProvider>;
}
