"use client";

import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface DashboardHeaderProps {
  className?: string;
}

export function DashboardHeader({ className }: DashboardHeaderProps) {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("dashboard_auth");
    router.push("/dashboard-login");
  };

  return (
    <header
      className={cn(
        "w-full border-b border-[var(--border)] bg-[var(--background)] sticky top-0 z-40",
        className
      )}
    >
      <div className="flex items-center justify-between h-16 px-4 sm:px-6">
        {/* Welcome text */}
        <h1 className="text-xl font-bold">Welkom</h1>

        {/* Logout button */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[var(--muted)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
          title="Uitloggen"
        >
          <span className="text-sm hidden sm:inline">Uitloggen</span>
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
        </button>
      </div>
    </header>
  );
}
