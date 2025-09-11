"use client";

import { useState, useRef, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { type Message } from "@/components/ui/chat-message";
import { ChatMessage } from "@/components/ui/chat-message";
import { Button } from "@/components/ui/button";
// Removed Switch and Label imports since we removed context toggle functionality
import { AiInput } from "@/components/kokonutui/ai-input";
import {
  useTweakCoverLetter,
  useCoverLetterMessages,
} from "@/hooks/use-tweak-coverletter";
import useLocalStorage from "use-local-storage";
import { toast } from "sonner";
import { navigation } from "@/configs/navigation";
import { models } from "@/configs/models";
import { useAuth } from "@clerk/nextjs";
import { Badge } from "@/components/ui/badge";
import { TypingIndicator } from "@/components/ui/typing-indicator";

interface BaseMessage {
  type: string;
  content: string;
}

export function CoverLetterTab() {
  const { userId } = useAuth();
  const searchParams = useSearchParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<"idle" | "submitted" | "streaming">(
    "idle",
  );
  // Removed messageContexts since we're using thread-based messages
  const [currentThreadId, setCurrentThreadId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { mutate: generateCoverLetter, isPending } = useTweakCoverLetter();

  // Fetch messages for current thread
  const { data: threadMessages, refetch: refetchMessages } =
    useCoverLetterMessages(currentThreadId);

  // Get current model from URL query parameter
  const modelName = searchParams.get(navigation.MODEL.PARAM);

  // Local storage hooks
  const [companyBio] = useLocalStorage("companyBio", "");
  const [jobDescription] = useLocalStorage("jobDescription", "");
  const [coverLetterLatexContent, setCoverLetterLatexContent] = useLocalStorage(
    "coverLetterLatexContent",
    "",
  );
  const [storedThreadId, setStoredThreadId] = useLocalStorage(
    "coverLetterThreadId",
    "",
  );

  // Get the current model and its API key
  const currentModel =
    models.find((model) => model.url === modelName) || models[0];

  const [apiKey, setApiKey] = useState("");

  // Load stored thread ID on component mount
  useEffect(() => {
    if (storedThreadId && !currentThreadId) {
      setCurrentThreadId(storedThreadId);
    }
  }, [storedThreadId, currentThreadId]);

  // Convert thread messages to UI messages
  useEffect(() => {
    if (threadMessages?.messages) {
      const uiMessages: Message[] = threadMessages.messages.map(
        (msg: BaseMessage, index: number) => ({
          id: `thread-${index}`,
          role: msg.type === "human" ? "user" : "assistant",
          content: msg.content,
          createdAt: new Date(),
        }),
      );
      setMessages(uiMessages);
    }
  }, [threadMessages]);

  // Update API key when model changes or localStorage changes
  useEffect(() => {
    if (!currentModel) return;

    const getModelApiKey = () => {
      if (typeof window === "undefined" || !currentModel) return "";

      try {
        const stored = localStorage.getItem("tweak_jobs_model_api_keys");
        if (stored) {
          const parsed = JSON.parse(stored);
          const modelKey = currentModel.url.toLowerCase();
          return parsed[modelKey] || "";
        }
      } catch (error) {
        console.error("Error getting model API key:", error);
      }
      return "";
    };

    const updateApiKey = () => {
      setApiKey(getModelApiKey());
    };

    // Initial load
    updateApiKey();

    // Listen for localStorage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "tweak_jobs_model_api_keys") {
        updateApiKey();
      }
    };

    const handleCustomStorageChange = (e: CustomEvent) => {
      if (e.detail.key === "tweak_jobs_model_api_keys") {
        updateApiKey();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener(
      "localStorageChange",
      handleCustomStorageChange as EventListener,
    );

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener(
        "localStorageChange",
        handleCustomStorageChange as EventListener,
      );
    };
  }, [modelName, currentModel?.url, currentModel]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleInputChange = (value: string) => {
    setInput(value);
  };

  const handleSubmit = () => {
    if (!input.trim()) return;

    const userMessage = input;
    setInput("");
    setStatus("submitted");

    // Call the AI agent with the user's message
    callAIAgent(userMessage);
  };

  const callAIAgent = (userMessage: string) => {
    // Check if required data is available
    if (!companyBio || !jobDescription) {
      toast.error("Missing Information", {
        description:
          "Please fill in both company bio and job description in the Job tab first.",
      });
      return;
    }

    if (!coverLetterLatexContent) {
      toast.error("Missing Cover Letter Template", {
        description:
          "Please ensure you have a cover letter template in the LaTeX editor.",
      });
      return;
    }

    // Check if API key is configured for the current model
    if (!apiKey || !currentModel?.isConfigured()) {
      toast.error("API Key Not Configured", {
        description: `Please configure your ${currentModel?.name || "selected model"} API key in Settings > Models first.`,
      });
      return;
    }

    // Trigger the cover letter generation API
    generateCoverLetter(
      {
        model: modelName!,
        key: apiKey,
        user_id: userId!,
        user_info:
          "My name is sayan de . Experienced professional with strong skills in the field",
        company_info: companyBio,
        job_description: jobDescription,
        coverletter: coverLetterLatexContent,
        user_message: userMessage,
        thread_id: currentThreadId || undefined,
      },
      {
        onSuccess: (response) => {
          console.log("✅ API Response:", response);

          // Update the cover letter content in local storage
          if (response.coverletter) {
            setCoverLetterLatexContent(response.coverletter);
          }

          // Update thread ID if this is a new thread
          if (response.thread_id && !currentThreadId) {
            setCurrentThreadId(response.thread_id);
            setStoredThreadId(response.thread_id);
          }

          // Refetch messages to get the updated conversation
          refetchMessages();
          setStatus("idle");

          toast.success("Cover Letter Updated!", {
            description:
              "Your cover letter has been updated based on your request.",
          });
        },
        onError: (error) => {
          console.error("❌ Failed to update cover letter:", error);
          console.error("❌ Error details:", error.message);
          console.error("❌ Error status:", error?.cause);

          setStatus("idle");

          toast.error("Update Failed", {
            description: "Failed to update cover letter. Please try again.",
          });
        },
      },
    );
  };

  const handleStartCoverLetter = () => {
    // Check if required data is available
    if (!companyBio || !jobDescription) {
      toast.error("Missing Information", {
        description:
          "Please fill in both company bio and job description in the Job tab first.",
      });
      return;
    }

    if (!coverLetterLatexContent) {
      toast.error("Missing Cover Letter Template", {
        description:
          "Please ensure you have a cover letter template in the LaTeX editor.",
      });
      return;
    }

    // Check if API key is configured for the current model
    if (!apiKey || !currentModel?.isConfigured()) {
      toast.error("API Key Not Configured", {
        description: `Please configure your ${currentModel?.name || "selected model"} API key in Settings > Models first.`,
      });
      return;
    }

    // Clear current thread to start a new conversation
    setCurrentThreadId(null);
    setStoredThreadId("");

    // Call the AI agent with an initial message
    callAIAgent("Start building my cover letter");
  };

  // Removed toggleMessageContext since we're using thread-based messages

  const isGenerating = status === "submitted" || status === "streaming";

  const isEmpty = messages.length === 0;

  return (
    <div className="grid grid-rows-[1fr_auto] h-full overflow-hidden">
      {/* Header with Model Info */}
      <div className="px-4 py-2 flex items-center justify-between mb-auto bg-muted/30 border">
        <Badge variant={"outline"} className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Current Model:</span>
          <div className="flex items-center gap-2">
            {currentModel?.logo && (
              <div className="w-5 h-5">
                <currentModel.logo className="w-full h-full" />
              </div>
            )}
            <span className="text-sm font-medium">{currentModel?.name}</span>
          </div>
        </Badge>
        <Badge variant={"outline"} className="flex items-center gap-2">
          {currentModel?.isConfigured() ? (
            <div className="flex items-center gap-1 text-xs text-green-600">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              Configured
            </div>
          ) : (
            <div className="flex items-center gap-1 text-xs text-red-600">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              Not Configured
            </div>
          )}
        </Badge>
      </div>

      {/* Messages Container - Scrollable with explicit height */}
      <div className="overflow-y-auto pt-1 overflow-x-hidden min-h-0 relative">
        {!isEmpty && (
          <div className="px-4 pb-4">
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div key={message.id || index}>
                  <ChatMessage {...message} showTimeStamp={true} />
                </div>
              ))}

              {/* Show typing indicator when AI is processing */}
              {isGenerating && (
                <div className="flex justify-start">
                  <TypingIndicator />
                </div>
              )}
            </div>
            {/* Invisible element to scroll to */}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* AI Input - Always visible, with overlay button when empty */}
      <div className="bg-background border-t relative">
        <AiInput
          value={input}
          onChange={handleInputChange}
          onSubmit={handleSubmit}
          disabled={isGenerating}
          placeholder={
            isEmpty
              ? "Tell me about the position you're applying for..."
              : "Ask me to make changes to your cover letter..."
          }
        />

        {/* Overlay Start Button when no messages */}
        {isEmpty && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
            <Button
              className="w-1/2 mx-auto"
              onClick={handleStartCoverLetter}
              disabled={isPending}
            >
              {isPending ? "Generating..." : "Start building my cover letter!"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
