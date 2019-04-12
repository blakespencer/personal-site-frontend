import React, { Component } from 'react';
import * as d3 from 'd3';
import Select from 'react-select';
import {
  histClick,
  histHover,
  hexToRgb,
  features,
  featureNames,
  genreArray,
  selectStyles,
} from './d3CustomFuncs';

export default class HistogramChart extends Component {
  state = {
    data: {},
    select: 'danceability',
  };

  componentDidMount() {
    const d3Info = this.createLineChart();
    this.setState({ data: this.props.data, d3Info });
  }

  componentDidUpdate() {
    this.updateLineChart();
  }

  handleChange = evt => {
    this.setState({ select: evt.value });
  };

  cleanData = (data, select) => {
    const genres = Object.keys(data);
    const output = {};
    for (let i = 0; i < genres.length; i++) {
      const genre = genres[i];
      const y = data[genre].y;
      const x = data[genre].x;
      let genreData = [{ x: 0, y: 0 }];
      if (select === 'loudness') {
        genreData = [];
      }
      for (let j = 0; j < y.length; j++) {
        const tempObj = {};
        tempObj.y = y[j];
        tempObj.x = x[j];
        genreData.push(tempObj);
      }
      const allX = genreData.map(el => el.x);
      genreData.push({ x: Math.max(...allX) + 0.05, y: 0 });
      output[genres[i]] = genreData;
    }
    return output;
  };

  createLineChart = () => {
    const { select } = this.state;
    const node = this.node;
    const t = d3.transition().duration(200);
    const margin = { left: 55, right: 20, top: 50, bottom: 50 };
    const width = 900 - margin.left - margin.right,
      height = 540 - margin.top - margin.bottom;

    const svg = d3
      .select(node)
      .classed('svg-container', true)
      .append('svg')
      .attr('preserveAspectRatio', 'xMinYMin meet')
      .attr('viewBox', '0 0 900 540')
      .classed('svg-content-responsive', true);

    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const xScale = d3.scaleLinear().range([1.5, width]);
    xScale.domain([0, 1]);
    const yScale = d3.scaleLinear().range([height, 0]);
    yScale.domain([0, 10]);
    const continentColor = d3.scaleOrdinal(d3.schemePastel1);
    // const xAxisGroup = g
    //   .append('g')
    //   .attr('class', 'x axis')
    //   .attr('transform', `translate(0, ${height})`);
    const yAxisGroup = g.append('g').attr('class', 'y axis');
    // const xAxisCall = d3.axisBottom(xScale).tickFormat(d => d);
    // xAxisGroup.call(xAxisCall);
    const yAxisCall = d3.axisLeft(yScale);
    yAxisGroup.call(yAxisCall);

    const xLabel = g
      .append('text')
      .attr('x', width / 2)
      .attr('y', height + 40)
      .attr('text-anchor', 'middle')
      .attr('fill', 'grey')
      .text(select);
    const yLabel = g
      .append('text')
      .attr('x', -(height / 2))
      .attr('y', -40)
      .attr('text-anchor', 'middle')
      .attr('transform', 'rotate(-90)')
      .attr('fill', 'grey')
      .text('Percentage');

    g.append('text')
      .attr('x', width / 2)
      .attr('y', 0 - margin.top / 2)
      .attr('text-anchor', 'middle')
      .attr('fill', 'grey')
      .style('text-decoration', 'underline')
      .text('Distribution for Genres');

    const dataFeature = this.props.data[select];
    const dataClean = this.cleanData(dataFeature, select);
    const line = d3
      .line()
      .x(function(d) {
        return xScale(d.x);
      })
      .y(function(d) {
        return yScale(d.y);
      })
      .curve(d3.curveMonotoneX);
    function drawLines() {
      genreArray.forEach(el => {
        g.append('path')
          .datum(dataClean[el])
          .attr('fill', () => {
            const colour = continentColor(el);
            const { r, g, b } = hexToRgb(colour);
            return `rgba(${r}, ${g}, ${b}, 0.5)`;
          })
          .attr('stroke', () => {
            const colour = continentColor(el);
            const { r, g, b } = hexToRgb(colour);
            return `rgba(${r}, ${g}, ${b}, 0.8)`;
          })
          .attr('stroke-linejoin', 'round')
          .attr('stroke-linecap', 'round')
          .attr('stroke-width', 1.5)
          .attr('d', line)
          .attr('id', `line-${el}`)
          .attr('class', 'genre-line')
          .on('mouseover', function(d) {
            d3.select(this).attr('stroke', () => {
              const colour = continentColor(el);
              const { r, g, b } = hexToRgb(colour);
              return `rgba(${r}, ${g}, ${b}, 1)`;
            });
          })
          .on('mouseout', function(d) {
            d3.select(this).attr('stroke', () => {
              const colour = continentColor(el);
              const { r, g, b } = hexToRgb(colour);
              return `rgba(${r}, ${g}, ${b}, 0.5)`;
            });
          });
      });
    }
    drawLines();
    const xAxisGroup = g
      .append('g')
      .attr('class', 'x axis')
      .attr('transform', `translate(0, ${height})`);
    const xAxisCall = d3.axisBottom(xScale).tickFormat(d => d);
    xAxisGroup.call(xAxisCall);

    const legend = g
      .append('g')
      .attr('class', 'legend')
      .attr('height', 100)
      .attr('width', 100);

    legend
      .selectAll('rect')
      .data(genreArray)
      .enter()
      .append('rect')
      .attr('x', width - 35)
      .attr('y', (d, i) => 25 + i * 10)
      .attr('width', 5)
      .attr('height', 5)
      .style('fill', function(d) {
        return continentColor(d);
      });

    legend
      .selectAll('text')
      .data(genreArray)
      .enter()
      .append('text')
      .attr('fill', 'rgba(255,255,255,0.5)')
      .attr('text-anchor', 'start')
      .attr('x', width - 25)
      .style('font-size', 12)
      .attr('id', d => `legend-${d}`)
      .attr('y', (d, i) => 30 + i * 10)
      .text(function(d) {
        return d;
      })
      .on('mouseover', function(d) {
        histHover(d, true, continentColor);
      })
      .on('mouseout', function(d) {
        histHover(d, false, continentColor);
      });

    return {
      xScale,
      yScale,
      continentColor,
      t,
      g,
      height,
      xAxisGroup,
      yAxisGroup,
      xLabel,
      yLabel,
    };
  };

