import React from 'react';

// Door
import * as Three from 'three';
// Container
import { BoxGeometry, MeshBasicMaterial, Mesh, BoxHelper } from 'three';

import { ReactPlannerSharedStyle } from 'react-planner';

//------------DOOR-----------
const black = new Three.MeshLambertMaterial({color : 0x000000});
const green = new Three.MeshLambertMaterial( {color : 0x348781});
const red = new Three.MeshLambertMaterial({color : 0xFF0000});
const turquoise = new Three.MeshLambertMaterial({color : 0x43C6DB,opacity :0.7,transparent: true});
const metalBlue = new Three.MeshLambertMaterial({color : 0xB7CEEC});
const darkGrey = new Three.MeshLambertMaterial({color : 0x313131});
const darkGrey2 = new Three.MeshLambertMaterial({color : 0x212121});
const metalBlueGrey = new Three.MeshLambertMaterial({color : 0x566D7E});


function makePanicDoor() {

  let panicDoorDouble = new Three.Mesh();
  let doorLeft = makeDoorStructure();
  let doorRight = makeDoorStructure();
  let handle = makeHandle();
  let doorLeftPivot = makePivot();
  let doorRightPivot = makePivot();
  let safetyHandleLeft = makeSafetyHandle();
  let safetyHandleRight = makeSafetyHandle();
  let lock = makeLock();
  let doorLockLeft = makeDoorLock();
  let doorLockRight = makeDoorLock();
  lock.position.set(-0.05, -0.02, 0.03);
  handle.position.set(-0.47 / 2, 0.85 / 2, -0.03);
  doorLeftPivot.position.set(0.595 / 2, 0, -0.06 / 2);
  doorRightPivot.position.set(0.6 / 2, 0, 0.077 / 2);
  doorRight.rotation.y = Math.PI;
  doorRight.position.set(-0.35 / 2 - 0.084, 0, 0.0043);
  doorLeft.position.set(0.35 / 2 + 0.084, 0, -0.0043);
  safetyHandleLeft.position.set(0, 0.4, 0.06 / 2);
  safetyHandleRight.position.set(0, 0.4, -0.062 / 2);
  handle.add(lock);
  doorLeft.add(handle);
  doorLeft.add(safetyHandleLeft);
  doorRight.add(safetyHandleRight);
  doorLeft.add(doorLeftPivot);
  panicDoorDouble.add(doorLeft);
  doorRight.add(doorRightPivot);
  doorLeft.add(doorLockLeft);
  doorRight.add(doorLockRight);
  panicDoorDouble.add(doorRight);

  return panicDoorDouble
}

function makeDoorLock() {

  let block = new Three.Object3D();
  let DoorLockGeometry1 = new Three.CylinderGeometry(0.012, 0.012, 1.905, Math.round(32));
  let DoorLockGeometry2 = new Three.CylinderGeometry(0.007, 0.007, 1.907, Math.round(32));
  let DoorLock1 = new Three.Mesh(DoorLockGeometry1, metalBlue);
  let DoorLock2 = new Three.Mesh(DoorLockGeometry2, metalBlueGrey);
  block.position.set(-0.275, 0.7 / 2, 0);
  block.scale.x = 1 / 1.3;
  DoorLock1.add(DoorLock2);
  block.add(DoorLock1);

  return block;
}

function makeLock() {

  let mechanism = new Three.Object3D();
  let BaseGeometry = new Three.BoxGeometry(0.01, 0.1, 0.02);
  let FirstBlockGeometry = new Three.BoxGeometry(0.01, 0.02, 0.01);
  let SecondBlockGeometry = new Three.BoxGeometry(0.006, 0.04, 0.008);
  let base = new Three.Mesh(BaseGeometry, metalBlue);
  let FirstBlock = new Three.Mesh(FirstBlockGeometry, metalBlueGrey);
  let SecondBlock = new Three.Mesh(SecondBlockGeometry, metalBlueGrey);
  FirstBlock.position.set(-0.008 / 2, 0.03, 0);
  SecondBlock.position.y = -0.05;
  FirstBlock.add(SecondBlock);
  base.add(FirstBlock);
  mechanism.add(base);

  return mechanism;
}

