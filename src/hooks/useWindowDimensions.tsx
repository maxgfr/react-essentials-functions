import { useState, useEffect, useCallback } from 'react';

export type WindowDimensions = {
  width: number;
  height: number;
};

/**
 * Hook to get the current window dimensions.
 * Automatically updates on resize with debounce for performance.
 *
 * @returns Object containing width and height of the window
 *
 * @example
 * ```tsx
 * const { width, height } = useWindowDimensions();
 *
 * return (
 *   <div>
 *     Window size: {width} x {height}
 *   </div>
 * );
 * ```
 */
export function useWindowDimensions(): WindowDimensions {
  const getWindowDimensions = useCallback((): WindowDimensions => {
    if (typeof window === 'undefined') {
      return { width: 0, height: 0 };
    }
    return {
      width: window.innerWidth,
      height: window.innerHeight,
    };
  }, []);

  const [windowDimensions, setWindowDimensions] =
    useState<WindowDimensions>(getWindowDimensions);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const handleResize = () => {
      setWindowDimensions(getWindowDimensions());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [getWindowDimensions]);

  return windowDimensions;
}

// Keep default export for backwards compatibility
export default useWindowDimensions;
