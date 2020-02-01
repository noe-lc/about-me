import React, { useState } from 'react';
import './SkInfo.css';

export default (props) => {
  return (
    <div className={'info-element'}>
      <div className='icon-container'>
        <h2>{props.title}</h2>
      </div>
      <div className='info-container'>
        <h4>
          <span className='wrap highlight'>{}</span>
          <span className='wrap small'>{}</span>
        </h4>
        <h4>
          <span className='wrap highlight'>{}</span>
          <span className='wrap small'>({})</span>
        </h4>
      </div>
    </div>
  )
};

