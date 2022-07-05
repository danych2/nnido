/* eslint-disable prefer-destructuring */
import axios from 'axios';
import { v4 as uuid } from 'uuid';

import {
  GET_GRAPHS, GET_GRAPH, DELETE_GRAPH, CREATE_GRAPH, UPDATE_GRAPH,
  CREATE_NODE, DELETE_NODE, UPDATE_NODE, CREATE_LINK, DELETE_LINK, UPDATE_LINK,
  UPDATE_NODE_POSITION, SET_SELECTION, UPDATE_ZOOM, UPDATE_DEFAULT,
  UPDATE_ATTRIBUTE, DELETE_ATTRIBUTE,
  UPDATE_PROPERTY, DELETE_PROPERTY,
  CREATE_NODE_TYPE, DELETE_NODE_TYPE, UPDATE_NODES, UPDATE_LINKS,
  CREATE_LINK_TYPE, DELETE_LINK_TYPE, UPDATE_TYPE,
  SWITCH_TYPE_FILTER, UPDATE_NODES_POSITIONS, SWITCH_SELECTION,
} from './types';

import { tokenConfig } from './auth';
import config from '../config';

// GET GRAPHS
export const getGraphs = () => (dispatch, getState) => {
  axios.get('/api/graphs/', tokenConfig(getState))
    .then((res) => {
      dispatch({
        type: GET_GRAPHS,
        payload: res.data,
      });
    }).catch((err) => console.log(err));
};

// GET GRAPH
export const getGraph = (id) => (dispatch, getState) => {
  axios.get(`/api/graphs/${id}/`, tokenConfig(getState))
    .then((res) => {
      dispatch({
        type: GET_GRAPH,
        payload: res.data,
      });
    }).catch((err) => console.log(err));
};

// CREATE Graph
export const createGraph = (graph) => (dispatch, getState) => {
  axios.post('/api/graphs/', {
    ...graph,
    data: JSON.stringify({ nodes: [], links: [] }),
    visualization: JSON.stringify({
      node_positions: {},
      node_types_filtered: {},
      link_types_filtered: {},
    }),
    model: JSON.stringify({ node_types: {}, link_types: {} }),
    version: config.CURRENT_VERSION,
  }, tokenConfig(getState))
    .then((res) => {
      dispatch({
        type: CREATE_GRAPH,
        payload: res.data,
      });
    }).catch((err) => console.log(err));
};

// DELETE Graph
export const deleteGraph = (id) => (dispatch, getState) => {
  axios.delete(`/api/graphs/${id}`, tokenConfig(getState))
    .then(() => {
      dispatch({
        type: DELETE_GRAPH,
        payload: id,
      });
    }).catch((err) => console.log(err));
};

// UPDATE Graph
export const updateGraph = (graph) => (dispatch, getState) => {
  axios.patch(`/api/graphs/${graph.pk}/`, {
    ...graph,
    data: JSON.stringify(graph.data),
    visualization: JSON.stringify(graph.visualization),
    model: JSON.stringify(graph.model),
  }, tokenConfig(getState))
    .then((res) => {
      dispatch({
        type: UPDATE_GRAPH,
        payload: res.data,
      });
    }).catch((err) => console.log(err));
};

// CREATE Node
export const createNode = (node) => (dispatch) => {
  const { data, ...rest } = node; // 'rest' can contain id and position
  dispatch({
    type: CREATE_NODE,
    payload: {
      id: uuid(),
      data: {
        name: '',
        content: '',
        type: '',
        attributes: {},
        dims: { width: -1, height: -1 },
        ...data,
      },
      ...rest,
    },
  });
};

// DELETE Node
export const deleteNode = (id) => (dispatch) => {
  dispatch({
    type: DELETE_NODE,
    payload: id,
  });
};

// UPDATE Node
export const updateNode = (node) => (dispatch) => {
  dispatch({
    type: UPDATE_NODE,
    payload: node,
  });
};

