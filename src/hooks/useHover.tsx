import { useState, useCallback, useRef } from 'react';

/**
 * Return type for the useHover hook.
 */
export type UseHoverReturn<T extends HTMLElement = HTMLElement> = {
  /** Callback ref to attach to the element to track */
  ref: (node: T | null) => void;
  /** Whether the element is currently hovered */
  isHovered: boolean;
};

/**
 * Hook that tracks whether an element is being hovered.
 * Uses mouseenter/mouseleave events for reliable hover detection.
 *
 * @returns Object with a callback ref and isHovered boolean
 *
 * @example
 * ```tsx
 * const { ref, isHovered } = useHover<HTMLDivElement>();
 *
 * return (
 *   <div ref={ref} style={{ background: isHovered ? 'blue' : 'gray' }}>
 *     {isHovered ? 'Hovered!' : 'Hover me'}
 *   </div>
 * );
 * ```
 */
export function useHover<
  T extends HTMLElement = HTMLElement,
>(): UseHoverReturn<T> {
  const [isHovered, setIsHovered] = useState(false);
  const nodeRef = useRef<T | null>(null);
  const handlersRef = useRef<{
    enter: () => void;
    leave: () => void;
  }>({
    enter: () => setIsHovered(true),
    leave: () => setIsHovered(false),
  });

  const ref = useCallback((node: T | null) => {
    if (nodeRef.current) {
      nodeRef.current.removeEventListener(
        'mouseenter',
        handlersRef.current.enter,
      );
      nodeRef.current.removeEventListener(
        'mouseleave',
        handlersRef.current.leave,
      );
    }

    nodeRef.current = node;

    if (node) {
      node.addEventListener('mouseenter', handlersRef.current.enter);
      node.addEventListener('mouseleave', handlersRef.current.leave);
    }
  }, []);

  return { ref, isHovered };
}
