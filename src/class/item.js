import { Layer, Group } from './export';
import {
  IDBroker,
  NameGenerator,
  GeometryUtils,
  SnapUtils,
  SnapSceneUtils
} from '../utils/export';
import { Map, List, fromJS } from 'immutable';

import {
  MODE_IDLE,
  MODE_DRAWING_ITEM,
  MODE_DRAGGING_ITEM,
  MODE_ROTATING_ITEM
} from '../constants';


class Item{

  static create( state, layerID, type, x, y, width, height, rotation ) {
    let itemID = IDBroker.acquireID();

    let item = state.catalog.factoryElement(type, {
      id: itemID,
      name: NameGenerator.generateName('items', state.catalog.getIn(['elements', type, 'info', 'title'])),
      type,
      height,
      width,
      x,
      y,
      rotation,
    });

    state = state.setIn(['scene', 'layers', layerID, 'items', itemID], item);

    return { updatedState: state, item };
  }

  static select( state, layerID, itemID ){
    state = Layer.select( state, layerID ).updatedState;
    state = Layer.selectElement( state, layerID, 'items', itemID ).updatedState;

    return {updatedState: state};
  }

  static remove( state, layerID, itemID ) {
    state = this.unselect( state, layerID, itemID ).updatedState;
    state = Layer.removeElement( state, layerID, 'items', itemID ).updatedState;

    state.getIn(['scene', 'groups']).forEach( group => state = Group.removeElement(state, group.id, layerID, 'items', itemID).updatedState );

    return { updatedState: state };
  }

  static unselect( state, layerID, itemID ) {
    state = Layer.unselect( state, layerID, 'items', itemID ).updatedState;

    return { updatedState: state };
  }

  static selectToolDrawingItem(state, sceneComponentType) {
    state = state.merge({
      mode: MODE_DRAWING_ITEM,
      drawingSupport: new Map({
        type: sceneComponentType
      })
    });

   
    return { updatedState: state };
  }

  static updateDrawingItem(state, layerID, x, y) {
    if (state.hasIn(['drawingSupport','currentID'])) {
      state = state.updateIn(['scene', 'layers', layerID, 'items', state.getIn(['drawingSupport','currentID'])], item => item.merge({x, y}));
    }
    else {
      // if not item is being drawn, make new item with default values
      let { updatedState: stateI, item } = this.create( state, layerID, state.getIn(['drawingSupport','type']), x, y, 200, 100, 0);
      state = Item.select( stateI, layerID, item.id ).updatedState;
      state = state.setIn(['drawingSupport','currentID'], item.id);
    }

    return { updatedState: state };
  }

  static endDrawingItem(state, layerID, x, y) {
    let catalog = state.catalog;

    state = this.updateDrawingItem(state, layerID, x, y, catalog).updatedState;

    state = state.merge({
      mode: MODE_IDLE,
      drawingSupport: Map({
        type: state.drawingSupport.get('type')
      })
    });

    return { updatedState: state };
  }

  static beginDraggingItem(state, layerID, itemID, x, y) {
    let snapElements = SnapSceneUtils.sceneSnapElements(state.scene, new List(), state.snapMask);
    let item = state.getIn(['scene', 'layers', layerID, 'items', itemID]);

    state = state.merge({
      mode: MODE_DRAGGING_ITEM,
      snapElements,
      draggingSupport: Map({
        layerID,
        itemID,
        startPointX: x,
        startPointY: y,
        originalX: item.x,
        originalY: item.y
      })
    });

    return { updatedState: state };
  }
  // checks if the items coordinates are in an area, loading area
  static isCoordsInLoadingArea(state, layerID, x, y) {
    const scene = state.get('scene');
    const areas = scene.getIn(['layers', layerID, 'areas']);
    
    if(!areas) return false;

    let isInArea = false;
    // Use valueSeq() for Immutable.js collections
    areas.valueSeq().forEach(area => {
      const areaVertices = area.get('vertices');
      if(areaVertices) {
        const coordinates = areaVertices.map(vertexID => {
          const vertex = scene.getIn(['layers', layerID, 'vertices', vertexID]);
          return {
            x: vertex.get('x'),
            y: vertex.get('y')
          };
        }).toJS();

        if (coordinates.length > 0) {
          let minX = Math.min(...coordinates.map(c => c.x));
          let maxX = Math.max(...coordinates.map(c => c.x));
          let minY = Math.min(...coordinates.map(c => c.y));
          let maxY = Math.max(...coordinates.map(c => c.y));

          if (x >= minX && x <= maxX && y >= minY && y <= maxY) {
            isInArea = true;
          }
        }
      }
    });

    return isInArea;
  }

