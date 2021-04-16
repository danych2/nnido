/* eslint-disable prefer-destructuring */
import axios from 'axios';
import { v4 as uuid } from 'uuid';

import {
  GET_GRAPHS, GET_GRAPH, DELETE_GRAPH, CREATE_GRAPH, UPDATE_GRAPH,
  CREATE_NODE, DELETE_NODE, UPDATE_NODE, CREATE_LINK, DELETE_LINK, UPDATE_LINK,
  UPDATE_NODE_POSITION, SET_SELECTION, UPDATE_ZOOM, UPDATE_DEFAULT,
  CREATE_NODE_TYPE, DELETE_NODE_TYPE,
  CREATE_LINK_TYPE, DELETE_LINK_TYPE, UPDATE_TYPE,
  SWITCH_NODETYPE_FILTER, SWITCH_LINKTYPE_FILTER, UPDATE_NODES_POSITIONS, SWITCH_SELECTION,
} from './types';

import { tokenConfig } from './auth';

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
    visualization: JSON.stringify({ node_positions: {} }),
    model: JSON.stringify({ node_types: {}, link_types: {} }),
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
        properties: {},
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

// CREATE Link
export const createLink = (link) => (dispatch) => {
  dispatch({
    type: CREATE_LINK,
    payload: {
      id: uuid(),
      data: {
        type: '',
        properties: {},
        ...link,
      },
    },
  });
};

// DELETE Link
export const deleteLink = (id) => (dispatch) => {
  dispatch({
    type: DELETE_LINK,
    payload: id,
  });
};

// UPDATE Link
export const updateLink = (link) => (dispatch) => {
  dispatch({
    type: UPDATE_LINK,
    payload: link,
  });
};

// UPDATE Node position
export const updateNodePosition = (nodePosition) => (dispatch) => {
  dispatch({
    type: UPDATE_NODE_POSITION,
    payload: nodePosition,
  });
};

// UPDATE Nodes positions
export const updateNodesPositions = (nodePosition) => (dispatch) => {
  dispatch({
    type: UPDATE_NODES_POSITIONS,
    payload: nodePosition,
  });
};

// SET multiple selection
export const selectElements = (element) => (dispatch) => {
  dispatch({
    type: SET_SELECTION,
    payload: element,
  });
};

// SWITCH selection
export const selectionSwitch = (element) => (dispatch) => {
  dispatch({
    type: SWITCH_SELECTION,
    payload: element,
  });
};

// Update zoom
export const updateZoom = (transform) => (dispatch) => {
  dispatch({
    type: UPDATE_ZOOM,
    payload: transform,
  });
};

// Update default
export const updateDefault = (payload) => (dispatch) => {
  dispatch({
    type: UPDATE_DEFAULT,
    payload,
  });
};

// CREATE Node type
export const createNodeType = (nodeType) => (dispatch) => {
  dispatch({
    type: CREATE_NODE_TYPE,
    payload: {
      id: uuid(),
      data: {
        properties: {},
        ...nodeType,
      },
    },
  });
};

// DELETE Node type
export const deleteNodeType = (id) => (dispatch) => {
  dispatch({
    type: DELETE_NODE_TYPE,
    payload: id,
  });
};

// CREATE Link type
export const createLinkType = (linkType) => (dispatch) => {
  dispatch({
    type: CREATE_LINK_TYPE,
    payload: {
      id: uuid(),
      data: {
        properties: {},
        ...linkType,
      },
    },
  });
};

// DELETE Link type
export const deleteLinkType = (id) => (dispatch) => {
  dispatch({
    type: DELETE_LINK_TYPE,
    payload: id,
  });
};

// UPDATE Type
export const updateType = (type) => (dispatch) => {
  dispatch({
    type: UPDATE_TYPE,
    payload: type,
  });
};

// SWITCH Node type visibility
export const switchNodeTypeFilter = (id) => (dispatch) => {
  dispatch({
    type: SWITCH_NODETYPE_FILTER,
    payload: id,
  });
};

// SWITCH Link type visibility
export const switchLinkTypeFilter = (id) => (dispatch) => {
  dispatch({
    type: SWITCH_LINKTYPE_FILTER,
    payload: id,
  });
};
