"use client";

import { Header, Footer } from "@/components/layout";
import { Button, Card, CardContent, Input, Badge } from "@/components/ui";
import { REGELINGEN, CATEGORIES } from "@/lib/mock-data";
import Link from "next/link";
import { useState, useMemo } from "react";

export default function RegelingenPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredRegelingen = useMemo(() => {
    return REGELINGEN.filter((regeling) => {
      const matchesSearch =
        regeling.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        regeling.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === "all" || regeling.category === selectedCategory;
      return matchesSearch && matchesCategory && regeling.isActive;
    });
  }, [searchQuery, selectedCategory]);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "toeslagen":
        return "default";
      case "uitkeringen":
        return "secondary";
      case "subsidies":
        return "success";
      case "kindregelingen":
        return "warning";
      case "wonen":
        return "default";
      default:
        return "secondary";
    }
  };

  return (
    <div className="min-h-screen flex flex-col pb-20 md:pb-0">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="py-12 md:py-16 px-4 bg-[var(--muted)]">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold">
              Alle regelingen
            </h1>
            <p className="mt-4 text-[var(--muted-foreground)] max-w-2xl">
              Bekijk alle beschikbare toeslagen, uitkeringen en regelingen.
              Gebruik de zoekfunctie of filter op categorie.
            </p>
          </div>
        </section>

        {/* Search & Filter */}
        <section className="py-8 px-4 border-b border-[var(--border)]">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Zoek op naam of beschrijving..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
                {CATEGORIES.map((category) => (
                  <Button
                    key={category.value}
                    variant={selectedCategory === category.value ? "primary" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category.value)}
                    className="whitespace-nowrap"
                  >
                    {category.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Results */}
        <section className="py-8 md:py-12 px-4">
          <div className="max-w-7xl mx-auto">
            <p className="text-[var(--muted-foreground)] mb-6">
              {filteredRegelingen.length} regelingen gevonden
            </p>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRegelingen.map((regeling) => (
                <Link key={regeling.id} href={`/regelingen/${regeling.slug}`}>
                  <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <Badge variant={getCategoryColor(regeling.category) as "default" | "secondary" | "success" | "warning"}>
                          {CATEGORIES.find((c) => c.value === regeling.category)?.label}
                        </Badge>
                      </div>
                      <h3 className="text-lg font-semibold mb-2">
                        {regeling.name}
                      </h3>
                      <p className="text-[var(--muted-foreground)] text-sm mb-4 line-clamp-2">
                        {regeling.shortDescription}
                      </p>
                      {regeling.maxBedrag && (
                        <p className="text-[var(--primary)] font-medium text-sm">
                          {regeling.maxBedrag}
                        </p>
                      )}
                      <p className="text-xs text-[var(--muted-foreground)] mt-3">
                        {regeling.provider}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>

            {filteredRegelingen.length === 0 && (
              <div className="text-center py-12">
                <p className="text-[var(--muted-foreground)]">
                  Geen regelingen gevonden. Probeer een andere zoekterm of categorie.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* CTA */}
        <section className="py-12 md:py-16 px-4 bg-[var(--muted)]">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold">
              Niet zeker waar je recht op hebt?
            </h2>
            <p className="mt-4 text-[var(--muted-foreground)]">
              Start de intake en we helpen je ontdekken welke regelingen bij
              jouw situatie passen.
            </p>
            <div className="mt-6">
              <Link href="/intake">
                <Button size="lg">Start de intake</Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
