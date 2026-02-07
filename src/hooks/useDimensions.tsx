import {
  useEffect,
  useLayoutEffect,
  useState,
  useCallback,
  RefObject,
} from 'react';

export type Dimensions = {
  width: number;
  height: number;
};

/**
 * Hook to get the dimensions of a DOM element.
 * Uses ResizeObserver for optimal performance.
 *
 * @param targetRef - React ref to the element to measure
 * @returns Object containing width and height of the element
 *
 * @example
 * ```tsx
 * const targetRef = useRef<HTMLDivElement>(null);
 * const { width, height } = useDimensions(targetRef);
 *
 * return (
 *   <div ref={targetRef}>
 *     Size: {width} x {height}
 *   </div>
 * );
 * ```
 */
export function useDimensions(targetRef: RefObject<HTMLElement>): Dimensions {
  const getDimensions = useCallback((): Dimensions => {
    return {
      width: targetRef.current ? targetRef.current.offsetWidth : 0,
      height: targetRef.current ? targetRef.current.offsetHeight : 0,
    };
    // targetRef is a ref object - stable across renders, no need in deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [dimensions, setDimensions] = useState<Dimensions>({
    width: 0,
    height: 0,
  });

  useLayoutEffect(() => {
    if (targetRef.current) {
      setDimensions(getDimensions());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const element = targetRef.current;

    if (!element) {
      return;
    }

    // Use ResizeObserver for better performance than window resize events
    if (typeof ResizeObserver !== 'undefined') {
      const resizeObserver = new ResizeObserver(() => {
        setDimensions(getDimensions());
      });

      resizeObserver.observe(element);

      return () => {
        resizeObserver.disconnect();
      };
    }

    // Fallback for browsers that don't support ResizeObserver
    const handleResize = () => {
      setDimensions(getDimensions());
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return dimensions;
}
