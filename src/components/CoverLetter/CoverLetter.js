import React from 'react';
import './CoverLetter.css';

export default () => {
  return (
    <div className='cover-letter'>
      <div className='img-container'>
        <img src='./imgs/profile.jpg' alt="Author of this site" />
      </div>
      <div className="bio-container">
        <h1 className='greeting'>Hi!</h1>
        <p>
          My name is Noé Landaverde and I am a Mexican Geoinformatics Engineer.
          Although my profession is heavily oriented towards Geographic Information
          Systems and Cartography, my job experience and postgraduate education were
          focused more on the technological/visual aspect of its core: analysing & processing
          geographic information and developing web applications for visualization and
          cartographic purposes.
        </p>
        <p>
          I consider myself open-minded, versatile and very adaptable, as well
          as always looking forward to learning more and improving in all aspects possible.
        </p>
      </div>
    </div>
  )
}

