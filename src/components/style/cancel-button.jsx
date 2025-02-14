import React from 'react';
import Button from './button';
import * as SharedStyle from '../../shared-style';

const STYLE = {
  backgroundColor: SharedStyle.MATERIAL_COLORS[500].white_grey,
};

const STYLE_HOVER = {
  backgroundColor: SharedStyle.MATERIAL_COLORS[500].grey,
};

export default function CancelButton({children, ...rest}) {
  return <Button style={STYLE} styleHover={STYLE_HOVER} {...rest}>{children}</Button>
}
