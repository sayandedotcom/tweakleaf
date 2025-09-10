"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { navigation } from "@/configs/navigation";

export function SetLocalstorageProvider() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const leftCategory = searchParams.get(navigation.LEFT_PANEL.PARAM);
  const rightCategory = searchParams.get(navigation.RIGHT_PANEL.PARAM);
  const format = searchParams.get(navigation.FORMAT.PARAM);
  const model = searchParams.get(navigation.MODEL.PARAM);

  // Use state to track localStorage changes
  const [modelName, setModelName] = useState<string>("");

  const params = useMemo(
    () => new URLSearchParams(searchParams),
    [searchParams],
  );

  // Listen for localStorage changes
  useEffect(() => {
    const getStoredModelName = () => {
      if (typeof window !== "undefined") {
        return localStorage.getItem("modelName") || "";
      }
      return "";
    };

    // Set initial value
    setModelName(getStoredModelName());

    // Listen for storage events (when localStorage changes in other tabs/windows)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "modelName") {
        setModelName(e.newValue || "");
      }
    };

    // Listen for custom events (when localStorage changes in same tab)
    const handleCustomStorageChange = (e: CustomEvent) => {
      if (e.detail?.key === "modelName") {
        setModelName(e.detail.value || "");
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

  useEffect(() => {
    if (!leftCategory) {
      params.set(navigation.LEFT_PANEL.PARAM, navigation.LEFT_PANEL.JOB);
      router.push(`?${params.toString()}`);
    }
    if (!rightCategory) {
      params.set(
        navigation.RIGHT_PANEL.PARAM,
        navigation.RIGHT_PANEL.COVER_LETTER,
      );
      router.push(`?${params.toString()}`);
    }
    if (!format) {
      params.set(navigation.FORMAT.PARAM, navigation.FORMAT.PDF);
      router.push(`?${params.toString()}`);
    }
    if (!model) {
      // Use the modelName from localStorage if available, otherwise default to OpenAI
      const modelToUse = modelName || navigation.MODEL.OPENAI;
      params.set(navigation.MODEL.PARAM, modelToUse);
      router.push(`?${params.toString()}`);
    }
  }, [leftCategory, rightCategory, format, model, modelName, params, router]);
  return null;
}
