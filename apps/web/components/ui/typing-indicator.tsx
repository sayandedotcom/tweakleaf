"use client";

import { useState, useEffect } from "react";

const typingTexts = [
  "Gathering information.....",
  "Analyzing data.....",
  "Generating content.....",
  "Humanizing content.....",
];

export function TypingIndicator() {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);

  useEffect(() => {
    // Don't cycle if we're at the last text
    if (currentTextIndex >= typingTexts.length - 1) {
      return;
    }

    const interval = setInterval(() => {
      setCurrentTextIndex((prevIndex) => {
        // Stop at the last text
        if (prevIndex >= typingTexts.length - 1) {
          return prevIndex;
        }
        return prevIndex + 1;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [currentTextIndex]);

  return (
    <div className="justify-left flex space-x-1">
      <div className="rounded-lg bg-muted p-3">
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
          </div>
          <span className="text-sm text-muted-foreground">
            {typingTexts[currentTextIndex]}
          </span>
        </div>
      </div>
    </div>
  );
}
