"use client";

import { Button, Card, CardContent, Badge, Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui";
import { MOCK_APPLICATIONS, MOCK_MATCHES } from "@/lib/mock-data";
import Link from "next/link";

export default function AanvragenPage() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "concept":
        return "secondary";
      case "in_review":
        return "warning";
      case "ingediend":
        return "default";
      case "goedgekeurd":
        return "success";
      case "afgewezen":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "concept":
        return "Concept";
      case "in_review":
        return "In review";
      case "ingediend":
        return "Ingediend";
      case "goedgekeurd":
        return "Goedgekeurd";
      case "afgewezen":
        return "Afgewezen";
      default:
        return status;
    }
  };

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Back link */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-[var(--muted-foreground)] hover:text-[var(--foreground)] mb-4 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Terug naar dashboard
        </Link>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold">Mijn aanvragen</h1>
          <p className="mt-2 text-[var(--muted-foreground)]">
            Beheer en volg de status van je aanvragen.
          </p>
        </div>

        <Tabs defaultValue="lopend">
          <TabsList className="mb-6">
            <TabsTrigger value="lopend">Lopend</TabsTrigger>
            <TabsTrigger value="afgerond">Afgerond</TabsTrigger>
            <TabsTrigger value="nieuw">Nieuwe aanvraag</TabsTrigger>
          </TabsList>

          <TabsContent value="lopend">
            {MOCK_APPLICATIONS.length > 0 ? (
              <div className="space-y-4">
                {MOCK_APPLICATIONS.map((app) => (
                  <Card key={app.id}>
                    <CardContent className="pt-6">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-lg">
                              {app.regeling.name}
                            </h3>
                            <Badge variant={getStatusColor(app.status) as "secondary" | "warning" | "success" | "destructive" | "default"}>
                              {getStatusLabel(app.status)}
                            </Badge>
                          </div>
                          <p className="text-sm text-[var(--muted-foreground)]">
                            Aangemaakt op:{" "}
                            {app.createdAt.toLocaleDateString("nl-NL", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })}
                          </p>
                          <p className="text-sm text-[var(--muted-foreground)]">
                            Laatst bijgewerkt:{" "}
                            {app.updatedAt.toLocaleDateString("nl-NL", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            Bekijk details
                          </Button>
                          {app.status === "concept" && (
                            <Button size="sm">Verder werken</Button>
                          )}
                        </div>
                      </div>

                      {app.status === "concept" && (
                        <div className="mt-4 p-4 bg-[var(--muted)] rounded-lg">
                          <h4 className="font-medium text-sm mb-2">Concepttekst</h4>
                          <p className="text-sm text-[var(--muted-foreground)]">
                            {app.draftContent}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <div className="w-16 h-16 bg-[var(--muted)] rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-8 h-8 text-[var(--muted-foreground)]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <h3 className="font-semibold mb-2">Geen lopende aanvragen</h3>
                  <p className="text-[var(--muted-foreground)] mb-4">
                    Je hebt nog geen aanvragen gestart.
                  </p>
                  <Link href="/dashboard/matches">
                    <Button>Bekijk je matches</Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="afgerond">
            <Card>
              <CardContent className="py-12 text-center">
                <div className="w-16 h-16 bg-[var(--muted)] rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-[var(--muted-foreground)]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h3 className="font-semibold mb-2">Geen afgeronde aanvragen</h3>
                <p className="text-[var(--muted-foreground)]">
                  Je hebt nog geen afgeronde aanvragen.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="nieuw">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {MOCK_MATCHES.filter((m) => m.status === "potentieel").map((match) => (
                <Card key={match.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <h3 className="font-semibold mb-2">{match.regeling.name}</h3>
                    <p className="text-sm text-[var(--muted-foreground)] mb-3">
                      {match.regeling.shortDescription}
                    </p>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex-1 h-2 bg-[var(--muted)] rounded-full">
                        <div
                          className="h-full bg-[var(--primary)] rounded-full"
                          style={{ width: `${match.matchScore}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium">{match.matchScore}%</span>
                    </div>
                    <Button className="w-full" size="sm">
                      Start aanvraag
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {MOCK_MATCHES.filter((m) => m.status === "potentieel").length === 0 && (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-[var(--muted-foreground)]">
                    Geen regelingen beschikbaar om aan te vragen.
                  </p>
                  <Link href="/profiel/gegevens">
                    <Button variant="outline" className="mt-4">
                      Werk je profiel bij
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
