import { useEffect, useRef } from 'react';

/**
 * Hook that sets up a declarative setTimeout.
 * The timeout is automatically cleared on unmount.
 * Pass `null` as delay to cancel/pause the timeout.
 *
 * @param callback - Function to call when the timeout fires
 * @param delay - Timeout delay in milliseconds, or null to cancel
 *
 * @example
 * ```tsx
 * const [visible, setVisible] = useState(true);
 *
 * useTimeout(() => {
 *   setVisible(false);
 * }, 5000);
 *
 * return visible ? <Toast message="Hello!" /> : null;
 * ```
 */
export function useTimeout(callback: () => void, delay: number | null): void {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    if (delay === null) return;

    const id = setTimeout(() => {
      callbackRef.current();
    }, delay);

    return () => clearTimeout(id);
  }, [delay]);
}
