"use client";

import { useState, useMemo } from "react";
import { MOCK_MATCHES, type Match } from "@/lib/mock-data";

type MatchStatus = "all" | "potentieel" | "in_behandeling" | "goedgekeurd" | "afgewezen";

interface UseMatchesOptions {
  status?: MatchStatus;
}

export function useMatches(options: UseMatchesOptions = {}) {
  const [isLoading] = useState(false);
  const [error] = useState<Error | null>(null);

  const { status = "all" } = options;

  const matches = useMemo(() => {
    if (status === "all") {
      return MOCK_MATCHES;
    }
    return MOCK_MATCHES.filter((match) => match.status === status);
  }, [status]);

  const getMatchById = (id: string): Match | undefined => {
    return MOCK_MATCHES.find((m) => m.id === id);
  };

  const getMatchesByRegelingId = (regelingId: string): Match[] => {
    return MOCK_MATCHES.filter((m) => m.regelingId === regelingId);
  };

  const stats = useMemo(() => {
    return {
      total: MOCK_MATCHES.length,
      potentieel: MOCK_MATCHES.filter((m) => m.status === "potentieel").length,
      inBehandeling: MOCK_MATCHES.filter((m) => m.status === "in_behandeling").length,
      goedgekeurd: MOCK_MATCHES.filter((m) => m.status === "goedgekeurd").length,
      afgewezen: MOCK_MATCHES.filter((m) => m.status === "afgewezen").length,
    };
  }, []);

  return {
    matches,
    stats,
    isLoading,
    error,
    getMatchById,
    getMatchesByRegelingId,
  };
}
