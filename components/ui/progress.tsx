import { cn } from "@/lib/utils";
import { HTMLAttributes, forwardRef } from "react";

interface ProgressProps extends HTMLAttributes<HTMLDivElement> {
  value?: number;
  max?: number;
}

export const Progress = forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value = 0, max = 100, ...props }, ref) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

    return (
      <div
        ref={ref}
        className={cn(
          "w-full h-2 bg-[var(--muted)] rounded-full overflow-hidden",
          className
        )}
        {...props}
      >
        <div
          className="h-full bg-[var(--primary)] transition-all duration-300 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    );
  }
);

Progress.displayName = "Progress";
