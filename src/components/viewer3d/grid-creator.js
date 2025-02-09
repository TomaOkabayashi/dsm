import * as Three from 'three';
import { HELVETIKER } from './libs/helvetiker_regular.typeface.js';
import gridHorizontalStreak from './grids/grid-horizontal-streak';
import gridVerticalStreak from './grids/grid-vertical-streak';
import BackgroundImage from '../backgrounds/background1.png';

export default function createGrid(scene) {
  let gridMesh = new Three.Object3D();
  gridMesh.name = 'grid';
  // let fontLoader = new Three.FontLoader();
  // let font = fontLoader.parse(HELVETIKER); // For measures
  // let { grids, width, height } = scene;
  let {width, height } = scene;

  // Create ground plane with texture
  const textureLoader = new Three.TextureLoader();
  const texture = textureLoader.load(BackgroundImage);
  texture.wrapS = Three.RepeatWrapping;
  texture.wrapT = Three.RepeatWrapping;
  
  // Create plane geometry with origin at bottom-right corner
  const groundGeometry = new Three.PlaneGeometry(width, height, 1, 1);
  groundGeometry.translate(width/2, height/2, 0); // Move geometry so origin is at bottom-right
  groundGeometry.scale(1, -1, 1); // Scale Y by -1 to match 2D grid transformation
  
  const groundMaterial = new Three.MeshBasicMaterial({ 
    map: texture,
    side: Three.DoubleSide
  });
  const ground = new Three.Mesh(groundGeometry, groundMaterial);
  ground.rotation.x = Math.PI / 2; // Rotate to be horizontal
  ground.position.set(0, 0.1, -height + width/2 + 5100); // Position to align with grid and lift it up slightly, moved down by width
  gridMesh.add(ground);

  // If you wish to add the grid lines, uncomment this. Has many visual glitches, may take a bit to load depending on grid size
  
  // grids.forEach(grid => {
  //   switch (grid.type) {
  //     case 'horizontal-streak':
  //       gridMesh.add(gridHorizontalStreak(width, height, grid, font));
  //       break;
  //     case 'vertical-streak':
  //       gridMesh.add(gridVerticalStreak(width, height, grid, font));
  //       break;
  //   }
  // });

  gridMesh.position.y = -1;
  return gridMesh;
}
