import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { MdSettings, MdUndo, MdDirectionsRun } from 'react-icons/md';
import { FaFile, FaMousePointer, FaPlus } from 'react-icons/fa';
import MenubarButton from './menubar-button';
import MenubarSaveButton from './menubar-save-button';
import MenubarLoadButton from './menubar-load-button';
import If from '../../utils/react-if';
import CompanyLogo from '../icons/companyLogo';
import {
  MODE_IDLE,
  MODE_3D_VIEW,
  MODE_3D_FIRST_PERSON,
  MODE_VIEWING_CATALOG,
  MODE_CONFIGURING_PROJECT
} from '../../constants';
import * as SharedStyle from '../../shared-style';

const iconTextStyle = {
  fontSize: '19px',
  textDecoration: 'none',
  fontWeight: 'bold',
  margin: '0px',
  userSelect: 'none'
};

const Icon2D = ( {style} ) => <p style={{...iconTextStyle, ...style}}>2D</p>;
const Icon3D = ( {style} ) => <p style={{...iconTextStyle, ...style}}>3D</p>;

const menubarstyle = {
  position: 'absolute',
  top: 0,
  backgroundColor: SharedStyle.PRIMARY_COLOR.main,
  border: '1px solid #000000',
  zIndex: '9001',
  display: 'flex',
  width: '100%'
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
    <If
      key={ind}
      condition={el.condition}
      style={{ position: 'relative' }}
    >
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
      props: { state, width, height, menubarButtons, allowProjectFileSupport },
      context: { projectActions, viewer3DActions, translator }
    } = this;

    let mode = state.get('mode');
    let alterate = state.get('alterate');
    let alterateColor = alterate ? SharedStyle.MATERIAL_COLORS[500].orange : '';

    
    let sorter = [
      {
        index: 0, 
        condition: true,
        dom: <CompanyLogo/>
      },
      {
        index: 2, condition: allowProjectFileSupport, dom: <MenubarButton
          active={false}
          tooltip={translator.t('New project')}
          onClick={event => confirm(translator.t('Would you want to start a new Project?')) ? projectActions.newProject() : null}>
          <FaFile />
        </MenubarButton>
      },
      {
        index: 3, condition: allowProjectFileSupport,
        dom: <MenubarSaveButton state={state} />
      },
      {
        index: 4, condition: allowProjectFileSupport,
        dom: <MenubarLoadButton state={state} />
      },
      {
        index: 5, condition: true,
        dom: <MenubarButton
          active={[MODE_VIEWING_CATALOG].includes(mode)}
          tooltip={translator.t('Open catalog')}
          onClick={event => projectActions.openCatalog()}>
          <FaPlus />
        </MenubarButton>
      },
      {
        index: 6, condition: true, dom: <MenubarButton
          active={[MODE_3D_VIEW].includes(mode)}
          tooltip={translator.t('3D View')}
          onClick={event => viewer3DActions.selectTool3DView()}>
          <Icon3D />
        </MenubarButton>
      },
      {
        index: 7, condition: true, dom: <MenubarButton
          active={[MODE_IDLE].includes(mode)}
          tooltip={translator.t('2D View')}
          onClick={event => projectActions.setMode( MODE_IDLE )}>
          {[MODE_3D_FIRST_PERSON, MODE_3D_VIEW].includes(mode) ? <Icon2D style={{color: alterateColor}} /> : <FaMousePointer style={{color: alterateColor}} />}
        </MenubarButton>
      },
      {
        index: 8, condition: true, dom: <MenubarButton
          active={[MODE_3D_FIRST_PERSON].includes(mode)}
          tooltip={translator.t('3D First Person')}
          onClick={event => viewer3DActions.selectTool3DFirstPerson()}>
          <MdDirectionsRun />
        </MenubarButton>
      },
      {
        index: 9, condition: true, dom: <MenubarButton
          active={false}
          tooltip={translator.t('Undo (CTRL-Z)')}
          onClick={event => projectActions.undo()}>
          <MdUndo />
        </MenubarButton>
      },
      {
        index: 10, condition: true, dom: <MenubarButton
          active={[MODE_CONFIGURING_PROJECT].includes(mode)}
          tooltip={translator.t('Configure project')}
          onClick={event => projectActions.openProjectConfigurator()}>
          <MdSettings />
        </MenubarButton>
      }
    ];

    sorter = sorter.concat(menubarButtons.map((Component, key) => {
      return Component.prototype ? //if is a react component
        {
          condition: true,
          dom: React.createElement(Component, { mode, state, key })
        } :
        {                           //else is a sortable menubar button
          index: Component.index,
          condition: Component.condition,
          dom: React.createElement(Component.dom, { mode, state, key })
        };
    }));

    return (
      <aside style={{ ...menubarstyle, maxWidth: width, maxHeight: height }} className='menubar'>
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
