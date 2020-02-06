import React, { useState, useEffect, useRef } from 'react';
import * as classMap from '../../classes/ClassMap';
import { fetchData } from '../../utils/utils';
import './GraphicsContainer.css';

export default (props) => {
  const containerRef = useRef();
  const menuRef = useRef();
  const [state,setState] = useState({ isLoading: true });
  useEffect(() => {
    const graphicsMount = async function() {
      const data = await fetchData(props.url); // replace for props.url
      if(!data) {
        return;
      }
      setState({ isLoading: false });
      const containers = { menu: menuRef.current, main: containerRef.current };
      const params = [containers,data,props,props.additionalData];
      const graphic = new classMap[props.class](...params);
      graphic.draw();
    }();
    
    
  },[]);

  if(state.isLoading) {
    return <Spinner />;
  }
  
  switch(props.class) {
    case 'OpeningHoursMap':
      return (
        <div className='graphics-container flex'>
          <div ref={menuRef} className='graphics-menu'></div>
          <div ref={containerRef} className='graphics-area ocean'></div>
        </div>
      )
    default:
      return <div ref={containerRef} className='graphics-container'></div>
  }
  
};

const Spinner = () => {
  return (<div className='spinner'></div>)
}
