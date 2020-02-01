import React, { useState } from 'react';
import './SkInfo.css';

export default ({ title, data }) => {
  console.log('data :', data);
  return (
    <div className={'info-element non-reverse'}>
      <div className='icon-container'>
        <h2 class="list-title">{title}</h2>
      </div>
      <div className='info-container padding-left'>
        {data.map(d => <h3 className='code'>{d.name}</h3>)}
      </div>
    </div>
  )
};

