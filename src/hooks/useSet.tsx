import { useState, useCallback } from 'react';

/**
 * Return type for the useSet hook.
 */
export type UseSetReturn<T> = {
  /** The current Set */
  set: Set<T>;
  /** Add a value */
  add: (value: T) => void;
  /** Remove a value */
  remove: (value: T) => void;
  /** Toggle a value (add if absent, remove if present) */
  toggle: (value: T) => void;
  /** Check if a value exists */
  has: (value: T) => boolean;
  /** Clear all values */
  clear: () => void;
  /** Reset to initial values */
  reset: () => void;
  /** Number of values */
  size: number;
};

/**
 * Hook for managing a Set as React state.
 * Provides convenient methods to add, remove, and toggle values.
 *
 * @param initialValues - Optional initial values for the Set
 * @returns Object with the set and manipulation methods
 *
 * @example
 * ```tsx
 * const { set, add, remove, toggle, has } = useSet<string>(['react', 'typescript']);
 *
 * return (
 *   <div>
 *     <p>Has React: {has('react') ? 'Yes' : 'No'}</p>
 *     <button onClick={() => toggle('vue')}>Toggle Vue</button>
 *     <button onClick={() => add('node')}>Add Node</button>
 *     <button onClick={() => remove('react')}>Remove React</button>
 *   </div>
 * );
 * ```
 */
export function useSet<T>(initialValues?: Iterable<T>): UseSetReturn<T> {
  const [set, setSet] = useState(() => new Set<T>(initialValues));

  const add = useCallback((value: T) => {
    setSet((prev) => {
      const next = new Set(prev);
      next.add(value);
      return next;
    });
  }, []);

  const remove = useCallback((value: T) => {
    setSet((prev) => {
      const next = new Set(prev);
      next.delete(value);
      return next;
    });
  }, []);

  const toggle = useCallback((value: T) => {
    setSet((prev) => {
      const next = new Set(prev);
      if (next.has(value)) {
        next.delete(value);
      } else {
        next.add(value);
      }
      return next;
    });
  }, []);

  const has = useCallback((value: T) => set.has(value), [set]);

  const clear = useCallback(() => {
    setSet(new Set<T>());
  }, []);

  const reset = useCallback(() => {
    setSet(new Set<T>(initialValues));
  }, [initialValues]);

  return { set, add, remove, toggle, has, clear, reset, size: set.size };
}
