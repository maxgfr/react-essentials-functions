import { renderHook, act } from '@testing-library/react';
import { useToggle } from './useToggle';

describe('useToggle', () => {
  it('should start with false by default', () => {
    const { result } = renderHook(() => useToggle());
    expect(result.current[0]).toBe(false);
  });

  it('should accept an initial value', () => {
    const { result } = renderHook(() => useToggle(true));
    expect(result.current[0]).toBe(true);
  });

  it('should toggle the value', () => {
    const { result } = renderHook(() => useToggle(false));

    act(() => {
      result.current[1]();
    });
    expect(result.current[0]).toBe(true);

    act(() => {
      result.current[1]();
    });
    expect(result.current[0]).toBe(false);
  });

  it('should set value to true', () => {
    const { result } = renderHook(() => useToggle(false));

    act(() => {
      result.current[2]();
    });
    expect(result.current[0]).toBe(true);

    // Calling setTrue again should keep it true
    act(() => {
      result.current[2]();
    });
    expect(result.current[0]).toBe(true);
  });

  it('should set value to false', () => {
    const { result } = renderHook(() => useToggle(true));

    act(() => {
      result.current[3]();
    });
    expect(result.current[0]).toBe(false);

    // Calling setFalse again should keep it false
    act(() => {
      result.current[3]();
    });
    expect(result.current[0]).toBe(false);
  });

  it('should work with combined operations', () => {
    const { result } = renderHook(() => useToggle(false));

    act(() => {
      result.current[2](); // setTrue
    });
    expect(result.current[0]).toBe(true);

    act(() => {
      result.current[1](); // toggle
    });
    expect(result.current[0]).toBe(false);

    act(() => {
      result.current[3](); // setFalse
    });
    expect(result.current[0]).toBe(false);
  });
});
