import { useEffect, useRef } from 'react';

/**
 * Options for the useKeyPress hook.
 */
export type UseKeyPressOptions = {
  /** Which keyboard event to listen to (default: 'keydown') */
  event?: 'keydown' | 'keyup';
  /** The event target to listen on (default: document) */
  target?: EventTarget | null;
};

/**
 * Hook that detects when a specific keyboard key is pressed.
 * Useful for keyboard shortcuts, accessibility, modal escape-to-close, etc.
 *
 * @param targetKey - The KeyboardEvent.key value to match (e.g., 'Escape', 'Enter', 'a')
 * @param handler - Callback fired when the key is pressed
 * @param options - Optional configuration for event type and target
 *
 * @example
 * ```tsx
 * useKeyPress('Escape', () => {
 *   setIsModalOpen(false);
 * });
 *
 * useKeyPress('Enter', (event) => {
 *   event.preventDefault();
 *   handleSubmit();
 * });
 * ```
 */
export function useKeyPress(
  targetKey: string,
  handler: (event: KeyboardEvent) => void,
  options?: UseKeyPressOptions,
): void {
  const handlerRef = useRef(handler);
  handlerRef.current = handler;

  const { event = 'keydown', target } = options ?? {};

  useEffect(() => {
    const eventTarget =
      target ?? (typeof document !== 'undefined' ? document : null);
    if (!eventTarget) return;

    const listener = (e: Event) => {
      const keyboardEvent = e as KeyboardEvent;
      if (keyboardEvent.key === targetKey) {
        handlerRef.current(keyboardEvent);
      }
    };

    eventTarget.addEventListener(event, listener);

    return () => {
      eventTarget.removeEventListener(event, listener);
    };
  }, [targetKey, event, target]);
}
