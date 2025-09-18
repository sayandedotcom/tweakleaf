"use client";

import { useState, useEffect, useCallback } from "react";
import { navigation } from "@/configs/navigation";

interface UsePersistentCompilationStateOptions {
  rightPanelCategory: string | null;
}

interface UsePersistentCompilationStateReturn {
  compilationError: string | null;
  hasAttemptedCompilation: boolean;
  lastCompilationTime: number;
  isUserEditing: boolean;
  compilationAttempts: number;
  lastCompiledResumeHash: string | null;
  lastCompiledCoverLetterHash: string | null;
  setCompilationError: (error: string | null) => void;
  setHasAttemptedCompilation: (attempted: boolean) => void;
  setLastCompilationTime: (time: number) => void;
  setIsUserEditing: (editing: boolean) => void;
  setCompilationAttempts: (attempts: number) => void;
  setLastCompiledResumeHash: (hash: string | null) => void;
  setLastCompiledCoverLetterHash: (hash: string | null) => void;
  clearCompilationState: () => void;
  resetCompilationAttempts: () => void;
  generateContentHash: (content: string) => string;
  getCurrentContentHash: (content: string) => string | null;
  shouldAutoCompile: (content: string, isPending: boolean) => boolean;
  isLoaded: boolean;
}

/**
 * Hook that manages compilation state with localStorage persistence
 * No context provider needed - uses localStorage directly
 */
export function usePersistentCompilationState({
  rightPanelCategory,
}: UsePersistentCompilationStateOptions): UsePersistentCompilationStateReturn {
  // Error state management
  const [compilationError, setCompilationError] = useState<string | null>(null);
  const [hasAttemptedCompilation, setHasAttemptedCompilation] = useState(false);
  const [lastCompilationTime, setLastCompilationTime] = useState<number>(0);
  const [isUserEditing, setIsUserEditing] = useState(false);
  const [compilationAttempts, setCompilationAttempts] = useState(0);
  const [lastCompiledResumeHash, setLastCompiledResumeHash] = useState<
    string | null
  >(null);
  const [lastCompiledCoverLetterHash, setLastCompiledCoverLetterHash] =
    useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load state from localStorage on mount
  useEffect(() => {
    try {
      const resumeHash = localStorage.getItem("lastCompiledResumeHash");
      const coverLetterHash = localStorage.getItem(
        "lastCompiledCoverLetterHash",
      );

      if (resumeHash) setLastCompiledResumeHash(resumeHash);
      if (coverLetterHash) setLastCompiledCoverLetterHash(coverLetterHash);
    } catch (error) {
      console.error("Failed to load compilation state from storage:", error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save hashes to localStorage when they change
  useEffect(() => {
    if (lastCompiledResumeHash) {
      localStorage.setItem("lastCompiledResumeHash", lastCompiledResumeHash);
    }
  }, [lastCompiledResumeHash]);

  useEffect(() => {
    if (lastCompiledCoverLetterHash) {
      localStorage.setItem(
        "lastCompiledCoverLetterHash",
        lastCompiledCoverLetterHash,
      );
    }
  }, [lastCompiledCoverLetterHash]);

  // Helper function to generate a simple hash of content
  const generateContentHash = useCallback((content: string): string => {
    return btoa(encodeURIComponent(content)).slice(0, 16);
  }, []);

  // Get current content hash based on document type
  const getCurrentContentHash = useCallback(
    (content: string): string | null => {
      if (!content || !content.trim()) return null;
      return generateContentHash(content);
    },
    [generateContentHash],
  );

  // Clear all compilation state
  const clearCompilationState = useCallback(() => {
    setCompilationError(null);
    setHasAttemptedCompilation(false);
    setCompilationAttempts(0);
    setLastCompilationTime(Date.now());
  }, []);

  // Reset only compilation attempts
  const resetCompilationAttempts = useCallback(() => {
    setCompilationAttempts(0);
    setHasAttemptedCompilation(false);
    setCompilationError(null);
  }, []);

  // Determine if auto-compilation should occur
  const shouldAutoCompile = useCallback(
    (content: string, isPending: boolean): boolean => {
      if (!content || !content.trim() || isPending) return false;

      const now = Date.now();
      const currentContentHash = getCurrentContentHash(content);
      const lastHash =
        rightPanelCategory === navigation.RIGHT_PANEL.RESUME
          ? lastCompiledResumeHash
          : lastCompiledCoverLetterHash;

      return (
        !compilationError &&
        !hasAttemptedCompilation &&
        now - lastCompilationTime >= 2000 &&
        !isUserEditing &&
        compilationAttempts < 3 &&
        currentContentHash !== lastHash
      );
    },
    [
      compilationError,
      hasAttemptedCompilation,
      lastCompilationTime,
      isUserEditing,
      compilationAttempts,
      rightPanelCategory,
      lastCompiledResumeHash,
      lastCompiledCoverLetterHash,
      getCurrentContentHash,
    ],
  );

  return {
    compilationError,
    hasAttemptedCompilation,
    lastCompilationTime,
    isUserEditing,
    compilationAttempts,
    lastCompiledResumeHash,
    lastCompiledCoverLetterHash,
    setCompilationError,
    setHasAttemptedCompilation,
    setLastCompilationTime,
    setIsUserEditing,
    setCompilationAttempts,
    setLastCompiledResumeHash,
    setLastCompiledCoverLetterHash,
    clearCompilationState,
    resetCompilationAttempts,
    generateContentHash,
    getCurrentContentHash,
    shouldAutoCompile,
    isLoaded,
  };
}