  static updateDraggingItem(state, x, y) {
    let {draggingSupport, scene} = state;

    let layerID = draggingSupport.get('layerID');
    let itemID = draggingSupport.get('itemID');
    let startPointX = draggingSupport.get('startPointX');
    let startPointY = draggingSupport.get('startPointY');
    let originalX = draggingSupport.get('originalX');
    let originalY = draggingSupport.get('originalY');

    //this.logItemsOnLayer(state, layerID);

    let item = scene.getIn(['layers', layerID, 'items', itemID]);
    //console.log('Current item ID:', itemID);

    let diffX = startPointX - x;
    let diffY = startPointY - y;

    let newX = originalX - diffX;
    let newY = originalY - diffY;
    
    // check if the item is in a loading area
    let isInArea = this.isCoordsInLoadingArea(state, layerID, newX, newY);
    // Only if the item is in a loading area do we make snap calculations
    if (isInArea) {

      // snap handling
      if (state.snapMask && !state.snapMask.isEmpty()) {

        let itemType = item.get('type');
        let element = state.catalog.getIn(['elements', itemType]).toJS();
        let dims = element.info.dimensions;
        let rotation = item.get('rotation');

        // by the way, depth here means length

        // Determine if the width and depth should be swapped based on rotation
        let isHorizontal = rotation === 90 || rotation === 270 || rotation === -90 || rotation === -270;
        let effectiveWidth = isHorizontal ? dims.depth : dims.width;
        let effectiveDepth = isHorizontal ? dims.width : dims.depth;

        // check left side snaps (standard and offset)
        let leftSnap = SnapUtils.nearestSnap(state.snapElements, newX - effectiveWidth/2, newY, state.snapMask);
        let leftOffsetForward = SnapUtils.nearestSnap(state.snapElements, newX - effectiveWidth/2 + 10, newY, state.snapMask);
        let leftOffsetBack = SnapUtils.nearestSnap(state.snapElements, newX - effectiveWidth/2 - 10, newY, state.snapMask);
        if (leftSnap || leftOffsetForward || leftOffsetBack) {
          if (leftSnap) {
            newX = leftSnap.point.x + effectiveWidth/2;
            newY = leftSnap.point.y;
            state = state.merge({ activeSnapElement: leftSnap.snap });
          } else if (leftOffsetForward) {
            newX = leftOffsetForward.point.x + effectiveWidth/2 - 10;
            newY = leftOffsetForward.point.y;
            state = state.merge({ activeSnapElement: leftOffsetForward.snap });
          } else {
            newX = leftOffsetBack.point.x + effectiveWidth/2 + 10;
            newY = leftOffsetBack.point.y;
            state = state.merge({ activeSnapElement: leftOffsetBack.snap });
          }
        }

        // check right side snaps (standard and offset)
        let rightSnap = SnapUtils.nearestSnap(state.snapElements, newX + effectiveWidth/2, newY, state.snapMask);
        let rightOffsetForward = SnapUtils.nearestSnap(state.snapElements, newX + effectiveWidth/2 + 10, newY, state.snapMask);
        let rightOffsetBack = SnapUtils.nearestSnap(state.snapElements, newX + effectiveWidth/2 - 10, newY, state.snapMask);
        if (rightSnap || rightOffsetForward || rightOffsetBack) {
          if (rightSnap) {
            newX = rightSnap.point.x - effectiveWidth/2;
            newY = rightSnap.point.y;
            state = state.merge({ activeSnapElement: rightSnap.snap });
          } else if (rightOffsetForward) {
            newX = rightOffsetForward.point.x - effectiveWidth/2 - 10;
            newY = rightOffsetForward.point.y;
            state = state.merge({ activeSnapElement: rightOffsetForward.snap });
          } else {
            newX = rightOffsetBack.point.x - effectiveWidth/2 + 10;
            newY = rightOffsetBack.point.y;
            state = state.merge({ activeSnapElement: rightOffsetBack.snap });
          }
        }

        // check top side snaps (standard and offset)
        let topSnap = SnapUtils.nearestSnap(state.snapElements, newX, newY + effectiveDepth/2, state.snapMask);
        let topOffsetForward = SnapUtils.nearestSnap(state.snapElements, newX, newY + effectiveDepth/2 + 10, state.snapMask);
        let topOffsetBack = SnapUtils.nearestSnap(state.snapElements, newX, newY + effectiveDepth/2 - 10, state.snapMask);
        if (topSnap || topOffsetForward || topOffsetBack) {
          if (topSnap) {
            newX = topSnap.point.x;
            newY = topSnap.point.y - effectiveDepth/2;
            state = state.merge({ activeSnapElement: topSnap.snap });
          } else if (topOffsetForward) {
            newX = topOffsetForward.point.x;
            newY = topOffsetForward.point.y - effectiveDepth/2 - 10;
            state = state.merge({ activeSnapElement: topOffsetForward.snap });
          } else {
            newX = topOffsetBack.point.x;
            newY = topOffsetBack.point.y - effectiveDepth/2 + 10;
            state = state.merge({ activeSnapElement: topOffsetBack.snap });
          }
        }

        // check bottom side snaps (standard and offset)
        let bottomSnap = SnapUtils.nearestSnap(state.snapElements, newX, newY - effectiveDepth/2, state.snapMask);
        let bottomOffsetForward = SnapUtils.nearestSnap(state.snapElements, newX, newY - effectiveDepth/2 + 10, state.snapMask);
        let bottomOffsetBack = SnapUtils.nearestSnap(state.snapElements, newX, newY - effectiveDepth/2 - 10, state.snapMask);
        if (bottomSnap || bottomOffsetForward || bottomOffsetBack) {
          if (bottomSnap) {
            newX = bottomSnap.point.x;
            newY = bottomSnap.point.y + effectiveDepth/2;
            state = state.merge({ activeSnapElement: bottomSnap.snap });
          } else if (bottomOffsetForward) {
            newX = bottomOffsetForward.point.x;
            newY = bottomOffsetForward.point.y + effectiveDepth/2 - 10;
            state = state.merge({ activeSnapElement: bottomOffsetForward.snap });
          } else {
            newX = bottomOffsetBack.point.x;
            newY = bottomOffsetBack.point.y + effectiveDepth/2 + 10;
            state = state.merge({ activeSnapElement: bottomOffsetBack.snap });
          }
        }
      }
    }

    // Add collision detection here in future
    
    item = item.merge({
      x: newX,
      y: newY
    });

    state = state.merge({
      scene: scene.mergeIn(['layers', layerID, 'items', itemID], item)
    });

    return { updatedState: state };
  }
    
