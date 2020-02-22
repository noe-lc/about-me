import React, { useState } from 'react';
import '../Collapsible/Collapsible.css';
import '../MakeCollapsible/MakeCollapsible.css';

export default (Component,style = {},className,text) => props => {
  const [collapsed,setCollapsed] = useState(true);
  return  (
    <div 
      className={`${collapsed ? 'make-collapsible collapsed' : 'make-collapsible expanded'}`}
      style={style}
      onClick={() => setCollapsed(!collapsed)}
    >
      <div className={className} style={{...style}}>{text || 'Click to expand'}</div>
      <Component {...props} />
    </div>
  )
};