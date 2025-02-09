import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Panel from './panel';
import {
  MODE_IDLE, MODE_2D_ZOOM_IN, MODE_2D_ZOOM_OUT, MODE_2D_PAN, MODE_3D_VIEW, MODE_3D_FIRST_PERSON,
  MODE_WAITING_DRAWING_LINE, MODE_DRAWING_LINE, MODE_DRAWING_HOLE, MODE_DRAWING_ITEM, MODE_DRAGGING_LINE,
  MODE_DRAGGING_VERTEX, MODE_DRAGGING_ITEM, MODE_DRAGGING_HOLE, MODE_FITTING_IMAGE, MODE_UPLOADING_IMAGE,
  MODE_ROTATING_ITEM
} from '../../constants';
import * as SharedStyle from '../../shared-style';
import {MdSearch} from 'react-icons/md';

const VISIBILITY_MODE = {
  MODE_IDLE, MODE_2D_ZOOM_IN, MODE_2D_ZOOM_OUT, MODE_2D_PAN, MODE_3D_VIEW, MODE_3D_FIRST_PERSON,
  MODE_WAITING_DRAWING_LINE, MODE_DRAWING_LINE, MODE_DRAWING_HOLE, MODE_DRAWING_ITEM, MODE_DRAGGING_LINE,
  MODE_DRAGGING_VERTEX, MODE_DRAGGING_ITEM, MODE_DRAGGING_HOLE, MODE_FITTING_IMAGE, MODE_UPLOADING_IMAGE,
  MODE_ROTATING_ITEM
};

const contentArea = {
  height: 'auto',
  overflowY: 'auto',
  overflowX: 'hidden',
  paddingLeft: '4em',
  paddingBottom: '5em',
  marginBottom: '1em',
  userSelect: 'none',
  width: '100%',
  boxSizing: 'border-box',
};

const elementStyle = {
  width: 'auto',
  height: '2.5em',
  margin: '0.25em 0.25em 0 0',
  padding: '0.5em',
  textAlign: 'center',
  display: 'inline-block',
  border: '1px solid #CCC',
  borderRadius: '0.2em',
};

const elementSelectedStyle = {
  ...elementStyle,
  color: SharedStyle.SECONDARY_COLOR.main,
  borderColor: SharedStyle.SECONDARY_COLOR.main,
};

const itemElementStyle = elementStyle;

const itemElementSelectedStyle = elementSelectedStyle;

const categoryDividerStyle = {
  paddingBottom: '0.5em',
  borderBottom: '1px solid #888',
  fontSize: '11px',
  fontWeight: 'bold',
};

const tableSearchStyle = {width: '100%', marginTop: '0.1em'};
const searchIconStyle = {fontSize: '1.5em'};
const searchInputStyle = {fontSize: '1em', width: '50%', height: '1em', padding: '1em 0.5em'};

const COLUMN_WIDTHS = {
  dest: '40px',
  con: '40px',
  chkd: '42px',
  container: '120px',
  desc: '190px',
  length: '30px',
  width: '30px',
  height: '30px',
  tare: '40px',
  vgm: '40px',
  classCode: '70px'
};

const HEADER_GRID_CELL = {
  width: '100%',
  height: '30px',
  padding: '0.4em',
  background: `${SharedStyle.MATERIAL_COLORS[500].grey}80`,
  position: 'relative',
  display: 'grid',
  fontSize: '11px',
  fontWeight: 'bold',
  color: SharedStyle.COLORS.white,
  gridTemplateColumns: `${COLUMN_WIDTHS.dest} ${COLUMN_WIDTHS.con} ${COLUMN_WIDTHS.chkd} ${COLUMN_WIDTHS.container} ${COLUMN_WIDTHS.desc} ${COLUMN_WIDTHS.length} ${COLUMN_WIDTHS.width} ${COLUMN_WIDTHS.height} ${COLUMN_WIDTHS.tare} ${COLUMN_WIDTHS.vgm} ${COLUMN_WIDTHS.classCode}`,
  gap: '2px'
};

const HEADER_CELL = {
  width: '100%',
  paddingLeft: '6px',
  paddingTop: '4px',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  fontSize: '11px',
  borderLeft: `2px solid ${SharedStyle.COLORS.black}`,
};

export default class PanelLayerElement extends Component {

