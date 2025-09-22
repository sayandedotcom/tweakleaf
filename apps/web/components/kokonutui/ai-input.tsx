"use client";

import {
  ArrowRight,
  BookPlus,
  Bot,
  BriefcaseBusiness,
  Check,
  ChevronDown,
  Info,
  Sparkles,
  TriangleAlert,
  X,
} from "lucide-react";
import { TypingIndicator } from "@/components/ui/typing-indicator";
import { useState, useCallback, useMemo, useEffect } from "react";
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
import { navigation } from "@/configs/navigation";
import { useRouter } from "next/navigation";
import { models } from "@/configs/models";
import { Badge } from "../ui/badge";
import { LOCAL_STORAGE_KEYS } from "@/configs/local-storage-keys";
import useLocalStorage from "use-local-storage";
import { useQueryParam } from "@/hooks/use-query-param";
import { HumanizedProButtonCoverLetter } from "../humanized-pro-button-coverletter";

interface AiInputProps {
  value?: string;
  onChange?: (value: string) => void;
  onSubmit?: () => void;
  disabled?: boolean;
  placeholder?: string;
  isEmpty?: boolean;
  isPending?: boolean;
  handleStartCoverLetter?: () => void;
}

export function AiInput({
  value: controlledValue,
  onChange,
  onSubmit,
  disabled = false,
  placeholder = "What can I do for you?",
  isEmpty = false,
  isPending = false,
  handleStartCoverLetter,
}: AiInputProps) {
  const router = useRouter();
  const [internalValue, setInternalValue] = useState("");
  const [, setRefreshTrigger] = useState(0);

  const { textareaRef, adjustHeight } = useAutoResizeTextarea({
    minHeight: 72,
    maxHeight: 300,
  });

  const [coverLetterContext] = useLocalStorage(
    LOCAL_STORAGE_KEYS.COVER_LETTER_CONTEXT,
    "",
  );

  // Use optimized query param hook
  const { value: currentModelUrl } = useQueryParam({
    paramName: navigation.MODEL.PARAM,
    defaultValue:
      typeof window !== "undefined"
        ? localStorage.getItem(LOCAL_STORAGE_KEYS.MODEL_NAME) || undefined
        : undefined,
  });

  const { setValue: setChangeJobDescription } = useQueryParam({
    paramName: navigation.LEFT_PANEL.PARAM,
    defaultValue: navigation.LEFT_PANEL.JOB,
  });

  const { setValue: setChangeContext } = useQueryParam({
    paramName: navigation.LEFT_PANEL.PARAM,
    defaultValue: navigation.LEFT_PANEL.CONTEXTS,
  });

  // Listen for localStorage changes to refresh configuration status
  useEffect(() => {
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

  // Memoized model selection logic
  const selectedModel = useMemo(() => {
    const findModel = (url: string | null) => {
      if (!url) return null;
      return models.find((model) => model.url === url);
    };

    // Try URL first
    const urlModel = findModel(currentModelUrl);
    if (urlModel) return urlModel;

    // Try localStorage
    if (typeof window !== "undefined") {
      const storedModelUrl = localStorage.getItem(
        LOCAL_STORAGE_KEYS.MODEL_NAME,
      );
      const storedModel = findModel(storedModelUrl);
      if (storedModel) return storedModel;
    }

    return (
      models[0] || {
        name: "",
        logo: () => <Bot className="w-4 h-4" />,
        url: "",
        model: "",
        configured: false,
        apiKeyUrl: "",
        isConfigured: () => false,
      }
    );
  }, [currentModelUrl]);

  // Use controlled value if provided, otherwise use internal state
  const value = controlledValue !== undefined ? controlledValue : internalValue;
  const setValue = onChange || setInternalValue;

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        if (onSubmit) {
          onSubmit();
        } else {
          setValue("");
          adjustHeight(true);
        }
      }
    },
    [onSubmit, setValue, adjustHeight],
  );

  const handleSubmit = useCallback(() => {
    if (onSubmit) {
      onSubmit();
    } else {
      setValue("");
      adjustHeight(true);
    }
  }, [onSubmit, setValue, adjustHeight]);

  const handleModelChange = useCallback(
    (model: (typeof models)[0]) => {
      // Store in localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem(LOCAL_STORAGE_KEYS.MODEL_NAME, model.url);

        // Dispatch custom event for same-tab localStorage changes
        window.dispatchEvent(
          new CustomEvent("localStorageChange", {
            detail: { key: LOCAL_STORAGE_KEYS.MODEL_NAME, value: model.url },
          }),
        );
      }

      // Update URL with new model
      const params = new URLSearchParams(window.location.search);
      params.set(navigation.MODEL.PARAM, model.url);
      router.push(`?${params.toString()}`);
    },
    [router],
  );

  const [companyBio] = useLocalStorage(LOCAL_STORAGE_KEYS.COMPANY_BIO, "");

  // Memoized button disabled state
  const isButtonDisabled = useMemo(
    () => isPending || !companyBio || !selectedModel?.isConfigured(),
    [isPending, companyBio, selectedModel],
  );

  return (
    <div className="w-full">
      <div className="bg-muted p-1.5 pt-4 border border-border">
        <div className="flex items-center gap-2 mb-2.5 mx-2">
          <h3 className=" text-xs tracking-tighter w-full">
            If you want AI to remember everytime of your info or preferences,
            add them in context tab !
          </h3>
          <div className="relative">
            {!coverLetterContext && (
              <TooltipComponent content="Your context is Empty click to add context">
                <TriangleAlert
                  onClick={() =>
                    setChangeContext(navigation.LEFT_PANEL.CONTEXTS)
                  }
                  fill="#FFFF00"
                  className="w-5 h-5 text-black absolute -top-1 -right-1 z-10 cursor-pointer"
                />
              </TooltipComponent>
            )}
            <TooltipComponent content="Add context">
              <BookPlus
                onClick={() => setChangeContext(navigation.LEFT_PANEL.CONTEXTS)}
                className="w-5 h-5 text-foreground bg-background p-0.5 cursor-pointer"
              />
            </TooltipComponent>
          </div>
        </div>
        <div className="relative">
          <div className="relative flex flex-col">
            <div className="overflow-y-auto" style={{ maxHeight: "400px" }}>
              {isEmpty && !isPending ? (
                <div className="inset-0 flex items-center justify-center backdrop-blur-sm min-h-[72px]">
                  <Button
                    className="w-1/2 mx-auto cursor-pointer"
                    onClick={handleStartCoverLetter}
                    disabled={isButtonDisabled}
                  >
                    <Sparkles />
                    Start tweaking my cover letter!
                  </Button>
                </div>
              ) : isEmpty && isPending ? (
                <div className="inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm min-h-[72px]">
                  <TypingIndicator />
                </div>
              ) : (
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
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                    setValue(e.target.value);
                    adjustHeight();
                  }}
                  disabled={disabled}
                />
              )}
            </div>
            <div className="h-14 text-foreground flex items-center">
              <div className="absolute left-3 right-3 bottom-3 flex items-center justify-between w-[calc(100%-20px)]">
                <div className="flex items-center gap-2 border border-background rounded-md p-1 mr-1">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="secondary"
                        className="flex cursor-pointer items-center gap-1 h-8 pl-1 pr-2 text-xs text-foreground hover:bg-accent hover:text-accent-foreground focus-visible:ring-1 focus-visible:ring-offset-0 focus-visible:ring-blue-500"
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
                            className="flex items-center gap-1 px-2"
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
                                  <X className="w-3 text-destructive" />
                                )}
                              </div>
                            </TooltipComponent>
                          </div>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Badge
                    variant={"outline"}
                    className="flex items-center gap-2"
                  >
                    {selectedModel?.isConfigured() ? (
                      <div className="flex items-center gap-1 text-xs text-green-600">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        Configured
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-xs text-destructive">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        Not Configured
                      </div>
                    )}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 mr-auto">
                  <TooltipComponent content="Change Job">
                    <Button
                      onClick={() =>
                        setChangeJobDescription(navigation.LEFT_PANEL.JOB)
                      }
                      size="icon"
                      variant="secondary"
                      className="mr-auto cursor-pointer"
                    >
                      <BriefcaseBusiness />
                    </Button>
                  </TooltipComponent>
                  <HumanizedProButtonCoverLetter />
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
