import React, { Fragment, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { FaPlus, FaTimes } from 'react-icons/fa';

import { updateType } from '../../slices/graphSlice';
import ColorInput from './ColorInput';
import config from '../../config';
import properties from '../../properties';
import PropertyRow from './PropertyRow';

import { dictKeyFilter } from '../../func';

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
    if (newAttribute === '') return;
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
    <div style={{ display: 'grid', gridTemplateColumns: '3fr 3fr 1fr', alignContent: 'center' }}>
      {systemProperties}
      <div style={{ gridColumn: '1 / -1' }}><hr /></div>
      <div style={{ gridColumn: '1 / 3' }}>Atributos:</div>
      { Object.keys(type.attributes).map((attribute) => (
        <Fragment key={attribute}>
          <span
            style={{
              gridColumn: '1 / 3', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis',
            }}
          >
            {attribute}
          </span>
          <div style={{ gridColumn: '3 / 4', display: 'flex', justifyContent: 'center' }}>
            <button
              className="small_button"
              type="button"
              onClick={() => {
                dispatch(updateType({
                  element_class,
                  id: typeId,
                  data: {
                    attributes: {
                      ...dictKeyFilter(type.attributes, (key) => key !== attribute),
                    },
                  },
                }));
              }}
            >
              <FaTimes />
            </button>
          </div>
        </Fragment>
      ))}
      <input type="text" onChange={(e) => setNewAttribute(e.target.value)} value={newAttribute} style={{ gridColumn: '1 / 3' }} />
      <button className="small_button" type="button" onClick={addAttribute}><FaPlus /></button>
    </div>
  );
};

EditType.propTypes = {
  typeId: PropTypes.string.isRequired,
  element_class: PropTypes.string.isRequired,
};

export default EditType;