function makeSafetyHandle() {

  let handle = new Three.Object3D();
  let handleSupportGeometry = new Three.BoxGeometry(0.5, 0.1, 0.005);
  let PushButtonGeometry = new Three.CylinderGeometry(0.04, 0.04, 0.48, Math.round(32 ));
  let PushButtonCoverGeometry = new Three.CylinderGeometry(0.042, 0.042, 0.01, Math.round(32 ));
  let handleSupport = new Three.Mesh(handleSupportGeometry, black);
  let pushButton = new Three.Mesh(PushButtonGeometry, red);
  let pushButtonCover1 = new Three.Mesh(PushButtonCoverGeometry, black);
  let pushButtonCover2 = new Three.Mesh(PushButtonCoverGeometry, black);
  handleSupport.position.z = 0.005 / 2;
  pushButton.rotation.z = Math.PI / 2;
  pushButtonCover1.position.y = 0.48 / 2 + 0.01 / 2;
  pushButtonCover2.position.y = -0.48 / 2 - 0.01 / 2;
  pushButton.add(pushButtonCover1);
  pushButton.add(pushButtonCover2);
  handleSupport.add(pushButton);
  handle.add(handleSupport);

  return handle;
}

function makePivot() {

  let DoorPivot = new Three.Object3D();
  let DownPivotGeometry = new Three.CylinderGeometry(0.009, 0.009, 0.04, Math.round(32 ));
  let UpPivotGeometry = new Three.CylinderGeometry(0.01, 0.01, 0.04, Math.round(32 ));
  let downPivot1 = new Three.Mesh(DownPivotGeometry, green);
  let upPivot1 = new Three.Mesh(UpPivotGeometry, green);
  let downPivot2 = new Three.Mesh(DownPivotGeometry, green);
  let upPivot2 = new Three.Mesh(UpPivotGeometry, green);
  downPivot1.position.y = -0.4;
  upPivot1.position.y = 0.04;
  downPivot2.position.y = 1;
  upPivot2.position.y = 0.04;
  downPivot2.add(upPivot2);
  downPivot1.add(upPivot1);
  DoorPivot.add(downPivot2);
  DoorPivot.add(downPivot1);

  return DoorPivot;
}

function makeHandle() {

  let handle = new Three.Object3D();
  let handleBase = makeHandleBase();
  let hilt = makeHilt();
  hilt.rotation.x = Math.PI / 2;
  hilt.position.set(0, 0.04, -0.03 / 2 - 0.01 / 2);
  handle.add(handleBase);
  handle.add(hilt);
  handle.scale.set(1.1, 1.1, 1.1);

  return handle;
}

function makeHilt() {

  let hilt = new Three.Object3D();
  let GeometryPiece1 = new Three.CylinderGeometry(0.01, 0.01, 0.03, Math.round(32 ));
  let GeometryPiece2 = new Three.SphereGeometry(0.01, Math.round(32 ), Math.round(32 ));
  let GeometryPiece3 = new Three.CylinderGeometry(0.01, 0.01, 0.07, Math.round(32 ));
  let piece1 = new Three.Mesh(GeometryPiece1, black);
  let piece2 = new Three.Mesh(GeometryPiece2, black);
  let piece3 = new Three.Mesh(GeometryPiece3, black);
  let piece4 = new Three.Mesh(GeometryPiece2, black);
  piece3.rotation.z = Math.PI / 2;
  piece3.position.x = 0.07 / 2;
  piece2.position.y = -0.03 / 2;
  piece4.position.y = -0.07 / 2;
  piece3.add(piece4);
  piece2.add(piece3);
  piece1.add(piece2);
  hilt.add(piece1);

  return hilt;
}

