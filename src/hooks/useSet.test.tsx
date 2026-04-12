import { renderHook, act } from '@testing-library/react';
import { useSet } from './useSet';

describe('useSet', () => {
  it('should initialize empty by default', () => {
    const { result } = renderHook(() => useSet<string>());
    expect(result.current.size).toBe(0);
  });

  it('should initialize with values', () => {
    const { result } = renderHook(() => useSet<string>(['a', 'b', 'c']));
    expect(result.current.size).toBe(3);
    expect(result.current.has('a')).toBe(true);
    expect(result.current.has('b')).toBe(true);
    expect(result.current.has('c')).toBe(true);
  });

  it('should add a value', () => {
    const { result } = renderHook(() => useSet<string>());

    act(() => {
      result.current.add('hello');
    });

    expect(result.current.has('hello')).toBe(true);
    expect(result.current.size).toBe(1);
  });

  it('should not duplicate values', () => {
    const { result } = renderHook(() => useSet<string>(['a']));

    act(() => {
      result.current.add('a');
    });

    expect(result.current.size).toBe(1);
  });

  it('should remove a value', () => {
    const { result } = renderHook(() => useSet<string>(['a', 'b']));

    act(() => {
      result.current.remove('a');
    });

    expect(result.current.has('a')).toBe(false);
    expect(result.current.size).toBe(1);
  });

  it('should toggle a value (add if absent)', () => {
    const { result } = renderHook(() => useSet<string>());

    act(() => {
      result.current.toggle('x');
    });

    expect(result.current.has('x')).toBe(true);
  });

  it('should toggle a value (remove if present)', () => {
    const { result } = renderHook(() => useSet<string>(['x']));

    act(() => {
      result.current.toggle('x');
    });

    expect(result.current.has('x')).toBe(false);
  });

  it('should clear all values', () => {
    const { result } = renderHook(() => useSet<string>(['a', 'b', 'c']));

    act(() => {
      result.current.clear();
    });

    expect(result.current.size).toBe(0);
  });

  it('should reset to initial values', () => {
    const initial = ['a', 'b'];
    const { result } = renderHook(() => useSet<string>(initial));

    act(() => {
      result.current.add('c');
      result.current.remove('a');
    });

    act(() => {
      result.current.reset();
    });

    expect(result.current.size).toBe(2);
    expect(result.current.has('a')).toBe(true);
    expect(result.current.has('b')).toBe(true);
  });

  it('should work with numbers', () => {
    const { result } = renderHook(() => useSet<number>([1, 2, 3]));

    act(() => {
      result.current.toggle(2);
      result.current.add(4);
    });

    expect(result.current.has(2)).toBe(false);
    expect(result.current.has(4)).toBe(true);
    expect(result.current.size).toBe(3);
  });
});
