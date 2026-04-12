import { renderHook } from '@testing-library/react';
import { useIsFirstRender } from './useIsFirstRender';

describe('useIsFirstRender', () => {
  it('should return true on the first render', () => {
    const { result } = renderHook(() => useIsFirstRender());
    expect(result.current).toBe(true);
  });

  it('should return false on subsequent renders', () => {
    const { result, rerender } = renderHook(() => useIsFirstRender());

    expect(result.current).toBe(true);

    rerender();
    expect(result.current).toBe(false);

    rerender();
    expect(result.current).toBe(false);

    rerender();
    expect(result.current).toBe(false);
  });
});
