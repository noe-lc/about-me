import React from 'react';
import Card from '../Card/Card';
import { portfolioData } from '../../data/data';

import './CardList.css';

const sendToSection = (history,url,path) => () => {
  history.push(`${url}/${path}`)
};

export default (props) => {
  const height = document.body.clientHeight;
  const { url } = props.match;

  return (
    <div className='card-container' style={{height: height + 'px'}}>
      {portfolioData.map(d => {
        return (
          <Card text={d.name} onClick={sendToSection(props.history,url,d.path)}></Card>
        )}
      )}
    </div>
  )
  
};
