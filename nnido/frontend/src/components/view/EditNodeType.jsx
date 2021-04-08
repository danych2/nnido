import React, { Fragment, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import { updateNodeType } from '../../actions/graphs';
import { useColorChooser } from '../../func';
import config from '../../config';

const EditNodeType = ({ nodeTypeId }) => {
  const dispatch = useDispatch();

  const nodeType = useSelector((state) => state.graph.graph.model.node_types[nodeTypeId]);

  const [color, InputColor] = useColorChooser((color) => {
    dispatch(updateNodeType({
      id: nodeTypeId,
      data: {
        color: color.hex,
      },
    }));
  }, nodeType.color ? nodeType.color : config.DEFAULT_NODE_COLOR);

  const [newProperty, setNewProperty] = useState('');
  const addProperty = () => {
    dispatch(updateNodeType({
      id: nodeTypeId,
      data: {
        properties: {
          ...nodeType.properties,
          [newProperty]: {},
        },
      },
    }));
    setNewProperty('');
  };

  return (
    <>
      <span style={{ fontSize: 'x-small' }}>{nodeTypeId}</span>
      <br />
      {InputColor}
      <br />
      Atributos:
      <br />
      { Object.keys(nodeType.properties).map((property) => (
        <Fragment key={property}>
          <span>{property}</span>
          <br />
        </Fragment>
      ))}
      <input type="text" onChange={(e) => setNewProperty(e.target.value)} value={newProperty} />
      <button type="button" onClick={addProperty}>Añadir atributo</button>
      <br />
    </>
  );
};

EditNodeType.propTypes = {
  nodeTypeId: PropTypes.string.isRequired,
};

export default EditNodeType;
