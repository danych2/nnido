const config = {};

config.CURRENT_VERSION = 1.1;

config.DISTANCE_FROM_ARROW_END_TO_NODE_CENTER = 60;
config.NODE_SIZE_X = 70;
config.NODE_SIZE_Y = 50;
config.DEFAULT_LINK_COLOR = 'lightgray';
config.DEFAULT_NODE_COLOR = '#000';
config.CREATING_LINK_COLOR = 'blue';
config.PADDING_TEXT_NODE = 10;
config.NODE_SHADOW_MARGIN = 10;

document.documentElement.style.setProperty('--creating-link-color', config.CREATING_LINK_COLOR);

export default config;
