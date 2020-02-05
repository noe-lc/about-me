import React from 'react';
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
              {d.list.map(e => {
                return(
                  <div key={e.name} className='portfolio-element'>
                    <h1>{e.name}</h1>
                    <div className={'graphic-element' + (d.name === 'Maps' ? ' graphic-element-map' : '')}>
                      <GraphicsContainer useParent={true} {...e}/>
                    </div>
                  </div>
                )
              })}
            </Route>
          )}
        </Switch>
      </div>
    </div>
    
  )
  
};