  constructor(props, context) {
    super(props, context);

    let layer = props.layers.get(props.selectedLayer);
    let elements = {
      lines: layer.lines,
      holes: layer.holes,
      items: layer.items,
      areas: layer.areas,
    };

    this.state = {
      elements,
      matchString: '',
      matchedElements: elements
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.state.matchString !== nextState.matchString) return true;

    let oldElements = this.state.elements;
    let newElements = nextState.elements;

    if(
      oldElements.lines.hashCode() !== newElements.lines.hashCode() ||
      oldElements.holes.hashCode() !== newElements.holes.hashCode() ||
      oldElements.items.hashCode() !== newElements.items.hashCode() ||
      oldElements.areas.hashCode() !== newElements.areas.hashCode()
    ) return true;

    return false;
  }

  componentWillReceiveProps(nextProps) {
    let layer = nextProps.layers.get(nextProps.selectedLayer);

    if ( this.props.layers.hashCode() === nextProps.layers.hashCode() ) return;

    let elements = {
      lines: layer.lines,
      holes: layer.holes,
      items: layer.items,
      areas: layer.areas,
    };

    if (this.state.matchString !== '') {
      let regexp = new RegExp(this.state.matchString, 'i');
      let filterCb = el => regexp.test(el.get('name'));

      this.setState({
        matchedElements: {
          elements,
          lines: elements.lines.filter(filterCb),
          holes: elements.holes.filter(filterCb),
          items: elements.items.filter(filterCb),
          areas: elements.areas.filter(filterCb),
        }
      });
    } else {
      this.setState({elements, matchedElements: elements});
    }
  }

  matcharray(text) {
    if (text === '') {
      this.setState({
        matchString: '',
        matchedElements: this.state.elements
      });
      return;
    }

    let regexp = new RegExp(text, 'i');
    let filterCb = el => regexp.test(el.get('name'));

    this.setState({
      matchString: text,
      matchedElements: {
        lines: this.state.elements.lines.filter(filterCb),
        holes: this.state.elements.holes.filter(filterCb),
        items: this.state.elements.items.filter(filterCb),
        areas: this.state.elements.areas.filter(filterCb),
      }
    });
  }

