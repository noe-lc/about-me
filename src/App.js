import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from 'react-router-dom';
import { urls, educationData, experienceData, skillsLangData } from './data/data';

import CoverLetter from './components/CoverLetter/CoverLetter';
import SocialMedia from './components/SocialMedia/SocialMedia';
import FunctionLikeMenu from './components/FunctionLikeMenu/FunctionLikeMenu';
import InfoContainer from './components/InfoContainer/InfoContainer';
import InfoElement from './components/InfoElement/InfoElement';
import SkInfo from './components/SkInfo/SkInfo';

import './App.css';

const getInfoElements = (data,keyProp) => {
  return data.map(d => <InfoElement key={d[keyProp]} {...d}/>)
};

function App(props) {
  return (
    <Router>
      <Switch>
        <Route path='/about-me' component={aboutMe}/>
      </Switch>
    </Router>
    
  );
}

const aboutMe = props => {
  let { url, path } = props.match;
  url = url.slice(-1) === '/' ? url.slice(0,-1) : url;
  path = path.slice(-1) === '/' ? path.slice(0,-1) : path;
  return (
    <Router>
      <div className="main">
        <CoverLetter />
        <SocialMedia links={urls} />
        <hr key={console.log(props)}></hr>
        <FunctionLikeMenu>
          <Link to={`${url}/education`}>Education</Link>
          <Link to={`${url}/experience`}>Experience</Link>
          <Link to={`${url}/skills-and-languages`}>Skills & Languages</Link>
        </FunctionLikeMenu>
        <div>
          <Switch>
            <Route exact path={`${path}/education`}>
              <InfoContainer>
                {getInfoElements(educationData,'institutionName')}
              </InfoContainer>
            </Route>
            <Route exact path={`${path}/experience`}>
              <InfoContainer>
                {getInfoElements(experienceData,'companyName')}
              </InfoContainer>
            </Route>
            <Route exact path={`${path}/skills-and-languages`}>
              <InfoContainer>
                {Object.entries(skillsLangData).map(([key,value]) => 
                  <SkInfo key={key} title={key[0].toUpperCase() + key.slice(1)} data={value} />
                )}
              </InfoContainer>
            </Route>
          </Switch>
        </div>
      </div>
    </Router>
  )
} 

export default App;
