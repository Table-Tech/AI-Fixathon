"use client";

import { useState, useMemo } from "react";
import { MOCK_DOCUMENTS, type Document } from "@/lib/mock-data";

type DocumentCategory = "all" | "inkomen" | "identiteit" | "wonen" | "gezin" | "overig";

interface UseDocumentsOptions {
  category?: DocumentCategory;
}

export function useDocuments(options: UseDocumentsOptions = {}) {
  const [isLoading] = useState(false);
  const [error] = useState<Error | null>(null);

  const { category = "all" } = options;

  const documents = useMemo(() => {
    if (category === "all") {
      return MOCK_DOCUMENTS;
    }
    return MOCK_DOCUMENTS.filter((doc) => doc.category === category);
  }, [category]);

  const getDocumentById = (id: string): Document | undefined => {
    return MOCK_DOCUMENTS.find((d) => d.id === id);
  };

  const stats = useMemo(() => {
    return {
      total: MOCK_DOCUMENTS.length,
      inkomen: MOCK_DOCUMENTS.filter((d) => d.category === "inkomen").length,
      identiteit: MOCK_DOCUMENTS.filter((d) => d.category === "identiteit").length,
      wonen: MOCK_DOCUMENTS.filter((d) => d.category === "wonen").length,
      gezin: MOCK_DOCUMENTS.filter((d) => d.category === "gezin").length,
      overig: MOCK_DOCUMENTS.filter((d) => d.category === "overig").length,
    };
  }, []);

  // These will be connected to backend later
  const uploadDocument = async (_file: File, _category: DocumentCategory) => {
    // Placeholder - will call API
    console.log("Uploading document:", _file.name, "to category:", _category);
  };

  const deleteDocument = async (_id: string) => {
    // Placeholder - will call API
    console.log("Deleting document:", _id);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  return {
    documents,
    stats,
    isLoading,
    error,
    getDocumentById,
    uploadDocument,
    deleteDocument,
    formatFileSize,
  };
}
