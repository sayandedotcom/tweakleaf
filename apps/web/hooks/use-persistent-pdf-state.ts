"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { navigation } from "@/configs/navigation";

interface UsePersistentPdfStateOptions {
  rightPanelCategory: string | null;
}

interface UsePersistentPdfStateReturn {
  currentPdfBlob: Blob | null;
  setPdfBlob: (blob: Blob | null) => void;
  clearPdfBlob: () => void;
  isLoaded: boolean;
}

/**
 * Hook that manages PDF state with localStorage persistence
 * No context provider needed - uses localStorage directly
 */
export function usePersistentPdfState({
  rightPanelCategory,
}: UsePersistentPdfStateOptions): UsePersistentPdfStateReturn {
  const [resumePdfBlob, setResumePdfBlob] = useState<Blob | null>(null);
  const [coverLetterPdfBlob, setCoverLetterPdfBlob] = useState<Blob | null>(
    null,
  );
  const [isLoaded, setIsLoaded] = useState(false);

  // Get the current PDF blob based on document type
  const currentPdfBlob = useMemo(
    () =>
      rightPanelCategory === navigation.RIGHT_PANEL.RESUME
        ? resumePdfBlob
        : coverLetterPdfBlob,
    [rightPanelCategory, resumePdfBlob, coverLetterPdfBlob],
  );

  // Load PDF from localStorage on mount
  useEffect(() => {
    const loadPdfFromStorage = async () => {
      try {
        const storageKey =
          rightPanelCategory === navigation.RIGHT_PANEL.RESUME
            ? "resumePdfData"
            : "coverLetterPdfData";

        const pdfData = localStorage.getItem(storageKey);

        if (pdfData) {
          // Convert base64 to blob
          const byteCharacters = atob(pdfData);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], { type: "application/pdf" });

          if (rightPanelCategory === navigation.RIGHT_PANEL.RESUME) {
            setResumePdfBlob(blob);
          } else {
            setCoverLetterPdfBlob(blob);
          }
        }
      } catch (error) {
        console.error("Failed to load PDF from storage:", error);
      } finally {
        setIsLoaded(true);
      }
    };

    loadPdfFromStorage();
  }, [rightPanelCategory]);

  // Set PDF blob for current document type
  const setPdfBlob = useCallback(
    async (blob: Blob | null) => {
      if (rightPanelCategory === navigation.RIGHT_PANEL.RESUME) {
        setResumePdfBlob(blob);
      } else {
        setCoverLetterPdfBlob(blob);
      }

      // Save to localStorage
      if (blob) {
        try {
          const arrayBuffer = await blob.arrayBuffer();
          const base64String = btoa(
            String.fromCharCode(...new Uint8Array(arrayBuffer)),
          );
          const storageKey =
            rightPanelCategory === navigation.RIGHT_PANEL.RESUME
              ? "resumePdfData"
              : "coverLetterPdfData";
          localStorage.setItem(storageKey, base64String);
        } catch (error) {
          console.error("Failed to save PDF to storage:", error);
        }
      } else {
        // Clear from localStorage
        const storageKey =
          rightPanelCategory === navigation.RIGHT_PANEL.RESUME
            ? "resumePdfData"
            : "coverLetterPdfData";
        localStorage.removeItem(storageKey);
      }
    },
    [rightPanelCategory],
  );

  // Clear PDF blob for current document type
  const clearPdfBlob = useCallback(() => {
    if (rightPanelCategory === navigation.RIGHT_PANEL.RESUME) {
      setResumePdfBlob(null);
    } else {
      setCoverLetterPdfBlob(null);
    }

    // Clear from localStorage
    const storageKey =
      rightPanelCategory === navigation.RIGHT_PANEL.RESUME
        ? "resumePdfData"
        : "coverLetterPdfData";
    localStorage.removeItem(storageKey);
  }, [rightPanelCategory]);

  return {
    currentPdfBlob,
    setPdfBlob,
    clearPdfBlob,
    isLoaded,
  };
}
