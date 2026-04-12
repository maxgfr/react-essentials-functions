import { useRef } from 'react';

/**
 * Hook that returns true only on the first render.
 * Useful for skipping effects on mount or distinguishing initial vs subsequent renders.
 *
 * @returns Whether this is the first render
 *
 * @example
 * ```tsx
 * const isFirstRender = useIsFirstRender();
 *
 * useEffect(() => {
 *   if (!isFirstRender) {
 *     // Skip on first render, only run on updates
 *     saveToServer(data);
 *   }
 * }, [data]);
 * ```
 */
export function useIsFirstRender(): boolean {
  const isFirst = useRef(true);

  if (isFirst.current) {
    isFirst.current = false;
    return true;
  }

  return false;
}
