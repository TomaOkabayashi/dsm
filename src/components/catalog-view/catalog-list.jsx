import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CatalogItem from './catalog-item';
import CatalogItemTool from './catalog-item-tool';
import CatalogItemHoles from './catalog-item-holes';
import CatalogBreadcrumb from './catalog-breadcrumb';
import CatalogPageItem from './catalog-page-item';
import CatalogTurnBackPageItem from './catalog-turn-back-page-item';
import ContentContainer from '../style/content-container';
import CatalogContainerPanel from './catalog-container-panel';
import ContentTitle from '../style/content-title';
import * as SharedStyle from '../../shared-style';
import { MODE_3D_VIEW, MODE_3D_FIRST_PERSON } from '../../constants';
import {MdSearch} from 'react-icons/md';
import {FaPencilAlt, FaDoorOpen} from 'react-icons/fa';

// this is the entire catalog structure

const wrapperStyle = {
  position: 'relative',
  height: '100%',
  display: 'flex'
};

const toolBarBorder = {
  position: 'absolute',
  width: '2px',
  height: '100%',
  left: 35,
  backgroundColor: SharedStyle.COLORS.black,
  zIndex: 998
};

const headerContainer = {
  display: 'flex',
  alignItems: 'center',
};

// Access tool and line tool
const toolStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(14em, 1fr))',
  gridGap: '10px',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
  marginLeft: '-115px',
};

const gateHeaderContainer = {
  ...headerContainer,
  marginTop: '-5px'
};

const searchContainer = {
  width: '100%',
  // minWidth: '235px',
  marginLeft: '-5em',
  height: '2em',
  background: '#222222',
  border: '1px solid #e1e1e8',
  position: 'flex',
  boxShadow: '0 1px 6px 0 rgba(0, 0, 0, 0.11), 0 1px 4px 0 rgba(0, 0, 0, 0.11)',
  borderRadius: '2px',
  marginBottom: '1em',
  display: 'flex',
  alignItems: 'center',
  paddingLeft: '3px',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
};

const searchIconStyle = {
  fontSize: '1.3em',
  marginLeft: '2px',
  color: SharedStyle.COLORS.white,
  flexShrink: 0
};

const searchText = {
  display: 'flex',
  alignItems: 'center',
  color: SharedStyle.COLORS.white,
  marginRight: '2px',
  whiteSpace: 'nowrap',
  flexShrink: 0
};

const searchInput = {
  height: '2em',
  borderLeft: '1px solid #EEE',
  background: SharedStyle.PRIMARY_COLOR.main,
  flex: 1,
  minWidth: '50px',
  width: '100%',
  position: 'relative',
  padding: '0 5px'
};


const historyContainer = {
  color: SharedStyle.COLORS.white,
  height: '2em',
  marginLeft: '29px',
  background: '#222222',
  border: '1px solid #e1e1e8',
  position: 'flex',
  boxShadow: '0 1px 6px 0 rgba(0, 0, 0, 0.11), 0 1px 4px 0 rgba(0, 0, 0, 0.11)',
  borderRadius: '2px',
  marginBottom: '1em',
  display: 'flex',
  alignItems: 'center',
  paddingLeft: '3px',
  whiteSpace: 'nowrap',
  overflowX: 'auto',
};

const historyElementStyle = {
  width: 'auto',
  height: '2em',
  lineHeight: '2em',
  textAlign:'center',
  borderRadius: '1em',
  display: 'inline-block',
  cursor: 'pointer',
  backgroundColor: SharedStyle.SECONDARY_COLOR.alt,
  color: SharedStyle.COLORS.white,
  textTransform: 'capitalize',
  margin: '0.25em',
  padding: '0 0.7em'
};

const lineBreakStyle = {
  width: '100%',
  height: '2px',
  backgroundColor: SharedStyle.MATERIAL_COLORS[500].blue_grey,
  margin: '1em 0',
  minWidth: '900px',
  marginLeft: '1.4em',
};

const container_position = {
  marginLeft: '1.2em',
}

