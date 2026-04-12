import { renderHook } from '@testing-library/react';
import { useKeyPress } from './useKeyPress';

describe('useKeyPress', () => {
  it('should call handler when the target key is pressed', () => {
    const handler = jest.fn();
    renderHook(() => useKeyPress('Enter', handler));

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenCalledWith(
      expect.objectContaining({ key: 'Enter' }),
    );
  });

  it('should not call handler for other keys', () => {
    const handler = jest.fn();
    renderHook(() => useKeyPress('Enter', handler));

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'a' }));

    expect(handler).not.toHaveBeenCalled();
  });

  it('should support keyup event', () => {
    const handler = jest.fn();
    renderHook(() => useKeyPress('Escape', handler, { event: 'keyup' }));

    document.dispatchEvent(new KeyboardEvent('keyup', { key: 'Escape' }));

    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('should not fire on keydown when listening to keyup', () => {
    const handler = jest.fn();
    renderHook(() => useKeyPress('Escape', handler, { event: 'keyup' }));

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));

    expect(handler).not.toHaveBeenCalled();
  });

  it('should support custom target', () => {
    const handler = jest.fn();
    const target = document.createElement('div');
    document.body.appendChild(target);

    renderHook(() => useKeyPress('Enter', handler, { target }));

    // Should not respond to document events
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    expect(handler).not.toHaveBeenCalled();

    // Should respond to target events
    target.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    expect(handler).toHaveBeenCalledTimes(1);

    document.body.removeChild(target);
  });

  it('should remove event listeners on unmount', () => {
    const handler = jest.fn();
    const { unmount } = renderHook(() => useKeyPress('Enter', handler));

    unmount();

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    expect(handler).not.toHaveBeenCalled();
  });

  it('should use the latest handler without re-subscribing', () => {
    const handler1 = jest.fn();
    const handler2 = jest.fn();

    const { rerender } = renderHook(
      ({ handler }) => useKeyPress('Enter', handler),
      { initialProps: { handler: handler1 } },
    );

    rerender({ handler: handler2 });

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

    expect(handler1).not.toHaveBeenCalled();
    expect(handler2).toHaveBeenCalledTimes(1);
  });
});
