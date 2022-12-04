import React, { useEffect, useLayoutEffect, useState } from 'react';

export function useDimensions(targetRef: React.RefObject<HTMLElement>) {
  const getDimensions = () => {
    return {
      width: targetRef.current ? targetRef.current.offsetWidth : 0,
      height: targetRef.current ? targetRef.current.offsetHeight : 0,
    };
  };

  const [dimensions, setDimensions] = useState(getDimensions);

  const handleResize = () => {
    setDimensions(getDimensions());
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleResize);
    window.addEventListener('load', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleResize);
      window.addEventListener('load', handleResize);
    };
  }, []);

  useLayoutEffect(() => {
    handleResize();
  }, []);
  return dimensions;
}

// const targetRef = useRef() // then set a ref to your component
// const size = useDimensions(targetRef)
// ....
// return (div ref={targetRef}> .... <p>{size.width} - {size.height} </p> .... </div>);
