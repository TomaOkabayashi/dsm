import React from 'react';
import PropTypes from 'prop-types';
import MenubarButton from './menubar-button';
import {browserUpload}  from '../../utils/browser';

const iconTextStyle = {
  fontSize: '19px', // this the text size for the icon 3d, needs fixing. Fix with the other icons too
  textDecoration: 'none',
  fontWeight: 'bold',
  margin: '0px',
  userSelect: 'none'
};

export default function MenubarLoadButton({state}, {translator, projectActions}) {

  let loadProjectFromFile = event => {
    event.preventDefault();
    browserUpload().then((data) => {
      projectActions.loadProject(JSON.parse(data));
    });
  };

  return (
    <MenubarButton active={false} tooltip={translator.t("Load project (JSON)")} onClick={loadProjectFromFile}>
      <span style={{...iconTextStyle}}>Load</span>
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
