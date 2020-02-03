import React from 'react';
import './Card.css';

export default (props) => {
  return (
    <div className='card'>
      {props.text}
    </div>
  )
};
