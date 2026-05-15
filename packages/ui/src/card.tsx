import { type ReactNode } from "react";

interface CardProps {
  title: string;
  children: ReactNode;
}

/**
 * Presentational card. No `"use client"` directive — it is a Server Component
 * by default and ships zero JavaScript.
 */
export function Card({ title, children }: CardProps) {
  return (
    <section className="repo-ui-card">
      <h2 className="repo-ui-card__title">{title}</h2>
      <div className="repo-ui-card__body">{children}</div>
    </section>
  );
}
