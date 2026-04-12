import { renderHook, act } from '@testing-library/react';
import { useMap } from './useMap';

describe('useMap', () => {
  it('should initialize empty by default', () => {
    const { result } = renderHook(() => useMap<string, number>());
    expect(result.current.size).toBe(0);
  });

  it('should initialize with entries', () => {
    const { result } = renderHook(() =>
      useMap<string, number>([
        ['a', 1],
        ['b', 2],
      ]),
    );
    expect(result.current.size).toBe(2);
    expect(result.current.get('a')).toBe(1);
    expect(result.current.get('b')).toBe(2);
  });

  it('should set a key-value pair', () => {
    const { result } = renderHook(() => useMap<string, number>());

    act(() => {
      result.current.set('key', 42);
    });

    expect(result.current.get('key')).toBe(42);
    expect(result.current.size).toBe(1);
  });

  it('should overwrite existing key', () => {
    const { result } = renderHook(() => useMap<string, number>([['key', 1]]));

    act(() => {
      result.current.set('key', 99);
    });

    expect(result.current.get('key')).toBe(99);
    expect(result.current.size).toBe(1);
  });

  it('should remove a key', () => {
    const { result } = renderHook(() =>
      useMap<string, number>([
        ['a', 1],
        ['b', 2],
      ]),
    );

    act(() => {
      result.current.remove('a');
    });

    expect(result.current.has('a')).toBe(false);
    expect(result.current.size).toBe(1);
  });

  it('should check if key exists', () => {
    const { result } = renderHook(() => useMap<string, number>([['key', 1]]));

    expect(result.current.has('key')).toBe(true);
    expect(result.current.has('nope')).toBe(false);
  });

  it('should clear all entries', () => {
    const { result } = renderHook(() =>
      useMap<string, number>([
        ['a', 1],
        ['b', 2],
      ]),
    );

    act(() => {
      result.current.clear();
    });

    expect(result.current.size).toBe(0);
  });

  it('should reset to initial entries', () => {
    const initial: [string, number][] = [
      ['a', 1],
      ['b', 2],
    ];
    const { result } = renderHook(() => useMap<string, number>(initial));

    act(() => {
      result.current.set('c', 3);
      result.current.remove('a');
    });

    act(() => {
      result.current.reset();
    });

    expect(result.current.size).toBe(2);
    expect(result.current.get('a')).toBe(1);
    expect(result.current.get('b')).toBe(2);
  });
});
