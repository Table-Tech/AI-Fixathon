import { Header, Footer } from "@/components/layout";
import { Button, Card, CardContent } from "@/components/ui";
import Link from "next/link";

export default function HoeWerktHetPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="py-12 md:py-20 px-4 bg-[var(--muted)]">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold">
              Hoe werkt Hulpwijzer?
            </h1>
            <p className="mt-4 text-lg text-[var(--muted-foreground)] max-w-2xl mx-auto">
              In een paar eenvoudige stappen ontdek je welke financiële
              regelingen er voor jou beschikbaar zijn.
            </p>
          </div>
        </section>

        {/* Steps */}
        <section className="py-12 md:py-20 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="space-y-12">
              {/* Step 1 */}
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="w-24 h-24 bg-[var(--primary)] rounded-2xl flex items-center justify-center flex-shrink-0">
                  <span className="text-4xl font-bold text-white">1</span>
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h2 className="text-2xl font-bold mb-4">
                    Start een gesprek met onze AI-assistent
                  </h2>
                  <p className="text-[var(--muted-foreground)]">
                    Beantwoord een aantal vragen over je situatie. Denk aan
                    vragen over je gezinssituatie, woonsituatie, werk en
                    inkomen. Dit duurt ongeveer 5 minuten en je kunt altijd
                    later verder gaan.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex flex-col md:flex-row-reverse gap-8 items-center">
                <div className="w-24 h-24 bg-[var(--primary)] rounded-2xl flex items-center justify-center flex-shrink-0">
                  <span className="text-4xl font-bold text-white">2</span>
                </div>
                <div className="flex-1 text-center md:text-right">
                  <h2 className="text-2xl font-bold mb-4">
                    Bekijk je persoonlijke matches
                  </h2>
                  <p className="text-[var(--muted-foreground)]">
                    Op basis van je antwoorden laten we zien voor welke
                    regelingen je mogelijk in aanmerking komt. Per regeling zie
                    je een match-percentage en uitleg waarom deze bij je past.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="w-24 h-24 bg-[var(--primary)] rounded-2xl flex items-center justify-center flex-shrink-0">
                  <span className="text-4xl font-bold text-white">3</span>
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h2 className="text-2xl font-bold mb-4">
                    Bereid je aanvraag voor
                  </h2>
                  <p className="text-[var(--muted-foreground)]">
                    Kies een regeling waarvoor je wilt aanvragen. Onze AI helpt
                    je met het voorbereiden van je aanvraag en genereert een
                    concept-tekst die je kunt gebruiken.
                  </p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="flex flex-col md:flex-row-reverse gap-8 items-center">
                <div className="w-24 h-24 bg-[var(--primary)] rounded-2xl flex items-center justify-center flex-shrink-0">
                  <span className="text-4xl font-bold text-white">4</span>
                </div>
                <div className="flex-1 text-center md:text-right">
                  <h2 className="text-2xl font-bold mb-4">
                    Laat je aanvraag controleren
                  </h2>
                  <p className="text-[var(--muted-foreground)]">
                    Voordat je je aanvraag indient, wordt deze gecontroleerd
                    door een getrainde vrijwilliger. Zo weet je zeker dat alles
                    klopt en heb je de beste kans op goedkeuring.
                  </p>
                </div>
              </div>

              {/* Step 5 */}
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="w-24 h-24 bg-[var(--success)] rounded-2xl flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-12 h-12 text-white"
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
                <div className="flex-1 text-center md:text-left">
                  <h2 className="text-2xl font-bold mb-4">Dien je aanvraag in</h2>
                  <p className="text-[var(--muted-foreground)]">
                    Na goedkeuring door een vrijwilliger kun je je aanvraag
                    indienen. Wij begeleiden je door het proces en houden je op
                    de hoogte van de status.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-12 md:py-20 px-4 bg-[var(--muted)]">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
              Waarom Hulpwijzer?
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
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
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">100% gratis</h3>
                  <p className="text-[var(--muted-foreground)] text-sm">
                    Hulpwijzer is volledig gratis. We rekenen geen kosten voor
                    onze diensten.
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
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Veilig & privé</h3>
                  <p className="text-[var(--muted-foreground)] text-sm">
                    Je gegevens worden veilig opgeslagen en nooit gedeeld zonder
                    je toestemming.
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
                  <h3 className="text-lg font-semibold mb-2">
                    Menselijke controle
                  </h3>
                  <p className="text-[var(--muted-foreground)] text-sm">
                    Elke aanvraag wordt gecontroleerd door een getrainde
                    vrijwilliger.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-12 md:py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Klaar om te beginnen?
            </h2>
            <p className="text-[var(--muted-foreground)] mb-8 max-w-2xl mx-auto">
              Start nu met de intake en ontdek binnen 5 minuten welke
              regelingen er voor jou beschikbaar zijn.
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
