import { renderHook } from '@testing-library/react';
import { useSafeFetch } from './useSafeFetch';

describe('useSafeFetch', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return a fetch function', () => {
    const { result } = renderHook(() => useSafeFetch());
    expect(typeof result.current).toBe('function');
  });

  it('should fetch data successfully', async () => {
    const mockData = { test: 'data' };
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockData),
      } as Response),
    ) as jest.Mock;

    const { result } = renderHook(() => useSafeFetch());

    const response = await result.current('https://api.example.com/test');

    expect(global.fetch).toHaveBeenCalledWith(
      'https://api.example.com/test',
      expect.objectContaining({
        signal: expect.any(AbortSignal),
      }),
    );
    expect(response).toBeDefined();
  });

  it('should pass options to fetch', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
      } as Response),
    ) as jest.Mock;

    const { result } = renderHook(() => useSafeFetch());

    await result.current('https://api.example.com/test', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });

    expect(global.fetch).toHaveBeenCalledWith(
      'https://api.example.com/test',
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      }),
    );
  });

  it('should abort previous request on new fetch', async () => {
    let abortCount = 0;
    global.fetch = jest.fn(() => {
      return new Promise(() => {
        // Never resolving request
      });
    }) as jest.Mock;

    // Mock AbortController
    const originalAbortController = global.AbortController;
    const mockAbort = () => {
      abortCount++;
    };

    global.AbortController = jest.fn(() => ({
      signal: {},
      abort: mockAbort,
    })) as unknown as typeof AbortController;

    const { result } = renderHook(() => useSafeFetch());

    // First call (will be aborted)
    result.current('https://api.example.com/first');

    // Second call (should abort first)
    result.current('https://api.example.com/second');

    expect(abortCount).toBe(1);

    global.AbortController = originalAbortController;
  });

  it('should abort on unmount', async () => {
    let abortCount = 0;

    const originalAbortController = global.AbortController;
    global.AbortController = jest.fn(() => ({
      signal: {},
      abort: () => {
        abortCount++;
      },
    })) as unknown as typeof AbortController;

    const { result, unmount } = renderHook(() => useSafeFetch());

    result.current('https://api.example.com/test');

    unmount();

    expect(abortCount).toBe(1);

    global.AbortController = originalAbortController;
  });
});
