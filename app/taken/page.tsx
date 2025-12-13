"use client";

export default function TakenPage() {
  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <div className="px-4 py-6 max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-1">Taken</h1>
          <p className="text-sm text-[var(--muted-foreground)]">
            Beheer je aanvragen en acties
          </p>
        </div>

        {/* Coming soon */}
        <div className="flex flex-col items-center justify-center py-16">
          <div className="w-16 h-16 bg-[var(--muted)] rounded-full flex items-center justify-center mb-4">
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
                d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-lg font-semibold mb-2">Coming soon</h2>
          <p className="text-sm text-[var(--muted-foreground)] text-center max-w-xs">
            Hier kun je binnenkort je taken en aanvragen beheren.
          </p>
        </div>
      </div>
    </div>
  );
}
