import React, { useState } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import PropTypes from 'prop-types';

import {
  updateNode, updateLink,
  deleteNode, deleteLink,
  updateMultipleNodes, updatePropertyMultipleNodes,
  selectElements,
} from '../../actions/graphs';

import { getUserPropertyMini } from '../../func';
import TextInput from './TextInput';
import DropdownInput from './DropdownInput';
import EditableProperty from './EditableProperty';

const SelectedElement = ({ element_ids, element_type }) => {
  const isNode = element_type.localeCompare('node') === 0;
  // ^ 0 -> link, 1 -> node

  const isMultiple = element_ids.length > 1;
  const firstId = element_ids[0];

  const dispatch = useDispatch();

  const allNodes = useSelector((state) => state.graph.graph.data.nodes);
  const selectedElements = useSelector((state) => (
    isNode ? element_ids.map((node_id) => state.graph.graph.data.nodes[node_id])
      : element_ids.map((link_id) => state.graph.graph.data.links[link_id])
  ), shallowEqual);
  const firstElement = selectedElements[0];
  const types = useSelector((state) => (
    isNode ? state.graph.graph.model.node_types
      : state.graph.graph.model.link_types
  ));

  const updateElement = isNode ? updateNode : updateLink;
  const deleteElement = isNode ? deleteNode : deleteLink;

  const [newProperty, setNewProperty] = useState('');


  const InputType = (
    <DropdownInput
      value={firstElement.type || ''}
      options={
        Object.keys(types).reduce((dict, key) => (dict[key] = types[key].name, dict), {})
      }
      saveFunction={(type) => {
        if (isMultiple) {
          dispatch(updateElement({
            id: firstId,
            data: {
              type,
            },
          }));
        } else {
          dispatch(updateMultipleNodes({
            ids: element_ids,
            data: {
              type,
            },
          }));
        }
      }}
      multipleValues={isMultiple && new Set(selectedElements.map((node) => node.type)).size > 1}
    />
  );

  const addNewProperty = () => {
    setNewProperty('');
    if (isMultiple) {
      dispatch(updatePropertyMultipleNodes({
        ids: element_ids,
        data: {
          properties: {
            [newProperty]: '',
          },
        },
      }));
    } else {
      dispatch(updateElement({
        id: firstId,
        data: {
          properties: {
            ...firstElement.properties,
            [newProperty]: '',
          },
        },
      }));
    }
  };

  const onDelete = () => {
    // TODO: delete multiple elements at the same time
    dispatch(deleteElement(firstId));
    dispatch(selectElements({ ids: [], type: 'none' }));
  };

  let atributesComponent;

  if (isMultiple) {
    const allProperties = new Set(Object.keys(firstElement.properties));
    // ^ names of properties of first element

    if (firstElement.type) {
      allProperties.add(Object.keys(types[firstElement.type].properties));
      // ^ now also including properties inherited by type
    }

    const sharedProperties = [...allProperties].filter(
      (property) => selectedElements.every(
        (node) => Object.keys(node.properties).includes(property)
          || (node.type && Object.keys(types[node.type].properties).includes(property)),
      ),
    );
    // ^ names of properties of first element

    atributesComponent = (
      <>
        Atributos en común:
        <br />
        { sharedProperties.map((property) => (
          <EditableProperty
            key={property}
            name={property}
            initialValue={getUserPropertyMini(types, firstElement, property)}
            elementType="node"
            elementId={firstId}
            updateFunction={(properties) => {
              dispatch(updatePropertyMultipleNodes({
                ids: element_ids,
                data: {
                  properties,
                },
              }));
            }}
            multipleValues={
              new Set(selectedElements.map(
                (element) => getUserPropertyMini(types, element, property),
              )).size > 1
            }
          />
        ))}
      </>
    );
  } else {
    let specificProperties = firstElement.properties;
    let inheritedProperties = {};
    if (firstElement.type) {
      const typePropertyNames = Object.keys(types[firstElement.type].properties);
      inheritedProperties = typePropertyNames.reduce((dict, key) => (dict[key] = firstElement.properties[key] || '', dict), {});
      specificProperties = Object.keys(firstElement.properties)
        .filter((x) => !typePropertyNames.includes(x))
        .reduce((dict, key) => (dict[key] = firstElement.properties[key], dict), {});
    }

    let inheritedPropertiesHtml = '';
    if (Object.keys(inheritedProperties).length > 0) {
      inheritedPropertiesHtml = (
        <>
          <span style={{ fontSize: 'small' }}>Atributos del tipo:</span>
          { Object.keys(inheritedProperties).map((property) => (
            <EditableProperty
              key={property}
              name={property}
              initialValue={inheritedProperties[property]}
              elementType={element_type}
              elementId={firstId}
              inherited
              updateFunction={(properties) => {
                dispatch(updateElement({
                  id: firstId,
                  data: {
                    properties,
                  },
                }));
              }}
            />
          )) }
        </>
      );
    }
    atributesComponent = (
      <>
        Atributos:
        <br />
        { Object.keys(specificProperties).map((property) => (
          <EditableProperty
            key={property}
            name={property}
            initialValue={specificProperties[property]}
            elementType={element_type}
            elementId={firstId}
            updateFunction={(properties) => {
              dispatch(updateElement({
                id: firstId,
                data: {
                  properties,
                },
              }));
            }}
          />
        ))}
        {inheritedPropertiesHtml}
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
  }

  return (
    <>
      <b>
        {isNode ? 'Nodo seleccionado' : 'Enlace seleccionado'}
      </b>
      <br />
      {isNode ? (
        <>
          <TextInput
            initialValue={firstElement.name}
            saveFunction={(name) => {
              if (isMultiple) {
                dispatch(updateMultipleNodes({
                  ids: element_ids,
                  data: {
                    name,
                  },
                }));
              } else {
                dispatch(updateNode({
                  id: firstId,
                  data: {
                    name,
                  },
                }));
              }
            }}
            multipleValues={isMultiple
              && new Set(selectedElements.map((node) => node.name)).size > 1}
          />
          <br />
          Contenido:
          <TextInput
            initialValue={firstElement.content}
            saveFunction={(content) => {
              if (isMultiple) {
                dispatch(updateMultipleNodes({
                  ids: element_ids,
                  data: {
                    content,
                  },
                }));
              } else {
                dispatch(updateNode({
                  id: firstId,
                  data: {
                    content,
                  },
                }));
              }
            }}
            multipleValues={isMultiple
              && new Set(selectedElements.map((node) => node.content)).size > 1}
          />
        </>
      ) : `${allNodes[firstElement.source].name} - ${allNodes[firstElement.target].name}` }
      <br />
      Tipo:
      {InputType}
      <br />
      {atributesComponent}
      <button type="button" onClick={onDelete}>{isNode ? 'Eliminar nodo' : 'Eliminar enlace'}</button>
    </>
  );
};

SelectedElement.propTypes = {
  element_ids: PropTypes.array.isRequired,
  element_type: PropTypes.string.isRequired,
};

export default SelectedElement;
