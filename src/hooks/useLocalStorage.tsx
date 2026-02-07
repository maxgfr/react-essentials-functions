import { useState, useCallback } from 'react';

/**
 * Hook that syncs state with localStorage.
 * Handles serialization/deserialization automatically with JSON.
 * Falls back gracefully when localStorage is unavailable.
 *
 * @param key - The localStorage key
 * @param initialValue - The initial value if nothing is stored
 * @returns A tuple of [storedValue, setValue, removeValue]
 *
 * @example
 * ```tsx
 * const [name, setName, removeName] = useLocalStorage('user-name', '');
 *
 * return (
 *   <input
 *     value={name}
 *     onChange={(e) => setName(e.target.value)}
 *   />
 * );
 * ```
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T,
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item !== null ? (JSON.parse(item) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      setStoredValue((prev) => {
        const valueToStore = value instanceof Function ? value(prev) : value;
        try {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        } catch {
          // localStorage may not be available
        }
        return valueToStore;
      });
    },
    [key],
  );

  const removeValue = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
    } catch {
      // localStorage may not be available
    }
    setStoredValue(initialValue);
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
}
