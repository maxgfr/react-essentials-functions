import { useEffect, useRef } from 'react';

/**
 * Hook that sets the document title and optionally restores it on unmount.
 *
 * @param title - The document title to set
 * @param options - Optional configuration
 * @param options.restoreOnUnmount - Whether to restore the previous title on unmount (default: true)
 *
 * @example
 * ```tsx
 * function ProfilePage({ user }) {
 *   useDocumentTitle(`${user.name} - Profile`);
 *
 *   return <div>{user.name}</div>;
 * }
 * ```
 */
export function useDocumentTitle(
  title: string,
  options?: { restoreOnUnmount?: boolean },
): void {
  const { restoreOnUnmount = true } = options ?? {};
  const previousTitleRef = useRef<string | null>(null);

  useEffect(() => {
    if (typeof document === 'undefined') return;

    if (previousTitleRef.current === null) {
      previousTitleRef.current = document.title;
    }

    document.title = title;
  }, [title]);

  useEffect(() => {
    if (!restoreOnUnmount) return;

    return () => {
      if (
        typeof document !== 'undefined' &&
        previousTitleRef.current !== null
      ) {
        document.title = previousTitleRef.current;
      }
    };
  }, [restoreOnUnmount]);
}
