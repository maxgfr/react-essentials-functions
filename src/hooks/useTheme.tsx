import { MouseEventHandler, useEffect, useState } from 'react';

export const useTheme = (): [string, MouseEventHandler, boolean] => {
  const [theme, setTheme] = useState('light');
  const [mountedComponent, setMountedComponent] = useState(false);
  const setMode = (mode: 'light' | 'dark') => {
    window.localStorage.setItem('theme', mode);
    setTheme(mode);
  };
  const themeToggler = () => {
    theme === 'light' ? setMode('dark') : setMode('light');
  };
  useEffect(() => {
    const localTheme = window.localStorage.getItem('theme');
    localTheme ? setTheme(localTheme) : setMode('light');
    setMountedComponent(true);
  }, []);
  return [theme, themeToggler, mountedComponent];
};
