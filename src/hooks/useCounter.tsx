import { useState, useCallback } from 'react';

/**
 * Return type for the useCounter hook.
 */
export type UseCounterReturn = {
  /** Current count value */
  count: number;
  /** Increment by 1 (or by a custom amount) */
  increment: (amount?: number) => void;
  /** Decrement by 1 (or by a custom amount) */
  decrement: (amount?: number) => void;
  /** Reset to the initial value */
  reset: () => void;
  /** Set the count to an arbitrary value */
  set: (value: number | ((prev: number) => number)) => void;
};

/**
 * Hook for managing a numeric counter with increment, decrement, and reset.
 * Optionally clamps values between min and max bounds.
 *
 * @param initialValue - The initial counter value (default: 0)
 * @param options - Optional min/max bounds
 * @returns Object with count, increment, decrement, reset, and set
 *
 * @example
 * ```tsx
 * const { count, increment, decrement, reset } = useCounter(0, { min: 0, max: 10 });
 *
 * return (
 *   <div>
 *     <p>Count: {count}</p>
 *     <button onClick={() => increment()}>+1</button>
 *     <button onClick={() => increment(5)}>+5</button>
 *     <button onClick={() => decrement()}>-1</button>
 *     <button onClick={reset}>Reset</button>
 *   </div>
 * );
 * ```
 */
export function useCounter(
  initialValue: number = 0,
  options?: { min?: number; max?: number },
): UseCounterReturn {
  const { min, max } = options ?? {};
  const [count, setCount] = useState(initialValue);

  const clamp = useCallback(
    (value: number): number => {
      let clamped = value;
      if (min !== undefined && clamped < min) clamped = min;
      if (max !== undefined && clamped > max) clamped = max;
      return clamped;
    },
    [min, max],
  );

  const increment = useCallback(
    (amount: number = 1) => {
      setCount((prev) => clamp(prev + amount));
    },
    [clamp],
  );

  const decrement = useCallback(
    (amount: number = 1) => {
      setCount((prev) => clamp(prev - amount));
    },
    [clamp],
  );

  const reset = useCallback(() => {
    setCount(initialValue);
  }, [initialValue]);

  const set = useCallback(
    (value: number | ((prev: number) => number)) => {
      setCount((prev) => {
        const next = value instanceof Function ? value(prev) : value;
        return clamp(next);
      });
    },
    [clamp],
  );

  return { count, increment, decrement, reset, set };
}
