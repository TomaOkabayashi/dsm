import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as SharedStyle from '../../shared-style';

//http://www.cssportal.com/css-tooltip-generator/

const STYLE = {
  button: {
    height: 'calc(100% - 4px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0 8px',
    transition: 'all 0.1s ease',
    position: 'relative',
    userSelect: 'none',
    backgroundColor: 'transparent',
    margin: '2px',
    borderRadius: '2px',
    minWidth: '50px',
  },
  buttonContent: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '13.5px',
    fontWeight: '400',
    color: '#fff',
    width: '100%',
    textAlign: 'center',
  },
};

export default class MenubarButton extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = { active: false };
  }

  render() {
    let { state, props } = this;
    let buttonStyle = {
      ...STYLE.button,
      backgroundColor: props.active || state.active ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
      borderColor: props.active || state.active ? 'rgba(255, 255, 255, 0.4)' : 'rgba(255, 255, 255, 0.15)',
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
      </div>
    )
  }
}

MenubarButton.propTypes = {
  active: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired
};
