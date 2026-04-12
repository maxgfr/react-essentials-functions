import { useState, useCallback } from 'react';

/**
 * Return type for the useMap hook.
 */
export type UseMapReturn<K, V> = {
  /** The current Map */
  map: Map<K, V>;
  /** Set a key-value pair */
  set: (key: K, value: V) => void;
  /** Delete a key */
  remove: (key: K) => void;
  /** Check if a key exists */
  has: (key: K) => boolean;
  /** Get the value for a key */
  get: (key: K) => V | undefined;
  /** Clear all entries */
  clear: () => void;
  /** Reset to initial entries */
  reset: () => void;
  /** Number of entries */
  size: number;
};

/**
 * Hook for managing a Map as React state.
 * Provides convenient methods to manipulate entries without manual
 * spread/copy boilerplate.
 *
 * @param initialEntries - Optional initial entries for the Map
 * @returns Object with the map and manipulation methods
 *
 * @example
 * ```tsx
 * const { map, set, remove, has, clear } = useMap<string, number>([
 *   ['apples', 3],
 *   ['bananas', 5],
 * ]);
 *
 * return (
 *   <div>
 *     <p>Apples: {map.get('apples')}</p>
 *     <button onClick={() => set('oranges', 2)}>Add oranges</button>
 *     <button onClick={() => remove('bananas')}>Remove bananas</button>
 *     <button onClick={clear}>Clear all</button>
 *   </div>
 * );
 * ```
 */
export function useMap<K, V>(
  initialEntries?: Iterable<[K, V]>,
): UseMapReturn<K, V> {
  const [map, setMap] = useState(() => new Map<K, V>(initialEntries));

  const set = useCallback((key: K, value: V) => {
    setMap((prev) => {
      const next = new Map(prev);
      next.set(key, value);
      return next;
    });
  }, []);

  const remove = useCallback((key: K) => {
    setMap((prev) => {
      const next = new Map(prev);
      next.delete(key);
      return next;
    });
  }, []);

  const has = useCallback((key: K) => map.has(key), [map]);

  const get = useCallback((key: K) => map.get(key), [map]);

  const clear = useCallback(() => {
    setMap(new Map<K, V>());
  }, []);

  const reset = useCallback(() => {
    setMap(new Map<K, V>(initialEntries));
  }, [initialEntries]);

  return { map, set, remove, has, get, clear, reset, size: map.size };
}
