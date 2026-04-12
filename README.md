# react-essentials-functions

A collection of zero-dependency useful hooks and components for React.

## Installation

```bash
pnpm add react-essentials-functions
# or
yarn add react-essentials-functions
# or
npm install react-essentials-functions
```

## Table of Contents

- [Hooks](#hooks)
  - [useClickOutside](#useclickoutside)
  - [useClipboard](#useclipboard)
  - [useCounter](#usecounter)
  - [useDebounce](#usedebounce)
  - [useDimensions](#usedimensions)
  - [useDocumentTitle](#usedocumenttitle)
  - [useEventListener](#useeventlistener)
  - [useHover](#usehover)
  - [useIdle](#useidle)
  - [useIntersectionObserver](#useintersectionobserver)
  - [useInterval](#useinterval)
  - [useIsFirstRender](#useisfirstrender)
  - [useKeyPress](#usekeypress)
  - [useLocalStorage](#uselocalstorage)
  - [useMap](#usemap)
  - [useMediaQuery](#usemediaquery)
  - [useOnlineStatus](#useonlinestatus)
  - [usePrevious](#useprevious)
  - [useSafeFetch](#usesafefetch)
  - [useSafeState](#usesafestate)
  - [useScript](#usescript)
  - [useSessionStorage](#usesessionstorage)
  - [useSet](#useset)
  - [useTheme](#usetheme)
  - [useTimeout](#usetimeout)
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

### useClipboard

Hook that copies text to the clipboard and tracks the copy status. Provides a temporary "copied" feedback state that resets after a configurable delay. Uses the modern Clipboard API.

**Parameters:**
- `options?: { resetDelay?: number }` - Optional configuration
  - `resetDelay` - Milliseconds before `copied` resets to `false` (default: `2000`)

**Returns:**
- `UseClipboardReturn` - Object containing:
  - `copy: (text: string) => Promise<void>` - Function to copy text
  - `copied: boolean` - Whether the last copy was successful (resets after delay)
  - `error: Error | null` - Error from the last copy attempt

**Side effects:**
- Writes to the system clipboard via `navigator.clipboard.writeText()`
- Sets a timeout to reset the `copied` state
- Cleans up timeout on unmount

**Example:**
```tsx
import { useClipboard } from 'react-essentials-functions';

function ShareButton({ url }: { url: string }) {
  const { copy, copied, error } = useClipboard({ resetDelay: 3000 });

  return (
    <div>
      <button onClick={() => copy(url)}>
        {copied ? 'Copied!' : 'Copy link'}
      </button>
      {error && <span>Failed to copy</span>}
    </div>
  );
}
```

---

### useCounter

Hook for managing a numeric counter with increment, decrement, and reset. Optionally clamps values between min and max bounds.

**Parameters:**
- `initialValue?: number` - The initial counter value (default: `0`)
- `options?: { min?: number; max?: number }` - Optional min/max bounds

**Returns:**
- `UseCounterReturn` - Object containing:
  - `count: number` - Current count value
  - `increment: (amount?: number) => void` - Increment by 1 or a custom amount
  - `decrement: (amount?: number) => void` - Decrement by 1 or a custom amount
  - `reset: () => void` - Reset to the initial value
  - `set: (value: number | ((prev: number) => number)) => void` - Set an arbitrary value

**Example:**
```tsx
import { useCounter } from 'react-essentials-functions';

function QuantitySelector() {
  const { count, increment, decrement, reset } = useCounter(1, { min: 0, max: 99 });

  return (
    <div>
      <button onClick={() => decrement()}>-</button>
      <span>{count}</span>
      <button onClick={() => increment()}>+</button>
      <button onClick={reset}>Reset</button>
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

### useDocumentTitle

Hook that sets the document title and optionally restores it on unmount. Useful for updating the browser tab title based on the current page or route.

**Parameters:**
- `title: string` - The document title to set
- `options?: { restoreOnUnmount?: boolean }` - Optional configuration
  - `restoreOnUnmount` - Whether to restore the previous title on unmount (default: `true`)

**Returns:**
- `void`

**Side effects:**
- Sets `document.title` on mount and when the title changes
- Restores the previous title on unmount (unless `restoreOnUnmount: false`)

**Example:**
```tsx
import { useDocumentTitle } from 'react-essentials-functions';

function ProfilePage({ user }: { user: { name: string } }) {
  useDocumentTitle(`${user.name} - Profile`);

  return <div>{user.name}</div>;
}
```

---

### useEventListener

Hook that declaratively adds an event listener to a target. Automatically handles cleanup and always uses the latest handler reference without re-subscribing.

**Type Parameters:**
- `K extends keyof WindowEventMap` - The event name type

**Parameters:**
- `eventName: K` - The event name to listen for
- `handler: (event: WindowEventMap[K]) => void` - The event handler callback
- `target?: EventTarget | null` - The event target (default: `window`)
- `options?: boolean | AddEventListenerOptions` - Optional `addEventListener` options

**Returns:**
- `void`

**Side effects:**
- Adds an event listener on the target
- Removes the listener on unmount or when dependencies change

**Example:**
```tsx
import { useEventListener } from 'react-essentials-functions';

function ScrollTracker() {
  useEventListener('scroll', (event) => {
    console.log('Scrolled!', window.scrollY);
  });

  return <div>Scroll the page</div>;
}
```

---

### useHover

Hook that tracks whether an element is being hovered. Uses `mouseenter`/`mouseleave` events for reliable hover detection. Returns a callback ref for easy attachment.

**Type Parameters:**
- `T extends HTMLElement` - The type of the element to track (default: `HTMLElement`)

**Returns:**
- `UseHoverReturn<T>` - Object containing:
  - `ref: (node: T | null) => void` - Callback ref to attach to the element
  - `isHovered: boolean` - Whether the element is currently hovered

**Side effects:**
- Adds `mouseenter` and `mouseleave` listeners on the referenced element
- Cleans up listeners when the ref changes or on unmount

**Example:**
```tsx
import { useHover } from 'react-essentials-functions';

function HoverCard() {
  const { ref, isHovered } = useHover<HTMLDivElement>();

  return (
    <div ref={ref} style={{ background: isHovered ? '#e0e0ff' : '#fff' }}>
      {isHovered ? 'Hovered!' : 'Hover me'}
    </div>
  );
}
```

---

### useIdle

Hook that detects whether the user is idle (no mouse, keyboard, or touch activity for a given duration). Useful for auto-logout, pausing expensive operations, or showing "Are you still there?" prompts. Internally throttles activity events to avoid excessive re-renders.

**Parameters:**
- `timeout?: number` - Idle threshold in milliseconds (default: `60000` = 1 minute)

**Returns:**
- `UseIdleReturn` - Object containing:
  - `isIdle: boolean` - Whether the user is currently idle
  - `lastActive: number` - Timestamp (`Date.now()`) of the last detected activity

**Side effects:**
- Adds `mousemove`, `mousedown`, `keydown`, `touchstart`, and `scroll` listeners on `document`
- Uses a `setTimeout` to detect idle state
- Removes all listeners and clears timeout on unmount

**Example:**
```tsx
import { useIdle } from 'react-essentials-functions';

function SessionGuard() {
  const { isIdle, lastActive } = useIdle(300000); // 5 minutes

  return (
    <div>
      {isIdle && (
        <Modal>
          <p>Are you still there?</p>
          <p>Last active: {new Date(lastActive).toLocaleTimeString()}</p>
        </Modal>
      )}
    </div>
  );
}
```

---

### useIntersectionObserver

Hook that observes whether a DOM element is visible in the viewport using the IntersectionObserver API. Useful for lazy loading images, infinite scroll, scroll-triggered animations, and read tracking.

**Parameters:**
- `options?: UseIntersectionObserverOptions` - Optional configuration:
  - `threshold?: number | number[]` - Threshold(s) at which the callback is invoked (0 to 1)
  - `root?: Element | null` - Element used as the viewport for checking visibility
  - `rootMargin?: string` - Margin around the root element
  - `freezeOnceVisible?: boolean` - If `true`, stops observing once the element becomes visible

**Returns:**
- `UseIntersectionObserverReturn` - Object containing:
  - `ref: (node: Element | null) => void` - Callback ref to attach to the element
  - `entry: IntersectionObserverEntry | null` - The latest observer entry
  - `isIntersecting: boolean` - Whether the element is currently intersecting

**Side effects:**
- Creates an `IntersectionObserver` when a ref is attached
- Disconnects the observer on unmount or when `freezeOnceVisible` triggers

**Example:**
```tsx
import { useIntersectionObserver } from 'react-essentials-functions';

function LazyImage({ src, alt }: { src: string; alt: string }) {
  const { ref, isIntersecting } = useIntersectionObserver({
    threshold: 0.1,
    freezeOnceVisible: true,
  });

  return (
    <div ref={ref}>
      {isIntersecting ? (
        <img src={src} alt={alt} />
      ) : (
        <div className="placeholder" />
      )}
    </div>
  );
}
```

---

### useInterval

Hook that sets up a declarative `setInterval`. The interval is automatically cleared on unmount. Pass `null` as delay to pause the interval. Always uses the latest callback without resetting the interval.

**Parameters:**
- `callback: () => void` - Function to call on each interval tick
- `delay: number | null` - Interval delay in milliseconds, or `null` to pause

**Returns:**
- `void`

**Side effects:**
- Creates a `setInterval` timer
- Clears the interval on unmount or when delay changes

**Example:**
```tsx
import { useInterval } from 'react-essentials-functions';
import { useState } from 'react';

function Timer() {
  const [count, setCount] = useState(0);
  const [isRunning, setIsRunning] = useState(true);

  useInterval(() => {
    setCount(prev => prev + 1);
  }, isRunning ? 1000 : null);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setIsRunning(!isRunning)}>
        {isRunning ? 'Pause' : 'Resume'}
      </button>
    </div>
  );
}
```

---

### useIsFirstRender

Hook that returns `true` only on the first render. Useful for skipping effects on mount or distinguishing initial renders from subsequent updates.

**Returns:**
- `boolean` - Whether this is the first render

**Example:**
```tsx
import { useIsFirstRender } from 'react-essentials-functions';
import { useEffect } from 'react';

function AutoSave({ data }: { data: object }) {
  const isFirstRender = useIsFirstRender();

  useEffect(() => {
    if (!isFirstRender) {
      saveToServer(data);
    }
  }, [data]);

  return <div>Auto-saving...</div>;
}
```

---

### useKeyPress

Hook that detects when a specific keyboard key is pressed. Useful for keyboard shortcuts, accessibility, modal escape-to-close, form submit-on-enter, and similar interactions.

**Parameters:**
- `targetKey: string` - The `KeyboardEvent.key` value to match (e.g., `'Escape'`, `'Enter'`, `'a'`)
- `handler: (event: KeyboardEvent) => void` - Callback fired when the key is pressed
- `options?: UseKeyPressOptions` - Optional configuration:
  - `event?: 'keydown' | 'keyup'` - Which keyboard event to listen to (default: `'keydown'`)
  - `target?: EventTarget | null` - The event target (default: `document`)

**Returns:**
- `void`

**Side effects:**
- Adds a keyboard event listener on the target (default: `document`)
- Removes listener on unmount or when dependencies change

**Example:**
```tsx
import { useKeyPress } from 'react-essentials-functions';
import { useState } from 'react';

function Modal({ onClose }: { onClose: () => void }) {
  useKeyPress('Escape', onClose);

  return (
    <div className="modal">
      <p>Press Escape to close</p>
      <button onClick={onClose}>Close</button>
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

### useMap

Hook for managing a `Map` as React state. Provides convenient methods to manipulate entries without manual spread/copy boilerplate.

**Type Parameters:**
- `K` - The key type
- `V` - The value type

**Parameters:**
- `initialEntries?: Iterable<[K, V]>` - Optional initial entries for the Map

**Returns:**
- `UseMapReturn<K, V>` - Object containing:
  - `map: Map<K, V>` - The current Map
  - `set: (key: K, value: V) => void` - Set a key-value pair
  - `remove: (key: K) => void` - Delete a key
  - `has: (key: K) => boolean` - Check if a key exists
  - `get: (key: K) => V | undefined` - Get the value for a key
  - `clear: () => void` - Clear all entries
  - `reset: () => void` - Reset to initial entries
  - `size: number` - Number of entries

**Example:**
```tsx
import { useMap } from 'react-essentials-functions';

function ShoppingCart() {
  const { map, set, remove, size } = useMap<string, number>([
    ['apples', 3],
    ['bananas', 5],
  ]);

  return (
    <div>
      <p>{size} items in cart</p>
      <button onClick={() => set('oranges', 2)}>Add oranges</button>
      <button onClick={() => remove('bananas')}>Remove bananas</button>
      <ul>
        {[...map.entries()].map(([item, qty]) => (
          <li key={item}>{item}: {qty}</li>
        ))}
      </ul>
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

### useOnlineStatus

Hook that tracks whether the browser is online or offline. Updates reactively when connectivity changes. Useful for showing connectivity warnings, disabling network-dependent UI, or queueing offline mutations.

**Parameters:**
- None

**Returns:**
- `boolean` - Whether the browser is currently online

**Side effects:**
- Adds `online` and `offline` event listeners on `window`
- Removes listeners on unmount

**Example:**
```tsx
import { useOnlineStatus } from 'react-essentials-functions';

function App() {
  const isOnline = useOnlineStatus();

  return (
    <div>
      {!isOnline && (
        <div className="offline-banner">
          You are offline. Some features may be unavailable.
        </div>
      )}
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

### useSessionStorage

Hook that syncs state with `sessionStorage`. Handles JSON serialization/deserialization automatically. Falls back gracefully when `sessionStorage` is unavailable (SSR, private browsing). Unlike `useLocalStorage`, data persists only within the current browser tab and is cleared when the tab is closed.

**Type Parameters:**
- `T` - The type of the stored value

**Parameters:**
- `key: string` - The sessionStorage key
- `initialValue: T` - The initial value if nothing is stored

**Returns:**
- `[T, (value: T | ((prev: T) => T)) => void, () => void]` - A tuple containing:
  - The current stored value
  - A setter function (accepts value or updater function)
  - A remove function to clear the key from sessionStorage

**Side effects:**
- Reads from `sessionStorage` on initialization
- Writes to `sessionStorage` on every value change
- `removeValue` deletes the key from `sessionStorage`

**Example:**
```tsx
import { useSessionStorage } from 'react-essentials-functions';

function MultiStepForm() {
  const [step, setStep, resetStep] = useSessionStorage('form-step', 0);
  const [formData, setFormData, clearFormData] = useSessionStorage('form-data', {
    name: '',
    email: '',
  });

  return (
    <div>
      <p>Step {step + 1} of 3</p>
      <button onClick={() => setStep(prev => prev + 1)}>Next</button>
      <button onClick={() => { resetStep(); clearFormData(); }}>
        Start over
      </button>
    </div>
  );
}
```

---

### useSet

Hook for managing a `Set` as React state. Provides convenient methods to add, remove, and toggle values.

**Type Parameters:**
- `T` - The value type

**Parameters:**
- `initialValues?: Iterable<T>` - Optional initial values for the Set

**Returns:**
- `UseSetReturn<T>` - Object containing:
  - `set: Set<T>` - The current Set
  - `add: (value: T) => void` - Add a value
  - `remove: (value: T) => void` - Remove a value
  - `toggle: (value: T) => void` - Toggle a value (add if absent, remove if present)
  - `has: (value: T) => boolean` - Check if a value exists
  - `clear: () => void` - Clear all values
  - `reset: () => void` - Reset to initial values
  - `size: number` - Number of values

**Example:**
```tsx
import { useSet } from 'react-essentials-functions';

function TagSelector() {
  const { set, toggle, has } = useSet<string>(['react']);

  const tags = ['react', 'typescript', 'node', 'vue'];

  return (
    <div>
      {tags.map(tag => (
        <button
          key={tag}
          onClick={() => toggle(tag)}
          style={{ fontWeight: has(tag) ? 'bold' : 'normal' }}
        >
          {tag}
        </button>
      ))}
    </div>
  );
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

### useTimeout

Hook that sets up a declarative `setTimeout`. The timeout is automatically cleared on unmount. Pass `null` as delay to cancel the timeout. Always uses the latest callback.

**Parameters:**
- `callback: () => void` - Function to call when the timeout fires
- `delay: number | null` - Timeout delay in milliseconds, or `null` to cancel

**Returns:**
- `void`

**Side effects:**
- Creates a `setTimeout` timer
- Clears the timeout on unmount or when delay changes

**Example:**
```tsx
import { useTimeout } from 'react-essentials-functions';
import { useState } from 'react';

function Toast({ message }: { message: string }) {
  const [visible, setVisible] = useState(true);

  useTimeout(() => {
    setVisible(false);
  }, 5000);

  return visible ? <div className="toast">{message}</div> : null;
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
  UseClipboardReturn,
  UseCounterReturn,
  UseHoverReturn,
  UseIdleReturn,
  UseIntersectionObserverOptions,
  UseIntersectionObserverReturn,
  UseKeyPressOptions,
  UseMapReturn,
  UseScriptStatus,
  UseScriptOptions,
  UseSetReturn,
  ConditionalWrapperProps,
} from 'react-essentials-functions';
```

## License

MIT
