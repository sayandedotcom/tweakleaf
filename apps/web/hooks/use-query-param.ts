import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

// Type definitions for better type safety
type ParamValue = string | number | boolean | object | null | undefined;
type Serializer<T> = (value: T) => string;
type Deserializer<T> = (value: string) => T;

interface UseParamStateOptions<T> {
  /** Custom serializer for the parameter value */
  serializer?: Serializer<T>;
  /** Custom deserializer for the parameter value */
  deserializer?: Deserializer<T>;
  /** Whether to debounce URL updates (useful for frequent changes) */
  debounceMs?: number;
  /** Whether to replace the current history entry instead of pushing a new one */
  replace?: boolean;
  /** Whether to sync with localStorage as a fallback */
  syncWithLocalStorage?: boolean;
  /** localStorage key for fallback (defaults to param key) */
  localStorageKey?: string;
}

interface UseParamStateReturn<T> {
  /** Current parameter value */
  value: T;
  /** Function to update the parameter value */
  setValue: (newValue: T | ((prev: T) => T)) => void;
  /** Function to reset parameter to default value */
  reset: () => void;
  /** Whether the parameter exists in the URL */
  hasValue: boolean;
  /** Function to remove the parameter from URL */
  remove: () => void;
}

// Default serializers/deserializers
const defaultSerializer = <T>(value: T): string => {
  if (value === null || value === undefined) return "";
  if (typeof value === "string") return value;
  return JSON.stringify(value);
};

const defaultDeserializer = <T>(value: string, defaultValue: T): T => {
  if (!value) return defaultValue;
  try {
    return JSON.parse(value) as T;
  } catch {
    return value as T;
  }
};

// Debounce utility
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Optimized hook for managing URL search parameters with state synchronization
 *
 * @param key - The URL parameter key
 * @param defaultValue - Default value when parameter is not present
 * @param options - Configuration options
 * @returns Object with value, setValue, reset, hasValue, and remove functions
 *
 * @example
 * // Basic usage
 * const [value, setValue] = useParamState('tab', 'home');
 *
 * // With options
 * const { value, setValue, reset, hasValue } = useParamState('settings', {}, {
 *   debounceMs: 300,
 *   replace: true,
 *   syncWithLocalStorage: true
 * });
 *
 * // Batch updates
 * const { setValue } = useParamState('filters', {});
 * setValue(prev => ({ ...prev, category: 'tech' }));
 */
function useParamState<T extends ParamValue>(
  key: string,
  defaultValue: T,
  options: UseParamStateOptions<T> = {},
): UseParamStateReturn<T> {
  const {
    serializer = defaultSerializer,
    deserializer = defaultDeserializer,
    debounceMs = 0,
    replace = false,
    syncWithLocalStorage = false,
    localStorageKey = key,
  } = options;

  const router = useRouter();
  const searchParams = useSearchParams();

  // Get initial value from URL or localStorage
  const getInitialValue = useCallback((): T => {
    const paramValue = searchParams.get(key);

    if (paramValue !== null) {
      return deserializer(paramValue, defaultValue);
    }

    // Fallback to localStorage if enabled
    if (syncWithLocalStorage && typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(localStorageKey);
        if (stored !== null) {
          return deserializer(stored, defaultValue);
        }
      } catch (error) {
        console.warn(
          `Failed to read from localStorage for key "${localStorageKey}":`,
          error,
        );
      }
    }

    return defaultValue;
  }, [
    key,
    defaultValue,
    deserializer,
    syncWithLocalStorage,
    localStorageKey,
    searchParams,
  ]);

  const [state, setState] = useState<T>(getInitialValue);

  // Update state when URL changes
  useEffect(() => {
    const newValue = getInitialValue();
    setState(newValue);
  }, [getInitialValue]);

  // Debounced value for URL updates
  const debouncedState = useDebounce(state, debounceMs);

  // Update URL when debounced state changes
  useEffect(() => {
    if (debouncedState === defaultValue) {
      // Remove parameter if it's the default value
      const newParams = new URLSearchParams(searchParams);
      if (newParams.has(key)) {
        newParams.delete(key);
        const newUrl = newParams.toString()
          ? `${window.location.pathname}?${newParams.toString()}`
          : window.location.pathname;

        if (replace) {
          router.replace(newUrl);
        } else {
          router.push(newUrl);
        }
      }
    } else {
      // Update parameter with new value
      const serializedValue = serializer(debouncedState);
      const newParams = new URLSearchParams(searchParams);
      newParams.set(key, serializedValue);

      const newUrl = `${window.location.pathname}?${newParams.toString()}`;

      if (replace) {
        router.replace(newUrl);
      } else {
        router.push(newUrl);
      }
    }
  }, [
    debouncedState,
    key,
    defaultValue,
    serializer,
    searchParams,
    router,
    replace,
  ]);

  // Sync with localStorage if enabled
  useEffect(() => {
    if (syncWithLocalStorage && typeof window !== "undefined") {
      try {
        const serializedValue = serializer(state);
        localStorage.setItem(localStorageKey, serializedValue);
      } catch (error) {
        console.warn(
          `Failed to write to localStorage for key "${localStorageKey}":`,
          error,
        );
      }
    }
  }, [state, syncWithLocalStorage, localStorageKey, serializer]);

  const setValue = useCallback((newValue: T | ((prev: T) => T)) => {
    setState((prev) => {
      const updatedValue =
        typeof newValue === "function"
          ? (newValue as (prev: T) => T)(prev)
          : newValue;
      return updatedValue;
    });
  }, []);

  const reset = useCallback(() => {
    setState(defaultValue);
  }, [defaultValue]);

  const remove = useCallback(() => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete(key);
    const newUrl = newParams.toString()
      ? `${window.location.pathname}?${newParams.toString()}`
      : window.location.pathname;

    if (replace) {
      router.replace(newUrl);
    } else {
      router.push(newUrl);
    }
  }, [key, searchParams, router, replace]);

  const hasValue = useMemo(() => {
    return searchParams.has(key);
  }, [searchParams, key]);

  return {
    value: state,
    setValue,
    reset,
    hasValue,
    remove,
  };
}

// Convenience hooks for common use cases
export function useStringParam(
  key: string,
  defaultValue: string = "",
  options?: Omit<UseParamStateOptions<string>, "serializer" | "deserializer">,
) {
  return useParamState(key, defaultValue, {
    ...options,
    serializer: (value) => value,
    deserializer: (value) => value,
  });
}

export function useNumberParam(
  key: string,
  defaultValue: number = 0,
  options?: Omit<UseParamStateOptions<number>, "serializer" | "deserializer">,
) {
  return useParamState(key, defaultValue, {
    ...options,
    serializer: (value) => value.toString(),
    deserializer: (value) => {
      const parsed = parseFloat(value);
      return isNaN(parsed) ? defaultValue : parsed;
    },
  });
}

export function useBooleanParam(
  key: string,
  defaultValue: boolean = false,
  options?: Omit<UseParamStateOptions<boolean>, "serializer" | "deserializer">,
) {
  return useParamState(key, defaultValue, {
    ...options,
    serializer: (value) => value.toString(),
    deserializer: (value) => value === "true",
  });
}

export function useObjectParam<T extends Record<string, unknown>>(
  key: string,
  defaultValue: T,
  options?: Omit<UseParamStateOptions<T>, "serializer" | "deserializer">,
) {
  return useParamState(key, defaultValue, {
    ...options,
    serializer: (value) => JSON.stringify(value),
    deserializer: (value) => {
      try {
        return JSON.parse(value);
      } catch {
        return defaultValue;
      }
    },
  });
}

export default useParamState;
