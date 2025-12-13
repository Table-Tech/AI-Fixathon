"use client";

import { Header, Footer } from "@/components/layout";
import { Button, Card, CardContent, Input } from "@/components/ui";
import Link from "next/link";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call - will be replaced with Supabase magic link
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsLoading(false);
    setIsSent(true);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            {!isSent ? (
              <>
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-[var(--primary)] rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-2xl">HW</span>
                  </div>
                  <h1 className="text-2xl font-bold">Welkom terug</h1>
                  <p className="mt-2 text-[var(--muted-foreground)]">
                    Vul je e-mailadres in om in te loggen
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input
                    type="email"
                    label="E-mailadres"
                    placeholder="jouw@email.nl"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isLoading || !email}
                  >
                    {isLoading ? "Bezig met versturen..." : "Verstuur inloglink"}
                  </Button>
                </form>

                <div className="mt-6 text-center">
                  <p className="text-sm text-[var(--muted-foreground)]">
                    Nog geen account?{" "}
                    <Link
                      href="/intake"
                      className="text-[var(--primary)] hover:underline"
                    >
                      Start de intake
                    </Link>
                  </p>
                </div>

                <div className="mt-8 pt-6 border-t border-[var(--border)]">
                  <p className="text-xs text-center text-[var(--muted-foreground)]">
                    We sturen je een beveiligde link waarmee je direct kunt
                    inloggen. Geen wachtwoord nodig.
                  </p>
                </div>
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
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold mb-2">Check je inbox!</h2>
                <p className="text-[var(--muted-foreground)] mb-6">
                  We hebben een inloglink gestuurd naar:
                </p>
                <p className="font-medium text-lg mb-6">{email}</p>
                <p className="text-sm text-[var(--muted-foreground)]">
                  Klik op de link in de e-mail om in te loggen. De link is 15
                  minuten geldig.
                </p>

                <Button
                  variant="outline"
                  className="mt-6"
                  onClick={() => {
                    setIsSent(false);
                    setEmail("");
                  }}
                >
                  Ander e-mailadres gebruiken
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
