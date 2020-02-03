import React, { useState } from 'react';
import Collapsible from '../Collapsible/Collapsible';
import './InfoElement.css';

const includeThesisTopic = (thesisTopic) => {
  return thesisTopic ? <h4><span className='highlight'>Thesis topic:</span> "{thesisTopic}"</h4> : null;
};

const renderJobDetails = (description,details,onCollapsedSet) => {
  return description && details ? 
    (
      <React.Fragment>
        <h4 className='description'>{description}</h4>
        {
          details && details.length > 0 ? 
            <Collapsible 
              onCollapsedSet={onCollapsedSet} 
              headerText={['See more details', 'See less']}
            >
              <ol className='details-list'>
                {details.map((d,i) => <li key={''+i + d[i]} className='small'>{d}</li>)}
              </ol>
            </Collapsible> : null
        }
        
      </React.Fragment>
    ) : null;
};


export default (props) => {
  const { title, programme, term, thesisTopic, 
    companyName, institutionName, city, description, details } = props;
  const [state,setState] = useState({ selected: false });
  const onCollapsedSet = (bool) => {
    setState({ ...state, selected: bool });
  };
  
  return (
    <div className={'info-element' + (state.selected ? ' selected' : '')}>
      <div className='icon-container'>
        <div className='icon'>
          <img src={`./icons/${props.icon}.png`}
            alt={`Icon of the insitution or company named ${companyName || institutionName}`}></img>
        </div>
      </div>
      <div className='info-container'>
        <h4>
          <span className='wrap highlight'>{title || programme}</span>
          <span className='wrap small'>{`(${term[0]} to ${term[1]})`}</span>
        </h4>
        {includeThesisTopic(thesisTopic)}
        <h4>
          <span className='wrap highlight'>{companyName || institutionName}</span>
          <span className='wrap small'>({city})</span>
        </h4>
        {renderJobDetails(description,details,onCollapsedSet)}
      </div>
    </div>
  )
};

