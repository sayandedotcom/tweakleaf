"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { type Message } from "@/components/ui/chat-message";
import { ChatMessage } from "@/components/ui/chat-message";
import { ResumeAiInput } from "@/components/kokonutui/resume-ai-input";
import { useTweakResume, useResumeMessages } from "@/hooks/use-tweak-resume";
import useLocalStorage from "use-local-storage";
import { toast } from "sonner";
import { navigation } from "@/configs/navigation";
import { models } from "@/configs/models";
import { useAuth } from "@clerk/nextjs";
import { TypingIndicator } from "@/components/ui/typing-indicator";
import { useQueryParam } from "@/hooks/use-query-param";
import { LOCAL_STORAGE_KEYS } from "@/configs/local-storage-keys";
import { EmptyComponent } from "@/components/empty";

interface BaseMessage {
  role: string;
  content: string;
}

export default function ResumeTab() {
  const { userId } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<"idle" | "submitted" | "streaming">(
    "idle",
  );
  const [currentThreadId, setCurrentThreadId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { mutate: generateResume, isPending } = useTweakResume();

  // Use optimized query param hook
  const { value: modelName } = useQueryParam({
    paramName: navigation.MODEL.PARAM,
    defaultValue:
      typeof window !== "undefined"
        ? localStorage.getItem("modelName") || undefined
        : undefined,
  });

  // Fetch messages for current thread
  const { data: threadMessages, refetch: refetchMessages } =
    useResumeMessages(currentThreadId);

  // Local storage hooks with constants
  const [companyBio] = useLocalStorage(LOCAL_STORAGE_KEYS.COMPANY_BIO, "");

  const [jobDescription] = useLocalStorage(
    LOCAL_STORAGE_KEYS.JOB_DESCRIPTION,
    "",
  );

  const [resumeLatexContent, setResumeLatexContent] = useLocalStorage(
    LOCAL_STORAGE_KEYS.RESUME_LATEX_CONTENT,
    "",
  );

  const [storedThreadId, setStoredThreadId] = useLocalStorage(
    LOCAL_STORAGE_KEYS.RESUME_THREAD_ID,
    "",
  );

  const [humanizePro] = useLocalStorage(
    LOCAL_STORAGE_KEYS.HUMANIZE_PRO_FOR_RESUME,
    false,
  );

  const [resumeContext] = useLocalStorage(
    LOCAL_STORAGE_KEYS.RESUME_CONTEXT,
    "",
  );

  // Get the current model and its API key - memoized for performance
  const currentModel = useMemo(() => {
    return models.find((model) => model.url === modelName) || models[0];
  }, [modelName]);

  // Memoized API key loading function
  const loadApiKey = useCallback(() => {
    if (typeof window !== "undefined" && currentModel) {
      try {
        const stored = localStorage.getItem("tweak_jobs_model_api_keys");
        console.log("🔑 API Key Debug:", {
          stored: stored ? "Present" : "Missing",
          currentModel: currentModel?.name,
          currentModelUrl: currentModel?.url,
        });

        if (stored) {
          const parsed = JSON.parse(stored);
          const key = currentModel.url.toLowerCase();
          const apiKey = parsed[key] || "";
          console.log("🔑 Parsed API Key:", {
            key,
            apiKey: apiKey ? `${apiKey.substring(0, 10)}...` : "Missing",
            allKeys: Object.keys(parsed),
          });
          return apiKey;
        }
      } catch (error) {
        console.error("Error loading API key from localStorage:", error);
      }
    }
    return "";
  }, [currentModel]);

  const [apiKey, setApiKey] = useState(loadApiKey);

  // Load API key from localStorage when component mounts or model changes
  useEffect(() => {
    const newApiKey = loadApiKey();
    setApiKey(newApiKey);

    // Listen for localStorage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "tweak_jobs_model_api_keys") {
        setApiKey(loadApiKey());
      }
    };

    const handleCustomStorageChange = (e: CustomEvent) => {
      if (e.detail.key === "tweak_jobs_model_api_keys") {
        setApiKey(loadApiKey());
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
  }, [loadApiKey]);

  // Load stored thread ID on component mount
  useEffect(() => {
    if (storedThreadId && !currentThreadId) {
      console.log("📨 Loading thread ID from localStorage:", storedThreadId);
      setCurrentThreadId(storedThreadId);
    }
  }, [storedThreadId, currentThreadId]);

  // No automatic thread ID reset - only reset when user explicitly starts new conversation

  // Convert thread messages to UI messages
  useEffect(() => {
    if (threadMessages?.messages) {
      console.log("📨 Chat History from API:", {
        threadId: threadMessages.thread_id,
        messagesCount: threadMessages.messages.length,
        messages: threadMessages.messages,
      });

      const uiMessages: Message[] = (
        threadMessages.messages as BaseMessage[]
      ).map((msg: BaseMessage, index: number) => ({
        id: `thread-${index}`,
        role: msg.role,
        content: msg.content,
        createdAt: new Date(),
      }));
      setMessages(uiMessages);
    } else if (threadMessages && threadMessages.messages.length === 0) {
      // If API returns empty messages, clear the local messages and reset thread ID
      console.log("📨 Empty messages from API, clearing local state");
      setMessages([]);
      setCurrentThreadId(null);
      setStoredThreadId("");
    }
  }, [threadMessages, setStoredThreadId]);

  // Debug logging for thread ID and messages state
  useEffect(() => {
    console.log("🔍 State Debug:", {
      currentThreadId,
      storedThreadId,
      messagesLength: messages.length,
      threadMessagesExists: !!threadMessages,
      threadMessagesLength: threadMessages?.messages?.length || 0,
    });
  }, [currentThreadId, storedThreadId, messages.length, threadMessages]);

  const scrollToBottom = useCallback(() => {
    // Since we're using flex-col-reverse, scroll to the top of the container
    const container = messagesEndRef.current?.parentElement?.parentElement;
    if (container) {
      container.scrollTop = 0;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleInputChange = useCallback((value: string) => {
    setInput(value);
  }, []);

  // Memoized computed values
  const isGenerating = useMemo(
    () => status === "submitted" || status === "streaming",
    [status],
  );

  // Define callAIAgent first to avoid hoisting issues
  const callAIAgent = useCallback(
    (
      userMessage: string,
      chatHistory?: Array<{ role: string; content: string }>,
    ) => {
      // Check if required data is available
      if (!companyBio || !jobDescription) {
        toast.error("Missing Information", {
          description:
            "Please fill in both company bio and job description in the Job tab first.",
        });
        return;
      }

      if (!resumeLatexContent) {
        toast.error("Missing Resume Template", {
          description:
            "Please ensure you have a resume template in the LaTeX editor.",
        });
        return;
      }

      // Load API key if not already loaded
      let currentApiKey = apiKey;
      if (!currentApiKey && currentModel) {
        try {
          const stored = localStorage.getItem("tweak_jobs_model_api_keys");
          if (stored) {
            const parsed = JSON.parse(stored);
            const key = currentModel.url.toLowerCase();
            currentApiKey = parsed[key] || "";
          }
        } catch (error) {
          console.error("Error loading API key:", error);
        }
      }

      // Check if API key is configured for the current model
      console.log("🔍 API Key Validation:", {
        currentApiKey: currentApiKey
          ? `${currentApiKey.substring(0, 10)}...`
          : "Missing",
        isConfigured: currentModel?.isConfigured(),
        currentModel: currentModel?.name,
        currentModelUrl: currentModel?.url,
      });

      if (!currentApiKey || !currentModel?.isConfigured()) {
        console.error("❌ API Key Check Failed:", {
          apiKey: currentApiKey ? "Present" : "Missing",
          isConfigured: currentModel?.isConfigured(),
          currentModel: currentModel?.name,
        });
        toast.error("API Key Not Configured", {
          description: `Please configure your ${currentModel?.name || "selected model"} API key in Settings > Models first.`,
        });
        return;
      }

      // Use provided chat history or convert current messages
      const finalChatHistory =
        chatHistory ||
        messages.map((msg) => ({
          role: msg.role,
          content: msg.content,
        }));

      // Ensure we have a valid model name
      const finalModelName = modelName || currentModel?.url || models[0]?.url;

      // Debug logging
      console.log("🔍 API Request Debug:", {
        originalModel: modelName,
        finalModel: finalModelName,
        key: currentApiKey ? `${currentApiKey.substring(0, 10)}...` : "MISSING",
        user_id: userId,
        thread_id: currentThreadId,
        user_message: userMessage,
        chat_history_length: finalChatHistory.length,
        chat_history: finalChatHistory,
        companyBio: companyBio ? "Present" : "MISSING",
        jobDescription: jobDescription ? "Present" : "MISSING",
        resumeLatexContent: resumeLatexContent ? "Present" : "MISSING",
        currentModel: currentModel?.name,
        currentModelUrl: currentModel?.url,
      });

      if (!finalModelName) {
        toast.error("Model Not Selected", {
          description: "Please select a model from the dropdown.",
        });
        return;
      }

      // Ensure we have a valid thread ID or use undefined for new thread
      const validThreadId =
        currentThreadId && messages.length > 0 ? currentThreadId : undefined;

      console.log("🔍 Thread ID Check:", {
        currentThreadId,
        messagesLength: messages.length,
        validThreadId,
        willCreateNewThread: !validThreadId,
      });

      // Trigger the resume generation API
      generateResume(
        {
          model: finalModelName,
          key: currentApiKey,
          user_id: userId!,
          resume_context: resumeContext,
          company_info: companyBio,
          job_description: jobDescription,
          resume: resumeLatexContent,
          user_message: userMessage,
          thread_id: validThreadId, // Use valid thread ID or undefined for new thread
          chat_history: finalChatHistory,
          humanized_pro_for_resume: humanizePro,
        },
        {
          onSuccess: (response) => {
            console.log("✅ API Response:", response);

            // Update the resume content in local storage
            if (response.resume) {
              setResumeLatexContent(response.resume);
            }

            // Update thread ID if this is a new thread
            if (response.thread_id && !currentThreadId) {
              setCurrentThreadId(response.thread_id);
              setStoredThreadId(response.thread_id);
            }

            // Refetch messages to get the updated conversation
            refetchMessages();
            setStatus("idle");

            toast.success("Resume Updated!", {
              description:
                "Your resume has been updated based on your request.",
            });
          },
          onError: (error) => {
            console.error("❌ Failed to update resume:", error);
            console.error("❌ Error details:", error.message);
            console.error("❌ Error status:", error?.cause);

            setStatus("idle");

            toast.error("Update Failed", {
              description: "Failed to update resume. Please try again.",
            });
          },
        },
      );
    },
    [
      companyBio,
      jobDescription,
      resumeLatexContent,
      apiKey,
      currentModel,
      resumeContext,
      messages,
      modelName,
      currentThreadId,
      userId,
      generateResume,
      setResumeLatexContent,
      setCurrentThreadId,
      setStoredThreadId,
      refetchMessages,
      humanizePro,
    ],
  );

  const handleSubmit = useCallback(() => {
    if (!input.trim()) return;

    // Prevent multiple simultaneous requests
    if (isGenerating) {
      return;
    }

    const userMessage = input;
    setInput("");
    setStatus("submitted");

    // Add the user message to the chat immediately
    const newUserMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: userMessage,
      createdAt: new Date(),
    };
    setMessages((prev) => [...prev, newUserMessage]);

    // Call the AI agent with the user's message
    callAIAgent(userMessage);
  }, [input, isGenerating, callAIAgent]);

  const callAIAgentWithNewThread = useCallback(
    (
      userMessage: string,
      chatHistory?: Array<{ role: string; content: string }>,
    ) => {
      // Check if required data is available
      if (!companyBio || !jobDescription) {
        toast.error("Missing Information", {
          description:
            "Please fill in both company bio and job description in the Job tab first.",
        });
        return;
      }

      if (!resumeLatexContent) {
        toast.error("Missing Resume Template", {
          description:
            "Please ensure you have a resume template in the LaTeX editor.",
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

      // Use provided chat history or convert current messages
      const finalChatHistory =
        chatHistory ||
        messages.map((msg) => ({
          role: msg.role,
          content: msg.content,
        }));

      // Trigger the resume generation API with explicit null thread_id
      generateResume(
        {
          model: modelName!,
          key: apiKey,
          user_id: userId!,
          resume_context: resumeContext,
          company_info: companyBio,
          job_description: jobDescription,
          resume: resumeLatexContent,
          user_message: userMessage,
          thread_id: undefined, // Explicitly pass undefined for new thread
          chat_history: finalChatHistory,
          humanized_pro_for_resume: humanizePro,
        },
        {
          onSuccess: (response) => {
            console.log("✅ API Response:", response);

            // Update the resume content in local storage
            if (response.resume) {
              setResumeLatexContent(response.resume);
            }

            // Update thread ID if this is a new thread
            if (response.thread_id && !currentThreadId) {
              setCurrentThreadId(response.thread_id);
              setStoredThreadId(response.thread_id);
            }

            // Refetch messages to get the updated conversation
            refetchMessages();
            setStatus("idle");

            toast.success("Resume Updated!", {
              description:
                "Your resume has been updated based on your request.",
            });
          },
          onError: (error) => {
            console.error("❌ Failed to update resume:", error);
            console.error("❌ Error details:", error.message);
            console.error("❌ Error status:", error?.cause);

            setStatus("idle");

            toast.error("Update Failed", {
              description: "Failed to update resume. Please try again.",
            });
          },
        },
      );
    },
    [
      companyBio,
      jobDescription,
      resumeLatexContent,
      apiKey,
      currentModel,
      resumeContext,
      modelName,
      userId,
      generateResume,
      setResumeLatexContent,
      setCurrentThreadId,
      setStoredThreadId,
      refetchMessages,
      currentThreadId,
      messages,
      humanizePro,
    ],
  );

  const handleStartResume = useCallback(() => {
    // Prevent multiple simultaneous requests
    if (isGenerating) {
      return;
    }

    // Check if required data is available
    if (!companyBio || !jobDescription) {
      toast.error("Missing Information", {
        description:
          "Please fill in both company bio and job description in the Job tab first.",
      });
      return;
    }

    if (!resumeLatexContent) {
      toast.error("Missing Resume Template", {
        description:
          "Please ensure you have a resume template in the LaTeX editor.",
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

    // Add the user message to the chat immediately
    const userMessage = "Start building my resume";
    const newUserMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: userMessage,
      createdAt: new Date(),
    };
    setMessages([newUserMessage]);

    // Set status to submitted to show loading state
    setStatus("submitted");

    // Convert current messages to chat history format
    const chatHistory = messages.map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));

    // Call the AI agent with an initial message and explicitly pass null thread_id
    callAIAgentWithNewThread(userMessage, chatHistory);
  }, [
    isGenerating,
    companyBio,
    jobDescription,
    resumeLatexContent,
    apiKey,
    currentModel,
    messages,
    callAIAgentWithNewThread,
    setCurrentThreadId,
    setStoredThreadId,
  ]);

  // Memoized computed values
  const isEmpty = useMemo(() => messages.length === 0, [messages.length]);

  return (
    <div className="grid grid-rows-[1fr_auto] h-full overflow-hidden">
      {/* Messages Container - Scrollable with explicit height */}
      <div className="overflow-y-auto pt-1 overflow-x-hidden min-h-0 relative flex flex-col-reverse">
        {isEmpty && !companyBio && !jobDescription && <EmptyComponent />}
        {!isEmpty && (
          <div className="px-4 pb-8">
            <div className="space-y-8 ">
              {messages.map((message, index) => (
                <div key={message.id || index}>
                  <ChatMessage {...message} showTimeStamp={false} />
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
        <ResumeAiInput
          isEmpty={isEmpty}
          isPending={isPending}
          value={input}
          onChange={handleInputChange}
          onSubmit={handleSubmit}
          disabled={isGenerating}
          handleStartResume={handleStartResume}
          placeholder={
            isEmpty
              ? "Tell me about the position you're applying for..."
              : "Ask me to make changes to your resume..."
          }
        />
      </div>
    </div>
  );
}