  static endDraggingItem(state, x, y) {
    state = this.updateDraggingItem(state, x, y).updatedState;
    state = state.merge({ 
      mode: MODE_IDLE,
      snapElements: new List(),
      activeSnapElement: null
    });

    return { updatedState: state };
  }

  static beginRotatingItem(state, layerID, itemID, x, y) {
    state = state.merge({
      mode: MODE_ROTATING_ITEM,
      rotatingSupport: Map({
        layerID,
        itemID
      })
    });

    return { updatedState: state };
  }

  static updateRotatingItem(state, x, y) {
    let {rotatingSupport, scene} = state;

    let layerID = rotatingSupport.get('layerID');
    let itemID = rotatingSupport.get('itemID');
    let item = state.getIn(['scene', 'layers', layerID, 'items', itemID]);

    let deltaX = x - item.x;
    let deltaY = y - item.y;
    let rotation = Math.atan2(deltaY, deltaX) * 180 / Math.PI - 90;

    if (-15 < rotation && rotation < 15) rotation = 0;
    if (-105 < rotation && rotation < -75) rotation = -90;
    if (-195 < rotation && rotation < -165) rotation = -180;
    if (75 < rotation && rotation < 105) rotation = 90;
    if (-280 < rotation && rotation < -260) rotation = 90;

    item = item.merge({
      rotation,
    });

    state = state.merge({
      scene: scene.mergeIn(['layers', layerID, 'items', itemID], item)
    });

    return { updatedState: state };
  }

  static endRotatingItem(state, x, y) {
    state = this.updateRotatingItem(state, x, y).updatedState;
    state = state.merge({ mode: MODE_IDLE });

    return { updatedState: state };
  }

  static setProperties( state, layerID, itemID, properties ) {
    state = state.mergeIn(['scene', 'layers', layerID, 'items', itemID, 'properties'], properties);

    return { updatedState: state };
  }

  static setJsProperties( state, layerID, itemID, properties ) {
    return this.setProperties( state, layerID, itemID, fromJS(properties) );
  }

  static updateProperties( state, layerID, itemID, properties) {
    properties.forEach( ( v, k ) => {
      if( state.hasIn(['scene', 'layers', layerID, 'items', itemID, 'properties', k]) )
        state = state.mergeIn(['scene', 'layers', layerID, 'items', itemID, 'properties', k], v);
    });

    return { updatedState: state };
  }

  static updateJsProperties( state, layerID, itemID, properties) {
    return this.updateProperties( state, layerID, itemID, fromJS(properties) );
  }

  static setAttributes( state, layerID, itemID, itemAttributes) {
    state = state.mergeIn(['scene', 'layers', layerID, 'items', itemID], itemAttributes);
    return { updatedState: state };
  }

  static setJsAttributes( state, layerID, itemID, itemAttributes) {
    itemAttributes = fromJS(itemAttributes);
    return this.setAttributes(state, layerID, itemID, itemAttributes);
  }

  // static logItemsOnLayer(state, layerID) {
  //   const items = state.getIn(['scene', 'layers', layerID, 'items']);
  //   console.log('Items on layer:', items.toJS());
  // }

}

export { Item as default };