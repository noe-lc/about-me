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
  const [state,setState] = useState({ isLoading: true, failedToLoad: false });

  const renderDescription = (description) => {
    return description && !state.isLoading && !state.failedToLoad ? (
      <div className='graphic-desc'>
        {description()}
      </div>
    ) : null;
  };

  useEffect(() => {
    const abortController = new AbortController();
    const { signal } = abortController;
    const { url, rowConversion, settings, additionalData, setLoaded } =  props;
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
      const params = [containers,data,settings,additionalData];
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

  if(state.failedToLoad) {
    return <h1 className='empty-list'>Failed to load.</h1>
  }
  
  switch(props.class) {
    case 'OpeningHoursMap':
      return (
        <React.Fragment>
          <div className='graphics-container flex'>
            <div ref={menuRef} className='graphics-menu'></div>
            <div ref={containerRef} className='graphics-area ocean'></div>
          </div>
          {renderDescription(props.description)}
        </React.Fragment>
        

      )
    default:
      return (
        <React.Fragment>
          <div ref={containerRef} className='graphics-container'></div>
          {renderDescription(props.description)}
        </React.Fragment>
      )
  }
  
};
