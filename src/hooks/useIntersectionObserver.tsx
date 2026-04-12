import { useState, useRef, useCallback, useEffect } from 'react';

/**
 * Options for the useIntersectionObserver hook.
 */
export type UseIntersectionObserverOptions = {
  /** Threshold(s) at which the callback is invoked (0 to 1) */
  threshold?: number | number[];
  /** Element used as the viewport for checking visibility */
  root?: Element | null;
  /** Margin around the root element */
  rootMargin?: string;
  /** If true, stops observing once the element becomes visible */
  freezeOnceVisible?: boolean;
};

/**
 * Return type for the useIntersectionObserver hook.
 */
export type UseIntersectionObserverReturn = {
  /** Callback ref to attach to the element to observe */
  ref: (node: Element | null) => void;
  /** The latest IntersectionObserverEntry, or null */
  entry: IntersectionObserverEntry | null;
  /** Whether the element is currently intersecting */
  isIntersecting: boolean;
};

/**
 * Hook that observes whether a DOM element is visible in the viewport
 * using the IntersectionObserver API.
 * Useful for lazy loading, infinite scroll, and scroll-triggered animations.
 *
 * @param options - Optional IntersectionObserver configuration
 * @returns Object with a callback ref, the observer entry, and isIntersecting boolean
 *
 * @example
 * ```tsx
 * const { ref, isIntersecting } = useIntersectionObserver({
 *   threshold: 0.5,
 *   freezeOnceVisible: true,
 * });
 *
 * return (
 *   <div ref={ref}>
 *     {isIntersecting ? <img src="photo.jpg" /> : <Placeholder />}
 *   </div>
 * );
 * ```
 */
export function useIntersectionObserver(
  options?: UseIntersectionObserverOptions,
): UseIntersectionObserverReturn {
  const {
    threshold = 0,
    root = null,
    rootMargin = '0px',
    freezeOnceVisible = false,
  } = options ?? {};

  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const nodeRef = useRef<Element | null>(null);
  const frozenRef = useRef(false);

  const cleanup = useCallback(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }
  }, []);

  const observe = useCallback(() => {
    cleanup();

    if (
      typeof IntersectionObserver === 'undefined' ||
      !nodeRef.current ||
      frozenRef.current
    ) {
      return;
    }

    const observer = new IntersectionObserver(
      ([observerEntry]) => {
        setEntry(observerEntry);
        if (freezeOnceVisible && observerEntry.isIntersecting) {
          frozenRef.current = true;
          observer.disconnect();
        }
      },
      { threshold, root, rootMargin },
    );

    observer.observe(nodeRef.current);
    observerRef.current = observer;
  }, [threshold, root, rootMargin, freezeOnceVisible, cleanup]);

  const ref = useCallback(
    (node: Element | null) => {
      nodeRef.current = node;
      observe();
    },
    [observe],
  );

  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  const isIntersecting = entry?.isIntersecting ?? false;

  return { ref, entry, isIntersecting };
}
