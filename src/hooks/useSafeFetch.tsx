import { useCallback, useEffect, useRef } from 'react';

/**
 * Hook that provides a fetch function which automatically aborts previous
 * requests and cleans up on unmount using AbortController.
 *
 * @returns A fetch function with automatic abort handling
 *
 * @example
 * ```tsx
 * const safeFetch = useSafeFetch();
 *
 * useEffect(() => {
 *   const fetchData = async () => {
 *     try {
 *       const response = await safeFetch('https://api.example.com/data');
 *       const data = await response.json();
 *     } catch (error) {
 *       if (error.name !== 'AbortError') {
 *         console.error('Fetch error:', error);
 *       }
 *     }
 *   };
 *   fetchData();
 * }, [safeFetch]);
 * ```
 */
export function useSafeFetch() {
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  return useCallback((url: string, options: RequestInit = {}) => {
    abortControllerRef.current?.abort();
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { signal, ...restOptions } = options;

    return fetch(url, {
      ...restOptions,
      signal: abortController.signal,
    });
  }, []);
}
