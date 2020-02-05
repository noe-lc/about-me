import React, { useEffect, useRef } from 'react';
import * as classMap from '../../classes/ClassMap';
import { fetchData } from '../../utils/utils';
import './GraphicsContainer.css';

// TODO: make this component stateful and render a diff component
// while rendering

export default (props) => {
  const containerRef = useRef();
  useEffect(() => {
    const fn = async function() {
      const data = await fetchData(props.url); // replace for props.url
      if(!data) {
        return;
      }
      const graphic = new classMap[props.class](containerRef.current,data,props,props.additionalData);
      graphic.draw();
    }();
    
    
  },[]);
  
  switch(props.class) {
    case 'OpeningHoursMap':
      return (
        <div className='graphics-container flex'>
          <div className='graphics-menu'></div>
          <div ref={containerRef} className='graphics-area ocean'></div>
        </div>
      )
    default:
      return <div ref={containerRef} className='graphics-container'></div>
  }
  
};
