"use client";

import { useEffect, useCallback, useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { TooltipComponent } from "@/components/tooltip-component";
import { navigation } from "@/configs/navigation";
import { useLatexCompilation } from "@/hooks/use-latex-compilation";
import { toast } from "sonner";
import {
  Download,
  RefreshCw,
  Play,
  ListRestart,
  Logs,
  Info,
} from "lucide-react";
import { PdfTab } from "./pdf-tab";
import { LatexTab } from "./latex-tab";
import { CommingSoon } from "@/components/comming-soon";
import dynamic from "next/dynamic";
import { Loader } from "@/components/loader";
import { AlertDialogComponent } from "@/components/alert-dialog-component";
import { SaveFileButton } from "@/components/save-file-button";
import { useQueryParam } from "@/hooks/use-query-param";
import { usePdfManagement } from "@/hooks/use-pdf-management";
import { useCompilationState } from "@/hooks/use-compilation-state";
import { useTemplateManagement } from "@/hooks/use-template-management";
import { useLatexContent } from "@/hooks/use-latex-content";
import { useFileOperations } from "@/hooks/use-file-operations";
import { resumeTemplates } from "@/configs/resume-templates";
import { coverLetterTemplates } from "@/configs/cover-letter-templates";

const ResumePdf = dynamic(() => import("./resume/resume-pdf"), {
  loading: () => <Loader />,
});

const CoverLetterPdf = dynamic(
  () => import("./cover-letter/cover-letter-pdf"),
  {
    loading: () => <Loader />,
  },
);

const ResumeLatex = dynamic(() => import("./resume/resume-latex"), {
  loading: () => <Loader />,
});

const CoverLetterLatex = dynamic(
  () => import("./cover-letter/cover-letter-latex"),
  {
    loading: () => <Loader />,
  },
);

const LogsTab = dynamic(() => import("./logs/logs"), {
  loading: () => <Loader />,
});

export default function ResumeCoverLetterTabs() {
  // Query parameters
  const { value: format, setValue: handleFormatChange } = useQueryParam({
    paramName: navigation.FORMAT.PARAM,
    defaultValue: navigation.FORMAT.PDF,
  });

  const { value: rightPanelCategory } = useQueryParam({
    paramName: navigation.RIGHT_PANEL.PARAM,
    defaultValue: navigation.RIGHT_PANEL.RESUME,
  });

  // Custom hooks for state management
  const { currentPdfBlob, setPdfBlob, clearPdfBlob } = usePdfManagement({
    rightPanelCategory,
  });

  const {
    compilationError,
    lastCompilationTime,
    compilationAttempts,
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
    shouldAutoCompile,
  } = useCompilationState({ rightPanelCategory });

  // Template management
  const {
    selectedResumeTemplate,
    selectedCoverLetterTemplate,
    currentTemplate,
    handleTemplateChange: handleTemplateChangeBase,
  } = useTemplateManagement({
    rightPanelCategory,
    onTemplateChange: (template) => {
      // Update LaTeX content with new template
      if (rightPanelCategory === navigation.RIGHT_PANEL.RESUME) {
        setCurrentResumeLatexContent(template.latex);
      } else {
        setCurrentCoverLetterLatexContent(template.latex);
      }

      // Clear PDF blob to force recompilation
      clearPdfBlob();

      // Clear any compilation errors
      clearCompilationState();

      toast.success(`Switched to ${template.name} template`);
    },
  });

  // LaTeX content management
  const {
    currentLatexContent,
    setCurrentResumeLatexContent,
    setCurrentCoverLetterLatexContent,
    updateCurrentLatexContent,
    initializeDefaultContent,
  } = useLatexContent({
    rightPanelCategory,
    currentTemplate,
  });

  // File operations
  const { handleDownload, getSignatureImage } = useFileOperations({
    rightPanelCategory,
    currentPdfBlob,
    currentLatexContent,
    format,
  });

  // LaTeX compilation hook
  const { mutate: compileLatex, isPending, reset } = useLatexCompilation();

  // Template selection handler
  const handleTemplateChange = useCallback(
    (templateValue: string) => {
      handleTemplateChangeBase(templateValue);
    },
    [handleTemplateChangeBase],
  );

  // Initialize default template data on first load
  useEffect(() => {
    initializeDefaultContent();
  }, [initializeDefaultContent]);

  // Listen for saved file load events from NavSavedFiles component
  useEffect(() => {
    const handleLoadSavedFile = (event: CustomEvent) => {
      const { content, documentType } = event.detail;

      // Check if this event is for the current document type
      const currentDocumentType =
        rightPanelCategory === navigation.RIGHT_PANEL.RESUME
          ? "resume"
          : "cover-letter";

      if (documentType === currentDocumentType) {
        // Use the proper state update function from useLatexContent hook
        updateCurrentLatexContent(content);

        // Clear PDF blob to force recompilation
        clearPdfBlob();

        // Clear any compilation errors
        clearCompilationState();

        // Switch to LaTeX tab to show the loaded content
        handleFormatChange(navigation.FORMAT.LATEX);
      }
    };

    window.addEventListener(
      "loadSavedFile",
      handleLoadSavedFile as EventListener,
    );

    return () => {
      window.removeEventListener(
        "loadSavedFile",
        handleLoadSavedFile as EventListener,
      );
    };
  }, [
    rightPanelCategory,
    updateCurrentLatexContent,
    clearPdfBlob,
    clearCompilationState,
    handleFormatChange,
  ]);

  // Add cleanup effect
  useEffect(() => {
    return () => {
      reset();
    };
  }, [reset]);

  const handlePdfGenerated = useCallback(
    async (newPdfBlob: Blob) => {
      // Clear any previous errors when compilation succeeds
      resetCompilationAttempts();

      // Convert blob to base64 for persistence
      const arrayBuffer = await newPdfBlob.arrayBuffer();
      const base64String = btoa(
        String.fromCharCode(...new Uint8Array(arrayBuffer)),
      );

      // Store PDF blob and data
      setPdfBlob(newPdfBlob);

      // Store base64 data in localStorage
      if (rightPanelCategory === navigation.RIGHT_PANEL.RESUME) {
        localStorage.setItem("resumePdfData", base64String);
      } else {
        localStorage.setItem("coverLetterPdfData", base64String);
      }

      // Switch to PDF tab to show the result
      handleFormatChange(navigation.FORMAT.PDF);
    },
    [
      rightPanelCategory,
      handleFormatChange,
      setPdfBlob,
      resetCompilationAttempts,
    ],
  );

  const handleCompile = useCallback(async () => {
    if (!currentLatexContent || !currentLatexContent.trim()) {
      toast.error("Please enter LaTeX content");
      return;
    }

    // Prevent rapid successive compilation attempts (minimum 2 seconds between attempts)
    const now = Date.now();
    if (now - lastCompilationTime < 2000) {
      toast.warning("Please wait a moment before trying to compile again");
      return;
    }

    // Check if we've exceeded maximum compilation attempts
    if (compilationAttempts >= 3) {
      toast.error(
        "Maximum compilation attempts reached. Please check your LaTeX syntax and try again.",
      );
      return;
    }

    // Mark that we've attempted compilation
    setHasAttemptedCompilation(true);
    setCompilationError(null);
    setLastCompilationTime(now);
    setCompilationAttempts(compilationAttempts + 1);

    // Use compiler from the selected template
    const compiler = currentTemplate?.compiler || "pdflatex";

    // Get signature image
    const signatureImage = await getSignatureImage();

    compileLatex(
      {
        latex_content: currentLatexContent,
        compiler,
        signature_image: signatureImage,
      },
      {
        onSuccess: (pdfBlob) => {
          toast.success("LaTeX compiled successfully!");
          // Track the content hash for successful compilation
          const contentHash = generateContentHash(currentLatexContent);
          if (rightPanelCategory === navigation.RIGHT_PANEL.RESUME) {
            setLastCompiledResumeHash(contentHash);
          } else {
            setLastCompiledCoverLetterHash(contentHash);
          }
          handlePdfGenerated(pdfBlob);
        },
        onError: (error: unknown) => {
          let errorMessage = "Failed to compile LaTeX";

          if (error && typeof error === "object" && "response" in error) {
            const errorWithResponse = error as {
              response?: { data?: { detail?: string } };
            };
            if (errorWithResponse.response?.data?.detail) {
              errorMessage = errorWithResponse.response.data.detail;
            }
          } else if (error && typeof error === "object" && "message" in error) {
            const errorWithMessage = error as { message: string };
            errorMessage = errorWithMessage.message;
          }

          // Store the error and prevent further auto-compilation
          setCompilationError(errorMessage);
          setHasAttemptedCompilation(true);

          toast.error(errorMessage);
          console.error("Compilation error:", error);

          // Switch to logs tab to show the error
          handleFormatChange(navigation.FORMAT.LOGS);
        },
      },
    );
  }, [
    currentLatexContent,
    lastCompilationTime,
    compilationAttempts,
    compileLatex,
    handlePdfGenerated,
    handleFormatChange,
    currentTemplate?.compiler,
    setLastCompiledResumeHash,
    setLastCompiledCoverLetterHash,
    generateContentHash,
    getSignatureImage,
    setHasAttemptedCompilation,
    setCompilationError,
    setLastCompilationTime,
    setCompilationAttempts,
    rightPanelCategory,
  ]);

  // Unified compile/recompile function
  const handleCompileOrRecompile = useCallback(() => {
    // Clear any previous errors when manually compiling
    clearCompilationState();

    if (currentPdfBlob) {
      // If we have a PDF, this is a recompile - switch to LaTeX tab first
      handleFormatChange(navigation.FORMAT.LATEX);
      // Small delay to ensure tab switch completes before compilation
      setTimeout(async () => {
        await handleCompile();
      }, 100);
    } else {
      // If no PDF, this is initial compilation
      handleCompile();
    }
  }, [
    currentPdfBlob,
    clearCompilationState,
    handleFormatChange,
    handleCompile,
  ]);

  // Auto-compile on initial render if content exists and no errors
  useEffect(() => {
    if (shouldAutoCompile(currentLatexContent, isPending)) {
      // Small delay to ensure component is fully mounted
      const timer = setTimeout(async () => {
        await handleCompile();
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [currentLatexContent, isPending, shouldAutoCompile, handleCompile]);

  // Reset error state when content changes
  useEffect(() => {
    // Reset error state when content changes (user is editing)
    if (currentLatexContent && currentLatexContent.trim()) {
      resetCompilationAttempts();
    }
  }, [currentLatexContent, resetCompilationAttempts]);

  // Auto-compile when cover letter content changes (AI generation)
  useEffect(() => {
    // Only auto-compile for cover letters, not resumes
    if (
      rightPanelCategory === navigation.RIGHT_PANEL.COVER_LETTER &&
      shouldAutoCompile(currentLatexContent, isPending)
    ) {
      // Small delay to ensure content is fully updated
      const timer = setTimeout(async () => {
        await handleCompile();
      }, 2000); // 2 second delay to ensure content is stable

      return () => clearTimeout(timer);
    }
  }, [
    rightPanelCategory,
    currentLatexContent,
    isPending,
    shouldAutoCompile,
    handleCompile,
  ]);

  // Function to clear errors and allow retry
  const clearErrorsAndRetry = useCallback(() => {
    clearCompilationState();
  }, [clearCompilationState]);

  // Function to track user editing state
  const handleUserEditing = useCallback(
    (isEditing: boolean) => {
      try {
        setIsUserEditing(isEditing);
        if (isEditing) {
          // Clear errors when user starts editing (they're fixing the issue)
          resetCompilationAttempts();
        }
      } catch (error) {
        console.error("Error handling user editing state:", error);
      }
    },
    [setIsUserEditing, resetCompilationAttempts],
  );

  // Function to reset the current document to the default template from store
  const handleReset = useCallback(() => {
    try {
      if (!currentTemplate) {
        toast.error("Default template not found");
        return;
      }

      // Reset LaTeX content to the default template's original content
      updateCurrentLatexContent(currentTemplate.latex);

      // Clear PDF blobs to force recompilation
      clearPdfBlob();

      // Clear compilation state
      clearCompilationState();

      // Switch to LaTeX tab to show the reset content
      handleFormatChange(navigation.FORMAT.LATEX);

      toast.success(`Reset to default ${currentTemplate.name} template`);
    } catch (error) {
      console.error("Error resetting document:", error);
      toast.error("Failed to reset document");
    }
  }, [
    currentTemplate,
    updateCurrentLatexContent,
    clearPdfBlob,
    clearCompilationState,
    handleFormatChange,
  ]);

  // Memoized values for better performance
  const currentTemplateValue = useMemo(
    () =>
      rightPanelCategory === navigation.RIGHT_PANEL.RESUME
        ? selectedResumeTemplate
        : selectedCoverLetterTemplate,
    [rightPanelCategory, selectedResumeTemplate, selectedCoverLetterTemplate],
  );

  const isCompileDisabled = useMemo(
    () => isPending || compilationError !== null || compilationAttempts >= 3,
    [isPending, compilationError, compilationAttempts],
  );

  const isDownloadDisabled = useMemo(
    () =>
      format === navigation.FORMAT.LATEX
        ? !currentLatexContent
        : !currentPdfBlob,
    [format, currentLatexContent, currentPdfBlob],
  );

  const compileButtonText = useMemo(() => {
    if (isPending) return "Compiling";
    if (compilationAttempts >= 3) return "Wait";
    if (compilationError) return "Error";
    if (currentPdfBlob) return "Recompile";
    return "Compile";
  }, [isPending, compilationAttempts, compilationError, currentPdfBlob]);

  return (
    <Tabs
      defaultValue={format || navigation.FORMAT.PDF}
      className="flex flex-col h-full"
      onValueChange={handleFormatChange}
    >
      <header className="flex gap-2 items-center w-full justify-between px-2 py-0.5 border-b">
        <TabsList>
          <TabsTrigger value={navigation.FORMAT.PDF}>PDF</TabsTrigger>
          <TabsTrigger value={navigation.FORMAT.LATEX}>LaTeX</TabsTrigger>
          <TabsTrigger value={navigation.FORMAT.LOGS} className="relative">
            <Logs />
            {compilationError && (
              <span className="absolute -top-1 -right-1 size-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-destructive opacity-75"></span>
                <span className="absolute inline-flex size-2 rounded-full bg-destructive"></span>
              </span>
            )}
          </TabsTrigger>
        </TabsList>
        <Tooltip>
          <TooltipTrigger asChild>
            <Info className="w-4 h-4 cursor-pointer" />
          </TooltipTrigger>
          <TooltipContent className="w-60">
            <>
              <p className="text-center"> About LaTeX Compiler </p>
              <br />
              <p>
                Our compiler works perfectly with given LaTeX templates.
                <br />
                <br /> However, if you want to use your own LaTeX templates, you
                can use the LaTeX tab to edit the content and compile it
                yourself, but LaTeX file that has specialized fonts, packages (
                like fontawesome, etc.) may not work perfectly.
              </p>
            </>
          </TooltipContent>
        </Tooltip>
        <Select
          value={currentTemplateValue}
          onValueChange={handleTemplateChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Templates" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Templates</SelectLabel>
              {rightPanelCategory === navigation.RIGHT_PANEL.RESUME
                ? resumeTemplates.map((template) => (
                    <SelectItem
                      key={template.id}
                      value={template.value}
                      disabled={template.isDisabled}
                    >
                      {template.name} {template.isDisabled && <CommingSoon />}
                    </SelectItem>
                  ))
                : coverLetterTemplates.map((template) => (
                    <SelectItem
                      key={template.id}
                      value={template.value}
                      disabled={template.isDisabled}
                    >
                      {template.name}
                      {template.isDisabled && <CommingSoon />}
                    </SelectItem>
                  ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <div className="flex gap-2 items-center">
          <Button
            onClick={handleCompileOrRecompile}
            disabled={isCompileDisabled}
            className="flex items-center gap-2"
          >
            {isPending ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : currentPdfBlob ? (
              <RefreshCw className="w-4 h-4" />
            ) : (
              <Play className="w-4 h-4" />
            )}
            {compileButtonText}
          </Button>
          <TooltipComponent content="Download">
            <Button
              size="icon"
              variant="outline"
              onClick={handleDownload}
              disabled={isDownloadDisabled}
            >
              <Download />
            </Button>
          </TooltipComponent>
          <SaveFileButton
            latexContent={currentLatexContent}
            documentType={
              rightPanelCategory === navigation.RIGHT_PANEL.RESUME
                ? "resume"
                : "cover-letter"
            }
          />
          <AlertDialogComponent
            tooltipContent="Reset"
            title="Reset"
            description="Are you sure you want to reset the current document to the default template? All data will be lost."
            onConfirm={handleReset}
          >
            <Button variant="outline" size="icon">
              <ListRestart className="w-4 h-4" />
            </Button>
          </AlertDialogComponent>
        </div>
      </header>
      <TabsContent value={navigation.FORMAT.PDF}>
        <PdfTab>
          {rightPanelCategory === navigation.RIGHT_PANEL.RESUME ? (
            <ResumePdf pdfBlob={currentPdfBlob} />
          ) : (
            <CoverLetterPdf pdfBlob={currentPdfBlob} />
          )}
        </PdfTab>
      </TabsContent>
      <TabsContent value={navigation.FORMAT.LATEX}>
        <LatexTab>
          {rightPanelCategory === navigation.RIGHT_PANEL.RESUME ? (
            <ResumeLatex onUserEditing={handleUserEditing} />
          ) : (
            <CoverLetterLatex onUserEditing={handleUserEditing} />
          )}
        </LatexTab>
      </TabsContent>
      <TabsContent value={navigation.FORMAT.LOGS}>
        <LogsTab
          compilationError={compilationError}
          isPending={isPending}
          onRetry={handleCompile}
          onClearErrors={clearErrorsAndRetry}
          compilationAttempts={compilationAttempts}
          maxCompilationAttempts={3}
        />
      </TabsContent>
    </Tabs>
  );
}
