import React from 'react';
import './Collapsible.css';

export default (props) => {
  return (
    <div className='collapsible-parent'>
      <div className='header'>
        <h4 className='title'>{props.text}</h4>
        <button className='btn'></button>
      </div>
      <div className='collapsible collapsed'>
        {props.children}
      </div>
    </div>
    
  )
}

