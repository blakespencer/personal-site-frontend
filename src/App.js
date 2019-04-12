import React, { Component } from 'react';
import './App.css';
import { NavBar, Home, FinalProject, Classification } from './Components';
import PitchFork from './Components/nlp/Pitchfork';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faFileAlt, faEnvelopeSquare } from '@fortawesome/free-solid-svg-icons';
import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons';

library.add(faGithub, faLinkedin, faFileAlt, faEnvelopeSquare);

class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <NavBar />
          <div id="content">
            <Route exact path="/" component={Home} />
            <Route exact path="/classification" component={Classification} />
            <Route exact path="/pitchfork" component={PitchFork} />
            <Route exact path="/finalProject" component={FinalProject} />
          </div>
          {/* <Footer /> */}
        </div>
      </Router>
    );
  }
}

export default App;
