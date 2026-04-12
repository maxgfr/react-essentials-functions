import { renderHook, act } from '@testing-library/react';
import { useIdle } from './useIdle';

describe('useIdle', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should initialize as not idle', () => {
    const { result } = renderHook(() => useIdle(5000));

    expect(result.current.isIdle).toBe(false);
    expect(result.current.lastActive).toBeGreaterThan(0);
  });

  it('should become idle after timeout', () => {
    const { result } = renderHook(() => useIdle(5000));

    expect(result.current.isIdle).toBe(false);

    act(() => {
      jest.advanceTimersByTime(5000);
    });

    expect(result.current.isIdle).toBe(true);
  });

  it('should reset idle on mouse movement', () => {
    const { result } = renderHook(() => useIdle(5000));

    act(() => {
      jest.advanceTimersByTime(4000);
    });

    expect(result.current.isIdle).toBe(false);

    act(() => {
      document.dispatchEvent(new Event('mousemove'));
    });

    act(() => {
      jest.advanceTimersByTime(4000);
    });

    expect(result.current.isIdle).toBe(false);

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(result.current.isIdle).toBe(true);
  });

  it('should reset idle on keydown', () => {
    const { result } = renderHook(() => useIdle(5000));

    act(() => {
      jest.advanceTimersByTime(5000);
    });

    expect(result.current.isIdle).toBe(true);

    act(() => {
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'a' }));
    });

    expect(result.current.isIdle).toBe(false);
  });

  it('should reset idle on mousedown', () => {
    const { result } = renderHook(() => useIdle(5000));

    act(() => {
      jest.advanceTimersByTime(5000);
    });

    expect(result.current.isIdle).toBe(true);

    act(() => {
      document.dispatchEvent(new MouseEvent('mousedown'));
    });

    expect(result.current.isIdle).toBe(false);
  });

  it('should reset idle on touchstart', () => {
    const { result } = renderHook(() => useIdle(5000));

    act(() => {
      jest.advanceTimersByTime(5000);
    });

    expect(result.current.isIdle).toBe(true);

    act(() => {
      document.dispatchEvent(new Event('touchstart'));
    });

    expect(result.current.isIdle).toBe(false);
  });

  it('should reset idle on scroll', () => {
    const { result } = renderHook(() => useIdle(5000));

    act(() => {
      jest.advanceTimersByTime(5000);
    });

    expect(result.current.isIdle).toBe(true);

    act(() => {
      document.dispatchEvent(new Event('scroll'));
    });

    expect(result.current.isIdle).toBe(false);
  });

  it('should use default timeout of 60 seconds', () => {
    const { result } = renderHook(() => useIdle());

    act(() => {
      jest.advanceTimersByTime(59999);
    });

    expect(result.current.isIdle).toBe(false);

    act(() => {
      jest.advanceTimersByTime(1);
    });

    expect(result.current.isIdle).toBe(true);
  });

  it('should clean up event listeners on unmount', () => {
    const addSpy = jest.spyOn(document, 'addEventListener');
    const removeSpy = jest.spyOn(document, 'removeEventListener');

    const { unmount } = renderHook(() => useIdle(5000));

    const expectedEvents = [
      'mousemove',
      'mousedown',
      'keydown',
      'touchstart',
      'scroll',
    ];

    expectedEvents.forEach((event) => {
      expect(addSpy).toHaveBeenCalledWith(
        event,
        expect.any(Function),
        expect.objectContaining({ passive: true }),
      );
    });

    unmount();

    expectedEvents.forEach((event) => {
      expect(removeSpy).toHaveBeenCalledWith(event, expect.any(Function));
    });

    addSpy.mockRestore();
    removeSpy.mockRestore();
  });
});
