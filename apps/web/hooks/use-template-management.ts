"use client";

import { useCallback, useMemo } from "react";
import useLocalStorage from "use-local-storage";
import { resumeTemplates } from "@/configs/resume-templates";
import { coverLetterTemplates } from "@/configs/cover-letter-templates";
import { navigation } from "@/configs/navigation";

interface UseTemplateManagementOptions {
  rightPanelCategory: string | null;
  onTemplateChange?: (template: any) => void;
}

interface UseTemplateManagementReturn {
  selectedResumeTemplate: string;
  selectedCoverLetterTemplate: string;
  currentTemplate: any;
  handleTemplateChange: (templateValue: string) => void;
  resetToDefaultTemplate: () => void;
}

/**
 * Custom hook for managing template selection and changes
 */
export function useTemplateManagement({
  rightPanelCategory,
  onTemplateChange,
}: UseTemplateManagementOptions): UseTemplateManagementReturn {
  // Template selection state
  const [selectedResumeTemplate, setSelectedResumeTemplate] = useLocalStorage(
    "selectedResumeTemplate",
    resumeTemplates.find((t) => t.isDefault)?.value ||
      resumeTemplates[0]?.value ||
      "",
  );

  const [selectedCoverLetterTemplate, setSelectedCoverLetterTemplate] =
    useLocalStorage(
      "selectedCoverLetterTemplate",
      coverLetterTemplates.find((t) => t.isDefault)?.value ||
        coverLetterTemplates[0]?.value ||
        "",
    );

  // Get current template based on document type
  const currentTemplate = useMemo(
    () =>
      rightPanelCategory === navigation.RIGHT_PANEL.RESUME
        ? resumeTemplates.find((t) => t.value === selectedResumeTemplate)
        : coverLetterTemplates.find(
            (t) => t.value === selectedCoverLetterTemplate,
          ),
    [rightPanelCategory, selectedResumeTemplate, selectedCoverLetterTemplate],
  );

  // Template selection handler
  const handleTemplateChange = useCallback(
    (templateValue: string) => {
      const template =
        rightPanelCategory === navigation.RIGHT_PANEL.RESUME
          ? resumeTemplates.find((t) => t.value === templateValue)
          : coverLetterTemplates.find((t) => t.value === templateValue);

      if (template) {
        // Update template selection
        if (rightPanelCategory === navigation.RIGHT_PANEL.RESUME) {
          setSelectedResumeTemplate(templateValue);
        } else {
          setSelectedCoverLetterTemplate(templateValue);
        }

        // Call the template change callback
        onTemplateChange?.(template);
      }
    },
    [
      rightPanelCategory,
      setSelectedResumeTemplate,
      setSelectedCoverLetterTemplate,
      onTemplateChange,
    ],
  );

  // Reset to default template
  const resetToDefaultTemplate = useCallback(() => {
    const templateValue =
      rightPanelCategory === navigation.RIGHT_PANEL.RESUME
        ? selectedResumeTemplate
        : selectedCoverLetterTemplate;

    const defaultTemplate =
      rightPanelCategory === navigation.RIGHT_PANEL.RESUME
        ? resumeTemplates.find((t) => t.value === templateValue)
        : coverLetterTemplates.find((t) => t.value === templateValue);

    if (defaultTemplate) {
      onTemplateChange?.(defaultTemplate);
    }
  }, [
    rightPanelCategory,
    selectedResumeTemplate,
    selectedCoverLetterTemplate,
    onTemplateChange,
  ]);

  return {
    selectedResumeTemplate,
    selectedCoverLetterTemplate,
    currentTemplate,
    handleTemplateChange,
    resetToDefaultTemplate,
  };
}
