import { useState, useEffect } from "react";

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

export default function useLocalStorage(key, initialValue, options = {}) {
  const { mergeWithDefaults = false, onError } = options;

  const [value, setValue] = useState(() => {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw == null) return initialValue;

      const parsed = JSON.parse(raw);
      if (mergeWithDefaults && isPlainObject(parsed) && isPlainObject(initialValue)) {
        return { ...initialValue, ...parsed };
      }
      return parsed;
    } catch (error) {
      console.warn(`useLocalStorage: could not read "${key}"`, error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.warn(`useLocalStorage: could not write "${key}"`, error);
      onError?.(error);
    }
  }, [key, value, onError]);

  return [value, setValue];
}
