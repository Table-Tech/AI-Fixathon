"use client";

import { useState, useMemo } from "react";
import { MOCK_APPLICATIONS, type Application } from "@/lib/mock-data";

type ApplicationStatus = "all" | "concept" | "in_review" | "ingediend" | "goedgekeurd" | "afgewezen";

interface UseApplicationsOptions {
  status?: ApplicationStatus;
}

export function useApplications(options: UseApplicationsOptions = {}) {
  const [isLoading] = useState(false);
  const [error] = useState<Error | null>(null);

  const { status = "all" } = options;

  const applications = useMemo(() => {
    if (status === "all") {
      return MOCK_APPLICATIONS;
    }
    return MOCK_APPLICATIONS.filter((app) => app.status === status);
  }, [status]);

  const getApplicationById = (id: string): Application | undefined => {
    return MOCK_APPLICATIONS.find((a) => a.id === id);
  };

  const getApplicationsByRegelingId = (regelingId: string): Application[] => {
    return MOCK_APPLICATIONS.filter((a) => a.regelingId === regelingId);
  };

  const stats = useMemo(() => {
    return {
      total: MOCK_APPLICATIONS.length,
      concept: MOCK_APPLICATIONS.filter((a) => a.status === "concept").length,
      inReview: MOCK_APPLICATIONS.filter((a) => a.status === "in_review").length,
      ingediend: MOCK_APPLICATIONS.filter((a) => a.status === "ingediend").length,
      goedgekeurd: MOCK_APPLICATIONS.filter((a) => a.status === "goedgekeurd").length,
      afgewezen: MOCK_APPLICATIONS.filter((a) => a.status === "afgewezen").length,
    };
  }, []);

  // These will be connected to backend later
  const createApplication = async (_regelingId: string) => {
    // Placeholder - will call API
    console.log("Creating application for regeling:", _regelingId);
  };

  const updateApplication = async (_id: string, _data: Partial<Application>) => {
    // Placeholder - will call API
    console.log("Updating application:", _id, _data);
  };

  const deleteApplication = async (_id: string) => {
    // Placeholder - will call API
    console.log("Deleting application:", _id);
  };

  return {
    applications,
    stats,
    isLoading,
    error,
    getApplicationById,
    getApplicationsByRegelingId,
    createApplication,
    updateApplication,
    deleteApplication,
  };
}
