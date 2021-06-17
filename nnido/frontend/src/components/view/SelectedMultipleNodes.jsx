import React, { useState } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import PropTypes from 'prop-types';

import { updateMultipleNodes, updatePropertyMultipleNodes } from '../../actions/graphs';
import { useColorChooser, getUserPropertyMini } from '../../func';
import TextInput from './TextInput';
import DropdownInput from './DropdownInput';
import EditableProperty from './EditableProperty';
import config from '../../config';

const SelectedMultipleNodes = ({ node_ids }) => {
  const dispatch = useDispatch();

  const nodes = useSelector(
    (state) => node_ids.map((node_id) => state.graph.graph.data.nodes[node_id]),
    shallowEqual,
  );

  const nodeTypes = useSelector((state) => state.graph.graph.model.node_types);

  const [newProperty, setNewProperty] = useState('');
  const InputName = (
    <TextInput
      initialValue={nodes[0].name}
      saveFunction={(name) => {
        dispatch(updateMultipleNodes({
          ids: node_ids,
          data: {
            name,
          },
        }));
      }}
      multipleValues={new Set(nodes.map((node) => node.name)).size > 1}
    />
  );
  const InputContent = (
    <TextInput
      initialValue={nodes[0].content}
      saveFunction={(content) => {
        dispatch(updateMultipleNodes({
          ids: node_ids,
          data: {
            content,
          },
        }));
      }}
      multipleValues={new Set(nodes.map((node) => node.content)).size > 1}
    />
  );

  const InputType = (
    <DropdownInput
      value={nodes[0].type || ''}
      options={
        Object.keys(nodeTypes).reduce((dict, key) => (dict[key] = nodeTypes[key].name, dict), {})
      }
      saveFunction={(type) => {
        dispatch(updateMultipleNodes({
          ids: node_ids,
          data: {
            type,
          },
        }));
      }}
      multipleValues={new Set(nodes.map((node) => node.type)).size > 1}
    />
  );

  const defaultColor = config.DEFAULT_NODE_COLOR;

  const addNewProperty = () => {
    setNewProperty('');
    dispatch(updatePropertyMultipleNodes({
      ids: node_ids,
      data: {
        properties: {
          [newProperty]: '',
        },
      },
    }));
  };

  const allProperties = new Set(Object.keys(nodes[0].properties));
  // ^ names of properties of first element

  if (nodes[0].type) {
    allProperties.add(Object.keys(nodeTypes[nodes[0].type].properties));
    // ^ now also including properties inherited by type
  }

  const sharedProperties = [...allProperties].filter(
    (property) => nodes.every(
      (node) => Object.keys(node.properties).includes(property)
        || (node.type && Object.keys(nodeTypes[node.type].properties).includes(property)),
    ),
  );
  // ^ names of properties of first element

  return (
    <>
      <b>Múltiples nodos seleccionados</b>
      <br />
      {InputName}
      <br />
      Contenido:
      {InputContent}
      <br />
      Tipo:
      {InputType}
      <br />
      Atributos en común:
      <br />
      { sharedProperties.map((property) => (
        <EditableProperty
          key={property}
          name={property}
          initialValue={getUserPropertyMini(nodeTypes, nodes[0], property)}
          elementType="node"
          elementId={node_ids[0]}
          updateFunction={(properties) => {
            dispatch(updatePropertyMultipleNodes({
              ids: node_ids,
              data: {
                properties,
              },
            }));
          }}
          multipleValues={
            new Set(nodes.map((node) => getUserPropertyMini(nodeTypes, node, property))).size > 1
          }
        />
      ))}
      <div className="comp" style={{ display: 'flex', alignItems: 'center' }}>
        <input
          type="text"
          name="new_property"
          onKeyUp={(e) => {
            if (e.keyCode === 13) {
              addNewProperty();
            }
          }}
          onChange={(e) => setNewProperty(e.target.value)}
          value={newProperty}
          style={{ flexGrow: 1 }}
        />
        <div className="comp" onClick={addNewProperty} style={{ minWidth: '1ch' }}>+</div>
      </div>
    </>
  );
};

SelectedMultipleNodes.propTypes = {
  node_ids: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default SelectedMultipleNodes;
