import { Button, Card, CardContent, CardHeader, Badge, Progress } from "@/components/ui";
import { MOCK_MATCHES, MOCK_APPLICATIONS, MOCK_DOCUMENTS } from "@/lib/mock-data";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold">Welkom terug, Maria</h1>
          <p className="mt-2 text-[var(--muted-foreground)]">
            Hier is een overzicht van je regelingen en aanvragen.
          </p>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-[var(--muted-foreground)]">Matches</p>
              <p className="text-3xl font-bold mt-1">{MOCK_MATCHES.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-[var(--muted-foreground)]">Aanvragen</p>
              <p className="text-3xl font-bold mt-1">{MOCK_APPLICATIONS.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-[var(--muted-foreground)]">Documenten</p>
              <p className="text-3xl font-bold mt-1">{MOCK_DOCUMENTS.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-[var(--muted-foreground)]">Profiel</p>
              <p className="text-3xl font-bold mt-1">80%</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recent matches */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Recente matches</h2>
                <Link href="/dashboard/matches">
                  <Button variant="ghost" size="sm">
                    Bekijk alle
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {MOCK_MATCHES.slice(0, 3).map((match) => (
                  <div
                    key={match.id}
                    className="flex items-center justify-between p-3 rounded-lg border border-[var(--border)]"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{match.regeling.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Progress value={match.matchScore} className="w-20 h-1.5" />
                        <span className="text-xs text-[var(--muted-foreground)]">
                          {match.matchScore}% match
                        </span>
                      </div>
                    </div>
                    <Badge
                      variant={
                        match.status === "potentieel"
                          ? "secondary"
                          : match.status === "in_behandeling"
                          ? "warning"
                          : "success"
                      }
                    >
                      {match.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent applications */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Lopende aanvragen</h2>
                <Link href="/dashboard/aanvragen">
                  <Button variant="ghost" size="sm">
                    Bekijk alle
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {MOCK_APPLICATIONS.length > 0 ? (
                <div className="space-y-4">
                  {MOCK_APPLICATIONS.map((app) => (
                    <div
                      key={app.id}
                      className="p-3 rounded-lg border border-[var(--border)]"
                    >
                      <div className="flex items-center justify-between">
                        <p className="font-medium">{app.regeling.name}</p>
                        <Badge
                          variant={
                            app.status === "concept"
                              ? "secondary"
                              : app.status === "in_review"
                              ? "warning"
                              : "success"
                          }
                        >
                          {app.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-[var(--muted-foreground)] mt-1">
                        Laatst bijgewerkt:{" "}
                        {app.updatedAt.toLocaleDateString("nl-NL")}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-[var(--muted-foreground)]">
                    Je hebt nog geen lopende aanvragen.
                  </p>
                  <Link href="/dashboard/matches">
                    <Button variant="outline" size="sm" className="mt-4">
                      Bekijk je matches
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick actions */}
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold">Snelle acties</h2>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                <Link href="/dashboard/intake">
                  <Button variant="outline" className="w-full h-auto py-4 flex flex-col gap-2">
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                    <span className="text-sm">Nieuwe intake</span>
                  </Button>
                </Link>
                <Link href="/dashboard/documenten">
                  <Button variant="outline" className="w-full h-auto py-4 flex flex-col gap-2">
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                    <span className="text-sm">Upload document</span>
                  </Button>
                </Link>
                <Link href="/regelingen">
                  <Button variant="outline" className="w-full h-auto py-4 flex flex-col gap-2">
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                    <span className="text-sm">Zoek regelingen</span>
                  </Button>
                </Link>
                <Link href="/dashboard/profiel">
                  <Button variant="outline" className="w-full h-auto py-4 flex flex-col gap-2">
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    <span className="text-sm">Bewerk profiel</span>
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Recent documents */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Recente documenten</h2>
                <Link href="/dashboard/documenten">
                  <Button variant="ghost" size="sm">
                    Bekijk alle
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {MOCK_DOCUMENTS.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center gap-3 p-3 rounded-lg border border-[var(--border)]"
                  >
                    <div className="w-10 h-10 bg-[var(--muted)] rounded-lg flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-[var(--muted-foreground)]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{doc.name}</p>
                      <p className="text-sm text-[var(--muted-foreground)]">
                        {doc.uploadedAt.toLocaleDateString("nl-NL")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
