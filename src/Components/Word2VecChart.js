import React, { Component } from 'react';
import * as d3 from 'd3';

export default class Word2VecChart extends Component {
  state = {
    data: [],
    previousData: [],
    searchTerm: 'kanyewest',
  };

  async componentDidMount() {
    try {
      const res = await fetch(`/api/word2vec?word=${this.state.searchTerm}`);
      const data = await res.json();
      const d3Stuff = this.createScatterPlot();
      this.setState({ data, d3Stuff });
    } catch (error) {
      console.log(error);
    }
  }

  async componentDidUpdate() {
    try {
      const res = await fetch(`/api/word2vec?word=${this.state.searchTerm}`);
      const data = await res.json();
      this.updateScatterPlot(data);
    } catch (error) {
      console.log(error);
    }
  }

  handleChange = evt => {
    this.setState({ [evt.target.name]: evt.target.value });
  };

  // handleSubmit = evt => {
  //   evt.preventDefault()
  //   this.setState({searchTerm: })
  // }

  createScatterPlot = () => {
    const node = this.node;
    const margin = { left: 80, right: 20, top: 100, bottom: 100 };
    const width = 1000 - margin.left - margin.right,
      height = 600 - margin.top - margin.bottom;
    const t = d3.transition().duration(2000);

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
      .attr('y', 0 - margin.top / 2)
      .attr('text-anchor', 'middle')
      .attr('fill', 'grey')
      .style('text-decoration', 'underline')
      .text('Similar Words');

    // Creating Scales
    const xScale = d3
      .scaleLinear()
      .domain([0, 1])
      .range([0, width]);
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
    const xAxisCall = d3.axisBottom(xScale).tickFormat(d => d);
    // xAxisGroup.call(xAxisCall);
    const yAxisCall = d3.axisLeft(yScale);
    // yAxisGroup.call(yAxisCall);

    // const circles = g.append('g').selectAll('circle');

    const labels = g
      .append('g')
      .selectAll('text')
      .attr('class', 'labels');

    return {
      xScale,
      yScale,
      continentColor,
      t,
      g,
      height,
      xAxisGroup,
      yAxisGroup,
      // circles,
      labels,
    };
  };

  updateScatterPlot = data => {
    const {
      g,
      t,
      xScale,
      yScale,
      xAxisGroup,
      yAxisGroup,
      height,
    } = this.state.d3Stuff;
    let ys = [];
    let xs = [];
    let labelsArr = [];
    data.forEach(point => {
      ys.push(point.y);
      xs.push(point.x);
      labelsArr.push(point.label);
    });
    const xMax = d3.max(data, d => d.x);
    const yMax = d3.max(data, d => d.y);
    const xMin = d3.min(data, d => d.x);
    const yMin = d3.min(data, d => d.y);
    if (xMax > 200) {
      xs.splice(xs.indexOf(xMax), 1);
      data.splice(xs.indexOf(xMax), 1);
    }

    if (yMax > 200) {
      ys.splice(ys.indexOf(yMax), 1);
      data.splice(ys.indexOf(yMax), 1);
    }
    if (xMin < -200) {
      xs.splice(xs.indexOf(xMin), 1);
      data.splice(xs.indexOf(xMin), 1);
    }
    if (yMin < -200) {
      ys.splice(ys.indexOf(yMin), 1);
      data.splice(ys.indexOf(yMin), 1);
    }

    xScale.domain(d3.extent(xs, d => d));
    const xAxisCall = d3.axisBottom(xScale);
    // xAxisGroup
    //   .transition(t)
    //   .duration(750)
    //   .call(xAxisCall);

    // yScale.domain(d3.extent(ys, d => d));
    yScale.domain(d3.extent(ys, d => d));
    const yAxisCall = d3.axisLeft(yScale);
    // yAxisGroup
    //   .transition(t)
    //   .duration(750)
    //   .call(yAxisCall);

    // const circles = g.selectAll('circle').data(data, function(d) {
    //   return d.label;
    // });

    // // EXIT old elements not present in new data.
    // circles
    //   .exit()
    //   .attr('class', 'exit')
    //   .transition(t)
    //   .duration(2000)
    //   .attr('cy', height)
    //   .remove();

    // // ENTER new elements present in new data.
    // circles
    //   .enter()
    //   .append('circle')
    //   .attr('class', 'enter')
    //   .attr('fill', 'white')
    //   .merge(circles)
    //   .transition(t)
    //   .duration(2000)
    //   .attr('cy', function(d) {
    //     return yScale(d.y);
    //   })
    //   .attr('cx', function(d) {
    //     return xScale(d.x);
    //   })
    //   .attr('r', function(d) {
    //     // return Math.sqrt(area(d.population) / Math.PI);
    //     return 5;
    //   });

    const labels = g.selectAll('.labels').data(data, function(d) {
      return d.label;
    });
    labels
      .exit()
      .transition(t)
      .duration(2000)
      .attr('y', 400 + height)
      .attr('class', 'exit')
      .remove();

    labels
      .enter()
      .append('text')
      .on('click', d => {
        this.setState({ searchTerm: d.label });
      })
      .attr('class', 'labels')
      .attr('text-anchor', 'middle')
      .attr('x', d => xScale(d.x))
      .attr('y', d => -200)
      .merge(labels)
      .transition(t)
      .duration(2000)
      .attr('x', d => xScale(d.x))
      .attr('y', d => yScale(d.y))
      .attr('fill', (d, i) => {
        if (i === 0) {
          return 'red';
        }
        return 'white';
      })
      .text(d => {
        if (d.label === 'z') {
          return 'jay-z';
        }
        return d.label;
      });
  };

  render() {
    return (
      <div style={{ paddingTop: '30vh' }}>
        <select name="searchTerm" onChange={this.handleChange}>
          <option value="kanyewest">Kanye West</option>
          <option value="soul">Soul</option>
          <option value="metal">Metal</option>
          <option value="jazz">Jazz</option>
          <option value="blues">Blues</option>
          <option value="drake">Drake</option>
          <option value="ledzeppelin">Led Zeppelin</option>
          <option value="arianagrande">Ariana Grande</option>
          <option value="bobdylan">Bob Dylan</option>
          <option value="grunge">Grunge</option>
          <option value="johnnycash">Johnny Cash</option>
          <option value="muramasa">Masa Mura</option>
          <option value="amywinehouse">Amy Winehouse</option>
          <option value="davidbowie">David Bowie</option>
          <option value="brucespringsteen">Bruce Springsteen</option>
          <option value="britpop">Brit Pop</option>
          <option value="keane">Keane</option>
        </select>
        <div className="pitchfork-chart" ref={node => (this.node = node)} />
      </div>
    );
  }
}
