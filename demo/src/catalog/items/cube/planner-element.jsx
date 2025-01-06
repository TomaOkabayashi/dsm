import React from 'react';
import { BoxGeometry, MeshBasicMaterial, Mesh, BoxHelper } from 'three';
import { ReactPlannerSharedStyle } from 'react-planner';

// Define constants at the top of the file
const WIDTH = 160;
const DEPTH = 210;
const HEIGHT = 100;

export default {
  name: 'cube',
  prototype: 'items',

  info: {
    title: 'cube',
    tag: ['demo'],
    description: 'Demo item',
    image: require('./cube.png'),
    // Add dimensions object like in cleaningcart
    dimensions: {
      width: WIDTH,
      height: HEIGHT,
      depth: DEPTH
    }
  },

  properties: {
    color: {
      label: 'Color',
      type: 'color',
      defaultValue: ReactPlannerSharedStyle.AREA_MESH_COLOR.unselected
    },
    width: {
      label: 'Width',
      type: 'length-measure',
      defaultValue: {
        length: WIDTH,  // Use constant instead of hardcoded value
        unit: 'cm'
      }
    },
    height: {
      label: 'Height',
      type: 'length-measure',
      defaultValue: {
        length: HEIGHT,  // Use constant instead of hardcoded value
        unit: 'cm'
      }
    },
    depth: {
      label: 'Depth',
      type: 'length-measure',
      defaultValue: {
        length: DEPTH,  // Use constant instead of hardcoded value
        unit: 'cm'
      }
    },
  },

  render2D: (element, layer, scene) => {
    let style = {
      stroke: !element.selected ? ReactPlannerSharedStyle.LINE_MESH_COLOR.unselected : ReactPlannerSharedStyle.MESH_SELECTED,
      strokeWidth: 2,
      fill: element.properties.get('color')
    };

    return (
      <g transform={`translate(${-WIDTH/2}, ${-DEPTH/2})`}>
        <rect x="0" y="0" width={WIDTH} height={DEPTH} style={style} />
      </g>
    );
  },

  render3D: (element, layer, scene) => {
    let w = element.properties.getIn(['width', 'length']);
    let h = element.properties.getIn(['height', 'length']);
    let d = element.properties.getIn(['depth', 'length']);
    let geometry = new BoxGeometry(w, h, d);
    let material = new MeshBasicMaterial({
      color: element.properties.get('color')
    });

    let mesh = new Mesh(geometry, material);

    let box = new BoxHelper(mesh, !element.selected ? ReactPlannerSharedStyle.LINE_MESH_COLOR.unselected : ReactPlannerSharedStyle.MESH_SELECTED );
    box.material.linewidth = 2;
    box.renderOrder = 1000;
    mesh.add(box);

    mesh.position.y = (h / 2);

    return Promise.resolve(mesh);
  }
};
