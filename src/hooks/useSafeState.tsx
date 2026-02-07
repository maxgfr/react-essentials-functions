import { useRef, useState, useEffect, useCallback } from 'react';

type SetStateAction<T> = T | ((prevState: T) => T);

export function useSafeState<T = unknown>(
  initialValue: T | (() => T) = null as T,
): [T, (value: SetStateAction<T>) => void] {
  const isMounted = useRef(true);
  const [state, setState] = useState<T>(initialValue);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const setStateSafe = useCallback((value: SetStateAction<T>) => {
    if (isMounted.current) {
      setState(value);
    }
  }, []);
  return [state, setStateSafe];
}
