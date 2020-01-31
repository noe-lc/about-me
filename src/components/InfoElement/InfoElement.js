import React from 'react';
import './InfoElement.css';

export default (props) => {
  


  return (
    <div className='info-element'>
      <div className='icon-container'>
        <div className='icon'>
          <img src={`./icons/${props.icon}`}></img>
        </div>
      </div>
      <div className='info-container'>
        <h4>
          <span className='wrap highlight'>{props.programme}</span>
          <span className='wrap small'>{`(${props.term[0]} to ${props.term[1]})`}</span>
        </h4>
        <h4><span className='highlight'>Thesis topic:</span> "{props.thesisTopic}"</h4>
        <h4>
          <span className='wrap highlight'>{props.institutionName}</span>
          <span className='wrap small'>({props.location})</span>
        </h4>
      </div>
    </div>
  )
};

