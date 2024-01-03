import {
  GET_GRAPHS, GET_GRAPH, DELETE_GRAPH, CREATE_GRAPH, UPDATE_GRAPH,
  CREATE_NODE, DELETE_NODE, UPDATE_NODE, CREATE_LINK, DELETE_LINK, UPDATE_LINK,
  UPDATE_NODE_POSITION, SET_SELECTION, UPDATE_ZOOM, UPDATE_DEFAULT,
  CREATE_NODE_TYPE, DELETE_NODE_TYPE, UPDATE_NODES, UPDATE_LINKS,
  UPDATE_ATTRIBUTE, DELETE_ATTRIBUTE, UPDATE_PROPERTY, DELETE_PROPERTY,
  CREATE_LINK_TYPE, DELETE_LINK_TYPE, UPDATE_TYPE,
  SWITCH_TYPE_FILTER, UPDATE_NODES_POSITIONS, SWITCH_SELECTION,
  ACCESS_ERROR,
} from '../actions/types';
import { dictFilter } from '../func';
import config from '../config';

const initialState = {
  graphs: [],
  graph: {},
  selection: { ids: [], type: 'none' },
  selectionAdjacent: { node_ids: [], link_ids: [] },
  error: false,
};

export default function (state = initialState, action) {
  // eslint-disable-next-line no-unused-vars
  let value;
  let id;
  let version;
  let data;
  let visualization;
  let model;
  let position;
  let name;
  let element_class;
  let otherNodes;
  let otherLinks;
  let newPositions;
  let newNodeTypes;
  let newLinkTypes;
  switch (action.type) {
    case GET_GRAPHS:
      return {
        ...state,
        graphs: action.payload,
        error: false,
      };
    case GET_GRAPH:
      version = action.payload.version;
      data = JSON.parse(action.payload.data);
      visualization = JSON.parse(action.payload.visualization);
      model = JSON.parse(action.payload.model);
      if (visualization.node_types_filtered === undefined) {
        visualization.node_types_filtered = {};
        visualization.link_types_filtered = {};
      }
      if (version < 1.1) {
        const adjacencylists = {};
        Object.keys(data.nodes).forEach((node_id) => {
          adjacencylists[node_id] = {};
          Object.keys(data.links).forEach((link_id) => {
            if (data.links[link_id].source.localeCompare(node_id) === 0
              || data.links[link_id].target.localeCompare(node_id) === 0) {
              adjacencylists[node_id][link_id] = true;
            }
          });
        });
        data = { ...data, adjacencylists };
      }
      if (version < 1.2) {
        Object.keys(data.nodes).forEach((node_id) => {
          data.nodes[node_id].dims = { width: -1, height: -1 };
        });

        // Change element and types 'properties' to 'attributes'
        Object.keys(data.nodes).forEach((node_id) => {
          const attributes = data.nodes[node_id].properties;
          delete data.nodes[node_id].properties;
          data.nodes[node_id].attributes = attributes;
        });
        Object.keys(data.links).forEach((link_id) => {
          const attributes = data.links[link_id].properties;
          delete data.links[link_id].properties;
          data.links[link_id].attributes = attributes;
        });
        Object.keys(model.node_types).forEach((node_type_id) => {
          const attributes = model.node_types[node_type_id].properties;
          delete model.node_types[node_type_id].properties;
          model.node_types[node_type_id].attributes = attributes;
        });
        Object.keys(model.link_types).forEach((link_type_id) => {
          const attributes = model.link_types[link_type_id].properties;
          delete model.link_types[link_type_id].properties;
          model.link_types[link_type_id].attributes = attributes;
        });
      }
      return {
        ...state,
        graph: {
          ...action.payload,
          data,
          visualization,
          model,
          version: config.CURRENT_VERSION,
        },
        error: false,
      };
    case CREATE_GRAPH:
      return {
        ...state,
        graphs: [...state.graphs, action.payload],
      };
    case DELETE_GRAPH:
      return {
        ...state,
        graphs: state.graphs.filter((graph) => graph.pk !== action.payload),
      };
    case CREATE_NODE:
      ({ id, data, position } = action.payload);
      return {
        ...state,
        graph: {
          ...state.graph,
          data: {
            ...state.graph.data,
            nodes: {
              ...state.graph.data.nodes,
              [id]: data,
            },
            adjacencylists: {
              ...state.graph.data.adjacencylists,
              [id]: {},
            },
          },
          visualization: {
            ...state.graph.visualization,
            node_positions: {
              ...state.graph.visualization.node_positions,
              [id]: position,
            },
          },
        },
      };
    case UPDATE_NODE:
      ({ id, data, position } = action.payload);
      return {
        ...state,
        graph: {
          ...state.graph,
          data: {
            ...state.graph.data,
            nodes: {
              ...state.graph.data.nodes,
              [id]: {
                ...state.graph.data.nodes[id],
                ...data,
              },
            },
          },
        },
      };
    case UPDATE_NODES: {
      // payload: {ids: [xxx, yyy, ...], data: {data to be changed....}}
      const newNodes = {};
      const { ids, data } = action.payload;
      ids.forEach((id) => {
        newNodes[id] = {
          ...state.graph.data.nodes[id],
          ...data,
        };
      });
      return {
        ...state,
        graph: {
          ...state.graph,
          data: {
            ...state.graph.data,
            nodes: {
              ...state.graph.data.nodes,
              ...newNodes,
            },
          },
        },
      };
    }
    case DELETE_NODE: {
      const node_id = action.payload;
      ({ [node_id]: value, ...newPositions } = state.graph.visualization.node_positions);
      ({ [node_id]: value, ...otherNodes } = state.graph.data.nodes);

      const neighbour_linknodes = [];
      const newAdjacencylists = JSON.parse(JSON.stringify(state.graph.data.adjacencylists));
      Object.keys(state.graph.data.adjacencylists[node_id]).forEach((link_id) => {
        let neigh_node_id = '';
        let found = false;
        if (state.graph.data.links[link_id].source.localeCompare(node_id) === 0) {
          neigh_node_id = state.graph.data.links[link_id].target;
          found = true;
        } else if (state.graph.data.links[link_id].target.localeCompare(node_id) === 0) {
          neigh_node_id = state.graph.data.links[link_id].source;
          found = true;
        }
        if (found) {
          neighbour_linknodes.push([link_id, neigh_node_id]);
        }
      });
      neighbour_linknodes.forEach((linknode) => {
        delete newAdjacencylists[linknode[1]][linknode[0]];
      });
      delete newAdjacencylists[node_id];

      return {
        ...state,
        graph: {
          ...state.graph,
          data: {
            ...state.graph.data,
            nodes: otherNodes,
            links: dictFilter(state.graph.data.links, (link) => link.source !== action.payload
              && link.target !== action.payload),
            adjacencylists: newAdjacencylists,
          },
          visualization: { ...state.graph.visualization, newPositions },
        },
      };
    }
    case CREATE_LINK: {
      ({ id, data } = action.payload);
      const { source, target } = data;
      return {
        ...state,
        graph: {
          ...state.graph,
          data: {
            ...state.graph.data,
            links: {
              ...state.graph.data.links,
              [id]: data,
            },
            adjacencylists: {
              ...state.graph.data.adjacencylists,
              [source]: {
                ...state.graph.data.adjacencylists[source],
                [id]: true,
              },
              [target]: {
                ...state.graph.data.adjacencylists[target],
                [id]: true,
              },
            },
          },
        },
      };
    }
    case UPDATE_LINK:
      ({ id, data } = action.payload);
      return {
        ...state,
        graph: {
          ...state.graph,
          data: {
            ...state.graph.data,
            links: {
              ...state.graph.data.links,
              [id]: {
                ...state.graph.data.links[id],
                ...data,
              },
            },
          },
        },
      };
    case DELETE_LINK: {
      const id = action.payload;
      ({ [id]: value, ...otherLinks } = state.graph.data.links);
      const { source, target } = state.graph.data.links[id];
      const newAdjacencylists = JSON.parse(JSON.stringify(state.graph.data.adjacencylists));
      delete newAdjacencylists[source][id];
      delete newAdjacencylists[target][id];
      return {
        ...state,
        graph: {
          ...state.graph,
          data: {
            ...state.graph.data,
            links: otherLinks,
            adjacencylists: newAdjacencylists,
          },
        },
      };
    }
    case UPDATE_NODE_POSITION:
      return {
        ...state,
        graph: {
          ...state.graph,
          visualization: {
            ...state.graph.visualization,
            node_positions: {
              ...state.graph.visualization.node_positions,
              [action.payload.id]: { x: action.payload.x, y: action.payload.y },
            },
          },
        },
      };
    case UPDATE_NODES_POSITIONS:
      return {
        ...state,
        graph: {
          ...state.graph,
          visualization: {
            ...state.graph.visualization,
            node_positions: {
              ...state.graph.visualization.node_positions,
              ...action.payload,
            },
          },
        },
      };
    case SET_SELECTION: {
      // payload: {ids: [xxx, yyy, ...], type: "node"|"edge"}
      // Sets the whole selection as 'action.payload', updates selectionAdjacent
      const selectionAdjacent = { node_ids: [], link_ids: [] };
      if (action.payload.type.localeCompare('node') === 0) {
        // If nodes are selected, their neighboring nodes are set as selectionAdjacent
        // CAUTION some nodes can be at the same time in selection and in selectionAdjacent
        action.payload.ids.forEach((node_id) => {
          const links = Object.keys(state.graph.data.adjacencylists[node_id]);
          links.forEach((link_neighbour_id) => {
            const link_neighbour = state.graph.data.links[link_neighbour_id];
            const node_neighbour_id = link_neighbour.target.localeCompare(node_id) === 0
              ? link_neighbour.source : link_neighbour.target;
            selectionAdjacent.node_ids.push(node_neighbour_id);
            selectionAdjacent.link_ids.push(link_neighbour_id);
          });
        });
      } else {
        // If links are selected, their source and target nodes are set as selectionAdjacent
        action.payload.ids.forEach((link_id) => {
          const link = state.graph.data.links[link_id];
          selectionAdjacent.node_ids.push(link.source);
          selectionAdjacent.node_ids.push(link.target);
        });
      }

      return {
        ...state,
        selection: action.payload,
        selectionAdjacent,
      };
    }
    case SWITCH_SELECTION: {
      // payload: {id: xxx, type: "node"|"edge"}
      // Switches whether the element with id 'action.payload' is selected or not.
      // Only works if currently there is no selection of a different type
      const newSelection = { ...state.selection };
      let selectionAdjacent = { ...state.selectionAdjacent };
      if (state.selection.type.localeCompare('none') === 0
        || action.payload.type.localeCompare(state.selection.type) === 0) {
        if (state.selection.ids.includes(action.payload.id)) {
          newSelection.ids.splice(newSelection.ids.indexOf(action.payload.id), 1);
        } else {
          newSelection.ids.push(action.payload.id);
        }

        selectionAdjacent = { node_ids: [], link_ids: [] };
        if (newSelection.type.localeCompare('node') === 0) {
          // If nodes are selected, their neighboring link are nodes are set as selectionAdjacent
          // CAUTION some nodes can be at the same time in selection and in selectionAdjacent
          newSelection.ids.forEach((node_id) => {
            const links = Object.keys(state.graph.data.adjacencylists[node_id]);
            links.forEach((link_neighbour_id) => {
              const link_neighbour = state.graph.data.links[link_neighbour_id];
              const node_neighbour_id = link_neighbour.target.localeCompare(node_id) === 0
                ? link_neighbour.source : link_neighbour.target;
              selectionAdjacent.node_ids.push(node_neighbour_id);
              selectionAdjacent.link_ids.push(link_neighbour_id);
            });
          });
        } else {
          // If links are selected, their source and target nodes are set as selectionAdjacent
          newSelection.ids.forEach((link_id) => {
            const link = state.graph.data.links[link_id];
            selectionAdjacent.node_ids.push(link.source);
            selectionAdjacent.node_ids.push(link.target);
          });
        }
      }
      return {
        ...state,
        selection: newSelection,
        selectionAdjacent,
      };
    }
    case UPDATE_ZOOM:
      return {
        ...state,
        graph: {
          ...state.graph,
          visualization: {
            ...state.graph.visualization,
            zoom: action.payload,
          },
        },
      };
    case UPDATE_DEFAULT:
      ({ name, value } = action.payload);
      return {
        ...state,
        [name]: value,
      };
    case CREATE_NODE_TYPE:
      ({ id, data } = action.payload);
      return {
        ...state,
        graph: {
          ...state.graph,
          model: {
            ...state.graph.model,
            node_types: {
              ...state.graph.model.node_types,
              [id]: data,
            },
          },
        },
      };
    case DELETE_NODE_TYPE:
      ({ [action.payload]: value, ...newNodeTypes } = state.graph.model.node_types);
      return {
        ...state,
        graph: {
          ...state.graph,
          model: {
            ...state.graph.model,
            node_types: newNodeTypes,
          },
        },
      };
    case CREATE_LINK_TYPE:
      ({ id, data } = action.payload);
      return {
        ...state,
        graph: {
          ...state.graph,
          model: {
            ...state.graph.model,
            link_types: {
              ...state.graph.model.link_types,
              [id]: data,
            },
          },
        },
      };
    case UPDATE_TYPE:
      ({ id, data, element_class } = action.payload);
      if (element_class.localeCompare('node') === 0) {
        return {
          ...state,
          graph: {
            ...state.graph,
            model: {
              ...state.graph.model,
              node_types: {
                ...state.graph.model.node_types,
                [id]: {
                  ...state.graph.model.node_types[id],
                  ...data,
                },
              },
            },
          },
        };
      }
      return {
        ...state,
        graph: {
          ...state.graph,
          model: {
            ...state.graph.model,
            link_types: {
              ...state.graph.model.link_types,
              [id]: {
                ...state.graph.model.link_types[id],
                ...data,
              },
            },
          },
        },
      };
    case DELETE_LINK_TYPE:
      ({ [action.payload]: value, ...newLinkTypes } = state.graph.model.link_types);
      return {
        ...state,
        graph: {
          ...state.graph,
          model: {
            ...state.graph.model,
            link_types: newLinkTypes,
          },
        },
      };
    case SWITCH_TYPE_FILTER: {
      // payload: {isNode: true|false, id: xxx}
      // 1 if visible (filtered), 0 (or undefined) if visible
      const { isNode, id } = action.payload;
      const classSelector = isNode ? 'node_types_filtered' : 'link_types_filtered';

      value = state.graph.visualization[classSelector][id];
      return {
        ...state,
        graph: {
          ...state.graph,
          visualization: {
            ...state.graph.visualization,
            [classSelector]: {
              ...state.graph.visualization[classSelector],
              [action.payload.id]: !value,
            },
          },
        },
      };
    }
    case UPDATE_ATTRIBUTE: {
      // payload: {isNode: true|false, ids: [xxx, yyy, ...],
      //           attribute: attribute_name, value: attribute_value }
      const { isNode, ids, attribute } = action.payload;
      const classSelector = isNode ? 'nodes' : 'links';

      const updatedElements = {};
      ids.forEach((id) => {
        updatedElements[id] = {
          ...state.graph.data[classSelector][id],
          attributes: {
            ...state.graph.data[classSelector][id].attributes,
            [attribute]: value,
          },
        };
      });
      return {
        ...state,
        graph: {
          ...state.graph,
          data: {
            ...state.graph.data,
            [classSelector]: {
              ...state.graph.data[classSelector],
              ...updatedElements,
            },
          },
        },
      };
    }
    case DELETE_ATTRIBUTE: {
      // payload: {isNode: true|false, ids: [xxx, yyy, ...], attribute: attribute_name }
      const { isNode, ids, attribute } = action.payload;
      const classSelector = isNode ? 'nodes' : 'links';

      const updatedElements = {};
      ids.forEach((id) => {
        const { [attribute]: value, ...remains } = state.graph.data[classSelector][id].attributes;
        updatedElements[id] = {
          ...state.graph.data[classSelector][id],
          attributes: remains,
        };
      });
      return {
        ...state,
        graph: {
          ...state.graph,
          data: {
            ...state.graph.data,
            [classSelector]: {
              ...state.graph.data[classSelector],
              ...updatedElements,
            },
          },
        },
      };
    }
    case UPDATE_PROPERTY: {
      // payload: {isType: true|false, isNode: true|false,
      //           ids: [xxx, yyy, ...], property: propertyID, value: propertyValue}
      const {
        isType, isNode, ids, property, value,
      } = action.payload;
      const mainSelector = isType ? 'model' : 'data';
      let classSelector = isNode ? 'node' : 'link';
      classSelector += (isType ? '_types' : 's');

      const updatedObjects = {};
      ids.forEach((id) => {
        updatedObjects[id] = {
          ...state.graph[mainSelector][classSelector][id],
          [property]: value,
        };
      });
      return {
        ...state,
        graph: {
          ...state.graph,
          [mainSelector]: {
            ...state.graph[mainSelector],
            [classSelector]: {
              ...state.graph[mainSelector][classSelector],
              ...updatedObjects,
            },
          },
        },
      };
    }
    case DELETE_PROPERTY: {
      // payload: {isType: true|false, isNode: true|false,
      //           ids: [xxx, yyy, ...], property: propertyID}
      const {
        isType, isNode, ids, property,
      } = action.payload;
      const mainSelector = isType ? 'model' : 'data';
      let classSelector = isNode ? 'node' : 'link';
      classSelector += (isType ? '_types' : 's');

      const updatedObjects = {};
      ids.forEach((id) => {
        const { [property]: value, ...remains } = state.graph[mainSelector][classSelector][id];
        updatedObjects[id] = remains;
      });
      return {
        ...state,
        graph: {
          ...state.graph,
          [mainSelector]: {
            ...state.graph[mainSelector],
            [classSelector]: {
              ...state.graph[mainSelector][classSelector],
              ...updatedObjects,
            },
          },
        },
      };
    }
    case ACCESS_ERROR:
      return {
        ...state,
        graph: {},
        error: true,
      };

    case UPDATE_GRAPH:
    default:
      return state;
  }
}
