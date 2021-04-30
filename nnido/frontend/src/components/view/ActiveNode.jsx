import React, { useState } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import PropTypes from 'prop-types';

import { updateNode, deleteNode, selectElements } from '../../actions/graphs';
import { useTextInput, useColorChooser, getSystemProperty } from '../../func';
import EditableProperty from './EditableProperty';
import config from '../../config';

const ActiveNode = ({ node_id }) => {
  const dispatch = useDispatch();

  const node = useSelector((state) => state.graph.graph.data.nodes[node_id]);

  const nodeTypes = useSelector((state) => state.graph.graph.model.node_types);
  const color = useSelector((state) => getSystemProperty(state.graph.graph, node_id, 'color', 'node'), shallowEqual);

  const [newProperty, setNewProperty] = useState('');
  const [name, InputName] = useTextInput(() => {
    dispatch(updateNode({
      id: node_id,
      data: {
        name,
      },
    }));
  }, node.name);
  const [content, InputContent] = useTextInput(() => {
    dispatch(updateNode({
      id: node_id,
      data: {
        content,
      },
    }));
  }, node.content);

  const defaultColor = config.DEFAULT_NODE_COLOR;

  const [selected_color, InputColor] = useColorChooser((selected_color) => {
    dispatch(updateNode({
      id: node_id,
      data: {
        color: selected_color.hex,
      },
    }));
  }, color || defaultColor);

  const onTypeChange = (e) => {
    dispatch(updateNode({
      id: node_id,
      data: {
        type: e.target.value,
      },
    }));
  };
  const addNewProperty = () => {
    setNewProperty('');
    dispatch(updateNode({
      id: node_id,
      data: {
        properties: {
          ...node.properties,
          [newProperty]: '',
        },
      },
    }));
  };

  const onDeleteNode = () => {
    dispatch(deleteNode(node_id));
    dispatch(selectElements({ ids: [], type: 'none' }));
  };

  let specificProperties = node.properties;
  let inheritedProperties = {};
  if (node.type) {
    const typePropertyNames = Object.keys(nodeTypes[node.type].properties);
    inheritedProperties = typePropertyNames.reduce((dict, key) => (dict[key] = node.properties[key] || '', dict), {});
    specificProperties = Object.keys(node.properties).filter((x) => !typePropertyNames.includes(x))
      .reduce((dict, key) => (dict[key] = node.properties[key], dict), {});
  }

  let inheritedPropertiesHtml = '';
  if (Object.keys(inheritedProperties).length > 0) {
    inheritedPropertiesHtml = (
      <>
        <span style={{ fontSize: 'small' }}>Atributos del tipo:</span>
        { Object.keys(inheritedProperties).map((property) => (
          <EditableProperty key={property} name={property} initialValue={inheritedProperties[property]} elementType="node" elementId={node_id} inherited />
        )) }
      </>
    );
  }

  return (
    <>
      <b>Nodo seleccionado</b>
      <br />
      {InputName}
      <br />
      Contenido:
      {InputContent}
      <br />
      Tipo:
      <select name="type" value={node.type} onChange={onTypeChange}>
        <option value=""> -- </option>
        { Object.keys(nodeTypes).map((nodeTypeId) => (
          <option key={nodeTypeId} value={nodeTypeId}>{nodeTypes[nodeTypeId].name}</option>
        ))}
      </select>
      <br />
      {InputColor}
      <br />
      Atributos:
      <br />
      { Object.keys(specificProperties).map((property) => (
        <EditableProperty key={property} name={property} initialValue={specificProperties[property]} elementType="node" elementId={node_id} />
      ))}
      {inheritedPropertiesHtml}
      <div className="comp">
        <input type="text" name="new_property" onChange={(e) => setNewProperty(e.target.value)} value={newProperty} />
        <button type="button" onClick={addNewProperty}>Añadir atributo</button>
        <br />
      </div>
      <button type="button" onClick={onDeleteNode}>Eliminar nodo</button>
    </>
  );
};

ActiveNode.propTypes = {
  node_id: PropTypes.string.isRequired,
};

export default ActiveNode;
