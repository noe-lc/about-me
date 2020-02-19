import React, { useState, useEffect, useRef } from 'react';
import * as classMap from '../../classes/ClassMap';
import { fetchData } from '../../scripts/utils';
import './GraphicsContainer.css';

const Spinner = () => {
  return <div className='spinner' ></div>
};

export default (props) => {
  let graphic;
  const containerRef = useRef();
  const menuRef = useRef();
  const [descProps,setDescProps] = useState(null);
  const [state,setState] = useState({ isLoading: true, failedToLoad: false });

  const renderDescription = (Description) => {
    return Description && !state.isLoading && !state.failedToLoad ? (
      <div className='graphics-desc'>
        <Description descProps={descProps}/>
      </div>
    ) : null;
  };

  useEffect(() => { // data fetching
    const abortController = new AbortController();
    const { signal } = abortController;
    const { url, rowConversion, settings, additionalData } =  props;
    const onGraphicsMount = async function() {
      const data = await fetchData(url,{ signal },rowConversion);
      if(data instanceof Error) {
        if(!signal.aborted) {
          console.error(data);
          setState({ isLoading: false, failedToLoad: true });
        }
        return;
      }
      setState({ ...state, isLoading: false });
      const containers = { menu: menuRef.current, main: containerRef.current };
      const params = [containers,data,settings,additionalData,setDescProps];
      graphic = new classMap[props.class](...params);
      graphic.draw();
    };
    onGraphicsMount();
    return () => {
      abortController.abort();
    };
  },[]);

  useEffect(() => { // resizing based on media queries
    if(props.settings.resizeBy === 'method') {
      const mqls = [600,900,1200].map(width => window.matchMedia(`(max-width:${width}px)`));
      const resize = () => graphic.resize();
      mqls.forEach(m => m.addListener(resize));
      return () => {
        mqls.forEach(m => m.removeListener(resize));
      };
    }
  },[]);

  if(state.isLoading) {
    return <Spinner />;
  }

  if(state.failedToLoad) {
    return <h1 className='empty-list'>Failed to load.</h1>
  }
  
  switch(props.class) {
    case 'OpeningHoursMap':
      return (
        <div className={'graphic-element' /* + (name === 'Maps' ? ' graphic-element-map' : '')*/}>
          <div className='graphics-container flex'>
            <div ref={menuRef} className='graphics-menu'></div>
            <div ref={containerRef} className='graphics-area ocean'></div>
          </div>
          {renderDescription(props.description)}
        </div>
        
      )
    default:
      return (
        <div className='graphic-element'>
          <div ref={containerRef} className='graphics-container'></div>
          {renderDescription(props.description)}
        </div>
      )
  }
  
};
