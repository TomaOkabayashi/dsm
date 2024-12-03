import React from 'react';
import PropTypes from 'prop-types';
import GridHorizontalStreak from './grid-horizontal-streak';
import GridVerticalStreak from './grid-vertical-streak';
import BackgroundImage from '../../backgrounds/background1.png';

export default function Grids({scene}) {

  let {width, height, grids} = scene;

  let renderedGrids = grids.entrySeq().map(([gridID, grid]) => {
    switch (grid.type) {
      case 'horizontal-streak':
        return (<GridHorizontalStreak key={gridID} width={width} height={height} grid={grid}/>);

      case 'vertical-streak':
        return (<GridVerticalStreak key={gridID} width={width} height={height} grid={grid}/>);

      default:
        console.warn(`grid ${grid.type} not allowed`);
    }
  }).toList();

  return (
    <g>
      <g transform={`translate(0,${height}) scale(1,-1)`}>
        <image href={BackgroundImage}
          x="0"
          y="0"
          width={width}
          height={height}
        />
      </g>
      {renderedGrids}
    </g>);
}

Grids.propTypes = {
  scene: PropTypes.object.isRequired
};