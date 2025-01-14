import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CatalogItem from './catalog-item';
import CatalogBreadcrumb from './catalog-breadcrumb';
import CatalogPageItem from './catalog-page-item';
import CatalogTurnBackPageItem from './catalog-turn-back-page-item';
import ContentContainer from '../style/content-container';
import ContentTitle from '../style/content-title';
import * as SharedStyle from '../../shared-style';

const containerStyle = {
  position: 'fixed',
  height:'calc( 100% - 20px)',
  backgroundColor:'#FFF',
  padding:'1em',
  left:50,
  overflowY:'auto',
  overflowX:'hidden',
  zIndex:10
};

const itemsStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(14em, 1fr))',
  gridGap: '10px',
  marginTop: '1em'
};

const searchContainer = {
  width: '100%',
  height: '3em',
  padding: '0.625em',
  background: '#f7f7f9',
  border: '1px solid #e1e1e8',
  cursor: 'pointer',
  position: 'relative',
  boxShadow: '0 1px 6px 0 rgba(0, 0, 0, 0.11), 0 1px 4px 0 rgba(0, 0, 0, 0.11)',
  borderRadius: '2px',
  transition: 'all .2s ease-in-out',
  WebkitTransition: 'all .2s ease-in-out',
  marginBottom: '1em'
};

const searchText = {
  width: '8em',
  display: 'inline-block'
};

const searchInput = {
  width: 'calc( 100% - 10em )',
  height: '2em',
  margin: '0',
  padding: '0 1em',
  border: '1px solid #EEE'
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
  color: SharedStyle.PRIMARY_COLOR.text_main,
  textTransform: 'capitalize',
  margin: '0.25em',
  padding: '0 1em'
};

export default class CatalogList extends Component {

  constructor(props, context) {
    super(props);

    let page = props.state.catalog.page;
    let currentCategory = context.catalog.getCategory(page);
    let categoriesToDisplay = currentCategory.categories;
    let elementsToDisplay = currentCategory.elements;

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
    
    const minWidth = 200;
    const maxWidth = 800;
    const newWidth = Math.min(Math.max(e.clientX - 50, minWidth), maxWidth);
    
    this.setState({ width: newWidth });
  }

  handleMouseUp() {
    this.setState({ isResizing: false });
    document.body.style.cursor = 'default';
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

    let page = this.props.state.catalog.page;
    let currentCategory = this.context.catalog.getCategory(page);
    let categoriesToDisplay = currentCategory.categories;
    let elementsToDisplay = currentCategory.elements;

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

    const resizeHandleStyle = {
      position: 'absolute',
      right: 0,
      top: 0,
      width: '8px',
      height: '100%',
      cursor: 'col-resize',
      backgroundColor: this.state.isResizing ? '#e0e0e0' : 'transparent',
      transition: 'background-color 0.2s',
      ':hover': {
        backgroundColor: '#f0f0f0'
      }
    };

    const combinedContainerStyle = {
      ...containerStyle,
      ...this.props.style,
      width: this.state.width,
      position: 'relative'
    };

    return (
      <ContentContainer width={this.state.width} height={this.props.height} style={combinedContainerStyle}>
        <ContentTitle>{this.context.translator.t('Catalog')}</ContentTitle>
        {breadcrumbComponent}
        <div style={searchContainer}>
          <span style={searchText}>{this.context.translator.t('Search Element')}</span>
          <input type="text" style={searchInput} onChange={( e ) => { this.matcharray( e.target.value ); } }/>
        </div>
        { selectedHistory.size ? (
          <div style={historyContainer}>
            <span>{this.context.translator.t('Last Selected')}</span>
            {selectedHistoryElements}
          </div>
        ) : null}
        <div style={itemsStyle}>
          {this.state.matchString === '' ? [
            turnBackButton,
            categoriesToDisplay.map(cat => <CatalogPageItem key={cat.name} page={cat} oldPage={currentCategory}/>),
            elementsToDisplay.map(elem => <CatalogItem key={elem.name} element={elem}/>)
          ] : this.state.matchedElements.map(elem => <CatalogItem key={elem.name} element={elem}/>)}
        </div>
        <div
          style={resizeHandleStyle}
          onMouseDown = { this.handleMouseDown }
        />
      </ContentContainer>
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