const tempGridCell = {
  width: 'auto',
  minWidth: '300px',
  background: SharedStyle.MATERIAL_COLORS[500].blue_grey,
  border: `1px solid ${SharedStyle.MATERIAL_COLORS[500].white_grey}`,
  position: 'relative',
  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
  borderRadius: '2px',
  fontSize: '1em',
  fontWeight: 'bold',
};

const tempCell = {
  padding: '0.3em',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  height: '25px',
  minWidth: '50px',
  maxWidth: 'max-content',
  marginLeft: '0.3em',
};


const itemsStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(14em, 1fr))',
  gridGap: '10px',
  marginTop: '1em'
};

const itemsStyleFolder = {
  display: 'flex',
  gap: '3px',
  marginTop: '22em',
  alignItems: 'flex-start'
};

// Container for head row of items with titles


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

const HEADER_GRID_CELL = {
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

const HEADER_CELL = {
  padding: '0.3em',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  height: '25px',
  borderRight: 'solid 2px #000000',
  minWidth: '50px',
  maxWidth: 'max-content',
};


export default class CatalogList extends Component {

  constructor(props, context) {
    super(props);

    let page = props.state.catalog.page;
    let currentCategory = context.catalog.getCategory(page);
    let categoriesToDisplay = currentCategory.categories;
    let elementsToDisplay = currentCategory.elements.filter(element => element.info.visibility ? element.info.visibility.catalog : true );

    this.state = {
      categories: currentCategory.categories,
      elements: elementsToDisplay,
      matchString: '',
      matchedElements: [],
      width: props.width || 300, // Initial width
      isResizing: false,
    };

    // Bind methods
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.handleMouseOver = this.handleMouseOver.bind(this);
    this.handleMouseOut = this.handleMouseOut.bind(this);
  }

  // For the resize bar
  componentDidMount() {
    document.addEventListener('mousemove', this.handleMouseMove);
    document.addEventListener('mouseup', this.handleMouseUp);
  }

  componentWillUnmount() {
    document.removeEventListener('mousemove', this.handleMouseMove);
    document.removeEventListener('mouseup', this.handleMouseUp);
  }

  handleMouseDown(e) {
    e.preventDefault();
    e.stopPropagation();
    this.setState({ isResizing: true });
    document.body.style.cursor = 'col-resize';
  }

  handleMouseMove(e) {
    e.preventDefault();
    e.stopPropagation();
    if (!this.state.isResizing) return;
    
    const minWidth = 235;
    const maxWidth = 800;
    const newWidth = Math.min(Math.max(e.clientX - 1, minWidth), maxWidth); // call it placebo, it feels better doing a 1 offset
    
    // Update local state
    this.setState({ width: newWidth });
    // Update redux state
    this.context.projectActions.updateCatalogWidth(newWidth);
  }

  handleMouseUp() {
    this.setState({ isResizing: false });
    document.body.style.cursor = 'default';
  }

  handleMouseOver() {
    this.setState({ hovering: true});
  }

  handleMouseOut() {
    this.setState({ hovering: false});
  }

  flattenCategories( categories ) {
    let toRet = [];

    for( let x = 0; x < categories.length; x++ )
    {
      let curr = categories[x];
      toRet = toRet.concat( curr.elements );
      if( curr.categories.length ) toRet = toRet.concat( this.flattenCategories ( curr.categories ) );
    }

    return toRet;
  }

  matcharray( text ) {

    let array = this.state.elements.concat( this.flattenCategories( this.state.categories ) );

    let filtered = [];

    if( text != '' ) {
      let regexp = new RegExp( text, 'i');
      for (let i = 0; i < array.length; i++) {
        if (regexp.test(array[i].info.title)) {
          filtered.push(array[i]);
        }
      }
    }

    this.setState({
      matchString: text,
      matchedElements: filtered
    });
  };

  select( element ) {

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
    let mode = this.props.state.get('mode');
    
    // Don't render in 3D modes
    if (mode === MODE_3D_VIEW || mode === MODE_3D_FIRST_PERSON) {
      return null;
    }

    let page = this.props.state.catalog.page;
    let currentCategory = this.context.catalog.getCategory(page);
    let categoriesToDisplay = currentCategory.categories;
    let elementsToDisplay = currentCategory.elements.filter(element => element.info.visibility ? element.info.visibility.catalog : true );

    let breadcrumbComponent = null;

    if (page !== 'root') {

      let breadcrumbsNames = [];

      this.props.state.catalog.path.forEach(pathName => {
        breadcrumbsNames.push({
          name: this.context.catalog.getCategory(pathName).label,
          action: () => projectActions.goBackToCatalogPage(pathName)
        });
      });

      breadcrumbsNames.push({name: currentCategory.label, action: ''});

      breadcrumbComponent = (<CatalogBreadcrumb names={breadcrumbsNames}/>);
    }

    let pathSize = this.props.state.catalog.path.size;

    let turnBackButton = pathSize > 0 ? (
      <CatalogTurnBackPageItem key={pathSize} page={this.context.catalog.categories[this.props.state.catalog.path.get(pathSize - 1)]}/>) : null;


    let selectedHistory = this.props.state.get('selectedElementsHistory');
    let selectedHistoryElements = selectedHistory.map( ( el, ind ) =>
      <div key={ind} style={historyElementStyle} title={el.name} onClick={() => this.select(el) }>{el.name}</div>
    );

    // the entire left sidebar
    const adjustableContainerStyle = {
      ...this.props.style,
      width: this.state.width - 13,
      flex: '1',
      height: '100%',
      backgroundColor: SharedStyle.PRIMARY_COLOR.main,
      borderRight: `solid 1px ${SharedStyle.COLORS.black}`,
      overflowY: 'auto',
      overflowX: 'hidden',
      paddingRight: '15px',
      position: 'relative'
    };

    // Render css of the resize bar
    const resizeHandleStyle = {
      width: '4px',
      height: '100%',
      cursor: 'col-resize',
      backgroundColor: (this.state.hovering || this.state.isResizing) ? SharedStyle.SECONDARY_COLOR.main : SharedStyle.PRIMARY_COLOR.main,
      transition: 'background-color 0.2s',
      zIndex: 998,
    };

    const preventEventBubbling = e => {
      e.preventDefault();
      e.stopPropagation();
    }

    return (
      <div 
        style={wrapperStyle}
        onClick={(e) => {
          // stop the clicker event from react-planner reaching the container
          // prevents blur effect
          e.stopPropagation();
        }}
      >
        <ContentContainer width={this.state.width - 13} height={this.props.height} style={adjustableContainerStyle}>
          
          {/* Black tool border, far left side*/}
          <div style={toolBarBorder}></div>
          
          <div style={headerContainer}>
            {/* The loading bay creator - Always visible, not searchable*/}
            <div style={toolStyle}>
              {[
                turnBackButton, // Only put one turnBackButton for single render. Used for the windows, door, misc
                elementsToDisplay
                  .filter(elem => elem.prototype === 'lines')
                  .map(elem => <CatalogItemTool key={elem.name} element={elem} icon={FaPencilAlt}/>)
              ]}
            </div>
            <ContentTitle>{this.context.translator.t('Tool Chest')}</ContentTitle>
          </div>

          {/* {breadcrumbComponent} could be use case for this in future. The render of this is commented out in the catalog-turn-back-page-item.jsx*/}
          
          <div style={gateHeaderContainer}>
            {/* Access tool - not searchable */}
            <div style={toolStyle}>
              {elementsToDisplay
                .filter(elem => elem.name === 'gate')
                .map(elem => <CatalogItemTool key={elem.name} element={elem} icon={FaDoorOpen}/>)}
            </div>

            {/* Search bar */}
            <div
              style={searchContainer}
              onKeyDown={(e) => e.stopPropagation()} // capture events at the div level
            >
              <MdSearch style={searchIconStyle}/>
              <span style={searchText}>{this.context.translator.t('Search')}</span>
              <input type="text" style={searchInput} 
                onChange={( e ) => {this.matcharray( e.target.value ); 
                }}
              />
            </div>
          </div>

          {/* Recent bar */}
          { selectedHistory.size ? (
            <div style={historyContainer}>
              <span>{this.context.translator.t('Recent | ')}</span>
              {selectedHistoryElements}
            </div>
          ) : null}

          <div style={lineBreakStyle} />

          {/* Generic Containers Panel */}
          <CatalogContainerPanel 
            dataType="generic"
            title="Generic Containers"
            elements={elementsToDisplay}
          />

          <div style={lineBreakStyle} />

          {/* Manifest title bar */}
          <div style={container_position}>
            <div style={tempGridCell}>
              {['Manifest'].map((text, index) => (
                <div key={index} style={tempCell}>
                  {text}
                </div>
              ))}
            </div>
          </div>

          <CatalogContainerPanel 
            dataType="csv" //make this csv
            title="Brewster.csv"
            elements={elementsToDisplay}
          />
          
          <div style={lineBreakStyle} />





          {/* Excel sheets header 
          put this in the csv panel container */}

          {/* <div style={container_position}>
            <div style={HEADER_GRID_CELL}>
              {['DEST','CON','CHKD','Hu/Container','Packaging Mat Desc','L','W','H','Tare','VGM','Class Code'].map((text, index) => (
                <div key={index} style={HEADER_CELL}>
                  {text}
                </div>
              ))}
            </div>
          </div> */}
          
          {/* Items; containers - Searchable
          <div style={itemsStyle}>
            {this.state.matchString === '' ? 
              elementsToDisplay
                .filter(elem => elem.prototype === 'items')
                .map(elem => <CatalogItem key={elem.name} element={elem}/>)
            : this.state.matchedElements
                .filter(elem => elem.prototype === 'items')
                .map(elem => <CatalogItem key={elem.name} element={elem}/>)}
          </div> */}
          {/* OI READ THIS might be useful for the bottom bar below the catalog yeah? */}


          {/* The last two chunks below
          There are three folders; windows, doors, miscellaneous. They each have their respective 
          elements it is super unfinished, the css layout is really bad. I do not have time to 
          fix it right now.

          To fix this, you need to:
          1. Go to demo/src/catalog/mycatalog.js (where other categories like 'windows' and 
          'doors' are registered) and add:
            eg. catalog.registerCategory('containers', 'Containers', [/* your container elements *]); */}
        

          {/* 2. Then in CatalogList.jsx, wrap your custom UI (Container Panel, Excel headers) in:
            eg. {page === 'containers' && (
                  // Your container UI elements here
                )}
          This will make your custom UI only show up in the containers category page, just like 
          how the windows only show up in the windows category. */}

          {/* the actual items in the folder */}
          <div style={itemsStyle}>
            {this.state.matchString === '' ? 
              elementsToDisplay
                .filter(elem => elem.prototype === 'holes' && elem.name !== 'gate')
                .map(elem => <CatalogItemHoles key={elem.name} element={elem}/>)
            : this.state.matchedElements
                .filter(elem => elem.prototype === 'holes' && elem.name !== 'gate')
                .map(elem => <CatalogItemHoles key={elem.name} element={elem}/>)}
          </div>

          {/* The folders of different categories; window, door, misc - Searchable */}
          <div style={itemsStyleFolder}>
            {this.state.matchString === '' ? 
              categoriesToDisplay.map(cat => <CatalogPageItem key={cat.name} page={cat} oldPage={currentCategory}/>)
            : this.state.matchedElements
                .filter(elem => elem.prototype !== 'lines' && elem.name !== 'gate')
                .map(elem => <CatalogItem key={elem.name} element={elem}/>)}
          </div>
          
        </ContentContainer>
        
        {/* Adjustable size border */}
        <div
          style={resizeHandleStyle}
          onMouseDown={this.handleMouseDown}
          onMouseOver={this.handleMouseOver}
          onMouseOut={this.handleMouseOut}
        />
      </div>
    );
  }
}

CatalogList.propTypes = {
  state: PropTypes.object.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  style: PropTypes.object
};

CatalogList.contextTypes = {
  catalog: PropTypes.object.isRequired,
  translator: PropTypes.object.isRequired,
  itemsActions: PropTypes.object.isRequired,
  linesActions: PropTypes.object.isRequired,
  holesActions: PropTypes.object.isRequired,
  projectActions: PropTypes.object.isRequired
};
