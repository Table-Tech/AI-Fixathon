import { cn } from "@/lib/utils";
import { HTMLAttributes, forwardRef } from "react";

interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: "sm" | "md" | "lg";
}

export const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, src, alt, fallback, size = "md", ...props }, ref) => {
    const sizeClasses = {
      sm: "w-8 h-8 text-xs",
      md: "w-10 h-10 text-sm",
      lg: "w-14 h-14 text-base",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "relative rounded-full overflow-hidden bg-[var(--muted)] flex items-center justify-center",
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {src ? (
          <img
            src={src}
            alt={alt || "Avatar"}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="font-medium text-[var(--muted-foreground)]">
            {fallback || "?"}
          </span>
        )}
      </div>
    );
  }
);

Avatar.displayName = "Avatar";
