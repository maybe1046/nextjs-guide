import { type ReactNode } from "react";
import "@repo/ui/styles.css";
import "./globals.css";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Web — Turborepo Starter",
  description: "Next.js App Router app inside a Turborepo monorepo.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
