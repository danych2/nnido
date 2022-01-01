import React, { Fragment, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import { updateType } from '../../actions/graphs';
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
    if (property.active && (isNode ? property.nodeProperty : property.linkProperty)) {
      const Input = (
        <PropertyRow
          key={key}
          property_id={key}
          element_class={element_class}
          element_ids={[typeId]}
          selectedElements={[type]}
          is_type
        />
      );
      systemProperties.push(Input);
    }
  });

  const InputColor = (
    <ColorInput
      initialValue={typecolor}
      saveFunction={(color) => {
        dispatch(updateType({
          element_class,
          id: typeId,
          data: isNode ? { color_node: color.hex } : { color_link: color.hex },
        }));
      }}
    />
  );

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

  const onDirectedChange = (e) => {
    dispatch(updateType({
      element_class,
      id: typeId,
      data: {
        directed: e.target.checked,
      },
    }));
  };

  return (
    <>
      <span style={{ fontSize: 'x-small' }}>{typeId}</span>
      <br />
      {element_class.localeCompare('link') === 0 && (
        <>
          <span>Dirigido: </span>
          <input name="directed" type="checkbox" checked={type.directed} onChange={onDirectedChange} style={{ cursor: 'pointer' }} />
          <br />
        </>
      )}
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
      <input type="text" onChange={(e) => setNewAttribute(e.target.value)} value={newAttribute} />
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
