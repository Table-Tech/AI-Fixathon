"use client";

import { BottomNav } from "./bottom-nav";
import { cn } from "@/lib/utils";

interface MobileLayoutProps {
  children: React.ReactNode;
  className?: string;
  hideNav?: boolean;
}

export function MobileLayout({ children, className, hideNav = false }: MobileLayoutProps) {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Main content area - scrollable */}
      <main
        className={cn(
          "min-h-screen pb-20", // pb-20 for bottom nav space
          className
        )}
      >
        {children}
      </main>

      {/* Fixed bottom navigation */}
      {!hideNav && <BottomNav />}
    </div>
  );
}
