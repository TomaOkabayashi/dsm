import {
  SNAP_POINT,
  SNAP_LINE,
  SNAP_SEGMENT,
  SNAP_GRID,
  SNAP_GUIDE,
  addPointSnap,
  addLineSnap,
  addLineSegmentSnap,
  addGridSnap
} from './snap';
import { GeometryUtils } from './export';
import { Map, List } from 'immutable';

export function sceneSnapElements(scene, snapElements = new List(), snapMask = new Map()) {

  let { width, height } = scene;

  let a, b, c;
  return snapElements.withMutations(snapElements => {
    scene.layers.forEach(layer => {

      let { lines, vertices } = layer;

      vertices.forEach(({ id: vertexID, x, y }) => {

        if (snapMask.get(SNAP_POINT)) {
          addPointSnap(snapElements, x, y, 10, 10, vertexID);
        }

        if (snapMask.get(SNAP_LINE)) {
          ({ a, b, c } = GeometryUtils.horizontalLine(y));
          addLineSnap(snapElements, a, b, c, 10, 5, vertexID);
          ({ a, b, c } = GeometryUtils.verticalLine(x));
          addLineSnap(snapElements, a, b, c, 10, 5, vertexID);
        }

      });

      if (snapMask.get(SNAP_SEGMENT)) {
        lines.forEach(({ id: lineID, vertices: [v0, v1] }) => {
          let { x: x1, y: y1 } = vertices.get(v0);
          let { x: x2, y: y2 } = vertices.get(v1);

          addLineSegmentSnap(snapElements, x1, y1, x2, y2, 20, 1, lineID);
        });
      }

    });

    if (snapMask.get(SNAP_GRID)) {
      let divider = 5;
      let gridCellSize = 100 / divider;

      // On the layer - Get all areas and their area bounds (vertices of areas)
      // Only create snap points on the 'areas', this is so snap points are not made on every corner
      // , greatly improving performance and reduce redundant storing of snap points on grid
      let selectedLayerID = scene.selectedLayer;
      const areas = scene.getIn(['layers', selectedLayerID, 'areas']);

      if (areas) {
        areas.valueSeq().forEach(area => {
          const areaVertices = area.get('vertices');
          if (areaVertices) {
            const coordinates = areaVertices.map(vertexID => {
              const vertex = scene.getIn(['layers', selectedLayerID, 'vertices', vertexID]);
              return {
                x: vertex.get('x'),
                y: vertex.get('y')
              };
            }).toJS();

            let minX = Math.min(...coordinates.map(c => c.x));
            let maxX = Math.max(...coordinates.map(c => c.x));
            let minY = Math.min(...coordinates.map(c => c.y));
            let maxY = Math.max(...coordinates.map(c => c.y));

            // Create grid points within the boundaries of the area
            let startX = Math.floor(minX / gridCellSize) * gridCellSize;
            let startY = Math.floor(minY / gridCellSize) * gridCellSize;
            let endX = Math.ceil(maxX / gridCellSize) * gridCellSize;
            let endY = Math.ceil(maxY / gridCellSize) * gridCellSize;

            for (let x = startX; x <= endX; x += gridCellSize) {
              for (let y = startY; y <= endY; y += gridCellSize) {
                let gridX = Math.round(x / gridCellSize);
                let gridY = Math.round(y / gridCellSize);
                let onXCross = !(gridX % divider);
                let onYCross = !(gridY % divider);

                addGridSnap(snapElements, x, y, 6, onXCross && onYCross ? 20 : 10, null);
              }
            }
          }
        });
      }
    }

    if (snapMask.get(SNAP_GUIDE)) {

      let horizontal = scene.getIn(['guides', 'horizontal']);
      let vertical = scene.getIn(['guides', 'vertical']);

      let hValues = horizontal.valueSeq();
      let vValues = vertical.valueSeq();

      hValues.forEach(hVal => {
        vValues.forEach(vVal => {
          addPointSnap(snapElements, vVal, hVal, 10, 10);
        });
      });

      hValues.forEach(hVal => addLineSegmentSnap(snapElements, 0, hVal, width, hVal, 20, 1));
      vValues.forEach(vVal => addLineSegmentSnap(snapElements, vVal, 0, vVal, height, 20, 1));

    }

  })
}
