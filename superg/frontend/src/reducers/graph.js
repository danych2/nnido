import {
  GET_GRAPHS, GET_GRAPH, DELETE_GRAPH, CREATE_GRAPH, UPDATE_GRAPH,
  CREATE_NODE, DELETE_NODE, UPDATE_NODE, CREATE_LINK, DELETE_LINK, UPDATE_LINK,
  UPDATE_NODE_POSITION, SET_ACTIVE_ELEMENT, UPDATE_ZOOM, UPDATE_DEFAULT,
  CREATE_NODE_TYPE, DELETE_NODE_TYPE, UPDATE_NODE_TYPE,
  CREATE_LINK_TYPE, DELETE_LINK_TYPE, UPDATE_LINK_TYPE,
  SWITCH_NODETYPE_FILTER, SWITCH_LINKTYPE_FILTER,
} from '../actions/types';
import { dictFilter } from '../func';

const initialState = {
  graphs: [],
  graph: {},
  activeElement: null,
};

export default function (state = initialState, action) {
  // eslint-disable-next-line no-unused-vars
  let value;
  let id;
  let data;
  let position;
  let name;
  let nodeType;
  let linkType;
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
      };
    case GET_GRAPH:
      return {
        ...state,
        graph: {
          ...action.payload,
          data: JSON.parse(action.payload.data),
          visualization: JSON.parse(action.payload.visualization),
          model: JSON.parse(action.payload.model),
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
    case SET_ACTIVE_ELEMENT:
      return {
        ...state,
        activeElement: action.payload,
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
    case UPDATE_NODE_TYPE:
      ({ id, data } = action.payload);
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
    case UPDATE_LINK_TYPE:
      ({ id, data } = action.payload);
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
