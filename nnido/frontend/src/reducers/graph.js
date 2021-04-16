import {
  GET_GRAPHS, GET_GRAPH, DELETE_GRAPH, CREATE_GRAPH, UPDATE_GRAPH,
  CREATE_NODE, DELETE_NODE, UPDATE_NODE, CREATE_LINK, DELETE_LINK, UPDATE_LINK,
  UPDATE_NODE_POSITION, SET_SELECTION, UPDATE_ZOOM, UPDATE_DEFAULT,
  CREATE_NODE_TYPE, DELETE_NODE_TYPE,
  CREATE_LINK_TYPE, DELETE_LINK_TYPE, UPDATE_TYPE,
  SWITCH_NODETYPE_FILTER, SWITCH_LINKTYPE_FILTER, UPDATE_NODES_POSITIONS, SWITCH_SELECTION,
} from '../actions/types';
import { dictFilter } from '../func';
import config from '../config';

const initialState = {
  graphs: [],
  graph: {},
  selection: { ids: [], type: 'none' },
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
  let element;
  let otherNodes;
  let otherLinks;
  let newPositions;
  let newNodeTypes;
  let newLinkTypes;
  let newSelection;
  switch (action.type) {
    case GET_GRAPHS:
      return {
        ...state,
        graphs: action.payload,
      };
    case GET_GRAPH:
      version = action.payload.version;
      data = JSON.parse(action.payload.data);
      visualization = JSON.parse(action.payload.visualization);
      model = JSON.parse(action.payload.model);
      if (version < 1) {
        visualization.node_types_filtered = {};
        visualization.link_types_filtered = {};
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
    case DELETE_NODE:
      ({ [action.payload]: value, ...newPositions } = state.graph.visualization.node_positions);
      ({ [action.payload]: value, ...otherNodes } = state.graph.data.nodes);
      return {
        ...state,
        graph: {
          ...state.graph,
          data: {
            ...state.graph.data,
            nodes: otherNodes,
            links: dictFilter(state.graph.data.links, (link) => link.source !== action.payload
              && link.target !== action.payload),
          },
          visualization: { ...state.graph.visualization, newPositions },
        },
      };
    case CREATE_LINK:
      ({ id, data } = action.payload);
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
          },
        },
      };
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
    case DELETE_LINK:
      ({ [action.payload]: value, ...otherLinks } = state.graph.data.nodes);
      return {
        ...state,
        graph: {
          ...state.graph,
          data: {
            ...state.graph.data,
            links: otherLinks,
          },
        },
      };
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
    case SET_SELECTION:
      // payload: {ids: [xxx, yyy, ...], type: "node"|"edge"}
      // Sets the whole selection as 'action.payload'
      return {
        ...state,
        selection: action.payload,
      };
    case SWITCH_SELECTION:
      // payload: {id: xxx, type: "node"|"edge"}
      // Switches whether the element with id 'action.payload' is selected or not.
      // Only works if currently there is no selection of a different type
      newSelection = { ...state.selection };
      if (state.selection.type.localeCompare('none') === 0
        || action.payload.type.localeCompare(state.selection.type) === 0) {
        if (state.selection.ids.includes(action.payload.id)) {
          newSelection.ids.splice(newSelection.ids.indexOf(action.payload.id), 1);
        } else {
          newSelection.ids.push(action.payload.id);
        }
      }
      return {
        ...state,
        selection: newSelection,
      };
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
      ({ id, data, element } = action.payload);
      if (element.localeCompare('node') === 0) {
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
    case SWITCH_NODETYPE_FILTER:
      // 1 if visible (filtered), 0 (or undefined) if visible
      value = state.graph.visualization.node_types_filtered[action.payload.id];
      return {
        ...state,
        graph: {
          ...state.graph,
          visualization: {
            ...state.graph.visualization,
            node_types_filtered: {
              ...state.graph.visualization.node_types_filtered,
              [action.payload.id]: !value,
            },
          },
        },
      };
    case SWITCH_LINKTYPE_FILTER:
      // 1 if visible (filtered), 0 (or undefined) if visible
      value = state.graph.visualization.link_types_filtered[action.payload.id];
      return {
        ...state,
        graph: {
          ...state.graph,
          visualization: {
            ...state.graph.visualization,
            link_types_filtered: {
              ...state.graph.visualization.link_types_filtered,
              [action.payload.id]: !value,
            },
          },
        },
      };
    case UPDATE_GRAPH:
    default:
      return state;
  }
}
