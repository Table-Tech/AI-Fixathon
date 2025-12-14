"use client";

import { Card, CardContent, CardHeader, Badge, Button } from "@/components/ui";
import Link from "next/link";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

interface Hulpvraag {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  status: "nieuw" | "in_behandeling" | "afgerond";
  created_at: string;
  updated_at?: string;
}

export default function HulpvragenPage() {
  const [hulpvragen, setHulpvragen] = useState<Hulpvraag[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedVraag, setSelectedVraag] = useState<Hulpvraag | null>(null);
  const [filter, setFilter] = useState<"alle" | "nieuw" | "in_behandeling" | "afgerond">("alle");
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    loadHulpvragen();
  }, []);

  async function loadHulpvragen() {
    try {
      const { data, error } = await supabase
        .from("contact_requests")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      setHulpvragen(
        (data || []).map((h) => ({
          id: h.id,
          name: h.name || "Onbekend",
          email: h.email || "",
          phone: h.phone,
          subject: h.subject,
          message: h.message || "",
          status: h.status || "nieuw",
          created_at: h.created_at,
          updated_at: h.updated_at,
        }))
      );
    } catch (error) {
      console.error("Error loading hulpvragen:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function updateStatus(id: string, newStatus: Hulpvraag["status"]) {
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from("contact_requests")
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq("id", id);

      if (error) throw error;

      setHulpvragen((prev) =>
        prev.map((h) => (h.id === id ? { ...h, status: newStatus } : h))
      );

      if (selectedVraag?.id === id) {
        setSelectedVraag({ ...selectedVraag, status: newStatus });
      }
    } catch (error) {
      console.error("Error updating status:", error);
    } finally {
      setIsUpdating(false);
    }
  }

  const filteredHulpvragen = hulpvragen.filter((h) => {
    if (filter === "alle") return true;
    return h.status === filter;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "nieuw":
        return <Badge variant="destructive">Nieuw</Badge>;
      case "in_behandeling":
        return <Badge variant="warning">In behandeling</Badge>;
      case "afgerond":
        return <Badge variant="success">Afgerond</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("nl-NL", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const counts = {
    alle: hulpvragen.length,
    nieuw: hulpvragen.filter((h) => h.status === "nieuw").length,
    in_behandeling: hulpvragen.filter((h) => h.status === "in_behandeling").length,
    afgerond: hulpvragen.filter((h) => h.status === "afgerond").length,
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
            <span>Hulpvragen</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold">Hulpvragen</h1>
          <p className="mt-2 text-[var(--muted-foreground)]">
            Beheer en beantwoord binnenkomende vragen van gebruikers
          </p>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {(["alle", "nieuw", "in_behandeling", "afgerond"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === f
                  ? "bg-[var(--primary)] text-white"
                  : "bg-[var(--background)] border border-[var(--border)] hover:bg-[var(--muted)]"
              }`}
            >
              {f === "alle" ? "Alle" : f === "nieuw" ? "Nieuw" : f === "in_behandeling" ? "In behandeling" : "Afgerond"}
              <span className="ml-2 px-2 py-0.5 rounded-full bg-white/20 text-xs">
                {counts[f]}
              </span>
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* List */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-0">
                {filteredHulpvragen.length > 0 ? (
                  <div className="divide-y divide-[var(--border)]">
                    {filteredHulpvragen.map((vraag) => (
                      <button
                        key={vraag.id}
                        onClick={() => setSelectedVraag(vraag)}
                        className={`w-full text-left p-4 hover:bg-[var(--muted)] transition-colors ${
                          selectedVraag?.id === vraag.id ? "bg-[var(--muted)]" : ""
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-medium truncate">{vraag.name}</p>
                          {getStatusBadge(vraag.status)}
                        </div>
                        <p className="text-sm text-[var(--muted-foreground)] truncate">
                          {vraag.subject || vraag.message.substring(0, 40) + "..."}
                        </p>
                        <p className="text-xs text-[var(--muted-foreground)] mt-1">
                          {formatDate(vraag.created_at)}
                        </p>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-12 h-12 rounded-full bg-[var(--muted)] flex items-center justify-center mx-auto mb-3">
                      <svg className="w-6 h-6 text-[var(--muted-foreground)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                      </svg>
                    </div>
                    <p className="text-[var(--muted-foreground)]">
                      Geen hulpvragen gevonden
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Detail view */}
          <div className="lg:col-span-2">
            {selectedVraag ? (
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h2 className="text-xl font-semibold">{selectedVraag.name}</h2>
                        {getStatusBadge(selectedVraag.status)}
                      </div>
                      <p className="text-sm text-[var(--muted-foreground)]">
                        Ontvangen op {formatDate(selectedVraag.created_at)}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Contact info */}
                  <div className="grid sm:grid-cols-2 gap-4 mb-6 p-4 rounded-lg bg-[var(--muted)]">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs text-[var(--muted-foreground)]">E-mail</p>
                        <a href={`mailto:${selectedVraag.email}`} className="text-sm font-medium hover:text-[var(--primary)]">
                          {selectedVraag.email}
                        </a>
                      </div>
                    </div>
                    {selectedVraag.phone && (
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                          <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-xs text-[var(--muted-foreground)]">Telefoon</p>
                          <a href={`tel:${selectedVraag.phone}`} className="text-sm font-medium hover:text-[var(--primary)]">
                            {selectedVraag.phone}
                          </a>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Subject */}
                  {selectedVraag.subject && (
                    <div className="mb-4">
                      <p className="text-sm font-medium text-[var(--muted-foreground)] mb-1">Onderwerp</p>
                      <p className="font-medium">{selectedVraag.subject}</p>
                    </div>
                  )}

                  {/* Message */}
                  <div className="mb-6">
                    <p className="text-sm font-medium text-[var(--muted-foreground)] mb-2">Bericht</p>
                    <div className="p-4 rounded-lg border border-[var(--border)] bg-[var(--background)]">
                      <p className="whitespace-pre-wrap">{selectedVraag.message}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-3 pt-4 border-t border-[var(--border)]">
                    <p className="w-full text-sm font-medium text-[var(--muted-foreground)] mb-1">Status wijzigen</p>

                    {selectedVraag.status !== "nieuw" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateStatus(selectedVraag.id, "nieuw")}
                        disabled={isUpdating}
                      >
                        Markeer als nieuw
                      </Button>
                    )}

                    {selectedVraag.status !== "in_behandeling" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateStatus(selectedVraag.id, "in_behandeling")}
                        disabled={isUpdating}
                        className="border-orange-300 text-orange-600 hover:bg-orange-50"
                      >
                        In behandeling nemen
                      </Button>
                    )}

                    {selectedVraag.status !== "afgerond" && (
                      <Button
                        size="sm"
                        onClick={() => updateStatus(selectedVraag.id, "afgerond")}
                        disabled={isUpdating}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Markeer als afgerond
                      </Button>
                    )}
                  </div>

                  {/* Quick reply */}
                  <div className="mt-6 pt-4 border-t border-[var(--border)]">
                    <a
                      href={`mailto:${selectedVraag.email}?subject=Re: ${selectedVraag.subject || "Uw vraag aan Hulpwijzer"}`}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--primary)] text-white hover:opacity-90 transition-opacity"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                      </svg>
                      Beantwoord via e-mail
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
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium mb-2">Selecteer een hulpvraag</h3>
                    <p className="text-[var(--muted-foreground)]">
                      Klik op een hulpvraag in de lijst om de details te bekijken
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
