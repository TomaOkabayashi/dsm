import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as SharedStyle from '../../shared-style';

//http://www.cssportal.com/css-tooltip-generator/

const STYLE = {
  width: '170px', //space between the icons
  height: '25px', // height of the menu bar
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginRight: '5px',
  fontSize: '25px',
  position: 'relative',
  cursor: 'pointer',
  whiteSpace: 'nowrap',
};

const STYLE_TOOLTIP = {
  position: 'absolute',
  width: '100px',
  color: 'transparent',
  background: 'transparent',
  height: '22px',
  lineHeight: '22px',
  textAlign: 'center',
  visibility: 'hidden',
  borderRadius: '4px',
  opacity: '0',
  left: '100%',
  top: '50%',
  marginTop: '-11px',
  marginLeft: '5px',
  zIndex: '999',
  fontSize: '11px'
};

const STYLE_TOOLTIP_PIN = {
  position: 'absolute',
  top: '50%',
  right: '100%',
  marginTop: '-4px',
  marginRight: '-1px',
  width: '0',
  height: '0',
  borderRight: '4px solid transparent',
  borderTop: '4px solid transparent',
  borderBottom: '4px solid transparent'
};

// both the tooltip styles are set as transparent and invisible right now

export default class MenubarButton extends Component {

  constructor(props, context) {
    super(props, context);
    this.state = { active: false };
  }

  render() {
    let { state, props } = this;
    let color = props.active || state.active ? SharedStyle.SECONDARY_COLOR.icon : SharedStyle.PRIMARY_COLOR.icon;

    return (
      <div style={STYLE}
        onMouseOver={event => this.setState({ active: true })}
        onMouseOut={event => this.setState({ active: false })}>
        <div style={{ color }} onClick={props.onClick}>
          {props.children}
        </div>

        {
          state.active ?
          <div style={STYLE_TOOLTIP}>
            <span style={STYLE_TOOLTIP_PIN} />
            {props.tooltip}
          </div>
          : null
        }

      </div>
    )
  }
}

MenubarButton.propTypes = {
  active: PropTypes.bool.isRequired,
  tooltip: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired
};
