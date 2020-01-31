import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { urls, educationData, experienceData, skillsLangData } from './data/data';

import CoverLetter from './components/CoverLetter/CoverLetter';
import SocialMedia from './components/SocialMedia/SocialMedia';
import FunctionLikeMenu from './components/FunctionLikeMenu/FunctionLikeMenu';
import InfoContainer from './components/InfoContainer/InfoContainer';
//import ExpInfo from './components/ExpInfo/ExpInfo';
//import SkInfo from './components/SkInfo/SkInfo';

import './App.css';

function App(props) {
  return (
    <Router>
      <Route path='/' render={() => 
        <div className="main">
        <CoverLetter />
        <SocialMedia links={urls} />
        <hr></hr>
        <FunctionLikeMenu>
          <Link to='/education'>Education</Link>
          <Link to='/experience'>Experience</Link>
          <Link to='/skills-and-languages'>Skills and Languages</Link>
        </FunctionLikeMenu>
        <Switch>
          <Route path='/education' exact component={InfoContainer(educationData,'institutionName')}></Route>
          <Route path='/experience' exact component={InfoContainer(experienceData,'companyName')}></Route>
          <Route path='/skills-and-languages' exact component={InfoContainer(skillsLangData,'')}></Route>
        </Switch>
      </div>
      }/>
    </Router>
    
  );
}

export default App;
