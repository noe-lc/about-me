import React from 'react';
import './SquaredButton.css';
import { validateFn } from '../../scripts/utils';

export default (props) => {
  return (
    <div className='squared-btn' onClick={validateFn(props.onClick)}>
      {props.text}
    </div>
  )
}

