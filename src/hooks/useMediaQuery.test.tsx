import { renderHook, act } from '@testing-library/react';
import { useMediaQuery } from './useMediaQuery';

describe('useMediaQuery', () => {
  let listeners: Map<string, (event: MediaQueryListEvent) => void>;
  let mediaQueryMatches: Map<string, boolean>;

  beforeEach(() => {
    listeners = new Map();
    mediaQueryMatches = new Map();

    window.matchMedia = jest.fn((query: string) => {
      const matches = mediaQueryMatches.get(query) ?? false;
      return {
        matches,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(
          (_: string, handler: (event: MediaQueryListEvent) => void) => {
            listeners.set(query, handler);
          },
        ),
        removeEventListener: jest.fn(() => {
          listeners.delete(query);
        }),
        dispatchEvent: jest.fn(),
      } as unknown as MediaQueryList;
    });
  });

  it('should return false by default', () => {
    const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'));
    expect(result.current).toBe(false);
  });

  it('should return true when media query matches', () => {
    mediaQueryMatches.set('(min-width: 768px)', true);
    const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'));
    expect(result.current).toBe(true);
  });

  it('should update when media query changes', () => {
    mediaQueryMatches.set('(min-width: 768px)', false);
    const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'));

    expect(result.current).toBe(false);

    act(() => {
      const handler = listeners.get('(min-width: 768px)');
      if (handler) {
        handler({ matches: true } as MediaQueryListEvent);
      }
    });

    expect(result.current).toBe(true);
  });

  it('should clean up listener on unmount', () => {
    const { unmount } = renderHook(() => useMediaQuery('(min-width: 768px)'));

    expect(listeners.has('(min-width: 768px)')).toBe(true);

    unmount();

    expect(listeners.has('(min-width: 768px)')).toBe(false);
  });

  it('should handle query changes', () => {
    mediaQueryMatches.set('(min-width: 768px)', true);
    mediaQueryMatches.set('(min-width: 1024px)', false);

    const { result, rerender } = renderHook(
      ({ query }) => useMediaQuery(query),
      { initialProps: { query: '(min-width: 768px)' } },
    );

    expect(result.current).toBe(true);

    rerender({ query: '(min-width: 1024px)' });
    expect(result.current).toBe(false);
  });
});
