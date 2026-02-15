"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "accent" | "ghost" | "link";
  size?: "default" | "sm" | "lg";
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", asChild, ...props }, ref) => {
    const base =
      "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0";
    const variants = {
      default:
        "bg-[var(--blue-deep)] text-[var(--off-white)] hover:bg-[var(--blue-mid)]",
      outline:
        "border border-[var(--border)] bg-transparent hover:bg-[var(--muted)]",
      accent:
        "bg-[var(--gold)] text-[var(--blue-deep)] hover:bg-[var(--gold-light)]",
      ghost: "hover:bg-[var(--muted)]",
      link: "text-[var(--blue-deep)] underline-offset-4 hover:underline",
    };
    const sizes = {
      default: "h-10 px-4 py-2",
      sm: "h-9 rounded-md px-3 text-sm",
      lg: "h-12 rounded-md px-8 text-base",
    };
    const compClassName = cn(base, variants[variant], sizes[size], className);
    if (asChild && React.isValidElement(props.children)) {
      return React.cloneElement(props.children as React.ReactElement<{ className?: string }>, {
        className: cn(compClassName, (props.children as React.ReactElement<{ className?: string }>).props?.className),
      });
    }
    return (
      <button
        ref={ref}
        className={compClassName}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
