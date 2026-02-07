import { renderHook, act } from '@testing-library/react';
import { useSafeState } from './useSafeState';

describe('useSafeState', () => {
  it('should return initial state', () => {
    const { result } = renderHook(() => useSafeState(0));
    expect(result.current[0]).toBe(0);
  });

  it('should update state when component is mounted', () => {
    const { result } = renderHook(() => useSafeState(0));

    act(() => {
      result.current[1](5);
    });

    expect(result.current[0]).toBe(5);
  });

  it('should accept function updater', () => {
    const { result } = renderHook(() => useSafeState(0));

    act(() => {
      result.current[1]((prev: number) => prev + 1);
    });

    expect(result.current[0]).toBe(1);
  });

  it('should not update state after component unmount', () => {
    const { result, unmount } = renderHook(() => useSafeState(0));

    unmount();

    act(() => {
      result.current[1](5);
    });

    // State should not be updated after unmount
    expect(result.current[0]).toBe(0);
  });

  it('should work with generic types', () => {
    const { result } = renderHook(() =>
      useSafeState<{ name: string }>({ name: 'test' }),
    );

    expect(result.current[0]).toEqual({ name: 'test' });

    act(() => {
      result.current[1]({ name: 'updated' });
    });

    expect(result.current[0]).toEqual({ name: 'updated' });
  });
});