// UPDATE Nodes
export const updateMultipleNodes = (payload) => (dispatch) => {
  dispatch({ type: UPDATE_NODES, payload });
};

// UPDATE (or add) an attribute of one or more elements
export const updateAttribute = (payload) => (dispatch) => {
  dispatch({ type: UPDATE_ATTRIBUTE, payload });
};

// DELETE an attribute from one or more elements
export const deleteAttribute = (payload) => (dispatch) => {
  dispatch({ type: DELETE_ATTRIBUTE, payload });
};

// UPDATE a property of a type or one or more elements
export const updateProperty = (payload) => (dispatch) => {
  dispatch({ type: UPDATE_PROPERTY, payload });
};

// DELETE a property from a type or one or more elements
export const deleteProperty = (payload) => (dispatch) => {
  dispatch({ type: DELETE_PROPERTY, payload });
};

// CREATE Link
export const createLink = (link) => (dispatch) => {
  dispatch({
    type: CREATE_LINK,
    payload: {
      id: uuid(),
      data: {
        type: '',
        attributes: {},
        ...link,
      },
    },
  });
};

// DELETE Link
export const deleteLink = (payload) => (dispatch) => {
  dispatch({ type: DELETE_LINK, payload });
};

// UPDATE Element
export const updateElement = (payload) => (dispatch) => {
  const { multiple, element_class, ...rest } = payload;
  if (element_class.localeCompare('node') === 0) {
    dispatch({
      type: multiple ? UPDATE_NODES : UPDATE_NODE,
      payload: rest,
    });
  } else {
    dispatch({
      type: multiple ? UPDATE_LINKS : UPDATE_LINK,
      payload: rest,
    });
  }
};

// UPDATE Link
export const updateLink = (payload) => (dispatch) => {
  dispatch({ type: UPDATE_LINK, payload });
};

// UPDATE Links
export const updateLinks = (payload) => (dispatch) => {
  dispatch({ type: UPDATE_LINKS, payload });
};

// UPDATE Node position
export const updateNodePosition = (payload) => (dispatch) => {
  dispatch({ type: UPDATE_NODE_POSITION, payload });
};

// UPDATE Nodes positions
export const updateNodesPositions = (payload) => (dispatch) => {
  dispatch({ type: UPDATE_NODES_POSITIONS, payload });
};

// SET multiple selection
export const selectElements = (payload) => (dispatch) => {
  dispatch({ type: SET_SELECTION, payload });
};

// SWITCH selection
export const selectionSwitch = (payload) => (dispatch) => {
  dispatch({ type: SWITCH_SELECTION, payload });
};

// Update zoom
export const updateZoom = (payload) => (dispatch) => {
  dispatch({ type: UPDATE_ZOOM, payload });
};

// Update default
export const updateDefault = (payload) => (dispatch) => {
  dispatch({ type: UPDATE_DEFAULT, payload });
};

// CREATE Node type
export const createNodeType = (nodeType) => (dispatch) => {
  dispatch({
    type: CREATE_NODE_TYPE,
    payload: {
      id: uuid(),
      data: {
        attributes: {},
        ...nodeType,
      },
    },
  });
};

// DELETE Node type
export const deleteNodeType = (payload) => (dispatch) => {
  dispatch({ type: DELETE_NODE_TYPE, payload });
};

// CREATE Link type
export const createLinkType = (linkType) => (dispatch) => {
  dispatch({
    type: CREATE_LINK_TYPE,
    payload: {
      id: uuid(),
      data: {
        attributes: {},
        ...linkType,
      },
    },
  });
};

// DELETE Link type
export const deleteLinkType = (payload) => (dispatch) => {
  dispatch({ type: DELETE_LINK_TYPE, payload });
};

// UPDATE Type
export const updateType = (type) => (dispatch) => {
  dispatch({
    type: UPDATE_TYPE,
    payload: type,
  });
};

// SWITCH type visibility
export const switchTypeFilter = (payload) => (dispatch) => {
  dispatch({ type: SWITCH_TYPE_FILTER, payload });
};
