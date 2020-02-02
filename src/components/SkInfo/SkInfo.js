import React from 'react';
import './SkInfo.css';

const renderGraph = (level,color) => {
  if(!level) return;
  const domain = ['Aware','Novice','General Application','Intermediate','Advanced','Expert'];
  return (
    <div class='s-list'>
      {domain.map((e,i) => {
        let isAtLevel = i < (level - 1);
        return (<div 
          className={'graph-element' +  (isAtLevel ? ' filled' : '')} 
          style={{ backgroundColor: isAtLevel ? color : '' }}>
        </div>)
      })}
    </div>
  )
};

const renderSublist = (sublist) => {
  if(!sublist || sublist.length === 0) return;
  const text = sublist.join(', ');
  return (<p className='s-row-list'>{text}</p>)
}

export default ({ title, data }) => {
  return (
    <div className={'info-element non-reverse p85'}>
      <div className='title-container'>
        <h2 className="list-title">{title}</h2>
      </div>
      <div className='info-container padding-left'>
        {data.map(d => (
          <div className='flex-container'>
            <h3 key={d.name} className='s-name code' style={{ color: d.color }}>{d.name}</h3>
            {renderGraph(d.level,d.color)}
            {renderSublist(d.sublist)}
          </div>
          
          )
        )}
      </div>
    </div>
  )
};

