import React from 'react';
import { createArea, updatedArea } from './area-factory-3d';
import * as SharedStyle from '../../shared-style';
import Translator from '../../translator/translator';

let translator = new Translator();

export default function AreaFactory(name, info, textures) {


  let areaElement = {
    name,
    prototype: 'areas',
    info: {
      ...info,
      visibility: {
        catalog: false,
        layerElementsVisible: false
      },
    },
    properties: {
      name: {
        label: translator.t('Name'),
        type: 'string',
        defaultValue: 'Area',
      },
      patternColor: {
        label: translator.t('Colour'),
        type: 'color',
        defaultValue: SharedStyle.AREA_MESH_COLOR.unselected
      },
      opacity: {
        label: translator.t('Opacity (0-1)'),
        type: 'number',
        defaultValue: 0.5,
        min: 0,
        max: 1
      },
    },
    render2D: function (element, layer) {
      let path = '';

      // Calculate bounds for text positioning
      let xMin = Infinity, yMin = Infinity, xMax = -Infinity, yMax = -Infinity;
      element.vertices.forEach(vertexID => {
        let vertex = layer.vertices.get(vertexID);
        xMin = Math.min(xMin, vertex.x);
        yMin = Math.min(yMin, vertex.y);
        xMax = Math.max(xMax, vertex.x);
        yMax = Math.max(yMax, vertex.y);
      });

      ///print area path
      element.vertices.forEach((vertexID, ind) => {
        let vertex = layer.vertices.get(vertexID);
        path += (ind ? 'L' : 'M') + vertex.x + ' ' + vertex.y + ' ';
      });

      //add holes
      element.holes.forEach(areaID => {
        let area = layer.areas.get(areaID);
        area.vertices.reverse().forEach((vertexID, ind) => {
          let vertex = layer.vertices.get(vertexID);
          path += (ind ? 'L' : 'M') + vertex.x + ' ' + vertex.y + ' ';
        });
      });

      let fill = element.selected ? SharedStyle.AREA_MESH_COLOR.selected : element.properties.get('patternColor');
      let opacity = element.properties.get('opacity');

      return (
        <g>
          <path 
            d={path} 
            fill={fill}
            fillOpacity={opacity}
            stroke={fill}
          />
          <text
            transform={`translate(${(xMin + xMax) / 2}, ${(yMin + yMax) / 2}) scale(1, -1)`}
            style={{textAnchor: 'middle', fontSize: '11px'}}
          >
            {element.name}
          </text>
        </g>
      );
    },

    render3D: function (element, layer, scene) {
      return createArea(element, layer, scene, textures)
    },

    updateRender3D: (element, layer, scene, mesh, oldElement, differences, selfDestroy, selfBuild) => {
      return updatedArea(element, layer, scene, textures, mesh, oldElement, differences, selfDestroy, selfBuild);
    }

  };

  if (textures && textures !== {}) {

    let textureValues = { 'none': 'None' };

    for (let textureName in textures) {
      textureValues[textureName] = textures[textureName].name
    }

    areaElement.properties.texture = {
      label: translator.t('texture'),
      type: 'enum',
      defaultValue: 'none',
      values: textureValues
    };

  }

  return areaElement

}
