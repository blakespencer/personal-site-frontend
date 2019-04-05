import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class NavBar extends Component {
  render() {
    return (
      <header id="navbar">
        {/* <Link className="link" to="/about">
          Thesis
        </Link> */}
        <Link className="link" to="/">
          Home
        </Link>
        <Link className="link" to="/classification">
          Classification
        </Link>
        {/* <Link className="link" to="/predict">
          Predict
        </Link> */}
        <Link className="link" to="/pitchfork">
          NLP Pitchfork
        </Link>
        {/* <Link className="link" to="/finalProject">
          Final Project
        </Link> */}
      </header>
    );
  }
}
