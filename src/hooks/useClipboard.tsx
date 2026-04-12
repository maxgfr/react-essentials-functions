import { useState, useCallback, useRef, useEffect } from 'react';

/**
 * Return type for the useClipboard hook.
 */
export type UseClipboardReturn = {
  /** Copy the given text to the clipboard */
  copy: (text: string) => Promise<void>;
  /** Whether the last copy was successful (resets after resetDelay) */
  copied: boolean;
  /** Error from the last copy attempt, or null */
  error: Error | null;
};

/**
 * Hook that copies text to the clipboard and tracks the copy status.
 * Provides a temporary "copied" feedback state that resets after a delay.
 *
 * @param options - Optional configuration
 * @param options.resetDelay - Milliseconds before `copied` resets to false (default: 2000)
 * @returns Object with copy function, copied state, and error state
 *
 * @example
 * ```tsx
 * const { copy, copied, error } = useClipboard();
 *
 * return (
 *   <button onClick={() => copy('https://example.com')}>
 *     {copied ? 'Copied!' : 'Copy link'}
 *   </button>
 * );
 * ```
 */
export function useClipboard(options?: {
  resetDelay?: number;
}): UseClipboardReturn {
  const { resetDelay = 2000 } = options ?? {};
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const copy = useCallback(
    async (text: string) => {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
      }

      try {
        if (typeof navigator === 'undefined' || !navigator.clipboard) {
          throw new Error('Clipboard API is not available');
        }
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setError(null);
        timeoutRef.current = setTimeout(() => {
          setCopied(false);
        }, resetDelay);
      } catch (err) {
        setCopied(false);
        setError(
          err instanceof Error ? err : new Error('Failed to copy to clipboard'),
        );
      }
    },
    [resetDelay],
  );

  return { copy, copied, error };
}
