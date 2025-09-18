import { useMutation } from "@tanstack/react-query";
import { useAxios, useCompiler } from "./use-axios";
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
      formData.append("compiler", request.compiler || "xelatex"); // Use xelatex as default

      if (request.signature_image) {
        formData.append("signature_image", request.signature_image);
      }

      try {
        const response = await useCompiler.post("/compiler/compile", formData, {
          responseType: "blob",
          headers: {
            // Don't set Content-Type manually for FormData
            // Let the browser set it with proper boundary
            // "Content-Type": "multipart/form-data", // ❌ Remove this line
          },
          // Add timeout to prevent hanging requests
          timeout: 60000, // Increase to 60 seconds for LaTeX compilation

          // Ensure we don't transform the request
          transformRequest: [
            function (data) {
              return data;
            },
          ],
        });

        // Verify we got a blob
        if (!(response.data instanceof Blob)) {
          throw new Error("Expected PDF blob but got different response type");
        }

        return response.data;
      } catch (error) {
        // Enhanced error handling
        if (error instanceof AxiosError) {
          if (error.response?.status === 0) {
            throw new Error(
              "Network error: Unable to reach server. Check if the service is running.",
            );
          } else if (error.response?.status && error.response.status >= 500) {
            throw new Error(
              `Server error (${error.response.status}): LaTeX compilation failed`,
            );
          } else if (error.response?.status && error.response.status >= 400) {
            // Try to get error message from response
            let errorMessage = "Client error";
            if (error.response.data && error.response.data instanceof Blob) {
              const text = await error.response.data.text();
              try {
                const errorData = JSON.parse(text);
                errorMessage = errorData.detail || errorMessage;
              } catch {
                errorMessage = text || errorMessage;
              }
            }
            throw new Error(`${errorMessage} (${error.response.status || 0})`);
          }
        }

        // Re-throw original error if not handled above
        throw error;
      }
    },
    // Prevent automatic retries on failure
    retry: false,
    // Add better error handling
    onError: (error) => {
      console.error("LaTeX compilation failed:", error);

      // Log additional error details for debugging
      if (error instanceof AxiosError && error.response) {
        console.error("Response status:", error.response.status);
        console.error("Response headers:", error.response.headers);
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
