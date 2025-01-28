// COLORS
export const COLORS = {
  white: '#FFF',
  black: '#000'
};

export const MATERIAL_COLORS = {
  500: {
    amber: '#FFC107',
    blue_grey: '#607D8B',
    blue: '#2196F3',
    brown: '#795548',
    cyan: '#00BCD4',
    deep_orange: '#FF5722',
    deep_purple: '#673AB7',
    green: '#4CAF50',
    grey: '#9E9E9E',
    indigo: '#3F51B5',
    light_blue: '#03A9F4',
    light_green: '#8BC34A',
    lime: '#CDDC39',
    orange: '#FF9800',
    pink: '#E91E63',
    purple: '#9C27B0',
    red: '#F44336',
    teal: '#009688',
    yellow: '#FFEB3B',
    white_grey: '#f7f7f9',
  }
};

export const PRIMARY_COLOR = {
  main: '#353535', // main layout
  alt: '#2E2F33', // color of the side bar (only two thirds of it for somereason)
  icon: '#ffffff', // colour of icons on toolbar
  border: '1px solid #555',
  text_main: 'COLORS.white',
  text_alt: '#EBEBEB', // text colour of sidebar
  input: '#55595C' // text colour of attributes on sidebar
};

export const SECONDARY_COLOR = {
  main: '#1CA6FC', // text colour of hover of texts on sidebar
  alt: '#444088', // text colour of box and footer
  icon: '#1dafe6', // colour of hover of texts on toolbar
  border: '1px solid #FFF'
};

export const MESH_SELECTED = '#99C3FB'; // colour of 'areas' selected (areas formed by walls)

export const AREA_MESH_COLOR = {
  selected: MESH_SELECTED,
  unselected: '#D3D3D3'
};

export const LINE_MESH_COLOR = {
  selected: MESH_SELECTED,
  unselected: '#000000' // colour of the border of wall objects
}