  updateLineChart = () => {
    const {
      xScale,
      yScale,
      g,
      xAxisGroup,
      yAxisGroup,
      continentColor,
      xLabel,
    } = this.state.d3Info;
    const { select, data } = this.state;
    const dataFeature = data[select];
    const dataClean = this.cleanData(dataFeature, select);

    let xDomainArray = [];
    let yDomainArray = [];
    const genreKeys = Object.keys(dataFeature);
    for (let k = 0; k < genreKeys.length; k++) {
      xDomainArray = xDomainArray.concat(dataFeature[genreKeys[k]].x);
      yDomainArray = yDomainArray.concat(dataFeature[genreKeys[k]].y);
    }
    const t = d3.transition().duration(200);
    xScale.domain(
      d3.extent(xDomainArray, function(d) {
        return d;
      })
    );

    yScale.domain(
      d3.extent(yDomainArray, function(d) {
        return d;
      })
    );
    const xAxisCall = d3.axisBottom(xScale).tickFormat(d => {
      return d;
    });
    const yAxisCall = d3.axisLeft(yScale).tickFormat(d => d);
    yAxisGroup
      .transition(t)
      .duration(750)
      .call(yAxisCall);
    xAxisGroup
      .transition(t)
      .duration(750)
      .call(xAxisCall);
    const line = d3
      .line()
      .x(function(d) {
        return xScale(d.x);
      })
      .y(function(d) {
        return yScale(d.y);
      })
      .curve(d3.curveMonotoneX);
    xLabel.text(select);

    function drawLines() {
      const genreArray = Object.keys(dataClean);
      genreArray.forEach(el => {
        g.select(`#line-${el}`)
          .datum(dataClean[el])
          .attr('fill', function() {
            this.className.clicked = false;
            const colour = continentColor(el);
            const { r, g, b } = hexToRgb(colour);
            return `rgba(${r}, ${g}, ${b}, 0.5)`;
          })
          .attr('stroke', () => {
            const colour = continentColor(el);
            const { r, g, b } = hexToRgb(colour);
            return `rgba(${r}, ${g}, ${b}, 0.8)`;
          })
          .attr('stroke-linejoin', 'round')
          .attr('stroke-linecap', 'round')
          .on('mouseover', function(d) {
            histHover(el, true, continentColor);
          })
          .on('mouseout', function(d) {
            histHover(el, false, continentColor);
          })
          .on('click', function() {
            const thisGenre = this.id
              .replace('line-', '')
              .replace('-clicked', '');
            histClick.call(
              this,
              thisGenre,
              genreArray,
              dataClean,
              xScale,
              yScale,
              t
            );
          })
          .transition(t)
          .duration(750)
          .attr('d', line);
      });
    }
    drawLines();
  };

  render() {
    const options = [];
    features.map((el, idx) =>
      options.push({ value: el, label: featureNames[idx] })
    );
    return (
      <React.Fragment>
        <div className="chart">
          <div
            style={{
              color: 'black',
              marginBottom: '20px',
            }}
          >
            <Select onChange={this.handleChange} {...selectStyles} />
          </div>
          <div
            ref={node => (this.node = node)}
            style={{ color: 'white', fontSize: '20px' }}
          />
        </div>
      </React.Fragment>
    );
  }
}
