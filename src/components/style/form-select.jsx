import React from 'react';
import * as SharedStyle from '../../shared-style';
import { FaAngleDown } from 'react-icons/fa';

const BASE_STYLE = {
  display: "block",
  width: "100%",
  padding: "0px 4px",
  fontSize: "13px",
  color: SharedStyle.PRIMARY_COLOR.input,
  backgroundColor: SharedStyle.COLORS.white,
  backgroundImage: "none",
  border: "1px solid rgba(0,0,0,.15)",
  outline: "none",
  borderRadius: "20px",
  height: "30px",
  WebkitAppearance: "none",
  WebkitBorderRadius: "0px",
  background: "#ffffff",

};

const ICON_STYLE = {
  position: "absolute",
  right: "8px",
  bottom: "8px",
  pointerEvents: "none",
  color: SharedStyle.PRIMARY_COLOR.input
};

export default function FormSelect({children, style, ...rest}) {
  return (
  <div style={{position: "relative"}}>
    <select type="text" style={{...BASE_STYLE, ...style}} {...rest}>{children}</select>
    <FaAngleDown style={ICON_STYLE}/>
  </div>
  );
}
