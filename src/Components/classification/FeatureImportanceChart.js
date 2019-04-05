import React, { Component } from 'react';
import * as d3 from 'd3';

const featuresNameObj = {
  danceability: 'Danceability',
  energy: 'Energy',
  acousticness: 'Acousticness',
  speechiness: 'Speechiness',
  valence: 'Valence',
  loudness: 'Loudness',
  instrumentalness: 'Instrumentalness',
  tempo: 'Tempo',
  end_of_fade_in: 'End of Fade-in',
  start_of_fade_out: 'Start of Fade-out',
  tempo_confidence: 'Tempo Confidence',
  liveness: 'Liveness',
  time_signature_confidence: 'Time Signature Confidence',
  time_signature: 'Time Signature',
};

export default class FeatureImportanceChart extends Component {
  constructor(props) {
    super(props);
    this.createBarChart = this.createBarChart.bind(this);
  }

  componentDidMount() {
    this.createBarChart(this.props.featureImportance);
  }

  createBarChart(dataRaw) {
    const data = dataRaw.sort((a, b) => a.importance - b.importance);
    data.forEach(el => {
      el.importance = Math.round(el.importance * 100) / 100;
    });
    const features = data.map(el => el.feature);
    const importance = data.map(el => Math.round(el.importance * 100) / 100);
    const node = this.node;
    const margin = { left: 200, right: 140, top: 50, bottom: 100 };
    const width = 1200 - margin.left - margin.right,
      height = 600 - margin.top - margin.bottom;
    const g = d3
      .select(node)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);
    const yScale = d3
      .scaleBand()
      .domain(features)
      .range([height, 0])
      .padding(0.2);
    const xScale = d3
      .scaleLinear()
      .domain([0, Math.max(...importance) + 0.01])
      .range([0, width]);
    const continentColor = d3.scaleOrdinal(d3.schemePastel1);
    const xAxisGroup = g
      .append('g')
      .attr('class', 'x axis')
      .style('font-size', '14')
      .attr('transform', `translate(0, ${height})`);
    const yAxisGroup = g
      .append('g')
      .attr('class', 'y axis')
      .style('font-size', '14');
    const xAxisCall = d3.axisBottom(xScale);
    const yAxisCall = d3.axisLeft(yScale).tickFormat(d => {
      return featuresNameObj[d];
    });
    yAxisGroup.call(yAxisCall);

    g.append('text')
      .attr('x', width / 2)
      .attr('y', height + 50)
      .attr('text-anchor', 'middle')
      .attr('fill', 'grey')
      .text('Relative Importance');
    g.append('text')
      .attr('x', -(height / 2))
      .attr('y', -150)
      .attr('text-anchor', 'middle')
      .attr('transform', 'rotate(-90)')
      .attr('fill', 'grey')
      .text('Features');

    g.append('text')
      .attr('x', width / 2)
      .attr('y', 0 - margin.top / 2)
      .attr('text-anchor', 'middle')
      .attr('fill', 'grey')
      .style('text-decoration', 'underline')
      .text(`Relative Feature Importance`);

    const bars = g.selectAll('rect').data(data);
    bars
      .enter()
      .append('rect')
      .attr('class', 'enter')
      .attr('fill', d => {
        return continentColor(d.feature);
      })
      .attr('x', d => {
        return xScale(0);
      })
      .attr('y', d => yScale(d.feature))
      .attr('width', d => {
        return xScale(d.importance);
      })
      .attr('height', d => yScale.bandwidth());

    xAxisGroup.call(xAxisCall);
    const valuesGroup = g.append('g');
    valuesGroup
      .selectAll('text')
      .data(data)
      .enter()
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('class', 'value')
      .attr('x', d => {
        return xScale(d.importance) + 32;
      })
      .attr('y', d => yScale(d.feature) + yScale.bandwidth() / 2 + 7)
      .attr('fill', 'white')
      .text(d => {
        if (d.importance === 0) {
          return '';
        }
        return Math.round(d.importance * 100) / 100;
      });
  }

  render() {
    return (
      <div className="chart feature-importance">
        <div ref={node => (this.node = node)} />
      </div>
    );
  }
}
