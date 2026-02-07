import { useCallback, useEffect, useState } from 'react';

export type ThemeMode = 'light' | 'dark';

const STORAGE_KEY = 'theme';

function getSystemTheme(): ThemeMode {
  if (typeof window === 'undefined') {
    return 'light';
  }
  try {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  } catch {
    return 'light';
  }
}

function getStoredTheme(): ThemeMode | null {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === 'light' || stored === 'dark') {
      return stored;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Hook to manage theme (light/dark) with localStorage persistence.
 * Automatically detects system color scheme preference.
 *
 * @returns A tuple containing:
 * - current theme mode ('light' | 'dark')
 * - function to toggle between themes
 * - boolean indicating if the component is mounted (useful for SSR)
 *
 * @example
 * ```tsx
 * const [theme, toggleTheme, mounted] = useTheme();
 *
 * if (!mounted) return null; // Avoid hydration mismatch
 *
 * return (
 *   <button onClick={toggleTheme}>
 *     Switch to {theme === 'light' ? 'dark' : 'light'} mode
 *   </button>
 * );
 * ```
 */
export const useTheme = (): [ThemeMode, () => void, boolean] => {
  const [theme, setTheme] = useState<ThemeMode>('light');
  const [mountedComponent, setMountedComponent] = useState(false);

  const themeToggler = useCallback(() => {
    setTheme((prevTheme) => {
      const newTheme = prevTheme === 'light' ? 'dark' : 'light';
      try {
        window.localStorage.setItem(STORAGE_KEY, newTheme);
      } catch {
        // localStorage may not be available
      }
      return newTheme;
    });
  }, []);

  useEffect(() => {
    setMountedComponent(true);

    const stored = getStoredTheme();
    const initial = stored ?? getSystemTheme();
    setTheme(initial);

    if (!stored) {
      try {
        window.localStorage.setItem(STORAGE_KEY, initial);
      } catch {
        // localStorage may not be available
      }
    }
  }, []);

  return [theme, themeToggler, mountedComponent];
};
