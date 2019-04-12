import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default class NavBar extends Component {
  render() {
    return (
      <header id="navbar">
        <ul className="container" style={{ listStyle: 'none' }}>
          <li>
            <Link className="link" to="/">
              Home
            </Link>
          </li>
          <li>
            <Link className="link" to="/classification">
              Classification
            </Link>
          </li>
          <li>
            <Link className="link" to="/pitchfork">
              NLP
            </Link>
          </li>
        </ul>
        <ul className="container" style={{ listStyle: 'none' }}>
          <li>Contact Me: </li>
          <li>
            <a href="https://github.com/blakespencer/" className="contact-link">
              <FontAwesomeIcon icon={['fab', 'github']} />
            </a>
          </li>
          <li>
            <a
              href="https://www.linkedin.com/in/blake-spencer/"
              className="contact-link"
            >
              <FontAwesomeIcon icon={['fab', 'linkedin']} />
            </a>
          </li>
          <li>
            <a
              href="/Blake_Spencer_resume_03_20.pdf"
              download
              className="contact-link"
            >
              <FontAwesomeIcon icon={['fas', 'file-alt']} />
            </a>
          </li>
          <li>
            <a href="mailto:blake.spencer1@gmail.com" className="contact-link">
              <FontAwesomeIcon
                icon={['fas', 'envelope-square']}
                style={{ marginRight: '15px' }}
              />
            </a>
          </li>
        </ul>
      </header>
    );
  }
}
