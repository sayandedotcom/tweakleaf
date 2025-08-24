"use client";

import { ArrowRight, Bot, Check, ChevronDown, UserRound } from "lucide-react";
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
  const [internalValue, setInternalValue] = useState("");
  const { textareaRef, adjustHeight } = useAutoResizeTextarea({
    minHeight: 72,
    maxHeight: 300,
  });
  const [selectedModel, setSelectedModel] = useState("OpenAI");

  // Use controlled value if provided, otherwise use internal state
  const value = controlledValue !== undefined ? controlledValue : internalValue;
  const setValue = onChange || setInternalValue;

  const models = [
    {
      name: "OpenAI",
      logo: llmModelsSvg.openai,
      url: navigation.MODEL.OPENAI,
      model: "gpt-4o",
      configured: true,
    },
    {
      name: "Anthropic",
      logo: llmModelsSvg.anthropic,
      url: navigation.MODEL.ANTHROPIC,
      model: "claude-3-5-sonnet-20240620",
      configured: false,
    },
    {
      name: "Gemini",
      logo: llmModelsSvg.gemini,
      url: navigation.MODEL.GEMINI,
      model: "gemini-2.0-flash-exp",
      configured: false,
    },
    {
      name: "Grok",
      logo: llmModelsSvg.grok,
      url: navigation.MODEL.GROK,
      model: "llama-3.1-8b-instant",
      configured: false,
    },
    {
      name: "DeepSeek",
      logo: llmModelsSvg.deepseek,
      url: navigation.MODEL.DEEPSEEK,
      model: "deepseek-r1-distill-qwen-32b",
      configured: false,
    },
  ];

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
                            key={selectedModel}
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
                              .find((m) => m.name === selectedModel)
                              ?.logo({ className: "w-4 h-4 bg-text" }) || (
                              <Bot className="w-4 h-4" />
                            )}
                            {selectedModel}
                            <ChevronDown className="w-3 h-3 opacity-50" />
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
                          onSelect={() => setSelectedModel(model.name)}
                          className="flex items-center justify-between gap-2"
                        >
                          <div className="flex items-center gap-2">
                            {model.logo({ className: "w-4 h-4 bg-text" }) || (
                              <Bot className="w-4 h-4 opacity-50" />
                            )}
                            <span>{model.name}</span>
                          </div>
                          {selectedModel === model.name && (
                            <Check className="w-4 h-4 text-blue-500" />
                          )}
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
