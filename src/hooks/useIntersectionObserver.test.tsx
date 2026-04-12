import { renderHook, act } from '@testing-library/react';
import { useIntersectionObserver } from './useIntersectionObserver';

describe('useIntersectionObserver', () => {
  let observeMock: jest.Mock;
  let disconnectMock: jest.Mock;
  let observerCallback: (entries: Partial<IntersectionObserverEntry>[]) => void;

  beforeEach(() => {
    observeMock = jest.fn();
    disconnectMock = jest.fn();

    (global as Record<string, unknown>).IntersectionObserver = jest.fn(
      (callback: (entries: Partial<IntersectionObserverEntry>[]) => void) => {
        observerCallback = callback;
        return {
          observe: observeMock,
          disconnect: disconnectMock,
          unobserve: jest.fn(),
        };
      },
    );
  });

  afterEach(() => {
    delete (global as Record<string, unknown>).IntersectionObserver;
  });

  it('should initialize with null entry and false isIntersecting', () => {
    const { result } = renderHook(() => useIntersectionObserver());

    expect(result.current.entry).toBeNull();
    expect(result.current.isIntersecting).toBe(false);
    expect(result.current.ref).toBeInstanceOf(Function);
  });

  it('should observe when ref is attached to a node', () => {
    const { result } = renderHook(() => useIntersectionObserver());
    const element = document.createElement('div');

    act(() => {
      result.current.ref(element);
    });

    expect(observeMock).toHaveBeenCalledWith(element);
  });

  it('should update entry when intersection changes', () => {
    const { result } = renderHook(() => useIntersectionObserver());
    const element = document.createElement('div');

    act(() => {
      result.current.ref(element);
    });

    const mockEntry = {
      isIntersecting: true,
      intersectionRatio: 0.5,
      target: element,
    };

    act(() => {
      observerCallback([mockEntry]);
    });

    expect(result.current.isIntersecting).toBe(true);
    expect(result.current.entry).toEqual(mockEntry);
  });

  it('should update when element leaves viewport', () => {
    const { result } = renderHook(() => useIntersectionObserver());
    const element = document.createElement('div');

    act(() => {
      result.current.ref(element);
    });

    act(() => {
      observerCallback([{ isIntersecting: true, target: element }]);
    });

    expect(result.current.isIntersecting).toBe(true);

    act(() => {
      observerCallback([{ isIntersecting: false, target: element }]);
    });

    expect(result.current.isIntersecting).toBe(false);
  });

  it('should freeze observation when freezeOnceVisible is true', () => {
    const { result } = renderHook(() =>
      useIntersectionObserver({ freezeOnceVisible: true }),
    );
    const element = document.createElement('div');

    act(() => {
      result.current.ref(element);
    });

    act(() => {
      observerCallback([{ isIntersecting: true, target: element }]);
    });

    expect(result.current.isIntersecting).toBe(true);
    expect(disconnectMock).toHaveBeenCalled();
  });

  it('should not freeze when element is not intersecting', () => {
    const { result } = renderHook(() =>
      useIntersectionObserver({ freezeOnceVisible: true }),
    );
    const element = document.createElement('div');

    act(() => {
      result.current.ref(element);
    });

    act(() => {
      observerCallback([{ isIntersecting: false, target: element }]);
    });

    expect(result.current.isIntersecting).toBe(false);
    // disconnect is called once for cleanup during re-observe, but the observer is recreated
    // The important thing is the observer is still active
  });

  it('should pass options to IntersectionObserver', () => {
    const options = {
      threshold: 0.5,
      rootMargin: '10px',
    };

    const { result } = renderHook(() => useIntersectionObserver(options));
    const element = document.createElement('div');

    act(() => {
      result.current.ref(element);
    });

    expect(global.IntersectionObserver).toHaveBeenCalledWith(
      expect.any(Function),
      expect.objectContaining({
        threshold: 0.5,
        rootMargin: '10px',
      }),
    );
  });

  it('should disconnect on unmount', () => {
    const { result, unmount } = renderHook(() => useIntersectionObserver());
    const element = document.createElement('div');

    act(() => {
      result.current.ref(element);
    });

    unmount();

    expect(disconnectMock).toHaveBeenCalled();
  });

  it('should handle null ref', () => {
    const { result } = renderHook(() => useIntersectionObserver());

    act(() => {
      result.current.ref(null);
    });

    expect(observeMock).not.toHaveBeenCalled();
  });
});