  render() {
    if (!VISIBILITY_MODE[this.props.mode]) return null;

    let layer = this.props.layers.get(this.props.selectedLayer);

    return (
      <Panel name={this.context.translator.t('Elements on layer {0}', layer.name)}>
        <div style={contentArea} onWheel={e => e.stopPropagation()}>

          {/* Markups List header and search function */}
          <table style={tableSearchStyle}>
            <tbody>
            <tr>
              <tr>
              <td style={{fontWeight: 'bold', fontSize: 15, paddingRight: '10px'}}>Markups List</td>
              <td style={{width: '2em'}}><MdSearch style={searchIconStyle}/></td>
              <td style={{width: '80%'}}><input type="text" style={searchInputStyle} onChange={(e) => {
                this.matcharray(e.target.value);
              }}/></td>
              </tr>
            </tr>
            </tbody>
          </table>

          {/* Items header and column header */}
          {/* Temporary solution to the border underneath the header. Make a separate container for that in the future*/}
          <p style={{...categoryDividerStyle, borderTop: `1px solid ${SharedStyle.MATERIAL_COLORS[500].grey}`, paddingTop: '10px'}}>{this.context.translator.t('CSV Containers')}</p>
          <div style={HEADER_GRID_CELL}>
            {['DEST','CON','CHKD','Hu/Container','Packaging Mat Desc','L','W','H','Tare','VGM','Class Code'].map((text, index) => (
              <div key={index} style={HEADER_CELL}>
                {text}
              </div>
            ))}
          </div>
          
          {/* Containers from CSV */}
          {
            this.state.matchedElements.items.count() ?
              <div>
                {
                  this.state.matchedElements.items.entrySeq()
                    .filter(([itemID, item]) => {
                      const info = item.get('info').toJS();
                      return !info.tag || info.tag[0] !== 'example test container';
                    })
                    .map(([itemID, item]) => {
                    const info = item.get('info').toJS();
                    const metadata = info.metadata;
                    const dimensions = info.dimensions;
                    
                    const values = [
                      metadata.destination || 'null',  // DEST
                      metadata.container || 'null',    // CON
                      metadata.chkd || 'null',        // CHKD
                      metadata.containerID || 'null',  // Hu/Container
                      metadata.description || 'null',  // Packaging Mat Desc
                      dimensions.depth || 'null',      // L (depth is length in the UI)
                      dimensions.width || 'null',      // W
                      dimensions.height || 'null',     // H
                      metadata.tare || 'null',        // Tare
                      metadata.vgm || 'null',         // VGM
                      metadata.classCode || 'null'     // Class Code
                    ];

                    const gridStyle = {
                      display: 'grid',
                      gridTemplateColumns: `${COLUMN_WIDTHS.dest} ${COLUMN_WIDTHS.con} ${COLUMN_WIDTHS.chkd} ${COLUMN_WIDTHS.container} ${COLUMN_WIDTHS.desc} ${COLUMN_WIDTHS.length} ${COLUMN_WIDTHS.width} ${COLUMN_WIDTHS.height} ${COLUMN_WIDTHS.tare} ${COLUMN_WIDTHS.vgm} ${COLUMN_WIDTHS.classCode}`,
                      gap: '2px',
                      padding: '0.4em',
                      margin: '4px 0',
                      backgroundColor: item.selected ? SharedStyle.SECONDARY_COLOR.main : '#ffffff',
                      color: item.selected ? '#ffffff' : '#000000',
                    };

                    const cellStyle = {
                      width: '100%',
                      paddingLeft: '6px',
                      paddingTop: '2px',
                      paddingBottom: '2px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      fontSize: '11px',
                      borderLeft: `2px solid ${SharedStyle.COLORS.black}`,
                    };

                    console.log('Item structure:', item.toJS());
                    return (
                      <div
                        key={itemID}
                        onClick={e => this.context.itemsActions.selectItem(layer.id, item.id)}
                        style={gridStyle}
                      >
                        {values.map((value, index) => (
                          <div key={index} style={cellStyle}>
                            {value}
                          </div>
                        ))}
                      </div>
                    );
                  })
                }
              </div>
              : null
          }

          {/* Generic Containers */}
          {
            this.state.matchedElements.items.count() ?
              <div>
                <p style={categoryDividerStyle}>{this.context.translator.t('Generic Containers')}</p>
                {
                  this.state.matchedElements.items.entrySeq()
                    .filter(([itemID, item]) => {
                      const info = item.get('info').toJS();
                      return info.tag && info.tag[0] === 'example test container';
                    })
                    .map(([itemID, item]) => {
                      return (
                        <div
                          key={itemID}
                          onClick={e => this.context.itemsActions.selectItem(layer.id, item.id)}
                          style={item.selected ? elementSelectedStyle : elementStyle}
                        >
                          {item.name}
                        </div>
                      )
                    })
                }
              </div>
              : null
          }

          {/* Areas, the loading bays */}
          {
            this.state.matchedElements.areas.count() ?
              <div>
                <p style={categoryDividerStyle}>{this.context.translator.t('Areas')}</p>
                {
                  this.state.matchedElements.areas.entrySeq().map(([areaID, area]) => {
                    return (
                      <div
                        key={areaID}
                        onClick={e => this.context.areaActions.selectArea(layer.id, area.id)}
                        style={area.selected ? elementSelectedStyle : elementStyle}
                      >
                        {area.name}
                      </div>
                    )
                  })
                }
              </div>
              : null
          }

          {/* Access tool gates in area walls*/}
          {
            this.state.matchedElements.holes.count() ?
              <div>
                <p style={categoryDividerStyle}>{this.context.translator.t('Gates')}</p>
                {
                  this.state.matchedElements.holes.entrySeq().map(([holeID, hole]) => {
                    return (
                      <div
                        key={holeID}
                        onClick={e => this.context.holesActions.selectHole(layer.id, hole.id)}
                        style={hole.selected ? elementSelectedStyle : elementStyle}
                      >
                        {hole.name}
                      </div>
                    )
                  })
                }
              </div>
              : null
          }

          {/* The vertices that make up the areas/loading bays */}
          {
            this.state.matchedElements.lines.count() ?
              <div>
                <p style={categoryDividerStyle}>{this.context.translator.t('Lines')}</p>
                {
                  this.state.matchedElements.lines.entrySeq().map(([lineID, line]) => {
                    return (
                      <div
                        key={lineID}
                        onClick={e => this.context.linesActions.selectLine(layer.id, line.id)}
                        style={line.selected ? elementSelectedStyle : elementStyle}
                      >
                        {line.name}
                      </div>
                    )
                  })
                }
              </div>
              : null
          }

        </div>
      </Panel>
    );
  }

}

PanelLayerElement.propTypes = {
  mode: PropTypes.string.isRequired,
  layers: PropTypes.object.isRequired,
};

PanelLayerElement.contextTypes = {
  catalog: PropTypes.object.isRequired,
  translator: PropTypes.object.isRequired,
  itemsActions: PropTypes.object.isRequired,
  linesActions: PropTypes.object.isRequired,
  holesActions: PropTypes.object.isRequired,
  areaActions: PropTypes.object.isRequired,
  projectActions: PropTypes.object.isRequired
};
