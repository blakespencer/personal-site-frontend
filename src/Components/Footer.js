import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function Footer() {
  return (
    <footer
      style={{
        marginTop: '20px',
        paddingBottom: '10px',
        paddingTop: '10px',
        display: 'flex',
        position: 'fixed',
        bottom: '0px',
        backgroundColor: 'rgb(40, 44, 52)',
        width: '100%',
        justifyContent: 'center',
      }}
    >
      <div>Contact Me: </div>
      <a href="https://github.com/blakespencer/classifying-genre">
        <FontAwesomeIcon icon={['fab', 'github']} style={{ color: 'white' }} />
      </a>
      <a href="https://www.linkedin.com/in/blake-spencer/">
        <FontAwesomeIcon
          icon={['fab', 'linkedin']}
          style={{ color: 'white', marginLeft: ' 5px' }}
        />
      </a>
    </footer>
  );
}
