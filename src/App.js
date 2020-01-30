import React from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import './App.css';
import CoverLetter from './components/CoverLetter';

function App() {
  return (
    <div className="main">
      <CoverLetter />
    </div>
  );
}

export default App;
