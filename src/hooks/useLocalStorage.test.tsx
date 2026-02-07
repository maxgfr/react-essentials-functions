import { renderHook, act } from '@testing-library/react';
import { useLocalStorage } from './useLocalStorage';

describe('useLocalStorage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should return the initial value when nothing is stored', () => {
    const { result } = renderHook(() => useLocalStorage('key', 'default'));
    expect(result.current[0]).toBe('default');
  });

  it('should return stored value from localStorage', () => {
    localStorage.setItem('key', JSON.stringify('stored'));
    const { result } = renderHook(() => useLocalStorage('key', 'default'));
    expect(result.current[0]).toBe('stored');
  });

  it('should update value and persist to localStorage', () => {
    const { result } = renderHook(() => useLocalStorage('key', 'initial'));

    act(() => {
      result.current[1]('updated');
    });

    expect(result.current[0]).toBe('updated');
    expect(JSON.parse(localStorage.getItem('key')!)).toBe('updated');
  });

  it('should accept a function updater', () => {
    const { result } = renderHook(() => useLocalStorage('count', 0));

    act(() => {
      result.current[1]((prev) => prev + 1);
    });

    expect(result.current[0]).toBe(1);
    expect(JSON.parse(localStorage.getItem('count')!)).toBe(1);
  });

  it('should remove value from localStorage', () => {
    localStorage.setItem('key', JSON.stringify('value'));
    const { result } = renderHook(() => useLocalStorage('key', 'default'));

    expect(result.current[0]).toBe('value');

    act(() => {
      result.current[2]();
    });

    expect(result.current[0]).toBe('default');
    expect(localStorage.getItem('key')).toBeNull();
  });

  it('should work with objects', () => {
    const initial = { name: 'test', age: 25 };
    const { result } = renderHook(() => useLocalStorage('user', initial));

    expect(result.current[0]).toEqual(initial);

    const updated = { name: 'updated', age: 30 };
    act(() => {
      result.current[1](updated);
    });

    expect(result.current[0]).toEqual(updated);
    expect(JSON.parse(localStorage.getItem('user')!)).toEqual(updated);
  });

  it('should work with arrays', () => {
    const { result } = renderHook(() => useLocalStorage<string[]>('items', []));

    act(() => {
      result.current[1](['a', 'b', 'c']);
    });

    expect(result.current[0]).toEqual(['a', 'b', 'c']);
  });

  it('should handle invalid JSON in localStorage gracefully', () => {
    localStorage.setItem('key', 'not-valid-json');
    const { result } = renderHook(() => useLocalStorage('key', 'fallback'));
    expect(result.current[0]).toBe('fallback');
  });

  it('should handle localStorage errors gracefully', () => {
    const originalSetItem = localStorage.setItem;
    localStorage.setItem = jest.fn(() => {
      throw new Error('QuotaExceeded');
    });

    const { result } = renderHook(() => useLocalStorage('key', 'initial'));

    act(() => {
      result.current[1]('updated');
    });

    // State should still update even if localStorage fails
    expect(result.current[0]).toBe('updated');

    localStorage.setItem = originalSetItem;
  });
});
