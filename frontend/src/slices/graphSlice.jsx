import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { v4 as uuid } from 'uuid';

import { tokenConfig } from './authSlice';
import config from '../config';
import { dictFilter } from '../func';

const initialState = {
  graphs: [],
  graph: {},
  selection: { ids: [], type: 'none' },
  selectionAdjacent: { node_ids: [], link_ids: [] },
  error: false,
};

export const getGraphs = createAsyncThunk('graph/getAll', async (_, { getState }) => {
  const res = await axios.get('/api/graphs', tokenConfig(getState));
  return res.data;
});

export const getGraph = createAsyncThunk('graph/get', async (graphId, { getState }) => {
  const res = await axios.get(`/api/graphs/${graphId}`, tokenConfig(getState));
  return res.data;
});

export const createGraph = createAsyncThunk('graph/create', async (graph, { getState }) => {
  const res = await axios.post('/api/graphs', {
    ...graph,
    data: JSON.stringify({ nodes: [], links: [] }),
    visualization: JSON.stringify({
      node_positions: {},
      node_types_filtered: {},
      link_types_filtered: {},
    }),
    model: JSON.stringify({ node_types: {}, link_types: {} }),
    version: config.CURRENT_VERSION,
  }, tokenConfig(getState));
  return res.data;
});

export const deleteGraph = createAsyncThunk('graph/delete', async (id, { getState }) => {
  const res = await axios.delete(`/api/graphs/${id}`, tokenConfig(getState));
  return id;
});

export const updateGraph = createAsyncThunk('graph/update', async (graph, { getState }) => {
  const res = await axios.patch(`/api/graphs/${graph.pk}/`, {
    ...graph,
    data: JSON.stringify(graph.data),
    visualization: JSON.stringify(graph.visualization),
    model: JSON.stringify(graph.model),
  }, tokenConfig(getState));
  return res.data;
});

