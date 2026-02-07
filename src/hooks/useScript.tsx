import { useEffect, useState, useRef } from 'react';

export type UseScriptStatus = 'idle' | 'loading' | 'ready' | 'error';
export type UseScriptOptions = {
  /**
   * Callback called when script is loaded successfully
   */
  onLoad?: () => void;
  /**
   * Callback called when script fails to load
   */
  onError?: () => void;
  /**
   * Whether to remove the script tag when the component unmounts
   * @default true
   */
  removeOnUnmount?: boolean;
};

/**
 * Hook to dynamically load external scripts.
 * Returns the loading status of the script.
 *
 * @param url - The URL of the script to load
 * @param options - Optional callbacks and configuration
 * @returns The current status of the script: 'idle' | 'loading' | 'ready' | 'error'
 *
 * @example
 * ```tsx
 * const status = useScript('https://example.com/script.js', {
 *   onLoad: () => console.log('Script loaded'),
 *   onError: () => console.error('Script failed to load'),
 * });
 *
 * if (status === 'loading') return <div>Loading...</div>;
 * if (status === 'error') return <div>Error loading script</div>;
 * ```
 */
export const useScript = (
  url: string,
  options: UseScriptOptions = {},
): UseScriptStatus => {
  const { onLoad, onError, removeOnUnmount = true } = options;

  const [status, setStatus] = useState<UseScriptStatus>('idle');
  const callbacksRef = useRef({ onLoad, onError });

  // Keep callbacks ref updated
  useEffect(() => {
    callbacksRef.current = { onLoad, onError };
  }, [onLoad, onError]);

  useEffect(() => {
    // Find existing script safely (avoid CSS selector injection)
    const existingScript = Array.from(document.querySelectorAll('script')).find(
      (s) => s.src === url || s.getAttribute('src') === url,
    );

    if (existingScript) {
      const isLoaded =
        (existingScript as unknown as { readyState?: string }).readyState ===
          'complete' ||
        (existingScript as unknown as { readyState?: string }).readyState ===
          'loaded';
      setStatus(isLoaded ? 'ready' : 'loading');
      return;
    }

    setStatus('loading');

    const script = document.createElement('script');
    script.src = url;
    script.async = true;

    const handleLoad = () => {
      setStatus('ready');
      callbacksRef.current.onLoad?.();
    };

    const handleError = () => {
      setStatus('error');
      callbacksRef.current.onError?.();
    };

    script.addEventListener('load', handleLoad);
    script.addEventListener('error', handleError);

    document.body.appendChild(script);

    return () => {
      script.removeEventListener('load', handleLoad);
      script.removeEventListener('error', handleError);

      if (removeOnUnmount && script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [url, removeOnUnmount]);

  return status;
};
