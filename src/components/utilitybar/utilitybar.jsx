import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { MdSettings, MdUndo, MdRedo, MdZoomIn, MdZoomOut } from 'react-icons/md';
import { FaFile, FaMousePointer, FaPlus, FaCopy, FaPaste } from 'react-icons/fa';
import { IoMdEye, IoMdTrash } from "react-icons/io";
import UtilitybarButton from './utilitybar-button';
import If from '../../utils/react-if';
import {
  MODE_IDLE,
  MODE_3D_VIEW,
  MODE_3D_FIRST_PERSON,
  MODE_VIEWING_CATALOG,
  MODE_CONFIGURING_PROJECT
} from '../../constants';
import * as SharedStyle from '../../shared-style';

const iconTextStyle = {
  fontSize: '19px', // this the text size for the icon 3d, needs fixing. Fix with the other icons too
  textDecoration: 'none',
  fontWeight: 'bold',
  margin: '0px',
  userSelect: 'none'
};

const Icon2D = ( {style} ) => <p style={{...iconTextStyle, ...style}}>2D</p>;
const Icon3D = ( {style} ) => <p style={{...iconTextStyle, ...style}}>3D</p>;

const utilitybarstyle = {
  position: 'absolute',
  top: 0,
  backgroundColor: SharedStyle.PRIMARY_COLOR.main,
  border: '1px solid #000000',
  display: 'flex',
  width: '100%',
  height: '100px'
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

export default class Utilitybar extends Component {

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
      props: { state, width, height, utilitybarButtons, allowProjectFileSupport },
      context: { projectActions, viewer3DActions, translator }
    } = this;

    let mode = state.get('mode');
    let alterate = state.get('alterate');
    let alterateColor = alterate ? SharedStyle.MATERIAL_COLORS[500].orange : '';

    
    let sorter = [
      {
        index: 1, condition: true, dom: <UtilitybarButton
          active={false}
          tooltip={translator.t('Selector')}
          onClick={event => projectActions.undo()}>
          <FaMousePointer />
        </UtilitybarButton>
      },
      {
        index: 2, condition: true, dom: <UtilitybarButton
          active={false}
          tooltip={translator.t('Zoom')}
          onClick={event => projectActions.undo()}>
          <span>100%</span>
        </UtilitybarButton>
      },
      {
        index: 3, condition: true, dom: <UtilitybarButton
          active={false}
          tooltip={translator.t('Zoom In')}
          onClick={event => projectActions.undo()}>
          <MdZoomIn />
        </UtilitybarButton>
      },
      {
        index: 4, condition: true,
        dom: <UtilitybarButton
          active={[MODE_VIEWING_CATALOG].includes(mode)}
          tooltip={translator.t('Zoom Out')}
          onClick={event => projectActions.openCatalog()}>
          <MdZoomOut />
        </UtilitybarButton>
      },
      {
        index: 5, condition: true, dom: <UtilitybarButton
          active={false}
          tooltip={translator.t('Undo (CTRL-Z)')}
          onClick={event => projectActions.undo()}>
          <MdUndo />
        </UtilitybarButton>
      },
      {
        index: 6, condition: true, dom: <UtilitybarButton
          active={false}
          tooltip={translator.t('Redo (CTRL-SHIFT-Z)')}
          onClick={event => projectActions.redo()}>
          <MdRedo />
        </UtilitybarButton>
      },
      {
        index: 7, condition: true, dom: <UtilitybarButton
          active={false}
          tooltip={translator.t('Delete')}
          onClick={event => projectActions.remove()}>
          <IoMdTrash />
        </UtilitybarButton>
      },
      {
        index: 8, condition: true, dom: <UtilitybarButton
          active={false}
          tooltip={translator.t('Copy (Ctrl + C)')}
          onClick={event => projectActions.copyProperties()}>
          <FaCopy />
        </UtilitybarButton>
      },
      {
        index: 9, condition: true, dom: <UtilitybarButton
          active={false}
          tooltip={translator.t('Paste (Ctrl + V)')}
          onClick={event => projectActions.pasteProperties()}>
          <FaPaste />
        </UtilitybarButton>
      },
      {
        index: 10, condition: true, dom: <UtilitybarButton
          active={[MODE_IDLE].includes(mode)}
          tooltip={translator.t('2D View')}
          onClick={event => projectActions.setMode( MODE_IDLE )}>
          {[MODE_3D_FIRST_PERSON, MODE_3D_VIEW].includes(mode) ? <Icon2D style={{color: alterateColor}} /> : <Icon2D style={{color: alterateColor}} />}
        </UtilitybarButton>
      },
      {
        index: 11, condition: true, dom: <UtilitybarButton
          active={[MODE_3D_VIEW].includes(mode)}
          tooltip={translator.t('3D View')}
          onClick={event => viewer3DActions.selectTool3DView()}>
          <Icon3D />
        </UtilitybarButton>
      },
      {
        index: 12, condition: true, dom: <UtilitybarButton
          active={[MODE_3D_FIRST_PERSON].includes(mode)}
          tooltip={translator.t('1st View')}
          onClick={event => viewer3DActions.selectTool3DFirstPerson()}>
          <IoMdEye />
        </UtilitybarButton>
      },
      {
        index: 13, condition: true, dom: <UtilitybarButton
          active={[MODE_CONFIGURING_PROJECT].includes(mode)}
          tooltip={translator.t('Configure project')}
          onClick={event => projectActions.openProjectConfigurator()}>
          <MdSettings />
        </UtilitybarButton>
      }
    ];

    sorter = sorter.concat(utilitybarButtons.map((Component, key) => {
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
      <aside style={{ ...utilitybarstyle, maxWidth: width, maxHeight: height }} className='utilitybar'>
        {sorter.sort(sortButtonsCb).map(mapButtonsCb)}
      </aside>
    )
  }
}

Utilitybar.propTypes = {
  state: PropTypes.object.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  allowProjectFileSupport: PropTypes.bool.isRequired,
  utilitybarButtons: PropTypes.array
};

Utilitybar.contextTypes = {
  projectActions: PropTypes.object.isRequired,
  viewer2DActions: PropTypes.object.isRequired,
  viewer3DActions: PropTypes.object.isRequired,
  linesActions: PropTypes.object.isRequired,
  holesActions: PropTypes.object.isRequired,
  itemsActions: PropTypes.object.isRequired,
  translator: PropTypes.object.isRequired,
};
