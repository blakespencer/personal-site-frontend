import React, { Component } from 'react';
import * as d3 from 'd3';
import Select from 'react-select';

const initalData = [
  { genre: 'classical', value: 0 },
  { genre: 'jazz', value: 0 },
  { genre: 'reggae', value: 0 },
  { genre: 'rap', value: 0 },
  { genre: 'rock', value: 0 },
  { genre: 'dance', value: 0 },
];

const genre = ['classical', 'jazz', 'reggae', 'rap', 'rock', 'dance'];
const options = [
  { value: 'classical', label: 'Classical' },
  { value: 'jazz', label: 'Jazz' },
  { value: 'reggae', label: 'Reggae' },
  { value: 'rap', label: 'Rap' },
  { value: 'rock', label: 'Rock' },
  { value: 'dance', label: 'Dance' },
];

class PredictionChart extends Component {
  state = {
    data: [],
    select: 'classical',
    d3: {},
    precision: {},
  };

  constructor(props) {
    super(props);
    this.createBarChart = this.createBarChart.bind(this);
  }

  componentDidMount() {
    const data = this.props.data;
    const d3Info = this.createBarChart();
    const precision = this.props.precision;
    this.setState({ data, d3Info, precision });
  }
  componentDidUpdate() {
    this.updateBarChart();
  }

  handleChange = evt => {
    this.setState({ select: evt.value });
  };

  cleanData(data, select) {
    const ticks = [];
    let total = 0;
    for (let i = 0; i < genre.length; i++) {
      if (data[genre[i]]) {
        total += data[genre[i]];
        ticks.push({ value: data[genre[i]], genre: genre[i] });
      } else {
        ticks.push({ value: 0, genre: genre[i] });
      }
    }
    for (let i = 0; i < ticks.length; i++) {
      if (ticks[i]['genre'] === select) {
        ticks[i]['value'] = 1 - total;
      }
    }
    return ticks;
  }

  createBarChart() {
    // const { select } = this.state;
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

    // .attr('width', width + margin.left + margin.right)
    // .attr('height', height + margin.top + margin.bottom);
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
    const xAxisCall = d3.axisBottom(xScale).tickFormat(d => d);
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

    const precisionLabel = g
      .append('text')
      .attr('text-anchor', 'end')
      .attr('x', width)
      .attr('y', 0)
      .attr('text-anchor', 'end')
      .attr('fill', 'grey')
      .text(`Precision: ${0}`);

    const recallLabel = g
      .append('text')
      .attr('text-anchor', 'start')
      .attr('x', width)
      .attr('y', 25)
      .attr('text-anchor', 'end')
      .attr('fill', 'grey')
      .text(`Recall: ${0}`);

    g.append('text')
      .attr('x', width / 2)
      .attr('y', 0 - margin.top / 2)
      .attr('text-anchor', 'middle')
      .attr('fill', 'grey')
      .style('text-decoration', 'underline')
      .text('Predictions for a Certain Genre');

    const bars = g.selectAll('rect').data(initalData);
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
      });

    const valuesGroup = g.append('g');
    valuesGroup
      .selectAll('text')
      .data(initalData)
      .enter()
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('class', 'value')
      .attr('x', d => xScale(d.genre) + xScale.bandwidth() / 2)
      .attr('y', d => yScale(d.value) + 10)
      .attr('fill', 'white')
      .text(d => d.value);

    return {
      xScale,
      yScale,
      continentColor,
      recallLabel,
      precisionLabel,
      g,
      height,
      valuesGroup,
    };
  }

  updateBarChart = () => {
    const {
      xScale,
      yScale,
      continentColor,
      recallLabel,
      precisionLabel,
      g,
      height,
      valuesGroup,
    } = this.state.d3Info;
    const { select } = this.state;
    const dataRaw = this.state.data[select];
    const data = this.cleanData(dataRaw, select);
    const bars = g.selectAll('rect').data(data);
    const values = valuesGroup.selectAll('text').data(data);

    bars
      .exit()
      .attr('class', 'exit')
      .remove();

    bars
      .enter()
      .append('rect')
      .attr('class', 'enter')
      .attr('fill', d => continentColor(d.genre))
      .merge(bars)
      .transition()
      .duration(720)
      .attr('x', d => {
        return xScale(d.genre);
      })
      .attr('y', d => yScale(d.value))
      .attr('width', d => xScale.bandwidth())
      .attr('height', d => height - yScale(d.value));

    values
      .exit()
      .attr('class', 'exit')
      .remove();

    values
      .enter()
      .attr('fill', 'white')
      .attr('class', 'value')
      .append('text')
      .merge(values)
      .transition()
      .duration(720)
      .attr('x', d => {
        return xScale(d.genre) + xScale.bandwidth() / 2;
      })
      .attr('y', d => yScale(d.value) - 10)
      .text(d => {
        // if (height - yScale(d.value) < 30) {
        //   return '';
        // }
        return Math.round(d.value * 100) / 100;
      });

    let recall;
    data.forEach(el => {
      if (el.genre === select) {
        recall = el.value;
      }
    });
    recall = (Math.round(recall * 100) / 100).toString();
    let precision = (
      Math.round(this.state.precision[select] * 100) / 100
    ).toString();
    if (recall.length < 4) {
      recall += '0';
    }
    if (precision.length < 4) {
      precision += '0';
    }
    // const truePositiveCount = data[select].value;
    recallLabel.text(`Recall: ${recall}`);
    precisionLabel.text(`Precision: ${precision}`);
  };
  render() {
    return (
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
            defaultValue={{ value: 'classical', label: 'Classical' }}
            styles={{
              option: (provided, state) => ({
                ...provided,
                fontSize: 'calc(2px + 2vmin)',
              }),
              control: (provided, state) => ({
                ...provided,
                fontSize: 'calc(2px + 2vmin)',
              }),
            }}
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
        {/* <select onChange={this.handleChange}>
          {genre.map(el => {
            return (
              <option key={el} value={el}>
                {el}
              </option>
            );
          })}
        </select> */}
        <div ref={node => (this.node = node)} />
      </div>
    );
  }
}
export default PredictionChart;
