import React from 'react';
import './CoverLetter.css';

export default (props) => {
  const checkForFile = (url) => {
    
  };

  return(
    <div className='sc-icons'>
      {(props.links || []).map(link => 
        <a target="blank" href={link.url}>
          <img src="" alt={`Link to my ${link.name} page`}></img>
        </a>
      )}
    </div>
  )
}

