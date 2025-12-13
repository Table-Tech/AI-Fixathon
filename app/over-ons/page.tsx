import { Header, Footer } from "@/components/layout";
import { Button, Card, CardContent } from "@/components/ui";
import Link from "next/link";

export default function OverOnsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="py-12 md:py-20 px-4 bg-[var(--muted)]">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold">
              Over Hulpwijzer
            </h1>
            <p className="mt-4 text-lg text-[var(--muted-foreground)] max-w-2xl mx-auto">
              Wij geloven dat iedereen toegang moet hebben tot de financiële
              ondersteuning waar ze recht op hebben.
            </p>
          </div>
        </section>

        {/* Mission */}
        <section className="py-12 md:py-20 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold mb-6">
                  Onze missie
                </h2>
                <p className="text-[var(--muted-foreground)] mb-4">
                  Hulpwijzer is ontstaan uit de overtuiging dat het aanvragen
                  van financiële ondersteuning niet ingewikkeld hoeft te zijn.
                  Te veel mensen lopen regelingen mis waar ze wel recht op
                  hebben, simpelweg omdat het systeem te complex is.
                </p>
                <p className="text-[var(--muted-foreground)]">
                  Wij maken het gemakkelijk om te ontdekken welke regelingen bij
                  jouw situatie passen, en helpen je bij het voorbereiden van je
                  aanvraag. Met AI-technologie en menselijke begeleiding zorgen
                  we ervoor dat je niets mist.
                </p>
              </div>
              <div className="bg-gradient-to-br from-[var(--primary)]/20 to-[var(--accent)] rounded-2xl p-8 text-center">
                <div className="w-20 h-20 bg-[var(--primary)] rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <svg
                    className="w-10 h-10 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </div>
                <p className="text-lg font-medium">
                  Helpen waar het nodig is
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-12 md:py-20 px-4 bg-[var(--muted)]">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
              Onze waarden
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="pt-6 text-center">
                  <div className="w-14 h-14 bg-[var(--primary)]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-7 h-7 text-[var(--primary)]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Vertrouwen</h3>
                  <p className="text-[var(--muted-foreground)] text-sm">
                    Je gegevens zijn veilig bij ons. We zijn transparant over
                    wat we doen.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6 text-center">
                  <div className="w-14 h-14 bg-[var(--primary)]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-7 h-7 text-[var(--primary)]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Eenvoud</h3>
                  <p className="text-[var(--muted-foreground)] text-sm">
                    We maken complexe processen eenvoudig en begrijpelijk.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6 text-center">
                  <div className="w-14 h-14 bg-[var(--primary)]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-7 h-7 text-[var(--primary)]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Menselijkheid</h3>
                  <p className="text-[var(--muted-foreground)] text-sm">
                    AI helpt, maar mensen controleren. Je bent nooit alleen.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6 text-center">
                  <div className="w-14 h-14 bg-[var(--primary)]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-7 h-7 text-[var(--primary)]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Toegankelijk</h3>
                  <p className="text-[var(--muted-foreground)] text-sm">
                    Voor iedereen, ongeacht achtergrond of digitale
                    vaardigheden.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="py-12 md:py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">Ons team</h2>
            <p className="text-[var(--muted-foreground)] max-w-2xl mx-auto mb-12">
              Hulpwijzer wordt gemaakt door een team van enthousiastelingen die
              geloven in de kracht van technologie om mensen te helpen. We
              werken samen met vrijwilligers, sociale werkers en
              beleidsexperts.
            </p>
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-2">
                  Word vrijwilliger
                </h3>
                <p className="text-[var(--muted-foreground)] mb-4">
                  Wil je anderen helpen bij het aanvragen van regelingen? Neem
                  contact met ons op.
                </p>
                <a href="mailto:vrijwilligers@hulpwijzer.nl">
                  <Button variant="outline">Meer informatie</Button>
                </a>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA */}
        <section className="py-12 md:py-20 px-4 bg-[var(--muted)]">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Ontdek wat wij voor jou kunnen betekenen
            </h2>
            <p className="text-[var(--muted-foreground)] mb-8">
              Start vandaag nog met de intake en ontdek welke regelingen er voor
              jou beschikbaar zijn.
            </p>
            <Link href="/intake">
              <Button size="lg">Start de gratis intake</Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
