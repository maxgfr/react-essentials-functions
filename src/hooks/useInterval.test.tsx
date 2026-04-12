import { renderHook } from '@testing-library/react';
import { useInterval } from './useInterval';

describe('useInterval', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should call callback at the specified interval', () => {
    const callback = jest.fn();
    renderHook(() => useInterval(callback, 1000));

    expect(callback).not.toHaveBeenCalled();

    jest.advanceTimersByTime(1000);
    expect(callback).toHaveBeenCalledTimes(1);

    jest.advanceTimersByTime(1000);
    expect(callback).toHaveBeenCalledTimes(2);

    jest.advanceTimersByTime(3000);
    expect(callback).toHaveBeenCalledTimes(5);
  });

  it('should not fire when delay is null', () => {
    const callback = jest.fn();
    renderHook(() => useInterval(callback, null));

    jest.advanceTimersByTime(10000);
    expect(callback).not.toHaveBeenCalled();
  });

  it('should pause when delay changes to null', () => {
    const callback = jest.fn();
    const { rerender } = renderHook(
      ({ delay }) => useInterval(callback, delay),
      { initialProps: { delay: 1000 as number | null } },
    );

    jest.advanceTimersByTime(2500);
    expect(callback).toHaveBeenCalledTimes(2);

    rerender({ delay: null });

    jest.advanceTimersByTime(5000);
    expect(callback).toHaveBeenCalledTimes(2);
  });

  it('should use the latest callback', () => {
    const callback1 = jest.fn();
    const callback2 = jest.fn();

    const { rerender } = renderHook(({ cb }) => useInterval(cb, 1000), {
      initialProps: { cb: callback1 },
    });

    rerender({ cb: callback2 });

    jest.advanceTimersByTime(1000);
    expect(callback1).not.toHaveBeenCalled();
    expect(callback2).toHaveBeenCalledTimes(1);
  });

  it('should clear interval on unmount', () => {
    const callback = jest.fn();
    const { unmount } = renderHook(() => useInterval(callback, 1000));

    jest.advanceTimersByTime(1000);
    expect(callback).toHaveBeenCalledTimes(1);

    unmount();

    jest.advanceTimersByTime(5000);
    expect(callback).toHaveBeenCalledTimes(1);
  });
});
