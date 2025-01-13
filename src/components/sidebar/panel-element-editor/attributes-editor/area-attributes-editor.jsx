import React, {Component} from 'react';
import PropTypes from 'prop-types';
import FormTextInput from '../../../style/form-text-input';
const tableStyle = {width: '100%', borderSpacing: '2px 0', marginBottom: '3px'};
const firstTdStyle = {width: '5.45em', fontSize: '1.1em', textTransform:'capitalize'};
const inputStyle = { textAlign: 'left' };

export default function AreaAttributesEditor({element, onUpdate, attributeFormData, state, ...rest}, {translator}) {
  let name = attributeFormData.has('name') ? attributeFormData.get('name') : element.name;

  return (
    <table style={tableStyle}>
      <tbody>
        {/* Due to a bug in in element-editor.jsx that makes direct attribute name changes unusable (not sure why),
              we update properties instead and sync the attributes via updateProperty in element-editor */}
      </tbody>
    </table>
  );
}

AreaAttributesEditor.propTypes = {
  element: PropTypes.object.isRequired,
  onUpdate: PropTypes.func.isRequired,
  attributeFormData: PropTypes.object.isRequired,
  state: PropTypes.object.isRequired
};

AreaAttributesEditor.contextTypes = {
  translator: PropTypes.object.isRequired,
};
