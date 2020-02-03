import React from 'react';
import Card from '../Card/Card';
import './Portfolio.css';

const portfolioList = ['Maps','Graphs & Charts','Web Apps'];

export default (props) => {
  const height = document.body.clientHeight;
  console.log(height);
  return (
    <div className='card-container'>
      {portfolioList.map(e => {
        return (
          <Card text={e}></Card>
        )}
      )}
    </div>
  )
  
};
