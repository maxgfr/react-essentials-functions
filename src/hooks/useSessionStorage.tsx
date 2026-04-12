import { useState, useCallback } from 'react';

/**
 * Hook that syncs state with sessionStorage.
 * Handles serialization/deserialization automatically with JSON.
 * Falls back gracefully when sessionStorage is unavailable.
 *
 * @param key - The sessionStorage key
 * @param initialValue - The initial value if nothing is stored
 * @returns A tuple of [storedValue, setValue, removeValue]
 *
 * @example
 * ```tsx
 * const [step, setStep, resetStep] = useSessionStorage('wizard-step', 0);
 *
 * return (
 *   <div>
 *     <p>Current step: {step}</p>
 *     <button onClick={() => setStep(prev => prev + 1)}>Next</button>
 *     <button onClick={resetStep}>Reset</button>
 *   </div>
 * );
 * ```
 */
export function useSessionStorage<T>(
  key: string,
  initialValue: T,
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    try {
      const item = window.sessionStorage.getItem(key);
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
          window.sessionStorage.setItem(key, JSON.stringify(valueToStore));
        } catch {
          // sessionStorage may not be available
        }
        return valueToStore;
      });
    },
    [key],
  );

  const removeValue = useCallback(() => {
    try {
      window.sessionStorage.removeItem(key);
    } catch {
      // sessionStorage may not be available
    }
    setStoredValue(initialValue);
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
}
