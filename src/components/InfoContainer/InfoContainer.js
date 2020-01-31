import React from 'react';
import InfoElement from '../InfoElement/InfoElement';
import './InfoContainer.css';

export default (data,keyProp) => {
  return () => {
    return (
      <div className='info-container'>
        {data.map(d => <InfoElement key={d[keyProp]} {...d}/>)}
      </div>
    )
  }
  
};

