import { GET_GRAPHS, GET_GRAPH, DELETE_GRAPH, CREATE_GRAPH, UPDATE_GRAPH,
  CREATE_NODE, DELETE_NODE, UPDATE_NODE, CREATE_LINK, DELETE_LINK, UPDATE_LINK,
  UPDATE_NODE_POSITION, SET_ACTIVE_ELEMENT, UPDATE_ZOOM } from '../actions/types.js';

const initialState = {
  graphs: [],
  graph: {},
  activeElement: null,
}

export default function(state = initialState, action) {
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
          'visualization': JSON.parse(action.payload.visualization)},
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
      const { id, data, position } = action.payload;
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
      const { [action.payload]:val, ...new_positions } = state.graph.visualization.node_positions;
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
    case CREATE_LINK:
      return {
        ...state,
        graph: {...state.graph, data: {
          ...state.graph.data,
          links: [...state.graph.data.links, action.payload]
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
    default:
      return state;
  }
}
