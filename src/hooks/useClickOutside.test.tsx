import { renderHook } from '@testing-library/react';
import { useClickOutside } from './useClickOutside';

describe('useClickOutside', () => {
  it('should call handler when clicking outside the element', () => {
    const handler = jest.fn();
    const element = document.createElement('div');
    document.body.appendChild(element);

    const ref = { current: element };
    renderHook(() => useClickOutside(ref, handler));

    // Click outside
    const outsideEvent = new MouseEvent('mousedown', { bubbles: true });
    document.body.dispatchEvent(outsideEvent);

    expect(handler).toHaveBeenCalledTimes(1);

    document.body.removeChild(element);
  });

  it('should not call handler when clicking inside the element', () => {
    const handler = jest.fn();
    const element = document.createElement('div');
    const child = document.createElement('span');
    element.appendChild(child);
    document.body.appendChild(element);

    const ref = { current: element };
    renderHook(() => useClickOutside(ref, handler));

    // Click inside (on child)
    const insideEvent = new MouseEvent('mousedown', { bubbles: true });
    child.dispatchEvent(insideEvent);

    expect(handler).not.toHaveBeenCalled();

    document.body.removeChild(element);
  });

  it('should not call handler when clicking the element itself', () => {
    const handler = jest.fn();
    const element = document.createElement('div');
    document.body.appendChild(element);

    const ref = { current: element };
    renderHook(() => useClickOutside(ref, handler));

    const event = new MouseEvent('mousedown', { bubbles: true });
    element.dispatchEvent(event);

    expect(handler).not.toHaveBeenCalled();

    document.body.removeChild(element);
  });

  it('should handle touch events', () => {
    const handler = jest.fn();
    const element = document.createElement('div');
    document.body.appendChild(element);

    const ref = { current: element };
    renderHook(() => useClickOutside(ref, handler));

    const touchEvent = new TouchEvent('touchstart', { bubbles: true });
    document.body.dispatchEvent(touchEvent);

    expect(handler).toHaveBeenCalledTimes(1);

    document.body.removeChild(element);
  });

  it('should clean up listeners on unmount', () => {
    const handler = jest.fn();
    const element = document.createElement('div');
    document.body.appendChild(element);

    const ref = { current: element };
    const { unmount } = renderHook(() => useClickOutside(ref, handler));

    unmount();

    const event = new MouseEvent('mousedown', { bubbles: true });
    document.body.dispatchEvent(event);

    expect(handler).not.toHaveBeenCalled();

    document.body.removeChild(element);
  });

  it('should handle null ref gracefully', () => {
    const handler = jest.fn();
    const ref = { current: null };

    renderHook(() =>
      useClickOutside(ref as React.RefObject<HTMLElement>, handler),
    );

    const event = new MouseEvent('mousedown', { bubbles: true });
    document.body.dispatchEvent(event);

    // Should not crash, handler not called because ref is null
    expect(handler).not.toHaveBeenCalled();
  });
});
