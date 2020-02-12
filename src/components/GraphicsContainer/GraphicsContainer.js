import React, { useState, useEffect, useRef } from 'react';
import * as classMap from '../../classes/ClassMap';
import { fetchData } from '../../scripts/utils';
import './GraphicsContainer.css';

const Spinner = () => {
  return <div className='spinner'></div>
}

export default (props) => {
  const containerRef = useRef();
  const menuRef = useRef();
  const [state,setState] = useState({ isLoading: true });
  useEffect(() => {
    const abortController = new AbortController();
    const { signal } = abortController;
    const onGraphicsMount = async function() {
      const data = await fetchData(props.url,{ signal });
      if(!data) {
        return;
      }
      setState({ isLoading: false });
      const containers = { menu: menuRef.current, main: containerRef.current };
      const params = [containers,data,props,props.additionalData];
      const graphic = new classMap[props.class](...params);
      graphic.draw();
    };
    onGraphicsMount();
    return () => {
      abortController.abort();
    };
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
