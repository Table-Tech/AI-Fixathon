import { Header, Footer } from "@/components/layout";
import { Button, Card, CardContent, Badge } from "@/components/ui";
import { REGELINGEN, CATEGORIES } from "@/lib/mock-data";
import Link from "next/link";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function RegelingDetailPage({ params }: Props) {
  const { slug } = await params;
  const regeling = REGELINGEN.find((r) => r.slug === slug);

  if (!regeling) {
    notFound();
  }

  const categoryLabel = CATEGORIES.find((c) => c.value === regeling.category)?.label;

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

                {/* CTA */}
                <Card className="bg-[var(--primary)] text-white border-0">
                  <CardContent className="pt-6">
                    <h3 className="font-semibold mb-2">Kom je in aanmerking?</h3>
                    <p className="text-white/80 text-sm mb-4">
                      Start de intake om te ontdekken of deze regeling bij jouw
                      situatie past.
                    </p>
                    <Link href="/intake">
                      <Button
                        variant="secondary"
                        className="w-full bg-white text-[var(--primary)] hover:bg-white/90"
                      >
                        Start de intake
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

export async function generateStaticParams() {
  return REGELINGEN.map((regeling) => ({
    slug: regeling.slug,
  }));
}
