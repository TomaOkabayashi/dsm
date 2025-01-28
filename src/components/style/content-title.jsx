import React from 'react';
import PropTypes from 'prop-types';
import * as SharedStyle from '../../shared-style';

const STYLE = {
  color: SharedStyle.COLORS.white,
  fontWeight: 'bold',
  fontSize: '13px',
  marginLeft: '-20px',
  marginBottom: '15px',
  position: 'relative',
  flexShrink: 0,
};

export default function ContentTitle({children, style = {}, ...rest}) {
  return <h1 style={{...STYLE, ...style}} {...rest}>{children}</h1>
}

ContentTitle.propsType = {
  style: PropTypes.object
};
