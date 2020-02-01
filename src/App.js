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
      <Route path='/' render={() => 
        <Router>
          <div className="main">
            <CoverLetter />
            <SocialMedia links={urls} />
            <hr></hr>
            <FunctionLikeMenu>
              <Link to='/education'>Education</Link>
              <Link to='/experience'>Experience</Link>
              <Link to='/skills-and-languages'>Skills & Languages</Link>
            </FunctionLikeMenu>
            <Switch>
              <Route path='/education' exact>
                <InfoContainer>
                  {getInfoElements(educationData,'institutionName')}
                </InfoContainer>
              </Route>
              <Route path='/experience'>
                <InfoContainer>
                  {getInfoElements(experienceData,'companyName')}
                </InfoContainer>
              </Route>
              <Route path='/skills-and-languages'>
                <InfoContainer>
                  {Object.keys(skillsLangData).map(key => {
                    return (

                      <SkInfo title={key[0].toUpperCase() + key.slice(1)}></SkInfo>
                      
                    )
                  })}
                </InfoContainer>
              </Route>
            </Switch>
          </div>
        </Router>
      }/>
    </Router>
    
  );
}

export default App;
