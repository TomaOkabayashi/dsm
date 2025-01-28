import React, {Component} from 'react';
import PropTypes from 'prop-types';
import * as SharedStyle from '../../shared-style';

// This is the template for the pre-added generic containers

const container_position = {
  marginLeft: '1.1em',
}

const STYLE_GRID_CELL = {
  width: '140px',
  padding: '0.05em',
  background: SharedStyle.MATERIAL_COLORS[500].grey,
  border: `1px solid ${SharedStyle.COLORS.black}`,
  position: 'center',
  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
  borderRadius: '2px',
  display: 'grid',
  fontSize: '0.8em',
  fontWeight: 'bold',
};

const CELL_STYLE = {
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  height: '25px',
  display: 'block',
  textAlign: 'center',
};

export default class CatalogGenericItem extends Component {
  constructor(props) {
    super(props);
    this.state = {hover: false};
  }

  select() {
    let element = this.props.element;
    // Only handle generic items
    if (element.type === 'generic') {
      this.context.itemsActions.selectToolDrawingItem(element.name);
      this.context.projectActions.pushLastSelectedCatalogElementToHistory(element);
    }
  }

  render() {
    let element = this.props.element;
    let hover = this.state.hover;
    let description = element.info.description || '';
  
    return (
      <div style={container_position}>
        <div
          style={hover ? {...STYLE_GRID_CELL, background: SharedStyle.SECONDARY_COLOR.main, color: SharedStyle.COLORS.white} : STYLE_GRID_CELL}
          onClick={e => this.select()}
          onMouseEnter={e => this.setState({hover: true})}
          onMouseLeave={e => this.setState({hover: false})}
        >
          <div style={CELL_STYLE}>
            {description}
          </div>
        </div>
      </div>
    );
  }
}

CatalogGenericItem.propTypes = {
  element: PropTypes.shape({
    type: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    info: PropTypes.shape({
      description: PropTypes.string
    }).isRequired
  }).isRequired,
};

CatalogGenericItem.contextTypes = {
  itemsActions: PropTypes.object.isRequired,
  projectActions: PropTypes.object.isRequired
};