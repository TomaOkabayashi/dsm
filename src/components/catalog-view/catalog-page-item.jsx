import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {MdNavigateNext} from 'react-icons/md';
import * as SharedStyle from '../../shared-style';

// This is the files for the window, door stuff

const STYLE_BOX = {
  width: '3em',
  height: '3em',
  padding: '0.3em',
  background: '#f7f7f9',
  border: '1px solid #e1e1e8',
  cursor: 'pointer',
  position: 'relative',
  boxShadow: '0 1px 6px 0 rgba(0, 0, 0, 0.11), 0 1px 4px 0 rgba(0, 0, 0, 0.11)',
  borderRadius: '2px',
  transition: 'all .2s ease-in-out',
  WebkitTransition: 'all .2s ease-in-out',
  alignSelf: 'center',
  justifySelf: 'center',
};

const STYLE_BOX_HOVER = {
  ...STYLE_BOX,
  background: SharedStyle.SECONDARY_COLOR.main
};

const STYLE_TITLE = {
  fontSize: '0.8em',
  textAlign: 'center',
  display: 'block',
  marginBottom: '-15px',
  padding:'1em',
  WebkitTransition: 'all .15s ease-in-out',
  color: SharedStyle.COLORS.white,
};

const STYLE_TITLE_HOVERED = {
  ...STYLE_TITLE,
  color: SharedStyle.SECONDARY_COLOR.main
};

const STYLE_NEXT_HOVER = {
  position: 'absolute',
  color: SharedStyle.SECONDARY_COLOR.main,
  fontSize: '5em',
  width: '100%',
};

const CONTAINER_DIV = {
  background: SharedStyle.COLORS.white,
  marginBottom: '5px',
  border: 'solid 1px #EEE',
  width: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};

const WRAPPER_DIV = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center'
};

export default class CatalogPageItem extends Component {

  constructor(props) {
    super(props);
    this.state = {hover: false};
  }

  changePage(newPage) {
    this.context.projectActions.changeCatalogPage(newPage, this.props.oldPage.name)
  }

  render() {
    let page = this.props.page;
    let hover = this.state.hover;

    return (
      <div style={WRAPPER_DIV}>
        <b style={hover ? STYLE_TITLE_HOVERED : STYLE_TITLE}>{page.label}</b>
        <div
          style={hover ? STYLE_BOX_HOVER : STYLE_BOX}
          onClick={e => this.changePage(page.name)}
          onMouseEnter={e => this.setState({hover: true})}
          onMouseLeave={e => this.setState({hover: false})}
        >
          <div style={CONTAINER_DIV}>
            {hover && <MdNavigateNext style={STYLE_NEXT_HOVER}/>}
          </div>
        </div>
      </div>
    );
  }
}

CatalogPageItem.propTypes = {
  page: PropTypes.object.isRequired,
  oldPage: PropTypes.object.isRequired,
};

CatalogPageItem.contextTypes = {
  projectActions: PropTypes.object.isRequired
};
