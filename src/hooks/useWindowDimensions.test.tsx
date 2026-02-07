import { renderHook, act } from '@testing-library/react';
import useWindowDimensions from './useWindowDimensions';

describe('useWindowDimensions', () => {
  const originalInnerWidth = window.innerWidth;
  const originalInnerHeight = window.innerHeight;

  afterEach(() => {
    // Restore original values after each test
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: originalInnerWidth,
    });
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: originalInnerHeight,
    });
  });

  it('should return window dimensions', () => {
    // Mock window dimensions
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    });
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: 768,
    });

    const { result } = renderHook(() => useWindowDimensions());

    expect(result.current).toEqual({ width: 1024, height: 768 });
  });

  it('should update dimensions on window resize', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    });
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: 768,
    });

    const { result } = renderHook(() => useWindowDimensions());

    expect(result.current).toEqual({ width: 1024, height: 768 });

    act(() => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1920,
      });
      Object.defineProperty(window, 'innerHeight', {
        writable: true,
        configurable: true,
        value: 1080,
      });
      window.dispatchEvent(new Event('resize'));
    });

    expect(result.current).toEqual({ width: 1920, height: 1080 });
  });

  it('should use correct types', () => {
    const { result } = renderHook(() => useWindowDimensions());

    expect(typeof result.current.width).toBe('number');
    expect(typeof result.current.height).toBe('number');
  });
});
