import React from 'react';
import './SocialMedia.css';

export default (props) => {
  return(
    <div className='sc-icons'>
      {(props.links || []).map(link =>
        <a target='_blank' href={link.url} key={link.name} rel='noopener noreferrer'>
          <img
            className='icon' 
            src={`./icons/${link.name.toLowerCase()}.svg`} alt={`Link to my ${link.name} page`} />
        </a>
      )}
    </div>
  )
}

/**
 * Curriculul
 * <div>Icons made by 
 *  <a href="https://www.flaticon.com/authors/vectors-market" title="Vectors Market">
 *    Vectors Market
 *  </a> from 
 *  <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a>
 * </div>
 * 
 * LinkedIn
 * <div>Icons made by 
 *  <a href="https://www.flaticon.com/authors/freepik" title="Freepik">Freepik</a> 
 *  from 
 *  <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a>
 * </div>
 */

