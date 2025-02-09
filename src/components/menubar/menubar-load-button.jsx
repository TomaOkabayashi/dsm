import React from 'react';
import PropTypes from 'prop-types';
import MenubarButton from './menubar-button';
import {browserUpload}  from '../../utils/browser';

export default function MenubarLoadButton({state}, {translator, projectActions}) {
  let loadProjectFromFile = event => {
    event.preventDefault();
    browserUpload().then((data) => {
      projectActions.loadProject(JSON.parse(data));
    });
  };

  return (
    <MenubarButton 
      active={false} 
      onClick={loadProjectFromFile}
    >
      Open
    </MenubarButton>
  );
}

MenubarLoadButton.propTypes = {
  state: PropTypes.object.isRequired,
};

MenubarLoadButton.contextTypes = {
  projectActions: PropTypes.object.isRequired,
  translator: PropTypes.object.isRequired,
};
