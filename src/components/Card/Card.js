import React from 'react';
import './Card.css';
import { validateFn } from '../../utils/utils';

export default (props) => {
  return (
    <div className='card' onClick={validateFn(props.onClick)}>
      <h1 className='card-title bottom-right'>
        {props.text}
      </h1>
    </div>
  )
};
