"use client";

import { cn } from "@/lib/utils";
import { TextareaHTMLAttributes, forwardRef } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, id, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={id}
            className="block text-sm font-medium mb-1.5 text-[var(--foreground)]"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={id}
          className={cn(
            "w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)]",
            "text-[var(--foreground)] placeholder:text-[var(--muted-foreground)]",
            "focus:outline-none focus:ring-2 focus:ring-[var(--ring)] focus:border-transparent",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "min-h-[100px] resize-y",
            error && "border-[var(--destructive)] focus:ring-[var(--destructive)]",
            className
          )}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-[var(--destructive)]">{error}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
