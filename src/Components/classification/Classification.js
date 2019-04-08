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
      <div style={{ paddingBottom: '100px' }}>
        {this.state.histogram ? (
          <Intro histogram={this.state.histogram} />
        ) : (
          <div>Loading</div>
        )}
        {this.state.wrongPrediction ? (
          <Description
            data={this.state.wrongPrediction}
            precision={this.state.precision}
          />
        ) : (
          <div>Loading</div>
        )}
        {this.state.featureImportance ? (
          <DescriptionPart2 featureImportance={this.state.featureImportance} />
        ) : (
          <div>Loading</div>
        )}
        <DescriptionPart3 />
        <section id="model">
          <Search />
        </section>
      </div>
    );
  }
}
