"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";

interface UseQueryParamOptions {
  defaultValue?: string;
  paramName: string;
}

interface UseQueryParamReturn {
  value: string | null;
  setValue: (value: string) => void;
  removeParam: () => void;
  hasParam: boolean;
  params: URLSearchParams;
}

/**
 * Custom hook for managing query parameters with optimization
 * @param options - Configuration object with paramName and optional defaultValue
 * @returns Object with value, setValue, removeParam, hasParam, and params
 */
export function useQueryParam({
  paramName,
  defaultValue,
}: UseQueryParamOptions): UseQueryParamReturn {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Memoize the URLSearchParams to prevent unnecessary re-renders
  const params = useMemo(
    () => new URLSearchParams(searchParams),
    [searchParams],
  );

  // Get the current value with fallback to defaultValue
  const value = useMemo(() => {
    const paramValue = searchParams.get(paramName);
    return paramValue ?? defaultValue ?? null;
  }, [searchParams, paramName, defaultValue]);

  // Check if the parameter exists
  const hasParam = useMemo(() => {
    return searchParams.has(paramName);
  }, [searchParams, paramName]);

  // Optimized setValue function with useCallback
  const setValue = useCallback(
    (newValue: string) => {
      const newParams = new URLSearchParams(searchParams);
      newParams.set(paramName, newValue);
      router.push(`?${newParams.toString()}`);
    },
    [searchParams, paramName, router],
  );

  // Function to remove the parameter
  const removeParam = useCallback(() => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete(paramName);
    const newSearch = newParams.toString();
    router.push(newSearch ? `?${newSearch}` : window.location.pathname);
  }, [searchParams, paramName, router]);

  return {
    value,
    setValue,
    removeParam,
    hasParam,
    params,
  };
}

/**
 * Hook for managing multiple query parameters at once
 * @param paramNames - Array of parameter names to track
 * @returns Object with values, setValue, and removeParam functions
 */
export function useMultipleQueryParams(paramNames: string[]) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const params = useMemo(
    () => new URLSearchParams(searchParams),
    [searchParams],
  );

  const values = useMemo(() => {
    return paramNames.reduce(
      (acc, paramName) => {
        acc[paramName] = searchParams.get(paramName);
        return acc;
      },
      {} as Record<string, string | null>,
    );
  }, [searchParams, paramNames]);

  const setValue = useCallback(
    (paramName: string, value: string) => {
      const newParams = new URLSearchParams(searchParams);
      newParams.set(paramName, value);
      router.push(`?${newParams.toString()}`);
    },
    [searchParams, router],
  );

  const setMultipleValues = useCallback(
    (updates: Record<string, string>) => {
      const newParams = new URLSearchParams(searchParams);
      Object.entries(updates).forEach(([key, value]) => {
        newParams.set(key, value);
      });
      router.push(`?${newParams.toString()}`);
    },
    [searchParams, router],
  );

  const removeParam = useCallback(
    (paramName: string) => {
      const newParams = new URLSearchParams(searchParams);
      newParams.delete(paramName);
      const newSearch = newParams.toString();
      router.push(newSearch ? `?${newSearch}` : window.location.pathname);
    },
    [searchParams, router],
  );

  const removeMultipleParams = useCallback(
    (paramNamesToRemove: string[]) => {
      const newParams = new URLSearchParams(searchParams);
      paramNamesToRemove.forEach((paramName) => {
        newParams.delete(paramName);
      });
      const newSearch = newParams.toString();
      router.push(newSearch ? `?${newSearch}` : window.location.pathname);
    },
    [searchParams, router],
  );

  return {
    values,
    setValue,
    setMultipleValues,
    removeParam,
    removeMultipleParams,
    params,
  };
}
