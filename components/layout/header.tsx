"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui";
import Link from "next/link";
import { useState } from "react";

interface HeaderProps {
  className?: string;
}

export function Header({ className }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header
      className={cn(
        "hidden md:block w-full border-b border-[var(--border)] bg-[var(--background)] sticky top-0 z-40",
        className
      )}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[var(--primary)] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">HW</span>
            </div>
            <span className="text-xl font-bold text-[var(--foreground)]">
              Hulpwijzer
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/regelingen"
              className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
            >
              Regelingen
            </Link>
            <Link
              href="/hoe-werkt-het"
              className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
            >
              Hoe werkt het?
            </Link>
            <Link
              href="/faq"
              className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
            >
              FAQ
            </Link>
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost">Inloggen</Button>
            </Link>
            <Link href="/intake">
              <Button>Start intake</Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-[var(--muted)]"
          >
            {mobileMenuOpen ? (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-[var(--border)]">
            <div className="flex flex-col gap-4">
              <Link
                href="/regelingen"
                className="text-[var(--foreground)] hover:text-[var(--primary)] transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Regelingen
              </Link>
              <Link
                href="/hoe-werkt-het"
                className="text-[var(--foreground)] hover:text-[var(--primary)] transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Hoe werkt het?
              </Link>
              <Link
                href="/faq"
                className="text-[var(--foreground)] hover:text-[var(--primary)] transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                FAQ
              </Link>
              <hr className="border-[var(--border)]" />
              <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="outline" className="w-full">
                  Inloggen
                </Button>
              </Link>
              <Link href="/intake" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full">Start intake</Button>
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
