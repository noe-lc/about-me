import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
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
      <Route path='/about-me' render={props => {
        const { url, path } = props.match;
        return (
          <Router>
            <div className="main">
              <CoverLetter />
              <SocialMedia links={urls} />
              <hr key={console.log(props)}></hr>
              <FunctionLikeMenu>
                <Link to={`${path}/education`}>Education</Link>
                <Link to={`${path}/experience`}>Experience</Link>
                <Link to={`${path}/skills-and-languages`}>Skills & Languages</Link>
              </FunctionLikeMenu>
              <Switch>
                <Route path={`${url}/education`} exact>
                  <InfoContainer>
                    {getInfoElements(educationData,'institutionName')}
                  </InfoContainer>
                </Route>
                <Route path={`${url}/experience`}>
                  <InfoContainer>
                    {getInfoElements(experienceData,'companyName')}
                  </InfoContainer>
                </Route>
                <Route path={`${url}/skills-and-languages`}>
                  <InfoContainer>
                    {Object.entries(skillsLangData).map(([key,value]) => 
                      <SkInfo key={key} title={key[0].toUpperCase() + key.slice(1)} data={value} />
                    )}
                  </InfoContainer>
                </Route>
              </Switch>
            </div>
          </Router>
        )
      }
        
      }/>
    </Router>
    
  );
}

export default App;
