import * as d3 from 'd3';

export const hexToRgb = hex => {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
};

export const features = [
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

export const featureNames = [
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

export const genreArray = [
  'classical',
  'jazz',
  'reggae',
  'rap',
  'rock',
  'dance',
];

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

export const histHover = (thisGenre, isMouseOver, continentColor) => {
  if (isMouseOver) {
    d3.select(`#legend-${thisGenre}`).attr('fill', 'rgba(255,255,255,1)');
  } else {
    d3.select(`#legend-${thisGenre}`).attr('fill', 'rgba(255,255,255,0.5)');
  }
  d3.select(`#line-${thisGenre}`)
    .attr('stroke', () => {
      const colour = continentColor(thisGenre);
      const { r, g, b } = hexToRgb(colour);
      return isMouseOver
        ? `rgba(${r}, ${g}, ${b}, 1)`
        : `rgba(${r}, ${g}, ${b}, 0.8)`;
    })
    .attr('fill', () => {
      const colour = continentColor(thisGenre);
      const { r, g, b } = hexToRgb(colour);
      return isMouseOver
        ? `rgba(${r}, ${g}, ${b}, 0.8)`
        : `rgba(${r}, ${g}, ${b}, 0.5)`;
    })
    .style('stroke-width', isMouseOver ? 5 : 1.5);
};

const options = [];
features.map((el, idx) =>
  options.push({ value: el, label: featureNames[idx] })
);

export const selectStyles = {
  isSearchable: false,
  options,
  styles: {
    option: (provided, state) => ({
      ...provided,
      fontSize: 'calc(2px + 2vmin)',
    }),
    control: (provided, state) => ({
      ...provided,
      fontSize: 'calc(2px + 2vmin)',
    }),
  },
  defaultValue: { value: 'danceability', label: 'Danceability' },
  theme: theme => ({
    ...theme,
    colors: {
      ...theme.colors,
      primary25: 'rgba(40, 44, 52, 0.25)',
      primary75: 'rgba(40, 44, 52, 0.75)',
      primary50: 'rgba(40, 44, 52, 0.50)',
      primary: 'rgba(40, 44, 52, 0.5)',
    },
  }),
};
