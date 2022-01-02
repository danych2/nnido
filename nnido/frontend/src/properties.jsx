const properties = {
  directed: {
    active: true,
    name: 'Dirigido',
    type: 'checkbox',
    default: false,
    nodeProperty: false,
    linkProperty: true,
    individualProperty: false,
  },
  name: {
    active: true,
    name: 'Name',
    type: 'text',
    default: '',
    nodeProperty: true,
    linkProperty: false,
    individualProperty: true,
  },
  color_node: {
    active: true,
    name: 'Color',
    type: 'color',
    default: '#000',
    nodeProperty: true,
    linkProperty: false,
    individualProperty: false,
  },
  color_link: {
    active: true,
    name: 'Color',
    type: 'color',
    default: 'lightgray',
    nodeProperty: false,
    linkProperty: true,
    individualProperty: false,
  },
  contenido: {
    active: false,
    name: 'Contenido',
    type: 'text',
    default: '',
    nodeProperty: true,
    linkProperty: true,
    individualProperty: true,
  },
};

export default properties;
