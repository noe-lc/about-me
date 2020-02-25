import React, { useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { urls, educationData, experienceData, skillsLangData } from './data/resume';


import CoverLetter from './components/CoverLetter/CoverLetter';
import SocialMedia from './components/SocialMedia/SocialMedia';
import FunctionLikeMenu from './components/FunctionLikeMenu/FunctionLikeMenu';
import InfoContainer from './components/InfoContainer/InfoContainer';
import InfoElement from './components/InfoElement/InfoElement';
import SkInfo from './components/SkInfo/SkInfo';
import SquaredButton from './components/SquaredButton/SquaredButton';
//import CardList from './components/CardList/CardList';
import Portfolio from './components/Portfolio/Portfolio';

import './App.css';
import './components/FunctionLikeMenu/FunctionLikeMenu.css';

const getInfoElements = (data,keyProp) => {
  return data.map(d => <InfoElement key={d[keyProp]} {...d}/>)
};

function App(props) {
  return (
    <Router basename={process.env.PUBLIC_URL}>
      <Switch>
        <Route path={'/portfolio'} component={Portfolio}/>
        <Route path={'/'} component={AboutMe}/>
        {/*<Route render={(props) => <SquaredButton/>}/> No match component? */} 
      </Switch>
      
    </Router>
  );
}

const AboutMe = props => {
  let { url, path } = props.match;
  url = url.slice(-1) === '/' ? url.slice(0,-1) : url;
  path = path.slice(-1) === '/' ? path.slice(0,-1) : path;

  useEffect(() => props.history.push('/skills-and-languages'),[]); // "redirect"

  return (
    <div className="main">
      <CoverLetter />
      <SocialMedia links={urls}>
        <SquaredButton text="See portfolio" onClick={() => props.history.push(`${url}/portfolio`) } />
      </SocialMedia>
      <hr></hr>
      <FunctionLikeMenu>
        <Link to={`${url}/skills-and-languages`}>Skills & Languages</Link>
        <Link to={`${url}/experience`}>Experience</Link>
        <Link to={`${url}/education`}>Education</Link>
      </FunctionLikeMenu>
      <Switch>
        <Route exact path={`${path}/`}>
          <p className='comment'>// Select a parameter value</p>
        </Route>
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
          <InfoContainer scrollOnMount={false}>
            {Object.entries(skillsLangData).map(([key,value]) => 
              <SkInfo key={key} title={key[0].toUpperCase() + key.slice(1)} data={value} />
            )}
          </InfoContainer>
        </Route>
      </Switch>
      <div className='function-menu'>
        <h2 style={{textAlign:'left'}}>{'};'}</h2>
      </div>
    </div>
  )
} 

export default App;
