import React, { useState } from 'react';
import './Collapsible.css';

export default (props) => {
  let classes = { header: 'header expanded', btn: 'btn btn-expanded', div: 'collapsible expanded' };
  let headerText = 'See less';
  const [state,setState] = useState({ collapsed: true });
  const collapse = () => {
    const collapsed = !state.collapsed;
    setState({ ...state, collapsed: collapsed });
    if(props.onCollapsedSet) props.onCollapsedSet(!collapsed);
  };

  if(state.collapsed) {
    headerText = 'See more'
    classes.header = 'header';
    classes.btn = 'btn btn-collapsed';
    classes.div = 'collapsible collapsed';
  }

  return (
    <div className='collapsible-parent' onClick={collapse}>
      <div className={classes.header}>
        <h4 className='title'>{headerText}</h4>
        <div className='btn-container'><button className={classes.btn}></button></div>
      </div>
      <div className={classes.div}>
        {props.children}
      </div>
    </div>
    
  )
}

