"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { navigation } from "@/configs/navigation";

export function SetLocalstorageProvider() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Cache the initial localStorage value
  const [modelName] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("modelName") || "";
    }
    return "";
  });

  // Memoize the navigation logic to prevent unnecessary re-runs
  const handleNavigation = useCallback(() => {
    const leftCategory = searchParams.get(navigation.LEFT_PANEL.PARAM);
    const rightCategory = searchParams.get(navigation.RIGHT_PANEL.PARAM);
    const format = searchParams.get(navigation.FORMAT.PARAM);
    const model = searchParams.get(navigation.MODEL.PARAM);

    // Check if any params are missing
    const needsUpdate = !leftCategory || !rightCategory || !format || !model;

    if (!needsUpdate) return;

    // Build all missing params in one go
    const params = new URLSearchParams(searchParams);
    let hasChanges = false;

    if (!leftCategory) {
      params.set(navigation.LEFT_PANEL.PARAM, navigation.LEFT_PANEL.JOB);
      hasChanges = true;
    }
    if (!rightCategory) {
      params.set(navigation.RIGHT_PANEL.PARAM, navigation.RIGHT_PANEL.RESUME);
      hasChanges = true;
    }
    if (!format) {
      params.set(navigation.FORMAT.PARAM, navigation.FORMAT.PDF);
      hasChanges = true;
    }
    if (!model) {
      const modelToUse = modelName || navigation.MODEL.OPENAI;
      params.set(navigation.MODEL.PARAM, modelToUse);
      hasChanges = true;
    }

    // Single navigation call with all updates
    if (hasChanges) {
      router.push(`?${params.toString()}`);
    }
  }, [searchParams, router, modelName]);

  // Single effect that runs the navigation logic
  useEffect(() => {
    handleNavigation();
  }, [handleNavigation]);

  return null;
}
