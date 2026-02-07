# react-essentials-functions

A collection of zero-dependency useful hooks and components for React.

## Installation

```bash
yarn add react-essentials-functions
# or
npm install react-essentials-functions
```

## Table of Contents

- [Hooks](#hooks)
  - [useClickOutside](#useclickoutside)
  - [useDebounce](#usedebounce)
  - [useDimensions](#usedimensions)
  - [useLocalStorage](#uselocalstorage)
  - [useMediaQuery](#usemediaquery)
  - [usePrevious](#useprevious)
  - [useSafeFetch](#usesafefetch)
  - [useSafeState](#usesafestate)
  - [useScript](#usescript)
  - [useTheme](#usetheme)
  - [useToggle](#usetoggle)
  - [useWindowDimensions](#usewindowdimensions)
- [Components](#components)
  - [ConditionalWrapper](#conditionalwrapper)

---

## Hooks

### useClickOutside

Hook that detects clicks outside of a referenced element. Useful for closing dropdowns, modals, and popovers. Listens for both `mousedown` and `touchstart` events.

**Parameters:**
- `ref: RefObject<HTMLElement>` - React ref to the element to monitor
- `handler: (event: MouseEvent | TouchEvent) => void` - Callback fired when a click outside is detected

**Returns:**
- `void`

**Side effects:**
- Adds `mousedown` and `touchstart` event listeners on `document`
- Removes listeners on unmount

**Example:**
```tsx
import { useClickOutside } from 'react-essentials-functions';
import { useRef, useState } from 'react';

function Dropdown() {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  useClickOutside(dropdownRef, () => setIsOpen(false));

  return (
    <div ref={dropdownRef}>
      <button onClick={() => setIsOpen(true)}>Open</button>
      {isOpen && <ul><li>Option 1</li><li>Option 2</li></ul>}
    </div>
  );
}
```

---

### useDebounce

Hook that debounces a value by a given delay. The debounced value will only update after the specified delay has passed since the last change. Useful for search inputs, API calls, and any rapid-fire updates.

**Type Parameters:**
- `T` - The type of the value to debounce

**Parameters:**
- `value: T` - The value to debounce
- `delay: number` - The debounce delay in milliseconds

**Returns:**
- `T` - The debounced value

**Example:**
```tsx
import { useDebounce } from 'react-essentials-functions';
import { useState, useEffect } from 'react';

function SearchComponent() {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 300);

  useEffect(() => {
    if (debouncedSearch) {
      // This only fires 300ms after the user stops typing
      fetchResults(debouncedSearch);
    }
  }, [debouncedSearch]);

  return (
    <input
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder="Search..."
    />
  );
}
```

---

### useDimensions

Hook to get the dimensions of a DOM element. Uses `ResizeObserver` for optimal performance with a fallback to window events for older browsers.

**Parameters:**
- `targetRef: RefObject<HTMLElement>` - React ref to the element to measure

**Returns:**
- `Dimensions` - Object containing `width` and `height` of the element

**Side effects:**
- Creates a `ResizeObserver` on the target element (or falls back to `resize`/`scroll` window listeners)
- Cleans up on unmount

**Example:**
```tsx
import { useDimensions } from 'react-essentials-functions';
import { useRef } from 'react';

function MyComponent() {
  const targetRef = useRef<HTMLDivElement>(null);
  const { width, height } = useDimensions(targetRef);

  return (
    <div ref={targetRef}>
      Size: {width}px x {height}px
    </div>
  );
}
```

---

### useLocalStorage

Hook that syncs state with `localStorage`. Handles JSON serialization/deserialization automatically. Falls back gracefully when `localStorage` is unavailable (SSR, private browsing).

**Type Parameters:**
- `T` - The type of the stored value

**Parameters:**
- `key: string` - The localStorage key
- `initialValue: T` - The initial value if nothing is stored

**Returns:**
- `[T, (value: T | ((prev: T) => T)) => void, () => void]` - A tuple containing:
  - The current stored value
  - A setter function (accepts value or updater function)
  - A remove function to clear the key from localStorage

**Side effects:**
- Reads from `localStorage` on initialization
- Writes to `localStorage` on every value change
- `removeValue` deletes the key from `localStorage`

**Example:**
```tsx
import { useLocalStorage } from 'react-essentials-functions';

function Settings() {
  const [name, setName, removeName] = useLocalStorage('user-name', '');
  const [preferences, setPreferences] = useLocalStorage('prefs', {
    notifications: true,
    language: 'en',
  });

  return (
    <div>
      <input value={name} onChange={(e) => setName(e.target.value)} />
      <button onClick={removeName}>Clear name</button>
      <button onClick={() => setPreferences(prev => ({ ...prev, language: 'fr' }))}>
        Switch to French
      </button>
    </div>
  );
}
```

---

### useMediaQuery

Hook that tracks whether a CSS media query matches. Listens for changes and updates automatically. Useful for responsive design, detecting dark mode preference, reduced motion, etc.

**Parameters:**
- `query: string` - The CSS media query string (e.g. `'(min-width: 768px)'`)

**Returns:**
- `boolean` - Whether the media query currently matches

**Side effects:**
- Adds a `change` listener on the `MediaQueryList` object
- Removes listener on unmount or query change

**Example:**
```tsx
import { useMediaQuery } from 'react-essentials-functions';

function ResponsiveComponent() {
  const isMobile = useMediaQuery('(max-width: 767px)');
  const prefersDark = useMediaQuery('(prefers-color-scheme: dark)');
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  return (
    <div>
      {isMobile ? <MobileLayout /> : <DesktopLayout />}
      {prefersDark && <span>Dark mode detected</span>}
    </div>
  );
}
```

---

### usePrevious

Hook that returns the previous value of a variable. Useful for comparing current and previous props or state values.

**Type Parameters:**
- `T` - The type of the tracked value

**Parameters:**
- `value: T` - The value to track

**Returns:**
- `T | undefined` - The value from the previous render, or `undefined` on first render

**Example:**
```tsx
import { usePrevious } from 'react-essentials-functions';
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  const previousCount = usePrevious(count);

  return (
    <div>
      <p>Current: {count}, Previous: {previousCount ?? 'N/A'}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}
```

---

### useSafeFetch

Hook that provides a fetch function which automatically aborts previous requests and cleans up on unmount using `AbortController`. Prevents race conditions when multiple requests are made in sequence.

**Parameters:**
- None

**Returns:**
- `(url: string, options?: RequestInit) => Promise<Response>` - Fetch function with automatic abort handling

**Side effects:**
- Aborts the previous in-flight request when a new one is made
- Aborts any pending request on component unmount
- User-provided `signal` in options is ignored (the hook manages its own)

**Example:**
```tsx
import { useSafeFetch } from 'react-essentials-functions';
import { useEffect } from 'react';

function DataComponent() {
  const safeFetch = useSafeFetch();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await safeFetch('https://api.example.com/data');
        const data = await response.json();
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Fetch error:', error);
        }
      }
    };

    fetchData();
  }, [safeFetch]);

  return <div>Loading data...</div>;
}
```

---

### useSafeState

A version of `useState` that prevents state updates after the component unmounts, preventing memory leaks and "Can't perform a React state update on an unmounted component" warnings.

**Type Parameters:**
- `T` - The type of the state value

**Parameters:**
- `initialValue: T | (() => T)` - The initial state value

**Returns:**
- `[T, (value: T | ((prevState: T) => T)) => void]` - A tuple containing the current state and a safe setState function

**Example:**
```tsx
import { useSafeState } from 'react-essentials-functions';
import { useEffect } from 'react';

function UserProfile({ userId }) {
  const [user, setUser] = useSafeState<User | null>(null);

  useEffect(() => {
    fetchUser(userId).then((data) => {
      // Safe even if component unmounted during fetch
      setUser(data);
    });
  }, [userId]);

  return user ? <div>{user.name}</div> : <div>Loading...</div>;
}
```

---

### useScript

Hook to dynamically load external scripts with status tracking and callback support.

**Parameters:**
- `url: string` - The URL of the script to load
- `options?: UseScriptOptions` - Optional configuration:
  - `onLoad?: () => void` - Callback when script loads successfully
  - `onError?: () => void` - Callback when script fails to load
  - `removeOnUnmount?: boolean` - Whether to remove script on unmount (default: `true`)

**Returns:**
- `UseScriptStatus` - The current status: `'idle' | 'loading' | 'ready' | 'error'`

**Side effects:**
- Appends a `<script>` tag to `document.body`
- Removes the script tag on unmount (unless `removeOnUnmount: false`)
- Detects and reuses already-loaded scripts

**Example:**
```tsx
import { useScript } from 'react-essentials-functions';

function GoogleMapsComponent() {
  const status = useScript('https://maps.googleapis.com/maps/api/js', {
    onLoad: () => console.log('Google Maps loaded'),
    onError: () => console.error('Failed to load Google Maps'),
  });

  if (status === 'loading') return <div>Loading map...</div>;
  if (status === 'error') return <div>Error loading map</div>;
  if (status === 'idle') return <div>Initializing...</div>;

  return <div>Map is ready!</div>;
}
```

---

### useTheme

Hook to manage theme (light/dark) with `localStorage` persistence and SSR support. Automatically detects system color scheme preference via `prefers-color-scheme` when no theme has been previously stored.

**Returns:**
- `[ThemeMode, () => void, boolean]` - A tuple containing:
  - Current theme mode (`'light' | 'dark'`)
  - Function to toggle between themes
  - Boolean indicating if component is mounted (useful for SSR)

**Side effects:**
- Reads/writes to `localStorage` with key `'theme'`
- Detects system `prefers-color-scheme` preference on first load

**Example:**
```tsx
import { useTheme } from 'react-essentials-functions';

function ThemeToggle() {
  const [theme, toggleTheme, mounted] = useTheme();

  // Avoid hydration mismatch
  if (!mounted) return null;

  return (
    <button onClick={toggleTheme}>
      Switch to {theme === 'light' ? 'dark' : 'light'} mode
    </button>
  );
}
```

---

### useToggle

Hook for managing a boolean toggle state. Provides a simple API for toggling, setting true, or setting false. Useful for modals, dropdowns, accordions, etc.

**Parameters:**
- `initialValue?: boolean` - The initial boolean value (default: `false`)

**Returns:**
- `[boolean, () => void, () => void, () => void]` - A tuple containing:
  - The current boolean value
  - `toggle` - Flips the value
  - `setTrue` - Sets to `true`
  - `setFalse` - Sets to `false`

**Example:**
```tsx
import { useToggle } from 'react-essentials-functions';

function Modal() {
  const [isOpen, toggleOpen, open, close] = useToggle(false);

  return (
    <div>
      <button onClick={open}>Open Modal</button>
      {isOpen && (
        <div className="modal">
          <p>Modal content</p>
          <button onClick={close}>Close</button>
        </div>
      )}
    </div>
  );
}
```

---

### useWindowDimensions

Hook to get the current window dimensions with automatic updates on resize. SSR-safe (returns `0` for both dimensions when `window` is unavailable).

**Returns:**
- `WindowDimensions` - Object containing `width` and `height` of the window

**Side effects:**
- Adds a `resize` event listener on `window`
- Removes listener on unmount

**Example:**
```tsx
import { useWindowDimensions } from 'react-essentials-functions';

function ResponsiveComponent() {
  const { width, height } = useWindowDimensions();

  return (
    <div>
      Window size: {width}px x {height}px
      {width < 768 ? <MobileLayout /> : <DesktopLayout />}
    </div>
  );
}
```

---

## Components

### ConditionalWrapper

Component that conditionally wraps its children with a wrapper component based on a condition. When the condition is `false`, children are rendered unwrapped inside a fragment.

**Props:**
- `condition: boolean` - Whether to wrap the children
- `wrapper: (children: React.ReactNode) => JSX.Element` - Function that returns the wrapper element
- `children: React.ReactNode` - Children to wrap

**Example:**
```tsx
import { ConditionalWrapper } from 'react-essentials-functions';

function LinkWrapper({ link, children }) {
  return (
    <ConditionalWrapper
      condition={!!link}
      wrapper={(c) => <a href={link}>{c}</a>}
    >
      <button>{children}</button>
    </ConditionalWrapper>
  );
}
```

---

## TypeScript Support

This library is written in TypeScript and includes full type definitions. All types are exported for your convenience:

```ts
import type {
  Dimensions,
  WindowDimensions,
  ThemeMode,
  UseScriptStatus,
  UseScriptOptions,
  ConditionalWrapperProps,
} from 'react-essentials-functions';
```

## License

MIT
