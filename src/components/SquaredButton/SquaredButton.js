import React, { useLocation } from 'react';
import './SquaredButton.css';

const onClick = (fn) => {
  if(!fn || typeof fn !== 'function') {
    return null;
  }
  return fn;
}

export default (props) => {
  
  return (
    <div className='squared-btn' onClick={onClick(props.onClick)}>
      {props.text}
    </div>
  )
}

