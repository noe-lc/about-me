import React, { } from 'react';
import InfoElement from '../InfoElement/InfoElement';
import './InfoContainer.css';

export default (data,keyProp) => {
    return () => {
      try {
        return (
          <div className='info-container'>
            {data.map(d => <InfoElement key={d[keyProp]} {...d}/>)}
          </div>
        )
      } catch(e) {
        return <h1>Could not render this component!</h1>
      }
    }
  
  
  
};

