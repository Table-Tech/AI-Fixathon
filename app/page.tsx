import { Button } from "@/components/ui";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col pb-20 md:pb-0">
      {/* Simple header for desktop only */}
      <header className="hidden md:block w-full border-b border-[var(--border)] bg-[var(--background)]">
        <nav className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/care.png"
              alt="Hulpwijzer"
              width={32}
              height={32}
              style={{ filter: 'brightness(0) saturate(100%) invert(37%) sepia(93%) saturate(1352%) hue-rotate(213deg) brightness(93%) contrast(91%)' }}
            />
            <span className="text-xl font-bold">Hulpwijzer</span>
          </Link>
          <Link href="/login">
            <Button variant="ghost" size="sm">Inloggen</Button>
          </Link>
        </nav>
      </header>

      <main className="flex-1 flex flex-col px-6 py-8 md:py-12">
        <div className="max-w-2xl mx-auto w-full flex-1 flex flex-col justify-between">
          {/* Hero sectie */}
          <div className="flex-1 flex flex-col justify-center items-center">
            {/* Care illustration */}
            <div className="mb-6 md:mb-8">
              <div className="relative w-28 h-28 md:w-36 md:h-36">
                <Image
                  src="/care.png"
                  alt="Moeder met kind"
                  fill
                  className="object-contain"
                  style={{ filter: 'brightness(0) saturate(100%) invert(37%) sepia(93%) saturate(1352%) hue-rotate(213deg) brightness(93%) contrast(91%)' }}
                  priority
                />
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight text-center">
              Hulp nodig met{" "}
              <span className="text-[var(--primary)]">toeslagen</span>?
            </h1>

            <p className="mt-4 text-center text-[var(--muted-foreground)] max-w-md">
              Wij helpen alleenstaande moeders door het gehele proces.
            </p>
          </div>

          {/* Hoe werkt het - stappen */}
          <div className="pt-8">
            <h2 className="text-xl font-bold mb-4 text-center">Hoe werkt het?</h2>
            <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-[var(--primary)] rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                1
              </div>
              <div>
                <h3 className="font-semibold text-lg">Vertel over jezelf</h3>
                <p className="text-[var(--muted-foreground)]">
                  Beantwoord een paar simpele vragen over je situatie.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-[var(--primary)] rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                2
              </div>
              <div>
                <h3 className="font-semibold text-lg">Bekijk je matches</h3>
                <p className="text-[var(--muted-foreground)]">
                  Wij laten zien welke toeslagen bij jou passen.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-[var(--primary)] rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                3
              </div>
              <div>
                <h3 className="font-semibold text-lg">Vraag aan</h3>
                <p className="text-[var(--muted-foreground)]">
                  Wij helpen je met de aanvraag.
                </p>
              </div>
            </div>
          </div>

            {/* Main CTA */}
            <div className="mt-8 text-center">
              <Link href="/assistent">
                <Button size="lg" className="w-full sm:w-auto text-lg px-8 py-6 h-auto">
                  Praat met de Assistent
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
