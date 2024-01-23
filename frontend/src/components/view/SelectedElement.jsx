import React, { useState } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import PropTypes from 'prop-types';
import { FaPlus } from 'react-icons/fa';

import {
  updateElement,
  deleteNode, deleteLink, updateNode,
  updateMultipleNodes, updateAttribute, deleteAttribute,
  selectElements,
} from '../../slices/graphSlice';

import { getAttributeMini } from '../../func';
import properties from '../../properties';
import TextInput from './TextInput';
import DropdownInput from './DropdownInput';
import EditableAttribute from './EditableAttribute';
import PropertyRow from './PropertyRow';

const SelectedElement = ({ element_ids, element_class }) => {
  const isNode = element_class.localeCompare('node') === 0;
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

  const deleteElement = isNode ? deleteNode : deleteLink;

  const [newAttribute, setNewAttribute] = useState('');

  const InputType = (
    <DropdownInput
      initialValue={firstElement.type || ''}
      options={{
        '': '--',
        ...Object.keys(types).reduce((dict, key) => (dict[key] = types[key].name, dict), {}),
      }}
      saveFunction={(type) => {
        dispatch(updateElement({
          element_class,
          multiple: isMultiple,
          id: firstId,
          ids: element_ids,
          data: {
            type,
          },
        }));
      }}
      multipleValues={isMultiple && new Set(selectedElements.map((node) => node.type)).size > 1}
      isActive={false}
    />
  );

  const systemActiveProperties = [];
  const systemInactiveProperties = [];
  Object.entries(properties).forEach(([key, property]) => {
    if (property.active && (isNode ? property.nodeProperty : property.linkProperty)) {
      const active = key in firstElement;
      const Input = (
        <PropertyRow
          key={key}
          property_id={key}
          element_class={element_class}
          element_ids={element_ids}
          selectedElements={selectedElements}
          is_type={false}
          isActive={active}
        />
      );
      if (active) systemActiveProperties.push(Input);
      else systemInactiveProperties.push(Input);
    }
  });

  const addNewAttribute = () => {
    setNewAttribute('');
    dispatch(updateAttribute({
      isNode,
      ids: element_ids,
      attribute: newAttribute,
      value: '',
    }));
  };

  const onDelete = () => {
    // TODO: delete multiple elements at the same time
    dispatch(deleteElement(firstId));
    dispatch(selectElements({ ids: [], type: 'none' }));
  };

  let atributesComponent;

  if (isMultiple) {
    const allAttributes = new Set(Object.keys(firstElement.attributes));
    // ^ names of attributes of first element

    if (firstElement.type) {
      allAttributes.add(Object.keys(types[firstElement.type].attributes));
      // ^ now also including attributes inherited by type
    }

    const sharedAttributes = [...allAttributes].filter(
      (attribute) => selectedElements.every(
        (node) => Object.keys(node.attributes).includes(attribute)
          || (node.type && Object.keys(types[node.type].attributes).includes(attribute)),
      ),
    );
    // ^ names of attributes of first element

    atributesComponent = (
      <>
        Atributos en común:
        <br />
        { sharedAttributes.map((attribute) => (
          <EditableAttribute
            key={attribute}
            name={attribute}
            initialValue={getAttributeMini(types, firstElement, attribute)}
            elementClass="node"
            elementId={firstId}
            updateFunction={(attributeValue) => {
              dispatch(updateAttribute({
                isNode,
                ids: element_ids,
                attribute,
                value: attributeValue,
              }));
            }}
            deleteFunction={() => {
              dispatch(deleteAttribute({
                isNode,
                ids: element_ids,
                attribute,
              }));
            }}
            multipleValues={
              new Set(selectedElements.map(
                (element) => getAttributeMini(types, element, attribute),
              )).size > 1
            }
          />
        ))}
      </>
    );
  } else {
    let specificAttributes = firstElement.attributes;
    let inheritedAttributes = {};
    if (firstElement.type) {
      const typeAttributeNames = Object.keys(types[firstElement.type].attributes);
      inheritedAttributes = typeAttributeNames.reduce((dict, key) => (dict[key] = firstElement.attributes[key] || '', dict), {});
      specificAttributes = Object.keys(firstElement.attributes)
        .filter((x) => !typeAttributeNames.includes(x))
        .reduce((dict, key) => (dict[key] = firstElement.attributes[key], dict), {});
    }

    let inheritedAttributesHtml = '';
    if (Object.keys(inheritedAttributes).length > 0) {
      inheritedAttributesHtml = (
        <>
          <div style={{ gridColumn: '1 / -1', fontSize: 'small' }}>Atributos del tipo:</div>
          { Object.keys(inheritedAttributes).map((attribute) => (
            <EditableAttribute
              key={attribute}
              name={attribute}
              initialValue={inheritedAttributes[attribute]}
              elementClass={element_class}
              elementId={firstId}
              inherited
              updateFunction={(attributeValue) => {
                dispatch(updateAttribute({
                  isNode,
                  ids: element_ids,
                  attribute,
                  value: attributeValue,
                }));
              }}
            />
          )) }
        </>
      );
    }
    atributesComponent = (
      <>
        <div style={{ gridColumn: '1 / -1' }}>
          Atributos:
        </div>
        { Object.keys(specificAttributes).map((attribute) => (
          <EditableAttribute
            key={attribute}
            name={attribute}
            initialValue={specificAttributes[attribute]}
            elementClass={element_class}
            elementId={firstId}
            updateFunction={(attributeValue) => {
              dispatch(updateAttribute({
                isNode,
                ids: element_ids,
                attribute,
                value: attributeValue,
              }));
            }}
            deleteFunction={() => {
              dispatch(deleteAttribute({
                isNode,
                ids: element_ids,
                attribute,
              }));
            }}
          />
        ))}
        {inheritedAttributesHtml}
        <div className="comp" style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'center' }}>
          <input
            type="text"
            name="new_attribute"
            onKeyUp={(e) => {
              if (e.keyCode === 13) {
                addNewAttribute();
              }
            }}
            onChange={(e) => setNewAttribute(e.target.value)}
            value={newAttribute}
            style={{ flexGrow: 1 }}
          />
          <button type="button" className="small_button" onClick={addNewAttribute}><FaPlus /></button>
        </div>
      </>
    );
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '3fr 3fr 1fr', alignContent: 'center' }}>
      <div style={{ gridColumn: '1 / -1' }}>
        <b>{isNode ? 'Nodo seleccionado' : 'Enlace seleccionado'}</b>
      </div>
      {isNode ? (
        <>
          <div style={{ gridColumn: '1 / 4' }}>
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
          </div>
          <div style={{ gridColumn: '1 / 4' }}>
            Contenido:
          </div>
          <div style={{ gridColumn: '1 / 4' }}>
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
          </div>
        </>
      ) : `${allNodes[firstElement.source].name} - ${allNodes[firstElement.target].name}` }
      <div style={{ gridColumn: '1' }}>
        Tipo:
      </div>
      <div style={{ gridColumn: '2 / 3' }}>
        {InputType}
      </div>
      {systemActiveProperties}
      {systemInactiveProperties}
      {atributesComponent}
      <div style={{ gridColumn: '1 / -1' }}>
        <button type="button" onClick={onDelete}>{isNode ? 'Eliminar nodo' : 'Eliminar enlace'}</button>
      </div>
    </div>
  );
};

SelectedElement.propTypes = {
  element_ids: PropTypes.array.isRequired,
  element_class: PropTypes.string.isRequired,
};

export default SelectedElement;
