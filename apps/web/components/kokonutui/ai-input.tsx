"use client";

import {
  ArrowRight,
  Bot,
  Check,
  ChevronDown,
  Gift,
  Paperclip,
  User,
  UserRound,
  X,
} from "lucide-react";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useAutoResizeTextarea } from "@/hooks/use-auto-resize-textarea";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion, AnimatePresence } from "motion/react";
import { TooltipComponent } from "../tooltip-component";
import { llmModelsSvg } from "@/configs/llm-models-svg";
import { navigation } from "@/configs/navigation";
import { useRouter, useSearchParams } from "next/navigation";
import { models, ModelConfig } from "@/configs/models";
import React from "react";

interface AiInputProps {
  value?: string;
  onChange?: (value: string) => void;
  onSubmit?: () => void;
  disabled?: boolean;
  placeholder?: string;
}

export function AiInput({
  value: controlledValue,
  onChange,
  onSubmit,
  disabled = false,
  placeholder = "What can I do for you?",
}: AiInputProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [internalValue, setInternalValue] = useState("");
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { textareaRef, adjustHeight } = useAutoResizeTextarea({
    minHeight: 72,
    maxHeight: 300,
  });

  // Listen for localStorage changes to refresh configuration status
  React.useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "tweak_jobs_model_api_keys") {
        setRefreshTrigger((prev) => prev + 1);
      }
    };

    const handleCustomStorageChange = (e: CustomEvent) => {
      if (e.detail.key === "tweak_jobs_model_api_keys") {
        setRefreshTrigger((prev) => prev + 1);
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
  }, []);

  // Get current model from URL query parameter - reactive to URL changes
  const currentModelUrl = searchParams.get(navigation.MODEL.PARAM);

  // If no model in URL, try to get from localStorage
  const getInitialModel = () => {
    if (currentModelUrl) {
      return models.find((model) => model.url === currentModelUrl);
    }

    // Try to get from localStorage
    if (typeof window !== "undefined") {
      const storedModelUrl = localStorage.getItem("modelName");
      if (storedModelUrl) {
        const storedModel = models.find(
          (model) => model.url === storedModelUrl,
        );
        if (storedModel) {
          return storedModel;
        }
      }
    }

    return models[0];
  };

  const selectedModel = getInitialModel() || {
    name: "",
    logo: null,
    url: "",
    model: "",
    configured: false,
    apiKeyUrl: "",
    isConfigured: () => false,
  };

  // Use controlled value if provided, otherwise use internal state
  const value = controlledValue !== undefined ? controlledValue : internalValue;
  const setValue = onChange || setInternalValue;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (onSubmit) {
        onSubmit();
      } else {
        setValue("");
        adjustHeight(true);
      }
    }
  };

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit();
    } else {
      setValue("");
      adjustHeight(true);
    }
  };

  const handleModelChange = (model: (typeof models)[0]) => {
    const params = new URLSearchParams(searchParams);
    params.set(navigation.MODEL.PARAM, model.url);

    // Store in localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("modelName", model.url);

      // Dispatch custom event for same-tab localStorage changes
      window.dispatchEvent(
        new CustomEvent("localStorageChange", {
          detail: { key: "modelName", value: model.url },
        }),
      );
    }

    router.push(`?${params.toString()}`);
  };

  return (
    <div className="w-full">
      <div className="bg-muted p-1.5 pt-4 border border-border">
        <div className="flex items-center gap-2 mb-2.5 mx-2">
          <div className="flex-1 flex items-center gap-2">
            <h3 className="text-muted-foreground text-xs tracking-tighter">
              Provide as much as context as possible for better results next
              time !
            </h3>
          </div>
          <TooltipComponent content="Update your profile">
            <UserRound className="w-5 h-5 text-foreground bg-background p-0.5" />
          </TooltipComponent>
        </div>
        <div className="relative">
          <div className="relative flex flex-col">
            <div className="overflow-y-auto" style={{ maxHeight: "400px" }}>
              <Textarea
                id="ai-input-15"
                value={value}
                placeholder={placeholder}
                className={cn(
                  "w-full bg-secondary text-foreground px-4 py-3 border-none resize-none focus-visible:ring-0 focus-visible:ring-offset-0",
                  "min-h-[72px]",
                )}
                ref={textareaRef}
                onKeyDown={handleKeyDown}
                onChange={(e) => {
                  setValue(e.target.value);
                  adjustHeight();
                }}
                disabled={disabled}
              />
            </div>
            <div className="h-14 bg-secondary text-foreground flex items-center">
              <div className="absolute left-3 right-3 bottom-3 flex items-center justify-between w-[calc(100%-24px)]">
                <div className="flex items-center gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="flex items-center gap-1 h-8 pl-1 pr-2 text-xs text-foreground hover:bg-accent hover:text-accent-foreground focus-visible:ring-1 focus-visible:ring-offset-0 focus-visible:ring-blue-500"
                      >
                        <AnimatePresence mode="wait">
                          <motion.div
                            key={selectedModel.name}
                            initial={{
                              opacity: 0,
                              y: -5,
                            }}
                            animate={{
                              opacity: 1,
                              y: 0,
                            }}
                            exit={{
                              opacity: 0,
                              y: 5,
                            }}
                            transition={{
                              duration: 0.15,
                            }}
                            className="flex items-center gap-1"
                          >
                            {models
                              .find((m) => m.name === selectedModel.name)
                              ?.logo({ className: "w-4 h-4 bg-text" }) || (
                              <Bot className="w-4 h-4" />
                            )}
                            {selectedModel.name}
                            <ChevronDown className="w-3 h-4" />
                          </motion.div>
                        </AnimatePresence>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      className={cn(
                        "min-w-[10rem]",
                        "border-border",
                        "bg-popover text-popover-foreground",
                      )}
                    >
                      {models.map((model) => (
                        <DropdownMenuItem
                          key={model.name}
                          onClick={() => handleModelChange(model)}
                          className={cn(
                            "flex items-center gap-2",
                            selectedModel.name === model.name && "bg-muted",
                          )}
                        >
                          <div className="flex items-center gap-2">
                            {model.logo({ className: "w-4 h-4 bg-text" }) || (
                              <Bot className="w-4 h-4 opacity-50" />
                            )}
                            <span>{model.name}</span>
                          </div>
                          <div className="ml-auto flex items-center gap-2">
                            <TooltipComponent
                              content={
                                model.isConfigured()
                                  ? "Configured"
                                  : "Not configured, please add your API key"
                              }
                            >
                              <div className="flex items-center justify-center w-4 h-4">
                                {model.isConfigured() ? (
                                  <Check className="w-3 h-3 text-green-500" />
                                ) : (
                                  <X className="w-3 w-3 text-red-500" />
                                )}
                              </div>
                            </TooltipComponent>
                          </div>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <Button
                  aria-label="Send message"
                  disabled={!value.trim() || disabled}
                  variant="default"
                  size="icon"
                  onClick={handleSubmit}
                >
                  <ArrowRight
                    className={cn(
                      "w-4 h-4 transition-opacity duration-200 text-primary-foreground",
                      value.trim() && !disabled ? "opacity-100" : "opacity-30",
                    )}
                  />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