function makeHandleBase() {

  let base = new Three.Object3D();
  let BaseGeometry1 = new Three.BoxGeometry(0.038, 0.14, 0.01);
  let BaseGeometry2 = new Three.CylinderGeometry(0.023, 0.023, 0.01, Math.round(32 ));
  let lock = makeLockKey();
  let base1 = new Three.Mesh(BaseGeometry1, black);
  let base2 = new Three.Mesh(BaseGeometry2, black);
  lock.rotation.x = Math.PI / 2;
  lock.position.y = -0.03;
  base2.rotation.x = Math.PI / 2;
  base2.position.y = -0.033;
  base2.scale.z = 1.5;
  base1.add(lock);
  base1.add(base2);
  base.add(base1);

  return base;
}

function makeLockKey() {

  let lock = new Three.Object3D();
  let geometryLock1 = new Three.CylinderGeometry(0.005, 0.005, 0.02, Math.round(32 ));
  let geometryLock2 = new Three.BoxGeometry(0.008, 0.02, 0.02);
  let geometryLock3 = new Three.BoxGeometry(0.007, 0.0203, 0.0018);
  let lockPiece1 = new Three.Mesh(geometryLock1, metalBlue);
  let lockPiece2 = new Three.Mesh(geometryLock2, metalBlue);
  let lockPiece3 = new Three.Mesh(geometryLock3, metalBlueGrey);
  lockPiece2.position.z = 0.01;
  lockPiece1.add(lockPiece2);
  lockPiece1.add(lockPiece3);
  lock.add(lockPiece1);

  return lock;
}

function makeDoorStructure() {

  let door = new Three.Object3D();
  let lowBaseDoorGeometry = new Three.BoxGeometry(0.6,1.2,0.01);
  let middleBaseDoorGeometry = new Three.BoxGeometry(0.2,0.7,0.01);
  let highBaseDoorGeometry = new Three.BoxGeometry(0.2,0.2,0.01);
  let BorderCoverDoorGeometry1 = new Three.CylinderGeometry(0.005,0.005,1.9,Math.round(32));
  let BorderCoverDoorGeometry2 = new Three.BoxGeometry(0.03,1.9,0.01);
  let MiddleDoorGeometry2 = new Three.BoxGeometry(0.2,0.7,0.06);
  let MiddleDoorGeometry1 = new Three.BoxGeometry(0.19,0.7,0.06);
  let HighDoorGeometry = new Three.BoxGeometry(0.2,0.2,0.06);
  let glassGeometry = new Three.BoxGeometry(0.2,0.5,0.05);
  let LowDoorGeometry = new Three.BoxGeometry(0.59,1.2,0.06);
  let glassCoverVertical = new Three.BoxGeometry(0.01,0.52,0.064);
  let glassCoverHorizontal = new Three.BoxGeometry(0.224,0.01,0.064);
  let lowCoverDoor = new Three.Mesh( lowBaseDoorGeometry , green );
  let middleDoor1 = new Three.Mesh( MiddleDoorGeometry1, green);
  let middleDoor2 = new Three.Mesh( MiddleDoorGeometry2, green);
  let baseDoor = new Three.Mesh( LowDoorGeometry, green );
  let middleCoverDoor1 = new Three.Mesh( middleBaseDoorGeometry, green);
  let middleCoverDoor2 = new Three.Mesh( middleBaseDoorGeometry, green);
  let highCoverDoor = new Three.Mesh( highBaseDoorGeometry, green);
  let highDoor = new Three.Mesh( HighDoorGeometry, green);
  let borderCoverDoor1 = new Three.Mesh( BorderCoverDoorGeometry1, green);
  let borderCoverDoor2 = new Three.Mesh( BorderCoverDoorGeometry2, green);
  let glass = new Three.Mesh( glassGeometry, turquoise);
  let glassVerticalCover1 = new Three.Mesh( glassCoverVertical, green);
  let glassVerticalCover2 = new Three.Mesh( glassCoverVertical, green);
  let glassHorizontalCover1 = new Three.Mesh( glassCoverHorizontal, green);
  let glassHorizontalCover2 = new Three.Mesh( glassCoverHorizontal, green);
  lowCoverDoor.position.set(-(0.6-0.59)/2,0,-0.05/2);
  middleCoverDoor1.position.set(-0.2,1.2/2 +0.7/2,0);
  middleCoverDoor2.position.set(0.2,1.2/2 +0.7/2,0);
  highCoverDoor.position.set(0,(0.5 +0.2)/2,-0.05/2);
  highDoor.position.set(0,(0.5 +0.2)/2,-0.05/2 +0.05/2);
  glass.position.set(-0.01/2,1.2/2 +0.5/2,0);
  middleDoor2.position.z =0.05/2;
  middleDoor1.position.set(0.005,0,0.05/2);
  borderCoverDoor1.position.set(-0.6/2,0.7/2,0);
  glassVerticalCover1.position.x = 0.2/2 +0.014/2;
  glassVerticalCover2.position.x =-0.2/2 -0.014/2;
  glassHorizontalCover1.position.y = 0.5/2 +0.014/2;
  glassHorizontalCover2.position.y =-0.5/2 -0.014/2;
  borderCoverDoor2.position.set(0.02/2,0,-0.01/2 );
  borderCoverDoor1.add(borderCoverDoor2);
  glass.add(highCoverDoor);
  glass.add(glassVerticalCover1);
  glass.add(glassVerticalCover2);
  glass.add(glassHorizontalCover1);
  glass.add(glassHorizontalCover2);
  glass.add(highCoverDoor);
  glass.add(highDoor);
  baseDoor.add(glass);
  middleCoverDoor1.add(middleDoor1);
  middleCoverDoor2.add(middleDoor2);
  lowCoverDoor.add(borderCoverDoor1);
  lowCoverDoor.add(middleCoverDoor1);
  lowCoverDoor.add(middleCoverDoor2);
  baseDoor.add(lowCoverDoor);
  door.add(baseDoor);
  door.scale.x = 0.9;

  return door;
}
//------------DOOR-----------


