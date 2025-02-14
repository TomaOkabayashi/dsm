import React from 'react';
import Button from './button';
import * as SharedStyle from '../../shared-style';

const STYLE = {
  backgroundColor: "#4B6087",
  color: SharedStyle.COLORS.white
};

const STYLE_HOVER = {
  backgroundColor: SharedStyle.SECONDARY_COLOR.main,
  color: SharedStyle.COLORS.white
};

export default function FormSubmitButton({children, ...rest}) {
  return <Button type="submit" style={STYLE} styleHover={STYLE_HOVER} {...rest}>{children}</Button>
}
