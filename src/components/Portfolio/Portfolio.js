import React, { useEffect } from 'react';
import { Route, Link, Switch } from 'react-router-dom';
import GraphicsContainer from '../GraphicsContainer/GraphicsContainer';
import FixedContent from '../FixedGraphicsContent/FixedGraphicsContent';
import Message from '../Message/Message';
import makeCollapsible from '../MakeCollapsible/MakeCollapsible';
import { portfolioData } from '../../data/data';
import './Portfolio.css';

portfolioData.sort((a,b) => a.appearanceOrder - b.appearanceOrder);
const { path: defaultPath } = portfolioData[0];

export default (props) => {
  let { path, url } = props.match;
  const pathArray = props.history.location.pathname.split('/');
  const current = pathArray[pathArray.length - 1];
  url = url.slice(-1) === '/' ? url.slice(0,-1) : url;
  path = path.slice(-1) === '/' ? path.slice(0,-1) : path;

  useEffect(() => { props.history.push(`${url}/${defaultPath}`) },[]);

  const renderMessage = ({ message }) => {
    if(!message) return;
    const Collapsible = makeCollapsible(Message,null,message.type,'Click to expand this message');
    return <Collapsible {...message} />
  };

  const renderListElement = ({ type, ...rest }) => {
    switch(type) {
      case 'graphics':
        return <GraphicsContainer {...rest}/>;
      case 'fixed':
        return <FixedContent {...rest} />
      default:
        return null;
    }
  };

  const renderListElements = ({ list,name }) => {
    if(list.length == 0) {
      return <h1 className='empty-list'>Nothing to see here... yet.</h1> 
    }
    return list.map(e => {
      return (
        <div key={e.name} className='portfolio-element'>
          <h1 className='portfolio-element-title'>{e.name}</h1>
          {renderListElement(e)}
        </div>
      )
    })
  };

  return (
    <div className='portfolio-main'>
      <nav className="portfolio-nav">
        <Link className='back-to-main' to='/'>&#x2906; Back</Link>
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
              {renderMessage(d)}
              {renderListElements(d)}
            </Route>
          )}
        </Switch>
      </div>
    </div>
    
  )
  
};