export const graphSlice = createSlice({
  name: 'graph',
  initialState,
  reducers: {
    createNode: {
      reducer(state, action) {
        const { data, id, position } = action.payload;
        state.graph.data.nodes[id] = {
          name: '',
          content: '',
          type: '',
          attributes: {},
          dims: { width: -1, height: -1 },
          ...data,
        };
        state.graph.data.adjacencylists[id] = {};
        state.graph.visualization.node_positions[id] = position;
      },
      prepare(data) {
        return { payload: { id: uuid(), ...data } };
      },
    },
    deleteNode(state, action) {
      const node_id = action.payload;
      console.log(node_id);
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

      state.graph.data.nodes = Object.fromEntries(
        Object.entries(state.graph.data.nodes).filter(
          ([key]) => key !== node_id,
        ),
      );
      state.graph.data.links = dictFilter(
        state.graph.data.links,
        (link) => link.source !== action.payload && link.target !== action.payload,
      );
      state.graph.data.adjacencylists = newAdjacencylists;
      state.graph.visualization.node_positions = Object.fromEntries(
        Object.entries(state.graph.visualization.node_positions).filter(
          ([key]) => key !== node_id,
        ),
      );
    },
    updateNode(state, action) {
      const { id, data } = action.payload;
      state.graph.data.nodes[id] = {
        ...state.graph.data.nodes[id],
        ...data,
      };
    },
    updateMultipleNodes(state, action) {
      const newNodes = {};
      const { ids, data } = action.payload;
      ids.forEach((id) => {
        newNodes[id] = {
          ...state.graph.data.nodes[id],
          ...data,
        };
      });
      state.graph.data.nodes = { ...state.graph.data.nodes, ...newNodes };
    },
    createLink: {
      reducer(state, action) {
        const { id, ...data } = action.payload;
        const { source, target } = data;
        state.graph.data.links[id] = {
          type: '',
          attributes: {},
          ...data,
        };
        state.graph.data.adjacencylists[source][id] = true;
        state.graph.data.adjacencylists[target][id] = true;
      },
      prepare(data) {
        return { payload: { id: uuid(), ...data } };
      },
    },
    updateLink(state, action) {
      const { id, data } = action.payload;
      state.graph.data.links[id] = {
        ...state.graph.data.links[id],
        ...data,
      };
    },
    deleteLink(state, action) {
      const id = action.payload;
      // ({ [id]: value, ...otherLinks } = state.graph.data.links);
      const { source, target } = state.graph.data.links[id];
      const newAdjacencylists = JSON.parse(JSON.stringify(state.graph.data.adjacencylists));
      delete newAdjacencylists[source][id];
      delete newAdjacencylists[target][id];
      state.graph.data.links = Object.fromEntries(
        Object.entries(state.graph.data.links).filter(
          ([key]) => key !== id,
        ),
      );
      state.graph.data.adjacencylists = newAdjacencylists;
    },
    updateElement(state, action) {
      const { multiple, element_class, ...rest } = action.payload;
      if (element_class.localeCompare('node') === 0) {
        if (multiple) { // Update multiple nodes
          const newNodes = {};
          const { ids, data } = rest;
          ids.forEach((id) => {
            newNodes[id] = {
              ...state.graph.data.nodes[id],
              ...data,
            };
          });
          state.graph.data.nodes = { ...state.graph.data.nodes, ...newNodes };
        } else { // Update node
          const { id, data } = rest;
          state.graph.data.nodes[id] = {
            ...state.graph.data.nodes[id],
            ...data,
          };
        }
      } else { // Update link
        const { id, data } = rest;
        state.graph.data.links[id] = {
          ...state.graph.data.links[id],
          ...data,
        };
      }
    },
    updateNodePosition(state, action) {
      const { id, x, y } = action.payload;
      state.graph.visualization.node_positions[id] = { x, y };
    },
    updateNodesPositions(state, action) {
      state.graph.visualization.node_positions = {
        ...state.graph.visualization.node_positions,
        ...action.payload,
      };
    },
    selectElements(state, action) {
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
      state.selection = action.payload;
      state.selectionAdjacent = selectionAdjacent;
    },
    selectionSwitch(state, action) {
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
      state.selection = newSelection;
      state.selectionAdjacent = selectionAdjacent;
    },
    updateDefault(state, action) {
      const { name, value } = action.payload;
      state[name] = value;
    },
    updateZoom(state, action) {
      state.graph.visualization.zoom = action.payload;
    },
    createNodeType: {
      reducer(state, action) {
        const { id, ...data } = action.payload;
        state.graph.model.node_types[id] = {
          attributes: {},
          ...data,
        };
      },
      prepare(data) {
        return { payload: { id: uuid(), ...data } };
      },
    },
    deleteNodeType(state, action) {
      const node_type_id = action.payload;
      state.graph.model.node_types = Object.fromEntries(
        Object.entries(state.graph.model.node_types).filter(
          ([key]) => key !== node_type_id,
        ),
      );
    },
    createLinkType: {
      reducer(state, action) {
        const { id, ...data } = action.payload;
        state.graph.model.link_types[id] = {
          attributes: {},
          ...data,
        };
      },
      prepare(data) {
        return { payload: { id: uuid(), ...data } };
      },
    },
    deleteLinkType(state, action) {
      const link_type_id = action.payload;
      state.graph.model.link_types = Object.fromEntries(
        Object.entries(state.graph.model.link_types).filter(
          ([key]) => key !== link_type_id,
        ),
      );
    },
    updateType(state, action) {
      const { id, data, element_class } = action.payload;
      if (element_class.localeCompare('node') === 0) {
        state.graph.model.node_types[id] = {
          ...state.graph.model.node_types[id],
          ...data,
        };
      } else {
        state.graph.model.link_types[id] = {
          ...state.graph.model.link_types[id],
          ...data,
        };
      }
    },
    switchTypeFilter(state, action) {
      // payload: {isNode: true|false, id: xxx}
      // 1 if visible (filtered), 0 (or undefined) if visible
      const { isNode, id } = action.payload;
      const classSelector = isNode ? 'node_types_filtered' : 'link_types_filtered';

      const value = state.graph.visualization[classSelector][id];
      state.graph.visualization[classSelector][id] = !value;
    },
    updateAttribute(state, action) {
      // payload: {isNode: true|false, ids: [xxx, yyy, ...],
      //           attribute: attribute_name, value: attribute_value }
      const {
        isNode, ids, attribute, value,
      } = action.payload;
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
      state.graph.data[classSelector] = { ...state.graph.data[classSelector], ...updatedElements };
    },
    deleteAttribute(state, action) {
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
      state.graph.data[classSelector] = { ...state.graph.data[classSelector], ...updatedElements };
    },
    updateProperty(state, action) {
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
      state.graph[mainSelector][classSelector] = {
        ...state.graph[mainSelector][classSelector],
        ...updatedObjects,
      };
    },
    deleteProperty(state, action) {
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
      state.graph[mainSelector][classSelector] = {
        ...state.graph[mainSelector][classSelector],
        ...updatedObjects,
      };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getGraphs.fulfilled, (state, action) => {
      state.graphs = action.payload;
    })
      .addCase(getGraph.fulfilled, (state, action) => {
        const { version } = action.payload;
        let data = JSON.parse(action.payload.data);
        const visualization = JSON.parse(action.payload.visualization);
        const model = JSON.parse(action.payload.model);
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
        state.graph = {
          ...action.payload,
          data,
          visualization,
          model,
          version: config.CURRENT_VERSION,
        };
      })
      .addCase(createGraph.fulfilled, (state, action) => {
        state.graphs.push(action.payload);
      })
      .addCase(deleteGraph.fulfilled, (state, action) => {
        state.graphs = state.graphs.filter((graph) => graph.pk !== action.payload);
      })
      .addMatcher(
        (action) => action.type.endsWith('/fulfilled'),
        (state) => {
          state.error = false;
        },
      )
      .addMatcher(
        (action) => action.type.endsWith('/rejected'),
        (state, action) => {
          console.log(action.error.message);
          state.error = true;
        },
      );
  },
});

export const {
  createNode, deleteNode, updateNode, updateMultipleNodes,
  createLink, updateLink, deleteLink, updateElement,
  updateNodePosition, updateNodesPositions,
  selectElements, selectionSwitch, updateDefault, updateZoom,
  createNodeType, deleteNodeType, createLinkType, deleteLinkType,
  updateType, switchTypeFilter, updateAttribute, deleteAttribute,
  updateProperty, deleteProperty,
} = graphSlice.actions;

export default graphSlice.reducer;
