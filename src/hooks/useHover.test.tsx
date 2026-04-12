import { renderHook, act } from '@testing-library/react';
import { useHover } from './useHover';

describe('useHover', () => {
  it('should initialize as not hovered', () => {
    const { result } = renderHook(() => useHover());
    expect(result.current.isHovered).toBe(false);
  });

  it('should set isHovered to true on mouseenter', () => {
    const { result } = renderHook(() => useHover<HTMLDivElement>());
    const element = document.createElement('div');

    act(() => {
      result.current.ref(element);
    });

    act(() => {
      element.dispatchEvent(new MouseEvent('mouseenter'));
    });

    expect(result.current.isHovered).toBe(true);
  });

  it('should set isHovered to false on mouseleave', () => {
    const { result } = renderHook(() => useHover<HTMLDivElement>());
    const element = document.createElement('div');

    act(() => {
      result.current.ref(element);
    });

    act(() => {
      element.dispatchEvent(new MouseEvent('mouseenter'));
    });

    expect(result.current.isHovered).toBe(true);

    act(() => {
      element.dispatchEvent(new MouseEvent('mouseleave'));
    });

    expect(result.current.isHovered).toBe(false);
  });

  it('should clean up listeners when ref changes', () => {
    const { result } = renderHook(() => useHover<HTMLDivElement>());
    const element1 = document.createElement('div');
    const element2 = document.createElement('div');

    act(() => {
      result.current.ref(element1);
    });

    // Switch to a new element
    act(() => {
      result.current.ref(element2);
    });

    // Old element should not trigger hover
    act(() => {
      element1.dispatchEvent(new MouseEvent('mouseenter'));
    });

    expect(result.current.isHovered).toBe(false);

    // New element should trigger hover
    act(() => {
      element2.dispatchEvent(new MouseEvent('mouseenter'));
    });

    expect(result.current.isHovered).toBe(true);
  });

  it('should clean up listeners when ref is set to null', () => {
    const { result } = renderHook(() => useHover<HTMLDivElement>());
    const element = document.createElement('div');

    act(() => {
      result.current.ref(element);
    });

    act(() => {
      result.current.ref(null);
    });

    act(() => {
      element.dispatchEvent(new MouseEvent('mouseenter'));
    });

    expect(result.current.isHovered).toBe(false);
  });
});
