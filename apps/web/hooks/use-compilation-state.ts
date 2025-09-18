"use client";

import { usePersistentCompilationState } from "./use-persistent-compilation-state";

interface UseCompilationStateOptions {
  rightPanelCategory: string | null;
}

/**
 * Custom hook for managing LaTeX compilation state and logic
 * Uses localStorage directly - no context provider needed
 */
export function useCompilationState({
  rightPanelCategory,
}: UseCompilationStateOptions): ReturnType<
  typeof usePersistentCompilationState
> {
  return usePersistentCompilationState({ rightPanelCategory });
}
