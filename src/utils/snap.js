import {Map, List, Record} from 'immutable';
import * as Geometry from './geometry';

export const SNAP_POINT = 'SNAP_POINT';
export const SNAP_LINE = 'SNAP_LINE';
export const SNAP_SEGMENT = 'SNAP_SEGMENT';
export const SNAP_GRID = 'SNAP_GRID';
export const SNAP_GUIDE = 'SNAP_GUIDE';

export const SNAP_MASK = new Map({
  SNAP_POINT : true,
  SNAP_LINE : true,
  SNAP_SEGMENT : true,
  SNAP_GRID : false,
  SNAP_GUIDE : true
});

class PointSnap extends Record({
  type: 'point',
  x: -1, y: -1,
  radius: 1, priority: 1,
  related: new List()
}) {
  nearestPoint(x, y) {
    return {
      x: this.x,
      y: this.y,
      distance: Geometry.pointsDistance(this.x, this.y, x, y)
    };
  }
  isNear(x,y,distance){ return ~(this.x - x) + 1 < distance && ~(this.y - y) + 1 < distance; }
}

class LineSnap extends Record({
  type: 'line',
  a: -1, b: -1, c: -1,
  radius: 1, priority: 1,
  related: new List()
}) {
  nearestPoint(x, y) {
    return {
      ...Geometry.closestPointFromLine(this.a, this.b, this.c, x, y),
      distance: Geometry.distancePointFromLine(this.a, this.b, this.c, x, y)
    };
  }
  isNear(x,y,distance){ return true; }
}

class LineSegmentSnap extends Record({
  type: 'line-segment',
  x1: -1, y1: -1, x2: -1, y2: -1,
  radius: 1, priority: 1,
  related: new List()
}) {
  nearestPoint(x, y) {
    return {
      ...Geometry.closestPointFromLineSegment(this.x1, this.y1, this.x2, this.y2, x, y),
      distance: Geometry.distancePointFromLineSegment(this.x1, this.y1, this.x2, this.y2, x, y)
    };
  }
  isNear(x,y,distance){ return true; }
}

class GridSnap extends Record({
  type: 'grid',
  x: -1, y: -1,
  radius: 1, priority: 1,
  related: new List()
}) {
  nearestPoint(x, y) {
    return {
      x: this.x,
      y: this.y,
      distance: Geometry.pointsDistance(this.x, this.y, x, y)
    };
  }
  isNear(x,y,distance){ return ~(this.x - x) + 1 < distance && ~(this.y - y) + 1 < distance; }
}

export function nearestSnap(snapElements, x, y, snapMask) {

  let filter = {
    'point': snapMask.get(SNAP_POINT),
    'line': snapMask.get(SNAP_LINE),
    'line-segment': snapMask.get(SNAP_SEGMENT),
    'grid': snapMask.get(SNAP_GRID)
  };

  return snapElements
  .valueSeq()
  .filter( ( el ) => filter[el.type] && el.isNear(x,y, el.radius) )
  .map(snap => { return {snap, point: snap.nearestPoint(x, y)} })
  .filter(({snap: {radius}, point: {distance}}) => distance < radius)
  .min(
    (
      {snap: { priority : p1 }, point: { distance : d1 }},
      {snap: { priority : p2 }, point: { distance : d2 }}
    ) => p1 === p2 ? ( d1 < d2 ? -1 : 1 ) : ( p1 > p2 ? -1 : 1 )
  );
}


// this code is perfect for collision detection between items 
// export function nearestSnap(snapElements, x, y, snapMask) {
//   // First try non-grid snaps
//   let nonGridSnap = snapElements
//     .valueSeq()
//     .filter(el => el.type !== 'grid' && filter[el.type])
//     .map(snap => { return {snap, point: snap.nearestPoint(x, y)} })
//     .filter(({snap: {radius}, point: {distance}}) => distance < radius)
//     .min((a, b) => a.point.distance - b.point.distance);

//   if (nonGridSnap) return nonGridSnap;

// }

export function nearestGridSnap(state, layerID, x, y) {
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
}

export function addPointSnap(snapElements, x, y, radius, priority, related) {
  related = new List([related]);
  return snapElements.push(new PointSnap({x, y, radius, priority, related}));
}

export function addLineSnap(snapElements, a, b, c, radius, priority, related) {
  related = new List([related]);

  return snapElements.withMutations(snapElements => {

    let alreadyPresent = snapElements.some(lineSnap =>
    lineSnap.type === 'line' &&
    a === lineSnap.a &&
    b === lineSnap.b &&
    c === lineSnap.c);
    if (alreadyPresent) return snapElements;

    let intersections = snapElements
      .valueSeq()
      .filter(snap => snap.type === 'line')
      .map(snap => Geometry.twoLinesIntersection(snap.a, snap.b, snap.c, a, b, c))
      .filter(intersection => intersection !== undefined)
      .forEach(({x, y}) => addPointSnap(snapElements, x, y, 20, 40));

    snapElements.push(new LineSnap({a, b, c, radius, priority, related}));
  })
}

export function addLineSegmentSnap(snapElements, x1, y1, x2, y2, radius, priority, related) {
  related = new List([related]);
  return snapElements.push(new LineSegmentSnap({x1, y1, x2, y2, radius, priority, related}));
}

export function addGridSnap(snapElements, x, y, radius, priority, related) {
  related = new List([related]);
  return snapElements.push(new GridSnap({x, y, radius, priority, related}));
}
