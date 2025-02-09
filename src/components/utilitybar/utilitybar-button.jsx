import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as SharedStyle from '../../shared-style';

//http://www.cssportal.com/css-tooltip-generator/

const STYLE = {
  button: {
    width: '54px',// width between buttons on bar
    height: '25px', // height of the menu bar
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: '5px',
    margin: '2px',
    position: 'relative',
    cursor: 'pointer',
    borderRadius: '4px',
    transition: 'background-color 0.1s ease',
    backgroundColor: 'transparent',
  },
  buttonContent: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '22px',
    color: '#fff',
  },
  tooltip: {
    position: 'absolute',
    padding: '6px 8px',
    backgroundColor: SharedStyle.COLORS.black,
    color: SharedStyle.COLORS.white,
    fontSize: '11px',
    borderRadius: '4px',
    whiteSpace: 'nowrap',
    visibility: 'hidden',
    opacity: '0.9',
    left: '50%',
    transform: 'translateX(-50%)',
    top: 'calc(100% + 5px)',
    zIndex: '999',
    transition: 'opacity 0.15s ease, visibility 0.15s ease',
  },
  tooltipArrow: {
    position: 'absolute',
    top: '-4px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '0',
    height: '0',
    borderLeft: '4px solid transparent',
    borderRight: '4px solid transparent',
    borderBottom: '4px solid ' + SharedStyle.COLORS.black,
  }
};

export default class UtilitybarButton extends Component {

  constructor(props, context) {
    super(props, context);
    this.state = { active: false };
  }

  render() {
    let { state, props } = this;
    let buttonStyle = {
      ...STYLE.button,
      backgroundColor: props.active || state.active ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
    };

    return (
      <div 
        style={buttonStyle}
        onMouseOver={event => this.setState({ active: true })}
        onMouseOut={event => this.setState({ active: false })}
        onClick={props.onClick}
      >
        <div style={STYLE.buttonContent}>
          {props.children}
        </div>

        {props.tooltip && (
          <div style={{
            ...STYLE.tooltip,
            visibility: state.active ? 'visible' : 'hidden',
            opacity: state.active ? 0.9 : 0,
          }}>
            <div style={STYLE.tooltipArrow} />
            {props.tooltip}
          </div>
        )}
      </div>
    )
  }
}

UtilitybarButton.propTypes = {
  active: PropTypes.bool.isRequired,
  tooltip: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired
};
