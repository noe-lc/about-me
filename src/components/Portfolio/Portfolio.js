import React, { useState } from 'react';
import { Route, Link, Switch } from 'react-router-dom';
import GraphicsContainer from '../GraphicsContainer/GraphicsContainer';
import { portfolioData } from '../../data/data';
import './Portfolio.css';


export default (props) => {
  let { path, url } = props.match;
  const pathArray = props.history.location.pathname.split('/');
  const current = pathArray[pathArray.length - 1];
  url = url.slice(-1) === '/' ? url.slice(0,-1) : url;
  path = path.slice(-1) === '/' ? path.slice(0,-1) : path;

  const renderListElements = ({ list,name }) => {
    if(list.length == 0) {
      return <h1 className='empty-list'>Nothing to see here... yet.</h1> 
    }
    return list.map(e => {
      return (
        <div key={e.name} className='portfolio-element'>
          <h1>{e.name}</h1>
          <GraphicsContainer {...e}/>
        </div>
      )
    })
  };

  return (
    <div className='portfolio-main'>
      <nav className="portfolio-nav">
        {portfolioData.map(d => 
          <Link key={d.name} className={current === d.path ? 'current-page' : ''} to={`${url}/${d.path}`}>
            {d.name}
          </Link>
        )}
      </nav>
      <div className='portfolio-content'>
        <Switch>
          {portfolioData.map(d => 
            <Route key={d.name} path={`${path}/${d.path}`}>
              {renderListElements(d)}
            </Route>
          )}
        </Switch>
      </div>
    </div>
    
  )
  
};
