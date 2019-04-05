import React, { Component } from 'react';
import { TopicChart, Word2VecChart, ComparingScore } from './';

export default class Pitchfork extends Component {
  render() {
    return (
      <div>
        <TopicChart />
        <ComparingScore />
        <Word2VecChart />
      </div>
    );
  }
}
