import React, { Component } from 'react';
import PropTypes from 'prop-types';
import MenubarButton from './menubar-button';
import MenubarSaveButton from './menubar-save-button';
import MenubarLoadButton from './menubar-load-button';
import If from '../../utils/react-if';
import {
  MODE_VIEWING_CATALOG,
  MODE_3D_VIEW,
  MODE_CONFIGURING_PROJECT
} from '../../constants';
import * as SharedStyle from '../../shared-style';

const menubarstyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  backgroundColor: SharedStyle.PRIMARY_COLOR.main,
  borderBottom: '1px solid rgba(0,0,0,0.2)',
  display: 'flex',
  alignItems: 'stretch',
  height: '25px',
  padding: '0 4px',
  zIndex: 10,
  boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
};

const menuGroupStyle = {
  display: 'flex',
  alignItems: 'center',
  height: '100%',
  marginRight: '-1px',
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

const mapButtonsCb = (el, ind) => {
  return (
    <If key={ind} condition={el.condition}>
      {el.dom}
    </If>
  );
};

export default class Menubar extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {};
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.props.state.mode !== nextProps.state.mode ||
      this.props.height !== nextProps.height ||
      this.props.width !== nextProps.width ||
      this.props.state.alterate !== nextProps.state.alterate;
  }

  render() {
    let {
      props: { state, menubarButtons, allowProjectFileSupport },
      context: { projectActions, viewer3DActions, translator }
    } = this;

    let mode = state.get('mode');
    
    let sorter = [
      {
        index: 1,
        condition: allowProjectFileSupport,
        dom: <MenubarButton
          active={false}
          onClick={event => confirm(translator.t('Would you want to start a new Project?')) ? projectActions.newProject() : null}
        >
          New
        </MenubarButton>
      },
      {
        index: 2,
        condition: allowProjectFileSupport,
        dom: <MenubarLoadButton state={state} />
      },
      {
        index: 3,
        condition: allowProjectFileSupport,
        dom: <MenubarSaveButton state={state} />
      },
      {
        index: 4,
        condition: true,
        dom: <div style={menuGroupStyle}>
          {menubarButtons.map((Component, key) => 
            React.createElement(Component, { mode, state, key })
          )}
        </div>
      },
      {
        index: 5,
        condition: true,
        dom: <MenubarButton
          active={[MODE_VIEWING_CATALOG].includes(mode)}
          onClick={event => projectActions.openCatalog()}
        >
          Import Excel
        </MenubarButton>
      },
      {
        index: 6,
        condition: true,
        dom: <MenubarButton
          active={[MODE_3D_VIEW].includes(mode)}
          onClick={event => viewer3DActions.selectTool3DView()}
        >
          Export Excel
        </MenubarButton>
      },
      {
        index: 7,
        condition: true,
        dom: <MenubarButton
          active={[MODE_3D_VIEW].includes(mode)}
          onClick={event => viewer3DActions.selectTool3DView()}
        >
          PDF Report
        </MenubarButton>
      },
      {
        index: 8,
        condition: true,
        dom: <MenubarButton
          active={[MODE_CONFIGURING_PROJECT].includes(mode)}
          onClick={event => projectActions.openProjectConfigurator()}
        >
          Display
        </MenubarButton>
      },
    ];
    
    return (
      <aside style={menubarstyle} className='menubar'>
        {sorter.sort(sortButtonsCb).map(mapButtonsCb)}
      </aside>
    )
  }
}

Menubar.propTypes = {
  state: PropTypes.object.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  allowProjectFileSupport: PropTypes.bool.isRequired,
  menubarButtons: PropTypes.array
};

Menubar.contextTypes = {
  projectActions: PropTypes.object.isRequired,
  viewer2DActions: PropTypes.object.isRequired,
  viewer3DActions: PropTypes.object.isRequired,
  linesActions: PropTypes.object.isRequired,
  holesActions: PropTypes.object.isRequired,
  itemsActions: PropTypes.object.isRequired,
  translator: PropTypes.object.isRequired,
};