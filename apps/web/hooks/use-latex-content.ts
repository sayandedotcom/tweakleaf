"use client";

import { useCallback, useMemo } from "react";
import useLocalStorage from "use-local-storage";
import { navigation } from "@/configs/navigation";

interface UseLatexContentOptions {
  rightPanelCategory: string | null;
  currentTemplate?: any;
}

interface UseLatexContentReturn {
  currentResumeLatexContent: string;
  currentCoverLetterLatexContent: string;
  currentLatexContent: string;
  setCurrentResumeLatexContent: (content: string) => void;
  setCurrentCoverLetterLatexContent: (content: string) => void;
  updateCurrentLatexContent: (content: string) => void;
  initializeDefaultContent: () => void;
}

/**
 * Custom hook for managing LaTeX content with localStorage persistence
 */
export function useLatexContent({
  rightPanelCategory,
  currentTemplate,
}: UseLatexContentOptions): UseLatexContentReturn {
  // LaTeX content state
  const [currentResumeLatexContent, setCurrentResumeLatexContent] =
    useLocalStorage("resumeLatexContent", "");

  const [currentCoverLetterLatexContent, setCurrentCoverLetterLatexContent] =
    useLocalStorage("coverLetterLatexContent", "");

  // Get current LaTeX content based on document type
  const currentLatexContent = useMemo(
    () =>
      rightPanelCategory === navigation.RIGHT_PANEL.RESUME
        ? currentResumeLatexContent
        : currentCoverLetterLatexContent,
    [
      rightPanelCategory,
      currentResumeLatexContent,
      currentCoverLetterLatexContent,
    ],
  );

  // Update current LaTeX content based on document type
  const updateCurrentLatexContent = useCallback(
    (content: string) => {
      if (rightPanelCategory === navigation.RIGHT_PANEL.RESUME) {
        setCurrentResumeLatexContent(content);
      } else {
        setCurrentCoverLetterLatexContent(content);
      }
    },
    [
      rightPanelCategory,
      setCurrentResumeLatexContent,
      setCurrentCoverLetterLatexContent,
    ],
  );

  // Initialize default content from template
  const initializeDefaultContent = useCallback(() => {
    if (!currentLatexContent && currentTemplate?.latex) {
      updateCurrentLatexContent(currentTemplate.latex);
    }
  }, [currentLatexContent, currentTemplate, updateCurrentLatexContent]);

  return {
    currentResumeLatexContent,
    currentCoverLetterLatexContent,
    currentLatexContent,
    setCurrentResumeLatexContent,
    setCurrentCoverLetterLatexContent,
    updateCurrentLatexContent,
    initializeDefaultContent,
  };
}
