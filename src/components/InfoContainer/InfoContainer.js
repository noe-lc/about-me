import React, { useRef, useEffect } from 'react';
import './InfoContainer.css';

const scrollTo = (element) => window.scrollTo({
  top: element.offsetTop,
  left: 0,
  behavior: 'smooth'
});

export default (props) => {
    try {
      const infoRef = useRef(null);
      useEffect(() => {
        if(!infoRef.current) return;
        scrollTo(infoRef.current);
      },[]);

      return (
        <div ref={infoRef} className='info-container'>
          {props.children}
        </div>
      )
    } catch(e) {
      return <h1>Could not render this component!</h1>
    }
};

