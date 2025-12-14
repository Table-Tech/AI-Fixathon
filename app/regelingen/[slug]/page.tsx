"use client";

import { Header, Footer } from "@/components/layout";
import { Button, Card, CardContent, Badge, Skeleton } from "@/components/ui";
import { CATEGORIES } from "@/hooks/use-regelingen";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, notFound, useRouter } from "next/navigation";

interface RegelingDetail {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  category: string;
  provider: string;
  maxBedrag?: string;
  requirements: string[];
  documentsNeeded: string[];
  aanvraagUrl?: string;
  lastUpdated: string;
}

export default function RegelingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const { user, loading: authLoading } = useAuth();

  const [regeling, setRegeling] = useState<RegelingDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [taskAdded, setTaskAdded] = useState(false);
  const [taskError, setTaskError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRegeling() {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/regelingen/${slug}`);
        const result = await response.json();

        if (!response.ok) {
          if (response.status === 404) {
            setError("not_found");
            return;
          }
          throw new Error(result.error || "Failed to fetch regeling");
        }

        const data = result.data;
        const details = data.details;

        setRegeling({
          id: data.id,
          slug: data.slug,
          name: data.title,
          shortDescription: details.short_description || details.description?.slice(0, 120) + "...",
          description: details.description,
          category: details.category,
          provider: details.provider,
          maxBedrag: details.estimated_amount,
          requirements: details.requirements || [],
          documentsNeeded: details.documents_needed || [],
          aanvraagUrl: details.source_url,
          lastUpdated: data.created_at,
        });
      } catch (err) {
        console.error("Error fetching regeling:", err);
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setIsLoading(false);
      }
    }

    if (slug) {
      fetchRegeling();
    }
  }, [slug]);

  const handleAddToTasks = async () => {
    if (!regeling) return;

    // Get fresh token
    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.access_token) {
      router.push("/login");
      return;
    }

    setIsAddingTask(true);
    setTaskError(null);

    try {
      const response = await fetch("/api/tasks/from-regeling", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          regeling_id: regeling.id,
          regeling_title: regeling.name,
          documents_needed: regeling.documentsNeeded,
          provider: regeling.provider,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Kon taak niet aanmaken");
      }

      setTaskAdded(true);
    } catch (err) {
      console.error("Error adding task:", err);
      setTaskError(err instanceof Error ? err.message : "Er ging iets mis");
    } finally {
      setIsAddingTask(false);
    }
  };

  if (error === "not_found") {
    notFound();
  }

  const categoryLabel = regeling
    ? CATEGORIES.find((c) => c.value === regeling.category)?.label
    : "";

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col pb-20 md:pb-0">
        <Header />
        <main className="flex-1">
          <div className="bg-[var(--muted)] border-b border-[var(--border)]">
            <div className="max-w-7xl mx-auto px-4 py-4">
              <Skeleton className="h-4 w-64" />
            </div>
          </div>
          <section className="py-8 md:py-12 px-4 bg-[var(--muted)]">
            <div className="max-w-7xl mx-auto">
              <Skeleton className="h-6 w-24 mb-4" />
              <Skeleton className="h-12 w-96 mb-4" />
              <Skeleton className="h-6 w-full max-w-3xl" />
            </div>
          </section>
          <section className="py-8 md:py-12 px-4">
            <div className="max-w-7xl mx-auto">
              <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                  <Card>
                    <CardContent className="pt-6">
                      <Skeleton className="h-6 w-48 mb-4" />
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-3/4" />
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !regeling) {
    return (
      <div className="min-h-screen flex flex-col pb-20 md:pb-0">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Er ging iets mis</h1>
            <p className="text-[var(--muted-foreground)] mb-6">{error}</p>
            <Link href="/regelingen">
              <Button>Terug naar regelingen</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col pb-20 md:pb-0">
      <Header />

      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="bg-[var(--muted)] border-b border-[var(--border)]">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <nav className="flex items-center gap-2 text-sm text-[var(--muted-foreground)]">
              <Link href="/" className="hover:text-[var(--foreground)]">
                Home
              </Link>
              <span>/</span>
              <Link href="/regelingen" className="hover:text-[var(--foreground)]">
                Regelingen
              </Link>
              <span>/</span>
              <span className="text-[var(--foreground)]">{regeling.name}</span>
            </nav>
          </div>
        </div>

        {/* Hero */}
        <section className="py-8 md:py-12 px-4 bg-[var(--muted)]">
          <div className="max-w-7xl mx-auto">
            <Badge className="mb-4">{categoryLabel}</Badge>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold">
              {regeling.name}
            </h1>
            <p className="mt-4 text-lg text-[var(--muted-foreground)] max-w-3xl">
              {regeling.shortDescription}
            </p>
            {regeling.maxBedrag && (
              <p className="mt-4 text-2xl font-bold text-[var(--primary)]">
                {regeling.maxBedrag}
              </p>
            )}
          </div>
        </section>

        {/* Content */}
        <section className="py-8 md:py-12 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Main content */}
              <div className="lg:col-span-2 space-y-8">
                {/* Description */}
                <Card>
                  <CardContent className="pt-6">
                    <h2 className="text-xl font-semibold mb-4">
                      Wat is {regeling.name}?
                    </h2>
                    <p className="text-[var(--muted-foreground)] leading-relaxed">
                      {regeling.description}
                    </p>
                  </CardContent>
                </Card>

                {/* Requirements */}
                <Card>
                  <CardContent className="pt-6">
                    <h2 className="text-xl font-semibold mb-4">Voorwaarden</h2>
                    <ul className="space-y-3">
                      {regeling.requirements.map((req, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <svg
                            className="w-5 h-5 text-[var(--success)] mt-0.5 flex-shrink-0"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span className="text-[var(--muted-foreground)]">
                            {req}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {/* Documents needed */}
                <Card>
                  <CardContent className="pt-6">
                    <h2 className="text-xl font-semibold mb-4">
                      Benodigde documenten
                    </h2>
                    <ul className="space-y-3">
                      {regeling.documentsNeeded.map((doc, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <svg
                            className="w-5 h-5 text-[var(--primary)] mt-0.5 flex-shrink-0"
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
                          <span className="text-[var(--muted-foreground)]">
                            {doc}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Quick info */}
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="font-semibold mb-4">Snelle info</h3>
                    <dl className="space-y-4">
                      <div>
                        <dt className="text-sm text-[var(--muted-foreground)]">
                          Aanbieder
                        </dt>
                        <dd className="font-medium">{regeling.provider}</dd>
                      </div>
                      <div>
                        <dt className="text-sm text-[var(--muted-foreground)]">
                          Categorie
                        </dt>
                        <dd className="font-medium">{categoryLabel}</dd>
                      </div>
                      <div>
                        <dt className="text-sm text-[var(--muted-foreground)]">
                          Laatst bijgewerkt
                        </dt>
                        <dd className="font-medium">
                          {new Date(regeling.lastUpdated).toLocaleDateString("nl-NL", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </dd>
                      </div>
                    </dl>
                  </CardContent>
                </Card>

                {/* Add to tasks */}
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="font-semibold mb-2">Voeg toe aan taken</h3>
                    <p className="text-sm text-[var(--muted-foreground)] mb-4">
                      Voeg deze regeling toe aan je takenlijst met automatisch gegenereerde stappen.
                    </p>
                    {taskAdded ? (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-[var(--success)]">
                          <svg
                            className="w-5 h-5"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span className="font-medium">Taak toegevoegd!</span>
                        </div>
                        <Link href="/taken">
                          <Button variant="outline" className="w-full">
                            Bekijk taken
                          </Button>
                        </Link>
                      </div>
                    ) : (
                      <>
                        <Button
                          onClick={handleAddToTasks}
                          disabled={isAddingTask || authLoading}
                          className="w-full"
                        >
                          {isAddingTask ? (
                            <>
                              <svg
                                className="animate-spin -ml-1 mr-2 h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                />
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                />
                              </svg>
                              Toevoegen...
                            </>
                          ) : (
                            <>
                              <svg
                                className="w-4 h-4 mr-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 4v16m8-8H4"
                                />
                              </svg>
                              Voeg toe aan taken
                            </>
                          )}
                        </Button>
                        {taskError && (
                          <p className="mt-2 text-sm text-[var(--destructive)]">
                            {taskError}
                          </p>
                        )}
                        {!user && !authLoading && (
                          <p className="mt-2 text-xs text-[var(--muted-foreground)]">
                            Je moet ingelogd zijn om taken toe te voegen
                          </p>
                        )}
                      </>
                    )}
                  </CardContent>
                </Card>

                {/* CTA */}
                <Card className="bg-[var(--primary)] text-white border-0">
                  <CardContent className="pt-6">
                    <h3 className="font-semibold mb-2">Hulp nodig?</h3>
                    <p className="text-white/80 text-sm mb-4">
                      Vraag onze assistent of deze regeling bij jouw situatie past.
                    </p>
                    <Link href="/assistent">
                      <Button
                        variant="secondary"
                        className="w-full bg-white text-[var(--primary)] hover:bg-white/90"
                      >
                        Chat met assistent
                      </Button>
                    </Link>
                  </CardContent>
                </Card>

                {/* External link */}
                {regeling.aanvraagUrl && (
                  <Card>
                    <CardContent className="pt-6">
                      <h3 className="font-semibold mb-2">Direct aanvragen</h3>
                      <p className="text-sm text-[var(--muted-foreground)] mb-4">
                        Je kunt ook direct aanvragen bij {regeling.provider}.
                      </p>
                      <a
                        href={regeling.aanvraagUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button variant="outline" className="w-full">
                          Naar {regeling.provider}
                          <svg
                            className="w-4 h-4 ml-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                            />
                          </svg>
                        </Button>
                      </a>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
