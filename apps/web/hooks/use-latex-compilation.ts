import { useMutation } from "@tanstack/react-query";
import { useAxios } from "./use-axios";
import { AxiosError } from "axios";

interface LatexCompilationRequest {
  latex_content: string;
  compiler?: string;
  signature_image?: File;
}

export const useLatexCompilation = () => {
  return useMutation({
    mutationFn: async (request: LatexCompilationRequest): Promise<Blob> => {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append("latex_content", request.latex_content);
      formData.append("compiler", request.compiler || "pdflatex");

      if (request.signature_image) {
        formData.append("signature_image", request.signature_image);
      }

      const response = await useAxios.post("/latex/compile", formData, {
        responseType: "blob",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        // Add timeout to prevent hanging requests
        timeout: 30000, // 30 seconds
      });

      return response.data;
    },
    // Prevent automatic retries on failure
    retry: false,
    // Add better error handling
    onError: (error) => {
      console.error("LaTeX compilation failed:", error);

      // Log additional error details for debugging
      if (error instanceof AxiosError && error.response) {
        console.error("Response status:", error.response.status);
        console.error("Response data:", error.response.data);
      } else if (error instanceof AxiosError && error.request) {
        console.error(
          "Request was made but no response received:",
          error.request,
        );
      } else {
        console.error("Error setting up request:", error.message);
      }
    },
    // Add mutation key for better debugging
    mutationKey: ["latex-compilation"],
  });
};
