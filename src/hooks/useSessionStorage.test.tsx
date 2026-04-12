import { renderHook, act } from '@testing-library/react';
import { useSessionStorage } from './useSessionStorage';

describe('useSessionStorage', () => {
  beforeEach(() => {
    window.sessionStorage.clear();
  });

  it('should return initial value when nothing is stored', () => {
    const { result } = renderHook(() =>
      useSessionStorage('test-key', 'initial'),
    );
    expect(result.current[0]).toBe('initial');
  });

  it('should return stored value from sessionStorage', () => {
    window.sessionStorage.setItem('test-key', JSON.stringify('stored-value'));

    const { result } = renderHook(() =>
      useSessionStorage('test-key', 'initial'),
    );
    expect(result.current[0]).toBe('stored-value');
  });

  it('should update value in state and sessionStorage', () => {
    const { result } = renderHook(() =>
      useSessionStorage('test-key', 'initial'),
    );

    act(() => {
      result.current[1]('new-value');
    });

    expect(result.current[0]).toBe('new-value');
    expect(JSON.parse(window.sessionStorage.getItem('test-key')!)).toBe(
      'new-value',
    );
  });

  it('should support functional updates', () => {
    const { result } = renderHook(() => useSessionStorage('counter', 0));

    act(() => {
      result.current[1]((prev) => prev + 1);
    });

    expect(result.current[0]).toBe(1);

    act(() => {
      result.current[1]((prev) => prev + 10);
    });

    expect(result.current[0]).toBe(11);
  });

  it('should remove value from sessionStorage', () => {
    const { result } = renderHook(() =>
      useSessionStorage('test-key', 'initial'),
    );

    act(() => {
      result.current[1]('updated');
    });

    expect(result.current[0]).toBe('updated');

    act(() => {
      result.current[2]();
    });

    expect(result.current[0]).toBe('initial');
    expect(window.sessionStorage.getItem('test-key')).toBeNull();
  });

  it('should handle objects', () => {
    const initialValue = { name: 'test', count: 0 };
    const { result } = renderHook(() =>
      useSessionStorage('obj-key', initialValue),
    );

    expect(result.current[0]).toEqual(initialValue);

    act(() => {
      result.current[1]({ name: 'updated', count: 5 });
    });

    expect(result.current[0]).toEqual({ name: 'updated', count: 5 });
  });

  it('should handle invalid JSON in sessionStorage gracefully', () => {
    window.sessionStorage.setItem('test-key', 'not valid json');

    const { result } = renderHook(() =>
      useSessionStorage('test-key', 'fallback'),
    );
    expect(result.current[0]).toBe('fallback');
  });

  it('should handle sessionStorage errors gracefully', () => {
    const mockSetItem = jest
      .spyOn(Storage.prototype, 'setItem')
      .mockImplementation(() => {
        throw new Error('QuotaExceeded');
      });

    const { result } = renderHook(() =>
      useSessionStorage('test-key', 'initial'),
    );

    act(() => {
      result.current[1]('new-value');
    });

    // State should still update even if sessionStorage fails
    expect(result.current[0]).toBe('new-value');

    mockSetItem.mockRestore();
  });
});
