"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui";

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
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[var(--primary)] rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">HW</span>
          </div>
          <span className="text-xl font-bold text-[var(--foreground)] hidden sm:inline">
            Hulpwijzer
          </span>
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <button className="p-2 rounded-lg hover:bg-[var(--muted)] relative">
            <svg
              className="w-5 h-5 text-[var(--muted-foreground)]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
            <span className="absolute top-1 right-1 w-2 h-2 bg-[var(--destructive)] rounded-full"></span>
          </button>

          {/* User menu */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium">Demo User</p>
              <p className="text-xs text-[var(--muted-foreground)]">Beheerder</p>
            </div>
            <Avatar fallback="DU" size="md" />
          </div>

          {/* Logout button */}
          <button
            onClick={handleLogout}
            className="p-2 rounded-lg hover:bg-[var(--muted)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
            title="Uitloggen"
          >
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
      </div>
    </header>
  );
}
