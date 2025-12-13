import { cn } from "@/lib/utils";
import { HTMLAttributes, forwardRef } from "react";

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {}

export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "animate-pulse bg-[var(--muted)] rounded-md",
          className
        )}
        {...props}
      />
    );
  }
);

Skeleton.displayName = "Skeleton";
