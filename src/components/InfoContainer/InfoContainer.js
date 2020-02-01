import React, { useRef, useEffect } from 'react';
import InfoElement from '../InfoElement/InfoElement';
import './InfoContainer.css';

const scrollTo = (element) => window.scrollTo({
  top: element.offsetTop,
  left: 0,
  behavior: 'smooth'
});

export default (data,keyProp) => {
    return (props) => {
      try {
        const infoRef = useRef(null);
        useEffect(() => {
          if(!infoRef.current) return;
          scrollTo(infoRef.current);
        },[]);

        return (
          <div ref={infoRef} className='info-container'>
            {data.map(d => {
              return <InfoElement key={d[keyProp]} {...d}/>
            })}
          </div>
        )
      } catch(e) {
        return <h1>Could not render this component!</h1>
      }
    }
    
};

