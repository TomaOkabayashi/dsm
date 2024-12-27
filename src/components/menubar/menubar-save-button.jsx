import React from 'react';
import PropTypes from 'prop-types';
import MenubarButton from './menubar-button';
import {browserDownload}  from '../../utils/browser';
import { Project } from '../../class/export';

const iconTextStyle = {
  fontSize: '19px', // this the text size for the icon 3d, needs fixing. Fix with the other icons too
  textDecoration: 'none',
  fontWeight: 'bold',
  margin: '0px',
  userSelect: 'none'
};

export default function MenubarSaveButton({state}, {translator}) {

  let saveProjectToFile = e => {
    e.preventDefault();
    state = Project.unselectAll( state ).updatedState;
    browserDownload(state.get('scene').toJS());
  };

  return (
    <MenubarButton active={false} tooltip={translator.t('Save project as JSON')} onClick={saveProjectToFile}>
      <span style={{...iconTextStyle}}>Save</span>
    </MenubarButton>
  );
}

MenubarSaveButton.propTypes = {
  state: PropTypes.object.isRequired,
};

MenubarSaveButton.contextTypes = {
  translator: PropTypes.object.isRequired,
};
