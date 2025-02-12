import React, { Component } from 'react';
import PropTypes from 'prop-types';
import PanelLayerElements from './panel-layer-elements';
import * as SharedStyle from '../../shared-style';
import If from '../../utils/react-if';
import SidebarContentContainer from '../style/sidebar-content-container';
import { IoMdMenu } from "react-icons/io";

const wrapperStyle = {
  position: 'relative',
  height: '100%',
  width: '100%',
  display: 'flex',
  flexDirection: 'row',
};

const STYLE = {
  backgroundColor: SharedStyle.PRIMARY_COLOR.main,
  display: 'block',
  overflowY: 'auto',
  overflowX: 'hidden',
};

const sortButtonsCb = (a, b) => {
  if (a.index === undefined || a.index === null) {
    a.index = Number.MAX_SAFE_INTEGER;
  }

  if (b.index === undefined || b.index === null) {
    b.index = Number.MAX_SAFE_INTEGER;
  }

  return a.index - b.index;
};

const mapButtonsCb = (el, ind) => <If key={ind} condition={el.condition} style={{ position: 'relative' }}>{el.dom}</If>;

export default class MarkupsList extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      width: props.width || 300,
      height: props.height || 300,
      isResizingHeight: false,
      hoveringHeight: false,
      dragStartY: null,
      dragStartHeight: null,
      isMenuHovered: false
    };

    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.handleHeightMouseDown = this.handleHeightMouseDown.bind(this);
    this.handleHeightMouseOver = this.handleHeightMouseOver.bind(this);
    this.handleHeightMouseOut = this.handleHeightMouseOut.bind(this);
    this.toggleHeight = this.toggleHeight.bind(this);
  }

  componentDidMount() {
    document.addEventListener('mousemove', this.handleMouseMove);
    document.addEventListener('mouseup', this.handleMouseUp);
  }

  componentWillUnmount() {
    document.removeEventListener('mousemove', this.handleMouseMove);
    document.removeEventListener('mouseup', this.handleMouseUp);
  }

  handleMouseMove(e) {
    if (this.state.isResizingHeight) {
      e.preventDefault();
      e.stopPropagation();
      
      const deltaY = this.state.dragStartY - e.clientY;
      const newHeight = Math.min(Math.max(this.state.dragStartHeight + deltaY, 50), 480);
      
      this.setState({ height: newHeight });
      this.context.projectActions.updateMarkupsListHeight(newHeight);
    }
  }

  handleMouseUp() {
    this.setState({ 
      isResizingHeight: false,
      dragStartY: null,
      dragStartHeight: null
    });
    document.body.style.cursor = 'default';
  }

  handleHeightMouseDown(e) {
    e.preventDefault();
    e.stopPropagation();
    this.setState({ 
      isResizingHeight: true,
      dragStartY: e.clientY,
      dragStartHeight: this.state.height
    });
    document.body.style.cursor = 'row-resize';
  }

  handleHeightMouseOver() {
    this.setState({ hoveringHeight: true });
  }

  handleHeightMouseOut() {
    this.setState({ hoveringHeight: false });
  }

  toggleHeight() {
    const burgerIconToggleHeight = this.state.height === 50 ? 265 : 50;
    this.setState({ height: burgerIconToggleHeight});
    this.context.projectActions.updateMarkupsListHeight(burgerIconToggleHeight);
  }

  render() {
    let { state, sidebarComponents } = this.props;
    let selectedLayer = state.getIn(['scene', 'selectedLayer']);
    let selected = state.getIn(['scene', 'layers', selectedLayer, 'selected']);

    let multiselected =
      selected.lines.size > 1 ||
      selected.items.size > 1 ||
      selected.holes.size > 1 ||
      selected.areas.size > 1 ||
      selected.lines.size + selected.items.size + selected.holes.size + selected.areas.size > 1;

    let selectedGroup = state.getIn(['scene', 'groups']).findEntry( g => g.get('selected') );

    let sorter = [
      { index: 1, condition: true, dom: <PanelLayerElements mode={state.mode} layers={state.scene.layers} selectedLayer={state.scene.selectedLayer} /> }
    ];

    sorter = sorter.concat(sidebarComponents.map((Component, key) => {
      return Component.prototype ? 
        {
          condition: true,
          dom: React.createElement(Component, { state, key })
        } :
        {
          index: Component.index,
          condition: Component.condition,
          dom: React.createElement(Component.dom, { state, key })
        };
    }));

    const adjustableContainerStyle = {
      ...STYLE,
      width: this.state.width,
      height: this.state.height,
      flex: '1',
      overflowY: 'auto',
      overflowX: 'hidden',
      position: 'relative',
      zIndex: 1,
    };

    const heightResizeHandleStyle = {
      position: 'absolute',
      top: 1,
      width: 'calc(100% + 320px)',
      height: '5px',
      cursor: 'row-resize',
      backgroundColor: (this.state.hoveringHeight || this.state.isResizingHeight) ? SharedStyle.SECONDARY_COLOR.main : SharedStyle.PRIMARY_COLOR.main,
      zIndex: (this.state.hoveringHeight || this.state.isResizingHeight) ? 801 : 400,
      borderTop: `solid 1px ${SharedStyle.COLORS.black}`,
    };

    const burgerIcon = {
      position: 'absolute',
      left: '1px',
      top: this.state.height === 50 ? '-34px' : '2px', // if the container is at the bottom, force the icon 34px higher
      borderRight: this.state.height === 50 ? `2px solid ${SharedStyle.COLORS.black}` : 'none', // black border forms if at the bottom to keep the illusion of the black bar
      fontSize: '24px',
      backgroundColor: this.state.isMenuHovered ? SharedStyle.SECONDARY_COLOR.main : SharedStyle.SECONDARY_COLOR.lightMain,
      lineHeight: 0,
      zIndex: 500,
      padding: '5px',
    }

    const toolBarBorder = {
      position: 'absolute',
      width: '2px',
      height: '100%',
      left: 35,
      backgroundColor: SharedStyle.COLORS.black,
      zIndex: 800
    };

    // For the burger icon, if the wrapper is at height 50, we push the wrapper container size 34px and push the icon up
    const dynamicWrapperStyle = {
      ...wrapperStyle,
      top: this.state.height === 50 ? 34 : 0,
      paddingBottom: 21,
    };

    return (
      <div 
        style={dynamicWrapperStyle}
        onKeyDown={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Burger Menu Icon */}
        {/* have not added the markuplist close down to the icon */}
        <div 
          style={{...burgerIcon}}
          onMouseEnter={() => this.setState({ isMenuHovered: true })}
          onMouseLeave={() => this.setState({ isMenuHovered: false })}
          onClick={this.toggleHeight}
        >
          <IoMdMenu />
        </div>

        <div
          style={heightResizeHandleStyle}
          onMouseDown={this.handleHeightMouseDown}
          onMouseOver={this.handleHeightMouseOver}
          onMouseOut={this.handleHeightMouseOut}
        />
        <div style={toolBarBorder}></div>
        <SidebarContentContainer 
          width={this.state.width} 
          height={this.state.height} 
          style={adjustableContainerStyle}
          className="markupsList"
        >
          {sorter.sort(sortButtonsCb).map(mapButtonsCb)}
        </SidebarContentContainer>
      </div>
    );
  }
}

MarkupsList.propTypes = {
  state: PropTypes.object.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  style: PropTypes.object
};

MarkupsList.contextTypes = {
  projectActions: PropTypes.object.isRequired
};