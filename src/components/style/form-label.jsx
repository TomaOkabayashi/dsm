import React from 'react';

const BASE_STYLE = {
  display: "block",
  marginBottom: "5px",
  fontSize: "1.1em"
};

export default function FormLabel({children, style, ...rest}) {
  return <label style={{...BASE_STYLE, style}} {...rest}>{children}</label>
}
