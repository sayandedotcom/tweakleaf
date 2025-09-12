"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import useLocalStorage from "use-local-storage";
import { Download, RefreshCw, Play, ListRestart } from "lucide-react";
import { PdfTab } from "./pdf-tab";
import { LatexTab } from "./latex-tab";
import { resumeTemplates } from "@/configs/resume-templates";
import { coverLetterTemplates } from "@/configs/cover-letter-templates";
import { CommingSoon } from "../comming-soon";
// import { useStore } from "@/store/store";

import dynamic from "next/dynamic";
import { Loader } from "../loader";
import { AlertDialogComponent } from "../alert-dialog-component";

const ResumePdf = dynamic(() => import("./resume/resume-pdf"), {
  ssr: false,
  loading: () => <Loader />,
});

const CoverLetterPdf = dynamic(
  () => import("./cover-letter/cover-letter-pdf"),
  {
    ssr: false,
    loading: () => <Loader />,
  },
);

const ResumeLatex = dynamic(() => import("./resume/resume-latex"), {
  ssr: false,
  loading: () => <Loader />,
});

const CoverLetterLatex = dynamic(
  () => import("./cover-letter/cover-letter-latex"),
  {
    ssr: false,
    loading: () => <Loader />,
  },
);

const LogsTab = dynamic(() => import("./logs/logs"), {
  ssr: false,
  loading: () => <Loader />,
});

