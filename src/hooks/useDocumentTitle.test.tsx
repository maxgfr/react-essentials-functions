import { renderHook } from '@testing-library/react';
import { useDocumentTitle } from './useDocumentTitle';

describe('useDocumentTitle', () => {
  const originalTitle = document.title;

  afterEach(() => {
    document.title = originalTitle;
  });

  it('should set the document title', () => {
    renderHook(() => useDocumentTitle('New Title'));
    expect(document.title).toBe('New Title');
  });

  it('should update the title when it changes', () => {
    const { rerender } = renderHook(({ title }) => useDocumentTitle(title), {
      initialProps: { title: 'Title 1' },
    });

    expect(document.title).toBe('Title 1');

    rerender({ title: 'Title 2' });
    expect(document.title).toBe('Title 2');
  });

  it('should restore the previous title on unmount by default', () => {
    document.title = 'Original';

    const { unmount } = renderHook(() => useDocumentTitle('Temporary'));
    expect(document.title).toBe('Temporary');

    unmount();
    expect(document.title).toBe('Original');
  });

  it('should not restore title on unmount when restoreOnUnmount is false', () => {
    document.title = 'Original';

    const { unmount } = renderHook(() =>
      useDocumentTitle('Permanent', { restoreOnUnmount: false }),
    );
    expect(document.title).toBe('Permanent');

    unmount();
    expect(document.title).toBe('Permanent');
  });
});
