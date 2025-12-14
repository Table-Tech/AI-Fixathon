"use client";

import { Card, CardContent, CardHeader, Badge, Button } from "@/components/ui";
import Link from "next/link";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

interface Stats {
  totalUsers: number;
  openHulpvragen: number;
  activeUsers: number;
  completedHulpvragen: number;
}

interface RecentHulpvraag {
  id: string;
  name: string;
  email: string;
  subject: string;
  status: "nieuw" | "in_behandeling" | "afgerond";
  created_at: string;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    openHulpvragen: 0,
    activeUsers: 0,
    completedHulpvragen: 0,
  });
  const [recentHulpvragen, setRecentHulpvragen] = useState<RecentHulpvraag[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        // Load user stats
        const { count: userCount } = await supabase
          .from("profiles")
          .select("*", { count: "exact", head: true });

        // Load contact requests
        const { data: hulpvragen, count: totalHulpvragen } = await supabase
          .from("contact_requests")
          .select("*", { count: "exact" })
          .order("created_at", { ascending: false })
          .limit(5);

        const openCount = hulpvragen?.filter(h => h.status !== "afgerond").length || 0;
        const completedCount = hulpvragen?.filter(h => h.status === "afgerond").length || 0;

        setStats({
          totalUsers: userCount || 0,
          openHulpvragen: openCount,
          activeUsers: Math.floor((userCount || 0) * 0.7), // Estimate active users
          completedHulpvragen: completedCount,
        });

        setRecentHulpvragen(
          (hulpvragen || []).map((h) => ({
            id: h.id,
            name: h.name || "Onbekend",
            email: h.email || "",
            subject: h.subject || h.message?.substring(0, 50) + "..." || "Geen onderwerp",
            status: h.status || "nieuw",
            created_at: h.created_at,
          }))
        );
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

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
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
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
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold">Admin Dashboard</h1>
          <p className="mt-2 text-[var(--muted-foreground)]">
            Overzicht van hulpvragen en gebruikers
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-(--primary) flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-[var(--muted-foreground)]">Gebruikers</p>
                  <p className="text-2xl font-bold">{stats.totalUsers}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-(--primary) flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-[var(--muted-foreground)]">Open vragen</p>
                  <p className="text-2xl font-bold">{stats.openHulpvragen}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-(--primary) flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-[var(--muted-foreground)]">Afgerond</p>
                  <p className="text-2xl font-bold">{stats.completedHulpvragen}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-(--primary) flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-[var(--muted-foreground)]">Actieve gebruikers</p>
                  <p className="text-2xl font-bold">{stats.activeUsers}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Recent hulpvragen */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">Recente hulpvragen</h2>
                  <Link href="/dashboard/hulpvragen">
                    <Button variant="ghost" size="sm">
                      Bekijk alle
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                {recentHulpvragen.length > 0 ? (
                  <div className="space-y-3">
                    {recentHulpvragen.map((vraag) => (
                      <div
                        key={vraag.id}
                        className="flex items-center justify-between p-4 rounded-lg border border-[var(--border)] hover:bg-[var(--muted)] transition-colors"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-medium truncate">{vraag.name}</p>
                            {getStatusBadge(vraag.status)}
                          </div>
                          <p className="text-sm text-[var(--muted-foreground)] truncate">
                            {vraag.subject}
                          </p>
                          <p className="text-xs text-[var(--muted-foreground)] mt-1">
                            {formatDate(vraag.created_at)}
                          </p>
                        </div>
                        <Link href={`/dashboard/hulpvragen?id=${vraag.id}`}>
                          <Button variant="ghost" size="sm">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </Button>
                        </Link>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 rounded-full bg-[var(--muted)] flex items-center justify-center mx-auto mb-3">
                      <svg className="w-6 h-6 text-[var(--muted-foreground)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                      </svg>
                    </div>
                    <p className="text-[var(--muted-foreground)]">
                      Geen hulpvragen ontvangen
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Quick actions */}
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold">Snelle acties</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Link href="/dashboard/hulpvragen" className="block">
                  <Button variant="outline" className="w-full justify-start gap-3 h-auto py-3">
                    <div className="w-8 h-8 rounded-lg bg-(--primary) flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="text-left">
                      <p className="font-medium">Hulpvragen beheren</p>
                      <p className="text-xs text-[var(--muted-foreground)]">Bekijk en beantwoord vragen</p>
                    </div>
                  </Button>
                </Link>

                <Link href="/dashboard/gebruikers" className="block">
                  <Button variant="outline" className="w-full justify-start gap-3 h-auto py-3">
                    <div className="w-8 h-8 rounded-lg bg-(--primary) flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </div>
                    <div className="text-left">
                      <p className="font-medium">Gebruikers bekijken</p>
                      <p className="text-xs text-[var(--muted-foreground)]">Overzicht van alle gebruikers</p>
                    </div>
                  </Button>
                </Link>

                <Link href="/regelingen" className="block">
                  <Button variant="outline" className="w-full justify-start gap-3 h-auto py-3">
                    <div className="w-8 h-8 rounded-lg bg-(--primary) flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <div className="text-left">
                      <p className="font-medium">Regelingen bekijken</p>
                      <p className="text-xs text-[var(--muted-foreground)]">Alle beschikbare toeslagen</p>
                    </div>
                  </Button>
                </Link>

                <Link href="/contact" className="block">
                  <Button variant="outline" className="w-full justify-start gap-3 h-auto py-3">
                    <div className="w-8 h-8 rounded-lg bg-(--primary) flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="text-left">
                      <p className="font-medium">Contact pagina</p>
                      <p className="text-xs text-[var(--muted-foreground)]">Bekijk publieke contactpagina</p>
                    </div>
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
