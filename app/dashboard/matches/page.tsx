"use client";

import { Button, Card, CardContent, Badge, Progress } from "@/components/ui";
import { MOCK_MATCHES } from "@/lib/mock-data";
import Link from "next/link";
import { useState } from "react";

export default function MatchesPage() {
  const [filter, setFilter] = useState<"all" | "potentieel" | "in_behandeling" | "goedgekeurd">("all");

  const filteredMatches = MOCK_MATCHES.filter(
    (match) => filter === "all" || match.status === filter
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "potentieel":
        return "secondary";
      case "in_behandeling":
        return "warning";
      case "goedgekeurd":
        return "success";
      case "afgewezen":
        return "destructive";
      default:
        return "secondary";
    }
  };

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold">Jouw matches</h1>
          <p className="mt-2 text-[var(--muted-foreground)]">
            Regelingen die mogelijk bij jouw situatie passen.
          </p>
        </div>

        {/* Filter */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          <Button
            variant={filter === "all" ? "primary" : "outline"}
            size="sm"
            onClick={() => setFilter("all")}
          >
            Alle ({MOCK_MATCHES.length})
          </Button>
          <Button
            variant={filter === "potentieel" ? "primary" : "outline"}
            size="sm"
            onClick={() => setFilter("potentieel")}
          >
            Potentieel
          </Button>
          <Button
            variant={filter === "in_behandeling" ? "primary" : "outline"}
            size="sm"
            onClick={() => setFilter("in_behandeling")}
          >
            In behandeling
          </Button>
          <Button
            variant={filter === "goedgekeurd" ? "primary" : "outline"}
            size="sm"
            onClick={() => setFilter("goedgekeurd")}
          >
            Goedgekeurd
          </Button>
        </div>

        {/* Matches list */}
        <div className="space-y-4">
          {filteredMatches.map((match) => (
            <Card key={match.id}>
              <CardContent className="pt-6">
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  {/* Match score */}
                  <div className="flex items-center gap-4 lg:w-48">
                    <div className="relative w-16 h-16">
                      <svg className="w-16 h-16 -rotate-90">
                        <circle
                          cx="32"
                          cy="32"
                          r="28"
                          fill="none"
                          stroke="var(--muted)"
                          strokeWidth="8"
                        />
                        <circle
                          cx="32"
                          cy="32"
                          r="28"
                          fill="none"
                          stroke="var(--primary)"
                          strokeWidth="8"
                          strokeDasharray={`${(match.matchScore / 100) * 176} 176`}
                          strokeLinecap="round"
                        />
                      </svg>
                      <span className="absolute inset-0 flex items-center justify-center text-lg font-bold">
                        {match.matchScore}%
                      </span>
                    </div>
                    <div className="lg:hidden">
                      <h3 className="font-semibold text-lg">{match.regeling.name}</h3>
                      <Badge variant={getStatusColor(match.status) as "secondary" | "warning" | "success" | "destructive"}>
                        {match.status}
                      </Badge>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="hidden lg:flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">{match.regeling.name}</h3>
                      <Badge variant={getStatusColor(match.status) as "secondary" | "warning" | "success" | "destructive"}>
                        {match.status}
                      </Badge>
                    </div>
                    <p className="text-[var(--muted-foreground)] text-sm mb-3">
                      {match.reasoning}
                    </p>
                    {match.regeling.maxBedrag && (
                      <p className="text-[var(--primary)] font-medium">
                        {match.regeling.maxBedrag}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 lg:flex-col lg:w-40">
                    <Link href={`/regelingen/${match.regeling.slug}`} className="flex-1 lg:flex-none">
                      <Button variant="outline" size="sm" className="w-full">
                        Bekijk regeling
                      </Button>
                    </Link>
                    <Link href="/dashboard/aanvragen" className="flex-1 lg:flex-none">
                      <Button size="sm" className="w-full">
                        Start aanvraag
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {filteredMatches.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-[var(--muted-foreground)]">
                  Geen matches gevonden met deze filter.
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* CTA */}
        <Card className="mt-8">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="font-semibold">Meer matches vinden?</h3>
                <p className="text-sm text-[var(--muted-foreground)]">
                  Werk je profiel bij om meer passende regelingen te ontdekken.
                </p>
              </div>
              <Link href="/dashboard/intake">
                <Button>Profiel bijwerken</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
