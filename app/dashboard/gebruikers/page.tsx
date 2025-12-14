"use client";

import { Card, CardContent, CardHeader, Badge, Button } from "@/components/ui";
import Link from "next/link";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

interface Gebruiker {
  id: string;
  email: string;
  full_name?: string;
  phone?: string;
  created_at: string;
  number_of_children?: number;
  is_single_parent?: boolean;
  employment_status?: string;
  income_range?: string;
  housing_type?: string;
  has_debts?: boolean;
}

export default function GebruikersPage() {
  const [gebruikers, setGebruikers] = useState<Gebruiker[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedGebruiker, setSelectedGebruiker] = useState<Gebruiker | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadGebruikers();
  }, []);

  async function loadGebruikers() {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      setGebruikers(data || []);
    } catch (error) {
      console.error("Error loading users:", error);
    } finally {
      setIsLoading(false);
    }
  }

  const filteredGebruikers = gebruikers.filter((g) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      g.email?.toLowerCase().includes(query) ||
      g.full_name?.toLowerCase().includes(query) ||
      g.phone?.includes(query)
    );
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("nl-NL", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const getProfileCompleteness = (user: Gebruiker) => {
    const fields = [
      user.full_name,
      user.phone,
      user.number_of_children !== undefined,
      user.employment_status,
      user.income_range,
      user.housing_type,
    ];
    const filled = fields.filter(Boolean).length;
    return Math.round((filled / fields.length) * 100);
  };

  const getEmploymentLabel = (status?: string) => {
    const labels: Record<string, string> = {
      employed: "In loondienst",
      self_employed: "Zelfstandig",
      unemployed: "Werkzoekend",
      retired: "Gepensioneerd",
      student: "Student",
      other: "Anders",
    };
    return labels[status || ""] || status || "Onbekend";
  };

  const getIncomeLabel = (range?: string) => {
    const labels: Record<string, string> = {
      "0-1500": "< €1.500",
      "1500-2500": "€1.500 - €2.500",
      "2500-3500": "€2.500 - €3.500",
      "3500-5000": "€3.500 - €5.000",
      "5000+": "> €5.000",
    };
    return labels[range || ""] || range || "Onbekend";
  };

  const getHousingLabel = (type?: string) => {
    const labels: Record<string, string> = {
      rent_social: "Sociale huur",
      rent_private: "Particuliere huur",
      owner: "Koopwoning",
      other: "Anders",
    };
    return labels[type || ""] || type || "Onbekend";
  };

  if (isLoading) {
    return (
      <div className="p-4 md:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-sm text-[var(--muted-foreground)] mb-2">
            <Link href="/dashboard" className="hover:text-[var(--foreground)]">
              Dashboard
            </Link>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span>Gebruikers</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Gebruikers</h1>
              <p className="mt-1 text-[var(--muted-foreground)]">
                {gebruikers.length} geregistreerde gebruikers
              </p>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--muted-foreground)]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Zoek op naam, e-mail of telefoon..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
            />
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* List */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-0">
                {filteredGebruikers.length > 0 ? (
                  <div className="divide-y divide-[var(--border)] max-h-[600px] overflow-y-auto">
                    {filteredGebruikers.map((gebruiker) => (
                      <button
                        key={gebruiker.id}
                        onClick={() => setSelectedGebruiker(gebruiker)}
                        className={`w-full text-left p-4 hover:bg-[var(--muted)] transition-colors ${
                          selectedGebruiker?.id === gebruiker.id ? "bg-[var(--muted)]" : ""
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[var(--primary)] flex items-center justify-center text-white font-medium">
                            {(gebruiker.full_name || gebruiker.email || "?")[0].toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">
                              {gebruiker.full_name || "Naam onbekend"}
                            </p>
                            <p className="text-sm text-[var(--muted-foreground)] truncate">
                              {gebruiker.email}
                            </p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-12 h-12 rounded-full bg-[var(--muted)] flex items-center justify-center mx-auto mb-3">
                      <svg className="w-6 h-6 text-[var(--muted-foreground)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <p className="text-[var(--muted-foreground)]">
                      {searchQuery ? "Geen gebruikers gevonden" : "Nog geen gebruikers"}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Detail view */}
          <div className="lg:col-span-2">
            {selectedGebruiker ? (
              <Card>
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-full bg-[var(--primary)] flex items-center justify-center text-white text-2xl font-medium">
                      {(selectedGebruiker.full_name || selectedGebruiker.email || "?")[0].toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <h2 className="text-xl font-semibold">
                        {selectedGebruiker.full_name || "Naam onbekend"}
                      </h2>
                      <p className="text-[var(--muted-foreground)]">{selectedGebruiker.email}</p>
                      <p className="text-sm text-[var(--muted-foreground)] mt-1">
                        Lid sinds {formatDate(selectedGebruiker.created_at)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-[var(--muted-foreground)]">Profiel compleet</p>
                      <p className="text-2xl font-bold text-[var(--primary)]">
                        {getProfileCompleteness(selectedGebruiker)}%
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Contact info */}
                  <div className="grid sm:grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-[var(--muted)]">
                      <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs text-[var(--muted-foreground)]">E-mail</p>
                        <a href={`mailto:${selectedGebruiker.email}`} className="text-sm font-medium hover:text-[var(--primary)]">
                          {selectedGebruiker.email}
                        </a>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-[var(--muted)]">
                      <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs text-[var(--muted-foreground)]">Telefoon</p>
                        {selectedGebruiker.phone ? (
                          <a href={`tel:${selectedGebruiker.phone}`} className="text-sm font-medium hover:text-[var(--primary)]">
                            {selectedGebruiker.phone}
                          </a>
                        ) : (
                          <p className="text-sm text-[var(--muted-foreground)]">Niet ingevuld</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Profile details */}
                  <h3 className="font-semibold mb-4">Profielgegevens</h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg border border-[var(--border)]">
                      <p className="text-sm text-[var(--muted-foreground)] mb-1">Aantal kinderen</p>
                      <p className="font-medium">
                        {selectedGebruiker.number_of_children !== undefined
                          ? selectedGebruiker.number_of_children === 0
                            ? "Geen kinderen"
                            : `${selectedGebruiker.number_of_children} kind${selectedGebruiker.number_of_children > 1 ? "eren" : ""}`
                          : "Niet ingevuld"}
                      </p>
                    </div>

                    <div className="p-4 rounded-lg border border-[var(--border)]">
                      <p className="text-sm text-[var(--muted-foreground)] mb-1">Alleenstaande ouder</p>
                      <p className="font-medium">
                        {selectedGebruiker.is_single_parent !== undefined
                          ? selectedGebruiker.is_single_parent
                            ? "Ja"
                            : "Nee"
                          : "Niet ingevuld"}
                      </p>
                    </div>

                    <div className="p-4 rounded-lg border border-[var(--border)]">
                      <p className="text-sm text-[var(--muted-foreground)] mb-1">Werksituatie</p>
                      <p className="font-medium">{getEmploymentLabel(selectedGebruiker.employment_status)}</p>
                    </div>

                    <div className="p-4 rounded-lg border border-[var(--border)]">
                      <p className="text-sm text-[var(--muted-foreground)] mb-1">Inkomen</p>
                      <p className="font-medium">{getIncomeLabel(selectedGebruiker.income_range)}</p>
                    </div>

                    <div className="p-4 rounded-lg border border-[var(--border)]">
                      <p className="text-sm text-[var(--muted-foreground)] mb-1">Woonsituatie</p>
                      <p className="font-medium">{getHousingLabel(selectedGebruiker.housing_type)}</p>
                    </div>

                    <div className="p-4 rounded-lg border border-[var(--border)]">
                      <p className="text-sm text-[var(--muted-foreground)] mb-1">Schulden</p>
                      <p className="font-medium">
                        {selectedGebruiker.has_debts !== undefined
                          ? selectedGebruiker.has_debts
                            ? "Ja"
                            : "Nee"
                          : "Niet ingevuld"}
                      </p>
                    </div>
                  </div>

                  {/* Contact action */}
                  <div className="mt-6 pt-4 border-t border-[var(--border)]">
                    <a
                      href={`mailto:${selectedGebruiker.email}`}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--primary)] text-white hover:opacity-90 transition-opacity"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      Contact opnemen
                    </a>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="py-16">
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full bg-[var(--muted)] flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-[var(--muted-foreground)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium mb-2">Selecteer een gebruiker</h3>
                    <p className="text-[var(--muted-foreground)]">
                      Klik op een gebruiker in de lijst om de details te bekijken
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
