import React, { Fragment, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import { updateType } from '../../slices/graphSlice';
import ColorInput from './ColorInput';
import config from '../../config';
import properties from '../../properties';
import PropertyRow from './PropertyRow';

const EditType = ({ typeId, element_class }) => {
  // typeId: ID of the type
  // element: either "node" or "link"

  const dispatch = useDispatch();
  const isNode = element_class.localeCompare('node') === 0;

  const type = useSelector((state) => {
    if (isNode) {
      return state.graph.graph.model.node_types[typeId];
    }
    return state.graph.graph.model.link_types[typeId];
  });

  const defaultColor = isNode ? config.DEFAULT_NODE_COLOR : config.DEFAULT_LINK_COLOR;
  const colorindex = isNode ? 'color_node' : 'color_link';
  const typecolor = type[colorindex] || defaultColor;

  const systemProperties = [];
  Object.entries(properties).forEach(([key, property]) => {
    if (property.active && !property.individualProperty
      && (isNode ? property.nodeProperty : property.linkProperty)) {
      const Input = (
        <PropertyRow
          key={key}
          property_id={key}
          element_class={element_class}
          element_ids={[typeId]}
          selectedElements={[type]}
          is_type
          isActive={key in type}
        />
      );
      systemProperties.push(Input);
    }
  });

  const [newAttribute, setNewAttribute] = useState('');
  const addAttribute = () => {
    dispatch(updateType({
      element_class,
      id: typeId,
      data: {
        attributes: {
          ...type.attributes,
          [newAttribute]: {},
        },
      },
    }));
    setNewAttribute('');
  };

  return (
    <>
      <span style={{ fontSize: 'x-small' }}>{typeId}</span>
      <br />
      {systemProperties}
      <br />
      Atributos:
      <br />
      { Object.keys(type.attributes).map((attribute) => (
        <div key={attribute} style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis' }}>{attribute}</span>
          <div
            className="comp button"
            style={{ minWidth: '1ch' }}
            onClick={() => {
              delete type.attributes[attribute];
              dispatch(updateType({
                element_class,
                id: typeId,
                data: {
                  attributes: {
                    ...type.attributes,
                  },
                },
              }));
            }}
          >
            X
          </div>
          <br />
        </div>
      ))}
      <input type="text" onChange={(e) => setNewAttribute(e.target.value)} value={newAttribute} style={{ width: '80%' }} />
      <button className="button" type="button" onClick={addAttribute}>+</button>
      <br />
    </>
  );
};

EditType.propTypes = {
  typeId: PropTypes.string.isRequired,
  element_class: PropTypes.string.isRequired,
};

export default EditType;
