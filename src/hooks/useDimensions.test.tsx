import { renderHook, act } from '@testing-library/react';
import { useDimensions } from './useDimensions';

describe('useDimensions', () => {
  it('should return zero dimensions when ref is null', () => {
    const { result } = renderHook(() =>
      useDimensions({ current: null } as React.RefObject<HTMLElement>),
    );

    expect(result.current).toEqual({ width: 0, height: 0 });
  });

  it('should return element dimensions', () => {
    const mockElement = {
      offsetWidth: 300,
      offsetHeight: 200,
    } as HTMLElement;

    const { result } = renderHook(() =>
      useDimensions({
        current: mockElement,
      } as React.RefObject<HTMLElement>),
    );

    expect(result.current).toEqual({ width: 300, height: 200 });
  });

  it('should use ResizeObserver when available', () => {
    let observeCallback: (() => void) | null = null;
    const disconnectMock = jest.fn();

    const OriginalResizeObserver = global.ResizeObserver;
    global.ResizeObserver = jest.fn((callback) => ({
      observe: jest.fn(() => {
        observeCallback = callback;
      }),
      unobserve: jest.fn(),
      disconnect: disconnectMock,
    })) as unknown as typeof ResizeObserver;

    const mockElement = {
      offsetWidth: 100,
      offsetHeight: 50,
    } as HTMLElement;

    const ref = { current: mockElement } as React.RefObject<HTMLElement>;
    const { result, unmount } = renderHook(() => useDimensions(ref));

    expect(result.current).toEqual({ width: 100, height: 50 });

    // Simulate element resize via ResizeObserver callback
    act(() => {
      Object.defineProperty(mockElement, 'offsetWidth', {
        value: 200,
        configurable: true,
      });
      Object.defineProperty(mockElement, 'offsetHeight', {
        value: 150,
        configurable: true,
      });
      observeCallback?.();
    });

    expect(result.current).toEqual({ width: 200, height: 150 });

    // Cleanup should disconnect
    unmount();
    expect(disconnectMock).toHaveBeenCalled();

    global.ResizeObserver = OriginalResizeObserver;
  });

  it('should fall back to window events when ResizeObserver is not available', () => {
    const OriginalResizeObserver = global.ResizeObserver;
    // @ts-expect-error - removing ResizeObserver for test
    delete global.ResizeObserver;

    const mockElement = {
      offsetWidth: 300,
      offsetHeight: 200,
    } as HTMLElement;

    const ref = { current: mockElement } as React.RefObject<HTMLElement>;
    const { result } = renderHook(() => useDimensions(ref));

    expect(result.current).toEqual({ width: 300, height: 200 });

    // Simulate resize via window event
    act(() => {
      Object.defineProperty(mockElement, 'offsetWidth', {
        value: 500,
        configurable: true,
      });
      Object.defineProperty(mockElement, 'offsetHeight', {
        value: 400,
        configurable: true,
      });
      window.dispatchEvent(new Event('resize'));
    });

    expect(result.current).toEqual({ width: 500, height: 400 });

    // Also test scroll event
    act(() => {
      Object.defineProperty(mockElement, 'offsetWidth', {
        value: 600,
        configurable: true,
      });
      Object.defineProperty(mockElement, 'offsetHeight', {
        value: 450,
        configurable: true,
      });
      window.dispatchEvent(new Event('scroll'));
    });

    expect(result.current).toEqual({ width: 600, height: 450 });

    global.ResizeObserver = OriginalResizeObserver;
  });

  it('should cleanup window event listeners on unmount (fallback path)', () => {
    const OriginalResizeObserver = global.ResizeObserver;
    // @ts-expect-error - removing ResizeObserver for test
    delete global.ResizeObserver;

    const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');

    const mockElement = {
      offsetWidth: 100,
      offsetHeight: 100,
    } as HTMLElement;

    const ref = { current: mockElement } as React.RefObject<HTMLElement>;
    const { unmount } = renderHook(() => useDimensions(ref));

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      'resize',
      expect.any(Function),
    );
    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      'scroll',
      expect.any(Function),
    );

    removeEventListenerSpy.mockRestore();
    global.ResizeObserver = OriginalResizeObserver;
  });
});
