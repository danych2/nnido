import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';

import { updateNode } from '../../actions/graphs';
import { useTextInput } from '../../func';
import EditableProperty from './EditableProperty';

const ActiveNode = ({ node_id }) => {
  const dispatch = useDispatch();

  const node = useSelector((state) => state.graph.graph.data.nodes[node_id]);

  const nodeTypes = useSelector((state) => state.graph.graph.model.node_types);

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

  let propertiesToShow = node.properties;
  if (node.type) {
    const typePropertyNames = Object.keys(nodeTypes[node.type].properties);
    propertiesToShow = {
      ...propertiesToShow,
      ...typePropertyNames.reduce((dict, key) => (dict[key] = '', dict), {}),
    };
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
      Propiedades:
      <br />
      { Object.keys(propertiesToShow).map((property) => (
        <EditableProperty key={property} name={property} initialValue={propertiesToShow[property]} elementType="node" elementId={node_id} />
      ))}
      <div className="comp">
        <input type="text" name="new_property" onChange={(e) => setNewProperty(e.target.value)} value={newProperty} />
        <button type="button" onClick={addNewProperty}>Añadir propiedad</button>
        <br />
      </div>
    </>
  );
};

ActiveNode.propTypes = {
  node_id: PropTypes.string.isRequired,
};

export default ActiveNode;
