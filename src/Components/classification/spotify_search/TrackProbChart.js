import React, { Component } from 'react';
import * as d3 from 'd3';

const genre = ['classical', 'dance', 'jazz', 'rap', 'reggae', 'rock'];

class TrackProbChart extends Component {
  constructor(props) {
    super(props);
    this.createBarChart = this.createBarChart.bind(this);
  }

  async componentDidMount() {
    try {
      this.createBarChart();
    } catch (err) {
      console.error(err);
    }
  }

  createBarChart() {
    const { name } = this.props.track;
    const artist = this.props.track.artists[0].name;
    const node = this.node;
    const margin = { left: 80, right: 20, top: 50, bottom: 100 };
    const width = 1000 - margin.left - margin.right,
      height = 600 - margin.top - margin.bottom;

    const svg = d3
      .select(node)
      .classed('svg-container', true)
      .append('svg')
      .attr('preserveAspectRatio', 'xMinYMin meet')
      .attr('viewBox', '0 0 1000 600')
      .classed('svg-content-responsive', true);
    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);
    const xScale = d3
      .scaleBand()
      .domain(genre)
      .range([0, width])
      .padding(0.2);
    const yScale = d3
      .scaleLinear()
      .domain([0, 1])
      .range([height, 0]);
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
    const xAxisCall = d3.axisBottom(xScale).tickFormat(d => {
      return d;
    });
    xAxisGroup.call(xAxisCall);
    const yAxisCall = d3.axisLeft(yScale);
    yAxisGroup.call(yAxisCall);

    g.append('text')
      .attr('x', width / 2)
      .attr('y', height + 50)
      .attr('text-anchor', 'middle')
      .attr('fill', 'grey')
      .text('Genre');
    g.append('text')
      .attr('x', -(height / 2))
      .attr('y', -60)
      .attr('text-anchor', 'middle')
      .attr('transform', 'rotate(-90)')
      .attr('fill', 'grey')
      .text('Predicted Percentage');

    g.append('text')
      .attr('x', width / 2)
      .attr('y', 0 - margin.top / 2)
      .attr('text-anchor', 'middle')
      .attr('fill', 'grey')
      .style('text-decoration', 'underline')
      .text(`The Genre Probability for ${name} by ${artist}`);

    const bars = g.selectAll('rect').data(this.props.data);
    bars
      .enter()
      .append('rect')
      .attr('class', 'enter')
      .attr('fill', d => {
        return continentColor(d.genre);
      })
      .attr('x', d => {
        return xScale(d.genre);
      })
      .attr('y', d => yScale(0))
      .attr('width', d => xScale.bandwidth())
      .attr('height', d => height - yScale(0))
      .on('mouseover', function(d) {
        d3.select(this)
          .transition()
          .attr('width', 10 + xScale.bandwidth())
          .attr('x', xScale(d.genre) - 5);

        g.append('line')
          .attr('x1', xScale(d.genre))
          .attr('y1', yScale(d.value) + 1)
          .attr('x2', xScale(d.genre))
          .attr('y2', yScale(d.value) + 1)
          .attr('stroke', 'white')
          .attr('id', 'limit')
          .style('stroke-dasharray', '1%')
          .transition()
          .attr('x1', 0)
          .attr('x2', width);
      })
      .on('mouseout', function(d) {
        d3.select(this)
          .transition()
          .attr('width', xScale.bandwidth())
          .attr('x', xScale(d.genre));

        d3.select('#limit').remove();
      })
      .transition()
      .duration(720)
      .attr('x', d => {
        return xScale(d.genre);
      })
      .attr('y', d => yScale(d.value))
      .attr('width', d => xScale.bandwidth())
      .attr('height', d => height - yScale(d.value));

    const valuesGroup = g.append('g');
    valuesGroup
      .selectAll('text')
      .data(this.props.data)
      .enter()
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('class', 'value')
      .attr('x', d => {
        return xScale(d.genre) + xScale.bandwidth() / 2;
      })
      .attr('y', d => yScale(d.value) + 10)
      .attr('fill', 'white')
      .text(d => d.value)
      .transition()
      .duration(720)
      .attr('x', d => {
        return xScale(d.genre) + xScale.bandwidth() / 2;
      })
      .attr('y', d => {
        return yScale(d.value) - 10;
      })
      .text(d => {
        return Math.round(d.value * 100) / 100;
      });
  }

  render() {
    return (
      <div className="chart probs">
        <div ref={node => (this.node = node)} />
      </div>
    );
  }
}
export default TrackProbChart;
