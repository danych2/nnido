import React, { Fragment, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import { updateType } from '../../actions/graphs';
import { useColorChooser } from '../../func';
import config from '../../config';

const EditType = ({ typeId, element }) => {
  // typeId: ID of the type
  // element: either "node" or "link"

  const dispatch = useDispatch();

  const type = useSelector((state) => {
    if (element.localeCompare('node') === 0) {
      return state.graph.graph.model.node_types[typeId];
    }
    return state.graph.graph.model.link_types[typeId];
  });

  const defaultColor = element.localeCompare('node') === 0 ? config.DEFAULT_NODE_COLOR : config.DEFAULT_LINK_COLOR;

  const [color, InputColor] = useColorChooser((color) => {
    dispatch(updateType({
      element,
      id: typeId,
      data: {
        color: color.hex,
      },
    }));
  }, type.color ? type.color : defaultColor);

  const [newProperty, setNewProperty] = useState('');
  const addProperty = () => {
    dispatch(updateType({
      element,
      id: typeId,
      data: {
        properties: {
          ...type.properties,
          [newProperty]: {},
        },
      },
    }));
    setNewProperty('');
  };

  const onDirectedChange = (e) => {
    dispatch(updateType({
      element,
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
      {element.localeCompare('link') === 0 && (
        <>
          Dirigido
          <input name="directed" type="checkbox" checked={type.directed} onChange={onDirectedChange} />
        </>
      )}
      {InputColor}
      <br />
      Atributos:
      <br />
      { Object.keys(type.properties).map((property) => (
        <div key={property} style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis' }}>{property}</span>
          <div
            className="comp button"
            style={{ minWidth: '1ch' }}
            onClick={() => {
              delete type.properties[property];
              dispatch(updateType({
                element,
                id: typeId,
                data: {
                  properties: {
                    ...type.properties,
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
      <input type="text" onChange={(e) => setNewProperty(e.target.value)} value={newProperty} />
      <button className="button" type="button" onClick={addProperty}>+</button>
      <br />
    </>
  );
};

EditType.propTypes = {
  typeId: PropTypes.string.isRequired,
  element: PropTypes.string.isRequired,
};

export default EditType;
