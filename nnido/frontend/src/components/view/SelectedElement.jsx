import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';

import {
  updateNode, updateLink,
  deleteNode, deleteLink,
  selectElements,
} from '../../actions/graphs';

import TextInput from './TextInput';
import DropdownInput from './DropdownInput';
import EditableProperty from './EditableProperty';

const SelectedElement = ({ element_id, element_type }) => {
  const isNode = element_type.localeCompare('node') === 0;
  // ^ 0 -> link, 1 -> node

  const element = useSelector((state) => (
    isNode ? state.graph.graph.data.nodes[element_id]
      : state.graph.graph.data.links[element_id]
  ));

  const dispatch = useDispatch();

  const nodes = useSelector((state) => state.graph.graph.data.nodes);
  const types = useSelector((state) => (
    isNode ? state.graph.graph.model.node_types
      : state.graph.graph.model.link_types
  ));

  const updateElement = isNode ? updateNode : updateLink;
  const deleteElement = isNode ? deleteNode : deleteLink;

  const [newProperty, setNewProperty] = useState('');


  const InputType = (
    <DropdownInput
      value={element.type || ''}
      options={
        Object.keys(types).reduce((dict, key) => (dict[key] = types[key].name, dict), {})
      }
      saveFunction={(type) => {
        dispatch(updateElement({
          id: element_id,
          data: {
            type,
          },
        }));
      }}
    />
  );

  const addNewProperty = () => {
    setNewProperty('');
    dispatch(updateElement({
      id: element_id,
      data: {
        properties: {
          ...element.properties,
          [newProperty]: '',
        },
      },
    }));
  };

  const onDelete = () => {
    dispatch(deleteElement(element_id));
    dispatch(selectElements({ ids: [], type: 'none' }));
  };

  let specificProperties = element.properties;
  let inheritedProperties = {};
  if (element.type) {
    const typePropertyNames = Object.keys(types[element.type].properties);
    inheritedProperties = typePropertyNames.reduce((dict, key) => (dict[key] = element.properties[key] || '', dict), {});
    specificProperties = Object.keys(element.properties)
      .filter((x) => !typePropertyNames.includes(x))
      .reduce((dict, key) => (dict[key] = element.properties[key], dict), {});
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
            elementId={element_id}
            inherited
            updateFunction={(properties) => {
              dispatch(updateElement({
                id: element_id,
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

  return (
    <>
      <b>
        {isNode ? 'Nodo seleccionado' : 'Enlace seleccionado'}
      </b>
      <br />
      {isNode ? (
        <>
          <TextInput
            initialValue={element.name}
            saveFunction={(name) => {
              dispatch(updateNode({
                id: element_id,
                data: {
                  name,
                },
              }));
            }}
          />
          <br />
          Contenido:
          <TextInput
            initialValue={element.content}
            saveFunction={(content) => {
              dispatch(updateNode({
                id: element_id,
                data: {
                  content,
                },
              }));
            }}
          />
        </>
      ) : `${nodes[element.source].name} - ${nodes[element.target].name}` }
      <br />
      Tipo:
      {InputType}
      <br />
      Atributos:
      <br />
      { Object.keys(specificProperties).map((property) => (
        <EditableProperty
          key={property}
          name={property}
          initialValue={specificProperties[property]}
          elementType={element_type}
          elementId={element_id}
          updateFunction={(properties) => {
            dispatch(updateElement({
              id: element_id,
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
      <button type="button" onClick={onDelete}>{isNode ? 'Eliminar nodo' : 'Eliminar enlace'}</button>
    </>
  );
};

SelectedElement.propTypes = {
  element_id: PropTypes.string.isRequired,
  element_type: PropTypes.string.isRequired,
};

export default SelectedElement;
