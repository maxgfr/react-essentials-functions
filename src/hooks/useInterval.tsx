import { useEffect, useRef } from 'react';

/**
 * Hook that sets up a declarative setInterval.
 * The interval is automatically cleared on unmount.
 * Pass `null` as delay to pause the interval.
 *
 * @param callback - Function to call on each interval tick
 * @param delay - Interval delay in milliseconds, or null to pause
 *
 * @example
 * ```tsx
 * const [count, setCount] = useState(0);
 * const [isRunning, setIsRunning] = useState(true);
 *
 * useInterval(() => {
 *   setCount(prev => prev + 1);
 * }, isRunning ? 1000 : null);
 *
 * return <p>Count: {count}</p>;
 * ```
 */
export function useInterval(callback: () => void, delay: number | null): void {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    if (delay === null) return;

    const id = setInterval(() => {
      callbackRef.current();
    }, delay);

    return () => clearInterval(id);
  }, [delay]);
}
