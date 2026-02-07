import { renderHook, act } from '@testing-library/react';
import { useTheme } from './useTheme';

describe('useTheme', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should return light theme as default', () => {
    const { result } = renderHook(() => useTheme());

    const [theme] = result.current;
    expect(theme).toBe('light');
  });

  it('should toggle theme', () => {
    const { result } = renderHook(() => useTheme());

    const [theme, toggleTheme] = result.current;
    expect(theme).toBe('light');

    act(() => {
      toggleTheme();
    });

    const [themeAfterToggle] = result.current;
    expect(themeAfterToggle).toBe('dark');

    act(() => {
      toggleTheme();
    });

    const [themeAfterSecondToggle] = result.current;
    expect(themeAfterSecondToggle).toBe('light');
  });

  it('should save theme to localStorage', () => {
    const { result } = renderHook(() => useTheme());

    act(() => {
      result.current[1]();
    });

    expect(localStorage.getItem('theme')).toBe('dark');
  });

  it('should load theme from localStorage', () => {
    localStorage.setItem('theme', 'dark');

    const { result } = renderHook(() => useTheme());

    const [theme] = result.current;
    expect(theme).toBe('dark');
  });

  it('should return mounted state', () => {
    const { result } = renderHook(() => useTheme());

    const [, , mounted] = result.current;
    expect(mounted).toBe(true);
  });

  it('should handle invalid localStorage value', () => {
    localStorage.setItem('theme', 'invalid' as 'light' | 'dark');

    const { result } = renderHook(() => useTheme());

    const [theme] = result.current;
    expect(theme).toBe('light');
  });

  it('should handle localStorage errors gracefully', () => {
    const originalSetItem = localStorage.setItem;
    localStorage.setItem = jest.fn(() => {
      throw new Error('localStorage not available');
    });

    const { result } = renderHook(() => useTheme());

    // Should not throw
    act(() => {
      result.current[1]();
    });

    // Theme should still change in state
    const [theme] = result.current;
    expect(theme).toBe('dark');

    localStorage.setItem = originalSetItem;
  });
});
