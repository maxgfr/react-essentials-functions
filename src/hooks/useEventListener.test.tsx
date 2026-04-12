import { renderHook } from '@testing-library/react';
import { useEventListener } from './useEventListener';

describe('useEventListener', () => {
  it('should listen to window events by default', () => {
    const handler = jest.fn();
    renderHook(() => useEventListener('click', handler));

    window.dispatchEvent(new MouseEvent('click'));
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('should listen to custom target events', () => {
    const handler = jest.fn();
    const target = document.createElement('div');
    document.body.appendChild(target);

    renderHook(() => useEventListener('click', handler, target));

    // Should not respond to window events
    window.dispatchEvent(new MouseEvent('click'));
    expect(handler).not.toHaveBeenCalled();

    // Should respond to target events
    target.dispatchEvent(new MouseEvent('click'));
    expect(handler).toHaveBeenCalledTimes(1);

    document.body.removeChild(target);
  });

  it('should use the latest handler without re-subscribing', () => {
    const handler1 = jest.fn();
    const handler2 = jest.fn();

    const { rerender } = renderHook(
      ({ handler }) => useEventListener('click', handler),
      { initialProps: { handler: handler1 } },
    );

    rerender({ handler: handler2 });

    window.dispatchEvent(new MouseEvent('click'));
    expect(handler1).not.toHaveBeenCalled();
    expect(handler2).toHaveBeenCalledTimes(1);
  });

  it('should remove listener on unmount', () => {
    const handler = jest.fn();
    const { unmount } = renderHook(() => useEventListener('click', handler));

    unmount();

    window.dispatchEvent(new MouseEvent('click'));
    expect(handler).not.toHaveBeenCalled();
  });

  it('should handle resize events', () => {
    const handler = jest.fn();
    renderHook(() => useEventListener('resize', handler));

    window.dispatchEvent(new Event('resize'));
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('should handle null target gracefully', () => {
    const handler = jest.fn();
    renderHook(() => useEventListener('click', handler, null));

    // Falls back to window
    window.dispatchEvent(new MouseEvent('click'));
    expect(handler).toHaveBeenCalledTimes(1);
  });
});
