"use client";

import { useCallback } from "react";
import { navigation } from "@/configs/navigation";

interface UseFileOperationsOptions {
  rightPanelCategory: string | null;
  currentPdfBlob: Blob | null;
  currentLatexContent: string;
  format: string | null;
}

interface UseFileOperationsReturn {
  handleDownload: () => void;
  getSignatureImage: () => Promise<File | undefined>;
}

/**
 * Custom hook for handling file operations like download and signature image loading
 */
export function useFileOperations({
  rightPanelCategory,
  currentPdfBlob,
  currentLatexContent,
  format,
}: UseFileOperationsOptions): UseFileOperationsReturn {
  // Download handler
  const handleDownload = useCallback(() => {
    if (format === navigation.FORMAT.LATEX) {
      // Download LaTeX file
      if (currentLatexContent) {
        const blob = new Blob([currentLatexContent], { type: "text/plain" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        const fileName =
          rightPanelCategory === navigation.RIGHT_PANEL.RESUME
            ? "resume.tex"
            : "cover_letter.tex";
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
      }
    } else if (currentPdfBlob) {
      // Download PDF file
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
  }, [rightPanelCategory, currentPdfBlob, currentLatexContent, format]);

  // Get signature image from localStorage
  const getSignatureImage = useCallback(async (): Promise<File | undefined> => {
    try {
      const uploadedFiles = JSON.parse(
        localStorage.getItem("uploadedFiles") || "[]",
      );
      const signatureFile = uploadedFiles.find(
        (file: { name: string; type: string }) =>
          file.name.toLowerCase().includes("signature") &&
          file.type.startsWith("image/"),
      );

      if (!signatureFile) {
        console.log("No signature file found, proceeding without signature");
        return undefined;
      }

      console.log("Found signature file:", signatureFile.name);
      const response = await fetch(signatureFile.data);
      const blob = await response.blob();
      const signatureImage = new File([blob], signatureFile.name, {
        type: signatureFile.type,
      });
      console.log("Signature image loaded:", signatureFile.name);
      return signatureImage;
    } catch (error) {
      console.error("Error loading signature file:", error);
      return undefined;
    }
  }, []);

  return {
    handleDownload,
    getSignatureImage,
  };
}
