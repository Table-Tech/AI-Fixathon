import { Button, Card, CardContent } from "@/components/ui";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col pb-20 md:pb-0">
      {/* Simple header for desktop only */}
      <header className="hidden md:block w-full border-b border-[var(--border)] bg-[var(--background)]">
        <nav className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[var(--primary)] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">HW</span>
            </div>
            <span className="text-xl font-bold">Hulpwijzer</span>
          </Link>
          <Link href="/login">
            <Button variant="ghost" size="sm">Inloggen</Button>
          </Link>
        </nav>
      </header>

      <main className="flex-1 flex flex-col">
        {/* Hero - Simple and Clear */}
        <section className="flex-1 flex flex-col justify-center px-6 py-12 md:py-20">
          <div className="max-w-2xl mx-auto text-center">
            {/* Logo for mobile */}
            <div className="md:hidden mb-8">
              <div className="w-16 h-16 bg-[var(--primary)] rounded-2xl flex items-center justify-center mx-auto">
                <span className="text-white font-bold text-2xl">HW</span>
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
              Hulp nodig met{" "}
              <span className="text-[var(--primary)]">toeslagen</span>?
            </h1>

            <p className="mt-6 text-lg md:text-xl text-[var(--muted-foreground)]">
              Ik help je ontdekken waar je recht op hebt.
              <br className="hidden sm:block" />
              Gratis en eenvoudig.
            </p>

            {/* Main CTA */}
            <div className="mt-10">
              <Link href="/assistent">
                <Button size="lg" className="w-full sm:w-auto text-lg px-8 py-6 h-auto">
                  Praat met de Assistent
                </Button>
              </Link>
            </div>

            {/* Trust badges */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-[var(--muted-foreground)]">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-[var(--success)]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>100% gratis</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-[var(--success)]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Veilig & privé</span>
              </div>
            </div>
          </div>
        </section>

        {/* Simple info card */}
        <section className="px-6 pb-8 md:pb-16">
          <div className="max-w-2xl mx-auto">
            <Link href="/hoe-werkt-het">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[var(--primary)]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-[var(--primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h2 className="font-semibold text-lg">Hoe werkt het?</h2>
                      <p className="text-sm text-[var(--muted-foreground)]">
                        Lees hoe Hulpwijzer je kan helpen
                      </p>
                    </div>
                    <svg className="w-5 h-5 text-[var(--muted-foreground)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
