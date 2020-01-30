import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { urls } from './data/data';

import CoverLetter from './components/CoverLetter/CoverLetter';
import SocialMedia from './components/SocialMedia/SocialMedia';
import FunctionLikeMenu from './components/FunctionLikeMenu/FunctionLikeMenu';

import './App.css';

function App(props) {
  return (
    <Router>
      <div className="main">
      <CoverLetter />
      <SocialMedia links={urls} />
      <hr></hr>
      <FunctionLikeMenu>
        <Link to='/education'>Education</Link>
        <Link to='/experience'>Experience</Link>
        <Link to='/skills-and-languages'>Skills and Languages</Link>
      </FunctionLikeMenu>
      <div className='info-container'>
        <Switch>
          <Route path='/education' render={() => <h1>Education</h1>}></Route>
          <Route path='/experience' render={() => <h1>Exp</h1>}></Route>
          <Route path='/skills-and-languages' render={() => <h1>Skillz</h1>}></Route>
        </Switch>
      </div>
    </div>
    </Router>
    
  );
}

export default App;
