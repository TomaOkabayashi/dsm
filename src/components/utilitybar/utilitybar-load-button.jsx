import React from 'react';
import PropTypes from 'prop-types';
import {FaFolderOpen as IconLoad} from 'react-icons/fa';
import UtilitybarButton from './utilitybar-button';
import {browserUpload}  from '../../utils/browser';

export default function UtilitybarLoadButton({state}, {translator, projectActions}) {

  let loadProjectFromFile = event => {
    event.preventDefault();
    browserUpload().then((data) => {
      projectActions.loadProject(JSON.parse(data));
    });
  };

  return (
    <UtilitybarButton active={false} tooltip={translator.t("Load project")} onClick={loadProjectFromFile}>
      <IconLoad />
    </UtilitybarButton>
  );
}

UtilitybarLoadButton.propTypes = {
  state: PropTypes.object.isRequired,
};

UtilitybarLoadButton.contextTypes = {
  projectActions: PropTypes.object.isRequired,
  translator: PropTypes.object.isRequired,
};
