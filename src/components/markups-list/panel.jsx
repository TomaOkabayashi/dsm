import React, {Component} from 'react';
import PropTypes from 'prop-types';
import * as SharedStyle from '../../shared-style';
import { FaAngleDown, FaAngleUp } from 'react-icons/fa';

const STYLE = {
  borderTop: '1px solid #222',
  borderBottom: '1px solid #48494E',
  userSelect: 'none',
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
};
const STYLE_TITLE = {
  fontSize: '11px',
  color: SharedStyle.PRIMARY_COLOR.text_alt,
  padding: '5px 15px 8px 15px',
  backgroundColor: SharedStyle.PRIMARY_COLOR.alt,
  textShadow: '-1px -1px 2px rgba(0, 0, 0, 1)',
  boxShadow: 'inset 0px -3px 19px 0px rgba(0,0,0,0.5)',
  margin: '0px',
  cursor: 'pointer'
};
const STYLE_CONTENT = {
  fontSize: '11px',
  color: SharedStyle.COLORS.white,
  border: '1px solid #222',
  padding: '0px',
  height: '100%',
  flex: 1,
  backgroundColor: SharedStyle.PRIMARY_COLOR.alt,
  display: 'flex',
  flexDirection: 'column',
};
const STYLE_ARROW = {
  float: 'right'
};

export default class Panel extends Component {

  constructor(props, context) {
    super(props, context);

    this.state = {
    };
  }

  render() {
    let { name, headComponents, children, style } = this.props;

    return (
      <div style={{...STYLE, ...style}}>
        <div style={STYLE_CONTENT}>
          {children}
        </div>
      </div>
    )
  }
}

Panel.propTypes = {
  headComponents: PropTypes.array,
  style: PropTypes.object
};
