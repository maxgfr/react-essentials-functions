import { renderHook } from '@testing-library/react';
import { useTimeout } from './useTimeout';

describe('useTimeout', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should call callback after the delay', () => {
    const callback = jest.fn();
    renderHook(() => useTimeout(callback, 1000));

    expect(callback).not.toHaveBeenCalled();

    jest.advanceTimersByTime(1000);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should not call callback before the delay', () => {
    const callback = jest.fn();
    renderHook(() => useTimeout(callback, 1000));

    jest.advanceTimersByTime(999);
    expect(callback).not.toHaveBeenCalled();
  });

  it('should not fire when delay is null', () => {
    const callback = jest.fn();
    renderHook(() => useTimeout(callback, null));

    jest.advanceTimersByTime(10000);
    expect(callback).not.toHaveBeenCalled();
  });

  it('should cancel when delay changes to null', () => {
    const callback = jest.fn();
    const { rerender } = renderHook(
      ({ delay }) => useTimeout(callback, delay),
      { initialProps: { delay: 5000 as number | null } },
    );

    jest.advanceTimersByTime(2000);
    rerender({ delay: null });

    jest.advanceTimersByTime(10000);
    expect(callback).not.toHaveBeenCalled();
  });

  it('should use the latest callback', () => {
    const callback1 = jest.fn();
    const callback2 = jest.fn();

    const { rerender } = renderHook(({ cb }) => useTimeout(cb, 1000), {
      initialProps: { cb: callback1 },
    });

    rerender({ cb: callback2 });

    jest.advanceTimersByTime(1000);
    expect(callback1).not.toHaveBeenCalled();
    expect(callback2).toHaveBeenCalledTimes(1);
  });

  it('should clear timeout on unmount', () => {
    const callback = jest.fn();
    const { unmount } = renderHook(() => useTimeout(callback, 1000));

    unmount();

    jest.advanceTimersByTime(2000);
    expect(callback).not.toHaveBeenCalled();
  });

  it('should only fire once', () => {
    const callback = jest.fn();
    renderHook(() => useTimeout(callback, 1000));

    jest.advanceTimersByTime(5000);
    expect(callback).toHaveBeenCalledTimes(1);
  });
});
