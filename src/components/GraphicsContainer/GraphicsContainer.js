import React, { useEffect, useRef } from 'react';
import { csv, json, csvParse } from 'd3';
import { feature } from 'topojson';
import * as classMap from '../../classes/ClassMap';
import './GraphicsContainer.css';

const fetch = { csv, json };
const setDimensions = (props) => {

};

const fetchData = async (url = '') => {
  let data;
  const urlMembers = url.split('.');
  const extension = urlMembers[urlMembers.length - 1];

  if(!fetch[extension]) {
    console.warn('Invalid Extension');
    return null;
  }

  try {
    const res = await fetch[extension](url);
    if(res.type === 'Topology') {
      const firstKey = Object.keys(res.objects)[0];
      data = feature(res,res.objects[firstKey]);
    }
  } catch (err) {
    // TODO: make this component stateful and render a diff component
      // while rendering
    console.warn(err);
    data = null;
  }

  return data;  
};

export default (props) => {
  const containerRef = useRef();

  useEffect(() => {
    const fn = async function() {
      const data = await fetchData(props.url); // replace for props.url
      if(!data) {
        return;
      }
      const graphic = new classMap[props.class](containerRef.current,data,props);
      graphic.draw();
    }();
    
    
  },[]);

  return (
    <div ref={containerRef} className='graphics-container'>
      
    </div>
  )
};
