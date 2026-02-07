import { renderHook, act } from '@testing-library/react';
import { useScript } from './useScript';

describe('useScript', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  afterEach(() => {
    // Clean up any script tags
    const scripts = document.querySelectorAll('script');
    scripts.forEach((script) => script.remove());
  });

  it('should start with loading status', () => {
    const { result } = renderHook(() =>
      useScript('https://example.com/script.js'),
    );
    expect(result.current).toBe('loading');
  });

  it('should create and append script to body', () => {
    renderHook(() => useScript('https://example.com/script.js'));

    const script = document.querySelector(
      'script[src="https://example.com/script.js"]',
    );
    expect(script).toBeInTheDocument();
    expect(script?.async).toBe(true);
  });

  it('should set status to loading when script is added', () => {
    const { result } = renderHook(() =>
      useScript('https://example.com/script.js'),
    );

    expect(result.current).toBe('loading');
  });

  it('should set status to ready on successful load', async () => {
    const { result } = renderHook(() =>
      useScript('https://example.com/script.js'),
    );

    const script = document.querySelector(
      'script[src="https://example.com/script.js"]',
    );

    // Simulate script load
    await act(async () => {
      script?.dispatchEvent(new Event('load'));
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(result.current).toBe('ready');
  });

  it('should set status to error on load failure', async () => {
    const { result } = renderHook(() =>
      useScript('https://example.com/script.js'),
    );

    const script = document.querySelector(
      'script[src="https://example.com/script.js"]',
    );

    // Simulate script error
    await act(async () => {
      script?.dispatchEvent(new Event('error'));
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(result.current).toBe('error');
  });

  it('should call onLoad callback when script loads', async () => {
    const onLoad = jest.fn();

    renderHook(() => useScript('https://example.com/script.js', { onLoad }));

    const script = document.querySelector(
      'script[src="https://example.com/script.js"]',
    );

    await act(async () => {
      script?.dispatchEvent(new Event('load'));
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(onLoad).toHaveBeenCalled();
  });

  it('should call onError callback when script fails to load', async () => {
    const onError = jest.fn();

    renderHook(() => useScript('https://example.com/script.js', { onError }));

    const script = document.querySelector(
      'script[src="https://example.com/script.js"]',
    );

    await act(async () => {
      script?.dispatchEvent(new Event('error'));
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(onError).toHaveBeenCalled();
  });

  it('should remove script on unmount when removeOnUnmount is true', () => {
    const { unmount } = renderHook(() =>
      useScript('https://example.com/script.js', { removeOnUnmount: true }),
    );

    const script = document.querySelector(
      'script[src="https://example.com/script.js"]',
    );
    expect(script).toBeInTheDocument();

    unmount();

    const scriptAfterUnmount = document.querySelector(
      'script[src="https://example.com/script.js"]',
    );
    expect(scriptAfterUnmount).not.toBeInTheDocument();
  });

  it('should keep script on unmount when removeOnUnmount is false', () => {
    const { unmount } = renderHook(() =>
      useScript('https://example.com/script.js', { removeOnUnmount: false }),
    );

    const script = document.querySelector(
      'script[src="https://example.com/script.js"]',
    );
    expect(script).toBeInTheDocument();

    unmount();

    const scriptAfterUnmount = document.querySelector(
      'script[src="https://example.com/script.js"]',
    );
    expect(scriptAfterUnmount).toBeInTheDocument();
  });

  it('should detect already loaded script', () => {
    // Pre-add script to DOM
    const script = document.createElement('script');
    script.src = 'https://example.com/script.js';
    script.readyState = 'complete';
    document.body.appendChild(script);

    const { result } = renderHook(() =>
      useScript('https://example.com/script.js'),
    );

    expect(result.current).toBe('ready');
  });
});
