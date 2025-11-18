"use client";

import React from "react";

interface LayoutContainerProps {
  title?: string;
  children: React.ReactNode;
}

export default function LayoutContainer({ title, children }: LayoutContainerProps) {
  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center px-4 py-12 transition-colors duration-300">
      <div className="w-full max-w-2xl card">
        {title && <h1 className="text-2xl font-semibold mb-6">{title}</h1>}
        {children}
      </div>
    </main>
  );
}
