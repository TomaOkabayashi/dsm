import React, {Component} from 'react';
import PropTypes from 'prop-types';
import * as SharedStyle from '../../shared-style';
import { FaPencilAlt, FaDoorOpen } from "react-icons/fa";

// This one thing is for the Loading Bay Creator

const STYLE_BOX = {
  width: '35px',
  height: '35px',
  background: SharedStyle.PRIMARY_COLOR.alt,
  border: '1px solid #e1e1e8',
  cursor: 'pointer',
  position: 'relative',
  boxShadow: '0 1px 6px 0 rgba(0, 0, 0, 0.11), 0 1px 4px 0 rgba(0, 0, 0, 0.11)',
  alignSelf: 'center',
  justifySelf: 'center',
};

const STYLE_BOX_HOVER = {
  ...STYLE_BOX,
  background: SharedStyle.SECONDARY_COLOR.main
};

const STYLE_TITLE = {
  width:'100%',
  textAlign:'center',
  display:'block',
  marginBottom:'.5em',
  textTransform: 'capitalize'
};

const STYLE_DESCRIPTION = {
  display: 'block',
  display: '-webkit-box',
  height: '2em',
  margin: '0 auto',
  fontSize: '0.75em',
  fontStyle:'italic',
  lineHeight: '1em',
  WebkitLineClamp: '2',
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
};

const STYLE_TAGS = {
  listStyle: 'none',
  margin: '0px',
  padding: '0px',
  fontSize: '11px',
  marginBottom: '3px'
};

const STYLE_TAG = {
  display: 'inline-block',
  background: '#337ab7',
  color: SharedStyle.COLORS.white,
  padding: '1px 4px',
  marginRight: '3px',
};

const toolIconStyle = {
  fontSize: '1.3em',
  marginTop: '5px',
  color: SharedStyle.COLORS.white,
  flexShrink: 0
};

const STYLE_TOOLTIP = {
  position: 'absolute',
  width: '65px',
  color: SharedStyle.COLORS.white,
  background: SharedStyle.COLORS.black,
  minHeight: '22px',
  height: 'auto',
  padding: '2px 2px',
  textAlign: 'center',
  visibility: 'visible',
  borderRadius: '4px',
  opacity: '0.8',
  left: '100%',
  top: '50%',
  marginTop: '-11px',
  marginLeft: '5px',
  zIndex: '999',
  fontSize: '11px',
  whiteSpace: 'normal',
  wordWrap: 'break-word'
};

const STYLE_TOOLTIP_PIN = {
  position: 'absolute',
  top: '50%',
  right: '100%',
  marginTop: '-4px',
  marginRight: '-1px',
  width: '0',
  height: '0',
  borderRight: '4px solid #000000',
  borderTop: '4px solid transparent',
  borderBottom: '4px solid transparent'
};

export default class CatalogItemTool extends Component {

  constructor(props) {
    super(props);
    this.state = {hover: false};
  }

  select() {
    let element = this.props.element;

    switch (element.prototype) {
      case 'lines':
        this.context.linesActions.selectToolDrawingLine(element.name);
        break;
    }

    this.context.projectActions.pushLastSelectedCatalogElementToHistory(element);
  }

  render() {
    let element = this.props.element;
    let hover = this.state.hover;
    let IconComponent = this.props.icon || FaPencilAlt;

    return (
      <div
        style={hover ? STYLE_BOX_HOVER : STYLE_BOX}
        onClick={e => this.select()}
        onMouseEnter={e => this.setState({hover: true})}
        onMouseLeave={e => this.setState({hover: false})}
      >
        <IconComponent style={toolIconStyle}/>
        {hover && (
          <div style={STYLE_TOOLTIP}>
            {element.info.title}
            <div style={STYLE_TOOLTIP_PIN}></div>
          </div>
        )}
        <ul style={STYLE_TAGS}>
          {element.info.tag.map((tag, index) => <li style={STYLE_TAG} key={index}>{tag}</li>)}
        </ul>
        <div style={STYLE_DESCRIPTION}>{element.info.description}</div>
      </div>
    );
  }
}

CatalogItemTool.propTypes = {
  element: PropTypes.object.isRequired,
  icon: PropTypes.elementType,
};

CatalogItemTool.contextTypes = {
  itemsActions: PropTypes.object.isRequired,
  linesActions: PropTypes.object.isRequired,
  holesActions: PropTypes.object.isRequired,
  projectActions: PropTypes.object.isRequired
};
