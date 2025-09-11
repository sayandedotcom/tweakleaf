import { useMutation, useQuery } from "@tanstack/react-query";
import { useAxios } from "./use-axios";
import { AxiosError } from "axios";

interface BaseMessage {
  type: string;
  content: string;
}

interface CoverLetterRequest {
  model: string;
  key: string;
  user_id: string;
  user_info: string;
  company_info: string;
  job_description: string;
  coverletter: string;
  user_message?: string;
  thread_id?: string;
}

interface CoverLetterResponse {
  messages: Array<{ type: string; content: string }>;
  status: number;
  coverletter: string;
  thread_id: string;
}

export const useTweakCoverLetter = () => {
  return useMutation({
    mutationFn: async (
      request: CoverLetterRequest,
    ): Promise<CoverLetterResponse> => {
      const response = await useAxios.post("/tweak/coverletter", request, {
        headers: {
          "Content-Type": "application/json",
        },
        // Add timeout to prevent hanging requests
        // timeout: 30000, // 30 seconds
      });

      return response.data;
    },
    // Prevent automatic retries on failure
    retry: false,
    // Add better error handling
    onError: (error) => {
      console.error("Cover letter generation failed:", error);

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
    mutationKey: ["cover-letter-generation"],
  });
};

export const useCoverLetterMessages = (threadId: string | null) => {
  return useQuery({
    queryKey: ["cover-letter-messages", threadId],
    queryFn: async (): Promise<{
      messages: Array<{ type: string; content: string }>;
      thread_id: string;
    }> => {
      if (!threadId) {
        return { messages: [], thread_id: "" };
      }

      const response = await useAxios.get(
        `/tweak/coverletter/messages?thread_id=${threadId}`,
      );
      return response.data;
    },
    enabled: !!threadId,
    retry: false,
  });
};
