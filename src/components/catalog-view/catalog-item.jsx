import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {FaPlusCircle as IconAdd} from 'react-icons/fa';
import * as SharedStyle from '../../shared-style';

// This is the template for the containers that come from the CSV

const COLUMN_MIN_WIDTHS = {
  dest: '55px',      // DEST
  con: '55px',       // CON
  chkd: '55px',      // CHKD
  container: '115px', // Hu/Container
  desc: '265px',     // Packaging Mat Desc
  length: '35px',    // L
  width: '35px',     // W
  height: '35px',    // H
  tare: '50px',      // Tare
  vgm: '35px',       // VGM
  classCode: '65px'  // Class Code
};

const container_position = {
  marginLeft: '1.1em',
}

const STYLE_GRID_CELL = {
  width: 'auto',
  minWidth: '900px',
  padding: '0.4em',
  background: SharedStyle.MATERIAL_COLORS[500].white_grey,
  border: `1px solid ${SharedStyle.MATERIAL_COLORS[500].white_grey}`,
  position: 'relative',
  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
  borderRadius: '2px',
  display: 'grid',
  fontSize: '0.9em',
  fontWeight: 'bold',
  gridTemplateColumns: `minmax(${COLUMN_MIN_WIDTHS.dest}, max-content)
                       minmax(${COLUMN_MIN_WIDTHS.con}, max-content)
                       minmax(${COLUMN_MIN_WIDTHS.chkd}, max-content)
                       minmax(${COLUMN_MIN_WIDTHS.container}, max-content)
                       minmax(${COLUMN_MIN_WIDTHS.desc}, max-content)
                       minmax(${COLUMN_MIN_WIDTHS.length}, max-content)
                       minmax(${COLUMN_MIN_WIDTHS.width}, max-content)
                       minmax(${COLUMN_MIN_WIDTHS.height}, max-content)
                       minmax(${COLUMN_MIN_WIDTHS.tare}, max-content)
                       minmax(${COLUMN_MIN_WIDTHS.vgm}, max-content)
                       minmax(${COLUMN_MIN_WIDTHS.classCode}, max-content)`,
};

const CELL_STYLE = {
  padding: '0.3em',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  height: '25px',
  width: '100%',
  borderRight: 'solid 2px #000000',
  maxWidth: 'max-content',
  minWidth: '100%',        // Force minimum width to match column
  display: 'block',        // Changed to block for better text handling
  whiteSpace: 'nowrap',    // Keep text on one line
  textAlign: 'left' 
};

export default class CatalogItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hover: false,
      mouseDown: false
    };
  }

  // The mouseUp is handled in viewer2d.jsx at onMouseUp
  componentDidMount() {
    document.addEventListener('mouseup-planner-event', this.handleGlobalMouseUp);
  }

  componentDidMount() {
    document.removeEventListener('mouseup-planner-event', this.handleGlobalMouseUp);
  }

  handleGlobalMouseUp() {
    this.setState({ mouseDown: false });
  }

  select(e) {
    // Prevent text selection and scrolling
    e.preventDefault();
    e.stopPropagation();
    
    let element = this.props.element;
    switch (element.prototype) {
      case 'lines':
        this.context.linesActions.selectToolDrawingLine(element.name);
        break;
      case 'items':
        this.context.itemsActions.selectToolDrawingItem(element.name);
        break;
      case 'holes':
        this.context.holesActions.selectToolDrawingHole(element.name);
        break;
    }
    this.context.projectActions.pushLastSelectedCatalogElementToHistory(element);
  }

  render() {
    let element = this.props.element;
    let hover = this.state.hover;
    let metadata = element.info.metadata || {};
    let originalDimensions = metadata.originalDimensions || {};
  
    // Create array of metadata
    const containerMetadata = [
      metadata.destination,
      metadata.container,
      metadata.chkd,
      metadata.containerID,
      metadata.description,
      originalDimensions.length,
      originalDimensions.width,
      originalDimensions.height,
      metadata.tare,
      metadata.vgm,
      metadata.classCode
    ];

    return (
      <div style={container_position}>
        <div
          style={(hover || this.state.mouseDown) ? {...STYLE_GRID_CELL, background: SharedStyle.SECONDARY_COLOR.main, color: SharedStyle.COLORS.white} : STYLE_GRID_CELL}
          onMouseDown={e => {
              this.setState({mouseDown: true});
              this.select(e);
          }}
          onMouseEnter={e => this.setState({hover: true})}
          onMouseLeave={e => this.setState({hover: false})}
        >
          {containerMetadata.map((text, index) => (
            <div key={index} style={CELL_STYLE}>
              {text || ''}
            </div>
          ))}
        </div>
      </div>
    );
  }
}

CatalogItem.propTypes = {
  element: PropTypes.object.isRequired,
};

CatalogItem.contextTypes = {
  itemsActions: PropTypes.object.isRequired,
  linesActions: PropTypes.object.isRequired,
  holesActions: PropTypes.object.isRequired,
  projectActions: PropTypes.object.isRequired
};
