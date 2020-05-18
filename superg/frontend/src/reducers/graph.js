import { GET_GRAPHS, GET_GRAPH, DELETE_GRAPH, CREATE_GRAPH, UPDATE_GRAPH,
  CREATE_NODE, DELETE_NODE, UPDATE_NODE, CREATE_LINK, DELETE_LINK, UPDATE_LINK,
  UPDATE_NODE_POSITION, SET_ACTIVE_ELEMENT, UPDATE_ZOOM,
  CREATE_NODE_TYPE, DELETE_NODE_TYPE, UPDATE_NODE_TYPE, CREATE_LINK_TYPE, DELETE_LINK_TYPE, UPDATE_LINK_TYPE
} from '../actions/types.js';

const initialState = {
  graphs: [],
  graph: {},
  activeElement: null,
}

export default function(state = initialState, action) {
  let value, id, data, position, name, node_type, link_type,
    new_positions, new_node_types, new_link_types;
  switch(action.type) {
    case GET_GRAPHS:
      return {
        ...state,
        graphs: action.payload,
      };
    case GET_GRAPH:
      return {
        ...state,
        graph: {...action.payload, 'data': JSON.parse(action.payload.data),
          'visualization': JSON.parse(action.payload.visualization),
          'model': JSON.parse(action.payload.model)},
      };
    case CREATE_GRAPH:
      return {
        ...state,
        graphs: [...state.graphs, action.payload],
      };
    case DELETE_GRAPH:
      return {
        ...state,
        graphs: state.graphs.filter(graph => graph.pk !== action.payload),
      };
    case CREATE_NODE:
      ({ id, data, position } = action.payload);
      return {
        ...state,
        graph: {...state.graph,
          data: {
            ...state.graph.data,
            nodes: [...state.graph.data.nodes, {id, name:"", content:"", properties: {}, ...data}]},
          visualization: {
            ...state.graph.visualization,
            node_positions: {
              ...state.graph.visualization.node_positions,
              [id]: position
            }
          },
        },
      };
    case DELETE_NODE:
      ({ [action.payload]:value, ...new_positions } = state.graph.visualization.node_positions);
      return {
        ...state,
        graph: {...state.graph,
          data: {
            ...state.graph.data,
            nodes: state.graph.data.nodes.filter(node => node.id !== action.payload),
            links: state.graph.data.links.filter(link =>
              link.source !== action.payload &&
              link.target !== action.payload)},
          visualization: {...state.graph.visualization, new_positions}
        }
      };
    case UPDATE_NODE:
      return {
        ...state,
        graph: {...state.graph,
          data: {
            ...state.graph.data,
            nodes: [
              ...state.graph.data.nodes.filter(node => node.id !== action.payload.id),
              {...state.graph.data.nodes.find(node => node.id === action.payload.id),
                ...action.payload
              }
            ],
          }
        }
      };
    case CREATE_LINK:
      return {
        ...state,
        graph: {...state.graph, data: {
          ...state.graph.data,
          links: [...state.graph.data.links, {properties: {}, ...action.payload}]
        }},
      };
    case DELETE_LINK:
      return {
        ...state,
        graph: {...state.graph, data: {
          ...state.graph.data,
          links: state.graph.data.links.filter(link => link.id !== action.payload)
        }}
      };
    case UPDATE_LINK:
      return {
        ...state,
        graph: {...state.graph,
          data: {
            ...state.graph.data,
            links: [
              ...state.graph.data.links.filter(link => link.id !== action.payload.id),
              {...state.graph.data.links.find(link => link.id === action.payload.id),
                ...action.payload
              }
            ],
          }
        }
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
              [action.payload.id]: {x: action.payload.x, y: action.payload.y}
            }
          }
        }
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
            zoom: action.payload
          }
        }
      };
    case CREATE_NODE_TYPE:
      ({ name, ...node_type } = action.payload);
      return {
        ...state,
        graph: {...state.graph,
          model: {
            ...state.graph.model,
            node_types: {
              ...state.graph.model.node_types,
              [name]: node_type,
            }
          },
        },
      };
    case DELETE_NODE_TYPE:
      ({ [action.payload]:value, ...new_node_types } = state.graph.model.node_types);
      return {
        ...state,
        graph: {...state.graph,
          model: {
            ...state.graph.model,
            node_types: new_node_types
          }
        }
      };
    case UPDATE_NODE_TYPE:
      ({ name, ...node_type } = action.payload);
      return {
        ...state,
        graph: {...state.graph,
          model: {
            ...state.graph.model,
            node_types: {
              ...state.graph.model.node_types,
              [name]: node_type,
            }
          },
        },
      };
    case CREATE_LINK_TYPE:
      ({ name, ...link_type } = action.payload);
      return {
        ...state,
        graph: {...state.graph,
          model: {
            ...state.graph.model,
            link_types: {
              ...state.graph.model.link_types,
              [name]: link_type,
            }
          },
        },
      };
    case DELETE_LINK_TYPE:
      ({ [action.payload]:value, ...new_link_types } = state.graph.model.link_types);
      return {
        ...state,
        graph: {...state.graph,
          model: {
            ...state.graph.model,
            link_types: new_link_types
          }
        }
      };
    case UPDATE_LINK_TYPE:
      ({ name, ...link_type } = action.payload);
      return {
        ...state,
        graph: {...state.graph,
          model: {
            ...state.graph.model,
            link_types: {
              ...state.graph.model.link_types,
              [name]: link_type,
            }
          },
        },
      };
    default:
      return state;
  }
}
