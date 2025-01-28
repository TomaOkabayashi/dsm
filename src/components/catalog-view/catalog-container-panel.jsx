import React, {Component} from 'react';
import PropTypes from 'prop-types';
import * as SharedStyle from '../../shared-style';
import CatalogItem from './catalog-item';
import CatalogGenericItem from './catalog-generic-item';
import { IoMdArrowDropright, IoMdArrowDropdown } from "react-icons/io";

// This is the code for the panel that drops down the respective containers

const panelStyle = {
  padding: '5px 0px',
  background: SharedStyle.MATERIAL_COLORS[500].white_grey,
  border: `1px solid ${SharedStyle.MATERIAL_COLORS[500].white_grey}`,
  marginLeft: '1.2em',
  marginBottom: '1em',
  border: '1px solid #e1e1e8',
  borderRadius: '2px',
  minWidth: '300px',
  zIndex: 1,
};

const headerStyle = {
  cursor: 'pointer',
  padding: '0.2em',
  display: 'flex',
  alignItems: 'center',
  fontWeight: 'bold'
};

const STYLE_ARROW = {
    fontSize: '1.75em',
};

export default class CatalogContainerPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false
    };
  }

  renderContent() {
    const { dataType, elements, csvData } = this.props;

    switch(dataType) {
        case 'generic':
            const genericElements = elements.filter(elem => elem.type === 'generic');
            return (
                <div style={{ 
                    display: 'grid',
                    gridTemplateColumns: '160px 160px',  // Fixed width columns
                    gap: '0.2em',
                    overflowX: 'auto'  // Allows horizontal scroll if container is too small
                  }}>
                {genericElements.map((elem) => (
                    <CatalogGenericItem 
                        key={elem.name} 
                        element={elem}
                    />
                    ))}
                </div>
            );
  
        case 'csv':
          return csvData.map((row, index) => (
            <div key={index} style={STYLE_GRID_CELL}>
              {Object.values(row).map((value, i) => (
                <div key={i} style={CELL_STYLE}>
                  {value}
                </div>
              ))}
            </div>
          ));
      
        default:
          return null;
    }
  }

  render() {
    const { title = "Container Selection" } = this.props;

    return (
      <div style={panelStyle}>
        <div 
          onClick={() => this.setState({isOpen: !this.state.isOpen})}
          style={headerStyle}
        >
          <span>{this.state.isOpen ? <IoMdArrowDropdown style={STYLE_ARROW}/> : <IoMdArrowDropright style={STYLE_ARROW}/>}</span>
          <span>{title}</span>
        </div>
        
        {this.state.isOpen && (
          <div>
            {this.renderContent()}
          </div>
        )}
      </div>
    );
  }
}

CatalogContainerPanel.propTypes = {
  dataType: PropTypes.oneOf(['catalog', 'csv']).isRequired,
  title: PropTypes.string,
  elements: PropTypes.array,
  csvData: PropTypes.array,
};
