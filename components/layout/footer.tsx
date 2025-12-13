import Link from "next/link";
import { cn } from "@/lib/utils";

interface FooterProps {
  className?: string;
}

export function Footer({ className }: FooterProps) {
  return (
    <footer
      className={cn(
        "hidden md:block w-full border-t border-[var(--border)] bg-[var(--muted)]",
        className
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-[var(--primary)] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">HW</span>
              </div>
              <span className="text-xl font-bold">Hulpwijzer</span>
            </div>
            <p className="text-[var(--muted-foreground)] text-sm">
              We helpen alleenstaande moeders bij het vinden en aanvragen van
              financiële ondersteuning.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold mb-4">Navigatie</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/regelingen"
                  className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] text-sm transition-colors"
                >
                  Regelingen
                </Link>
              </li>
              <li>
                <Link
                  href="/hoe-werkt-het"
                  className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] text-sm transition-colors"
                >
                  Hoe werkt het?
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] text-sm transition-colors"
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold mb-4">Juridisch</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/privacy"
                  className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] text-sm transition-colors"
                >
                  Privacybeleid
                </Link>
              </li>
              <li>
                <Link
                  href="/voorwaarden"
                  className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] text-sm transition-colors"
                >
                  Algemene voorwaarden
                </Link>
              </li>
              <li>
                <Link
                  href="/cookies"
                  className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] text-sm transition-colors"
                >
                  Cookiebeleid
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">Contact</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/over-ons"
                  className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] text-sm transition-colors"
                >
                  Over ons
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] text-sm transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-[var(--border)]">
          <p className="text-center text-[var(--muted-foreground)] text-sm">
            © {new Date().getFullYear()} Hulpwijzer. Alle rechten voorbehouden.
          </p>
        </div>
      </div>
    </footer>
  );
}
