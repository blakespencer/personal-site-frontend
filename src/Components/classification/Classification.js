import {
  Intro,
  Description,
  DescriptionPart2,
  Search,
  DescriptionPart3,
} from '.';
import React, { Component } from 'react';

export default class Classification extends Component {
  state = {};
  async componentDidMount() {
    try {
      const response = await fetch('/api/classification');
      const data = await response.json();
      const { featureImportance, histogram, precision, wrongPrediction } = data;
      this.setState({
        featureImportance,
        histogram,
        precision,
        wrongPrediction,
      });
    } catch (error) {
      console.log(error);
    }
  }
  render() {
    return (
      // <div style={{ paddingBottom: '100px' }}>
      <div>
        <Intro histogram={this.state.histogram} />
        <Description
          data={this.state.wrongPrediction}
          precision={this.state.precision}
        />
        <DescriptionPart2 featureImportance={this.state.featureImportance} />
        <DescriptionPart3 />
        <section id="model">
          <Search />
        </section>
      </div>
    );
  }
}
