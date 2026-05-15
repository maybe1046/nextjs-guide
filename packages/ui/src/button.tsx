"use client";

import { type ButtonHTMLAttributes, type ReactNode } from "react";

type ButtonVariant = "primary" | "secondary";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariant;
}

/**
 * Shared button. Marked `"use client"` because it carries interactivity —
 * a Server Component can still render it; the boundary stops here.
 */
export function Button({ children, variant = "primary", type = "button", ...props }: ButtonProps) {
  return (
    <button type={type} data-variant={variant} className="repo-ui-button" {...props}>
      {children}
    </button>
  );
}
