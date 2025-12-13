import { cn } from "@/lib/utils";
import { HTMLAttributes, forwardRef } from "react";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "secondary" | "success" | "warning" | "destructive";
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = "default", children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
          variant === "default" && "bg-[var(--primary)] text-[var(--primary-foreground)]",
          variant === "secondary" && "bg-[var(--secondary)] text-[var(--secondary-foreground)]",
          variant === "success" && "bg-[var(--success)] text-white",
          variant === "warning" && "bg-[var(--warning)] text-white",
          variant === "destructive" && "bg-[var(--destructive)] text-[var(--destructive-foreground)]",
          className
        )}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = "Badge";
