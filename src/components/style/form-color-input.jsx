import React from 'react';
import FormTextInput from './form-text-input';
import { IoMdColorFilter } from "react-icons/io";
import * as SharedStyle from '../../shared-style';

const CONTAINER_STYLE = {
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
};

const STYLE = {
  padding: 0,
  border: 0,
  width: '100%',
  height: '30px'
};

const ICON_STYLE = {
  color: SharedStyle.PRIMARY_COLOR.input,
  height: '30px',
  fontSize: '20px',
  display: 'flex',
  alignItems: 'center',
  backgroundColor: 'white',
  paddingRight: '2px',
  pointerEvents: 'none'
};

const EREG_NUMBER = /^.*$/;

export default function FormColorInput({onChange, ...rest}) {
  let onChangeCustom = event => {
    let value = event.target.value;
    if (EREG_NUMBER.test(value)) {
      onChange(event);
    }
  };

  return (
    <div style={CONTAINER_STYLE}>
      <FormTextInput type="color" style={STYLE} onChange={onChangeCustom} autoComplete="off" {...rest}/>
      <IoMdColorFilter style={ICON_STYLE}/>
    </div>
  );
}
