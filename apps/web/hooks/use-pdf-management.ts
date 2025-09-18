"use client";

import { usePersistentPdfState } from "./use-persistent-pdf-state";

interface UsePdfManagementOptions {
  rightPanelCategory: string | null;
}

interface UsePdfManagementReturn {
  currentPdfBlob: Blob | null;
  setPdfBlob: (blob: Blob | null) => void;
  clearPdfBlob: () => void;
  restorePdfFromStorage: () => Promise<void>;
  isLoaded: boolean;
}

/**
 * Custom hook for managing PDF blobs with persistent state across navigation
 * Uses localStorage directly - no context provider needed
 */
export function usePdfManagement({
  rightPanelCategory,
}: UsePdfManagementOptions): UsePdfManagementReturn {
  const { currentPdfBlob, setPdfBlob, clearPdfBlob, isLoaded } =
    usePersistentPdfState({
      rightPanelCategory,
    });

  // Legacy method for backward compatibility
  const restorePdfFromStorage = async () => {
    // This is now handled by the persistent state hook
  };

  return {
    currentPdfBlob,
    setPdfBlob,
    clearPdfBlob,
    restorePdfFromStorage,
    isLoaded,
  };
}
