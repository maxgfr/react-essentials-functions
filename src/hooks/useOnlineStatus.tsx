import { useState, useEffect } from 'react';

/**
 * Hook that tracks whether the browser is online or offline.
 * Updates reactively when connectivity changes.
 *
 * @returns Whether the browser is currently online
 *
 * @example
 * ```tsx
 * const isOnline = useOnlineStatus();
 *
 * return (
 *   <div>
 *     {!isOnline && <banner>You are offline</banner>}
 *   </div>
 * );
 * ```
 */
export function useOnlineStatus(): boolean {
  const [isOnline, setIsOnline] = useState<boolean>(() => {
    if (typeof navigator === 'undefined') {
      return true;
    }
    return navigator.onLine;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
}
