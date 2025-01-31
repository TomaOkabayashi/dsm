import React, { Component } from 'react';
import PropTypes from 'prop-types';
import PanelElementEditor from './panel-element-editor/panel-element-editor';
import PanelGroupEditor from './panel-group-editor';
import PanelMultiElementsEditor from './panel-element-editor/panel-multi-elements-editor';
import PanelLayers from './panel-layers';
import PanelGuides from './panel-guides';
import PanelGroups from './panel-groups';
import PanelLayerElements from './panel-layer-elements';
import * as SharedStyle from '../../shared-style';
import If from '../../utils/react-if';
import SidebarContentContainer from '../style/sidebar-content-container';

const wrapperStyle = {
  position: 'relative',
  height: '100%',
  display: 'flex',
  flexDirection: 'row'
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

export default class Sidebar extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      width: props.width || 300,
      isResizing: false,
      hovering: false,
      initialX: null,
      initialWidth: null
    };

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
    e.preventDefault();
    e.stopPropagation();
    this.setState({ isResizing: true });
    document.body.style.cursor = 'col-resize';
  }

  handleMouseMove(e) {
    e.preventDefault();
    e.stopPropagation();
    if (!this.state.isResizing) return;
    
    const minWidth = 280;
    const maxWidth = 800;
    // Calculate from right edge of window to mouse position
    const newWidth = Math.min(Math.max(window.innerWidth - e.clientX, minWidth), maxWidth);
    
    this.setState({ width: newWidth });
    this.context.projectActions.updateSidebarWidth(newWidth);
  }

  handleMouseUp() {
    this.setState({ isResizing: false });
    document.body.style.cursor = 'default';
  }

  handleMouseOver() {
    this.setState({ hovering: true });
  }

  handleMouseOut() {
    this.setState({ hovering: false });
  }

  render() {
    let { state, height, sidebarComponents } = this.props;
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
      { index: 0, condition: true, dom: <PanelGuides state={state}/> },
      { index: 1, condition: true, dom: <PanelLayers state={state} /> },
      { index: 2, condition: true, dom: <PanelLayerElements mode={state.mode} layers={state.scene.layers} selectedLayer={state.scene.selectedLayer} /> },
      { index: 4, condition: !multiselected, dom: <PanelElementEditor state={state} /> },
      { index: 6, condition: !!selectedGroup, dom: <PanelGroupEditor state={state} groupID={selectedGroup ? selectedGroup[0] : null} /> }
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

    // the entire right sidebar
    const adjustableContainerStyle = {
      ...STYLE,
      width: this.state.width,
      height: '100%',
      
      overflowY: 'auto',
      overflowX: 'hidden',
      position: 'relative'
    };

    const resizeHandleStyle = {
      position: 'absolute',
      left: 0,
      top: 0,
      width: '4px',
      height: '100%',
      cursor: 'col-resize',
      backgroundColor: (this.state.hovering || this.state.isResizing) ? SharedStyle.SECONDARY_COLOR.main : SharedStyle.PRIMARY_COLOR.main,
      transition: 'background-color 0.2s',
      zIndex: 998,
      borderRight: `solid 1px ${SharedStyle.COLORS.black}`,
    };

    return (
      <div 
        style={wrapperStyle}
        onKeyDown={(e) => e.stopPropagation()}
        onClick={(e) => {
          // Stop the click event from reaching the main container
          // This prevents the blur effect when clicking within the sidebar
          e.stopPropagation();
        }}
      >
        <div
          style={resizeHandleStyle}
          onMouseDown={this.handleMouseDown}
          onMouseOver={this.handleMouseOver}
          onMouseOut={this.handleMouseOut}
        />
        <SidebarContentContainer 
          width={this.state.width} 
          height={height} 
          style={adjustableContainerStyle}
          className="sidebar"
        >
          {sorter.sort(sortButtonsCb).map(mapButtonsCb)}
        </SidebarContentContainer>
      </div>
    );
  }
}

Sidebar.propTypes = {
  state: PropTypes.object.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  style: PropTypes.object
};

Sidebar.contextTypes = {
  projectActions: PropTypes.object.isRequired
};
