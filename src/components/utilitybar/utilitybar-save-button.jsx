import React from 'react';
import PropTypes from 'prop-types';
import {FaSave as IconSave} from 'react-icons/fa';
import UtilitybarButton from './utilitybar-button';
import {browserDownload}  from '../../utils/browser';
import { Project } from '../../class/export';

export default function UtilitybarSaveButton({state}, {translator}) {

  let saveProjectToFile = e => {
    e.preventDefault();
    state = Project.unselectAll( state ).updatedState;
    browserDownload(state.get('scene').toJS());
  };

  return (
    <UtilitybarButton active={false} tooltip={translator.t('Save project')} onClick={saveProjectToFile}>
      <IconSave />
    </UtilitybarButton>
  );
}

UtilitybarSaveButton.propTypes = {
  state: PropTypes.object.isRequired,
};

UtilitybarSaveButton.contextTypes = {
  translator: PropTypes.object.isRequired,
};
