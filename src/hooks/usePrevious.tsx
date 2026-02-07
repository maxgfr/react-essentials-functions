import { useRef, useEffect } from 'react';

/**
 * Hook that returns the previous value of a variable.
 * Useful for comparing current and previous props or state.
 *
 * @param value - The value to track
 * @returns The value from the previous render, or undefined on first render
 *
 * @example
 * ```tsx
 * const [count, setCount] = useState(0);
 * const previousCount = usePrevious(count);
 *
 * return (
 *   <div>
 *     Current: {count}, Previous: {previousCount ?? 'N/A'}
 *   </div>
 * );
 * ```
 */
export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T | undefined>(undefined);

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}
