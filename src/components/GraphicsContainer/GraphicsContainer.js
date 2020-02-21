import React, { useState, useEffect, useRef } from 'react';
import * as classMap from '../../classes/ClassMap';
import { fetchData } from '../../scripts/utils';
import './GraphicsContainer.css';

const Spinner = () => {
  return <div className='spinner' ></div>
};

export default (props) => {
  const containerRef = useRef();
  const menuRef = useRef();
  const { settings, additionalData, url, rowConversion, class: className } = props;
  const [descProps,setDescProps] = useState(null);
  const [state,setState] = useState({ 
    isLoading: true, 
    failedToLoad: false,
    data: null,
    graphic: null 
  });

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
    const onGraphicsMount = async function() {
      const data = await fetchData(url,{ signal },rowConversion);
      if(data instanceof Error) {
        if(!signal.aborted) {
          console.error(data);
          setState({ isLoading: false, failedToLoad: true });
        }
        return;
      }
      setState(s => ({ ...s, isLoading: false, data }));
    };
    onGraphicsMount();
    return () => {
      abortController.abort();
    };
  },[]);

  useEffect(() => { // resizing based on media queries
    if(props.settings.resizeBy === 'method') {
      const mqls = [600,900,1200].map(width => window.matchMedia(`(max-width:${width}px)`));
      const resize = () => state.graphic.resize();
      mqls.forEach(m => m.addListener(resize));
      return () => {
        mqls.forEach(m => m.removeListener(resize));
      };
    }
  },[]);

  useEffect(() => { // render graphic
    if(!state.data) return;
    const containers = { menu: menuRef.current, main: containerRef.current };
    const params = [containers,state.data,settings,additionalData,setDescProps];
    const graphic = new classMap[className](...params);
    graphic.draw();
    setState(s => ({ ...s, graphic }));
  },[state.data]);

  /* Rendering */
  if(state.isLoading) {
    return <Spinner />;
  }

  if(state.failedToLoad) {
    return <h1 className='empty-list'>Failed to load.</h1>
  }
  
  switch(props.class) {
    case 'OpeningHoursMap':
      return (
        <div className={'graphics-element' /* + (name === 'Maps' ? ' graphic-element-map' : '')*/}>
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
