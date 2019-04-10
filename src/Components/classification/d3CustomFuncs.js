import * as d3 from 'd3';

export function histClick(thisGenre, genreArray, dataClean, xScale, yScale, t) {
  if (this.className.clicked) {
    this.className.clicked = false;
  } else {
    this.className.clicked = true;
  }
  if (!this.className.clicked) {
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
          .datum(d => dataClean[el])
          .transition(t)
          .duration(750)
          .attr('d', line);
      }
    });
  } else {
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
            const oldData = dataClean[el];
            const newDatum = [];
            d.forEach((el, i) => {
              newDatum.push({ x: oldData[i]['x'], y: 0 });
            });
            return newDatum;
          })
          .transition(t)
          .duration(750)
          .attr('d', line);
      }
    });
  }
}
