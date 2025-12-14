"use client";

import { Header, Footer } from "@/components/layout";
import { Button, Card, CardContent, Input, Badge, Skeleton } from "@/components/ui";
import { useRegelingen, CATEGORIES } from "@/hooks/use-regelingen";
import Link from "next/link";
import { useState } from "react";

export default function RegelingenPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showInfo, setShowInfo] = useState(false);

  const { regelingen: filteredRegelingen, isLoading, error } = useRegelingen({
    category: selectedCategory,
    searchQuery,
  });

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "toeslagen":
        return "default";
      case "uitkeringen":
        return "secondary";
      case "subsidies":
        return "success";
      case "kindregelingen":
        return "warning";
      case "wonen":
        return "default";
      default:
        return "secondary";
    }
  };

  return (
    <div className="min-h-screen flex flex-col pb-20 md:pb-0">
      <Header />

      <main className="flex-1">
        {/* Snelle Check CTA Banner */}
        <section className="bg-gradient-to-r from-[var(--primary)] to-[var(--primary)]/80 text-white">
          <div className="max-w-7xl mx-auto px-4 py-6 md:py-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="hidden md:flex items-center justify-center w-14 h-14 rounded-full bg-white/20 flex-shrink-0">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl md:text-2xl font-bold mb-1">
                    Ontdek waar jij recht op hebt
                  </h2>
                  <p className="text-white/90 text-sm md:text-base">
                    Beantwoord 5 simpele vragen en zie direct welke regelingen bij jou passen.
                    Volledig anoniem en binnen 2 minuten klaar.
                  </p>
                </div>
              </div>
              <div className="flex-shrink-0">
                <Link href="/check">
                  <Button
                    size="lg"
                    className="w-full md:w-auto bg-white text-[var(--primary)] hover:bg-white/90 font-semibold shadow-lg"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Start de Snelle Check
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Hero */}
        <section className="pt-6 pb-4 md:pt-8 md:pb-6 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-center gap-2">
              <h1 className="text-2xl md:text-3xl font-bold">
                Alle regelingen
              </h1>
              <button
                onClick={() => setShowInfo(!showInfo)}
                className="w-6 h-6 rounded-full bg-[var(--primary)] flex items-center justify-center text-white hover:opacity-80 transition-opacity"
              >
                <span className="text-sm font-medium">?</span>
              </button>
            </div>
            {showInfo && (
              <p className="mt-3 text-[var(--muted-foreground)] text-sm">
                Bekijk alle beschikbare toeslagen, uitkeringen en regelingen.
                Gebruik de zoekfunctie of filter op categorie.
              </p>
            )}
          </div>
        </section>

        {/* Search & Filter */}
        <section className="py-8 px-4 border-b border-[var(--border)]">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Zoek op naam of beschrijving..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
                {CATEGORIES.map((category) => (
                  <Button
                    key={category.value}
                    variant={selectedCategory === category.value ? "primary" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category.value)}
                    className="whitespace-nowrap"
                  >
                    {category.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Results */}
        <section className="py-8 md:py-12 px-4">
          <div className="max-w-7xl mx-auto">
            {error ? (
              <div className="text-center py-12">
                <p className="text-red-500 mb-4">
                  Er ging iets mis bij het laden van de regelingen.
                </p>
                <Button variant="outline" onClick={() => window.location.reload()}>
                  Probeer opnieuw
                </Button>
              </div>
            ) : isLoading ? (
              <>
                <Skeleton className="h-5 w-40 mb-6" />
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <Card key={i} className="h-full">
                      <CardContent className="pt-6">
                        <Skeleton className="h-6 w-24 mb-3" />
                        <Skeleton className="h-6 w-full mb-2" />
                        <Skeleton className="h-4 w-full mb-1" />
                        <Skeleton className="h-4 w-3/4 mb-4" />
                        <Skeleton className="h-4 w-32" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </>
            ) : (
              <>
                <p className="text-[var(--muted-foreground)] mb-6">
                  {filteredRegelingen.length} regelingen gevonden
                </p>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredRegelingen.map((regeling) => (
                    <Link key={regeling.id} href={`/regelingen/${regeling.slug}`}>
                      <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                        <CardContent className="pt-6">
                          <div className="flex items-start justify-between gap-2 mb-3">
                            <Badge variant={getCategoryColor(regeling.category) as "default" | "secondary" | "success" | "warning"}>
                              {CATEGORIES.find((c) => c.value === regeling.category)?.label}
                            </Badge>
                          </div>
                          <h3 className="text-lg font-semibold mb-2">
                            {regeling.name}
                          </h3>
                          <p className="text-[var(--muted-foreground)] text-sm mb-4 line-clamp-2">
                            {regeling.shortDescription}
                          </p>
                          {regeling.maxBedrag && (
                            <p className="text-[var(--primary)] font-medium text-sm">
                              {regeling.maxBedrag}
                            </p>
                          )}
                          <p className="text-xs text-[var(--muted-foreground)] mt-3">
                            {regeling.provider}
                          </p>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>

                {filteredRegelingen.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-[var(--muted-foreground)]">
                      Geen regelingen gevonden. Probeer een andere zoekterm of categorie.
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </section>

        {/* CTA */}
        <section className="py-12 md:py-16 px-4 bg-[var(--muted)]/30">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold">
              Niet zeker waar je recht op hebt?
            </h2>
            <p className="mt-4 text-[var(--muted-foreground)]">
              Doe onze gratis snelle check en ontdek binnen 2 minuten welke regelingen bij jouw situatie passen.
            </p>
            <div className="mt-6">
              <Link href="/check">
                <Button size="lg">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Start de Snelle Check
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
