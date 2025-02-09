import React from 'react';
import PropTypes from 'prop-types';
import MenubarButton from './menubar-button';
import {browserDownload}  from '../../utils/browser';
import { Project } from '../../class/export';

export default function MenubarSaveButton({state}, {translator}) {
  let saveProjectToFile = e => {
    e.preventDefault();
    state = Project.unselectAll( state ).updatedState;
    browserDownload(state.get('scene').toJS());
  };

  return (
    <MenubarButton 
      active={false} 
      onClick={saveProjectToFile}
    >
      Save
    </MenubarButton>
  );
}

MenubarSaveButton.propTypes = {
  state: PropTypes.object.isRequired,
};

MenubarSaveButton.contextTypes = {
  translator: PropTypes.object.isRequired,
};
