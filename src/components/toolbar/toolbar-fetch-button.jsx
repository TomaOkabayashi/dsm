import React from 'react';
import PropTypes from 'prop-types';
import { FaCloudDownloadAlt as IconFetch } from 'react-icons/fa';
import ToolbarButton from './toolbar-button';

export default function ToolbarFetchButton({ state }, { translator, projectActions }) {

  let fetchAndLoadProject = () => {
    // Use fetch to get project data from the server
    fetch('http://localhost:4000/process-projects')
      .then(response => {
        // Check if the fetch request was successful
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json(); // Parse JSON response body
      })
      .then(data => {
        // Assuming 'data' contains the generated project data
        // and matches the structure expected by loadProject
        projectActions.loadProject(data);
      })
      .catch(error => {
        // Log or handle errors in fetching or processing the data
        console.error('Error fetching and loading project:', error);
      });
  };

  return (
    <ToolbarButton active={false} tooltip={translator.t("Fetch and generate")} onClick={fetchAndLoadProject}>
      <IconFetch />
    </ToolbarButton>
  );
}

ToolbarFetchButton.propTypes = {
  state: PropTypes.object.isRequired,
};

ToolbarFetchButton.contextTypes = {
  projectActions: PropTypes.object.isRequired,
  translator: PropTypes.object.isRequired,
};
