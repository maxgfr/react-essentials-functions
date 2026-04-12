import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Return type for the useIdle hook.
 */
export type UseIdleReturn = {
  /** Whether the user is currently idle */
  isIdle: boolean;
  /** Timestamp (Date.now()) of the last detected activity */
  lastActive: number;
};

/**
 * Hook that detects whether the user is idle (no mouse, keyboard, or touch
 * activity for a given duration). Useful for auto-logout, pausing expensive
 * operations, or showing "Are you still there?" prompts.
 *
 * @param timeout - Idle threshold in milliseconds (default: 60000 = 1 minute)
 * @returns Object with isIdle boolean and lastActive timestamp
 *
 * @example
 * ```tsx
 * const { isIdle, lastActive } = useIdle(30000);
 *
 * return (
 *   <div>
 *     {isIdle && <Modal>Are you still there?</Modal>}
 *     <p>Last active: {new Date(lastActive).toLocaleTimeString()}</p>
 *   </div>
 * );
 * ```
 */
export function useIdle(timeout: number = 60000): UseIdleReturn {
  const [isIdle, setIsIdle] = useState(false);
  const [lastActive, setLastActive] = useState(() => Date.now());
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastUpdateRef = useRef(Date.now());

  const resetTimer = useCallback(() => {
    const now = Date.now();

    // Throttle state updates to avoid excessive re-renders
    if (now - lastUpdateRef.current > 200) {
      lastUpdateRef.current = now;
      setLastActive(now);
    }

    setIsIdle(false);

    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setIsIdle(true);
    }, timeout);
  }, [timeout]);

  useEffect(() => {
    if (typeof document === 'undefined') return;

    const events: Array<keyof DocumentEventMap> = [
      'mousemove',
      'mousedown',
      'keydown',
      'touchstart',
      'scroll',
    ];

    // Start the initial timer
    resetTimer();

    events.forEach((event) => {
      document.addEventListener(event, resetTimer, { passive: true });
    });

    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, resetTimer);
      });
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [resetTimer]);

  return { isIdle, lastActive };
}
