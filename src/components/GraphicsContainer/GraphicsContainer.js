import React, { useEffect } from 'react';
import * as classMap from '../../classes/ClassMap';

const setDimensions = (props) => {

};

export default (props) => {
  for (const item in classMap) {
    console.log('item :', item);
  }
  console.log('classMap.initializeMap :', classMap.initializeMap);

  return (
    <div className='graphics-container'>
      
    </div>
  )
};
