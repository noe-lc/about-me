import React, { useRef, useEffect } from 'react';
import './InfoContainer.css';

const scrollTo = (element) => window.scrollTo({
  top: element.offsetTop,
  left: 0,
  behavior: 'smooth'
});

export default ({ children,scrollOnMount }) => {
  const scroll = typeof scrollOnMount == 'boolean' ? scrollOnMount : true;
  try {
    const infoRef = useRef(null);
    useEffect(() => {
      if(!infoRef.current || !scroll) return;
      scrollTo(infoRef.current);
    },[]);

    return (
      <div ref={infoRef} className='info-container'>
        {children}
      </div>
    )
  } catch(e) {
    return <h1>Could not render this component!</h1>
  }
};

