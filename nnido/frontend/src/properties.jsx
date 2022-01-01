const properties = {
  name: {
    active: true,
    name: 'Name',
    type: 'text',
    default: '',
    nodeProperty: true,
    linkProperty: false,
  },
  color_node: {
    active: true,
    name: 'Color',
    type: 'color',
    default: '#000',
    nodeProperty: true,
    linkProperty: false,
  },
  color_link: {
    active: true,
    name: 'Color',
    type: 'color',
    default: 'lightgray',
    nodeProperty: false,
    linkProperty: true,
  },
  contenido: {
    active: false,
    name: 'Contenido',
    type: 'text',
    default: '',
    nodeProperty: true,
    linkProperty: true,
  },
  directed: {
    active: false,
    name: 'Dirigido',
    type: 'checkbox',
    default: false,
    nodeProperty: false,
    linkProperty: true,
  },
};

export default properties;
