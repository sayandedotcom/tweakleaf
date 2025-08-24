"use client";

import { useState, useRef, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { type Message } from "@/components/ui/chat-message";
import { ChatMessage } from "@/components/ui/chat-message";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { AiInput } from "@/components/kokonutui/ai-input";
import { useTweakCoverLetter } from "@/hooks/use-tweak-coverletter";
import useLocalStorage from "use-local-storage";
import { toast } from "sonner";
import { navigation } from "@/configs/navigation";
import { models } from "@/configs/models";
import { useAuth } from "@clerk/nextjs";

interface ChatMessageData {
  role: string;
  content: string;
  timestamp?: string;
}

export function CoverLetterTab() {
  const { userId } = useAuth();
  const searchParams = useSearchParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<"idle" | "submitted" | "streaming">(
    "idle",
  );
  const [messageContexts, setMessageContexts] = useState<
    Record<string, boolean>
  >({});

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { mutate: generateCoverLetter, isPending } = useTweakCoverLetter();

  // Get current model from URL query parameter
  const modelName = searchParams.get(navigation.MODEL.PARAM);

  // Local storage hooks
  const [companyBio] = useLocalStorage("companyBio", "");
  const [jobDescription] = useLocalStorage("jobDescription", "");
  const [coverLetterLatexContent, setCoverLetterLatexContent] = useLocalStorage(
    "coverLetterLatexContent",
    "",
  );

  // Get the current model and its API key
  const currentModel =
    models.find((model) => model.url === modelName) || models[0];
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

  const [apiKey, setApiKey] = useState("");

  // Update API key when model changes or localStorage changes
  useEffect(() => {
    if (!currentModel) return;

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
  }, [modelName, currentModel?.url]);

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

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      createdAt: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setMessageContexts((prev) => ({ ...prev, [userMessage.id]: false }));
    setInput("");
    setStatus("submitted");

    // Call the AI agent with the user's message
    callAIAgent(input);
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

    // Convert messages to chat format for the API
    const chatHistory: ChatMessageData[] = messages.map((msg) => ({
      role: msg.role,
      content: msg.content,
      timestamp: msg.createdAt?.toISOString(),
    }));

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
        chat_history: chatHistory,
      },
      {
        onSuccess: (response) => {
          // Update the cover letter content in local storage
          if (response.coverletter) {
            setCoverLetterLatexContent(response.coverletter);
          }

          // Add AI response as a message
          const aiMessage: Message = {
            id: Date.now().toString(),
            role: "assistant",
            content:
              response.messages?.[response.messages.length - 1]?.content ||
              "Cover letter updated successfully!",
            createdAt: new Date(),
          };
          setMessages((prev) => [...prev, aiMessage]);
          setStatus("idle");

          toast.success("Cover Letter Updated!", {
            description:
              "Your cover letter has been updated based on your request.",
          });
        },
        onError: (error) => {
          console.error("Failed to update cover letter:", error);

          // Add error message to chat
          const errorMessage: Message = {
            id: Date.now().toString(),
            role: "assistant",
            content:
              "Sorry, I couldn't process your request. Please try again.",
            createdAt: new Date(),
          };
          setMessages((prev) => [...prev, errorMessage]);
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

    // Call the AI agent with an initial message
    callAIAgent("Start building my cover letter");
  };

  const toggleMessageContext = (messageId: string) => {
    setMessageContexts((prev) => ({
      ...prev,
      [messageId]: !prev[messageId],
    }));
  };

  const isGenerating = status === "submitted" || status === "streaming";

  const lastMessage = messages.at(-1);
  const isEmpty = messages.length === 0;
  const isTyping = lastMessage?.role === "user";

  return (
    <div className="grid grid-rows-[1fr_auto] h-full overflow-hidden">
      {/* Header with Model Info */}
      <div className="px-4 py-2 border-b bg-muted/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              Current Model:
            </span>
            <div className="flex items-center gap-2">
              {currentModel?.logo && (
                <div className="w-5 h-5">
                  <currentModel.logo className="w-full h-full" />
                </div>
              )}
              <span className="text-sm font-medium">{currentModel?.name}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
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
          </div>
        </div>
      </div>

      {/* Messages Container - Scrollable with explicit height */}
      <div className="overflow-y-auto overflow-x-hidden min-h-0 relative">
        {!isEmpty && (
          <div className="px-4 pb-4">
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div key={message.id || index}>
                  <ChatMessage {...message} showTimeStamp={true} />
                  {/* Context Toggle for User Messages */}
                  {message.role === "user" && (
                    <div className="flex items-center gap-2 ml-auto mt-2 p-2 bg-muted/50 rounded-lg max-w-fit">
                      <span className="text-xs text-muted-foreground">
                        Update context:
                      </span>
                      <Switch
                        id={`context-switch-${message.id}`}
                        checked={messageContexts[message.id]}
                        onCheckedChange={() => toggleMessageContext(message.id)}
                      />
                      <Label htmlFor={`context-switch-${message.id}`}>
                        {messageContexts[message.id]
                          ? "Added to your context"
                          : "Not added to your context"}
                      </Label>
                    </div>
                  )}
                </div>
              ))}
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
