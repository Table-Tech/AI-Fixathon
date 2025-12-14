"use client";

import { Button, Card, CardContent, Badge, Input } from "@/components/ui";
import { MOCK_DOCUMENTS } from "@/lib/mock-data";
import { useState } from "react";
import Link from "next/link";

export default function DocumentenPage() {
  const [isDragging, setIsDragging] = useState(false);

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "inkomen":
        return "Inkomen";
      case "identiteit":
        return "Identiteit";
      case "wonen":
        return "Wonen";
      case "gezin":
        return "Gezin";
      case "overig":
        return "Overig";
      default:
        return category;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    // Handle file drop - will be implemented with backend
  };

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
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
          <h1 className="text-2xl md:text-3xl font-bold">Mijn documenten</h1>
          <p className="mt-2 text-[var(--muted-foreground)]">
            Upload en beheer je documenten voor aanvragen.
          </p>
        </div>

        {/* Upload area */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                isDragging
                  ? "border-[var(--primary)] bg-[var(--primary)]/5"
                  : "border-[var(--border)]"
              }`}
            >
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
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
              </div>
              <h3 className="font-semibold mb-2">Sleep bestanden hierheen</h3>
              <p className="text-sm text-[var(--muted-foreground)] mb-4">
                of klik om bestanden te selecteren
              </p>
              <input
                type="file"
                multiple
                className="hidden"
                id="file-upload"
                accept=".pdf,.jpg,.jpeg,.png"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <span className="inline-flex items-center justify-center px-4 py-2 rounded-lg border border-[var(--border)] bg-transparent hover:bg-[var(--muted)] font-medium transition-colors">
                  Selecteer bestanden
                </span>
              </label>
              <p className="text-xs text-[var(--muted-foreground)] mt-4">
                Ondersteunde formaten: PDF, JPG, PNG (max 10MB per bestand)
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Categories */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {["inkomen", "identiteit", "wonen", "gezin", "overig"].map((category) => {
            const count = MOCK_DOCUMENTS.filter((d) => d.category === category).length;
            return (
              <Card key={category} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="pt-6 text-center">
                  <p className="font-medium">{getCategoryLabel(category)}</p>
                  <p className="text-2xl font-bold mt-1">{count}</p>
                  <p className="text-xs text-[var(--muted-foreground)]">documenten</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Document list */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <h2 className="text-lg font-semibold">Alle documenten</h2>
              <Input
                placeholder="Zoek documenten..."
                className="sm:w-64"
              />
            </div>

            {MOCK_DOCUMENTS.length > 0 ? (
              <div className="space-y-3">
                {MOCK_DOCUMENTS.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center gap-4 p-4 rounded-lg border border-[var(--border)] hover:bg-[var(--muted)]/50 transition-colors"
                  >
                    {/* Icon */}
                    <div className="w-12 h-12 bg-[var(--muted)] rounded-lg flex items-center justify-center flex-shrink-0">
                      {doc.type === "application/pdf" ? (
                        <svg
                          className="w-6 h-6 text-red-500"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm-1 2l5 5h-5V4zm-3 9h2v5H10v-5zm-4 0h2v5H6v-5zm8 0h2v5h-2v-5z" />
                        </svg>
                      ) : (
                        <svg
                          className="w-6 h-6 text-blue-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{doc.name}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <Badge variant="secondary" className="text-xs">
                          {getCategoryLabel(doc.category)}
                        </Badge>
                        <span className="text-xs text-[var(--muted-foreground)]">
                          {formatFileSize(doc.size)}
                        </span>
                        <span className="text-xs text-[var(--muted-foreground)]">
                          {doc.uploadedAt.toLocaleDateString("nl-NL")}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                          />
                        </svg>
                      </Button>
                      <Button variant="ghost" size="sm">
                        <svg
                          className="w-4 h-4 text-[var(--destructive)]"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-[var(--muted-foreground)]">
                  Je hebt nog geen documenten geüpload.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