export function ResumeCoverLetterTabs() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const format = searchParams.get(navigation.FORMAT.PARAM);
  const rightPanelCategory = searchParams.get(navigation.RIGHT_PANEL.PARAM);
  const params = useMemo(
    () => new URLSearchParams(searchParams),
    [searchParams],
  );

  // Get template values from store (not used in reset function)
  // const { resumeTemplate, coverLetterTemplate } = useStore();

  // State to manage PDF blob between LaTeX and PDF components - using localStorage for persistence
  const [resumePdfBlob, setResumePdfBlob] = useState<Blob | null>(null);
  const [coverLetterPdfBlob, setCoverLetterPdfBlob] = useState<Blob | null>(
    null,
  );

  // Store PDF data as base64 in localStorage for persistence across tab switches
  const [resumePdfData, setResumePdfData] = useLocalStorage<string | null>(
    "resumePdfData",
    null,
  );
  const [coverLetterPdfData, setCoverLetterPdfData] = useLocalStorage<
    string | null
  >("coverLetterPdfData", null);

  // Add error state management
  const [compilationError, setCompilationError] = useState<string | null>(null);
  const [hasAttemptedCompilation, setHasAttemptedCompilation] = useState(false);
  const [lastCompilationTime, setLastCompilationTime] = useState<number>(0);
  const [isUserEditing, setIsUserEditing] = useState(false);
  const [compilationAttempts, setCompilationAttempts] = useState(0);
  const MAX_COMPILATION_ATTEMPTS = 3;

  // Track content hashes to prevent unnecessary recompilations
  const [lastCompiledResumeHash, setLastCompiledResumeHash] = useLocalStorage<
    string | null
  >("lastCompiledResumeHash", null);
  const [lastCompiledCoverLetterHash, setLastCompiledCoverLetterHash] =
    useLocalStorage<string | null>("lastCompiledCoverLetterHash", null);

  // Helper function to generate a simple hash of content
  const generateContentHash = (content: string): string => {
    return btoa(encodeURIComponent(content)).slice(0, 16);
  };

  // Get the current PDF blob based on document type
  const currentPdfBlob =
    rightPanelCategory === navigation.RIGHT_PANEL.RESUME
      ? resumePdfBlob
      : coverLetterPdfBlob;

  console.log("currentPdfBlob", JSON.stringify(currentPdfBlob));
  console.log("resumePdfBlob", JSON.stringify(resumePdfBlob));
  console.log("coverLetterPdfBlob", JSON.stringify(coverLetterPdfBlob));

  // Get the current LaTeX content from localStorage
  const [currentCoverLetterLatexContent, setCurrentCoverLetterLatexContent] =
    useLocalStorage("coverLetterLatexContent", "");

  const [currentResumeLatexContent, setCurrentResumeLatexContent] =
    useLocalStorage("resumeLatexContent", "");

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

  // LaTeX compilation hook
  const { mutate: compileLatex, isPending, reset } = useLatexCompilation();

  // Get current template based on document type
  const currentTemplate =
    rightPanelCategory === navigation.RIGHT_PANEL.RESUME
      ? resumeTemplates.find((t) => t.value === selectedResumeTemplate)
      : coverLetterTemplates.find(
          (t) => t.value === selectedCoverLetterTemplate,
        );

  // Template selection handler
  const handleTemplateChange = (templateValue: string) => {
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

      // Update LaTeX content with new template
      if (rightPanelCategory === navigation.RIGHT_PANEL.RESUME) {
        setCurrentResumeLatexContent(template.latex);
      } else {
        setCurrentCoverLetterLatexContent(template.latex);
      }

      // Clear PDF blob to force recompilation
      if (rightPanelCategory === navigation.RIGHT_PANEL.RESUME) {
        setResumePdfBlob(null);
        setResumePdfData(null);
      } else {
        setCoverLetterPdfBlob(null);
        setCoverLetterPdfData(null);
      }

      // Clear any compilation errors
      setCompilationError(null);
      setHasAttemptedCompilation(false);
      setCompilationAttempts(0);
      // Reset content hash for new template
      if (rightPanelCategory === navigation.RIGHT_PANEL.RESUME) {
        setLastCompiledResumeHash(null);
      } else {
        setLastCompiledCoverLetterHash(null);
      }

      toast.success(`Switched to ${template.name} template`);
    }
  };

  // Initialize default template data on first load
  useEffect(() => {
    const currentContent =
      rightPanelCategory === navigation.RIGHT_PANEL.RESUME
        ? currentResumeLatexContent
        : currentCoverLetterLatexContent;

    // Only initialize if no content exists and we have a current template
    if (!currentContent && currentTemplate) {
      if (rightPanelCategory === navigation.RIGHT_PANEL.RESUME) {
        setCurrentResumeLatexContent(currentTemplate.latex);
      } else {
        setCurrentCoverLetterLatexContent(currentTemplate.latex);
      }
    }
  }, [
    rightPanelCategory,
    currentTemplate,
    currentResumeLatexContent,
    currentCoverLetterLatexContent,
    setCurrentResumeLatexContent,
    setCurrentCoverLetterLatexContent,
  ]);

  // Restore PDF blobs from localStorage on component mount
  useEffect(() => {
    const restorePdfBlobs = async () => {
      // Restore resume PDF if data exists and blob doesn't
      if (resumePdfData && !resumePdfBlob) {
        try {
          // Convert base64 to blob
          const byteCharacters = atob(resumePdfData);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], { type: "application/pdf" });
          setResumePdfBlob(blob);
        } catch (error) {
          console.error("Failed to restore resume PDF:", error);
          setResumePdfData(null); // Clear invalid data
        }
      }

      // Restore cover letter PDF if data exists and blob doesn't
      if (coverLetterPdfData && !coverLetterPdfBlob) {
        try {
          // Convert base64 to blob
          const byteCharacters = atob(coverLetterPdfData);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], { type: "application/pdf" });
          setCoverLetterPdfBlob(blob);
        } catch (error) {
          console.error("Failed to restore cover letter PDF:", error);
          setCoverLetterPdfData(null); // Clear invalid data
        }
      }
    };

    restorePdfBlobs();
  }, [
    resumePdfData,
    coverLetterPdfData,
    resumePdfBlob,
    coverLetterPdfBlob,
    setResumePdfData,
    setCoverLetterPdfData,
  ]);

  // Add cleanup effect
  useEffect(() => {
    return () => {
      // Reset the mutation state when component unmounts
      reset();
    };
  }, [reset]);

  const handlePdfGenerated = useCallback(
    async (newPdfBlob: Blob) => {
      // Clear any previous errors when compilation succeeds
      setCompilationError(null);
      setHasAttemptedCompilation(false);
      setCompilationAttempts(0); // Reset attempts on successful compilation

      // Convert blob to base64 for persistence
      const arrayBuffer = await newPdfBlob.arrayBuffer();
      const base64String = btoa(
        String.fromCharCode(...new Uint8Array(arrayBuffer)),
      );

      if (rightPanelCategory === navigation.RIGHT_PANEL.RESUME) {
        setResumePdfBlob(newPdfBlob);
        setResumePdfData(base64String);
      } else {
        setCoverLetterPdfBlob(newPdfBlob);
        setCoverLetterPdfData(base64String);
      }
      // Switch to PDF tab to show the result
      params.set(navigation.FORMAT.PARAM, navigation.FORMAT.PDF);
      router.push(`?${params.toString()}`);
    },
    [
      rightPanelCategory,
      params,
      router,
      setResumePdfData,
      setCoverLetterPdfData,
    ],
  );

  const handleCompile = useCallback(async () => {
    const currentContent =
      rightPanelCategory === navigation.RIGHT_PANEL.RESUME
        ? currentResumeLatexContent
        : currentCoverLetterLatexContent;

    if (!currentContent || !currentContent.trim()) {
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
    if (compilationAttempts >= MAX_COMPILATION_ATTEMPTS) {
      toast.error(
        "Maximum compilation attempts reached. Please check your LaTeX syntax and try again.",
      );
      return;
    }

    // Mark that we've attempted compilation
    setHasAttemptedCompilation(true);
    setCompilationError(null);
    setLastCompilationTime(now);
    setCompilationAttempts((prev) => prev + 1);

    // Use compiler from the selected template
    const compiler = currentTemplate?.compiler || "pdflatex";

    // Get signature image from localStorage if available
    const uploadedFiles = JSON.parse(
      localStorage.getItem("uploadedFiles") || "[]",
    );
    const signatureFile = uploadedFiles.find(
      (file: { name: string; type: string }) =>
        file.name.toLowerCase().includes("signature") &&
        file.type.startsWith("image/"),
    );

    if (signatureFile) {
      console.log("Found signature file:", signatureFile.name);
    } else {
      console.log("No signature file found, proceeding without signature");
    }

    // Convert base64 to File object if signature found
    let signatureImage: File | undefined;
    if (signatureFile) {
      try {
        const response = await fetch(signatureFile.data);
        const blob = await response.blob();
        signatureImage = new File([blob], signatureFile.name, {
          type: signatureFile.type,
        });
        console.log("Signature image loaded:", signatureFile.name);
      } catch (error) {
        console.error("Error converting signature file:", error);
        toast.warning("Failed to load signature image, proceeding without it");
      }
    }

    compileLatex(
      {
        latex_content: currentContent,
        compiler,
        signature_image: signatureImage,
      },
      {
        onSuccess: (pdfBlob) => {
          toast.success("LaTeX compiled successfully!");
          // Track the content hash for successful compilation
          const contentHash = generateContentHash(currentContent);
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
          params.set(navigation.FORMAT.PARAM, navigation.FORMAT.LOGS);
          router.push(`?${params.toString()}`);
        },
      },
    );
  }, [
    rightPanelCategory,
    currentResumeLatexContent,
    currentCoverLetterLatexContent,
    lastCompilationTime,
    compilationAttempts,
    MAX_COMPILATION_ATTEMPTS,
    compileLatex,
    handlePdfGenerated,
    params,
    router,
    currentTemplate?.compiler,
    setLastCompiledResumeHash,
    setLastCompiledCoverLetterHash,
  ]);

  // Unified compile/recompile function
  const handleCompileOrRecompile = () => {
    // Clear any previous errors when manually compiling
    setCompilationError(null);
    setHasAttemptedCompilation(false);
    setCompilationAttempts(0); // Reset attempts on manual recompile
    // Reset content hash to force compilation
    if (rightPanelCategory === navigation.RIGHT_PANEL.RESUME) {
      setLastCompiledResumeHash(null);
    } else {
      setLastCompiledCoverLetterHash(null);
    }

    if (currentPdfBlob) {
      // If we have a PDF, this is a recompile - switch to LaTeX tab first
      params.set(navigation.FORMAT.PARAM, navigation.FORMAT.LATEX);
      router.push(`?${params.toString()}`);
      // Small delay to ensure tab switch completes before compilation
      setTimeout(async () => {
        await handleCompile();
      }, 100);
    } else {
      // If no PDF, this is initial compilation
      handleCompile();
    }
  };

  // Auto-compile on initial render if content exists and no errors
  useEffect(() => {
    const currentContent =
      rightPanelCategory === navigation.RIGHT_PANEL.RESUME
        ? currentResumeLatexContent
        : currentCoverLetterLatexContent;

    // Generate hash for current content
    const currentContentHash = currentContent
      ? generateContentHash(currentContent)
      : null;

    // Get the appropriate hash for comparison
    const lastHash =
      rightPanelCategory === navigation.RIGHT_PANEL.RESUME
        ? lastCompiledResumeHash
        : lastCompiledCoverLetterHash;

    // Only auto-compile if:
    // 1. We have content
    // 2. No PDF blob exists OR content has changed since last compilation
    // 3. Not currently compiling
    // 4. No compilation errors have occurred
    // 5. We haven't already attempted compilation for this content
    // 6. Sufficient time has passed since last compilation attempt
    // 7. User is not actively editing
    // 8. Maximum compilation attempts not reached
    // 9. Content has actually changed since last successful compilation
    const now = Date.now();
    const contentHasChanged = currentContentHash !== lastHash;
    const canCompile =
      currentContent &&
      currentContent.trim() &&
      (!currentPdfBlob || contentHasChanged) &&
      !isPending &&
      !compilationError &&
      !hasAttemptedCompilation &&
      now - lastCompilationTime >= 2000 &&
      !isUserEditing &&
      compilationAttempts < MAX_COMPILATION_ATTEMPTS &&
      contentHasChanged;

    if (canCompile) {
      // Small delay to ensure component is fully mounted
      const timer = setTimeout(async () => {
        await handleCompile();
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [
    rightPanelCategory,
    currentResumeLatexContent,
    currentCoverLetterLatexContent,
    currentPdfBlob,
    isPending,
    compilationError,
    hasAttemptedCompilation,
    lastCompilationTime,
    isUserEditing,
    compilationAttempts,
    MAX_COMPILATION_ATTEMPTS,
    lastCompiledResumeHash,
    lastCompiledCoverLetterHash,
    handleCompile,
  ]);

  // Reset error state when content changes
  useEffect(() => {
    const currentContent =
      rightPanelCategory === navigation.RIGHT_PANEL.RESUME
        ? currentResumeLatexContent
        : currentCoverLetterLatexContent;

    // Reset error state when content changes (user is editing)
    if (currentContent && currentContent.trim()) {
      setCompilationError(null);
      setHasAttemptedCompilation(false);
      setCompilationAttempts(0); // Reset attempts on content change
    }
  }, [
    rightPanelCategory,
    currentResumeLatexContent,
    currentCoverLetterLatexContent,
  ]);

  // Auto-compile when cover letter content changes (AI generation)
  useEffect(() => {
    // Only auto-compile for cover letters, not resumes
    if (rightPanelCategory === navigation.RIGHT_PANEL.COVER_LETTER) {
      // Generate hash for current content
      const currentContentHash = currentCoverLetterLatexContent
        ? generateContentHash(currentCoverLetterLatexContent)
        : null;

      // Check if we have new content and it has changed since last compilation
      if (
        currentCoverLetterLatexContent &&
        currentCoverLetterLatexContent.trim() &&
        currentContentHash !== lastCompiledCoverLetterHash &&
        (!coverLetterPdfBlob ||
          currentContentHash !== lastCompiledCoverLetterHash) &&
        !isPending &&
        !compilationError
      ) {
        // Small delay to ensure content is fully updated
        const timer = setTimeout(() => {
          // Use compiler from the selected template
          const compiler = currentTemplate?.compiler || "xelatex";

          compileLatex(
            {
              latex_content: currentCoverLetterLatexContent,
              compiler,
            },
            {
              onSuccess: (pdfBlob) => {
                toast.success("Cover letter auto-compiled successfully!");
                // Track the content hash for successful compilation
                setLastCompiledCoverLetterHash(
                  generateContentHash(currentCoverLetterLatexContent),
                );
                handlePdfGenerated(pdfBlob);
              },
              onError: (error: unknown) => {
                let errorMessage = "Auto-compilation failed";
                if (error && typeof error === "object" && "response" in error) {
                  const errorWithResponse = error as {
                    response?: { data?: { detail?: string } };
                  };
                  if (errorWithResponse.response?.data?.detail) {
                    errorMessage = errorWithResponse.response.data.detail;
                  }
                } else if (
                  error &&
                  typeof error === "object" &&
                  "message" in error
                ) {
                  const errorWithMessage = error as { message: string };
                  errorMessage = errorWithMessage.message;
                }
                toast.error(errorMessage);
              },
            },
          );
        }, 2000); // 2 second delay to ensure content is stable

        return () => clearTimeout(timer);
      }
    }
  }, [
    currentCoverLetterLatexContent,
    rightPanelCategory,
    coverLetterPdfBlob,
    isPending,
    compilationError,
    lastCompiledCoverLetterHash,
    compileLatex,
    handlePdfGenerated,
    currentTemplate?.compiler,
    setLastCompiledCoverLetterHash,
  ]);

  // Function to clear errors and allow retry
  const clearErrorsAndRetry = () => {
    setCompilationError(null);
    setHasAttemptedCompilation(false);
    setCompilationAttempts(0); // Reset attempts on manual retry
    setLastCompilationTime(Date.now()); // Set current time to prevent immediate re-compilation
    // Reset content hash to allow recompilation
    if (rightPanelCategory === navigation.RIGHT_PANEL.RESUME) {
      setLastCompiledResumeHash(null);
    } else {
      setLastCompiledCoverLetterHash(null);
    }
  };

  // Function to track user editing state
  const handleUserEditing = (isEditing: boolean) => {
    try {
      setIsUserEditing(isEditing);
      if (isEditing) {
        // Clear errors when user starts editing (they're fixing the issue)
        setCompilationError(null);
        setHasAttemptedCompilation(false);
        setCompilationAttempts(0); // Reset attempts on user editing
      }
    } catch (error) {
      console.error("Error handling user editing state:", error);
    }
  };

  // Function to reset the current document to the default template from store
  const handleReset = () => {
    try {
      // Get the template value from localStorage based on document type
      const templateValue =
        rightPanelCategory === navigation.RIGHT_PANEL.RESUME
          ? selectedResumeTemplate
          : selectedCoverLetterTemplate;

      // Find the template from the appropriate template array
      const defaultTemplate =
        rightPanelCategory === navigation.RIGHT_PANEL.RESUME
          ? resumeTemplates.find((t) => t.value === templateValue)
          : coverLetterTemplates.find((t) => t.value === templateValue);

      if (!defaultTemplate) {
        toast.error("Default template not found");
        return;
      }

      // Reset LaTeX content to the default template's original content
      console.log("Resetting with template:", defaultTemplate.name);
      console.log("Template value from store:", templateValue);
      console.log("LaTeX content length:", defaultTemplate.latex.length);

      // Use the setter functions to update localStorage and trigger re-render
      if (rightPanelCategory === navigation.RIGHT_PANEL.RESUME) {
        setCurrentResumeLatexContent(defaultTemplate.latex);
      } else {
        setCurrentCoverLetterLatexContent(defaultTemplate.latex);
      }

      // Clear PDF blobs to force recompilation
      if (rightPanelCategory === navigation.RIGHT_PANEL.RESUME) {
        setResumePdfBlob(null);
        setResumePdfData(null);
      } else {
        setCoverLetterPdfBlob(null);
        setCoverLetterPdfData(null);
      }

      // Clear compilation state
      setCompilationError(null);
      setHasAttemptedCompilation(false);
      setCompilationAttempts(0);
      // Reset content hash for new template
      if (rightPanelCategory === navigation.RIGHT_PANEL.RESUME) {
        setLastCompiledResumeHash(null);
      } else {
        setLastCompiledCoverLetterHash(null);
      }

      // Switch to LaTeX tab to show the reset content
      params.set(navigation.FORMAT.PARAM, navigation.FORMAT.LATEX);
      router.push(`?${params.toString()}`);

      toast.success(`Reset to default ${defaultTemplate.name} template`);
    } catch (error) {
      console.error("Error resetting document:", error);
      toast.error("Failed to reset document");
    }
  };

  const handleDownload = () => {
    if (currentPdfBlob) {
      const link = document.createElement("a");
      link.href = URL.createObjectURL(currentPdfBlob);
      const fileName =
        rightPanelCategory === navigation.RIGHT_PANEL.RESUME
          ? "resume.pdf"
          : "cover_letter.pdf";
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    }
  };

  return (
    <Tabs
      defaultValue={format || navigation.FORMAT.PDF}
      className="flex flex-col h-full"
      onValueChange={(value) => {
        params.set(navigation.FORMAT.PARAM, value);
        router.push(`?${params.toString()}`);
      }}
    >
      <header className="flex gap-2 items-center w-full justify-between px-2 py-0.5 border-b">
        <TabsList>
          <TabsTrigger value={navigation.FORMAT.PDF}>PDF</TabsTrigger>
          <TabsTrigger value={navigation.FORMAT.LATEX}>LaTex</TabsTrigger>
          <TabsTrigger value={navigation.FORMAT.LOGS}>
            Logs
            {compilationError && (
              // <span className="ml-1 w-1 h-1 bg-destructive rounded-full animate-ping"></span>
              <span className="relative flex size-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-destructive opacity-75"></span>
                <span className="relative inline-flex size-3 rounded-full bg-destructive"></span>
              </span>
            )}
          </TabsTrigger>
        </TabsList>
        <Select
          value={
            rightPanelCategory === navigation.RIGHT_PANEL.RESUME
              ? selectedResumeTemplate
              : selectedCoverLetterTemplate
          }
          onValueChange={handleTemplateChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Templates" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Templates</SelectLabel>
              {navigation.RIGHT_PANEL.RESUME === rightPanelCategory
                ? resumeTemplates.map((template) => (
                    <SelectItem
                      key={template.id}
                      value={template.value}
                      disabled={template.isDisabled}
                    >
                      {template.name} {template.isDisabled && <CommingSoon />}
                    </SelectItem>
                  ))
                : null}
              {navigation.RIGHT_PANEL.COVER_LETTER === rightPanelCategory
                ? coverLetterTemplates.map((template) => (
                    <SelectItem
                      key={template.id}
                      value={template.value}
                      disabled={template.isDisabled}
                    >
                      {template.name}
                      {template.isDisabled && <CommingSoon />}
                    </SelectItem>
                  ))
                : null}
            </SelectGroup>
          </SelectContent>
        </Select>
        <div className="flex gap-2 items-center">
          {/* {compilationError && (
            <div className="text-sm text-red-600 bg-red-50 px-2 py-1 rounded border border-red-200">
              Compilation Error - Check Logs tab for details
              {compilationAttempts >= MAX_COMPILATION_ATTEMPTS && (
                <span className="ml-2 text-xs bg-red-200 px-1 py-0.5 rounded">
                  Max attempts reached
                </span>
              )}
            </div>
          )} */}
          <Button
            onClick={handleCompileOrRecompile}
            disabled={
              isPending ||
              compilationError !== null ||
              compilationAttempts >= MAX_COMPILATION_ATTEMPTS
            }
            className="flex items-center gap-2"
          >
            {isPending ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : currentPdfBlob ? (
              <RefreshCw className="w-4 h-4" />
            ) : (
              <Play className="w-4 h-4" />
            )}
            {isPending
              ? "Compiling..."
              : compilationAttempts >= MAX_COMPILATION_ATTEMPTS
                ? "Max Attempts Reached"
                : compilationError
                  ? "Fix Errors First"
                  : currentPdfBlob
                    ? "Recompile"
                    : "Compile"}
          </Button>
          <AlertDialogComponent
            title="Reset"
            description="Are you sure you want to reset the current document to the default template? All data will be lost."
            onConfirm={handleReset}
          >
            <Button className="h-8 text-xs">
              <ListRestart color="black" className="w-4 h-4" />
              Reset
            </Button>
          </AlertDialogComponent>
          <TooltipComponent content="Download">
            <Button
              size="icon"
              variant="outline"
              onClick={handleDownload}
              disabled={!currentPdfBlob}
            >
              <Download />
            </Button>
          </TooltipComponent>
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
          maxCompilationAttempts={MAX_COMPILATION_ATTEMPTS}
        />
      </TabsContent>
    </Tabs>
  );
}

{
  /* <TooltipComponent content="Logs">
            <Button size="icon" variant="outline">
              <Logs />
            </Button>
          </TooltipComponent> */
}
{
  /* <TooltipComponent content="Save File">
            <Button size="icon" variant="outline">
              <Save />
            </Button>
          </TooltipComponent> */
}
{
  /* <TooltipComponent content="Up">
            <Button size="icon" variant="outline">
              <ArrowBigUp />
            </Button>
          </TooltipComponent>
          <p className="text-sm">1</p>
          <TooltipComponent content="Down">
            <Button size="icon" variant="outline">
              <ArrowBigDown />
            </Button>
          </TooltipComponent> */
}
{
  /* <TooltipComponent content="Settings">
            <Button size="icon" variant="outline">
              <Settings />
            </Button>
          </TooltipComponent> */
}
{
  /* <TooltipComponent content="Copy">
            <Button size="icon" variant="outline">
              <Copy />
            </Button>
          </TooltipComponent> */
}
{
  /* <TooltipComponent content="Zoom In">
            <Button size="icon" variant="outline">
              <Plus />
            </Button>
          </TooltipComponent>
          <TooltipComponent content="Zoom Out">
            <Button size="icon" variant="outline">
              <Minus />
            </Button>
          </TooltipComponent> */
}
