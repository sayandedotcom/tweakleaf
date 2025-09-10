"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ResumePdfProps {
  pdfBlob: Blob | null;
}

function ResumePdf({ pdfBlob }: ResumePdfProps) {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  // FIXED: Update PDF URL when pdfBlob changes - removed pdfUrl from dependency array
  useEffect(() => {
    if (pdfBlob) {
      // Clean up previous blob URL
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }

      // Create blob URL for the new PDF
      const newPdfUrl = URL.createObjectURL(pdfBlob);
      setPdfUrl(newPdfUrl);
    } else {
      // Clean up when no blob
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
      setPdfUrl(null);
    }
  }, [pdfBlob]); // FIXED: Removed pdfUrl from dependencies to prevent infinite loop

  // Clean up blob URLs on unmount
  useEffect(() => {
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [pdfUrl]);

  const downloadResumePdf = () => {
    if (pdfBlob) {
      const link = document.createElement("a");
      const tempUrl = URL.createObjectURL(pdfBlob);
      link.href = tempUrl;
      link.download = "resume.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      // Clean up the temporary URL
      URL.revokeObjectURL(tempUrl);
    }
  };

  if (!pdfBlob) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>PDF Viewer</CardTitle>
        </CardHeader>
        <CardContent className="h-full">
          <div className="text-center text-muted-foreground">
            <p>No PDF available</p>
            <p className="text-sm">Compile LaTeX content to generate a PDF</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (pdfUrl) {
    return (
      <div className="w-full h-full">
        <iframe
          src={pdfUrl}
          width="100%"
          height="100%"
          className="border rounded-lg"
          title="PDF Viewer"
        />
      </div>
    );
  }
}

export default ResumePdf;