const defaultFontSize = 30;
const defaultColor = '#000000';

function createElement() {
  const metadata = {
    description: '8000L TANK',
    tare: '3,000',
    vgm: '11.4',

    originalDimensions: {
      length: '3.0',  // Will be like 2.2 from Excel
      width: '2.4',   // Will be like 2.0 from Excel
      height: '2.6',  // Will be like 2.5 from Excel
    },
  };

  const info = {
    title: metadata.description, // The name field in the sidebar and catalog name
    tag: ['example test container'],
    description: metadata.description, // The description shown in the catalog
    image: null,
    dimensions: {
      width: Math.trunc(metadata.originalDimensions.width * 100),
      height: Math.trunc(metadata.originalDimensions.height * 100),
      depth: Math.trunc(metadata.originalDimensions.length * 100),
    },
    metadata: metadata  // Add the metadata object to info
  };

  const element = {
    name: info.title, // what shows up on sidebar. Properties: [name] hashcode. Also shows up on the recent searches on catalog
    prototype: 'items',
    type: 'generic',
    metadata,
    info,
    properties: {
      fontSize: {
        label: 'Font Size',
        type: 'number',
        defaultValue: defaultFontSize,
      },
      textColor: {
        label: 'Text Colour',
        type: 'color',
        defaultValue: defaultColor,
      },
      color: {
        label: 'Item Colour',
        type: 'color',
        defaultValue: ReactPlannerSharedStyle.AREA_MESH_COLOR.unselected,
      },
      altitude: {
        label: 'Altitude',
        type: 'length-measure',
        defaultValue: {
          length: 0,
          unit: 'cm'
        },
      },
      width: {
        label: `Width\u00A0\u00A0\u00A0 Def: ${info.dimensions.width}`,
        type: 'length-measure',
        defaultValue: {
          length: info.dimensions.width,
          unit: 'cm'
        },
      },
      depth: {
        label: `Length\u00A0\u00A0\u00A0 Def: ${info.dimensions.depth}`,
        type: 'length-measure',
        defaultValue: {
          length: info.dimensions.depth,
          unit: 'cm'
        },
      },
      height: {
        label: `Height\u00A0\u00A0\u00A0 Def: ${info.dimensions.height}`,
        type: 'length-measure',
        defaultValue: {
          length: info.dimensions.height,
          unit: 'cm'
        },
      },
    },
    render2D: (element, layer, scene) => {
      let width = element.properties.getIn(['width', 'length']);
      let depth = element.properties.getIn(['depth', 'length']);
      let rotation = ((element.rotation % 360) + 360) % 360;
      
      // Calculate chars per line based on rotation
      let charsPerLine = (rotation >= 45 && rotation <= 120) || (rotation >= 235 && rotation <= 310) 
          // Larger divisor = fewer characters per line
          // Smaller divisor = more characters per line
        ? Math.floor(depth / 17) // When container is sideways
        : Math.floor(width / 17); // When container is vertical

      // This ensures the number of characters stays within reasonable bounds
      charsPerLine = Math.max(10, Math.min(charsPerLine, 30));
      
      // This splits the text into chunks based on charsPerLine
      let displayText = [];
      for (let i = 0; i < element.name.length; i += charsPerLine) {
        displayText.push(element.name.slice(i, i + charsPerLine));
      }
      
      let fontSize = element.properties.get('fontSize') || defaultFontSize;
      let textColour = element.properties.get('textColor') || defaultColor;
      
      let style = {
        stroke: element.selected ? '#0096fd' : '#000',
        strokeWidth: '2px',
        fill: element.properties.get('color')
      };

      let textRotation = 0;
      if (rotation >= 0 && rotation < 45) {
        textRotation = 0;
      } else if (rotation >= 45 && rotation <= 120) {
        textRotation = 90;
      } else if (rotation >= 235 && rotation <= 310) {
        textRotation = 270;
      } else if (rotation > 310 && rotation <= 359) {
        textRotation = 0;
      } else {
        textRotation = 180;
      }

      return (
        <g transform={`translate(${-width/2}, ${-depth/2})`}>
          <rect key='1' x='0' y='0' width={width} height={depth} style={style} />
          <text key='2' x='0' y='0'
                transform={`translate(${width/2}, ${depth/2}) scale(1,-1) rotate(${textRotation})`}
                style={{textAnchor: 'middle', fontSize: `${fontSize}px`, fill: textColour}}>
            {displayText.map((chunk, index) => (
              <tspan key={index} 
                     x="0" 
                     dy={index === 0 ? "0" : "1.2em"}>
                {chunk}
              </tspan>
            ))}
          </text>
        </g>
      );
    },
    render3D: (element, layer, scene) => {
      let w = element.properties.getIn(['width', 'length']);
      let h = element.properties.getIn(['height', 'length']);
      let d = element.properties.getIn(['depth', 'length']);
      let altitude = element.properties.getIn(['altitude', 'length']);
      
      let geometry = new BoxGeometry(w, h, d);
      let material = new MeshBasicMaterial({
        color: element.properties.get('color')
      });

      let mesh = new Mesh(geometry, material);

      let box = new BoxHelper(mesh, !element.selected ? ReactPlannerSharedStyle.LINE_MESH_COLOR.unselected : ReactPlannerSharedStyle.MESH_SELECTED );
      box.material.linewidth = 2;
      box.renderOrder = 1000;
      mesh.add(box);

      mesh.position.y = (h / 2) + altitude;

      return Promise.resolve(mesh);
    }
  };

  console.log('Returning element:', element);
  return element;
}

export default createElement();
