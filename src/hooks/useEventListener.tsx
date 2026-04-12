import { useEffect, useRef } from 'react';

/**
 * Hook that declaratively adds an event listener to a target.
 * Automatically handles cleanup and uses the latest handler reference.
 *
 * @param eventName - The event name to listen for
 * @param handler - The event handler callback
 * @param target - The event target (default: window)
 * @param options - Optional addEventListener options
 *
 * @example
 * ```tsx
 * // Listen for window scroll
 * useEventListener('scroll', (event) => {
 *   console.log('Scrolled!', window.scrollY);
 * });
 *
 * // Listen on a specific element
 * const buttonRef = useRef<HTMLButtonElement>(null);
 * useEventListener('click', handleClick, buttonRef.current);
 * ```
 */
export function useEventListener<K extends keyof WindowEventMap>(
  eventName: K,
  handler: (event: WindowEventMap[K]) => void,
  target?: EventTarget | null,
  options?: boolean | AddEventListenerOptions,
): void {
  const handlerRef = useRef(handler);
  handlerRef.current = handler;

  useEffect(() => {
    const eventTarget =
      target ?? (typeof window !== 'undefined' ? window : null);
    if (!eventTarget) return;

    const listener = (event: Event) => {
      handlerRef.current(event as WindowEventMap[K]);
    };

    eventTarget.addEventListener(eventName, listener, options);

    return () => {
      eventTarget.removeEventListener(eventName, listener, options);
    };
  }, [eventName, target, options]);
}
