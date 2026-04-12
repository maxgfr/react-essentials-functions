import * as React from 'react';

export type ConditionalWrapperProps = {
  condition: boolean;
  wrapper: (children: React.ReactNode) => JSX.Element;
  children: React.ReactNode;
};

/**
 * Component that conditionally wraps its children with a wrapper component.
 *
 * @param condition - Whether to wrap the children
 * @param wrapper - Function that returns the wrapper element
 * @param children - Children to wrap
 *
 * @example
 * ```tsx
 * <ConditionalWrapper
 *   condition={!!link}
 *   wrapper={(children) => <a href={link}>{children}</a>}
 * >
 *   <button>Click me</button>
 * </ConditionalWrapper>
 * ```
 */
export const ConditionalWrapper = ({
  condition,
  wrapper,
  children,
}: ConditionalWrapperProps): JSX.Element =>
  condition ? wrapper(children) : <>{children}</>;
