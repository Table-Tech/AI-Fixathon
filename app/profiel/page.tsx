"use client";

import { Button, Card, CardContent, Avatar } from "@/components/ui";
import Link from "next/link";
import { useState } from "react";

export default function ProfielPage() {
  const [isLoggedIn] = useState(false); // Will be connected to auth later

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen pb-20 md:pb-0">
        <div className="px-4 py-6 max-w-3xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold mb-1">Profiel</h1>
            <p className="text-sm text-[var(--muted-foreground)]">
              Beheer je account en instellingen
            </p>
          </div>

          {/* Login prompt */}
          <Card className="mb-6">
            <CardContent className="pt-6 text-center">
              <div className="w-16 h-16 bg-[var(--muted)] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-[var(--muted-foreground)]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                  />
                </svg>
              </div>
              <h2 className="text-lg font-semibold mb-2">Log in of maak een account</h2>
              <p className="text-sm text-[var(--muted-foreground)] mb-4">
                Sla je voortgang op en krijg toegang tot persoonlijke matches
              </p>
              <Link href="/login">
                <Button className="w-full mb-2">Inloggen</Button>
              </Link>
              <Link href="/assistent">
                <Button variant="outline" className="w-full">
                  Eerst de assistent proberen
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Settings that don't require login */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-[var(--muted-foreground)] px-1">
              Instellingen
            </h3>

            <Card>
              <CardContent className="p-0">
                <SettingsItem
                  icon={
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.5 21l5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 016-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 01-3.827-5.802" />
                    </svg>
                  }
                  label="Taal"
                  value="Nederlands"
                />
                <SettingsItem
                  icon={
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
                    </svg>
                  }
                  label="Weergave"
                  value="Systeem"
                />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-0">
                <Link href="/privacy">
                  <SettingsItem
                    icon={
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                      </svg>
                    }
                    label="Privacy"
                    showArrow
                  />
                </Link>
                <Link href="/voorwaarden">
                  <SettingsItem
                    icon={
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                      </svg>
                    }
                    label="Voorwaarden"
                    showArrow
                  />
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Logged in state
  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <div className="px-4 py-6 max-w-3xl mx-auto">
        {/* Header with user info */}
        <div className="flex items-center gap-4 mb-6">
          <Avatar fallback="MV" size="lg" className="w-16 h-16 text-xl" />
          <div>
            <h1 className="text-xl font-bold">Maria de Vries</h1>
            <p className="text-sm text-[var(--muted-foreground)]">maria@email.nl</p>
          </div>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <Card>
            <CardContent className="p-3 text-center">
              <p className="text-2xl font-bold text-[var(--primary)]">3</p>
              <p className="text-xs text-[var(--muted-foreground)]">Matches</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 text-center">
              <p className="text-2xl font-bold text-[var(--primary)]">1</p>
              <p className="text-xs text-[var(--muted-foreground)]">Aanvragen</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 text-center">
              <p className="text-2xl font-bold text-[var(--primary)]">2</p>
              <p className="text-xs text-[var(--muted-foreground)]">Documenten</p>
            </CardContent>
          </Card>
        </div>

        {/* Menu items */}
        <div className="space-y-3">
          <Card>
            <CardContent className="p-0">
              <SettingsItem
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                }
                label="Mijn gegevens"
                showArrow
              />
              <SettingsItem
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                  </svg>
                }
                label="Mijn documenten"
                showArrow
              />
              <SettingsItem
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                  </svg>
                }
                label="Meldingen"
                showArrow
              />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-0">
              <SettingsItem
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.5 21l5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 016-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 01-3.827-5.802" />
                  </svg>
                }
                label="Taal"
                value="Nederlands"
              />
              <SettingsItem
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
                  </svg>
                }
                label="Weergave"
                value="Systeem"
              />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-0">
              <Link href="/privacy">
                <SettingsItem
                  icon={
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                    </svg>
                  }
                  label="Privacy"
                  showArrow
                />
              </Link>
            </CardContent>
          </Card>

          <Card className="border-[var(--destructive)]/20">
            <CardContent className="p-0">
              <button className="w-full cursor-pointer">
                <SettingsItem
                  icon={
                    <svg className="w-5 h-5 text-[var(--destructive)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                    </svg>
                  }
                  label="Uitloggen"
                  labelClassName="text-[var(--destructive)]"
                />
              </button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

interface SettingsItemProps {
  icon: React.ReactNode;
  label: string;
  value?: string;
  showArrow?: boolean;
  labelClassName?: string;
}

function SettingsItem({ icon, label, value, showArrow, labelClassName }: SettingsItemProps) {
  return (
    <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[var(--border)] last:border-0">
      <div className="text-[var(--muted-foreground)]">{icon}</div>
      <span className={`flex-1 font-medium ${labelClassName || ""}`}>{label}</span>
      {value && <span className="text-sm text-[var(--muted-foreground)]">{value}</span>}
      {showArrow && (
        <svg className="w-5 h-5 text-[var(--muted-foreground)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      )}
    </div>
  );
}
