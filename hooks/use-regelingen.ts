"use client";

import { useState, useMemo } from "react";
import { REGELINGEN, CATEGORIES, type Regeling } from "@/lib/mock-data";

interface UseRegelingenOptions {
  category?: string;
  searchQuery?: string;
}

export function useRegelingen(options: UseRegelingenOptions = {}) {
  const [isLoading] = useState(false);
  const [error] = useState<Error | null>(null);

  const { category = "all", searchQuery = "" } = options;

  const regelingen = useMemo(() => {
    return REGELINGEN.filter((regeling) => {
      const matchesSearch =
        searchQuery === "" ||
        regeling.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        regeling.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        regeling.shortDescription.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        category === "all" || regeling.category === category;

      return matchesSearch && matchesCategory && regeling.isActive;
    });
  }, [category, searchQuery]);

  const getRegelingBySlug = (slug: string): Regeling | undefined => {
    return REGELINGEN.find((r) => r.slug === slug);
  };

  const getRegelingById = (id: string): Regeling | undefined => {
    return REGELINGEN.find((r) => r.id === id);
  };

  return {
    regelingen,
    categories: CATEGORIES,
    isLoading,
    error,
    getRegelingBySlug,
    getRegelingById,
  };
}
