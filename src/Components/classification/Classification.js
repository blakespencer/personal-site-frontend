import {
  PredictionChart,
  HisogramChart,
  FeatureImportanceChart,
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
        <Intro />
        <div className="center-all charts">
          {this.state.histogram ? (
            <HisogramChart data={this.state.histogram} />
          ) : (
            <div>Loading</div>
          )}
        </div>
        <Description />
        <div className="center-all charts">
          {this.state.wrongPrediction ? (
            <PredictionChart
              data={this.state.wrongPrediction}
              precision={this.state.precision}
            />
          ) : (
            <div>Loading</div>
          )}
        </div>
        <DescriptionPart2 />
        <div className="center-all charts">
          {this.state.featureImportance ? (
            <FeatureImportanceChart
              featureImportance={this.state.featureImportance}
            />
          ) : (
            <div>Loading</div>
          )}
        </div>
        <DescriptionPart3 />
        <Search />
      </div>
    );
  }
}
