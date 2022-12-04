import { useCallback, useEffect, useRef } from 'react';

export function useSafeFetch() {
  const abortController = useRef(new AbortController());
  useEffect(() => () => abortController.current.abort(), []);

  return useCallback(
    (url: string, options: Record<any, any>) =>
      fetch(url, { signal: abortController.current.signal, ...options }),
    [],
  );
}
