import React from 'react';
import { messageIcons } from './messageIcons';
import './Message.css';


export default ({ type, text }) => {
  const className = 'message ' + (type || '');
  console.log('type, text :', type, text);
  const iconData = messageIcons(type);
  switch(type) {
    case 'warning':
      return (
        <div className={className}>
          {iconData ? 
            <a href={iconData.href} title={iconData.title}>
              <img src={iconData.src} className='message-icon'/>
            </a> : null
          }
          {text}
        </div>
      );
    default:
      return null;
  }
};

