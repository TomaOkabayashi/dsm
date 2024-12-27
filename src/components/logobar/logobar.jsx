import CompanyLogo from '../icons/companyLogo';
import LogobarButton from './logobar-buttons';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import If from '../../utils/react-if';

import * as SharedStyle from '../../shared-style';


const logobarstyle = {
  position: 'absolute',
  top: 0,
  backgroundColor: SharedStyle.MATERIAL_COLORS[500].grey,
  zIndex: '9001',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '50px',
  height: '50px'
};

const sortButtonsCb = (a, b) => {
  if (a.index === undefined || a.index === null) {
    a.index = Number.MAX_SAFE_INTEGER;
  }

  if (b.index === undefined || b.index === null) {
    b.index = Number.MAX_SAFE_INTEGER;
  }

  return a.index - b.index;
};

const mapButtonsCb = (el, ind) => {
  return (
    <If
      key={ind}
      condition={el.condition}
      style={{ position: 'relative' }}
    >
      {el.dom}
    </If>
  );
};

export default class Logobar extends Component {

  constructor(props, context) {
    super(props, context);
    this.state = {};
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.props.state.mode !== nextProps.state.mode ||
      this.props.height !== nextProps.height ||
      this.props.width !== nextProps.width ||
      this.props.state.alterate !== nextProps.state.alterate;
  }

  render() {

    let {
      props: { state, width, height, logobarButtons },
      context: { projectActions }
    } = this;

    let mode = state.get('mode');

    
    let sorter = [
      {
        index: 0, 
        condition: true,
        dom: <LogobarButton onClick={event => window.open('https://www.inpex.com.au/', '_blank')}>
          <CompanyLogo/>
        </LogobarButton>
        // height and width of the logo image is hard coded in the svg file
      },
    ];

    sorter = sorter.concat(logobarButtons.map((Component, key) => {
      return Component.prototype ? //if is a react component
        {
          condition: true,
          dom: React.createElement(Component, { mode, state, key })
        } :
        {                           //else is a sortable menubar button
          index: Component.index,
          condition: Component.condition,
          dom: React.createElement(Component.dom, { mode, state, key })
        };
    }));

    return (
      <aside style={{ ...logobarstyle, maxWidth: width, maxHeight: height }} className='logobar'>
        {sorter.sort(sortButtonsCb).map(mapButtonsCb)}
      </aside>
    )
  }
}

Logobar.propTypes = {
  state: PropTypes.object.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  logobarButtons: PropTypes.array
};

Logobar.contextTypes = {
  projectActions: PropTypes.object.isRequired,
  linesActions: PropTypes.object.isRequired,
  holesActions: PropTypes.object.isRequired,
  itemsActions: PropTypes.object.isRequired
};
