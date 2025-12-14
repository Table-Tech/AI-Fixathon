"use client";

import { Header, Footer } from "@/components/layout";
import { Button, Card, CardContent, Input } from "@/components/ui";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

const VALID_USERNAME = "username";
const VALID_PASSWORD = "username";

export default function DashboardLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if already logged in
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("dashboard_auth") === "true";
    if (isLoggedIn) {
      router.push("/dashboard");
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Simulate a small delay for UX
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (username === VALID_USERNAME && password === VALID_PASSWORD) {
      localStorage.setItem("dashboard_auth", "true");
      router.push("/dashboard");
    } else {
      setError("Onjuiste gebruikersnaam of wachtwoord");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col pb-20 md:pb-0">
      <Header />

      <main className="flex-1 flex items-center justify-center px-4 py-12 bg-[var(--muted)]">
        <div className="w-full max-w-md">
          {/* Back link */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[var(--muted-foreground)] hover:text-[var(--foreground)] mb-4 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Terug naar home
          </Link>

          <Card className="w-full shadow-lg">
            <CardContent className="pt-8 pb-8">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-[var(--primary)] to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h1 className="text-2xl font-bold">Dashboard Login</h1>
                <p className="mt-2 text-[var(--muted-foreground)]">
                  Log in om het dashboard te bekijken
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium mb-2">Gebruikersnaam</label>
                  <input
                    type="text"
                    placeholder="Voer gebruikersnaam in"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Wachtwoord</label>
                  <input
                    type="password"
                    placeholder="Voer wachtwoord in"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-all"
                  />
                </div>

                {error && (
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-200">
                    <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full py-3 text-base font-medium"
                  disabled={isLoading || !username || !password}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Bezig met inloggen...
                    </span>
                  ) : (
                    "Inloggen"
                  )}
                </Button>
              </form>

              <div className="mt-8 pt-6 border-t border-[var(--border)]">
                <div className="flex items-start gap-3 p-4 rounded-lg bg-blue-50 border border-blue-200">
                  <svg className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-blue-800">Demo inloggegevens</p>
                    <p className="text-sm text-blue-600 mt-1">
                      Gebruikersnaam: <code className="bg-blue-100 px-1.5 py-0.5 rounded">username</code><br />
                      Wachtwoord: <code className="bg-blue-100 px-1.5 py-0.5 rounded">username</code>
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
