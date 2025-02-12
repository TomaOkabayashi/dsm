import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as SharedStyle from './shared-style';

import Translator from './translator/translator';
import Catalog from './catalog/catalog';
import actions from './actions/export';
import {objectsMap} from './utils/objects-utils';
import {
  LogobarComponents,
  MenubarComponents,
  UtilitybarComponents,
  ToolbarComponents,
  SidebarComponents,
  MarkupsListComponents,
  Content,
  FooterBarComponents
} from './components/export';
import {VERSION} from './version';
import './styles/export';
import CatalogList from './components/catalog-view/catalog-list';
import { MODE_3D_FIRST_PERSON, MODE_3D_VIEW } from './constants';

const {Logobar} = LogobarComponents;
const {Menubar} = MenubarComponents;
const {Utilitybar} = UtilitybarComponents;
const {Toolbar} = ToolbarComponents;
const {Sidebar} = SidebarComponents;
const {MarkupsList} = MarkupsListComponents;
const {FooterBar} = FooterBarComponents;

const logobarH = 50;
const logobarW = 50;
const menubarH = 25;
const utilitybarH = 25;
const toolbarW = 50;
const footerBarH= 31;

const wrapperStyle = {
  display: 'flex',
  flexFlow: 'column nowrap',
  height: '100%',
  postition: 'relative'
};

const logobarStyle = {
  position: 'absolute',
  top: 0,
  height: '50px',
  width: '50px'
};

const menubarStyle = {
  position: 'absolute',
  top: 0,
  left: logobarW,
  width: 'calc(100% - 50px)'
};

const utilitybarStyle = {
  position: 'absolute',
  top: menubarH,
  left: logobarW,
  width: 'calc(100% - 50px)'
};

const catalogListStyle = {
  position: 'relative',
  height: '100%',
  zIndex: 1
};

const contentStyle = {
  flex: '1 1 auto',
  position: 'relative',
  overflow: 'hidden'
};

class ReactPlanner extends Component {

  getChildContext() {
    return {
      ...objectsMap(actions, actionNamespace => this.props[actionNamespace]),
      translator: this.props.translator,
      catalog: this.props.catalog,
    }
  }

  componentWillMount() {
    let {store} = this.context;
    let {projectActions, catalog, stateExtractor, plugins} = this.props;
    plugins.forEach(plugin => plugin(store, stateExtractor));
    projectActions.initCatalog(catalog);
  }

  componentWillReceiveProps(nextProps) {
    let {stateExtractor, state, projectActions, catalog} = nextProps;
    let plannerState = stateExtractor(state);
    let catalogReady = plannerState.getIn(['catalog', 'ready']);
    if (!catalogReady) {
      projectActions.initCatalog(catalog);
    }
  }

