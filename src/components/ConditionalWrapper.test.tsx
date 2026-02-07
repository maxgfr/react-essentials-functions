import { render } from '@testing-library/react';
import { ConditionalWrapper } from './ConditionnalWrapper';

describe('ConditionalWrapper', () => {
  it('should wrap children when condition is true', () => {
    const { container } = render(
      <ConditionalWrapper
        condition={true}
        wrapper={(children) => <a href="/test">{children}</a>}
      >
        <span>Child content</span>
      </ConditionalWrapper>,
    );

    const link = container.querySelector('a');
    expect(link).toBeInTheDocument();
    expect(link).toHaveTextContent('Child content');
  });

  it('should not wrap children when condition is false', () => {
    const { container } = render(
      <ConditionalWrapper
        condition={false}
        wrapper={(children) => <a href="/test">{children}</a>}
      >
        <span>Child content</span>
      </ConditionalWrapper>,
    );

    const link = container.querySelector('a');
    expect(link).not.toBeInTheDocument();

    const span = container.querySelector('span');
    expect(span).toBeInTheDocument();
    expect(span).toHaveTextContent('Child content');
  });

  it('should pass children to wrapper function', () => {
    const wrapperFn = jest.fn((children) => (
      <div data-testid="wrapped">{children}</div>
    ));

    render(
      <ConditionalWrapper condition={true} wrapper={wrapperFn}>
        <span>Child content</span>
      </ConditionalWrapper>,
    );

    expect(wrapperFn).toHaveBeenCalledWith(<span>Child content</span>);
  });

  it('should handle multiple children', () => {
    const { container } = render(
      <ConditionalWrapper
        condition={true}
        wrapper={(children) => <div className="wrapper">{children}</div>}
      >
        <span>First</span>
        <span>Second</span>
        <span>Third</span>
      </ConditionalWrapper>,
    );

    const wrapper = container.querySelector('.wrapper');
    expect(wrapper?.children.length).toBe(3);
  });

  it('should handle null children', () => {
    const { container } = render(
      <ConditionalWrapper
        condition={true}
        wrapper={(children) => <div className="wrapper">{children}</div>}
      >
        {null}
      </ConditionalWrapper>,
    );

    const wrapper = container.querySelector('.wrapper');
    expect(wrapper).toBeInTheDocument();
    expect(wrapper?.childNodes.length).toBe(0);
  });
});
