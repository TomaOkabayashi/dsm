import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {FaPlusCircle as IconAdd} from 'react-icons/fa';
import * as SharedStyle from '../../shared-style';

// This is the template for the containers that come from the CSV

const COLUMN_WIDTHS = {
  dest: '50px',
  con: '50px',
  container: '110px',
  desc: '220px',
};
const container_position = {
  marginLeft: '1em',
}

const STYLE_GRID_CELL = {
  width: 'auto',
  minWidth: '450px',
  padding: '0.4em',
  background: SharedStyle.MATERIAL_COLORS[500].white_grey,
  border: `1px solid ${SharedStyle.MATERIAL_COLORS[500].white_grey}`,
  position: 'relative',
  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
  display: 'grid',
  fontSize: '0.8em',
  fontWeight: 'bold',
  gridTemplateColumns: `${COLUMN_WIDTHS.dest} ${COLUMN_WIDTHS.con} ${COLUMN_WIDTHS.container} ${COLUMN_WIDTHS.desc}`,
  gap: '2px'
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

const HEADER_GRID_CELL = {
  ...STYLE_GRID_CELL,
  background: `${SharedStyle.MATERIAL_COLORS[500].grey}`,
  color: SharedStyle.COLORS.white,
  fontWeight: 'bold',
  fontSize: '0.8em',
  cursor: 'default',
  marginBottom: '4px'
};

const HEADER_CELL = {
  ...CELL_STYLE,
  padding: '0.4em',
  paddingLeft: '6px',
  paddingTop: '4px',
  fontWeight: 'bold',
};

export default class CatalogItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hover: false,
      mouseDown: false
    };
    this.handleGlobalMouseUp = this.handleGlobalMouseUp.bind(this);
  }

  // Just so the background change when mouseDown reverts back to normal
  // The mouseUp is handled in viewer2d.jsx at onMouseUp
  componentDidMount() {
    document.addEventListener('mouseup-planner-event', this.handleGlobalMouseUp);
  }

  componentWillUnmount() {
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
  
    // Create array of metadata
    const containerMetadata = [
      metadata.destination,
      metadata.container,
      metadata.containerID,
      metadata.description,
    ];

    return (
      <div style={container_position}>
        {/* Header Row */}
        <div style={HEADER_GRID_CELL}>
          {['DEST','CON','Hu/Container','Packaging Mat Desc'].map((text, index) => (
            <div key={index} style={HEADER_CELL}>
              {text}
            </div>
          ))}
        </div>

        {/* Item Row */}
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
