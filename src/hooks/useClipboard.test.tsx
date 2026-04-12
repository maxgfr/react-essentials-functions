import { renderHook, act } from '@testing-library/react';
import { useClipboard } from './useClipboard';

describe('useClipboard', () => {
  let writeTextMock: jest.Mock;

  beforeEach(() => {
    jest.useFakeTimers();
    writeTextMock = jest.fn().mockResolvedValue(undefined);
    Object.assign(navigator, {
      clipboard: {
        writeText: writeTextMock,
      },
    });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should initialize with copied false and no error', () => {
    const { result } = renderHook(() => useClipboard());

    expect(result.current.copied).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should copy text to clipboard', async () => {
    const { result } = renderHook(() => useClipboard());

    await act(async () => {
      await result.current.copy('hello');
    });

    expect(writeTextMock).toHaveBeenCalledWith('hello');
    expect(result.current.copied).toBe(true);
    expect(result.current.error).toBeNull();
  });

  it('should reset copied state after default delay', async () => {
    const { result } = renderHook(() => useClipboard());

    await act(async () => {
      await result.current.copy('hello');
    });

    expect(result.current.copied).toBe(true);

    act(() => {
      jest.advanceTimersByTime(2000);
    });

    expect(result.current.copied).toBe(false);
  });

  it('should reset copied state after custom delay', async () => {
    const { result } = renderHook(() => useClipboard({ resetDelay: 500 }));

    await act(async () => {
      await result.current.copy('hello');
    });

    expect(result.current.copied).toBe(true);

    act(() => {
      jest.advanceTimersByTime(499);
    });

    expect(result.current.copied).toBe(true);

    act(() => {
      jest.advanceTimersByTime(1);
    });

    expect(result.current.copied).toBe(false);
  });

  it('should handle clipboard write failure', async () => {
    writeTextMock.mockRejectedValue(new Error('Permission denied'));

    const { result } = renderHook(() => useClipboard());

    await act(async () => {
      await result.current.copy('hello');
    });

    expect(result.current.copied).toBe(false);
    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error?.message).toBe('Permission denied');
  });

  it('should handle missing clipboard API', async () => {
    Object.assign(navigator, { clipboard: undefined });

    const { result } = renderHook(() => useClipboard());

    await act(async () => {
      await result.current.copy('hello');
    });

    expect(result.current.copied).toBe(false);
    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error?.message).toBe(
      'Clipboard API is not available',
    );
  });

  it('should clear previous timeout on successive copies', async () => {
    const { result } = renderHook(() => useClipboard({ resetDelay: 1000 }));

    await act(async () => {
      await result.current.copy('first');
    });

    act(() => {
      jest.advanceTimersByTime(800);
    });

    expect(result.current.copied).toBe(true);

    await act(async () => {
      await result.current.copy('second');
    });

    // Should still be copied after 800ms from second copy
    act(() => {
      jest.advanceTimersByTime(800);
    });

    expect(result.current.copied).toBe(true);

    act(() => {
      jest.advanceTimersByTime(200);
    });

    expect(result.current.copied).toBe(false);
  });

  it('should cleanup timeout on unmount', async () => {
    const { result, unmount } = renderHook(() => useClipboard());

    await act(async () => {
      await result.current.copy('hello');
    });

    unmount();

    // Should not throw after unmount
    act(() => {
      jest.advanceTimersByTime(2000);
    });
  });
});
