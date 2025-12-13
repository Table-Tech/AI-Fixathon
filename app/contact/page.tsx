"use client";

import { Header, Footer } from "@/components/layout";
import { Button, Card, CardContent, Input, Textarea } from "@/components/ui";
import { useState } from "react";

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen flex flex-col pb-20 md:pb-0">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="py-12 md:py-16 px-4 bg-[var(--muted)]">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold">
              Contact
            </h1>
            <p className="mt-4 text-[var(--muted-foreground)] max-w-2xl mx-auto">
              Heb je een vraag of wil je meer weten over Hulpwijzer? Neem
              contact met ons op.
            </p>
          </div>
        </section>

        {/* Contact form & info */}
        <section className="py-12 md:py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Form */}
              <Card>
                <CardContent className="pt-6">
                  {!isSubmitted ? (
                    <>
                      <h2 className="text-xl font-semibold mb-6">
                        Stuur ons een bericht
                      </h2>
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <Input
                          label="Naam"
                          placeholder="Je naam"
                          required
                        />
                        <Input
                          label="E-mailadres"
                          type="email"
                          placeholder="je@email.nl"
                          required
                        />
                        <Input
                          label="Onderwerp"
                          placeholder="Waar gaat je bericht over?"
                          required
                        />
                        <Textarea
                          label="Bericht"
                          placeholder="Typ je bericht hier..."
                          required
                        />
                        <Button
                          type="submit"
                          className="w-full"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? "Verzenden..." : "Verstuur bericht"}
                        </Button>
                      </form>
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-[var(--success)] rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg
                          className="w-8 h-8 text-white"
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
                      <h3 className="text-xl font-semibold mb-2">
                        Bericht verzonden!
                      </h3>
                      <p className="text-[var(--muted-foreground)]">
                        Bedankt voor je bericht. We nemen zo snel mogelijk
                        contact met je op.
                      </p>
                      <Button
                        variant="outline"
                        className="mt-6"
                        onClick={() => setIsSubmitted(false)}
                      >
                        Nieuw bericht
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Contact info */}
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-6">
                    Andere manieren om contact op te nemen
                  </h2>
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-[var(--muted)] rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg
                          className="w-6 h-6 text-[var(--primary)]"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-medium">E-mail</h3>
                        <p className="text-[var(--muted-foreground)]">
                          info@hulpwijzer.nl
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-[var(--muted)] rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg
                          className="w-6 h-6 text-[var(--primary)]"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-medium">Adres</h3>
                        <p className="text-[var(--muted-foreground)]">
                          Voorbeeldstraat 1
                          <br />
                          1234 AB Amsterdam
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <Card>
                  <CardContent className="pt-6">
                    <h3 className="font-semibold mb-2">Veelgestelde vragen</h3>
                    <p className="text-[var(--muted-foreground)] text-sm mb-4">
                      Misschien staat je vraag al beantwoord in onze FAQ.
                    </p>
                    <a href="/faq">
                      <Button variant="outline" className="w-full">
                        Bekijk FAQ
                      </Button>
                    </a>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <h3 className="font-semibold mb-2">Privacy vragen</h3>
                    <p className="text-[var(--muted-foreground)] text-sm mb-4">
                      Voor vragen over je gegevens of privacy kun je mailen
                      naar:
                    </p>
                    <p className="text-[var(--primary)]">
                      privacy@hulpwijzer.nl
                    </p>
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
