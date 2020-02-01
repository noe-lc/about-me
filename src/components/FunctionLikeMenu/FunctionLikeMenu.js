import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import './FunctionLikeMenu.css';

const languages = ['JavaScript','Python'];

export default (props) => {
  const [state,setState] = useState({ language: languages[0] });
  console.log(props.match);
  const renderChildren = () => {
    return React.Children.map(props.children,child => {
      let { children, to } = child.props;
      if(typeof children == 'string') {
        const props = useLocation().pathname == to ? 
          { className: 'selected', children: `'${children}'` } : {children: `/*${children}*/` };
        return React.cloneElement(child,props);
      }
      return child;
    });
  }; 

  switch(state.language) {
    case languages[0]:
      return (
        <div className='function-menu'>
          <h2>
            {/*<span className='var-keyword'>const </span> */}
            <span className='variable'>getMoreInfo</span>({renderChildren()}) 
            => {'{'} 
          </h2>
        </div>
      );
    case languages[1]:
      return (
        <div>Py</div>
      );
    default:
      return (
        <div></div>
      );
  };
};

