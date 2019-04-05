import React, { Component } from 'react';
import * as d3 from 'd3';

export default class ComparingScore extends Component {
  state = {
    data: [],
  };

  async componentDidMount() {
    try {
      const res = await fetch(`/api/comparingscore`);
      const data = await res.json();
      this.setState({ data });
    } catch (error) {
      console.log(error);
    }
  }

  componentDidUpdate() {
    this.createBars(this.state.data);
  }

  createBars = rawData => {
    const node = this.node;
    const formatData = data => {
      const output = [];
      const topics = [
        'Artist',
        'History/Context',
        'Sound',
        'Opinion/Interpretation',
      ];
      data.forEach(row => {
        let sum = row['Opinion/Interpretation'];
        row.Sound += sum;
        sum = row.Sound;
        row['History/Context'] += sum;
        sum = row['History/Context'];
        row.Artist += sum;
      });
      return data;
    };
    const data = formatData(this.state.data);
    const topics = [
      'Artist',
      'History/Context',
      'Sound',
      'Opinion/Interpretation',
    ];
    const genres = data.map(el => el.genre);
    const margin = { left: 80, right: 100, top: 50, bottom: 100 };
    const width = 1000 - margin.left - margin.right,
      height = 600 - margin.top - margin.bottom;

    // Creating Canvas
    const g = d3
      .select(node)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Creating Labels
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
      .text('How Topics with Exream Scores Differ');
    const types = this.state.data.map(el => el.type);
    // Creating Scales
    const xScale = d3
      .scaleBand()
      .domain(types)
      .range([0, width])
      .padding(0.2);
    const yScale = d3
      .scaleLinear()
      .domain([0, 1])
      .range([height, 0]);
    const continentColor = d3.scaleOrdinal(d3.schemePastel1);

    // Creating Axis
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

    // Creating Bars for Sound

    topics.forEach(topic => {
      const bars = g
        .append('g')
        .selectAll('rect')
        .data(data);
      bars
        .enter()
        .append('rect')
        .attr('class', 'enter')
        .attr('fill', (d, i) => {
          return continentColor(topic);
        })
        .attr('x', d => {
          return xScale(d.type);
        })
        .attr('y', d => {
          return yScale(d[topic]);
        })
        .attr('width', d => xScale.bandwidth())
        .attr('height', d => {
          return height - yScale(d[topic]);
        })
        .on('mouseover', function(d) {
          if (topic === 'History/Context') {
            topic = 'History';
          }
          if (topic === 'Opinion/Interpretation') {
            topic = 'Opinion';
          }
          const colorBlock = d3.select(`#legend-${topic}1`);
          colorBlock.attr('fill', 'white');
        })
        .on('mouseout', function(d) {
          const colorBlock = d3.select(`#legend-${topic}1`);
          colorBlock.attr('fill', 'rgba(255,255,255,0.5)');
        });
    });

    const legend = g
      .append('g')
      .attr('class', 'legend-pitchfork')
      .attr('height', 100)
      .attr('width', 100);

    legend
      .selectAll('rect')
      .data(topics)
      .enter()
      .append('rect')
      .attr('x', width - 10)
      .attr('y', (d, i) => 22 + i * 10)
      .attr('width', 5)
      .attr('height', 8)
      .style('fill', function(d) {
        return continentColor(d);
      });

    legend
      .selectAll('text')
      .data(topics)
      .enter()
      .append('text')
      .attr('fill', 'rgba(255,255,255,0.5)')
      .attr('text-anchor', 'start')
      .attr('x', width - 0)
      .style('font-size', 12)
      .attr('id', d => {
        if (d === 'History/Context') {
          d = 'History';
        }
        if (d === 'Opinion/Interpretation') {
          d = 'Opinion';
        }
        return `legend-${d}1`;
      })
      .attr('y', (d, i) => 30 + i * 10)
      .text(function(d) {
        return d;
      });
  };

  render() {
    return (
      <div
        className="pitchfork-chart"
        ref={node => (this.node = node)}
        style={{ paddingTop: '30vh', paddingBottom: '15vh' }}
      />
    );
  }
}
