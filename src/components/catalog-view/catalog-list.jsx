import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CatalogItem from './catalog-item';
import CatalogItemTool from './catalog-item-tool';
import CatalogItemHoles from './catalog-item-holes';
import CatalogBreadcrumb from './catalog-breadcrumb';
import CatalogPageItem from './catalog-page-item';
import CatalogTurnBackPageItem from './catalog-turn-back-page-item';
import ContentContainer from '../style/content-container';
import ContentTitle from '../style/content-title';
import * as SharedStyle from '../../shared-style';
import { MODE_3D_VIEW, MODE_3D_FIRST_PERSON } from '../../constants';
import {MdSearch} from 'react-icons/md';
import {FaPencilAlt, FaDoorOpen} from 'react-icons/fa';


const containerStyle = {
  flex: '1',
  height: '100%',
  backgroundColor: SharedStyle.PRIMARY_COLOR.main,
  overflowY: 'auto',
  overflowX: 'hidden',
  paddingRight: '15px'
};

const wrapperStyle = {
  position: 'relative',
  height: '100%',
  display: 'flex'
};

const toolStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(14em, 1fr))',
  gridGap: '10px',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center'
};

const itemsStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(14em, 1fr))',
  gridGap: '10px',
  marginTop: '1em'
};

const itemsStyleFolder = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(14em, 1fr))',
  gridGap: '10px',
  marginTop: '1em'
};

const searchContainer = {
  width: '100%',
  // minWidth: '235px',
  height: '2em',
  background: '#222222',
  border: '1px solid #e1e1e8',
  cursor: 'pointer',
  position: 'relative',
  boxShadow: '0 1px 6px 0 rgba(0, 0, 0, 0.11), 0 1px 4px 0 rgba(0, 0, 0, 0.11)',
  borderRadius: '2px',
  transition: 'all .2s ease-in-out',
  WebkitTransition: 'all .2s ease-in-out',
  marginBottom: '1em',
  display: 'flex',
  alignItems: 'center',
  paddingLeft: '3px',
  whiteSpace: 'nowrap',
  overflow: 'hidden'
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
  minWidth: '50px'
};

const historyContainer = {
  ...searchContainer,
  padding: '0.2em 0.625em'
};

const historyElementStyle = {
  width: 'auto',
  height: '2em',
  lineHeight: '2em',
  textAlign:'center',
  borderRadius: '1em',
  display: 'inline-block',
  cursor: 'pointer',
  backgroundColor: SharedStyle.PRIMARY_COLOR.alt,
  color: SharedStyle.COLORS.white,
  textTransform: 'capitalize',
  margin: '0.25em',
  padding: '0 1em'
};

const searchIconStyle = {
  fontSize: '1.3em',
  marginRight: '2px',
  color: SharedStyle.COLORS.white,
  flexShrink: 0
};

const headerContainer = {
  display: 'flex',
  alignItems: 'center',
  marginLeft: '-115px',
};

const gateHeaderContainer = {
  ...headerContainer,
  marginTop: '-5px'
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

  componentDidMount() {
    document.addEventListener('mousemove', this.handleMouseMove);
    document.addEventListener('mouseup', this.handleMouseUp);
  }

  componentWillUnmount() {
    document.removeEventListener('mousemove', this.handleMouseMove);
    document.removeEventListener('mouseup', this.handleMouseUp);
  }

  handleMouseDown(e) {
    this.setState({ isResizing: true });
    document.body.style.cursor = 'col-resize';
  }

  handleMouseMove(e) {
    if (!this.state.isResizing) return;

    const minWidth = 235;
    const maxWidth = 800;
    const newWidth = Math.min(Math.max(e.clientX - 1, minWidth), maxWidth); // call it placebo, it feels better doing a 1 offset
    
    this.setState({ width: newWidth });
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

    // Render css
    const resizeHandleStyle = {
      width: '13px',
      height: '100%',
      cursor: 'col-resize',
      backgroundColor: (this.state.hovering || this.state.isResizing) ? SharedStyle.MATERIAL_COLORS[500].grey : SharedStyle.PRIMARY_COLOR.alt,
      transition: 'background-color 0.2s'
    };

    const combinedContainerStyle = {
      ...containerStyle,
      ...this.props.style,
      width: this.state.width - 13,
      position: 'relative'
    };

    return (
      <div style={wrapperStyle}>
        <ContentContainer width={this.state.width - 13} height={this.props.height} style={combinedContainerStyle}>

          <div style={headerContainer}>
            {/* Lines - the loading bay creator */}
            <div style={toolStyle}>
              {this.state.matchString === '' ? [
                turnBackButton,
                elementsToDisplay
                  .filter(elem => elem.prototype === 'lines')
                  .map(elem => <CatalogItemTool key={elem.name} element={elem} icon={FaPencilAlt}/>)
              ] : this.state.matchedElements
                  .filter(elem => elem.prototype === 'lines')
                  .map(elem => <CatalogItemTool key={elem.name} element={elem} icon={FaPencilAlt}/>)}
            </div>
            <ContentTitle>{this.context.translator.t('Tool Chest')}</ContentTitle>
          </div>

          {/* {breadcrumbComponent} could be use case for this in future. The render of this is commented out in the catalog-turn-back-page-item.jsx*/}
          
          {/* Access tool */}
          <div style={gateHeaderContainer}>
            {/* Holes - the access tool */}
            <div style={toolStyle}>
              {this.state.matchString === '' ? [
                elementsToDisplay
                  .filter(elem => elem.name === 'gate')
                  .map(elem => <CatalogItemTool key={elem.name} element={elem} icon={FaDoorOpen}/>)
              ] : this.state.matchedElements
                  .filter(elem => elem.name === 'gate')
                  .map(elem => <CatalogItemTool key={elem.name} element={elem} icon={FaDoorOpen}/>)}
            </div>

            <div style={searchContainer}>
              <MdSearch style={searchIconStyle}/>
              <span style={searchText}>{this.context.translator.t('Search')}</span>
              <input type="text" style={searchInput} onChange={( e ) => { this.matcharray( e.target.value ); } }/>
            </div>
          </div>

          { selectedHistory.size ? (
            <div style={historyContainer}>
              <span>{this.context.translator.t('Last Selected')}</span>
              {selectedHistoryElements}
            </div>
          ) : null}

          {/* Items; containers */}
          <div style={itemsStyle}>
            {this.state.matchString === '' ? [
              elementsToDisplay
                .filter(elem => elem.prototype === 'items')
                .map(elem => <CatalogItem key={elem.name} element={elem}/>)
            ] : this.state.matchedElements
                .filter(elem => elem.prototype === 'items')
                .map(elem => <CatalogItem key={elem.name} element={elem}/>)}
          </div>

          {/* Windows and doors */}
          <div style={itemsStyle}>
            {this.state.matchString === '' ? [
              elementsToDisplay
                .filter(elem => elem.prototype === 'holes' && elem.name !== 'gate')
                .map(elem => <CatalogItemHoles key={elem.name} element={elem}/>)
            ] : this.state.matchedElements
                .filter(elem => elem.prototype === 'holes' && elem.name !== 'gate')
                .map(elem => <CatalogItemHoles key={elem.name} element={elem}/>)}
          </div>

          {/* The folders of different categrories */}
          <div style={itemsStyleFolder}>
            {this.state.matchString === '' ? [
              categoriesToDisplay.map(cat => <CatalogPageItem key={cat.name} page={cat} oldPage={currentCategory}/>),
            ] : this.state.matchedElements.map(elem => <CatalogItem key={elem.name} element={elem}/>)}
          </div>
          
        </ContentContainer>
        
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
