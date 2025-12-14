"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button, Card, CardContent, Badge } from "@/components/ui";
import { Header } from "@/components/layout";

interface MatchedRegeling {
  id: string;
  slug: string;
  title: string;
  category: string;
  estimated_amount: string;
  short_description: string;
  provider: string;
  match_score: number;
  match_reasons: string[];
}

export default function ResultatenPage() {
  const [matches, setMatches] = useState<MatchedRegeling[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Read matches from sessionStorage
    const storedMatches = sessionStorage.getItem("check_matches");
    if (storedMatches) {
      try {
        setMatches(JSON.parse(storedMatches));
      } catch {
        setMatches([]);
      }
    }
    setIsLoading(false);
  }, []);

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      toeslagen: "Toeslag",
      uitkeringen: "Uitkering",
      kindregelingen: "Kindregeling",
      wonen: "Wonen",
    };
    return labels[category] || category;
  };

  const getCategoryColor = (category: string): "default" | "secondary" | "success" | "warning" => {
    const colors: Record<string, "default" | "secondary" | "success" | "warning"> = {
      toeslagen: "default",
      uitkeringen: "secondary",
      kindregelingen: "warning",
      wonen: "success",
    };
    return colors[category] || "default";
  };

  const getMatchLabel = (score: number) => {
    if (score >= 90) return { text: "Zeer waarschijnlijk", color: "bg-green-500" };
    if (score >= 70) return { text: "Waarschijnlijk", color: "bg-green-400" };
    if (score >= 50) return { text: "Mogelijk", color: "bg-yellow-500" };
    return { text: "Bekijk voorwaarden", color: "bg-gray-400" };
  };

  const totalPotentialAmount = matches.reduce((acc, m) => {
    const amount = m.estimated_amount?.match(/€([\d.]+)/);
    if (amount) {
      return acc + parseInt(amount[1].replace(".", ""));
    }
    return acc;
  }, 0);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--primary)]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[var(--background)] to-[var(--muted)]">
      <Header />

      <main className="flex-1 px-4 py-8 md:py-12">
        <div className="max-w-4xl mx-auto">
          {/* Back link */}
          <Link
            href="/check"
            className="inline-flex items-center gap-2 text-[var(--muted-foreground)] hover:text-[var(--foreground)] mb-6 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Opnieuw checken
          </Link>

          {matches.length > 0 ? (
            <>
              {/* Success Header */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-4">
                  <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h1 className="text-2xl md:text-3xl font-bold mb-2">
                  {matches.length} regeling{matches.length > 1 ? "en" : ""} gevonden!
                </h1>
                <p className="text-[var(--muted-foreground)]">
                  Op basis van jouw situatie kom je mogelijk in aanmerking voor deze regelingen
                </p>
              </div>

              {/* Summary Card */}
              <Card className="mb-8 border-2 border-[var(--primary)]/20 bg-[var(--primary)]/5">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <p className="text-sm text-[var(--muted-foreground)]">Potentieel voordeel</p>
                      <p className="text-3xl font-bold text-[var(--primary)]">
                        {totalPotentialAmount > 0 ? `€${totalPotentialAmount.toLocaleString("nl-NL")}+` : "Afhankelijk van situatie"}
                      </p>
                      <p className="text-sm text-[var(--muted-foreground)]">per jaar (schatting)</p>
                    </div>
                    <div className="flex gap-2">
                      <Link href="/login">
                        <Button>
                          Account maken
                          <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Matches List */}
              <div className="space-y-4">
                {matches.map((match, index) => {
                  const matchLabel = getMatchLabel(match.match_score);
                  return (
                    <Card key={match.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                      <CardContent className="p-0">
                        <div className="flex flex-col md:flex-row">
                          {/* Match indicator */}
                          <div className={`${matchLabel.color} p-4 md:p-6 md:w-32 flex flex-col items-center justify-center text-white`}>
                            <span className="text-2xl md:text-3xl font-bold">{match.match_score}%</span>
                            <span className="text-xs text-center mt-1 opacity-90">{matchLabel.text}</span>
                          </div>

                          {/* Content */}
                          <div className="flex-1 p-4 md:p-6">
                            <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                              <div>
                                <Badge variant={getCategoryColor(match.category)}>
                                  {getCategoryLabel(match.category)}
                                </Badge>
                                <span className="text-xs text-[var(--muted-foreground)] ml-2">
                                  #{index + 1}
                                </span>
                              </div>
                              {match.estimated_amount && (
                                <span className="text-[var(--primary)] font-semibold text-sm">
                                  {match.estimated_amount}
                                </span>
                              )}
                            </div>

                            <h3 className="text-lg font-semibold mb-2">{match.title}</h3>
                            <p className="text-[var(--muted-foreground)] text-sm mb-3">
                              {match.short_description}
                            </p>

                            {/* Match reasons */}
                            <div className="flex flex-wrap gap-2 mb-4">
                              {match.match_reasons.map((reason, i) => (
                                <span
                                  key={i}
                                  className="inline-flex items-center gap-1 text-xs bg-green-50 text-green-700 px-2 py-1 rounded dark:bg-green-900/30 dark:text-green-400"
                                >
                                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                  {reason}
                                </span>
                              ))}
                            </div>

                            <div className="flex items-center justify-between">
                              <span className="text-xs text-[var(--muted-foreground)]">
                                Via {match.provider}
                              </span>
                              <Link href={`/regelingen/${match.slug}`}>
                                <Button variant="outline" size="sm">
                                  Meer info
                                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                  </svg>
                                </Button>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Next Steps */}
              <Card className="mt-8">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-4">Wat nu?</h3>
                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--primary)] text-white flex items-center justify-center text-sm font-medium">
                        1
                      </div>
                      <div>
                        <p className="font-medium">Maak een gratis account</p>
                        <p className="text-sm text-[var(--muted-foreground)]">
                          Sla je resultaten op en krijg gepersonaliseerde hulp
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--muted)] text-[var(--muted-foreground)] flex items-center justify-center text-sm font-medium">
                        2
                      </div>
                      <div>
                        <p className="font-medium">Bekijk de voorwaarden per regeling</p>
                        <p className="text-sm text-[var(--muted-foreground)]">
                          Check of je aan alle eisen voldoet
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--muted)] text-[var(--muted-foreground)] flex items-center justify-center text-sm font-medium">
                        3
                      </div>
                      <div>
                        <p className="font-medium">Vraag aan met hulp van onze assistent</p>
                        <p className="text-sm text-[var(--muted-foreground)]">
                          We helpen je stap voor stap door het aanvraagproces
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-[var(--border)] flex flex-col sm:flex-row gap-3">
                    <Link href="/login" className="flex-1">
                      <Button className="w-full">
                        Gratis account maken
                      </Button>
                    </Link>
                    <Link href="/regelingen" className="flex-1">
                      <Button variant="outline" className="w-full">
                        Alle regelingen bekijken
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            /* No matches state */
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[var(--muted)] mb-4">
                <svg className="w-10 h-10 text-[var(--muted-foreground)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold mb-2">Geen directe matches gevonden</h1>
              <p className="text-[var(--muted-foreground)] mb-6 max-w-md mx-auto">
                Op basis van je huidige gegevens komen er geen regelingen direct naar voren.
                Maar er zijn mogelijk nog andere opties!
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/check">
                  <Button>Opnieuw proberen</Button>
                </Link>
                <Link href="/regelingen">
                  <Button variant="outline">Alle regelingen bekijken</Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
