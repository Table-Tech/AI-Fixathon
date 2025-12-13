import { Header, Footer } from "@/components/layout";
import { Button, Card, CardContent } from "@/components/ui";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-12 md:py-20 lg:py-28 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                  Ontdek waar je{" "}
                  <span className="text-[var(--primary)]">recht</span> op hebt
                </h1>
                <p className="mt-6 text-lg text-[var(--muted-foreground)] max-w-lg">
                  Hulpwijzer helpt je bij het vinden van toeslagen, uitkeringen
                  en regelingen waar je mogelijk recht op hebt. Snel, eenvoudig
                  en volledig gratis.
                </p>
                <div className="mt-8 flex flex-col sm:flex-row gap-4">
                  <Link href="/intake">
                    <Button size="lg" className="w-full sm:w-auto">
                      Start de intake
                    </Button>
                  </Link>
                  <Link href="/regelingen">
                    <Button variant="outline" size="lg" className="w-full sm:w-auto">
                      Bekijk alle regelingen
                    </Button>
                  </Link>
                </div>
                <div className="mt-8 flex items-center gap-6 text-sm text-[var(--muted-foreground)]">
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-5 h-5 text-[var(--success)]"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>100% gratis</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-5 h-5 text-[var(--success)]"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Privacy gegarandeerd</span>
                  </div>
                </div>
              </div>

              {/* Hero Image / Illustration */}
              <div className="hidden lg:flex justify-center">
                <div className="w-full max-w-md aspect-square bg-gradient-to-br from-[var(--primary)]/20 to-[var(--accent)] rounded-3xl flex items-center justify-center">
                  <div className="text-center p-8">
                    <div className="w-24 h-24 mx-auto bg-[var(--primary)] rounded-2xl flex items-center justify-center mb-6">
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
                          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                        />
                      </svg>
                    </div>
                    <p className="text-[var(--foreground)] font-medium">
                      Veilig en vertrouwd
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="py-16 md:py-24 bg-[var(--muted)]">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold">
                Hoe werkt het?
              </h2>
              <p className="mt-4 text-[var(--muted-foreground)] max-w-2xl mx-auto">
                In drie eenvoudige stappen ontdek je welke regelingen voor jou
                beschikbaar zijn.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Step 1 */}
              <Card>
                <CardContent className="pt-6">
                  <div className="w-12 h-12 bg-[var(--primary)] rounded-xl flex items-center justify-center text-white font-bold text-xl mb-4">
                    1
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    Vertel over jezelf
                  </h3>
                  <p className="text-[var(--muted-foreground)]">
                    Beantwoord enkele vragen over je situatie. Dit duurt
                    ongeveer 5 minuten.
                  </p>
                </CardContent>
              </Card>

              {/* Step 2 */}
              <Card>
                <CardContent className="pt-6">
                  <div className="w-12 h-12 bg-[var(--primary)] rounded-xl flex items-center justify-center text-white font-bold text-xl mb-4">
                    2
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    Bekijk je matches
                  </h3>
                  <p className="text-[var(--muted-foreground)]">
                    Wij laten zien voor welke regelingen je mogelijk in
                    aanmerking komt.
                  </p>
                </CardContent>
              </Card>

              {/* Step 3 */}
              <Card>
                <CardContent className="pt-6">
                  <div className="w-12 h-12 bg-[var(--primary)] rounded-xl flex items-center justify-center text-white font-bold text-xl mb-4">
                    3
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    Dien je aanvraag in
                  </h3>
                  <p className="text-[var(--muted-foreground)]">
                    Wij helpen je met het voorbereiden en indienen van je
                    aanvraag.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Popular Schemes */}
        <section className="py-16 md:py-24 bg-[var(--muted)]">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-12">
              <div>
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold">
                  Populaire regelingen
                </h2>
                <p className="mt-2 text-[var(--muted-foreground)]">
                  De meest aangevraagde regelingen
                </p>
              </div>
              <Link href="/regelingen">
                <Button variant="outline">Bekijk alle regelingen</Button>
              </Link>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  name: "Zorgtoeslag",
                  description: "Tegemoetkoming in de kosten van je zorgverzekering",
                  amount: "Tot € 154/maand",
                  slug: "zorgtoeslag",
                },
                {
                  name: "Huurtoeslag",
                  description: "Bijdrage voor huurders met een laag inkomen",
                  amount: "Afhankelijk van situatie",
                  slug: "huurtoeslag",
                },
                {
                  name: "Kindgebonden Budget",
                  description: "Extra geld voor gezinnen met kinderen",
                  amount: "Tot € 3.848/jaar",
                  slug: "kindgebonden-budget",
                },
              ].map((regeling) => (
                <Link key={regeling.slug} href={`/regelingen/${regeling.slug}`}>
                  <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="pt-6">
                      <h3 className="text-lg font-semibold mb-2">
                        {regeling.name}
                      </h3>
                      <p className="text-[var(--muted-foreground)] text-sm mb-4">
                        {regeling.description}
                      </p>
                      <p className="text-[var(--primary)] font-medium">
                        {regeling.amount}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold">
              Klaar om te beginnen?
            </h2>
            <p className="mt-4 text-[var(--muted-foreground)] max-w-2xl mx-auto">
              Start nu met de intake en ontdek binnen 5 minuten welke regelingen
              voor jou beschikbaar zijn. Het is gratis en vrijblijvend.
            </p>
            <div className="mt-8">
              <Link href="/intake">
                <Button size="lg">Start de gratis intake</Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
