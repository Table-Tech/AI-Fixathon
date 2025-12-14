"use client";

import { Button, Card, CardContent, CardHeader, Input, Avatar, Progress } from "@/components/ui";
import { useState } from "react";
import Link from "next/link";

export default function ProfielPage() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    fullName: "Maria de Vries",
    email: "maria@email.nl",
    phone: "06-12345678",
    address: "Voorbeeldstraat 123",
    postalCode: "1234 AB",
    city: "Amsterdam",
    dateOfBirth: "1985-03-15",
  });

  const profileCompletion = 80;

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Back link */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-[var(--muted-foreground)] hover:text-[var(--foreground)] mb-4 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Terug naar dashboard
        </Link>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold">Mijn profiel</h1>
          <p className="mt-2 text-[var(--muted-foreground)]">
            Beheer je persoonlijke gegevens en instellingen.
          </p>
        </div>

        {/* Profile completion */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex-1">
                <h3 className="font-semibold">Profiel compleetheid</h3>
                <p className="text-sm text-[var(--muted-foreground)]">
                  Vul je profiel aan om betere matches te krijgen
                </p>
              </div>
              <div className="flex items-center gap-4 sm:w-48">
                <Progress value={profileCompletion} className="flex-1" />
                <span className="font-semibold">{profileCompletion}%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Profile card */}
          <Card className="lg:col-span-1">
            <CardContent className="pt-6 text-center">
              <Avatar
                fallback="MV"
                size="lg"
                className="mx-auto mb-4 w-24 h-24 text-2xl"
              />
              <h2 className="text-xl font-semibold">{profile.fullName}</h2>
              <p className="text-[var(--muted-foreground)]">{profile.email}</p>
              <div className="mt-6 pt-6 border-t border-[var(--border)]">
                <Button variant="outline" className="w-full">
                  Foto wijzigen
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Personal info */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Persoonlijke gegevens</h2>
                <Button
                  variant={isEditing ? "primary" : "outline"}
                  size="sm"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  {isEditing ? "Opslaan" : "Bewerken"}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-4">
                <Input
                  label="Volledige naam"
                  value={profile.fullName}
                  onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                  disabled={!isEditing}
                />
                <Input
                  label="E-mailadres"
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  disabled={!isEditing}
                />
                <Input
                  label="Telefoonnummer"
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  disabled={!isEditing}
                />
                <Input
                  label="Geboortedatum"
                  type="date"
                  value={profile.dateOfBirth}
                  onChange={(e) => setProfile({ ...profile, dateOfBirth: e.target.value })}
                  disabled={!isEditing}
                />
                <Input
                  label="Adres"
                  value={profile.address}
                  onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                  disabled={!isEditing}
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Postcode"
                    value={profile.postalCode}
                    onChange={(e) => setProfile({ ...profile, postalCode: e.target.value })}
                    disabled={!isEditing}
                  />
                  <Input
                    label="Plaats"
                    value={profile.city}
                    onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Situation */}
          <Card className="lg:col-span-3">
            <CardHeader>
              <h2 className="text-lg font-semibold">Mijn situatie</h2>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="p-4 rounded-lg border border-[var(--border)]">
                  <h3 className="font-medium mb-2">Gezinssituatie</h3>
                  <p className="text-[var(--muted-foreground)]">Alleenstaande ouder</p>
                  <p className="text-sm text-[var(--muted-foreground)] mt-1">
                    2 kinderen (8 en 12 jaar)
                  </p>
                </div>
                <div className="p-4 rounded-lg border border-[var(--border)]">
                  <h3 className="font-medium mb-2">Woonsituatie</h3>
                  <p className="text-[var(--muted-foreground)]">Huurwoning</p>
                  <p className="text-sm text-[var(--muted-foreground)] mt-1">
                    Huur: € 850/maand
                  </p>
                </div>
                <div className="p-4 rounded-lg border border-[var(--border)]">
                  <h3 className="font-medium mb-2">Werksituatie</h3>
                  <p className="text-[var(--muted-foreground)]">Parttime werkend</p>
                  <p className="text-sm text-[var(--muted-foreground)] mt-1">
                    24 uur per week
                  </p>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-[var(--border)]">
                <Button variant="outline">Situatie bijwerken</Button>
              </div>
            </CardContent>
          </Card>

          {/* Privacy settings */}
          <Card className="lg:col-span-3">
            <CardHeader>
              <h2 className="text-lg font-semibold">Privacy & beveiliging</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg border border-[var(--border)]">
                  <div>
                    <h3 className="font-medium">Wachtwoord wijzigen</h3>
                    <p className="text-sm text-[var(--muted-foreground)]">
                      Wij gebruiken passwordless login met magic links
                    </p>
                  </div>
                  <Button variant="outline" size="sm" disabled>
                    Niet van toepassing
                  </Button>
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg border border-[var(--border)]">
                  <div>
                    <h3 className="font-medium">Download mijn gegevens</h3>
                    <p className="text-sm text-[var(--muted-foreground)]">
                      Download al je opgeslagen gegevens
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Downloaden
                  </Button>
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg border border-[var(--border)]">
                  <div>
                    <h3 className="font-medium text-[var(--destructive)]">
                      Account verwijderen
                    </h3>
                    <p className="text-sm text-[var(--muted-foreground)]">
                      Verwijder je account en alle gegevens permanent
                    </p>
                  </div>
                  <Button variant="destructive" size="sm">
                    Verwijderen
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
