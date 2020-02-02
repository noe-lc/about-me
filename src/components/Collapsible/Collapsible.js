import React, { useState } from 'react';
import './Collapsible.css';

export default (props) => {
  let classes = { header: 'header expanded', btn: 'btn btn-expanded', div: 'collapsible expanded' };
  let headerText = props.headerText || 'See less';
  let imgUrl = 'url(./icons/expand.svg)';
  const [state,setState] = useState({ collapsed: true });
  const collapse = () => {
    const collapsed = !state.collapsed;
    setState({ ...state, collapsed: collapsed });
    if(props.onCollapsedSet) props.onCollapsedSet(!collapsed);
  };

  if(state.collapsed) {
    headerText = props.headerText || 'See more';
    classes.header = 'header';
    classes.btn = 'btn btn-collapsed';
    imgUrl = 'url(./icons/collapse.svg)';
    classes.div = 'collapsible collapsed';
  }

  return (
    <div className='collapsible-parent' onClick={collapse}>
      <div className={classes.header}>
        <h4 className='title'>{headerText}</h4>
        <div className='btn-container'>
          <button className={classes.btn} style={{backgroundImage:''}}></button>
        </div>
      </div>
      <div className={classes.div}>
        {props.children}
      </div>
    </div>
    
  )
}

