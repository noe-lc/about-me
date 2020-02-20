import React from 'react';
import '../GraphicsContainer/GraphicsContainer.css';

export default (props) => {
  const renderDescription = (Description) => {
    return Description ? (
      <div className='graphics-desc'>
        <Description/>
      </div>
    ) : null;
  };
  
  return (
    <div className='graphic-element'>
      <div className='graphics-container height-auto'>
        {props.content()}
      </div>
      {renderDescription(props.description)}
    </div>
  )

  
};
