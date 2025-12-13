"use client";

import { useState, useEffect, useMemo } from "react";

// Categories for filtering (matches the database)
export const CATEGORIES = [
  { value: "all", label: "Alle categorieën" },
  { value: "toeslagen", label: "Toeslagen" },
  { value: "uitkeringen", label: "Uitkeringen" },
  { value: "kindregelingen", label: "Kindregelingen" },
  { value: "wonen", label: "Wonen" },
];

// Frontend regeling type that matches what the UI expects
export interface RegelingFrontend {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  category: string;
  provider: string;
  maxBedrag?: string;
  requirements: string[];
  documentsNeeded: string[];
  aanvraagUrl?: string;
  lastUpdated: string;
  isActive: boolean;
}

// Transform DB regeling to frontend format
interface DBRegeling {
  id: string;
  slug: string;
  title: string;
  eligible_for: string[];
  min_age: number | null;
  max_age: number | null;
  details: {
    description: string;
    short_description?: string;
    category: string;
    requirements: string[];
    documents_needed: string[];
    source_url: string;
    provider: string;
    how_to_apply: string;
    estimated_amount?: string;
    impact_score?: number;
  };
  is_active: boolean;
  created_at: string;
}

function transformRegeling(regeling: DBRegeling): RegelingFrontend {
  const details = regeling.details;

  return {
    id: regeling.id,
    slug: regeling.slug,
    name: regeling.title,
    shortDescription: details.short_description || details.description?.slice(0, 120) + "...",
    description: details.description,
    category: details.category,
    provider: details.provider,
    maxBedrag: details.estimated_amount,
    requirements: details.requirements || [],
    documentsNeeded: details.documents_needed || [],
    aanvraagUrl: details.source_url,
    lastUpdated: regeling.created_at,
    isActive: regeling.is_active,
  };
}

interface UseRegelingenOptions {
  category?: string;
  searchQuery?: string;
}

export function useRegelingen(options: UseRegelingenOptions = {}) {
  const [allRegelingen, setAllRegelingen] = useState<RegelingFrontend[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const { category = "all", searchQuery = "" } = options;

  // Fetch regelingen from API
  useEffect(() => {
    async function fetchRegelingen() {
      try {
        setIsLoading(true);
        const response = await fetch("/api/regelingen");
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || "Failed to fetch regelingen");
        }

        const transformed = (result.data || []).map(transformRegeling);
        setAllRegelingen(transformed);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Unknown error"));
        console.error("Error fetching regelingen:", err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchRegelingen();
  }, []);

  // Filter regelingen based on search and category
  const regelingen = useMemo(() => {
    return allRegelingen.filter((regeling) => {
      const matchesSearch =
        searchQuery === "" ||
        regeling.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        regeling.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        regeling.shortDescription.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        category === "all" || regeling.category === category;

      return matchesSearch && matchesCategory && regeling.isActive;
    });
  }, [allRegelingen, category, searchQuery]);

  const getRegelingBySlug = (slug: string): RegelingFrontend | undefined => {
    return allRegelingen.find((r) => r.slug === slug);
  };

  const getRegelingById = (id: string): RegelingFrontend | undefined => {
    return allRegelingen.find((r) => r.id === id);
  };

  return {
    regelingen,
    allRegelingen,
    categories: CATEGORIES,
    isLoading,
    error,
    getRegelingBySlug,
    getRegelingById,
  };
}
