"use client";

import { Header, Footer } from "@/components/layout";
import { Card, CardContent } from "@/components/ui";
import { FAQ_ITEMS } from "@/lib/mock-data";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function FAQPage() {
  const router = useRouter();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="min-h-screen flex flex-col pb-20 md:pb-0">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="py-12 md:py-16 px-4 bg-[var(--muted)]">
          <div className="max-w-4xl mx-auto text-center">
            <div className="relative flex items-center justify-center">
              <button
                onClick={() => router.back()}
                className="absolute left-0 p-2 hover:bg-[var(--background)] rounded-lg transition-colors"
                aria-label="Terug"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold">
                Veelgestelde vragen
              </h1>
            </div>
            <p className="mt-4 text-[var(--muted-foreground)] max-w-2xl mx-auto">
              Vind antwoorden op de meest gestelde vragen over Hulpwijzer.
            </p>
          </div>
        </section>

        {/* FAQ List */}
        <section className="py-12 md:py-16 px-4">
          <div className="max-w-3xl mx-auto">
            <div className="space-y-4">
              {FAQ_ITEMS.map((item, index) => (
                <Card key={index}>
                  <CardContent className="p-0">
                    <button
                      onClick={() => setOpenIndex(openIndex === index ? null : index)}
                      className="w-full p-6 text-left flex items-center justify-between"
                    >
                      <span className="font-semibold pr-4">{item.question}</span>
                      <svg
                        className={`w-5 h-5 flex-shrink-0 transition-transform ${
                          openIndex === index ? "rotate-180" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>
                    {openIndex === index && (
                      <div className="px-6 pb-6 pt-0">
                        <p className="text-[var(--muted-foreground)]">
                          {item.answer}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Contact CTA */}
            <Card className="mt-12">
              <CardContent className="pt-6 text-center">
                <h2 className="text-xl font-semibold mb-2">
                  Vraag niet gevonden?
                </h2>
                <p className="text-[var(--muted-foreground)] mb-4">
                  Neem gerust contact met ons op. We helpen je graag verder.
                </p>
                <a
                  href="mailto:info@hulpwijzer.nl"
                  className="text-[var(--primary)] hover:underline"
                >
                  info@hulpwijzer.nl
                </a>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
