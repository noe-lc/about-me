import React from 'react';
import './SkInfo.css';

export default ({ title, data }) => {
  return (
    <div className={'info-element non-reverse'}>
      <div className='title-container'>
        <h2 className="list-title">{title}</h2>
      </div>
      <div className='info-container padding-left'>
        {data.map(d => <h3 key={d.name} className='code'>{d.name}</h3>)}
      </div>
    </div>
  )
};