  render() {
    let {width, height, state, stateExtractor, ...props} = this.props;

    let extractedState = stateExtractor(state);
    let mode = extractedState.get('mode');

    const catalogWidth = extractedState.get('catalogWidth') || 200;
    const sidebarWidth = extractedState.get('sidebarWidth') || 280;
    const markupsListHeight = extractedState.get('markupsListHeight') || 265;

    let markupsListH = markupsListHeight;
    let markupsListW = width - sidebarWidth;

    // left sidebar
    let catalogW = catalogWidth - 10; //some overhead, very pragmatic solution
    let catalogH = height - markupsListH - footerBarH - menubarH - utilitybarH;

    // right sidebar
    let sidebarW = sidebarWidth;
    let sidebarH = height - markupsListH - footerBarH - menubarH - utilitybarH;

    // grid
    let contentW = width - sidebarW - catalogW;
    let contentH = height - footerBarH - menubarH - utilitybarH;

    // 3D mode
    let in3DModeW = width - sidebarW;

    // catalog (leftsidebar) and content (grid)
    // Don't add zIndex to this, messes the rightSidebar layer
    const mainContentRowStyle = {
      display: 'flex',
      flexFlow: 'row nowrap',
      marginTop: menubarH + utilitybarH,
      height: `calc(100% - ${(menubarH + utilitybarH + footerBarH)}px)`,
      overflow: 'hidden',
      postition: 'relative',
    };

    const rightContainerStyle = {
      display: 'flex',
      flexDirection: 'row',
      height: '100%',
      position: 'relative',
      zIndex: 100
    }

    const sidebarContainerStyle = {
      height: 'calc(100% + 20px)',
      position: 'relative',
    }

    const sidebarStyle = {
      height: '100%',
      backgroundColor: SharedStyle.PRIMARY_COLOR.main,
      overflowY: 'auto',
      display: 'flex',
      flexDirection: 'column',
      flex: 1,
    };

    const markupContainerStyle = {
      width: `calc(100% - ${sidebarWidth}px)`,
      bottom: 0,
      position: 'absolute',
      zIndex: 99,
      left: 0
    };
    
    const markupsListStyle = {
      position: 'relative',
      backgroundColor: SharedStyle.PRIMARY_COLOR.main,
      overflowY: 'auto',
      overflowX: 'auto',
      width: '100%'
    };

    return (
      <div
        style={{...wrapperStyle, height}}
        onClick={() => {
          // When clicking anywhere in the main container, blur any focused elements
          if (document.activeElement) {
            document.activeElement.blur();
          }
        }}
      >
        {/* The company logo */}
        <div style={logobarStyle}>
          <Logobar width={logobarW} height={logobarH} state={extractedState} {...props} />
        </div>

        {/* top bar */}
        <div style={menubarStyle}>
          <Menubar width={width} height={menubarH} state={extractedState} {...props} />
        </div>

        {/* below top bar */}
        <div style={utilitybarStyle}>
          <Utilitybar width={width} height={utilitybarH} state={extractedState} {...props} />
        </div>

        {/* main content */}
          <div style={mainContentRowStyle}>

            {/* catalog on left side */}
            <div style={catalogListStyle}>
              <CatalogList width={mode === MODE_3D_FIRST_PERSON || mode === MODE_3D_VIEW ? 0 : catalogW} 
              height={catalogH} state={extractedState} {...props} />
            </div>

            {/* the grid */}
            <div style={contentStyle}>
              <Content width={mode === MODE_3D_FIRST_PERSON || mode === MODE_3D_VIEW ? in3DModeW : contentW} 
              height={contentH} state={extractedState} {...props} onWheel={event => event.preventDefault()} />
            </div>

            {/* right column containing sidebar and markup list */}
            <div style={rightContainerStyle}>
              {/* right sidebar */}
              <div style={sidebarContainerStyle}>
                <div style={sidebarStyle}>
                  <Sidebar width={sidebarW} height='100%' state={extractedState} {...props} />
                </div>
              </div>

            </div>
          </div>

        <div style={markupContainerStyle}>
          {/* markups List */}
          <div style={markupsListStyle}>
            <MarkupsList width={markupsListW} height={markupsListHeight} state={extractedState} {...props} />
          </div>
        </div>
          
        <FooterBar width={width} height={footerBarH} state={extractedState} {...props} />
      </div>
    );
  }
}

ReactPlanner.propTypes = {
  translator: PropTypes.instanceOf(Translator),
  catalog: PropTypes.instanceOf(Catalog),
  allowProjectFileSupport: PropTypes.bool,
  plugins: PropTypes.arrayOf(PropTypes.func),
  autosaveKey: PropTypes.string,
  autosaveDelay: PropTypes.number,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  stateExtractor: PropTypes.func.isRequired,
  logoBarButtons: PropTypes.array,
  menuBarButtons: PropTypes.array,
  utilityBarButtons: PropTypes.array,
  toolbarButtons: PropTypes.array,
  sidebarComponents: PropTypes.array,
  footerbarComponents: PropTypes.array,
  customContents: PropTypes.object,
  softwareSignature: PropTypes.string
};

ReactPlanner.contextTypes = {
  store: PropTypes.object.isRequired,
};

ReactPlanner.childContextTypes = {
  ...objectsMap(actions, () => PropTypes.object),
  translator: PropTypes.object,
  catalog: PropTypes.object,
};

ReactPlanner.defaultProps = {
  translator: new Translator(),
  catalog: new Catalog(),
  plugins: [],
  allowProjectFileSupport: true,
  softwareSignature: `React-Planner ${VERSION}`,
  logobarButtons: [],
  menubarButtons: [],
  utilitybarButtons: [],
  toolbarButtons: [],
  sidebarComponents: [],
  footerbarComponents: [],
  customContents: {},
};

//redux connect
function mapStateToProps(reduxState) {
  return {
    state: reduxState
  }
}

function mapDispatchToProps(dispatch) {
  return objectsMap(actions, actionNamespace => bindActionCreators(actions[actionNamespace], dispatch));
}

export default connect(mapStateToProps, mapDispatchToProps)(ReactPlanner);