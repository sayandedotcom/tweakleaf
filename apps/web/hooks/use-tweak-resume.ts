import { useMutation, useQuery } from "@tanstack/react-query";
import { useAxios } from "./use-axios";
import { AxiosError } from "axios";

interface ResumeRequest {
  model: string;
  key: string;
  user_id: string;
  resume_context: string;
  company_info: string;
  job_description: string;
  resume: string;
  user_message?: string;
  thread_id?: string;
  chat_history?: Array<{ role: string; content: string }>;
  humanized_pro_for_resume: boolean;
}

interface ResumeResponse {
  messages: Array<{ role: string; content: string }>;
  status: number;
  resume: string;
  thread_id: string;
}

export const useTweakResume = () => {
  return useMutation({
    mutationFn: async (request: ResumeRequest): Promise<ResumeResponse> => {
      const response = await useAxios.post("/tweak/resume", request, {
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
      console.error("Resume generation failed:", error);

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
    mutationKey: ["resume-generation"],
  });
};

export const useResumeMessages = (threadId: string | null) => {
  return useQuery({
    queryKey: ["resume-messages", threadId],
    queryFn: async (): Promise<{
      messages: Array<{ role: string; content: string }>;
      thread_id: string;
    }> => {
      if (!threadId) {
        return { messages: [], thread_id: "" };
      }

      const response = await useAxios.get(
        `/tweak/resume/messages?thread_id=${threadId}`,
      );
      return response.data;
    },
    enabled: !!threadId,
    retry: false,
  });
};
