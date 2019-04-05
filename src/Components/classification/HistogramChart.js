import React, { Component } from 'react';
import * as d3 from 'd3';
import Select from 'react-select';

const genreArray = ['classical', 'jazz', 'reggae', 'rap', 'rock', 'dance'];

const features = [
  'danceability',
  'energy',
  'acousticness',
  'speechiness',
  'valence',
  'loudness',
  'instrumentalness',
  'tempo',
  'end_of_fade_in',
  'start_of_fade_out',
  'tempo_confidence',
  'liveness',
  'time_signature_confidence',
  'time_signature',
];

const featureNames = [
  'Danceability',
  'Energy',
  'Acousticness',
  'Speechiness',
  'Valence',
  'Loudness',
  'Instrumentalness',
  'Tempo',
  'End of Fade In',
  'Start of Fade Out',
  'Tempo Confidence',
  'Liveness',
  'Time Signature Confidence',
  'Time Signature',
];

function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

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

    const xScale = d3.scaleLinear().range([0, width]);
    xScale.domain([0, 1]);
    const yScale = d3.scaleLinear().range([height, 0]);
    yScale.domain([0, 1]);
    const continentColor = d3.scaleOrdinal(d3.schemePastel1);
    const xAxisGroup = g
      .append('g')
      .attr('class', 'x axis')
      .attr('transform', `translate(0, ${height})`);
    const yAxisGroup = g.append('g').attr('class', 'y axis');
    const xAxisCall = d3.axisBottom(xScale).tickFormat(d => d);
    xAxisGroup.call(xAxisCall);
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
          .datum({ x: [0, 1], y: [0, 1] })
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
          })
          .on('click', function(d) {
            const thisGenre = this.id.replace('line-', '');
            genreArray.forEach(el => {
              if (el !== thisGenre) {
                const path = d3.selectAll(`#line-${el}`);
                const line = d3
                  .line()
                  .x(function(d) {
                    return xScale(d.x);
                  })
                  .y(function(d) {
                    return yScale(d.y);
                  })
                  .curve(d3.curveMonotoneX);
                path
                  .datum(d => {
                    const numIterator = width / d.length;
                    const newDatum = [];
                    d.forEach((el, i) => {
                      newDatum.push({ x: xScale(numIterator * i), y: 0 });
                    });
                    return newDatum;
                  })
                  .transition(t)
                  .duration(750)
                  .attr('d', line);
              }
            });
          });
      });
    }
    drawLines();

    const legend = g
      .append('g')
      .attr('class', 'legend')
      // .attr('x', width - 65)
      // .attr('y', -10)
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
        d3.select(this).attr('fill', 'rgba(255,255,255,1)');
        d3.select(`#line-${d}`)
          .attr('stroke', () => {
            const colour = continentColor(d);
            const { r, g, b } = hexToRgb(colour);
            return `rgba(${r}, ${g}, ${b}, 1)`;
          })
          .attr('fill', () => {
            const colour = continentColor(d);
            const { r, g, b } = hexToRgb(colour);
            return `rgba(${r}, ${g}, ${b}, 0.8)`;
          })
          .style('stroke-width', 5);
      })
      .on('mouseout', function(d) {
        d3.select(this).attr('fill', 'rgba(255,255,255,0.5)');
        d3.select(`#line-${d}`)
          .attr('stroke', () => {
            const colour = continentColor(d);
            const { r, g, b } = hexToRgb(colour);
            return `rgba(${r}, ${g}, ${b}, 0.8)`;
          })
          .attr('fill', () => {
            const colour = continentColor(d);
            const { r, g, b } = hexToRgb(colour);
            return `rgba(${r}, ${g}, ${b}, 0.5)`;
          })
          .style('stroke-width', 1.5);
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
    // featureLabel.text(select);
    xLabel.text(select);
    // g.transition();
    function drawLines() {
      const genreArray = Object.keys(dataClean);
      genreArray.forEach(el => {
        g.select(`#line-${el}`)
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
          .on('mouseover', function(d) {
            d3.select(`#legend-${el}`).attr('fill', 'rgba(255,255,255,1)');
            d3.select(this)
              .attr('stroke', () => {
                const colour = continentColor(el);
                const { r, g, b } = hexToRgb(colour);
                return `rgba(${r}, ${g}, ${b}, 1)`;
                // return 'rgba(0,0,0,0.8)';
              })
              .attr('fill', () => {
                const colour = continentColor(el);
                const { r, g, b } = hexToRgb(colour);
                return `rgba(${r}, ${g}, ${b}, 0.8)`;
              })
              .style('stroke-width', 5);
          })
          .on('mouseout', function(d) {
            d3.select(`#legend-${el}`).attr('fill', 'rgba(255,255,255,0.5)');
            d3.select(this)
              .attr('stroke', () => {
                const colour = continentColor(el);
                const { r, g, b } = hexToRgb(colour);
                return `rgba(${r}, ${g}, ${b}, 0.8)`;
              })
              .attr('fill', () => {
                const colour = continentColor(el);
                const { r, g, b } = hexToRgb(colour);
                return `rgba(${r}, ${g}, ${b}, 0.5)`;
              })
              .style('stroke-width', 1.5);
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
            <Select
              isSearchable={false}
              options={options}
              onChange={this.handleChange}
              // styles={customStyles}
              defaultValue={{ value: 'danceability', label: 'Danceability' }}
              theme={theme => ({
                ...theme,
                colors: {
                  ...theme.colors,
                  primary25: 'rgba(40, 44, 52, 0.25)',
                  primary75: 'rgba(40, 44, 52, 0.75)',
                  primary50: 'rgba(40, 44, 52, 0.50)',

                  primary: 'rgba(40, 44, 52, 0.5)',
                },
              })}
            />
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
