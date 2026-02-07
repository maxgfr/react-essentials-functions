import { useState, useCallback } from 'react';

/**
 * Hook for managing a boolean toggle state.
 * Provides a simple API for toggling, setting true, or setting false.
 *
 * @param initialValue - The initial boolean value (default: false)
 * @returns A tuple of [value, toggle, setTrue, setFalse]
 *
 * @example
 * ```tsx
 * const [isOpen, toggleOpen, open, close] = useToggle(false);
 *
 * return (
 *   <div>
 *     <button onClick={toggleOpen}>Toggle</button>
 *     <button onClick={open}>Open</button>
 *     <button onClick={close}>Close</button>
 *     {isOpen && <Modal />}
 *   </div>
 * );
 * ```
 */
export function useToggle(
  initialValue = false,
): [boolean, () => void, () => void, () => void] {
  const [value, setValue] = useState(initialValue);

  const toggle = useCallback(() => {
    setValue((prev) => !prev);
  }, []);

  const setTrue = useCallback(() => {
    setValue(true);
  }, []);

  const setFalse = useCallback(() => {
    setValue(false);
  }, []);

  return [value, toggle, setTrue, setFalse];
}
