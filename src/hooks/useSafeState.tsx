import { useRef, useState, useEffect, useCallback } from 'react';

export function useSafeState(initialValue = null) {
  const isMounted = useRef(true);
  const [state, setState] = useState(initialValue);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const setStateSafe = useCallback((value: any) => {
    if (isMounted.current) {
      setState(value);
    }
  }, []);
  return [state, setStateSafe];
}
