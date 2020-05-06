import axios from 'axios';
import { tokenConfig } from './auth';

import { GET_GRAPHS, GET_GRAPH, DELETE_GRAPH, CREATE_GRAPH, UPDATE_GRAPH,
  CREATE_NODE, DELETE_NODE, UPDATE_NODE, CREATE_LINK, DELETE_LINK, UPDATE_LINK,
  UPDATE_NODE_POSITION, SET_ACTIVE_ELEMENT, UPDATE_ZOOM } from './types'

import { v4 as uuid } from 'uuid';

// GET GRAPHS
export const getGraphs = () => (dispatch, getState) => {
  axios.get('/api/graphs/', tokenConfig(getState))
    .then(res => {
      dispatch({
        type: GET_GRAPHS,
        payload: res.data
      });
    }).catch(err => console.log(err));
}

// GET GRAPHS
export const getGraph = id => (dispatch, getState) => {
  axios.get(`/api/graphs/${id}/`, tokenConfig(getState))
    .then(res => {
      dispatch({
        type: GET_GRAPH,
        payload: res.data
      });
    }).catch(err => console.log(err));
}

// CREATE Graph
export const createGraph = graph => (dispatch, getState) => {
  axios.post('/api/graphs/', {...graph, data: JSON.stringify({nodes: [], links: []}),
    visualization: JSON.stringify({node_positions:{}})}, tokenConfig(getState))
    .then(res => {
      dispatch({
        type: CREATE_GRAPH,
        payload: res.data
      });
    }).catch(err => console.log(err));
}

// DELETE Graph
export const deleteGraph = id => (dispatch, getState) => {
  axios.delete(`/api/graphs/${id}`, tokenConfig(getState))
    .then(res => {
      dispatch({
        type: DELETE_GRAPH,
        payload: id
      });
    }).catch(err => console.log(err));
}

// UPDATE Graph
export const updateGraph = graph => (dispatch, getState) => {
  axios.patch(`/api/graphs/${graph.pk}/`, {...graph, data: JSON.stringify(graph.data), visualization: JSON.stringify(graph.visualization)}, tokenConfig(getState))
    .then(res => {
      dispatch({
        type: UPDATE_GRAPH,
        payload: res.data
      });
    }).catch(err => console.log(err));
}

// CREATE Node
export const createNode = node => dispatch => {
  const id = uuid();
  dispatch({
    type: CREATE_NODE,
    payload: {id: id, ...node }
  });
}

// DELETE Node
export const deleteNode = id => dispatch => {
  dispatch({
    type: DELETE_NODE,
    payload: id
  });
}

// UPDATE Node
export const updateNode = node => dispatch => {
  dispatch({
    type: UPDATE_NODE,
    payload: node
  });
}

// CREATE Link
export const createLink = link => dispatch => {
  const id = uuid();
  dispatch({
    type: CREATE_LINK,
    payload: {id: id, ...link }
  });
}

// DELETE Link
export const deleteLink = id => dispatch => {
  dispatch({
    type: DELETE_LINK,
    payload: id
  });
}

// UPDATE Link
export const updateLink = link => dispatch => {
  dispatch({
    type: UPDATE_LINK,
    payload: link
  });
}

// UPDATE Node position
export const updateNodePosition = node_position => dispatch => {
  dispatch({
    type: UPDATE_NODE_POSITION,
    payload: node_position
  });
}

// SET Active element
export const setActiveElement = element => dispatch => {
  dispatch({
    type: SET_ACTIVE_ELEMENT,
    payload: element
  });
}

// SUpdate zoom
export const updateZoom = transform => dispatch => {
  dispatch({
    type: UPDATE_ZOOM,
    payload: transform
  });
}