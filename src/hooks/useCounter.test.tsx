import { renderHook, act } from '@testing-library/react';
import { useCounter } from './useCounter';

describe('useCounter', () => {
  it('should initialize with default value 0', () => {
    const { result } = renderHook(() => useCounter());
    expect(result.current.count).toBe(0);
  });

  it('should initialize with custom value', () => {
    const { result } = renderHook(() => useCounter(10));
    expect(result.current.count).toBe(10);
  });

  it('should increment by 1 by default', () => {
    const { result } = renderHook(() => useCounter(0));

    act(() => {
      result.current.increment();
    });

    expect(result.current.count).toBe(1);
  });

  it('should increment by custom amount', () => {
    const { result } = renderHook(() => useCounter(0));

    act(() => {
      result.current.increment(5);
    });

    expect(result.current.count).toBe(5);
  });

  it('should decrement by 1 by default', () => {
    const { result } = renderHook(() => useCounter(10));

    act(() => {
      result.current.decrement();
    });

    expect(result.current.count).toBe(9);
  });

  it('should decrement by custom amount', () => {
    const { result } = renderHook(() => useCounter(10));

    act(() => {
      result.current.decrement(3);
    });

    expect(result.current.count).toBe(7);
  });

  it('should reset to initial value', () => {
    const { result } = renderHook(() => useCounter(5));

    act(() => {
      result.current.increment(10);
    });

    expect(result.current.count).toBe(15);

    act(() => {
      result.current.reset();
    });

    expect(result.current.count).toBe(5);
  });

  it('should set to arbitrary value', () => {
    const { result } = renderHook(() => useCounter(0));

    act(() => {
      result.current.set(42);
    });

    expect(result.current.count).toBe(42);
  });

  it('should set with functional updater', () => {
    const { result } = renderHook(() => useCounter(10));

    act(() => {
      result.current.set((prev) => prev * 2);
    });

    expect(result.current.count).toBe(20);
  });

  it('should clamp to min', () => {
    const { result } = renderHook(() => useCounter(5, { min: 0 }));

    act(() => {
      result.current.decrement(10);
    });

    expect(result.current.count).toBe(0);
  });

  it('should clamp to max', () => {
    const { result } = renderHook(() => useCounter(5, { max: 10 }));

    act(() => {
      result.current.increment(10);
    });

    expect(result.current.count).toBe(10);
  });

  it('should clamp set to bounds', () => {
    const { result } = renderHook(() => useCounter(5, { min: 0, max: 10 }));

    act(() => {
      result.current.set(100);
    });

    expect(result.current.count).toBe(10);

    act(() => {
      result.current.set(-100);
    });

    expect(result.current.count).toBe(0);
  });
});
