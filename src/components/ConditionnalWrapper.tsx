import * as React from 'react';

export type ConditionnalWrapperProps = {
  condition: boolean;
  wrapper: (children: React.ReactNode) => React.ReactNode;
  children: React.ReactNode;
};

export const ConditionalWrapper = ({
  condition,
  wrapper,
  children,
}: ConditionnalWrapperProps) => (condition ? wrapper(children) : children);

// <ConditionalWrapper
//      condition={link}
//      wrapper={children => <a href={link}>{children}</a>}
//    >
//     .....
//    </ConditionalWrapper>
