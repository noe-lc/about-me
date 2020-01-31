import React, { useState } from 'react';
import './Collapsible.css';

export default (props) => {
  const [state,setState] = useState({ collapsed: true });
  let classes = { btn: 'btn', div: 'collapsible' };
  if(state.collapsed) {
    classes.btn = classes.btn + ' btn-collapsed';
    classes.div = classes.div + ' collapsed';
  }

  return (
    <div className='collapsible-parent'>
      <div className='header'>
        <h4 className='title'>{props.text}</h4>
        <button className={classes.btn}></button>
      </div>
      <div className={classes.div}>
        {props.children}
      </div>
    </div>
    
  )
}

