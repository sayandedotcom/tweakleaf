"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { TooltipComponent } from "@/components/tooltip-component";
import { navigation } from "@/configs/navigation";
import { useLatexCompilation } from "@/hooks/use-latex-compilation";
import { toast } from "sonner";
import useLocalStorage from "use-local-storage";
import { Download, Logs, RefreshCw, Save, Settings, Play } from "lucide-react";
import { PdfTab } from "./pdf-tab";
import { LatexTab } from "./latex-tab";
import { ResumeLatex } from "./resume/resume-latex";
import { CoverLetterLatex } from "./cover-letter/cover-letter-latex";
import { CoverLetterPdf } from "./cover-letter/cover-letter-pdf";
import { ResumePdf } from "./resume/resume-pdf";
import { LogsTab } from "./logs/logs";

export function RightPanel() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const format = searchParams.get(navigation.FORMAT.PARAM);
  const rightPanelCategory = searchParams.get(navigation.RIGHT_PANEL.PARAM);
  const params = new URLSearchParams(searchParams);

  // State to manage PDF blob between LaTeX and PDF components
  const [resumePdfBlob, setResumePdfBlob] = useState<Blob | null>(null);
  const [coverLetterPdfBlob, setCoverLetterPdfBlob] = useState<Blob | null>(
    null,
  );

  // Add error state management
  const [compilationError, setCompilationError] = useState<string | null>(null);
  const [hasAttemptedCompilation, setHasAttemptedCompilation] = useState(false);
  const [lastCompilationTime, setLastCompilationTime] = useState<number>(0);
  const [isUserEditing, setIsUserEditing] = useState(false);
  const [compilationAttempts, setCompilationAttempts] = useState(0);
  const MAX_COMPILATION_ATTEMPTS = 3;

  // Get the current PDF blob based on document type
  const currentPdfBlob =
    rightPanelCategory === navigation.RIGHT_PANEL.RESUME
      ? resumePdfBlob
      : coverLetterPdfBlob;

  console.log("currentPdfBlob", JSON.stringify(currentPdfBlob));
  console.log("resumePdfBlob", JSON.stringify(resumePdfBlob));
  console.log("coverLetterPdfBlob", JSON.stringify(coverLetterPdfBlob));

  // Get the current LaTeX content from localStorage
  const [currentCoverLetterLatexContent] = useLocalStorage(
    "coverLetterLatexContent",
    "",
  );
  const [currentResumeLatexContent] = useLocalStorage("resumeLatexContent", "");

  // LaTeX compilation hook
  const { mutate: compileLatex, isPending, reset } = useLatexCompilation();

  // Add cleanup effect
  useEffect(() => {
    return () => {
      // Reset the mutation state when component unmounts
      reset();
    };
  }, [reset]);

  const handlePdfGenerated = (newPdfBlob: Blob) => {
    // Clear any previous errors when compilation succeeds
    setCompilationError(null);
    setHasAttemptedCompilation(false);
    setCompilationAttempts(0); // Reset attempts on successful compilation

    if (rightPanelCategory === navigation.RIGHT_PANEL.RESUME) {
      setResumePdfBlob(newPdfBlob);
    } else {
      setCoverLetterPdfBlob(newPdfBlob);
    }
    // Switch to PDF tab to show the result
    params.set(navigation.FORMAT.PARAM, navigation.FORMAT.PDF);
    router.push(`?${params.toString()}`);
  };

  const handleCompile = async () => {
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

    // Use pdflatex for resume and xelatex for cover letter
    const compiler =
      rightPanelCategory === navigation.RIGHT_PANEL.RESUME
        ? "pdflatex"
        : "xelatex";

    // Get signature image from localStorage if available
    const uploadedFiles = JSON.parse(
      localStorage.getItem("uploadedFiles") || "[]",
    );
    const signatureFile = uploadedFiles.find(
      (file: any) =>
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
          handlePdfGenerated(pdfBlob);
        },
        onError: (error: any) => {
          let errorMessage = "Failed to compile LaTeX";

          if (error.response?.data?.detail) {
            errorMessage = error.response.data.detail;
          } else if (error.message) {
            errorMessage = error.message;
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
  };

  // Unified compile/recompile function
  const handleCompileOrRecompile = () => {
    // Clear any previous errors when manually compiling
    setCompilationError(null);
    setHasAttemptedCompilation(false);
    setCompilationAttempts(0); // Reset attempts on manual recompile

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

    // Only auto-compile if:
    // 1. We have content
    // 2. No PDF blob exists
    // 3. Not currently compiling
    // 4. No compilation errors have occurred
    // 5. We haven't already attempted compilation for this content
    // 6. Sufficient time has passed since last compilation attempt
    // 7. User is not actively editing
    // 8. Maximum compilation attempts not reached
    const now = Date.now();
    const canCompile =
      currentContent &&
      currentContent.trim() &&
      !currentPdfBlob &&
      !isPending &&
      !compilationError &&
      !hasAttemptedCompilation &&
      now - lastCompilationTime >= 2000 &&
      !isUserEditing &&
      compilationAttempts < MAX_COMPILATION_ATTEMPTS;

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
      // Check if we have new content and no existing PDF
      if (
        currentCoverLetterLatexContent &&
        currentCoverLetterLatexContent.trim() &&
        !coverLetterPdfBlob &&
        !isPending &&
        !compilationError
      ) {
        // Small delay to ensure content is fully updated
        const timer = setTimeout(() => {
          // Use the existing compilation logic
          const compiler = "xelatex"; // Use xelatex for cover letters

          compileLatex(
            {
              latex_content: currentCoverLetterLatexContent,
              compiler,
            },
            {
              onSuccess: (pdfBlob) => {
                toast.success("Cover letter auto-compiled successfully!");
                handlePdfGenerated(pdfBlob);
              },
              onError: (error: any) => {
                let errorMessage = "Auto-compilation failed";
                if (error.response?.data?.detail) {
                  errorMessage = error.response.data.detail;
                } else if (error.message) {
                  errorMessage = error.message;
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
  ]);

  // Function to clear errors and allow retry
  const clearErrorsAndRetry = () => {
    setCompilationError(null);
    setHasAttemptedCompilation(false);
    setCompilationAttempts(0); // Reset attempts on manual retry
    setLastCompilationTime(Date.now()); // Set current time to prevent immediate re-compilation
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
              <span className="ml-1 w-2 h-2 bg-red-500 rounded-full"></span>
            )}
          </TabsTrigger>
        </TabsList>
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
          <TooltipComponent content={currentPdfBlob ? "Recompile" : "Compile"}>
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
          </TooltipComponent>
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
          <TooltipComponent content="Logs">
            <Button size="icon" variant="outline">
              <Logs />
            </Button>
          </TooltipComponent>
          <TooltipComponent content="Save File">
            <Button size="icon" variant="outline">
              <Save />
            </Button>
          </TooltipComponent>
          {/* <TooltipComponent content="Up">
            <Button size="icon" variant="outline">
              <ArrowBigUp />
            </Button>
          </TooltipComponent>
          <p className="text-sm">1</p>
          <TooltipComponent content="Down">
            <Button size="icon" variant="outline">
              <ArrowBigDown />
            </Button>
          </TooltipComponent> */}
          <TooltipComponent content="Settings">
            <Button size="icon" variant="outline">
              <Settings />
            </Button>
          </TooltipComponent>
          {/* <TooltipComponent content="Copy">
            <Button size="icon" variant="outline">
              <Copy />
            </Button>
          </TooltipComponent> */}
          {/* <TooltipComponent content="Zoom In">
            <Button size="icon" variant="outline">
              <Plus />
            </Button>
          </TooltipComponent>
          <TooltipComponent content="Zoom Out">
            <Button size="icon" variant="outline">
              <Minus />
            </Button>
          </TooltipComponent> */}
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
